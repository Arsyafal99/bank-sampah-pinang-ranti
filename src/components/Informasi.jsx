import React from 'react';

const formatBerat = (nilai) =>
  new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(Number(nilai) || 0);

const Informasi = ({
  totalSampahBulanIni,
  wilayahTeraktif,
}) => {
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

  const daftarInformasi = [
    {
      id: 'total',
      nomor: '01',
      judul: 'Total Setoran',
      nilai: formatBerat(totalBerat),
      satuan: 'kg',
      keterangan: `${bulanBerjalan} ${tahunBerjalan}`,
      ikon: '♻️',
      warna: '#0f766e',
      latar: '#ccfbf1',
      deskripsi:
        'Jumlah berat sampah yang tercatat pada bulan berjalan.',
    },
    {
      id: 'wilayah',
      nomor: '02',
      judul: 'RW dengan Setoran Terbanyak',
      nilai: wilayahTeraktif || '-',
      satuan: '',
      keterangan:
        wilayahTeraktif && wilayahTeraktif !== '-'
          ? 'Terbanyak bulan ini'
          : 'Belum ada setoran tercatat',
      ikon: '🏘️',
      warna: '#b45309',
      latar: '#fef3c7',
      deskripsi:
        'Wilayah dengan jumlah setoran terbesar pada bulan berjalan.',
    },
    {
      id: 'validasi',
      nomor: '03',
      judul: 'Pengingat Pencatatan',
      nilai: 'Periksa Data',
      satuan: '',
      keterangan: 'Sebelum menyimpan setoran',
      ikon: '📋',
      warna: '#2563eb',
      latar: '#dbeafe',
      deskripsi:
        'Pastikan periode, wilayah, dan berat sampah sudah sesuai hasil penimbangan.',
    },
  ];

  return (
    <>
      <section
        className="informasi-dashboard"
        aria-label="Ringkasan informasi Bank Sampah"
      >
        <div className="informasi-heading">
          <div className="informasi-heading-teks">
            <span className="informasi-kicker">
              BANK SAMPAH KELURAHAN PINANG RANTI
            </span>

            <h2>Ringkasan Data</h2>

            <p>
              Pantau jumlah setoran dan perkembangan
              pencatatan sampah di wilayah RW.
            </p>
          </div>

          <div className="informasi-periode">
            <span className="informasi-periode-ikon">
              📅
            </span>

            <div>
              <span className="informasi-periode-label">
                Periode berjalan
              </span>

              <strong>
                {bulanBerjalan} {tahunBerjalan}
              </strong>
            </div>
          </div>
        </div>

        <div className="informasi-kartu-grid">
          {daftarInformasi.map((item) => (
            <article
              key={item.id}
              className={`informasi-kartu informasi-kartu-${item.id}`}
              style={{
                '--warna-kartu': item.warna,
                '--latar-ikon': item.latar,
              }}
            >
              <div className="informasi-kartu-atas">
                <div className="informasi-ikon">
                  <span aria-hidden="true">
                    {item.ikon}
                  </span>
                </div>

                <span className="informasi-nomor">
                  {item.nomor}
                </span>
              </div>

              <div className="informasi-kartu-isi">
                <h3>{item.judul}</h3>

                <div
                  className={`informasi-nilai ${
                    item.id === 'validasi'
                      ? 'informasi-nilai-pengingat'
                      : ''
                  }`}
                >
                  <strong>{item.nilai}</strong>

                  {item.satuan && (
                    <span className="informasi-satuan">
                      {item.satuan}
                    </span>
                  )}
                </div>

                <p className="informasi-keterangan">
                  {item.keterangan}
                </p>

                <p className="informasi-deskripsi">
                  {item.deskripsi}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="informasi-catatan">
          <span
            className="informasi-catatan-ikon"
            aria-hidden="true"
          >
            ℹ️
          </span>

          <p>
            Angka ringkasan mengikuti data yang berhasil
            dimuat dari Google Sheets. Pastikan setiap
            pencatatan telah diperiksa sebelum disimpan.
          </p>
        </div>
      </section>

      <style>{`
        .informasi-dashboard {
          width: 100%;
          min-width: 0;
          margin-bottom: 28px;
        }

        .informasi-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .informasi-heading-teks {
          min-width: 0;
        }

        .informasi-kicker {
          display: inline-block;
          margin-bottom: 8px;
          color: #0f766e;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.7px;
          line-height: 1.7;
        }

        .informasi-heading h2 {
          margin: 0 0 8px;
          color: #1e293b;
          font-size: 26px;
          font-weight: 800;
          line-height: 1.35;
        }

        .informasi-heading-teks > p {
          max-width: 620px;
          margin: 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.8;
        }

        .informasi-periode {
          display: flex;
          align-items: center;
          gap: 11px;
          flex-shrink: 0;
          padding: 12px 15px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 2px 5px rgba(15, 23, 42, 0.03);
        }

        .informasi-periode-ikon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          background: #f0fdfa;
          border-radius: 10px;
          font-size: 20px;
        }

        .informasi-periode-label {
          display: block;
          margin-bottom: 3px;
          color: #64748b;
          font-size: 11px;
          line-height: 1.5;
        }

        .informasi-periode strong {
          display: block;
          color: #115e59;
          font-size: 14px;
          line-height: 1.5;
        }

        .informasi-kartu-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          width: 100%;
          min-width: 0;
        }

        .informasi-kartu {
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 235px;
          padding: 21px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-top: 4px solid var(--warna-kartu);
          border-radius: 14px;
          box-shadow: 0 3px 10px rgba(15, 23, 42, 0.035);
          transition:
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .informasi-kartu:hover {
          box-shadow: 0 7px 18px rgba(15, 23, 42, 0.07);
          transform: translateY(-2px);
        }

        .informasi-kartu-atas {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 19px;
        }

        .informasi-ikon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          background: var(--latar-ikon);
          border-radius: 12px;
          font-size: 23px;
        }

        .informasi-nomor {
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .informasi-kartu-isi {
          min-width: 0;
        }

        .informasi-kartu-isi h3 {
          margin: 0 0 12px;
          color: #475569;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .informasi-nilai {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 7px;
          min-width: 0;
        }

        .informasi-nilai strong {
          color: var(--warna-kartu);
          font-size: 31px;
          font-weight: 800;
          line-height: 1.3;
          overflow-wrap: anywhere;
        }

        .informasi-satuan {
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
        }

        .informasi-keterangan {
          margin: 8px 0 0;
          color: var(--warna-kartu);
          font-size: 12px;
          font-weight: 700;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .informasi-deskripsi {
          margin: 12px 0 0;
          padding-top: 11px;
          color: #64748b;
          border-top: 1px solid #f1f5f9;
          font-size: 12px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .informasi-nilai-pengingat strong {
          font-size: 20px;
          line-height: 1.6;
        }

        .informasi-catatan {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 18px;
          padding: 14px 16px;
          background: #f0fdfa;
          border: 1px solid #ccfbf1;
          border-radius: 10px;
        }

        .informasi-catatan-ikon {
          flex-shrink: 0;
          font-size: 16px;
          line-height: 1.7;
        }

        .informasi-catatan p {
          margin: 0;
          color: #115e59;
          font-size: 12px;
          line-height: 1.8;
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .informasi-kartu-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .informasi-kartu {
            padding: 18px;
          }

          .informasi-kartu-validasi {
            grid-column: 1 / -1;
            min-height: 0;
          }

          .informasi-heading h2 {
            font-size: 23px;
          }
        }

        @media (max-width: 767px) {
          .informasi-dashboard {
            margin-bottom: 20px;
          }

          .informasi-heading {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            margin-bottom: 17px;
          }

          .informasi-heading h2 {
            font-size: 22px;
          }

          .informasi-heading-teks > p {
            font-size: 13px;
          }

          .informasi-periode {
            align-self: flex-start;
            padding: 10px 12px;
          }

          .informasi-kartu-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 13px;
          }

          .informasi-kartu {
            min-height: 0;
            padding: 18px;
          }

          .informasi-kartu-atas {
            margin-bottom: 13px;
          }

          .informasi-ikon {
            width: 44px;
            height: 44px;
            font-size: 21px;
          }

          .informasi-nilai strong {
            font-size: 29px;
          }

          .informasi-nilai-pengingat strong {
            font-size: 20px;
          }

          .informasi-catatan {
            padding: 12px;
          }
        }

        @media (max-width: 380px) {
          .informasi-heading h2 {
            font-size: 20px;
          }

          .informasi-kartu {
            padding: 15px;
          }

          .informasi-nilai strong {
            font-size: 26px;
          }

          .informasi-nilai-pengingat strong {
            font-size: 19px;
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
    </>
  );
};

export default Informasi;