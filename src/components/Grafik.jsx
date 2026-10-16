import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

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

const formatAngka = (nilai) =>
  new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
  }).format(Number(nilai) || 0);

function adaNilaiSetoran(data) {
  if (!Array.isArray(data?.datasets)) return false;

  return data.datasets.some((dataset) =>
    Array.isArray(dataset.data) &&
    dataset.data.some((nilai) => Number(nilai) > 0)
  );
}

function GrafikKosong({ pesan }) {
  return (
    <div className="grafik-kosong" role="status">
      <span className="grafik-kosong-symbol" aria-hidden="true">
        —
      </span>
      <strong>Belum ada berat setoran</strong>
      <p>{pesan}</p>
    </div>
  );
}

const Grafik = ({
  dataGrafik,
  trenTahunan,
  bulanGrafik,
  setBulanGrafik,
  tahunGrafik,
  setTahunGrafik,
  tahunTren,
  setTahunTren,
  daftarTahun = [],
  sedangMemuat = false,
}) => {
  const namaBulan = NAMA_BULAN[bulanGrafik] || NAMA_BULAN[0];
  const punyaDataBulanan = adaNilaiSetoran(dataGrafik);
  const punyaDataTahunan = adaNilaiSetoran(trenTahunan);

  const tahunTersedia = daftarTahun.length
    ? daftarTahun
    : [String(new Date().getFullYear())];

  const pilihanGrafikUmum = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 100,
    animation: {
      duration: 250,
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
  };

  const pilihanGrafikBatang = {
    ...pilihanGrafikUmum,
    plugins: {
      ...pilihanGrafikUmum.plugins,
      legend: {
        display: false,
      },
      tooltip: {
        ...pilihanGrafikUmum.plugins.tooltip,
        callbacks: {
          label: (konteks) =>
            `Total setoran: ${formatAngka(konteks.parsed.y)} kg`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#475569',
          font: {
            size: 11,
          },
          maxRotation: 0,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#64748b',
          callback: (nilai) => formatAngka(nilai),
        },
        grid: {
          color: '#e2e8f0',
        },
        title: {
          display: true,
          text: 'Berat sampah (kg)',
          color: '#475569',
        },
        border: {
          display: false,
        },
      },
    },
  };

  const pilihanGrafikGaris = {
    ...pilihanGrafikUmum,
    plugins: {
      ...pilihanGrafikUmum.plugins,
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#475569',
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 9,
          boxHeight: 9,
          padding: 14,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        ...pilihanGrafikUmum.plugins.tooltip,
        callbacks: {
          label: (konteks) =>
            `${konteks.dataset.label}: ${formatAngka(konteks.parsed.y)} kg`,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2.5,
      },
      point: {
        radius: 2.5,
        hoverRadius: 5,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#475569',
          font: {
            size: 10,
          },
          maxRotation: 0,
          autoSkip: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#64748b',
          callback: (nilai) => formatAngka(nilai),
        },
        grid: {
          color: '#e2e8f0',
        },
        title: {
          display: true,
          text: 'Berat sampah (kg)',
          color: '#475569',
        },
        border: {
          display: false,
        },
      },
    },
  };

  if (!dataGrafik || !trenTahunan) {
    return (
      <div className="card grafik-status" role="status">
        Grafik sedang disiapkan...
      </div>
    );
  }

  return (
    <>
      <div className="grafik-dashboard">
        {/* Grafik perbandingan setoran setiap RW */}
        <section
          className="card grafik-card"
          aria-label="Perbandingan setoran per RW"
        >
          <div className="grafik-kepala">
            <div className="grafik-kepala-copy">
              <h3 className="grafik-judul">
                Perbandingan Setoran per RW
              </h3>
              <p className="grafik-keterangan">
                Jumlah sampah yang terkumpul pada periode pilihan.
              </p>
            </div>

            <span className="grafik-label-periode">
              {namaBulan} {tahunGrafik}
            </span>
          </div>

          <div className="grafik-filter">
            <div className="grafik-filter-kolom">
              <label htmlFor="pilihan-bulan-grafik">
                Pilih Bulan
              </label>
              <select
                id="pilihan-bulan-grafik"
                value={bulanGrafik}
                onChange={(event) =>
                  setBulanGrafik(Number(event.target.value))
                }
              >
                {NAMA_BULAN.map((bulan, indeks) => (
                  <option key={bulan} value={indeks}>
                    {bulan}
                  </option>
                ))}
              </select>
            </div>

            <div className="grafik-filter-kolom">
              <label htmlFor="pilihan-tahun-grafik">
                Pilih Tahun
              </label>
              <select
                id="pilihan-tahun-grafik"
                value={tahunGrafik}
                onChange={(event) => setTahunGrafik(event.target.value)}
              >
                {tahunTersedia.map((tahun) => (
                  <option key={tahun} value={tahun}>
                    {tahun}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grafik-area grafik-area-batang">
            {sedangMemuat ? (
              <GrafikKosong pesan="Data sedang dimuat. Tunggu sebentar." />
            ) : punyaDataBulanan ? (
              <Bar data={dataGrafik} options={pilihanGrafikBatang} />
            ) : (
              <GrafikKosong pesan="Belum ada berat setoran untuk bulan dan tahun ini. Coba pilih periode lain." />
            )}
          </div>

          <p className="grafik-catatan">
            Grafik mengikuti bulan dan tahun yang dipilih. Berat ditampilkan
            dalam kilogram dan mendukung angka desimal.
          </p>
        </section>

        {/* Grafik perkembangan setoran sepanjang tahun */}
        <section
          className="card grafik-card"
          aria-label="Perkembangan setoran bulanan"
        >
          <div className="grafik-kepala">
            <div className="grafik-kepala-copy">
              <h3 className="grafik-judul">
                Perkembangan Setoran Bulanan
              </h3>
              <p className="grafik-keterangan">
                Perbandingan jumlah sampah dari lima RW sepanjang tahun yang dipilih.
              </p>
            </div>

            <span className="grafik-label-periode">
              Tahun {tahunTren}
            </span>
          </div>

          <div className="grafik-filter grafik-filter-satu">
            <div className="grafik-filter-kolom">
              <label htmlFor="pilihan-tahun-tren">
                Pilih Tahun Grafik
              </label>
              <select
                id="pilihan-tahun-tren"
                value={tahunTren}
                onChange={(event) => setTahunTren(event.target.value)}
              >
                {tahunTersedia.map((tahun) => (
                  <option key={tahun} value={tahun}>
                    {tahun}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grafik-area grafik-area-garis">
            {sedangMemuat ? (
              <GrafikKosong pesan="Data sedang dimuat. Tunggu sebentar." />
            ) : punyaDataTahunan ? (
              <Line data={trenTahunan} options={pilihanGrafikGaris} />
            ) : (
              <GrafikKosong pesan="Belum ada berat setoran yang tercatat untuk tahun ini." />
            )}
          </div>

          <p className="grafik-catatan">
            Gunakan keterangan RW pada legenda untuk membandingkan perkembangan
            setiap wilayah.
          </p>
        </section>
      </div>

      <style>{`
        .grafik-dashboard,
        .grafik-dashboard * {
          box-sizing: border-box;
        }

        .grafik-dashboard {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 22px;
          width: 100%;
          min-width: 0;
          margin: 24px 0;
        }

        .grafik-card {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
          padding: 22px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 5px 18px rgba(15, 23, 42, .035);
        }

        .grafik-kepala {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 18px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .grafik-kepala-copy {
          min-width: 0;
        }

        .grafik-judul {
          margin: 0 0 7px;
          color: #0f2f49;
          font-size: 18px;
          font-weight: 800;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .grafik-keterangan {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
        }

        .grafik-label-periode {
          display: inline-flex;
          align-items: center;
          flex: 0 0 auto;
          padding: 7px 11px;
          color: #115e59;
          background: #ccfbf1;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.5;
        }

        .grafik-filter {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          width: 100%;
          max-width: 480px;
          margin: 0 0 20px;
        }

        .grafik-filter-satu {
          grid-template-columns: minmax(0, 1fr);
          max-width: 240px;
        }

        .grafik-filter-kolom {
          display: flex;
          flex-direction: column;
          gap: 7px;
          min-width: 0;
        }

        .grafik-filter-kolom label {
          color: #334155;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.5;
        }

        .grafik-filter-kolom select {
          width: 100%;
          min-width: 0;
          min-height: 44px;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          background: #ffffff;
          color: #0f172a;
          font-family: inherit;
          font-size: 14px;
          cursor: pointer;
        }

        .grafik-filter-kolom select:focus-visible {
          outline: 3px solid rgba(15, 118, 110, .2);
          border-color: #0f766e;
        }

        .grafik-area {
          position: relative;
          width: 100%;
          min-width: 0;
          height: 300px;
        }

        .grafik-area-garis {
          height: 340px;
        }

        .grafik-kosong {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 9px;
          width: 100%;
          height: 100%;
          padding: 24px;
          text-align: center;
          background: #f8fbf9;
          border: 1px dashed #cbded4;
          border-radius: 12px;
        }

        .grafik-kosong-symbol {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          color: #0f766e;
          background: #dff5eb;
          border-radius: 13px;
          font-size: 24px;
          font-weight: 800;
        }

        .grafik-kosong strong {
          color: #245447;
          font-size: 14px;
          line-height: 1.5;
        }

        .grafik-kosong p {
          max-width: 360px;
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.7;
        }

        .grafik-catatan {
          margin: 14px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.7;
        }

        .grafik-status {
          padding: 20px;
          color: #64748b;
        }

        @media (min-width: 1100px) {
          .grafik-dashboard {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            align-items: stretch;
            gap: 22px;
          }

          .grafik-card {
            padding: 22px;
          }

          .grafik-area {
            height: 300px;
          }

          .grafik-area-garis {
            height: 340px;
          }
        }

        @media (min-width: 768px) and (max-width: 1099px) {
          .grafik-dashboard {
            grid-template-columns: minmax(0, 1fr);
          }

          .grafik-area {
            height: 320px;
          }

          .grafik-area-garis {
            height: 350px;
          }
        }

        @media (max-width: 767px) {
          .grafik-dashboard {
            gap: 16px;
            margin: 18px 0;
          }

          .grafik-card {
            padding: 16px;
            border-radius: 13px;
          }

          .grafik-kepala {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 15px;
            padding-bottom: 14px;
          }

          .grafik-judul {
            font-size: 16px;
          }

          .grafik-keterangan {
            font-size: 12px;
          }

          .grafik-label-periode {
            padding: 6px 9px;
            font-size: 11px;
          }

          .grafik-filter {
            gap: 9px;
            margin-bottom: 16px;
          }

          .grafik-filter-kolom label {
            font-size: 12px;
          }

          .grafik-filter-kolom select {
            min-height: 42px;
            padding: 9px 8px;
            font-size: 13px;
          }

          .grafik-area {
            height: 270px;
          }

          .grafik-area-garis {
            height: 320px;
          }

          .grafik-kosong {
            padding: 18px 13px;
          }

          .grafik-kosong p {
            font-size: 12px;
          }
        }

        @media (max-width: 380px) {
          .grafik-card {
            padding: 12px;
          }

          .grafik-filter {
            gap: 7px;
          }

          .grafik-filter-kolom select {
            padding: 8px 6px;
            font-size: 12px;
          }

          .grafik-area {
            height: 245px;
          }

          .grafik-area-garis {
            height: 305px;
          }

          .grafik-judul {
            font-size: 15px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .grafik-dashboard * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Grafik;