
import React from 'react';

const formatBerat = (nilai) =>
  new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
  }).format(Number(nilai) || 0);

function IlustrasiLingkungan() {
  return (
    <svg
      className="informasi-ilustrasi-svg"
      viewBox="0 0 280 180"
      role="img"
      aria-label="Ilustrasi lingkungan hijau dan pengelolaan sampah"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="153"
        cy="88"
        r="78"
        fill="#DDF4E8"
      />

      <circle
        cx="218"
        cy="44"
        r="20"
        fill="#B8E8D1"
        opacity=".8"
      />

      <path
        d="M21 143 Q75 116 130 143 T260 137 L260 166 L21 166 Z"
        fill="#B8E8D1"
      />

      <path
        d="M39 151 Q97 132 151 151 T254 147"
        fill="none"
        stroke="#74C69D"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Tempat sampah */}
      <g transform="translate(57 91)">
        <path
          d="M0 15 L8 70 Q9 75 15 75 L42 75 Q48 75 49 70 L57 15 Z"
          fill="#0F766E"
        />

        <path
          d="M-3 10 Q-3 6 2 6 L54 6 Q60 6 60 10 L60 15 L-3 15 Z"
          fill="#115E59"
        />

        <rect
          x="9"
          y="0"
          width="39"
          height="5"
          rx="2.5"
          fill="#115E59"
        />

        <path
          d="M17 26 L20 61 M30 26 L30 61 M43 26 L40 61"
          stroke="#99F6E4"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Daun */}
      <g transform="translate(163 43)">
        <path
          d="M15 72 C-6 54 -1 28 28 5 C49 33 43 58 15 72 Z"
          fill="#168467"
        />

        <path
          d="M14 69 C17 48 23 29 29 8"
          stroke="#D1FAE5"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        <path
          d="M20 45 L7 33 M23 34 L36 25"
          stroke="#D1FAE5"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        <path
          d="M48 68 C37 53 44 35 66 25 C73 45 67 61 48 68 Z"
          fill="#74C69D"
        />

        <path
          d="M47 66 L65 28"
          stroke="#DDF4E8"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Lambang daur ulang sederhana */}
      <g transform="translate(121 118)">
        <circle cx="0" cy="0" r="17" fill="#FFFFFF" />

        <path
          d="M-4 -8 L2 -12 L7 -6 L3 -6 L0 -2"
          fill="none"
          stroke="#0F766E"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M8 -1 L9 6 L2 9 L4 5 L0 4"
          fill="none"
          stroke="#0F766E"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M-8 5 L-11 -1 L-6 -7 L-5 -3 L-1 -5"
          fill="none"
          stroke="#0F766E"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default function Informasi({
  totalSampahBulanIni = 0,
  wilayahTeraktif = '-',
}) {
  const sekarang = new Date();

  const namaBulan = [
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

  const bulanBerjalan = namaBulan[sekarang.getMonth()];
  const tahunBerjalan = sekarang.getFullYear();

  const totalBerat = Number(totalSampahBulanIni) || 0;

  const adaData = totalBerat > 0;

  const adaWilayahAktif =
    Boolean(wilayahTeraktif) &&
    wilayahTeraktif !== '-';

  return (
    <section
      className="informasi-dashboard"
      aria-label="Ringkasan informasi Bank Sampah"
    >
      <style>{`
        .informasi-dashboard {
          width: 100%;
          min-width: 0;
          margin-bottom: 28px;
          color: #1e293b;
        }

        /* Judul dashboard dan ilustrasi */
        .informasi-heading {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 190px;
          align-items: center;
          gap: 20px;
          min-height: 180px;
          padding: 27px 30px;
          margin-bottom: 20px;
          overflow: hidden;
          background: linear-gradient(
            115deg,
            #F0FAF5 0%,
            #F7FBF8 58%,
            #E3F5EB 100%
          );
          border: 1px solid #DCEDE3;
          border-radius: 17px;
        }

        .informasi-heading-teks {
          position: relative;
          z-index: 1;
          min-width: 0;
        }

        .informasi-kicker {
          display: inline-block;
          margin-bottom: 10px;
          color: #0F766E;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .8px;
          line-height: 1.6;
        }

        .informasi-heading h2 {
          margin: 0 0 9px;
          color: #123F35;
          font-size: clamp(25px, 3vw, 34px);
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -.8px;
        }

        .informasi-heading-teks > p {
          max-width: 570px;
          margin: 0;
          color: #536B63;
          font-size: 14px;
          line-height: 1.8;
        }

        .informasi-ilustrasi {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          align-self: stretch;
        }

        .informasi-ilustrasi-svg {
          display: block;
          width: 100%;
          max-width: 190px;
          height: auto;
          max-height: 160px;
        }

        /* Dua kartu statistik yang ringkas */
        .informasi-kartu-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          width: 100%;
        }

        .informasi-kartu {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 15px;
          min-width: 0;
          padding: 21px;
          background: #FFFFFF;
          border: 1px solid #E2E8E5;
          border-radius: 14px;
          box-shadow: 0 3px 10px rgba(15, 23, 42, .025);
          transition:
            border-color .2s ease,
            box-shadow .2s ease,
            transform .2s ease;
        }

        .informasi-kartu:hover {
          border-color: #B8DCCB;
          box-shadow: 0 8px 22px rgba(15, 23, 42, .045);
          transform: translateY(-2px);
        }

        .informasi-ikon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          color: #0F766E;
          background: #DDF4E8;
          border-radius: 11px;
        }

        .informasi-ikon svg {
          display: block;
          width: 23px;
          height: 23px;
        }

        .informasi-kartu-isi {
          min-width: 0;
          flex: 1;
        }

        .informasi-kartu-isi h3 {
          margin: 1px 0 9px;
          color: #64748B;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.6;
        }

        .informasi-nilai {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 6px;
          min-width: 0;
        }

        .informasi-nilai strong {
          color: #123F35;
          font-size: clamp(23px, 2.4vw, 30px);
          font-weight: 800;
          line-height: 1.3;
          letter-spacing: -.6px;
          overflow-wrap: anywhere;
          font-variant-numeric: tabular-nums;
        }

        .informasi-satuan {
          color: #64748B;
          font-size: 13px;
          font-weight: 700;
        }

        .informasi-keterangan {
          margin: 6px 0 0;
          color: #0F766E;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.6;
        }

        .informasi-catatan {
          margin-top: 16px;
          padding: 12px 15px;
          color: #536B63;
          border-left: 3px solid #65B891;
          background: #F3F9F5;
          border-radius: 0 9px 9px 0;
          font-size: 12px;
          line-height: 1.75;
        }

        .informasi-catatan p {
          margin: 0;
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .informasi-heading {
            grid-template-columns: minmax(0, 1fr) 145px;
            padding: 24px;
          }

          .informasi-ilustrasi-svg {
            max-width: 150px;
          }

          .informasi-kartu {
            padding: 18px;
            gap: 12px;
          }
        }

        @media (max-width: 767px) {
          .informasi-dashboard {
            margin-bottom: 22px;
          }

          .informasi-heading {
            grid-template-columns: minmax(0, 1fr) 90px;
            gap: 8px;
            min-height: 0;
            padding: 21px 17px;
            margin-bottom: 15px;
            border-radius: 13px;
          }

          .informasi-kicker {
            margin-bottom: 7px;
            font-size: 10px;
            letter-spacing: .5px;
          }

          .informasi-heading h2 {
            margin-bottom: 8px;
            font-size: 24px;
            letter-spacing: -.5px;
          }

          .informasi-heading-teks > p {
            font-size: 12px;
            line-height: 1.7;
          }

          .informasi-ilustrasi-svg {
            width: 100%;
            max-width: 110px;
            max-height: 120px;
          }

          .informasi-kartu-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 11px;
          }

          .informasi-kartu {
            padding: 17px;
            gap: 13px;
            border-radius: 12px;
          }

          .informasi-ikon {
            width: 40px;
            height: 40px;
          }

          .informasi-ikon svg {
            width: 21px;
            height: 21px;
          }

          .informasi-nilai strong {
            font-size: 26px;
          }

          .informasi-catatan {
            margin-top: 13px;
            padding: 11px 12px;
            font-size: 11px;
          }
        }

        @media (max-width: 380px) {
          .informasi-heading {
            grid-template-columns: minmax(0, 1fr) 66px;
            padding: 17px 13px;
          }

          .informasi-heading h2 {
            font-size: 21px;
          }

          .informasi-ilustrasi-svg {
            max-width: 78px;
          }

          .informasi-kartu {
            padding: 14px;
            gap: 10px;
          }

          .informasi-ikon {
            width: 36px;
            height: 36px;
          }

          .informasi-nilai strong {
            font-size: 23px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .informasi-kartu {
            transition: none;
          }

          .informasi-kartu:hover {
            transform: none;
          }
        }
      `}</style>

      <header className="informasi-heading">
        <div className="informasi-heading-teks">
          <span className="informasi-kicker">
            BANK SAMPAH KELURAHAN PINANG RANTI
          </span>

          <h2>Ringkasan Data</h2>

          <p>
            Pantau jumlah setoran dan perkembangan pencatatan
            sampah di wilayah RW secara ringkas dan transparan.
          </p>
        </div>

        <div className="informasi-ilustrasi">
          <IlustrasiLingkungan />
        </div>
      </header>

      <div className="informasi-kartu-grid">
        <article className="informasi-kartu">
          <div className="informasi-ikon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 4h10M9 4V2.5h6V4M5 7h14l-1 14H6L5 7Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m9 10 1 7m5-7-1 7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="informasi-kartu-isi">
            <h3>Total Setoran Bulan Ini</h3>

            <div className="informasi-nilai">
              <strong>{formatBerat(totalBerat)}</strong>
              <span className="informasi-satuan">kg</span>
            </div>

            <p className="informasi-keterangan">
              {adaData
                ? `${bulanBerjalan} ${tahunBerjalan}`
                : `Belum ada setoran tercatat`}
            </p>
          </div>
        </article>

        <article className="informasi-kartu">
          <div className="informasi-ikon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M8 10h.01M12 10h.01M16 10h.01"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="informasi-kartu-isi">
            <h3>RW dengan Setoran Terbanyak</h3>

            <div className="informasi-nilai">
              <strong>{adaWilayahAktif ? wilayahTeraktif : '-'}</strong>
            </div>

            <p className="informasi-keterangan">
              {adaWilayahAktif
                ? 'Tertinggi pada bulan ini'
                : 'Belum ada setoran tercatat'}
            </p>
          </div>
        </article>
      </div>

      <div className="informasi-catatan">
        <p>
          Ringkasan dihitung dari data yang berhasil dimuat.
          Pastikan pencatatan dan periode sesuai dengan laporan
          yang diterima.
        </p>
      </div>
    </section>
  );
}
