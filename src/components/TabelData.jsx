
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const DAFTAR_BULAN = [
  'Januari', 'Februari', 'Maret', 'April',
  'Mei', 'Juni', 'Juli', 'Agustus',
  'September', 'Oktober', 'November', 'Desember',
];

const DAFTAR_TAHUN = [
  '2026', '2027', '2028', '2029', '2030',
];

const DAFTAR_RW = [
  'RW 01', 'RW 02', 'RW 03', 'RW 04', 'RW 05',
];

const WARNA = {
  hijauTua: 'FF115E59',
  hijau: 'FF0F766E',
  hijauMuda: 'FFCCFBF1',
  hijauPucat: 'FFF0FDFA',
  putih: 'FFFFFFFF',
  teks: 'FF1E293B',
  abu: 'FF64748B',
  garis: 'FFCBD5E1',
  latar: 'FFF8FAFC',
};

const formatAngka = (nilai) =>
  new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Number(nilai) || 0);

function ambilNilai(item, daftarKolom) {
  for (const kolom of daftarKolom) {
    if (
      item?.[kolom] !== undefined &&
      item?.[kolom] !== null &&
      item?.[kolom] !== ''
    ) {
      return item[kolom];
    }
  }

  return '';
}

function angkaAman(nilai) {
  if (typeof nilai === 'number') {
    return Number.isFinite(nilai) ? nilai : 0;
  }

  const angka = Number(
    String(nilai ?? '').trim().replace(',', '.')
  );

  return Number.isFinite(angka) ? angka : 0;
}

function ambilTimestamp(item) {
  return ambilNilai(item, [
    'timestamp', 'Timestamp', 'waktu', 'Waktu',
    'tanggal', 'Tanggal',
  ]);
}

function ambilIndeksBulan(nilai) {
  const bulan = String(nilai ?? '').trim().toLowerCase();

  if (/^\d{1,2}$/.test(bulan)) {
    const angka = Number(bulan);
    return angka >= 1 && angka <= 12 ? angka - 1 : -1;
  }

  const alias = [
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

  return alias.findIndex(([, pilihan]) =>
    pilihan.some((nama) => bulan.startsWith(nama))
  );
}

function ambilBulan(item) {
  const bulan = ambilNilai(item, ['bulan', 'Bulan']);

  if (bulan !== '') {
    return String(bulan).trim();
  }

  const waktu = ambilTimestamp(item);
  const tanggal = waktu ? new Date(waktu) : null;

  return tanggal && !Number.isNaN(tanggal.getTime())
    ? DAFTAR_BULAN[tanggal.getMonth()]
    : '';
}

function ambilTahun(item) {
  const tahun = String(
    ambilNilai(item, ['tahun', 'Tahun']) ?? ''
  ).trim();

  const cocok = tahun.match(/(?:^|\D)(20\d{2})(?:\D|$)/);

  if (cocok) return cocok[1];

  const waktu = ambilTimestamp(item);
  const tanggal = waktu ? new Date(waktu) : null;

  return tanggal && !Number.isNaN(tanggal.getTime())
    ? String(tanggal.getFullYear())
    : tahun;
}

function ambilRW(item) {
  const nilai = String(
    ambilNilai(item, [
      'rw', 'RW', 'Wilayah', 'wilayah',
      'Nomor_RW', 'nomor_rw', 'Nomor RW',
    ]) ?? ''
  )
    .trim()
    .toUpperCase()
    .replace(/[_\s]+/g, ' ');

  const cocok =
    nilai.match(/(?:^|\s)RW\s*0?([1-5])$/) ||
    nilai.match(/^0?([1-5])$/);

  return cocok
    ? `RW ${cocok[1].padStart(2, '0')}`
    : nilai || '-';
}

function ambilBerat(item, jenis) {
  return angkaAman(
    ambilNilai(item, [
      jenis,
      jenis.charAt(0).toUpperCase() + jenis.slice(1),
      `${jenis}_kg`,
    ])
  );
}

function ambilTotalBerat(item) {
  const total = ambilNilai(item, [
    'total', 'Total', 'total_berat',
    'Total_Berat', 'TotalBerat',
  ]);

  if (total !== '') return angkaAman(total);

  return (
    ambilBerat(item, 'plastik') +
    ambilBerat(item, 'kertas') +
    ambilBerat(item, 'logam') +
    ambilBerat(item, 'kaca')
  );
}

function formatWaktu(nilai) {
  if (!nilai) return '-';

  const tanggal = new Date(nilai);

  if (Number.isNaN(tanggal.getTime())) {
    return String(nilai);
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(tanggal);
}

function buatNamaBerkas(ekstensi, bulan, tahun, rw) {
  const nama = [
    'Rekap_Bank_Sampah',
    bulan === 'Semua' ? 'Semua_Bulan' : bulan,
    tahun === 'Semua' ? 'Semua_Tahun' : tahun,
    rw === 'Semua' ? 'Semua_RW' : rw.replace(/\s+/g, '_'),
  ].join('_');

  return `${nama}.${ekstensi}`.replace(/[^\w.-]/g, '_');
}

function unduhBlob(blob, namaBerkas) {
  const url = URL.createObjectURL(blob);
  const tautan = document.createElement('a');

  tautan.href = url;
  tautan.download = namaBerkas;

  document.body.appendChild(tautan);
  tautan.click();
  tautan.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/*
 * Memuat logo dari public/logo kop.png.
 * Area putih di sekeliling logo dipotong supaya
 * lambang lebih jelas saat ditampilkan pada PDF.
 */
async function muatLogoKop() {
  const lokasiLogo =
    `${import.meta.env.BASE_URL}logo%20kop.png`;

  const response = await fetch(lokasiLogo);

  if (!response.ok) {
    throw new Error(
      'Logo kop.png tidak ditemukan di folder public.'
    );
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  try {
    return await new Promise((resolve, reject) => {
      const gambar = new Image();

      gambar.onload = () => {
        try {
          const kanvas = document.createElement('canvas');
          kanvas.width = gambar.naturalWidth;
          kanvas.height = gambar.naturalHeight;

          const konteks = kanvas.getContext('2d', {
            willReadFrequently: true,
          });

          if (!konteks) {
            throw new Error('Logo tidak dapat diproses.');
          }

          konteks.drawImage(gambar, 0, 0);

          const piksel = konteks.getImageData(
            0, 0, kanvas.width, kanvas.height
          ).data;

          let kiri = kanvas.width;
          let atas = kanvas.height;
          let kanan = -1;
          let bawah = -1;

          for (let y = 0; y < kanvas.height; y += 1) {
            for (let x = 0; x < kanvas.width; x += 1) {
              const indeks = (y * kanvas.width + x) * 4;

              const merah = piksel[indeks];
              const hijau = piksel[indeks + 1];
              const biru = piksel[indeks + 2];
              const alpha = piksel[indeks + 3];

              const bukanPutih =
                alpha > 15 &&
                (
                  merah < 242 ||
                  hijau < 242 ||
                  biru < 242
                );

              if (bukanPutih) {
                kiri = Math.min(kiri, x);
                atas = Math.min(atas, y);
                kanan = Math.max(kanan, x);
                bawah = Math.max(bawah, y);
              }
            }
          }

          if (kanan < kiri || bawah < atas) {
            kiri = 0;
            atas = 0;
            kanan = kanvas.width - 1;
            bawah = kanvas.height - 1;
          }

          const tambahan = Math.round(
            Math.max(
              kanan - kiri + 1,
              bawah - atas + 1
            ) * 0.025
          );

          kiri = Math.max(0, kiri - tambahan);
          atas = Math.max(0, atas - tambahan);
          kanan = Math.min(kanvas.width - 1, kanan + tambahan);
          bawah = Math.min(kanvas.height - 1, bawah + tambahan);

          const lebarPotong = kanan - kiri + 1;
          const tinggiPotong = bawah - atas + 1;

          const kanvasHasil = document.createElement('canvas');
          kanvasHasil.width = lebarPotong;
          kanvasHasil.height = tinggiPotong;

          const konteksHasil = kanvasHasil.getContext('2d');

          if (!konteksHasil) {
            throw new Error('Logo tidak dapat disiapkan.');
          }

          konteksHasil.drawImage(
            kanvas,
            kiri,
            atas,
            lebarPotong,
            tinggiPotong,
            0,
            0,
            lebarPotong,
            tinggiPotong
          );

          resolve({
            data: kanvasHasil.toDataURL('image/png'),
            rasio: lebarPotong / tinggiPotong,
          });
        } catch (error) {
          reject(error);
        }
      };

      gambar.onerror = () => {
        reject(new Error('File logo kop tidak dapat dibaca.'));
      };

      gambar.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function beriBorder(sel, warna = WARNA.garis) {
  sel.border = {
    top: { style: 'thin', color: { argb: warna } },
    left: { style: 'thin', color: { argb: warna } },
    bottom: { style: 'thin', color: { argb: warna } },
    right: { style: 'thin', color: { argb: warna } },
  };
}

function gayaHeaderTabel(baris) {
  baris.height = 28;

  baris.eachCell({ includeEmpty: true }, (sel) => {
    sel.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: WARNA.hijauTua },
    };

    sel.font = {
      name: 'Arial',
      size: 10,
      bold: true,
      color: { argb: WARNA.putih },
    };

    sel.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };

    beriBorder(sel, WARNA.hijauTua);
  });
}

function gabungJudul(
  sheet,
  nomorBaris,
  teks,
  kolomAkhir,
  opsi = {}
) {
  sheet.mergeCells(nomorBaris, 1, nomorBaris, kolomAkhir);

  const sel = sheet.getCell(nomorBaris, 1);
  sel.value = teks;

  sel.font = {
    name: 'Arial',
    size: opsi.ukuran || 10,
    bold: opsi.tebal !== false,
    color: { argb: opsi.warna || WARNA.hijauTua },
  };

  sel.alignment = {
    horizontal: 'center',
    vertical: 'middle',
    wrapText: true,
  };

  sel.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: opsi.latar || WARNA.putih },
  };

  sheet.getRow(nomorBaris).height = opsi.tinggi || 21;
}

const TabelData = ({ data = [], token = '', onRefresh }) => {
  // Data tabel berasal dari App.jsx setelah sesi internal diverifikasi.
  const [dataSetoran, setDataSetoran] = useState(
    Array.isArray(data) ? data : []
  );

  const [loading, setLoading] = useState(false);
  const [pesanKesalahan, setPesanKesalahan] = useState('');

  const [selectedBulan, setSelectedBulan] = useState('Semua');
  const [selectedTahun, setSelectedTahun] = useState('Semua');
  const [selectedRW, setSelectedRW] = useState('Semua');

  const [jenisUnduhan, setJenisUnduhan] = useState('');

  const muatData = useCallback(async () => {
    if (!token || typeof onRefresh !== 'function') {
      setPesanKesalahan(
        'Sesi internal tidak tersedia. Silakan masuk kembali.'
      );
      return false;
    }

    setLoading(true);
    setPesanKesalahan('');

    try {
      const berhasil = await onRefresh();

      if (berhasil === false) {
        throw new Error('Data internal gagal dimuat. Coba kembali.');
      }

      return true;
    } catch (error) {
      console.error('Gagal memuat data internal:', error);

      setPesanKesalahan(
        error.message || 'Data internal gagal dimuat. Coba kembali.'
      );

      return false;
    } finally {
      setLoading(false);
    }
  }, [onRefresh, token]);

  // Sinkronkan data dari App.jsx ketika backend mengembalikan hasil terbaru.
  useEffect(() => {
    setDataSetoran(Array.isArray(data) ? data : []);
    setLoading(false);
    setPesanKesalahan('');
  }, [data]);

  const filteredData = useMemo(() => {
    return dataSetoran.filter((item) => {
      const cocokBulan =
        selectedBulan === 'Semua' ||
        ambilIndeksBulan(ambilBulan(item)) ===
          DAFTAR_BULAN.indexOf(selectedBulan);

      const cocokTahun =
        selectedTahun === 'Semua' ||
        ambilTahun(item) === selectedTahun;

      const cocokRW =
        selectedRW === 'Semua' ||
        ambilRW(item) === selectedRW;

      return cocokBulan && cocokTahun && cocokRW;
    });
  }, [
    dataSetoran,
    selectedBulan,
    selectedTahun,
    selectedRW,
  ]);

  const ringkasan = useMemo(() => {
    return filteredData.reduce(
      (hasil, item) => {
        hasil.plastik += ambilBerat(item, 'plastik');
        hasil.kertas += ambilBerat(item, 'kertas');
        hasil.logam += ambilBerat(item, 'logam');
        hasil.kaca += ambilBerat(item, 'kaca');
        hasil.total += ambilTotalBerat(item);

        return hasil;
      },
      {
        plastik: 0,
        kertas: 0,
        logam: 0,
        kaca: 0,
        total: 0,
      }
    );
  }, [filteredData]);

  const infoPeriode = {
    bulan:
      selectedBulan === 'Semua'
        ? 'SEMUA BULAN'
        : selectedBulan.toUpperCase(),
    tahun:
      selectedTahun === 'Semua'
        ? 'SEMUA TAHUN'
        : selectedTahun,
    rw:
      selectedRW === 'Semua'
        ? 'SEMUA RW'
        : selectedRW,
  };

  // ==========================================================
  // EKSPOR EXCEL (.XLSX)
  // ==========================================================
  const siapkanWorkbook = useCallback(() => {
    const workbook = new ExcelJS.Workbook();

    workbook.creator =
      'Sistem Informasi Bank Sampah Kelurahan Pinang Ranti';
    workbook.title = 'Laporan Rekapitulasi Data Bank Sampah';
    workbook.subject =
      `${infoPeriode.bulan} ${infoPeriode.tahun} - ${infoPeriode.rw}`;
    workbook.created = new Date();

    const ringkasanSheet = workbook.addWorksheet('Ringkasan', {
      views: [{ showGridLines: false }],
      pageSetup: {
        paperSize: 9,
        orientation: 'portrait',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 1,
      },
    });

    ringkasanSheet.columns = [
      { width: 30 },
      { width: 23 },
      { width: 20 },
    ];

    gabungJudul(
      ringkasanSheet, 1,
      'PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA', 3
    );
    gabungJudul(
      ringkasanSheet, 2,
      'KOTA ADMINISTRASI JAKARTA TIMUR', 3
    );
    gabungJudul(
      ringkasanSheet, 3,
      'KECAMATAN MAKASAR', 3
    );
    gabungJudul(
      ringkasanSheet, 4,
      'KELURAHAN PINANG RANTI', 3,
      { ukuran: 12 }
    );
    gabungJudul(
      ringkasanSheet, 5,
      'Jl. SMA Negeri 48 Telp. 8005640 | Kodepos: 13560', 3,
      { ukuran: 9, tebal: false, warna: WARNA.abu }
    );

    ringkasanSheet.getRow(6).height = 8;

    gabungJudul(
      ringkasanSheet, 7,
      'LAPORAN REKAPITULASI DATA BANK SAMPAH', 3,
      { ukuran: 13, tinggi: 32, latar: WARNA.hijauPucat }
    );
    gabungJudul(
      ringkasanSheet, 8,
      `Periode: ${infoPeriode.bulan} ${infoPeriode.tahun} | Wilayah: ${infoPeriode.rw}`,
      3,
      { ukuran: 10, tebal: false, tinggi: 25 }
    );
    gabungJudul(
      ringkasanSheet, 9,
      `Dibuat pada: ${formatWaktu(new Date())}`,
      3,
      { ukuran: 9, tebal: false, warna: WARNA.abu }
    );

    gabungJudul(
      ringkasanSheet, 11,
      'RINGKASAN BERAT SAMPAH', 3,
      { ukuran: 11, tinggi: 26, latar: WARNA.hijauMuda }
    );

    const kepalaRingkasan = ringkasanSheet.getRow(12);
    kepalaRingkasan.values = [
      'Jenis Sampah',
      'Total Berat (kg)',
    ];
    gayaHeaderTabel(kepalaRingkasan);

    const daftarRingkasan = [
      ['Plastik', ringkasan.plastik],
      ['Kertas', ringkasan.kertas],
      ['Logam', ringkasan.logam],
      ['Kaca', ringkasan.kaca],
      ['TOTAL KESELURUHAN', ringkasan.total],
    ];

    daftarRingkasan.forEach(([nama, nilai], indeks) => {
      const nomorBaris = 13 + indeks;

      ringkasanSheet.getCell(nomorBaris, 1).value = nama;
      ringkasanSheet.getCell(nomorBaris, 2).value = nilai;

      for (let kolom = 1; kolom <= 2; kolom += 1) {
        const sel = ringkasanSheet.getCell(nomorBaris, kolom);

        beriBorder(sel);

        sel.font = {
          name: 'Arial',
          size: 10,
          bold: indeks === 4,
          color: { argb: WARNA.teks },
        };

        sel.alignment = {
          vertical: 'middle',
          horizontal: kolom === 2 ? 'right' : 'left',
        };

        if (kolom === 2) sel.numFmt = '#,##0.0';

        if (indeks === 4) {
          sel.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: WARNA.hijauMuda },
          };
        }
      }

      ringkasanSheet.getRow(nomorBaris).height = 23;
    });

    gabungJudul(
      ringkasanSheet, 20,
      'REKAPITULASI PER WILAYAH RW', 3,
      { ukuran: 11, tinggi: 26, latar: WARNA.hijauMuda }
    );

    const kepalaRW = ringkasanSheet.getRow(21);
    kepalaRW.values = [
      'Wilayah RW',
      'Jumlah Catatan',
      'Total Berat (kg)',
    ];
    gayaHeaderTabel(kepalaRW);

    DAFTAR_RW.forEach((rw, indeks) => {
      const dataRW = filteredData.filter(
        (item) => ambilRW(item) === rw
      );

      const nomorBaris = 22 + indeks;

      const totalRW = dataRW.reduce(
        (jumlah, item) => jumlah + ambilTotalBerat(item),
        0
      );

      ringkasanSheet.getCell(nomorBaris, 1).value = rw;
      ringkasanSheet.getCell(nomorBaris, 2).value = dataRW.length;
      ringkasanSheet.getCell(nomorBaris, 3).value = totalRW;

      for (let kolom = 1; kolom <= 3; kolom += 1) {
        const sel = ringkasanSheet.getCell(nomorBaris, kolom);

        beriBorder(sel);

        sel.font = {
          name: 'Arial',
          size: 10,
          color: { argb: WARNA.teks },
        };

        sel.alignment = {
          vertical: 'middle',
          horizontal: kolom === 1 ? 'left' : 'right',
        };

        if (kolom === 3) sel.numFmt = '#,##0.0';

        if (indeks % 2 === 1) {
          sel.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: WARNA.latar },
          };
        }
      }
    });

    const detailSheet = workbook.addWorksheet('Detail Data', {
      views: [
        {
          state: 'frozen',
          ySplit: 10,
          showGridLines: false,
        },
      ],
      pageSetup: {
        paperSize: 9,
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        margins: {
          left: 0.25,
          right: 0.25,
          top: 0.5,
          bottom: 0.5,
          header: 0.2,
          footer: 0.2,
        },
      },
    });

    detailSheet.columns = [
      { width: 7 },
      { width: 23 },
      { width: 10 },
      { width: 15 },
      { width: 14 },
      { width: 14 },
      { width: 14 },
      { width: 13 },
      { width: 12 },
      { width: 17 },
    ];

    gabungJudul(
      detailSheet, 1,
      'PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA', 10
    );
    gabungJudul(
      detailSheet, 2,
      'KOTA ADMINISTRASI JAKARTA TIMUR', 10
    );
    gabungJudul(
      detailSheet, 3,
      'KECAMATAN MAKASAR', 10
    );
    gabungJudul(
      detailSheet, 4,
      'KELURAHAN PINANG RANTI', 10,
      { ukuran: 12 }
    );
    gabungJudul(
      detailSheet, 5,
      'Jl. SMA Negeri 48 Telp. 8005640 | Kodepos: 13560', 10,
      { ukuran: 9, tebal: false, warna: WARNA.abu }
    );

    detailSheet.getRow(6).height = 8;

    gabungJudul(
      detailSheet, 7,
      'LAPORAN REKAPITULASI DATA BANK SAMPAH', 10,
      { ukuran: 14, tinggi: 31, latar: WARNA.hijauPucat }
    );
    gabungJudul(
      detailSheet, 8,
      `Periode: ${infoPeriode.bulan} ${infoPeriode.tahun} | Wilayah: ${infoPeriode.rw}`,
      10,
      { ukuran: 10, tebal: false, tinggi: 24 }
    );
    gabungJudul(
      detailSheet, 9,
      'Detail catatan setoran Bank Sampah Kelurahan Pinang Ranti',
      10,
      { ukuran: 9, tebal: false, warna: WARNA.abu }
    );

    const kepalaDetail = detailSheet.getRow(10);
    kepalaDetail.values = [
      'No.', 'Waktu Pencatatan', 'Tahun', 'Bulan',
      'Wilayah RW', 'Plastik (kg)', 'Kertas (kg)',
      'Logam (kg)', 'Kaca (kg)', 'Total Berat (kg)',
    ];
    gayaHeaderTabel(kepalaDetail);

    filteredData.forEach((item, indeks) => {
      const baris = detailSheet.getRow(indeks + 11);

      const waktu = ambilTimestamp(item);
      const tanggal = waktu ? new Date(waktu) : null;

      const tanggalValid =
        tanggal && !Number.isNaN(tanggal.getTime());

      baris.values = [
        indeks + 1,
        tanggalValid ? tanggal : waktu || '-',
        ambilTahun(item) || '-',
        ambilBulan(item) || '-',
        ambilRW(item),
        ambilBerat(item, 'plastik'),
        ambilBerat(item, 'kertas'),
        ambilBerat(item, 'logam'),
        ambilBerat(item, 'kaca'),
        ambilTotalBerat(item),
      ];

      baris.height = 22;

      baris.eachCell({ includeEmpty: true }, (sel, kolom) => {
        beriBorder(sel);

        sel.font = {
          name: 'Arial',
          size: 9,
          color: { argb: WARNA.teks },
        };

        sel.alignment = {
          vertical: 'middle',
          horizontal:
            kolom === 1 || (kolom >= 3 && kolom <= 5)
              ? 'center'
              : kolom >= 6
                ? 'right'
                : 'left',
          wrapText: true,
        };

        if (indeks % 2 === 1) {
          sel.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: WARNA.latar },
          };
        }
      });

      if (tanggalValid) {
        baris.getCell(2).numFmt = 'dd mmm yyyy hh:mm';
      }

      [6, 7, 8, 9, 10].forEach((kolom) => {
        baris.getCell(kolom).numFmt = '#,##0.0';
      });
    });

    const nomorBarisTotal = 11 + filteredData.length;
    const totalRow = detailSheet.getRow(nomorBarisTotal);

    totalRow.values = [
      'TOTAL KESELURUHAN', '', '', '', '',
      ringkasan.plastik,
      ringkasan.kertas,
      ringkasan.logam,
      ringkasan.kaca,
      ringkasan.total,
    ];

    detailSheet.mergeCells(
      nomorBarisTotal, 1, nomorBarisTotal, 5
    );

    totalRow.height = 27;

    totalRow.eachCell({ includeEmpty: true }, (sel, kolom) => {
      beriBorder(sel, WARNA.hijauTua);

      sel.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: WARNA.hijauMuda },
      };

      sel.font = {
        name: 'Arial',
        size: 10,
        bold: true,
        color: { argb: WARNA.hijauTua },
      };

      sel.alignment = {
        vertical: 'middle',
        horizontal:
          kolom === 1 ? 'left' : kolom >= 6 ? 'right' : 'center',
      };

      if (kolom >= 6) sel.numFmt = '#,##0.0';
    });

    if (filteredData.length > 0) {
      detailSheet.autoFilter = {
        from: 'A10',
        to: `J${10 + filteredData.length}`,
      };
    }

    detailSheet.pageSetup.printArea =
      `A1:J${nomorBarisTotal}`;

    detailSheet.pageSetup.printTitlesRow = '10:10';

    detailSheet.headerFooter.oddFooter =
      '&LBank Sampah Kelurahan Pinang Ranti' +
      '&CHalaman &P dari &N';

    return workbook;
  }, [filteredData, infoPeriode, ringkasan]);

  const handleExportExcel = async () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data yang sesuai untuk diunduh.');
      return;
    }

    setJenisUnduhan('excel');

    try {
      const workbook = siapkanWorkbook();
      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      unduhBlob(
        blob,
        buatNamaBerkas(
          'xlsx', selectedBulan, selectedTahun, selectedRW
        )
      );
    } catch (error) {
      console.error('Gagal membuat Excel:', error);
      alert('Excel belum berhasil dibuat. Coba kembali.');
    } finally {
      setJenisUnduhan('');
    }
  };

  // ==========================================================
  // EKSPOR PDF
  // ==========================================================
  const handleExportPDF = async () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data yang sesuai untuk diunduh.');
      return;
    }

    setJenisUnduhan('pdf');

    try {
      const logo = await muatLogoKop();

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const lebarHalaman = doc.internal.pageSize.getWidth();
      const tinggiHalaman = doc.internal.pageSize.getHeight();

      const margin = 8;
      const marginKop = 15;

      // Logo diperbesar supaya proporsinya lebih mendekati SK asli.
      const tinggiLogoMaks = 29;
      const lebarLogoMaks = 31;

      const lebarLogo = Math.min(
        lebarLogoMaks,
        tinggiLogoMaks * logo.rasio
      );

      const tinggiLogoSebenarnya = lebarLogo / logo.rasio;
      const posisiLogoX = marginKop + 5;

      // Blok tulisan tetap terpusat pada halaman penuh.
      const pusatKop = lebarHalaman / 2;
      const garisKopY = 41.5;

      const gambarKopSurat = () => {
        doc.addImage(
          logo.data,
          'PNG',
          posisiLogoX,
          7,
          lebarLogo,
          tinggiLogoSebenarnya
        );

        doc.setTextColor(30, 30, 30);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);

        doc.text(
          'PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA',
          pusatKop,
          10,
          { align: 'center' }
        );

        doc.text(
          'KOTA ADMINISTRASI JAKARTA TIMUR',
          pusatKop,
          16,
          { align: 'center' }
        );

        doc.text(
          'KECAMATAN MAKASAR',
          pusatKop,
          22,
          { align: 'center' }
        );

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11.5);

        doc.text(
          'KELURAHAN PINANG RANTI',
          pusatKop,
          28,
          { align: 'center' }
        );

        // Alamat tetap di tengah.
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);

        doc.text(
          'Jl. SMA Negeri 48 Telp. 8005640',
          pusatKop,
          35,
          { align: 'center' }
        );

        // Kode pos di ujung kanan, sejajar dengan alamat.
        // Tidak ada tulisan JAKARTA di bawah alamat.
        doc.text(
          'Kodepos : 13560',
          lebarHalaman - marginKop - 1,
          35,
          { align: 'right' }
        );

        // Garis kop surat.
        doc.setDrawColor(30, 30, 30);
        doc.setLineWidth(0.6);

        doc.line(
          marginKop,
          garisKopY,
          lebarHalaman - marginKop,
          garisKopY
        );
      };

      gambarKopSurat();

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(13);

      doc.text(
        'LAPORAN REKAPITULASI DATA BANK SAMPAH',
        lebarHalaman / 2,
        48,
        { align: 'center' }
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      doc.text(
        `Periode: ${infoPeriode.bulan} ${infoPeriode.tahun} | Wilayah: ${infoPeriode.rw}`,
        lebarHalaman / 2,
        54,
        { align: 'center' }
      );

      const ringkasanKartu = [
        ['JUMLAH CATATAN', String(filteredData.length)],
        [
          'TOTAL BERAT SAMPAH',
          `${formatAngka(ringkasan.total)} kg`,
        ],
        ['TANGGAL DIBUAT', formatWaktu(new Date())],
      ];

      const jarakKartu = 4;

      const lebarKartu =
        (
          lebarHalaman -
          margin * 2 -
          jarakKartu * 2
        ) / 3;

      ringkasanKartu.forEach(
        ([judul, nilai], indeks) => {
          const x =
            margin +
            indeks * (lebarKartu + jarakKartu);

          doc.setFillColor(240, 253, 250);
          doc.setDrawColor(153, 246, 228);

          doc.roundedRect(
            x,
            59,
            lebarKartu,
            12,
            1.5,
            1.5,
            'FD'
          );

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(15, 118, 110);
          doc.text(judul, x + 3, 63);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(30, 41, 59);
          doc.text(nilai, x + 3, 68);
        }
      );

      const barisDataPDF = filteredData.map(
        (item, indeks) => [
          String(indeks + 1),
          formatWaktu(ambilTimestamp(item)),
          ambilTahun(item) || '-',
          ambilBulan(item) || '-',
          ambilRW(item),
          formatAngka(ambilBerat(item, 'plastik')),
          formatAngka(ambilBerat(item, 'kertas')),
          formatAngka(ambilBerat(item, 'logam')),
          formatAngka(ambilBerat(item, 'kaca')),
          formatAngka(ambilTotalBerat(item)),
        ]
      );

      autoTable(doc, {
        startY: 72,

        margin: {
          left: margin,
          right: margin,
          top: 46,
          bottom: 14,
        },

        head: [[
          'No.',
          'Waktu Pencatatan',
          'Tahun',
          'Bulan',
          'Wilayah RW',
          'Plastik (kg)',
          'Kertas (kg)',
          'Logam (kg)',
          'Kaca (kg)',
          'Total Berat (kg)',
        ]],

        body: barisDataPDF,

        foot: [[
          {
            content: 'TOTAL KESELURUHAN',
            colSpan: 5,
            styles: { halign: 'left' },
          },
          formatAngka(ringkasan.plastik),
          formatAngka(ringkasan.kertas),
          formatAngka(ringkasan.logam),
          formatAngka(ringkasan.kaca),
          formatAngka(ringkasan.total),
        ]],

        showFoot: 'lastPage',
        theme: 'grid',

        styles: {
          font: 'helvetica',
          fontSize: 7,
          cellPadding: 2,
          textColor: [30, 41, 59],
          lineColor: [203, 213, 225],
          lineWidth: 0.15,
          overflow: 'linebreak',
          valign: 'middle',
        },

        headStyles: {
          fillColor: [17, 94, 89],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
        },

        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },

        footStyles: {
          fillColor: [204, 251, 241],
          textColor: [17, 94, 89],
          fontStyle: 'bold',
          lineColor: [15, 118, 110],
        },

        columnStyles: {
          0: { cellWidth: 9, halign: 'center' },
          1: { cellWidth: 38 },
          2: { cellWidth: 13, halign: 'center' },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 17, halign: 'center' },
          5: { halign: 'right' },
          6: { halign: 'right' },
          7: { halign: 'right' },
          8: { halign: 'right' },
          9: { halign: 'right' },
        },

        // Kop diulang pada setiap halaman PDF.
        willDrawPage: () => {
          gambarKopSurat();
        },

        didDrawPage: () => {
          doc.setDrawColor(203, 213, 225);
          doc.setLineWidth(0.2);

          doc.line(
            margin,
            tinggiHalaman - 10,
            lebarHalaman - margin,
            tinggiHalaman - 10
          );

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(100, 116, 139);

          doc.text(
            'Sistem Informasi Bank Sampah Kelurahan Pinang Ranti',
            margin,
            tinggiHalaman - 5
          );

          doc.text(
            `Halaman ${doc.internal.getNumberOfPages()}`,
            lebarHalaman - margin,
            tinggiHalaman - 5,
            { align: 'right' }
          );
        },
      });

      doc.save(
        buatNamaBerkas(
          'pdf',
          selectedBulan,
          selectedTahun,
          selectedRW
        )
      );
    } catch (error) {
      console.error('Gagal membuat PDF:', error);

      alert(
        'PDF belum berhasil dibuat. Pastikan file public/logo kop.png tersedia dan coba kembali.'
      );
    } finally {
      setJenisUnduhan('');
    }
  };

  const resetFilter = () => {
    setSelectedBulan('Semua');
    setSelectedTahun('Semua');
    setSelectedRW('Semua');
  };

  return (
    <>
      <section
        className="card tabel-data-card"
        aria-label="Rekapitulasi data setoran bank sampah"
      >
        <header className="tabel-kepala">
          <div className="tabel-judul-kelompok">
            <p className="tabel-kicker">
              ADMINISTRASI BANK SAMPAH
            </p>

            <h2>Rekapitulasi Data Setoran</h2>

            <p>
              Lihat dan unduh catatan setoran berdasarkan
              bulan, tahun, dan wilayah RW.
            </p>
          </div>

          <div className="tabel-aksi-unduh">
            <button
              type="button"
              className="tabel-tombol-unduh"
              onClick={handleExportExcel}
              disabled={
                loading ||
                Boolean(jenisUnduhan) ||
                filteredData.length === 0
              }
            >
              {jenisUnduhan === 'excel'
                ? 'Menyiapkan Excel...'
                : 'Unduh Excel'}
            </button>

            <button
              type="button"
              className="tabel-tombol-unduh tabel-tombol-pdf"
              onClick={handleExportPDF}
              disabled={
                loading ||
                Boolean(jenisUnduhan) ||
                filteredData.length === 0
              }
            >
              {jenisUnduhan === 'pdf'
                ? 'Menyiapkan PDF...'
                : 'Unduh PDF'}
            </button>
          </div>
        </header>

        <div className="tabel-filter-panel">
          <div className="tabel-filter-heading">
            <div>
              <h3>Saring Data</h3>
              <p>
                Pilih periode dan wilayah yang ingin dilihat
                maupun diunduh.
              </p>
            </div>

            <button
              type="button"
              className="tabel-tombol-reset"
              onClick={resetFilter}
            >
              Atur Ulang
            </button>
          </div>

          <div className="tabel-filter-grid">
            <div className="tabel-filter-kolom">
              <label htmlFor="filter-bulan">Bulan</label>

              <select
                id="filter-bulan"
                value={selectedBulan}
                onChange={(e) =>
                  setSelectedBulan(e.target.value)
                }
              >
                <option value="Semua">Semua Bulan</option>

                {DAFTAR_BULAN.map((bulan) => (
                  <option key={bulan} value={bulan}>
                    {bulan}
                  </option>
                ))}
              </select>
            </div>

            <div className="tabel-filter-kolom">
              <label htmlFor="filter-tahun">Tahun</label>

              <select
                id="filter-tahun"
                value={selectedTahun}
                onChange={(e) =>
                  setSelectedTahun(e.target.value)
                }
              >
                <option value="Semua">Semua Tahun</option>

                {DAFTAR_TAHUN.map((tahun) => (
                  <option key={tahun} value={tahun}>
                    {tahun}
                  </option>
                ))}
              </select>
            </div>

            <div className="tabel-filter-kolom">
              <label htmlFor="filter-rw">Wilayah RW</label>

              <select
                id="filter-rw"
                value={selectedRW}
                onChange={(e) =>
                  setSelectedRW(e.target.value)
                }
              >
                <option value="Semua">Semua Wilayah</option>

                {DAFTAR_RW.map((rw) => (
                  <option key={rw} value={rw}>
                    {rw}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="tabel-ringkasan">
          <div className="tabel-ringkasan-item">
            <span>Jumlah Catatan</span>

            <strong>
              {loading ? '...' : filteredData.length}
            </strong>
          </div>

          <div className="tabel-ringkasan-item tabel-total-item">
            <span>Total Sampah Terkumpul</span>

            <strong>
              {loading
                ? '...'
                : `${formatAngka(ringkasan.total)} kg`}
            </strong>
          </div>
        </div>

        {pesanKesalahan && (
          <div className="tabel-pesan-error" role="alert">
            <p>{pesanKesalahan}</p>

            <button type="button" onClick={muatData}>
              Coba Muat Kembali
            </button>
          </div>
        )}

        <div className="desktop-table-view">
          <table className="tabel-data-desktop">
            <thead>
              <tr>
                <th>Bulan</th>
                <th>Tahun</th>
                <th>Wilayah</th>
                <th>Plastik (kg)</th>
                <th>Kertas (kg)</th>
                <th>Logam (kg)</th>
                <th>Kaca (kg)</th>
                <th>Total (kg)</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="tabel-kosong">
                    Memuat data dari Google Sheets...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="tabel-kosong">
                    Tidak ada data yang sesuai dengan pilihan.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, indeks) => (
                  <tr
                    key={`${ambilTahun(item)}-${ambilBulan(item)}-${ambilRW(item)}-${indeks}`}
                  >
                    <td>{ambilBulan(item) || '-'}</td>
                    <td>{ambilTahun(item) || '-'}</td>

                    <td>
                      <span className="tabel-label-rw">
                        {ambilRW(item)}
                      </span>
                    </td>

                    <td className="tabel-angka">
                      {formatAngka(
                        ambilBerat(item, 'plastik')
                      )}
                    </td>

                    <td className="tabel-angka">
                      {formatAngka(
                        ambilBerat(item, 'kertas')
                      )}
                    </td>

                    <td className="tabel-angka">
                      {formatAngka(
                        ambilBerat(item, 'logam')
                      )}
                    </td>

                    <td className="tabel-angka">
                      {formatAngka(
                        ambilBerat(item, 'kaca')
                      )}
                    </td>

                    <td className="tabel-angka tabel-total-berat">
                      {formatAngka(
                        ambilTotalBerat(item)
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {!loading && filteredData.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="3">TOTAL</td>

                  <td className="tabel-angka">
                    {formatAngka(ringkasan.plastik)}
                  </td>

                  <td className="tabel-angka">
                    {formatAngka(ringkasan.kertas)}
                  </td>

                  <td className="tabel-angka">
                    {formatAngka(ringkasan.logam)}
                  </td>

                  <td className="tabel-angka">
                    {formatAngka(ringkasan.kaca)}
                  </td>

                  <td className="tabel-angka">
                    {formatAngka(ringkasan.total)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <div className="mobile-card-view">
          {loading ? (
            <div className="tabel-kartu-kosong">
              Memuat data setoran...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="tabel-kartu-kosong">
              Belum ada data untuk pilihan ini.
            </div>
          ) : (
            filteredData.map((item, indeks) => (
              <article
                className="tabel-setoran-card"
                key={`${ambilTahun(item)}-${ambilBulan(item)}-${ambilRW(item)}-${indeks}`}
              >
                <header className="tabel-setoran-card-header">
                  <div>
                    <span className="tabel-label-kecil">
                      Wilayah Setoran
                    </span>

                    <strong className="tabel-rw-mobile">
                      {ambilRW(item)}
                    </strong>
                  </div>

                  <span className="tabel-periode-mobile">
                    {ambilBulan(item)} {ambilTahun(item)}
                  </span>
                </header>

                <div className="tabel-rincian-mobile">
                  <div>
                    <span>Plastik</span>
                    <strong>
                      {formatAngka(
                        ambilBerat(item, 'plastik')
                      )} kg
                    </strong>
                  </div>

                  <div>
                    <span>Kertas</span>
                    <strong>
                      {formatAngka(
                        ambilBerat(item, 'kertas')
                      )} kg
                    </strong>
                  </div>

                  <div>
                    <span>Logam</span>
                    <strong>
                      {formatAngka(
                        ambilBerat(item, 'logam')
                      )} kg
                    </strong>
                  </div>

                  <div>
                    <span>Kaca</span>
                    <strong>
                      {formatAngka(
                        ambilBerat(item, 'kaca')
                      )} kg
                    </strong>
                  </div>
                </div>

                <footer className="tabel-total-mobile">
                  <span>Total Berat</span>

                  <strong>
                    {formatAngka(
                      ambilTotalBerat(item)
                    )} kg
                  </strong>
                </footer>
              </article>
            ))
          )}
        </div>

        <p className="tabel-catatan">
          Berat ditampilkan dalam kilogram. Data mengikuti
          catatan yang tersimpan di Google Sheets.
        </p>
      </section>

      <style>{`
        .tabel-data-card {
          min-width: 0;
          padding: 26px;
          overflow: hidden;
        }

        .tabel-kepala {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .tabel-judul-kelompok { min-width: 0; }

        .tabel-kicker {
          margin: 0 0 7px;
          color: #0f766e;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .8px;
        }

        .tabel-judul-kelompok h2 {
          margin: 0 0 8px;
          color: #1e293b;
          font-size: 22px;
          line-height: 1.4;
        }

        .tabel-judul-kelompok > p:last-child {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
        }

        .tabel-aksi-unduh {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
        }

        .tabel-tombol-unduh {
          min-height: 44px;
          padding: 11px 15px;
          color: #fff;
          background: #0f766e;
          border: 1px solid #0f766e;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .tabel-tombol-unduh:hover:not(:disabled) {
          background: #115e59;
        }

        .tabel-tombol-pdf {
          color: #0f766e;
          background: #fff;
          border-color: #99f6e4;
        }

        .tabel-tombol-pdf:hover:not(:disabled) {
          background: #f0fdfa;
        }

        .tabel-tombol-unduh:disabled {
          opacity: .55;
          cursor: wait;
        }

        .tabel-filter-panel {
          padding: 18px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .tabel-filter-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 17px;
        }

        .tabel-filter-heading h3 {
          margin: 0 0 4px;
          color: #1e293b;
          font-size: 15px;
        }

        .tabel-filter-heading p {
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.6;
        }

        .tabel-tombol-reset {
          padding: 8px 10px;
          color: #0f766e;
          background: #fff;
          border: 1px solid #99f6e4;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          cursor: pointer;
        }

        .tabel-filter-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .tabel-filter-kolom {
          display: flex;
          flex-direction: column;
          gap: 7px;
          min-width: 0;
        }

        .tabel-filter-kolom label {
          color: #334155;
          font-size: 12px;
          font-weight: 700;
        }

        .tabel-filter-kolom select {
          width: 100%;
          min-width: 0;
          min-height: 44px;
          padding: 10px;
          color: #1e293b;
          background: #fff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font: inherit;
          font-size: 13px;
        }

        .tabel-filter-kolom select:focus-visible {
          outline: 3px solid rgba(15, 118, 110, .18);
          border-color: #0f766e;
        }

        .tabel-ringkasan {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin: 18px 0;
        }

        .tabel-ringkasan-item {
          min-width: 0;
          padding: 16px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }

        .tabel-ringkasan-item span {
          display: block;
          margin-bottom: 6px;
          color: #64748b;
          font-size: 12px;
        }

        .tabel-ringkasan-item strong {
          display: block;
          color: #1e293b;
          font-size: 20px;
          overflow-wrap: anywhere;
        }

        .tabel-total-item strong { color: #0f766e; }

        .desktop-table-view {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          -webkit-overflow-scrolling: touch;
        }

        .tabel-data-desktop {
          width: 100%;
          min-width: 780px;
          border-collapse: separate;
          border-spacing: 0;
          background: #fff;
          font-size: 12px;
        }

        .tabel-data-desktop th {
          padding: 13px 12px;
          color: #fff;
          background: #115e59;
          text-align: left;
          white-space: nowrap;
        }

        .tabel-data-desktop td {
          padding: 13px 12px;
          color: #334155;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }

        .tabel-data-desktop tbody tr:nth-child(even) {
          background: #f8fafc;
        }

        .tabel-data-desktop tbody tr:hover {
          background: #f0fdfa;
        }

        .tabel-data-desktop tfoot td {
          padding: 13px 12px;
          color: #115e59;
          background: #ccfbf1;
          border-bottom: none;
          font-weight: 800;
        }

        .tabel-angka {
          text-align: right;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }

        .tabel-label-rw {
          display: inline-block;
          padding: 5px 8px;
          color: #115e59;
          background: #ccfbf1;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        .tabel-total-berat {
          color: #0f766e !important;
          font-weight: 800;
        }

        .tabel-kosong {
          padding: 30px 16px !important;
          text-align: center;
          color: #64748b !important;
        }

        .mobile-card-view {
          display: none;
          flex-direction: column;
          gap: 12px;
        }

        .tabel-setoran-card {
          min-width: 0;
          padding: 16px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 2px 5px rgba(15, 23, 42, .03);
        }

        .tabel-setoran-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-bottom: 13px;
          border-bottom: 1px solid #e2e8f0;
        }

        .tabel-label-kecil {
          display: block;
          margin-bottom: 4px;
          color: #64748b;
          font-size: 11px;
        }

        .tabel-rw-mobile {
          color: #0f766e;
          font-size: 16px;
        }

        .tabel-periode-mobile {
          padding: 6px 9px;
          color: #115e59;
          background: #ccfbf1;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 700;
          text-align: right;
        }

        .tabel-rincian-mobile {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          padding: 15px 0;
        }

        .tabel-rincian-mobile > div {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .tabel-rincian-mobile span {
          color: #64748b;
          font-size: 12px;
        }

        .tabel-rincian-mobile strong {
          color: #1e293b;
          font-size: 14px;
          overflow-wrap: anywhere;
        }

        .tabel-total-mobile {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding-top: 12px;
          border-top: 1px dashed #cbd5e1;
        }

        .tabel-total-mobile span {
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
        }

        .tabel-total-mobile strong {
          color: #0f766e;
          font-size: 17px;
          white-space: nowrap;
        }

        .tabel-kartu-kosong {
          padding: 24px 16px;
          color: #64748b;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
          text-align: center;
          font-size: 13px;
          line-height: 1.7;
        }

        .tabel-catatan {
          margin: 16px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.7;
        }

        .tabel-pesan-error {
          margin: 16px 0;
          padding: 14px;
          color: #991b1b;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 9px;
        }

        .tabel-pesan-error p {
          margin: 0 0 10px;
          line-height: 1.7;
        }

        .tabel-pesan-error button {
          min-height: 40px;
          padding: 8px 12px;
          color: #991b1b;
          background: #fff;
          border: 1px solid #fecaca;
          border-radius: 7px;
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 767px) {
          .tabel-data-card { padding: 17px 13px; }

          .tabel-kepala {
            flex-direction: column;
            gap: 16px;
            margin-bottom: 18px;
            padding-bottom: 18px;
          }

          .tabel-judul-kelompok h2 { font-size: 19px; }

          .tabel-aksi-unduh {
            display: grid;
            grid-template-columns: 1fr;
            width: 100%;
          }

          .tabel-tombol-unduh {
            width: 100%;
            min-height: 46px;
          }

          .tabel-filter-panel { padding: 14px; }

          .tabel-filter-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 13px;
          }

          .tabel-ringkasan { gap: 10px; }

          .tabel-ringkasan-item { padding: 12px; }

          .tabel-ringkasan-item strong { font-size: 17px; }

          .desktop-table-view { display: none; }

          .mobile-card-view { display: flex; }
        }

        @media (max-width: 380px) {
          .tabel-data-card { padding: 13px 10px; }

          .tabel-filter-heading { align-items: flex-start; }

          .tabel-ringkasan {
            grid-template-columns: minmax(0, 1fr);
          }

          .tabel-setoran-card { padding: 13px; }

          .tabel-periode-mobile {
            max-width: 50%;
            overflow-wrap: anywhere;
          }
        }
      `}</style>
    </>
  );
};

export default TabelData;
