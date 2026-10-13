import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
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
  if (!dataGrafik || !trenTahunan) {
    return (
      <div className="card grafik-status">
        Grafik sedang disiapkan...
      </div>
    );
  }

  const namaBulan =
    NAMA_BULAN[bulanGrafik] || NAMA_BULAN[0];

  const pilihanGrafikUmum = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 100,
    animation: {
      duration: 300,
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  const pilihanGrafikBatang = {
    ...pilihanGrafikUmum,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (konteks) =>
            `Total setoran: ${formatAngka(
              konteks.parsed.y
            )} kg`,
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
        grid: {
          color: '#e2e8f0',
        },
        title: {
          display: true,
          text: 'Berat sampah (kg)',
          color: '#475569',
        },
        ticks: {
          precision: 0,
          callback: (nilai) => formatAngka(nilai),
        },
      },
    },
  };

  const pilihanGrafikGaris = {
    ...pilihanGrafikUmum,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#475569',
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 9,
          padding: 14,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (konteks) =>
            `${konteks.dataset.label}: ${formatAngka(
              konteks.parsed.y
            )} kg`,
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
            size: 10,
          },
          maxRotation: 0,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
        },
        title: {
          display: true,
          text: 'Berat sampah (kg)',
          color: '#475569',
        },
        ticks: {
          precision: 0,
          callback: (nilai) => formatAngka(nilai),
        },
      },
    },
  };

  return (
    <>
      <div className="grafik-dashboard">
        {/* Grafik perbandingan setoran setiap RW */}
        <section
          className="card grafik-card"
          aria-label="Perbandingan setoran per RW"
        >
          <div className="grafik-kepala">
            <div>
              <h3 className="grafik-judul">
                Perbandingan Setoran per RW
              </h3>

              <p className="grafik-keterangan">
                Jumlah sampah yang terkumpul pada periode
                pilihan.
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
                onChange={(e) =>
                  setBulanGrafik(Number(e.target.value))
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
                onChange={(e) =>
                  setTahunGrafik(e.target.value)
                }
              >
                {daftarTahun.map((tahun) => (
                  <option key={tahun} value={tahun}>
                    {tahun}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grafik-area grafik-area-batang">
            <Bar
              data={dataGrafik}
              options={pilihanGrafikBatang}
            />
          </div>

          <p className="grafik-catatan">
            Grafik mengikuti bulan dan tahun yang dipilih.
            Data yang belum tercatat akan ditampilkan sebagai
            nol.
          </p>
        </section>

        {/* Grafik perkembangan setoran sepanjang tahun */}
        <section
          className="card grafik-card"
          aria-label="Perkembangan setoran bulanan"
        >
          <div className="grafik-kepala">
            <div>
              <h3 className="grafik-judul">
                Perkembangan Setoran Bulanan
              </h3>

              <p className="grafik-keterangan">
                Perbandingan jumlah sampah dari lima RW
                sepanjang tahun yang dipilih.
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
                onChange={(e) =>
                  setTahunTren(e.target.value)
                }
              >
                {daftarTahun.map((tahun) => (
                  <option key={tahun} value={tahun}>
                    {tahun}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grafik-area grafik-area-garis">
            <Line
              data={trenTahunan}
              options={pilihanGrafikGaris}
            />
          </div>

          <p className="grafik-catatan">
            Gunakan keterangan RW di bawah grafik untuk
            membandingkan perkembangan setiap wilayah.
          </p>
        </section>
      </div>

      <style>{`
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
          box-sizing: border-box;
          padding: 22px;
          overflow: hidden;
        }

        .grafik-kepala {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 18px;
          padding-bottom: 16px;
          border-bottom: 2px solid var(--border-color, #e2e8f0);
        }

        .grafik-judul {
          margin: 0 0 8px;
          color: var(--text-color, #0f172a);
          font-size: 18px;
          font-weight: 700;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .grafik-keterangan {
          margin: 0;
          color: var(--text-muted, #64748b);
          font-size: 13px;
          line-height: 1.7;
        }

        .grafik-label-periode {
          display: inline-block;
          padding: 7px 11px;
          background: #ccfbf1;
          color: #115e59;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
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
          color: var(--text-color, #334155);
          font-size: 13px;
          font-weight: 600;
          line-height: 1.5;
        }

        .grafik-filter-kolom select {
          width: 100%;
          min-width: 0;
          min-height: 44px;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          background: #ffffff;
          color: #0f172a;
          font-family: inherit;
          font-size: 14px;
          cursor: pointer;
        }

        .grafik-filter-kolom select:focus-visible {
          outline: 3px solid rgba(15, 118, 110, 0.25);
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

        .grafik-catatan {
          margin: 14px 0 0;
          color: var(--text-muted, #64748b);
          font-size: 12px;
          line-height: 1.7;
        }

        .grafik-status {
          padding: 20px;
          color: var(--text-muted, #64748b);
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
            height: 310px;
          }

          .grafik-area-garis {
            height: 350px;
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
            border-radius: 12px;
          }

          .grafik-judul {
            font-size: 16px;
          }

          .grafik-keterangan {
            font-size: 12px;
          }

          .grafik-filter {
            gap: 9px;
          }

          .grafik-filter-kolom label {
            font-size: 12px;
          }

          .grafik-filter-kolom select {
            padding: 9px;
            font-size: 13px;
          }

          .grafik-area {
            height: 270px;
          }

          .grafik-area-garis {
            height: 330px;
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
          }

          .grafik-area {
            height: 240px;
          }

          .grafik-area-garis {
            height: 310px;
          }

          .grafik-judul {
            font-size: 15px;
          }
        }
      `}</style>
    </>
  );
};

export default Grafik;