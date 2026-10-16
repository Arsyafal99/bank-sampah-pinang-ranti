import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import Header from './components/Header';
import Informasi from './components/Informasi';
import FormInput from './components/FormInput';
import Grafik from './components/Grafik';
import Footer from './components/Footer';
import TabelData from './components/TabelData';
import InfoBankSampah from './components/InfoBankSampah';
import './index.css';

// URL backend harus diatur melalui .env.local.
// Gunakan URL deployment Apps Script khusus PENGUJIAN,
// bukan URL backend produksi, selama aplikasi masih di localhost.
const WEB_APP_URL = String(
  import.meta.env.VITE_WEB_APP_URL || ''
).trim();

function pastikanBackendTerkonfigurasi() {
  if (!WEB_APP_URL) {
    throw new Error(
      'URL backend pengujian belum diatur. Tambahkan VITE_WEB_APP_URL pada file .env.local, lalu restart server lokal.'
    );
  }
}

const DURASI_SESI = 30 * 60 * 1000;
const JEDA_REFRESH_SESI = 4 * 60 * 1000;

const NAMA_BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const BULAN_SINGKAT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Ags',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

const DAFTAR_RW = [
  'RW 01',
  'RW 02',
  'RW 03',
  'RW 04',
  'RW 05',
];

const WARNA_RW = [
  '#0f766e',
  '#2563eb',
  '#d97706',
  '#7c3aed',
  '#0891b2',
];

const GAYA_TOMBOL = {
  border: 'none',
  borderRadius: '10px',
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'background .2s ease',
};

// ======================================================
// UTILITAS
// ======================================================

function buatFormAwal() {
  const sekarang = new Date();

  return {
    bulan: NAMA_BULAN[sekarang.getMonth()],
    tahun: String(sekarang.getFullYear()),
    rw: '',
    plastik: '',
    kertas: '',
    logam: '',
    kaca: '',
  };
}

function ambilClientId() {
  const KUNCI = 'bankSampahClientId';

  try {
    const tersimpan = window.localStorage.getItem(KUNCI);

    if (tersimpan) return tersimpan;

    const baru =
      window.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;

    window.localStorage.setItem(KUNCI, baru);

    return baru;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  }
}

function ambilNilai(item, kolom) {
  for (const nama of kolom) {
    const nilai = item?.[nama];

    if (
      nilai !== undefined &&
      nilai !== null &&
      nilai !== ''
    ) {
      return nilai;
    }
  }

  return '';
}

function ambilNamaRW(item) {
  const nilai = String(
    ambilNilai(item, [
      'rw',
      'RW',
      'Wilayah',
      'wilayah',
      'Nomor_RW',
      'nomor_rw',
      'Nomor RW',
    ])
  )
    .trim()
    .toUpperCase()
    .replace(/[_\s]+/g, ' ');

  const cocok =
    nilai.match(/(?:^|\s)RW\s*0?([1-5])$/) ||
    nilai.match(/^0?([1-5])$/);

  return cocok
    ? `RW ${cocok[1].padStart(2, '0')}`
    : nilai;
}

function ambilIndeksBulan(nilaiBulan) {
  const nilai = String(nilaiBulan ?? '')
    .trim()
    .toLowerCase();

  if (!nilai) return -1;

  if (/^\d{1,2}$/.test(nilai)) {
    const angka = Number(nilai);

    return angka >= 1 && angka <= 12
      ? angka - 1
      : -1;
  }

  return NAMA_BULAN.findIndex(
    (bulan) => bulan.toLowerCase() === nilai
  );
}

function ambilTahun(item) {
  const nilai = String(
    ambilNilai(item, ['tahun', 'Tahun'])
  ).trim();

  const cocok = nilai.match(
    /(?:^|\D)(20\d{2})(?:\D|$)/
  );

  return cocok ? cocok[1] : nilai;
}

function angkaAman(nilai) {
  if (
    nilai === undefined ||
    nilai === null ||
    nilai === ''
  ) {
    return 0;
  }

  const angka = Number(nilai);

  return Number.isFinite(angka) ? angka : 0;
}

function ambilTotalBerat(item) {
  const nilaiTotal = ambilNilai(item, [
    'total',
    'Total',
    'total_berat',
    'Total_Berat',
    'TotalBerat',
  ]);

  if (nilaiTotal !== '') {
    return angkaAman(nilaiTotal);
  }

  return (
    angkaAman(ambilNilai(item, ['plastik', 'Plastik'])) +
    angkaAman(ambilNilai(item, ['kertas', 'Kertas'])) +
    angkaAman(ambilNilai(item, ['logam', 'Logam'])) +
    angkaAman(ambilNilai(item, ['kaca', 'Kaca']))
  );
}

function formatBerat(nilai) {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
  }).format(angkaAman(nilai));
}

async function kirimPermintaan(body) {
  pastikanBackendTerkonfigurasi();

  const response = await fetch(WEB_APP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(body),
  });

  let hasil;

  try {
    hasil = await response.json();
  } catch {
    throw new Error(
      'Respons server tidak dapat dibaca.'
    );
  }

  if (!response.ok) {
    throw new Error(
      hasil?.message ||
      'Permintaan ke server gagal.'
    );
  }

  return hasil;
}

function bacaDaftarData(hasil) {
  if (Array.isArray(hasil)) {
    return hasil;
  }

  if (hasil?.status === 'error') {
    throw new Error(
      hasil.message ||
      'Server mengembalikan kesalahan.'
    );
  }

  if (Array.isArray(hasil?.data)) {
    return hasil.data;
  }

  throw new Error(
    'Format data dari server tidak sesuai.'
  );
}

// ======================================================
// KOMPONEN APP
// ======================================================

function App() {
  const sekarang = new Date();
  const tahunSekarang = String(sekarang.getFullYear());
  const bulanSekarang = sekarang.getMonth();

  const [tabPublik, setTabPublik] =
    useState('dashboard');

  const [halamanInternal, setHalamanInternal] =
    useState('beranda');

  const [modalPINTerbuka, setModalPINTerbuka] =
    useState(false);

  const [pin, setPin] = useState('');
  const [tampilkanPIN, setTampilkanPIN] = useState(false);
  const [sedangLogin, setSedangLogin] = useState(false);
  const [pesanPIN, setPesanPIN] = useState('');

  const [clientId] = useState(ambilClientId);
  const [sesi, setSesi] = useState(null);

  const [dataPublik, setDataPublik] = useState([]);
  const [dataInternal, setDataInternal] = useState([]);

  // Data untuk menu rekap baca-saja.
  const [dataRekapRW, setDataRekapRW] = useState([]);
  const [rwRekap, setRwRekap] = useState('');
  const [tahunRekap, setTahunRekap] =
    useState(tahunSekarang);

  const [sedangMemuatRekap, setSedangMemuatRekap] =
    useState(false);

  const [pesanRekap, setPesanRekap] = useState('');

  const [sedangMemuatPublik, setSedangMemuatPublik] =
    useState(true);

  const [sedangMemuatInternal, setSedangMemuatInternal] =
    useState(false);

  const [pesanKesalahan, setPesanKesalahan] =
    useState('');

  const [pesanInput, setPesanInput] = useState('');
  const [pesanDuplikat, setPesanDuplikat] =
    useState('');

  const [formData, setFormData] =
    useState(buatFormAwal);

  const [sedangMengirim, setSedangMengirim] =
    useState(false);

  const [konfirmasiSimpan, setKonfirmasiSimpan] =
    useState(null);

  const [hasilTerakhir, setHasilTerakhir] =
    useState(null);

  const pengirimanAktif = useRef(false);
  const timerSesi = useRef(null);
  const terakhirRefreshSesi = useRef(0);

  const [bulanGrafik, setBulanGrafik] =
    useState(bulanSekarang);

  const [tahunGrafik, setTahunGrafik] =
    useState(tahunSekarang);

  const [tahunTren, setTahunTren] =
    useState(tahunSekarang);

  const tokenSesi = sesi?.token || '';
  const isKaryawan = sesi?.role === 'staff';

  const namaPeran = isKaryawan
    ? 'ADMIN'
    : '';

  // ====================================================
  // DASHBOARD PUBLIK
  // ====================================================

  const muatDataPublik = useCallback(async () => {
    setSedangMemuatPublik(true);
    setPesanKesalahan('');

    try {
      pastikanBackendTerkonfigurasi();

      const response = await fetch(
        `${WEB_APP_URL}?view=public&_=${Date.now()}`,
        { cache: 'no-store' }
      );

      if (!response.ok) {
        throw new Error(
          'Server tidak dapat mengambil data.'
        );
      }

      const hasil = await response.json();
      const data = bacaDaftarData(hasil);

      setDataPublik(data);

      return true;
    } catch (error) {
      console.error(
        'Gagal memuat dashboard publik:',
        error
      );

      setPesanKesalahan(
        !WEB_APP_URL
          ? 'URL backend pengujian belum diatur. Tambahkan VITE_WEB_APP_URL pada file .env.local, lalu restart server lokal.'
          : 'Data dashboard belum dapat dimuat. Silakan coba kembali.'
      );

      return false;
    } finally {
      setSedangMemuatPublik(false);
    }
  }, []);

  useEffect(() => {
    muatDataPublik();
  }, [muatDataPublik]);

  // ====================================================
  // DATA INTERNAL ADMIN
  // ====================================================

  const muatDataInternal = useCallback(
    async (token) => {
      if (!token) {
        setDataInternal([]);
        return false;
      }

      setSedangMemuatInternal(true);

      try {
        const hasil = await kirimPermintaan({
          action: 'listInternal',
          token,
        });

        const data = bacaDaftarData(hasil);

        setDataInternal(data);

        return true;
      } catch (error) {
        console.error(
          'Gagal memuat data internal:',
          error
        );

        setPesanInput(
          error.message ||
          'Data internal tidak dapat dimuat. Silakan coba kembali.'
        );

        return false;
      } finally {
        setSedangMemuatInternal(false);
      }
    },
    []
  );

  useEffect(() => {
    if (tokenSesi && isKaryawan) {
      muatDataInternal(tokenSesi);
    } else {
      setDataInternal([]);
    }
  }, [
    tokenSesi,
    isKaryawan,
    muatDataInternal,
  ]);

  // ====================================================
  // REKAP RW BACA-SAJA
  // ====================================================

  const muatRekapRW = useCallback(
    async (token) => {
      if (!token) {
        setDataRekapRW([]);
        setPesanRekap('');
        return false;
      }

      setSedangMemuatRekap(true);
      setPesanRekap('');

      try {
        const hasil = await kirimPermintaan({
          action: 'listRwRecap',
          token,
        });

        const data = bacaDaftarData(hasil);

        setDataRekapRW(data);

        return true;
      } catch (error) {
        console.error(
          'Gagal memuat rekap RW:',
          error
        );

        setDataRekapRW([]);

        setPesanRekap(
          error.message ||
          'Rekap belum dapat dimuat. Silakan coba kembali.'
        );

        return false;
      } finally {
        setSedangMemuatRekap(false);
      }
    },
    []
  );

  useEffect(() => {
    if (
      tokenSesi &&
      sesi?.role === 'rw' &&
      halamanInternal === 'rekapan'
    ) {
      // Server mengambil identitas RW dari sesi login,
      // bukan dari pilihan wilayah di frontend.
      muatRekapRW(tokenSesi);
    } else {
      setDataRekapRW([]);
      setPesanRekap('');
    }
  }, [
    tokenSesi,
    sesi?.role,
    halamanInternal,
    muatRekapRW,
  ]);

  // ====================================================
  // MANAJEMEN SESI
  // ====================================================

  const akhiriSesiLokal = useCallback(() => {
    setSesi(null);
    setPin('');
    setTampilkanPIN(false);
    setModalPINTerbuka(false);

    setHalamanInternal('beranda');
    setFormData(buatFormAwal());

    setKonfirmasiSimpan(null);
    setHasilTerakhir(null);

    setPesanInput('');
    setPesanDuplikat('');
    setPesanRekap('');

    setDataInternal([]);
    setDataRekapRW([]);
    setRwRekap('');

    if (timerSesi.current) {
      window.clearTimeout(timerSesi.current);
      timerSesi.current = null;
    }
  }, []);

  const jadwalkanKunciSesi = useCallback(() => {
    if (timerSesi.current) {
      window.clearTimeout(timerSesi.current);
    }

    timerSesi.current = window.setTimeout(
      akhiriSesiLokal,
      DURASI_SESI
    );
  }, [akhiriSesiLokal]);

  const refreshSesiBackend = useCallback(
    async () => {
      if (!tokenSesi) return;

      const sekarangMs = Date.now();

      if (
        sekarangMs - terakhirRefreshSesi.current <
        JEDA_REFRESH_SESI
      ) {
        return;
      }

      terakhirRefreshSesi.current = sekarangMs;

      try {
        const hasil = await kirimPermintaan({
          action: 'touch',
          token: tokenSesi,
        });

        if (hasil?.status !== 'success') {
          akhiriSesiLokal();
        }
      } catch (error) {
        console.warn(
          'Sesi belum dapat diperbarui:',
          error
        );
      }
    },
    [tokenSesi, akhiriSesiLokal]
  );

  useEffect(() => {
    if (!tokenSesi) {
      if (timerSesi.current) {
        window.clearTimeout(timerSesi.current);
      }

      return undefined;
    }

    const aktivitas = () => {
      jadwalkanKunciSesi();
      refreshSesiBackend();
    };

    jadwalkanKunciSesi();
    terakhirRefreshSesi.current = Date.now();

    const jenisAktivitas = [
      'keydown',
      'click',
      'scroll',
      'touchstart',
    ];

    jenisAktivitas.forEach((jenis) => {
      window.addEventListener(jenis, aktivitas, {
        passive: true,
      });
    });

    return () => {
      if (timerSesi.current) {
        window.clearTimeout(timerSesi.current);
      }

      jenisAktivitas.forEach((jenis) => {
        window.removeEventListener(jenis, aktivitas);
      });
    };
  }, [
    tokenSesi,
    jadwalkanKunciSesi,
    refreshSesiBackend,
  ]);

  useEffect(() => {
    if (!modalPINTerbuka) return undefined;

    const tanganiEscape = (event) => {
      if (
        event.key === 'Escape' &&
        !sedangLogin
      ) {
        setModalPINTerbuka(false);
        setPin('');
        setPesanPIN('');
        setTampilkanPIN(false);
      }
    };

    window.addEventListener(
      'keydown',
      tanganiEscape
    );

    return () => {
      window.removeEventListener(
        'keydown',
        tanganiEscape
      );
    };
  }, [modalPINTerbuka, sedangLogin]);

  // ====================================================
  // DATA GRAFIK
  // ====================================================
  const daftarTahun = useMemo(() => {
    const tahunDasar = Math.max(
      sekarang.getFullYear(),
      2026
    );

    const tahunTersedia = new Set(
      Array.from(
        { length: 5 },
        (_, indeks) => String(tahunDasar + indeks)
      )
    );

    dataPublik.forEach((item) => {
      const tahun = ambilTahun(item);

      if (
        /^20\d{2}$/.test(tahun) &&
        Number(tahun) >= 2026
      ) {
        tahunTersedia.add(tahun);
      }
    });

    return [...tahunTersedia].sort(
      (a, b) => Number(b) - Number(a)
    );
  }, [dataPublik, sekarang]);

  const ringkasanBulanIni = useMemo(() => {
    const totalPerRW = Object.fromEntries(
      DAFTAR_RW.map((rw) => [rw, 0])
    );

    let total = 0;
    let jumlahCatatan = 0;

    dataPublik.forEach((item) => {
      if (
        ambilTahun(item) !== tahunSekarang ||
        ambilIndeksBulan(
          ambilNilai(item, ['bulan', 'Bulan'])
        ) !== bulanSekarang
      ) {
        return;
      }

      const berat = ambilTotalBerat(item);
      const rw = ambilNamaRW(item);

      total += berat;
      jumlahCatatan += 1;

      if (totalPerRW[rw] !== undefined) {
        totalPerRW[rw] += berat;
      }
    });

    let wilayahTeraktif = '-';
    let beratTertinggi = 0;

    DAFTAR_RW.forEach((rw) => {
      if (totalPerRW[rw] > beratTertinggi) {
        beratTertinggi = totalPerRW[rw];
        wilayahTeraktif = rw;
      }
    });

    return {
      total,
      jumlahCatatan,
      wilayahTeraktif,
    };
  }, [
    dataPublik,
    tahunSekarang,
    bulanSekarang,
  ]);

  const dataGrafik = useMemo(() => {
    const totalPerRW = Object.fromEntries(
      DAFTAR_RW.map((rw) => [rw, 0])
    );

    dataPublik.forEach((item) => {
      if (
        ambilTahun(item) !== tahunGrafik ||
        ambilIndeksBulan(
          ambilNilai(item, ['bulan', 'Bulan'])
        ) !== bulanGrafik
      ) {
        return;
      }

      const rw = ambilNamaRW(item);

      if (totalPerRW[rw] !== undefined) {
        totalPerRW[rw] += ambilTotalBerat(item);
      }
    });

    return {
      labels: DAFTAR_RW,
      datasets: [
        {
          label: `Total setoran ${NAMA_BULAN[bulanGrafik]} ${tahunGrafik} (kg)`,
          data: DAFTAR_RW.map(
            (rw) => totalPerRW[rw]
          ),
          backgroundColor: '#0f766e',
          borderRadius: 7,
          barPercentage: 0.62,
        },
      ],
    };
  }, [
    dataPublik,
    bulanGrafik,
    tahunGrafik,
  ]);

  const trenTahunan = useMemo(() => {
    const trenPerRW = Object.fromEntries(
      DAFTAR_RW.map(
        (rw) => [rw, Array(12).fill(0)]
      )
    );

    dataPublik.forEach((item) => {
      if (ambilTahun(item) !== tahunTren) return;

      const rw = ambilNamaRW(item);

      const bulan = ambilIndeksBulan(
        ambilNilai(item, ['bulan', 'Bulan'])
      );

      if (
        bulan < 0 ||
        bulan > 11 ||
        !trenPerRW[rw]
      ) {
        return;
      }

      trenPerRW[rw][bulan] +=
        ambilTotalBerat(item);
    });

    return {
      labels: BULAN_SINGKAT,
      datasets: DAFTAR_RW.map((rw, indeks) => ({
        label: rw,
        data: trenPerRW[rw],
        borderColor: WARNA_RW[indeks],
        backgroundColor: WARNA_RW[indeks],
        pointRadius: 3,
        pointHoverRadius: 6,
        tension: 0.35,
      })),
    };
  }, [dataPublik, tahunTren]);

  // ====================================================
  // LOGIN DAN LOGOUT
  // ====================================================

  const bukaModalPIN = () => {
    setPin('');
    setPesanPIN('');
    setTampilkanPIN(false);
    setModalPINTerbuka(true);
  };

  const tutupModalPIN = () => {
    if (sedangLogin) return;

    setModalPINTerbuka(false);
    setPin('');
    setPesanPIN('');
    setTampilkanPIN(false);
  };

  const prosesLogin = async (event) => {
    event.preventDefault();

    if (!pin.trim()) {
      setPesanPIN(
        'Masukkan kode akses terlebih dahulu.'
      );
      return;
    }

    setSedangLogin(true);
    setPesanPIN('');

    try {
      const hasil = await kirimPermintaan({
        action: 'login',
        pin: pin.trim(),
        clientId,
      });

      if (
        hasil?.status !== 'success' ||
        !hasil?.token ||
        !['rw', 'staff'].includes(hasil?.role) ||
        (hasil.role === 'rw' && !DAFTAR_RW.includes(hasil.rw))
      ) {
        throw new Error(
          hasil?.message ||
          'Kode akses tidak benar atau identitas RW tidak valid.'
        );
      }

      setSesi({
        token: hasil.token,
        role: hasil.role,
        rw: hasil.role === 'rw' ? hasil.rw : null,
      });

      // RW langsung terikat ke wilayah hasil verifikasi backend.
      setFormData({
        ...buatFormAwal(),
        rw: hasil.role === 'rw' ? hasil.rw : '',
      });
      setRwRekap(hasil.role === 'rw' ? hasil.rw : '');

      terakhirRefreshSesi.current = Date.now();

      setPin('');
      setPesanPIN('');
      setTampilkanPIN(false);
      setModalPINTerbuka(false);

      setPesanInput('');
      setPesanDuplikat('');
      setPesanRekap('');

      setDataRekapRW([]);

      setHasilTerakhir(null);
      setKonfirmasiSimpan(null);

      setHalamanInternal(
        hasil.role === 'rw'
          ? 'input'
          : 'beranda'
      );
    } catch (error) {
      setPesanPIN(
        error.message ||
        'Login gagal. Silakan coba kembali.'
      );
    } finally {
      setSedangLogin(false);
    }
  };

  const keluarInternal = async () => {
    const token = tokenSesi;

    akhiriSesiLokal();

    if (token) {
      try {
        await kirimPermintaan({
          action: 'logout',
          token,
        });
      } catch (error) {
        console.warn(
          'Sesi server belum dapat diakhiri:',
          error
        );
      }
    }
  };

  // ====================================================
  // FORM INPUT DAN PENYIMPANAN
  // ====================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Identitas RW berasal dari sesi login. Hanya ADMIN yang memilih RW.
    if (name === 'rw' && sesi?.role === 'rw') {
      return;
    }

    setFormData((sebelumnya) => ({
      ...sebelumnya,
      [name]: value,
    }));

    setPesanInput('');
    setPesanDuplikat('');
  };

  const mintaKonfirmasiSimpan = (event) => {
    event.preventDefault();

    if (!tokenSesi) {
      akhiriSesiLokal();
      return;
    }

    const rwInput =
      sesi?.role === 'rw'
        ? sesi.rw
        : formData.rw;

    if (!rwInput || (sesi?.role === 'rw' && rwInput !== sesi.rw)) {
      setPesanInput(
        'Identitas RW belum terverifikasi. Silakan keluar dan masuk kembali.'
      );
      return;
    }

    const jenisSampah = [
      'plastik',
      'kertas',
      'logam',
      'kaca',
    ];

    const tidakValid = jenisSampah.some((jenis) => {
      const nilai = String(
        formData[jenis] ?? ''
      ).trim();

      return (
        nilai === '' ||
        !/^\d+(?:\.\d+)?$/.test(nilai) ||
        !Number.isFinite(Number(nilai)) ||
        Number(nilai) < 0
      );
    });

    if (tidakValid) {
      setPesanInput(
        'Isi semua berat menggunakan angka nol atau lebih. Gunakan titik untuk desimal, misalnya 1.5. Tulis 0 jika tidak ada setoran.'
      );
      return;
    }

    const data = {
      ...formData,
      rw: rwInput,
      plastik: Number(formData.plastik),
      kertas: Number(formData.kertas),
      logam: Number(formData.logam),
      kaca: Number(formData.kaca),
    };

    data.total =
      data.plastik +
      data.kertas +
      data.logam +
      data.kaca;

    setKonfirmasiSimpan(data);
    setPesanInput('');
    setPesanDuplikat('');
  };

  const simpanDataTerkonfirmasi = async () => {
    if (
      !konfirmasiSimpan ||
      pengirimanAktif.current ||
      !tokenSesi
    ) {
      return;
    }

    pengirimanAktif.current = true;
    setSedangMengirim(true);

    setPesanInput('');
    setPesanDuplikat('');

    try {
      const hasil = await kirimPermintaan({
        action: 'save',
        token: tokenSesi,
        data: {
          tahun: konfirmasiSimpan.tahun,
          bulan: konfirmasiSimpan.bulan,
          rw: konfirmasiSimpan.rw,
          plastik: konfirmasiSimpan.plastik,
          kertas: konfirmasiSimpan.kertas,
          logam: konfirmasiSimpan.logam,
          kaca: konfirmasiSimpan.kaca,
        },
      });

      if (hasil?.status === 'duplicate') {
        const lama = hasil.existing || {};

        setPesanDuplikat(
          `Data ${konfirmasiSimpan.rw} — ${konfirmasiSimpan.bulan} ${konfirmasiSimpan.tahun} sudah tercatat. Total catatan sebelumnya: ${formatBerat(lama.total ?? konfirmasiSimpan.total)} kg. Tidak ada data baru yang disimpan.`
        );

        setKonfirmasiSimpan(null);
        return;
      }

      if (hasil?.status !== 'success') {
        throw new Error(
          hasil?.message ||
          'Server belum mengonfirmasi penyimpanan data.'
        );
      }

      setHasilTerakhir({
        ...konfirmasiSimpan,
        nomor: hasil.no ?? hasil.nomor ?? null,
        timestamp:
          hasil.timestamp ||
          new Date().toISOString(),
      });

      setRwRekap(
        (sebelumnya) =>
          sebelumnya || konfirmasiSimpan.rw
      );

      setKonfirmasiSimpan(null);
      setPesanInput('');

      await muatDataPublik();

      if (isKaryawan) {
        await muatDataInternal(tokenSesi);
      }
    } catch (error) {
      console.error(
        'Gagal menyimpan data:',
        error
      );

      setPesanInput(
        error.message ||
        'Penyimpanan belum dapat dipastikan. Periksa status server sebelum mencoba lagi.'
      );
    } finally {
      pengirimanAktif.current = false;
      setSedangMengirim(false);
    }
  };

  const inputBerikutnya = () => {
    setFormData({
      ...buatFormAwal(),
      rw: sesi?.role === 'rw' ? sesi.rw : '',
    });
    setHasilTerakhir(null);
    setPesanInput('');
    setPesanDuplikat('');
  };

  const pilihHalamanInternal = (nama) => {
    if (
      !isKaryawan &&
      !['input', 'rekapan'].includes(nama)
    ) {
      return;
    }

    setHalamanInternal(nama);
    setPesanInput('');
    setPesanDuplikat('');
  };

  // ====================================================
  // REKAP RW: FILTER DAN TOTAL
  // ====================================================

  const dataRekapTerfilter = useMemo(() => {
    return dataRekapRW
      .filter(
        (item) =>
          ambilNamaRW(item) === rwRekap &&
          ambilTahun(item) === String(tahunRekap)
      )
      .slice()
      .sort((a, b) => {
        return (
          ambilIndeksBulan(
            ambilNilai(b, ['bulan', 'Bulan'])
          ) -
          ambilIndeksBulan(
            ambilNilai(a, ['bulan', 'Bulan'])
          )
        );
      });
  }, [dataRekapRW, rwRekap, tahunRekap]);

  const totalRekapTerfilter = useMemo(() => {
    return dataRekapTerfilter.reduce(
      (total, item) => ({
        plastik:
          total.plastik + angkaAman(item.plastik),
        kertas:
          total.kertas + angkaAman(item.kertas),
        logam:
          total.logam + angkaAman(item.logam),
        kaca:
          total.kaca + angkaAman(item.kaca),
        total:
          total.total + ambilTotalBerat(item),
      }),
      {
        plastik: 0,
        kertas: 0,
        logam: 0,
        kaca: 0,
        total: 0,
      }
    );
  }, [dataRekapTerfilter]);

  // Tampilkan seluruh 12 bulan agar RW bisa melihat bulan yang
  // sudah tercatat dan bulan yang belum memiliki catatan.
  const dataRekapDenganStatus = useMemo(() => {
    const berdasarkanBulan = new Map();

    dataRekapTerfilter.forEach((item) => {
      const indeksBulan = ambilIndeksBulan(
        ambilNilai(item, ['bulan', 'Bulan'])
      );

      if (indeksBulan >= 0 && indeksBulan < 12) {
        berdasarkanBulan.set(indeksBulan, item);
      }
    });

    return NAMA_BULAN.map((bulan, indeks) => {
      const catatan = berdasarkanBulan.get(indeks);

      if (catatan) {
        const adaBeratSetoran = ambilTotalBerat(catatan) > 0;

        return {
          ...catatan,
          bulan,
          statusSetoran: adaBeratSetoran
            ? 'Sudah Setor'
            : 'Tidak Ada Setoran',
        };
      }

      return {
        tahun: tahunRekap,
        bulan,
        rw: rwRekap,
        plastik: 0,
        kertas: 0,
        logam: 0,
        kaca: 0,
        total: 0,
        statusSetoran: 'Belum Setor',
      };
    });
  }, [dataRekapTerfilter, rwRekap, tahunRekap]);

  // ====================================================
  // TAMPILAN
  // ====================================================

  return (
    <div className="bank-sampah-app">
      <style>{`
        .bank-sampah-app {
          min-height: 100vh;
          color: #1e293b;
          background: #f5f8f6;
        }

        .bank-container {
          width: min(1220px, calc(100% - 40px));
          margin: 0 auto;
          padding: 28px 0 30px;
        }

        .bank-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 26px;
        }

        .bank-nav-group {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .bank-button {
          min-height: 42px;
          border: 1px solid #dbe5e1;
          border-radius: 10px;
          padding: 10px 14px;
          background: #ffffff;
          color: #475569;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s, border-color .2s;
        }

        .bank-button:hover:not(:disabled) {
          border-color: #0f766e;
        }

        .bank-button:disabled {
          cursor: not-allowed;
          opacity: .6;
        }

        .bank-button-primary {
          background: #0f766e;
          border-color: #0f766e;
          color: #ffffff;
        }

        .bank-button-primary:hover:not(:disabled) {
          background: #115e59;
        }

        .bank-button-danger {
          color: #b91c1c;
          background: #ffffff;
          border-color: #fecaca;
        }

        .bank-alert {
          margin: 0 0 18px;
          padding: 13px 15px;
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.7;
        }

        .bank-alert p {
          margin: 5px 0 0;
        }

        .bank-alert-error {
          color: #991b1b;
          border: 1px solid #fecaca;
          background: #fef2f2;
        }

        .bank-alert-warning {
          color: #92400e;
          border: 1px solid #fde68a;
          background: #fffbeb;
        }

        .bank-alert-success {
          color: #065f46;
          border: 1px solid #a7f3d0;
          background: #ecfdf5;
        }

        .bank-internal-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding: 18px 20px;
          margin-bottom: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          background: #ffffff;
        }

        .bank-internal-top h2 {
          margin: 0 0 5px;
          color: #115e59;
          font-size: 21px;
        }

        .bank-internal-top p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
        }

        .bank-role-chip {
          display: inline-flex;
          align-items: center;
          padding: 7px 11px;
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .bank-internal-grid {
          display: grid;
          grid-template-columns: 225px minmax(0, 1fr);
          align-items: start;
          gap: 20px;
        }

        .bank-sidebar {
          position: sticky;
          top: 16px;
          min-width: 0;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          background: #ffffff;
        }

        .bank-sidebar-heading {
          padding: 10px 11px 13px;
          color: #64748b;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .7px;
          text-transform: uppercase;
        }

        .bank-sidebar-nav {
          display: grid;
          gap: 4px;
        }

        .bank-sidebar button {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          min-height: 43px;
          padding: 11px;
          text-align: left;
          border: 0;
          border-radius: 9px;
          color: #475569;
          background: transparent;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .bank-sidebar button:hover {
          color: #0f766e;
          background: #f0fdfa;
        }

        .bank-sidebar button[aria-current="page"] {
          color: #ffffff;
          background: #0f766e;
        }

        .bank-internal-content {
          min-width: 0;
        }

        .bank-page-heading {
          margin-bottom: 18px;
        }

        .bank-page-heading h2 {
          margin: 0 0 7px;
          color: #115e59;
          font-size: clamp(21px, 3vw, 27px);
          letter-spacing: -.4px;
        }

        .bank-page-heading p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
        }

        .bank-summary-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
          margin-bottom: 20px;
        }

        .bank-summary-card {
          min-width: 0;
          padding: 19px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
        }

        .bank-summary-card span {
          display: block;
          margin-bottom: 9px;
          color: #64748b;
          font-size: 12px;
        }

        .bank-summary-card strong {
          display: block;
          color: #115e59;
          font-size: clamp(21px, 3vw, 27px);
          overflow-wrap: anywhere;
        }

        .bank-menu-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
        }

        .bank-menu-card {
          min-width: 0;
          padding: 19px;
          text-align: left;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          cursor: pointer;
          transition: border-color .2s, transform .2s;
        }

        .bank-menu-card:hover {
          border-color: #99d6c4;
          transform: translateY(-2px);
        }

        .bank-menu-card strong {
          display: block;
          margin-bottom: 7px;
          color: #115e59;
          font-size: 15px;
        }

        .bank-menu-card span {
          display: block;
          color: #64748b;
          font-size: 12px;
          line-height: 1.7;
        }

        .bank-empty {
          padding: 25px 18px;
          text-align: center;
          line-height: 1.7;
          color: #64748b;
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 12px;
        }

        /* Rekap RW */
        .bank-recap-panel {
          min-width: 0;
          padding: 18px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
        }

        .bank-recap-controls {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          align-items: end;
          margin-bottom: 16px;
        }

        .bank-recap-controls label {
          display: block;
          margin-bottom: 7px;
          color: #475569;
          font-size: 12px;
          font-weight: 700;
        }

        .bank-recap-controls select {
          width: 100%;
          min-width: 0;
          min-height: 43px;
          padding: 9px 11px;
          color: #1e293b;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          font: inherit;
          font-size: 13px;
        }

        .bank-recap-summary {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 17px;
        }

        .bank-recap-summary-item {
          padding: 15px;
          background: #f0fdfa;
          border: 1px solid #d1fae5;
          border-radius: 11px;
        }

        .bank-recap-summary-item span {
          display: block;
          margin-bottom: 6px;
          color: #64748b;
          font-size: 12px;
        }

        .bank-recap-summary-item strong {
          color: #115e59;
          font-size: 21px;
          line-height: 1.35;
          overflow-wrap: anywhere;
        }

        .bank-recap-table-wrap {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }

        .bank-recap-table {
          width: 100%;
          min-width: 690px;
          border-collapse: collapse;
          background: #ffffff;
          font-size: 12px;
        }

        .bank-recap-table th,
        .bank-recap-table td {
          padding: 11px 12px;
          border-bottom: 1px solid #e2e8f0;
          text-align: right;
          white-space: nowrap;
        }

        .bank-recap-table th {
          color: #475569;
          background: #f8fafc;
          font-weight: 800;
        }

        .bank-recap-table th:first-child,
        .bank-recap-table td:first-child {
          text-align: left;
        }

        .bank-recap-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .bank-recap-table tfoot td {
          color: #115e59;
          background: #ecfdf5;
          border-top: 1px solid #a7f3d0;
          border-bottom: 0;
          font-weight: 800;
        }

        .bank-recap-note {
          margin: 14px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.7;
        }

        .bank-recap-fixed-rw {
          display: flex;
          align-items: center;
          width: 100%;
          min-width: 0;
          min-height: 43px;
          padding: 9px 11px;
          color: #115e59;
          background: #f0fdfa;
          border: 1px solid #99f6e4;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 800;
        }

        .bank-status-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
        }

        .bank-status-sudah {
          color: #065f46;
          background: #d1fae5;
          border: 1px solid #a7f3d0;
        }

        .bank-status-belum {
          color: #92400e;
          background: #fef3c7;
          border: 1px solid #fde68a;
        }

        .bank-status-nol {
          color: #475569;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
        }

        /* Popup Masuk */
        .bank-pin-overlay {
          position: fixed;
          z-index: 2000;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 18px;
          background: rgba(15, 23, 42, .42);
          -webkit-backdrop-filter: blur(7px);
          backdrop-filter: blur(7px);
          overflow-y: auto;
        }

        .bank-pin-modal {
          position: relative;
          width: min(420px, 100%);
          padding: clamp(23px, 5vw, 32px);
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, .9);
          border-radius: 21px;
          box-shadow: 0 25px 80px rgba(15, 23, 42, .2);
          animation: bank-modal-masuk .18s ease-out;
        }

        @keyframes bank-modal-masuk {
          from {
            opacity: 0;
            transform: translateY(8px) scale(.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .bank-pin-close {
          position: absolute;
          top: 13px;
          right: 13px;
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #ffffff;
          color: #64748b;
          font-size: 23px;
          line-height: 1;
          cursor: pointer;
        }

        .bank-pin-close:hover {
          color: #0f766e;
          background: #f8fafc;
        }

        .bank-pin-modal h2 {
          margin: 0 0 8px;
          color: #115e59;
          font-size: 24px;
          letter-spacing: -.4px;
        }

        .bank-pin-description {
          margin: 0 0 23px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.75;
        }

        .bank-pin-label {
          display: block;
          margin-bottom: 8px;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }

        .bank-pin-input-wrap {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 10px 0 13px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          background: #ffffff;
        }

        .bank-pin-input-wrap:focus-within {
          border-color: #0f766e;
          box-shadow: 0 0 0 3px rgba(15, 118, 110, .12);
        }

        .bank-pin-input {
          display: block;
          flex: 1;
          min-width: 0;
          height: 47px;
          border: 0;
          outline: none;
          color: #1e293b;
          background: transparent;
          font: inherit;
          font-size: 16px;
          letter-spacing: 2px;
        }

        .bank-pin-toggle {
          padding: 7px 8px;
          border: 0;
          background: transparent;
          color: #0f766e;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .bank-pin-error {
          margin-top: 13px;
          padding: 11px 12px;
          color: #991b1b;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 9px;
          font-size: 12px;
          line-height: 1.65;
        }

        .bank-pin-submit {
          width: 100%;
          min-height: 46px;
          margin-top: 17px;
        }

        .bank-pin-footnote {
          margin: 16px 0 0;
          color: #94a3b8;
          font-size: 11px;
          line-height: 1.65;
          text-align: center;
        }

        /* Konfirmasi penyimpanan */
        .bank-confirm-overlay {
          position: fixed;
          z-index: 1900;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 18px;
          background: rgba(15, 23, 42, .48);
          -webkit-backdrop-filter: blur(5px);
          backdrop-filter: blur(5px);
          overflow-y: auto;
        }

        .bank-confirm-modal {
          width: min(500px, 100%);
          padding: 24px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 17px;
          box-shadow: 0 25px 80px rgba(15, 23, 42, .2);
        }

        .bank-confirm-modal h3 {
          margin: 0 0 8px;
          color: #115e59;
          font-size: 21px;
        }

        .bank-confirm-modal > p {
          margin: 0 0 18px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
        }

        .bank-confirm-list {
          margin-bottom: 18px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }

        .bank-confirm-row {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          padding: 10px 12px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 13px;
        }

        .bank-confirm-row:last-child {
          border-bottom: 0;
        }

        .bank-confirm-row span {
          color: #64748b;
        }

        .bank-confirm-row strong {
          color: #1e293b;
          text-align: right;
          overflow-wrap: anywhere;
        }

        .bank-confirm-total {
          background: #ecfdf5;
        }

        .bank-confirm-total strong {
          color: #0f766e;
          font-size: 16px;
        }

        .bank-confirm-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .bank-confirm-actions button {
          flex: 1 1 150px;
        }

        @media (max-width: 900px) {
          .bank-internal-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .bank-sidebar {
            position: static;
          }

          .bank-sidebar-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .bank-sidebar button {
            width: auto;
            flex: 1 1 140px;
          }
        }

        @media (max-width: 640px) {
          .bank-container {
            width: calc(100% - 24px);
            padding: 16px 0 24px;
          }

          .bank-nav {
            align-items: stretch;
          }

          .bank-nav-group {
            width: 100%;
          }

          .bank-nav-group .bank-button {
            flex: 1 1 auto;
          }

          .bank-internal-top {
            padding: 15px;
          }

          .bank-summary-grid,
          .bank-menu-grid,
          .bank-recap-summary,
          .bank-recap-controls {
            grid-template-columns: minmax(0, 1fr);
          }

          .bank-recap-panel {
            padding: 13px;
          }

          .bank-confirm-modal {
            padding: 19px;
          }

          .bank-confirm-actions {
            flex-direction: column;
          }

          .bank-confirm-actions button {
            width: 100%;
            flex-basis: auto;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bank-pin-modal {
            animation: none;
          }
        }
      `}</style>

      <main className="bank-container">
        <Header />

        {/* ================ NAVIGASI PUBLIK ================ */}
        <nav
          className="bank-nav"
          aria-label="Navigasi publik"
        >
          <div className="bank-nav-group">
            <button
              type="button"
              className="bank-button"
              aria-current={
                tabPublik === 'dashboard'
                  ? 'page'
                  : undefined
              }
              onClick={() => setTabPublik('dashboard')}
            >
              Ringkasan Data
            </button>

            <button
              type="button"
              className="bank-button"
              aria-current={
                tabPublik === 'info'
                  ? 'page'
                  : undefined
              }
              onClick={() => setTabPublik('info')}
            >
              Informasi dan Panduan
            </button>
          </div>

          <div className="bank-nav-group">
            {!sesi ? (
              <button
                type="button"
                className="bank-button bank-button-primary"
                style={GAYA_TOMBOL}
                onClick={bukaModalPIN}
              >
                Masuk
              </button>
            ) : (
              <button
                type="button"
                className="bank-button bank-button-primary"
                onClick={() => {
                  setTabPublik('dashboard');
                  setHalamanInternal(
                    sesi.role === 'rw'
                      ? 'input'
                      : 'beranda'
                  );
                }}
              >
                Buka Area Internal
              </button>
            )}
          </div>
        </nav>

        {pesanKesalahan && (
          <div
            className="bank-alert bank-alert-error"
            role="alert"
          >
            {pesanKesalahan}

            <div style={{ marginTop: 10 }}>
              <button
                type="button"
                className="bank-button"
                onClick={muatDataPublik}
              >
                Coba Muat Kembali
              </button>
            </div>
          </div>
        )}

        {/* ================ DASHBOARD PUBLIK ================ */}
        {tabPublik === 'dashboard' && (
          <section aria-label="Dashboard publik">
            {sedangMemuatPublik ? (
              <div
                className="bank-empty"
                role="status"
              >
                Memuat ringkasan Bank Sampah...
              </div>
            ) : (
              <>
                {ringkasanBulanIni.jumlahCatatan === 0 && (
                  <div
                    className="bank-alert bank-alert-warning"
                    role="status"
                  >
                    Belum ada data pada periode{' '}
                    {NAMA_BULAN[bulanSekarang]}{' '}
                    {tahunSekarang}. Gunakan filter grafik
                    untuk melihat periode lain.
                  </div>
                )}

                <Informasi
                  totalSampahBulanIni={
                    ringkasanBulanIni.total
                  }
                  wilayahTeraktif={
                    ringkasanBulanIni.wilayahTeraktif
                  }
                />

                <Grafik
                  dataGrafik={dataGrafik}
                  trenTahunan={trenTahunan}
                  bulanGrafik={bulanGrafik}
                  setBulanGrafik={setBulanGrafik}
                  tahunGrafik={tahunGrafik}
                  setTahunGrafik={setTahunGrafik}
                  tahunTren={tahunTren}
                  setTahunTren={setTahunTren}
                  daftarTahun={daftarTahun}
                  sedangMemuat={sedangMemuatPublik}
                />
              </>
            )}
          </section>
        )}

        {tabPublik === 'info' && <InfoBankSampah />}

        {/* ================ AREA INTERNAL ================ */}
        {sesi && (
          <section
            className="area-internal"
            aria-label="Area internal Bank Sampah"
            style={{ marginTop: 28 }}
          >
            <div className="bank-internal-top">
              <div>
                <h2>
                  {isKaryawan
                    ? {
                      beranda: 'Beranda Internal',
                      input: 'Input Data Setoran',
                      tabel: 'Tabel Lengkap',
                      info: 'Informasi dan Panduan',
                      rekapan: 'Rekapan RW',
                    }[halamanInternal]
                    : halamanInternal === 'rekapan'
                      ? 'Rekapan RW'
                      : 'Input Data Setoran'}
                </h2>

                <p>
                  Area khusus petugas yang sudah terverifikasi.
                </p>
              </div>

              <div className="bank-nav-group">
                <span className="bank-role-chip">
                  {namaPeran}
                  {!isKaryawan && sesi?.rw
                    ? ` · ${sesi.rw}`
                    : ''}
                </span>

                <button
                  type="button"
                  className="bank-button bank-button-danger"
                  onClick={keluarInternal}
                >
                  Keluar
                </button>
              </div>
            </div>

            <div className="bank-internal-grid">
              <aside
                className="bank-sidebar"
                aria-label="Menu internal"
              >
                <div className="bank-sidebar-heading">
                  Menu Internal
                </div>

                <div className="bank-sidebar-nav">
                  {isKaryawan && (
                    <button
                      type="button"
                      aria-current={
                        halamanInternal === 'beranda'
                          ? 'page'
                          : undefined
                      }
                      onClick={() =>
                        pilihHalamanInternal('beranda')
                      }
                    >
                      <span aria-hidden="true">⌂</span>
                      Beranda Internal
                    </button>
                  )}

                  <button
                    type="button"
                    aria-current={
                      halamanInternal === 'input'
                        ? 'page'
                        : undefined
                    }
                    onClick={() =>
                      pilihHalamanInternal('input')
                    }
                  >
                    <span aria-hidden="true">＋</span>
                    Input Data
                  </button>

                  {!isKaryawan && (
                    <button
                      type="button"
                      aria-current={
                        halamanInternal === 'rekapan'
                          ? 'page'
                          : undefined
                      }
                      onClick={() =>
                        pilihHalamanInternal('rekapan')
                      }
                    >
                      <span aria-hidden="true">▤</span>
                      Rekapan RW
                    </button>
                  )}

                  {isKaryawan && (
                    <>
                      <button
                        type="button"
                        aria-current={
                          halamanInternal === 'tabel'
                            ? 'page'
                            : undefined
                        }
                        onClick={() =>
                          pilihHalamanInternal('tabel')
                        }
                      >
                        <span aria-hidden="true">▤</span>
                        Tabel Lengkap
                      </button>

                      <button
                        type="button"
                        aria-current={
                          halamanInternal === 'info'
                            ? 'page'
                            : undefined
                        }
                        onClick={() =>
                          pilihHalamanInternal('info')
                        }
                      >
                        <span aria-hidden="true">ⓘ</span>
                        Informasi
                      </button>
                    </>
                  )}
                </div>
              </aside>

              <div className="bank-internal-content">
                {/* BERANDA ADMIN */}
                {halamanInternal === 'beranda' &&
                  isKaryawan && (
                    <>
                      <div className="bank-page-heading">
                        <h2>Ringkasan Internal</h2>
                        <p>
                          Ringkasan pencatatan untuk pemantauan
                          admin kelurahan.
                        </p>
                      </div>

                      {sedangMemuatInternal ? (
                        <div
                          className="bank-empty"
                          role="status"
                        >
                          Memuat data internal...
                        </div>
                      ) : (
                        <div className="bank-summary-grid">
                          <div className="bank-summary-card">
                            <span>Jumlah Catatan</span>
                            <strong>
                              {dataInternal.length}
                            </strong>
                          </div>

                          <div className="bank-summary-card">
                            <span>Total Berat Tercatat</span>
                            <strong>
                              {formatBerat(
                                dataInternal.reduce(
                                  (total, item) =>
                                    total +
                                    ambilTotalBerat(item),
                                  0
                                )
                              )}{' '}
                              kg
                            </strong>
                          </div>
                        </div>
                      )}

                      <div className="bank-menu-grid">
                        <button
                          type="button"
                          className="bank-menu-card"
                          onClick={() =>
                            pilihHalamanInternal('input')
                          }
                        >
                          <strong>Input Data Setoran</strong>
                          <span>
                            Catat rekap bulanan berdasarkan laporan
                            yang diterima.
                          </span>
                        </button>

                        <button
                          type="button"
                          className="bank-menu-card"
                          onClick={() =>
                            pilihHalamanInternal('tabel')
                          }
                        >
                          <strong>Tabel Lengkap</strong>
                          <span>
                            Cari dan periksa catatan seluruh RW.
                          </span>
                        </button>
                      </div>
                    </>
                  )}

                {/* FORM INPUT */}
                {halamanInternal === 'input' && (
                  <>
                    <div className="bank-page-heading">
                      <h2>Catat Setoran Sampah</h2>
                      <p>
                        {isKaryawan
                          ? 'Pilih wilayah dan periode, isi berat setiap jenis sampah, lalu periksa ringkasan sebelum menyimpan.'
                          : `Wilayah ${sesi?.rw || 'RW Anda'} dikenali otomatis dari kode akses. Isi periode dan berat setiap jenis sampah, lalu periksa ringkasan sebelum menyimpan.`}
                      </p>
                    </div>

                    {!isKaryawan && sesi?.rw && (
                      <div
                        className="bank-alert bank-alert-success"
                        role="status"
                      >
                        <strong>Wilayah terverifikasi: {sesi.rw}</strong>
                        <p>
                          Identitas wilayah mengikuti kode akses yang digunakan untuk masuk.
                        </p>
                      </div>
                    )}

                    {pesanInput && (
                      <div
                        className="bank-alert bank-alert-error"
                        role="alert"
                      >
                        {pesanInput}
                      </div>
                    )}

                    {pesanDuplikat && (
                      <div
                        className="bank-alert bank-alert-warning"
                        role="alert"
                      >
                        <strong>Data sudah tercatat</strong>
                        <p>{pesanDuplikat}</p>
                      </div>
                    )}

                    {hasilTerakhir && (
                      <div
                        className="bank-alert bank-alert-success"
                        role="status"
                      >
                        <strong>Data berhasil disimpan</strong>

                        <p>
                          {hasilTerakhir.rw} —{' '}
                          {hasilTerakhir.bulan}{' '}
                          {hasilTerakhir.tahun}

                          {hasilTerakhir.nomor !== null
                            ? ` · Nomor ${hasilTerakhir.nomor}`
                            : ''}
                        </p>

                        <div className="bank-confirm-list">
                          {[
                            ['Plastik', hasilTerakhir.plastik],
                            ['Kertas', hasilTerakhir.kertas],
                            ['Logam', hasilTerakhir.logam],
                            ['Kaca', hasilTerakhir.kaca],
                          ].map(([nama, nilai]) => (
                            <div
                              className="bank-confirm-row"
                              key={nama}
                            >
                              <span>{nama}</span>
                              <strong>
                                {formatBerat(nilai)} kg
                              </strong>
                            </div>
                          ))}

                          <div className="bank-confirm-row bank-confirm-total">
                            <span>Total Berat</span>
                            <strong>
                              {formatBerat(
                                hasilTerakhir.total
                              )}{' '}
                              kg
                            </strong>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="bank-button bank-button-primary"
                          onClick={inputBerikutnya}
                        >
                          Input Berikutnya
                        </button>
                      </div>
                    )}

                    <FormInput
                      formData={formData}
                      handleInputChange={handleInputChange}
                      kirimData={mintaKonfirmasiSimpan}
                      sedangMengirim={sedangMengirim}
                      disabled={Boolean(hasilTerakhir)}
                      rwTerkunci={!isKaryawan}
                      wilayahRW={sesi?.rw || 'Wilayah RW tidak tersedia'}
                    />
                  </>
                )}

                {/* REKAP RW TANPA UNDUHAN */}
                {halamanInternal === 'rekapan' &&
                  !isKaryawan && (
                    <>
                      <div className="bank-page-heading">
                        <h2>Rekapan RW</h2>
                        <p>
                          Periksa rekap bulanan yang sudah tersimpan
                          di sistem. Halaman ini hanya untuk melihat
                          data dan tidak menyediakan unduhan.
                        </p>
                      </div>

                      <div className="bank-recap-panel">
                        <div className="bank-recap-controls">
                          <div>
                            <label>Wilayah RW</label>
                            <div
                              className="bank-recap-fixed-rw"
                              aria-label={`Wilayah yang terverifikasi: ${sesi?.rw || 'tidak diketahui'}`}
                            >
                              {sesi?.rw || 'Identitas RW tidak tersedia'}
                            </div>
                          </div>

                          <div>
                            <label htmlFor="pilihan-tahun-rekapan">
                              Pilih Tahun
                            </label>

                            <select
                              id="pilihan-tahun-rekapan"
                              value={tahunRekap}
                              onChange={(event) =>
                                setTahunRekap(event.target.value)
                              }
                            >
                              {daftarTahun.map((tahun) => (
                                <option
                                  key={tahun}
                                  value={tahun}
                                >
                                  {tahun}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {pesanRekap && (
                          <div
                            className="bank-alert bank-alert-error"
                            role="alert"
                          >
                            {pesanRekap}
                          </div>
                        )}

                        {!rwRekap ? (
                          <div className="bank-empty">
                            Identitas RW belum tersedia. Silakan keluar dan masuk kembali.
                          </div>
                        ) : sedangMemuatRekap ? (
                          <div
                            className="bank-empty"
                            role="status"
                          >
                            Memuat rekap {rwRekap}...
                          </div>
                        ) : pesanRekap ? null : (
                          <>
                            <div className="bank-recap-summary">
                              <div className="bank-recap-summary-item">
                                <span>
                                  Jumlah Periode Tercatat
                                </span>
                                <strong>
                                  {dataRekapTerfilter.length}
                                </strong>
                              </div>

                              <div className="bank-recap-summary-item">
                                <span>
                                  Total Setoran {tahunRekap}
                                </span>
                                <strong>
                                  {formatBerat(
                                    totalRekapTerfilter.total
                                  )}{' '}
                                  kg
                                </strong>
                              </div>
                            </div>

                            <div className="bank-recap-table-wrap">
                              <table className="bank-recap-table">
                                <thead>
                                  <tr>
                                    <th>Periode</th>
                                    <th>Plastik (kg)</th>
                                    <th>Kertas (kg)</th>
                                    <th>Logam (kg)</th>
                                    <th>Kaca (kg)</th>
                                    <th>Total (kg)</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {dataRekapDenganStatus.map(
                                    (item, indeks) => (
                                      <tr
                                        key={`${item.tahun}-${item.bulan}-${item.rw}-${indeks}`}
                                      >
                                        <td>
                                          {item.bulan}{' '}
                                          {item.tahun}
                                        </td>
                                        <td>
                                          {formatBerat(item.plastik)}
                                        </td>
                                        <td>
                                          {formatBerat(item.kertas)}
                                        </td>
                                        <td>
                                          {formatBerat(item.logam)}
                                        </td>
                                        <td>
                                          {formatBerat(item.kaca)}
                                        </td>
                                        <td>
                                          <strong>
                                            {formatBerat(
                                              ambilTotalBerat(item)
                                            )}
                                          </strong>
                                        </td>
                                        <td>
                                          <span
                                            className={`bank-status-chip ${item.statusSetoran === 'Sudah Setor'
                                              ? 'bank-status-sudah'
                                              : item.statusSetoran === 'Tidak Ada Setoran'
                                                ? 'bank-status-nol'
                                                : 'bank-status-belum'
                                              }`}
                                          >
                                            {item.statusSetoran}
                                          </span>
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>

                                <tfoot>
                                  <tr>
                                    <td>Total {tahunRekap}</td>
                                    <td>
                                      {formatBerat(
                                        totalRekapTerfilter.plastik
                                      )}
                                    </td>
                                    <td>
                                      {formatBerat(
                                        totalRekapTerfilter.kertas
                                      )}
                                    </td>
                                    <td>
                                      {formatBerat(
                                        totalRekapTerfilter.logam
                                      )}
                                    </td>
                                    <td>
                                      {formatBerat(
                                        totalRekapTerfilter.kaca
                                      )}
                                    </td>
                                    <td>
                                      {formatBerat(
                                        totalRekapTerfilter.total
                                      )}
                                    </td>
                                    <td>—</td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>

                            <p className="bank-recap-note">
                              Rekap ini menampilkan seluruh bulan
                              pada tahun yang dipilih. Status dihitung
                              dari catatan yang tersimpan; bulan tanpa
                              catatan ditandai Belum Setor. Halaman
                              Perangkat RW tidak menyediakan fitur
                              unduh atau ekspor.
                            </p>
                          </>
                        )}
                      </div>
                    </>
                  )}

                {/* TABEL LENGKAP ADMIN */}
                {halamanInternal === 'tabel' &&
                  isKaryawan && (
                    <>
                      <div className="bank-page-heading">
                        <h2>Tabel Lengkap</h2>
                        <p>
                          Filter, periksa, dan unduh laporan
                          berdasarkan data yang tersimpan.
                        </p>
                      </div>

                      {sedangMemuatInternal ? (
                        <div
                          className="bank-empty"
                          role="status"
                        >
                          Memuat tabel lengkap...
                        </div>
                      ) : (
                        <TabelData
                          data={dataInternal}
                          token={tokenSesi}
                          onRefresh={() =>
                            muatDataInternal(tokenSesi)
                          }
                        />
                      )}
                    </>
                  )}

                {halamanInternal === 'info' &&
                  isKaryawan && <InfoBankSampah />}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>

      {/* ================ POPUP MASUK ================ */}
      {modalPINTerbuka && !sesi && (
        <div
          className="bank-pin-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !sedangLogin
            ) {
              tutupModalPIN();
            }
          }}
        >
          <section
            className="bank-pin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-modal-pin"
            aria-describedby="deskripsi-modal-pin"
          >
            <button
              type="button"
              className="bank-pin-close"
              aria-label="Tutup popup masuk"
              disabled={sedangLogin}
              onClick={tutupModalPIN}
            >
              ×
            </button>

            <h2 id="judul-modal-pin">Masuk</h2>

            <p
              id="deskripsi-modal-pin"
              className="bank-pin-description"
            >
              Masukkan kode akses untuk melanjutkan.
            </p>

            <form onSubmit={prosesLogin}>
              <label
                htmlFor="pin-internal"
                className="bank-pin-label"
              >
                Kode akses
              </label>

              <div className="bank-pin-input-wrap">
                <input
                  id="pin-internal"
                  className="bank-pin-input"
                  type={tampilkanPIN ? 'text' : 'password'}
                  value={pin}
                  onChange={(event) => {
                    setPin(event.target.value);
                    setPesanPIN('');
                  }}
                  placeholder="Masukkan kode"
                  autoComplete="current-password"
                  inputMode="numeric"
                  required
                  autoFocus
                  disabled={sedangLogin}
                />

                <button
                  type="button"
                  className="bank-pin-toggle"
                  onClick={() =>
                    setTampilkanPIN((nilai) => !nilai)
                  }
                  aria-label={
                    tampilkanPIN
                      ? 'Sembunyikan kode'
                      : 'Tampilkan kode'
                  }
                >
                  {tampilkanPIN ? 'Sembunyi' : 'Lihat'}
                </button>
              </div>

              {pesanPIN && (
                <div
                  className="bank-pin-error"
                  role="alert"
                >
                  {pesanPIN}
                </div>
              )}

              <button
                type="submit"
                className="bank-button bank-button-primary bank-pin-submit"
                disabled={sedangLogin}
              >
                {sedangLogin
                  ? 'Memverifikasi...'
                  : 'Masuk'}
              </button>
            </form>

            <p className="bank-pin-footnote">
              Akses hanya untuk petugas yang berwenang.
              Setelah 30 menit tidak aktif, sesi akan berakhir.
            </p>
          </section>
        </div>
      )}

      {/* ================ KONFIRMASI SIMPAN ================ */}
      {konfirmasiSimpan && sesi && (
        <div
          className="bank-confirm-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !sedangMengirim
            ) {
              setKonfirmasiSimpan(null);
            }
          }}
        >
          <section
            className="bank-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-konfirmasi"
          >
            <h3 id="judul-konfirmasi">
              Konfirmasi Data Setoran
            </h3>

            <p>
              Periksa kembali RW, periode, dan berat sebelum
              mengonfirmasi penyimpanan.
            </p>

            <div className="bank-confirm-list">
              {[
                ['Wilayah RW', konfirmasiSimpan.rw],
                [
                  'Periode',
                  `${konfirmasiSimpan.bulan} ${konfirmasiSimpan.tahun}`,
                ],
                [
                  'Plastik',
                  `${formatBerat(konfirmasiSimpan.plastik)} kg`,
                ],
                [
                  'Kertas',
                  `${formatBerat(konfirmasiSimpan.kertas)} kg`,
                ],
                [
                  'Logam',
                  `${formatBerat(konfirmasiSimpan.logam)} kg`,
                ],
                [
                  'Kaca',
                  `${formatBerat(konfirmasiSimpan.kaca)} kg`,
                ],
              ].map(([nama, nilai]) => (
                <div
                  className="bank-confirm-row"
                  key={nama}
                >
                  <span>{nama}</span>
                  <strong>{nilai}</strong>
                </div>
              ))}

              <div className="bank-confirm-row bank-confirm-total">
                <span>Total Berat</span>
                <strong>
                  {formatBerat(konfirmasiSimpan.total)} kg
                </strong>
              </div>
            </div>

            <div className="bank-confirm-actions">
              <button
                type="button"
                className="bank-button"
                disabled={sedangMengirim}
                onClick={() => setKonfirmasiSimpan(null)}
              >
                Kembali, Perbaiki
              </button>

              <button
                type="button"
                className="bank-button bank-button-primary"
                disabled={sedangMengirim}
                onClick={simpanDataTerkonfirmasi}
              >
                {sedangMengirim
                  ? 'Menyimpan...'
                  : 'Konfirmasi & Simpan'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;