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

const WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbyPSYQsJAuVhCi5CmAswNy0wEkr94zwxxsgoRXjyNaOccYWlCykS-g7GroBxMlY0NXBeg/exec';

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
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des',
];

const DAFTAR_RW = [
  'RW 01',
  'RW 02',
  'RW 03',
  'RW 04',
  'RW 05',
];

const WARNA_RW = [
  '#ef4444',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
];

function buatFormAwal() {
  const sekarang = new Date();

  return {
    bulan: NAMA_BULAN[sekarang.getMonth()],
    tahun: String(sekarang.getFullYear()),
    rw: 'RW 01',
    plastik: '',
    kertas: '',
    logam: '',
    kaca: '',
  };
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
    ])
  )
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ');

  const cocok =
    nilai.match(/(?:^|\s)RW\s*0?([1-5])$/) ||
    nilai.match(/^0?([1-5])$/);

  return cocok
    ? `RW ${cocok[1].padStart(2, '0')}`
    : nilai;
}

function ambilIndeksBulan(nilaiBulan) {
  const nilai = String(nilaiBulan)
    .trim()
    .toLowerCase();

  if (!nilai) return -1;

  if (/^\d{1,2}$/.test(nilai)) {
    const angka = Number(nilai);

    if (angka >= 1 && angka <= 12) {
      return angka - 1;
    }
  }

  const aliasBulan = [
    ['januari', ['jan', 'januari']],
    ['februari', ['feb', 'februari']],
    ['maret', ['mar', 'maret']],
    ['april', ['apr', 'april']],
    ['mei', ['mei']],
    ['juni', ['jun', 'juni']],
    ['juli', ['jul', 'juli']],
    ['agustus', ['ags', 'agu', 'agustus']],
    ['september', ['sep', 'september']],
    ['oktober', ['okt', 'oktober']],
    ['november', ['nov', 'november']],
    ['desember', ['des', 'desember']],
  ];

  for (
    let indeks = 0;
    indeks < aliasBulan.length;
    indeks++
  ) {
    if (
      aliasBulan[indeks][1].some((alias) =>
        nilai.startsWith(alias)
      )
    ) {
      return indeks;
    }
  }

  return -1;
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
    'TotalBerat',
  ]);

  if (nilaiTotal !== '') {
    return angkaAman(nilaiTotal);
  }

  return (
    angkaAman(
      ambilNilai(item, ['plastik', 'Plastik'])
    ) +
    angkaAman(
      ambilNilai(item, ['kertas', 'Kertas'])
    ) +
    angkaAman(
      ambilNilai(item, ['logam', 'Logam'])
    ) +
    angkaAman(
      ambilNilai(item, ['kaca', 'Kaca'])
    )
  );
}

function App() {
  const sekarang = new Date();
  const tahunSekarang = String(
    sekarang.getFullYear()
  );
  const bulanSekarang = sekarang.getMonth();

  const [activeTab, setActiveTab] =
    useState('dashboard');

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [dataSetoran, setDataSetoran] =
    useState([]);

  const [sedangMemuat, setSedangMemuat] =
    useState(true);

  const [sedangMengirim, setSedangMengirim] =
    useState(false);

  const [pesanKesalahan, setPesanKesalahan] =
    useState('');

  const pengirimanAktif = useRef(false);

  const [formData, setFormData] =
    useState(buatFormAwal);

  // Pilihan periode untuk grafik perbandingan per RW.
  const [bulanGrafik, setBulanGrafik] =
    useState(bulanSekarang);

  const [tahunGrafik, setTahunGrafik] =
    useState(tahunSekarang);

  // Pilihan tahun untuk grafik perkembangan tahunan.
  const [tahunTren, setTahunTren] =
    useState(tahunSekarang);

  // Mengambil data dari Google Sheets.
  const muatDataSetoran = useCallback(async () => {
    setSedangMemuat(true);
    setPesanKesalahan('');

    try {
      const response = await fetch(WEB_APP_URL, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(
          'Server tidak dapat mengambil data.'
        );
      }

      const hasil = await response.json();

      if (!Array.isArray(hasil)) {
        throw new Error(
          hasil?.error ||
            'Format data dari Google Sheets tidak sesuai.'
        );
      }

      setDataSetoran(hasil);

      return true;
    } catch (error) {
      console.error(
        'Gagal memuat data setoran:',
        error
      );

      setPesanKesalahan(
        'Data belum dapat dimuat. Periksa koneksi internet atau akses Google Sheets.'
      );

      return false;
    } finally {
      setSedangMemuat(false);
    }
  }, []);

  useEffect(() => {
    muatDataSetoran();
  }, [muatDataSetoran]);

  // Daftar tahun berisi tahun yang ada di data,
  // beberapa tahun sebelumnya, dan beberapa tahun ke depan.
  const daftarTahun = useMemo(() => {
    const tahunDasar = sekarang.getFullYear();

    const tahunTersedia = new Set(
      Array.from(
        { length: 9 },
        (_, indeks) =>
          String(tahunDasar - 3 + indeks)
      )
    );

    dataSetoran.forEach((item) => {
      const tahun = ambilTahun(item);

      if (/^20\d{2}$/.test(tahun)) {
        tahunTersedia.add(tahun);
      }
    });

    // Pastikan tahun terpilih tetap tersedia.
    tahunTersedia.add(tahunGrafik);
    tahunTersedia.add(tahunTren);

    return [...tahunTersedia].sort(
      (a, b) => Number(b) - Number(a)
    );
  }, [dataSetoran, tahunGrafik, tahunTren]);

  // Ringkasan tetap memakai bulan dan tahun berjalan,
  // walaupun pengguna sedang melihat periode lain.
  const ringkasanBulanIni = useMemo(() => {
    const totalPerRW = Object.fromEntries(
      DAFTAR_RW.map((rw) => [rw, 0])
    );

    let total = 0;

    dataSetoran.forEach((item) => {
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
      wilayahTeraktif,
    };
  }, [
    dataSetoran,
    tahunSekarang,
    bulanSekarang,
  ]);

  // Grafik batang: mengikuti pilihan bulan dan tahun.
  const dataGrafik = useMemo(() => {
    const totalPerRW = Object.fromEntries(
      DAFTAR_RW.map((rw) => [rw, 0])
    );

    dataSetoran.forEach((item) => {
      const tahun = ambilTahun(item);

      const bulan = ambilIndeksBulan(
        ambilNilai(item, ['bulan', 'Bulan'])
      );

      if (
        tahun !== tahunGrafik ||
        bulan !== bulanGrafik
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
          borderRadius: 5,
          barPercentage: 0.6,
        },
      ],
    };
  }, [
    dataSetoran,
    bulanGrafik,
    tahunGrafik,
  ]);

  // Grafik garis: mengikuti pilihan tahun.
  const trenTahunan = useMemo(() => {
    const trenPerRW = Object.fromEntries(
      DAFTAR_RW.map((rw) => [
        rw,
        Array(12).fill(0),
      ])
    );

    dataSetoran.forEach((item) => {
      if (ambilTahun(item) !== tahunTren) {
        return;
      }

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
      datasets: DAFTAR_RW.map(
        (rw, indeks) => ({
          label: rw,
          data: trenPerRW[rw],
          borderColor: WARNA_RW[indeks],
          backgroundColor: WARNA_RW[indeks],
          pointRadius: 3,
          pointHoverRadius: 6,
          tension: 0.35,
        })
      ),
    };
  }, [dataSetoran, tahunTren]);

  // Mengelola perubahan formulir.
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((sebelumnya) => ({
      ...sebelumnya,
      [name]: value,
    }));
  };

  // Mengirim data ke Google Sheets.
  const kirimData = async (e) => {
    e.preventDefault();

    if (pengirimanAktif.current) {
      return;
    }

    const jenisSampah = [
      'plastik',
      'kertas',
      'logam',
      'kaca',
    ];

    const tidakValid = jenisSampah.some(
      (jenis) => {
        const nilai = formData[jenis];

        return (
          String(nilai).trim() === '' ||
          !Number.isFinite(Number(nilai)) ||
          Number(nilai) < 0
        );
      }
    );

    if (tidakValid) {
      alert(
        'Periksa berat setiap jenis sampah. Isian harus berupa angka nol atau lebih.'
      );
      return;
    }

    const dataKirim = {
      tahun: formData.tahun,
      bulan: formData.bulan,
      rw: formData.rw,
      plastik: Number(formData.plastik),
      kertas: Number(formData.kertas),
      logam: Number(formData.logam),
      kaca: Number(formData.kaca),
    };

    pengirimanAktif.current = true;
    setSedangMengirim(true);

    try {
      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(dataKirim),
      });

      if (!response.ok) {
        throw new Error(
          'Server gagal memproses permintaan.'
        );
      }

      const hasil = await response.json();

      if (hasil?.status !== 'success') {
        throw new Error(
          hasil?.message ||
            'Server belum mengonfirmasi penyimpanan data.'
        );
      }

      alert(
        `Berhasil! Setoran ${formData.rw} untuk ${formData.bulan} ${formData.tahun} berhasil disimpan ke Google Sheets.`
      );

      setFormData(buatFormAwal());

      await muatDataSetoran();
    } catch (error) {
      console.error(
        'Gagal menyimpan data:',
        error
      );

      alert(
        `Data belum dapat dipastikan tersimpan. ${
          error.message ||
          'Periksa koneksi dan akses Google Sheets.'
        }`
      );
    } finally {
      pengirimanAktif.current = false;
      setSedangMengirim(false);
    }
  };

  const pilihTab = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const namaTabAktif = {
    dashboard: 'Ringkasan Data',
    input: 'Pencatatan Setoran',
    rekap: 'Rekapitulasi Data',
    info: 'Informasi dan Panduan',
  }[activeTab];

  const getTabStyle = (tabName) => {
    const aktif = activeTab === tabName;

    return {
      padding: '14px 18px',
      cursor: 'pointer',
      fontWeight: '600',
      background: aktif
        ? 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)'
        : '#ffffff',
      color: aktif ? '#ffffff' : '#475569',
      borderRadius: '10px',
      transition: 'all 0.2s ease',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      boxShadow: aktif
        ? '0 4px 12px rgba(15, 118, 110, 0.2)'
        : '0 1px 3px rgba(0, 0, 0, 0.04)',
      border: aktif
        ? '1px solid transparent'
        : '1px solid #e2e8f0',
      flex: '1 1 180px',
      minWidth: '180px',
      justifyContent: 'center',
      boxSizing: 'border-box',
    };
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-color)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <main
        style={{
          padding: '32px 24px',
          maxWidth: '1200px',
          margin: '0 auto',
          flex: 1,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Header />

        <nav
          aria-label="Navigasi utama"
          style={{ marginBottom: '32px' }}
        >
          <div
            className="mobile-menu-bar"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              background: '#ffffff',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <span
              style={{
                fontWeight: '600',
                fontSize: '14px',
                color: '#0f766e',
              }}
            >
              Halaman: {namaTabAktif}
            </span>

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen((terbuka) => !terbuka)
              }
              aria-expanded={mobileMenuOpen}
              aria-controls="pilihan-halaman"
              style={{
                background: '#0f766e',
                color: '#ffffff',
                border: 'none',
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                flexShrink: 0,
              }}
            >
              {mobileMenuOpen
                ? 'Tutup Menu'
                : '☰ Pilih Halaman'}
            </button>
          </div>

          <div
            id="pilihan-halaman"
            className="nav-tabs-container"
            style={{
              display: mobileMenuOpen ? 'grid' : 'none',
              gridTemplateColumns: 'minmax(0, 1fr)',
              gap: '8px',
              marginTop: '12px',
            }}
          >
            <button
              type="button"
              style={getTabStyle('dashboard')}
              onClick={() => pilihTab('dashboard')}
            >
              📊 Ringkasan Data
            </button>

            <button
              type="button"
              style={getTabStyle('input')}
              onClick={() => pilihTab('input')}
            >
              📝 Pencatatan Setoran
            </button>

            <button
              type="button"
              style={getTabStyle('rekap')}
              onClick={() => pilihTab('rekap')}
            >
              🗂️ Rekapitulasi Data
            </button>

            <button
              type="button"
              style={getTabStyle('info')}
              onClick={() => pilihTab('info')}
            >
              📖 Informasi dan Panduan
            </button>
          </div>
        </nav>

        <style>{`
          @media (min-width: 768px) {
            .mobile-menu-bar {
              display: none !important;
            }

            .nav-tabs-container {
              display: flex !important;
              flex-wrap: wrap !important;
            }
          }

          @media (max-width: 767px) {
            .mobile-menu-bar {
              display: flex !important;
            }

            .nav-tabs-container {
              grid-template-columns: minmax(0, 1fr) !important;
            }

            .nav-tabs-container button {
              width: 100%;
              min-width: 0 !important;
              justify-content: flex-start !important;
              padding: 14px 16px !important;
            }
          }

          @media (max-width: 480px) {
            .app-container {
              padding: 20px 12px !important;
            }
          }
        `}</style>

        {pesanKesalahan && (
          <div
            role="alert"
            style={{
              background: '#fff7ed',
              color: '#9a3412',
              border: '1px solid #fed7aa',
              borderRadius: '10px',
              padding: '14px 16px',
              marginBottom: '20px',
              fontSize: '14px',
              lineHeight: '1.6',
            }}
          >
            <p style={{ margin: '0 0 10px' }}>
              {pesanKesalahan}
            </p>

            <button
              type="button"
              onClick={muatDataSetoran}
              style={{
                background: '#ffffff',
                color: '#9a3412',
                border: '1px solid #fdba74',
                borderRadius: '7px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Coba Muat Kembali
            </button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <section aria-label="Ringkasan dan grafik setoran">
            {sedangMemuat && (
              <p role="status">
                Sedang memuat data setoran...
              </p>
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
              sedangMemuat={sedangMemuat}
            />
          </section>
        )}

        {activeTab === 'input' && (
          <section
            aria-label="Formulir pencatatan setoran"
            style={{
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            {sedangMengirim && (
              <p role="status">
                Sedang menyimpan data setoran...
              </p>
            )}

            <FormInput
              formData={formData}
              handleInputChange={handleInputChange}
              kirimData={kirimData}
            />
          </section>
        )}

        {activeTab === 'rekap' && (
          <section aria-label="Rekapitulasi data setoran">
            <TabelData />
          </section>
        )}

        {activeTab === 'info' && (
          <section aria-label="Informasi dan panduan bank sampah">
            <InfoBankSampah />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;