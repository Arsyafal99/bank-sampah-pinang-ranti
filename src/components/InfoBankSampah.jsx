import React from 'react';

const JENIS_SAMPAH = [
  {
    nomor: '01',
    nama: 'Plastik',
    ikon: '♻️',
    warna: '#0f766e',
    latar: '#ccfbf1',
    contoh: [
      'Botol minuman',
      'Gelas plastik',
      'Kantong plastik bersih',
    ],
  },
  {
    nomor: '02',
    nama: 'Kertas',
    ikon: '📄',
    warna: '#2563eb',
    latar: '#dbeafe',
    contoh: [
      'Kardus',
      'Buku bekas',
      'Majalah dan koran',
    ],
  },
  {
    nomor: '03',
    nama: 'Logam',
    ikon: '🔩',
    warna: '#b45309',
    latar: '#fef3c7',
    contoh: [
      'Kaleng minuman',
      'Besi bekas',
      'Aluminium',
    ],
  },
  {
    nomor: '04',
    nama: 'Kaca',
    ikon: '🍶',
    warna: '#7c3aed',
    latar: '#ede9fe',
    contoh: [
      'Botol kaca',
      'Wadah kaca',
      'Botol kecap atau sirup',
    ],
  },
];

const ALUR_SETORAN = [
  {
    nomor: '01',
    judul: 'Pilah sampah dari rumah',
    deskripsi:
      'Pisahkan sampah berdasarkan jenisnya, seperti plastik, kertas, logam, dan kaca.',
    ikon: '🏠',
  },
  {
    nomor: '02',
    judul: 'Bawa ke lokasi penimbangan',
    deskripsi:
      'Bawa sampah yang sudah dipilah ke lokasi penimbangan RW sesuai jadwal yang ditentukan.',
    ikon: '🧺',
  },
  {
    nomor: '03',
    judul: 'Timbang dan catat setoran',
    deskripsi:
      'Petugas menimbang sampah dan mencatat hasil setoran sesuai prosedur yang berlaku.',
    ikon: '⚖️',
  },
  {
    nomor: '04',
    judul: 'Masukkan data ke sistem',
    deskripsi:
      'Koordinator memasukkan rekapitulasi setoran tingkat RW ke dalam sistem informasi Bank Sampah.',
    ikon: '📋',
  },
];

const InfoBankSampah = () => {
  return (
    <>
      <main className="panduan-bank-sampah">
        {/* Judul halaman */}
        <header className="panduan-kepala">
          <div className="panduan-ilustrasi" aria-hidden="true">
            ♻️
          </div>

          <div className="panduan-kepala-teks">
            <span className="panduan-kicker">
              BANK SAMPAH KELURAHAN PINANG RANTI
            </span>

            <h1>Informasi dan Panduan</h1>

            <p>
              Kenali jenis sampah yang dicatat, pahami
              tahapan penyetoran, dan ikuti panduan
              penggunaan sistem.
            </p>
          </div>
        </header>

        {/* Penjelasan bank sampah */}
        <section
          className="panduan-tentang"
          aria-labelledby="judul-tentang"
        >
          <div className="panduan-tentang-ikon" aria-hidden="true">
            🌱
          </div>

          <div className="panduan-tentang-isi">
            <h2 id="judul-tentang">
              Apa Itu Bank Sampah?
            </h2>

            <p>
              Bank Sampah merupakan kegiatan pengelolaan
              sampah yang melibatkan masyarakat. Sampah
              yang dapat dimanfaatkan dipilah dan ditimbang
              agar dapat dikelola sesuai jenis dan ketentuan
              yang berlaku.
            </p>

            <p>
              Melalui sistem informasi ini, petugas dapat
              mencatat dan melihat rekapitulasi berat
              setoran dari RW 01 hingga RW 05.
            </p>
          </div>
        </section>

        {/* Daftar jenis sampah */}
        <section
          className="panduan-bagian"
          aria-labelledby="judul-jenis-sampah"
        >
          <div className="panduan-judul-bagian">
            <div>
              <span className="panduan-label-bagian">
                PANDUAN PENYETORAN
              </span>

              <h2 id="judul-jenis-sampah">
                Jenis Sampah yang Dicatat
              </h2>

              <p>
                Saat ini formulir menyediakan empat jenis
                sampah berikut.
              </p>
            </div>
          </div>

          <div className="panduan-jenis-grid">
            {JENIS_SAMPAH.map((jenis) => (
              <article
                className="panduan-jenis-kartu"
                key={jenis.nomor}
                style={{
                  '--warna-jenis': jenis.warna,
                  '--latar-jenis': jenis.latar,
                }}
              >
                <div className="panduan-jenis-kepala">
                  <div className="panduan-jenis-ikon">
                    <span aria-hidden="true">
                      {jenis.ikon}
                    </span>
                  </div>

                  <span className="panduan-jenis-nomor">
                    {jenis.nomor}
                  </span>
                </div>

                <h3>{jenis.nama}</h3>

                <p className="panduan-contoh-label">
                  Contoh sampah
                </p>

                <ul>
                  {jenis.contoh.map((contoh) => (
                    <li key={contoh}>{contoh}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Informasi minyak jelantah */}
        <aside
          className="panduan-jelantah"
          aria-labelledby="judul-jelantah"
        >
          <div className="panduan-jelantah-ikon" aria-hidden="true">
            🛢️
          </div>

          <div>
            <h2 id="judul-jelantah">
              Informasi Minyak Jelantah
            </h2>

            <p>
              Minyak jelantah belum memiliki kolom
              pencatatan pada formulir sistem ini.
              Penanganan atau penyalurannya perlu
              mengikuti ketentuan yang berlaku di wilayah.
            </p>

            <span className="panduan-jelantah-status">
              Belum tersedia pada formulir pencatatan
            </span>
          </div>
        </aside>

        {/* Tahapan penyetoran */}
        <section
          className="panduan-bagian"
          aria-labelledby="judul-alur"
        >
          <div className="panduan-judul-bagian">
            <div>
              <span className="panduan-label-bagian">
                TAHAPAN PENYETORAN
              </span>

              <h2 id="judul-alur">
                Bagaimana Alur Penyetoran?
              </h2>

              <p>
                Ikuti tahapan berikut agar pencatatan
                setoran lebih teratur.
              </p>
            </div>
          </div>

          <div className="panduan-alur">
            {ALUR_SETORAN.map((langkah, indeks) => (
              <article
                className="panduan-alur-langkah"
                key={langkah.nomor}
              >
                <div className="panduan-alur-ikon">
                  <span aria-hidden="true">
                    {langkah.ikon}
                  </span>
                </div>

                <div className="panduan-alur-isi">
                  <span className="panduan-alur-nomor">
                    LANGKAH {langkah.nomor}
                  </span>

                  <h3>{langkah.judul}</h3>

                  <p>{langkah.deskripsi}</p>
                </div>

                {indeks < ALUR_SETORAN.length - 1 && (
                  <span
                    className="panduan-alur-penghubung"
                    aria-hidden="true"
                  >
                    ↓
                  </span>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Petunjuk untuk petugas */}
        <section
          className="panduan-pengingat"
          aria-labelledby="judul-pengingat"
        >
          <div className="panduan-pengingat-ikon" aria-hidden="true">
            ✅
          </div>

          <div>
            <h2 id="judul-pengingat">
              Sebelum Menyimpan Data
            </h2>

            <ul>
              <li>
                Pastikan bulan dan tahun laporan sudah benar.
              </li>

              <li>
                Periksa kembali wilayah RW yang dipilih.
              </li>

              <li>
                Masukkan berat sesuai hasil penimbangan.
              </li>

              <li>
                Pastikan semua isian berat sudah benar sebelum
                menekan tombol simpan.
              </li>

              <li>
                Periksa rekapitulasi untuk memastikan data
                yang tersimpan sudah sesuai.
              </li>
            </ul>
          </div>
        </section>
      </main>

      <style>{`
        .panduan-bank-sampah {
          width: 100%;
          min-width: 0;
          max-width: 900px;
          margin: 0 auto 28px;
          color: #1e293b;
        }

        .panduan-kepala {
          display: flex;
          align-items: center;
          gap: 22px;
          margin-bottom: 22px;
          padding: 28px;
          background: linear-gradient(135deg, #ffffff, #f0fdfa);
          border: 1px solid #dbece8;
          border-left: 5px solid #0f766e;
          border-radius: 15px;
        }

        .panduan-ilustrasi {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 68px;
          width: 68px;
          height: 68px;
          background: #ccfbf1;
          border-radius: 18px;
          font-size: 32px;
        }

        .panduan-kepala-teks {
          min-width: 0;
        }

        .panduan-kicker {
          display: block;
          margin-bottom: 8px;
          color: #0f766e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.8px;
          line-height: 1.7;
        }

        .panduan-kepala h1 {
          margin: 0 0 9px;
          color: #115e59;
          font-size: 25px;
          font-weight: 800;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .panduan-kepala p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.8;
        }

        .panduan-tentang {
          display: flex;
          align-items: flex-start;
          gap: 17px;
          margin-bottom: 30px;
          padding: 22px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          box-shadow: 0 3px 9px rgba(15, 23, 42, 0.03);
        }

        .panduan-tentang-ikon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          flex: 0 0 46px;
          background: #dcfce7;
          border-radius: 12px;
          font-size: 23px;
        }

        .panduan-tentang-isi {
          min-width: 0;
        }

        .panduan-tentang h2,
        .panduan-jelantah h2,
        .panduan-pengingat h2 {
          margin: 0 0 10px;
          color: #1e293b;
          font-size: 18px;
          font-weight: 800;
          line-height: 1.5;
        }

        .panduan-tentang p {
          margin: 0 0 10px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.9;
        }

        .panduan-tentang p:last-child {
          margin-bottom: 0;
        }

        .panduan-bagian {
          margin-top: 30px;
        }

        .panduan-judul-bagian {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 18px;
        }

        .panduan-label-bagian {
          display: block;
          margin-bottom: 6px;
          color: #0f766e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.7px;
        }

        .panduan-judul-bagian h2 {
          margin: 0 0 7px;
          color: #1e293b;
          font-size: 21px;
          font-weight: 800;
          line-height: 1.45;
        }

        .panduan-judul-bagian p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.8;
        }

        .panduan-jenis-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .panduan-jenis-kartu {
          min-width: 0;
          padding: 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-top: 4px solid var(--warna-jenis);
          border-radius: 12px;
          box-shadow: 0 2px 7px rgba(15, 23, 42, 0.025);
        }

        .panduan-jenis-kepala {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 15px;
        }

        .panduan-jenis-ikon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 47px;
          height: 47px;
          background: var(--latar-jenis);
          border-radius: 12px;
          font-size: 23px;
        }

        .panduan-jenis-nomor {
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 800;
        }

        .panduan-jenis-kartu h3 {
          margin: 0 0 14px;
          color: var(--warna-jenis);
          font-size: 17px;
          font-weight: 800;
        }

        .panduan-contoh-label {
          margin: 0 0 9px;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
        }

        .panduan-jenis-kartu ul {
          display: grid;
          gap: 8px;
          margin: 0;
          padding-left: 18px;
          color: #475569;
          font-size: 13px;
          line-height: 1.7;
        }

        .panduan-jenis-kartu li::marker {
          color: var(--warna-jenis);
        }

        .panduan-jelantah {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-top: 20px;
          padding: 20px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 12px;
        }

        .panduan-jelantah-ikon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          flex: 0 0 45px;
          background: #fef3c7;
          border-radius: 11px;
          font-size: 22px;
        }

        .panduan-jelantah h2 {
          color: #92400e;
          font-size: 16px;
        }

        .panduan-jelantah p {
          margin: 0 0 12px;
          color: #78350f;
          font-size: 13px;
          line-height: 1.8;
        }

        .panduan-jelantah-status {
          display: inline-block;
          max-width: 100%;
          padding: 6px 9px;
          color: #92400e;
          background: #fef3c7;
          border: 1px solid #fde68a;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 700;
          line-height: 1.6;
        }

        .panduan-alur {
          display: grid;
          gap: 0;
        }

        .panduan-alur-langkah {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          min-width: 0;
          padding: 19px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .panduan-alur-ikon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          background: #f0fdfa;
          border: 1px solid #ccfbf1;
          border-radius: 12px;
          font-size: 22px;
        }

        .panduan-alur-isi {
          min-width: 0;
        }

        .panduan-alur-nomor {
          display: block;
          margin-bottom: 5px;
          color: #0f766e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.6px;
        }

        .panduan-alur-isi h3 {
          margin: 0 0 7px;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.6;
        }

        .panduan-alur-isi p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.8;
        }

        .panduan-alur-penghubung {
          position: absolute;
          bottom: -19px;
          left: 35px;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 25px;
          height: 25px;
          color: #0f766e;
          background: #ccfbf1;
          border: 3px solid var(--bg-color, #f4f7f9);
          border-radius: 50%;
          font-size: 13px;
          font-weight: 800;
        }

        .panduan-alur-langkah:not(:last-child) {
          margin-bottom: 15px;
        }

        .panduan-pengingat {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-top: 30px;
          padding: 23px;
          background: #f0fdfa;
          border: 1px solid #99f6e4;
          border-radius: 13px;
        }

        .panduan-pengingat-ikon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          flex: 0 0 45px;
          background: #ccfbf1;
          border-radius: 12px;
          font-size: 21px;
        }

        .panduan-pengingat h2 {
          color: #115e59;
          font-size: 17px;
        }

        .panduan-pengingat ul {
          display: grid;
          gap: 10px;
          margin: 0;
          padding-left: 19px;
          color: #334155;
          font-size: 13px;
          line-height: 1.8;
        }

        .panduan-pengingat li::marker {
          color: #0f766e;
        }

        @media (min-width: 1100px) {
          .panduan-bank-sampah {
            max-width: 100%;
          }

          .panduan-jenis-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        @media (min-width: 768px) and (max-width: 1099px) {
          .panduan-bank-sampah {
            max-width: 100%;
          }

          .panduan-jenis-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 767px) {
          .panduan-kepala {
            flex-direction: column;
            align-items: flex-start;
            gap: 17px;
            margin-bottom: 17px;
            padding: 21px 17px;
          }

          .panduan-ilustrasi {
            width: 54px;
            height: 54px;
            flex-basis: 54px;
            border-radius: 14px;
            font-size: 27px;
          }

          .panduan-kepala h1 {
            font-size: 22px;
          }

          .panduan-kepala p {
            font-size: 12px;
          }

          .panduan-tentang {
            gap: 12px;
            padding: 17px;
            margin-bottom: 24px;
          }

          .panduan-tentang-ikon {
            width: 39px;
            height: 39px;
            flex-basis: 39px;
            font-size: 19px;
          }

          .panduan-tentang h2 {
            font-size: 16px;
          }

          .panduan-tentang p {
            font-size: 12px;
          }

          .panduan-bagian {
            margin-top: 25px;
          }

          .panduan-judul-bagian h2 {
            font-size: 19px;
          }

          .panduan-judul-bagian p {
            font-size: 12px;
          }

          .panduan-jenis-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 12px;
          }

          .panduan-jenis-kartu {
            padding: 17px;
          }

          .panduan-jenis-kartu h3 {
            font-size: 16px;
          }

          .panduan-jenis-kartu ul {
            font-size: 12px;
          }

          .panduan-jelantah {
            gap: 12px;
            padding: 16px;
          }

          .panduan-jelantah-ikon {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
            font-size: 19px;
          }

          .panduan-jelantah h2 {
            font-size: 15px;
          }

          .panduan-jelantah p {
            font-size: 12px;
          }

          .panduan-alur-langkah {
            gap: 12px;
            padding: 15px;
          }

          .panduan-alur-ikon {
            width: 41px;
            height: 41px;
            flex-basis: 41px;
            font-size: 20px;
          }

          .panduan-alur-penghubung {
            left: 23px;
          }

          .panduan-alur-isi h3 {
            font-size: 14px;
          }

          .panduan-alur-isi p {
            font-size: 12px;
          }

          .panduan-pengingat {
            gap: 12px;
            padding: 17px;
          }

          .panduan-pengingat-ikon {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
            font-size: 18px;
          }

          .panduan-pengingat h2 {
            font-size: 15px;
          }

          .panduan-pengingat ul {
            font-size: 12px;
          }
        }

        @media (min-width: 480px) and (max-width: 767px) {
          .panduan-jenis-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 380px) {
          .panduan-kepala {
            padding: 17px 13px;
          }

          .panduan-kepala h1 {
            font-size: 20px;
          }

          .panduan-tentang {
            padding: 13px;
          }

          .panduan-jelantah {
            padding: 13px;
          }

          .panduan-alur-langkah {
            padding: 12px;
          }

          .panduan-pengingat {
            padding: 13px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .panduan-bank-sampah * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default InfoBankSampah;