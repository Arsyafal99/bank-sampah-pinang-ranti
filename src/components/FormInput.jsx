import React, { useMemo } from 'react';

const DAFTAR_BULAN = [
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

const DAFTAR_RW = [
  'RW 01',
  'RW 02',
  'RW 03',
  'RW 04',
  'RW 05',
];

const JENIS_SAMPAH = [
  { nama: 'Plastik', kolom: 'plastik' },
  { nama: 'Kertas', kolom: 'kertas' },
  { nama: 'Logam', kolom: 'logam' },
  { nama: 'Kaca', kolom: 'kaca' },
];

function angkaUntukTotal(nilai) {
  const teks = String(nilai ?? '').trim();

  if (!teks) return 0;

  // Desimal menggunakan titik, misalnya 1.5.
  if (!/^\d+(?:\.\d+)?$/.test(teks)) {
    return 0;
  }

  const angka = Number(teks);

  return Number.isFinite(angka) && angka >= 0
    ? angka
    : 0;
}

function formatBerat(nilai) {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
  }).format(Number(nilai) || 0);
}

export default function FormInput({
  formData,
  handleInputChange,
  kirimData,
  sedangMengirim = false,
  disabled = false,

  // Props tambahan untuk identitas RW dari sesi login.
  rwTerkunci = false,
  wilayahRW = '',
}) {

  const daftarTahun = useMemo(() => {
    return Array.from(
      { length: 5 },
      (_, indeks) => String(2026 + indeks)
    );
  }, []);


  const totalBerat = JENIS_SAMPAH.reduce(
    (total, jenis) =>
      total + angkaUntukTotal(formData[jenis.kolom]),
    0
  );

  const inputTerkunci = disabled || sedangMengirim;

  const identitasRW = wilayahRW || formData.rw || '';

  return (
    <section className="form-input-modern">
      <style>{`
        .form-input-modern {
          width: 100%;
          min-width: 0;
          color: #1e293b;
        }

        .form-modern-panel {
          overflow: hidden;
          width: 100%;
          background: #ffffff;
          border: 1px solid #e2e8e5;
          border-radius: 15px;
          box-shadow: 0 3px 12px rgba(15, 23, 42, .025);
        }

        .form-modern-header {
          padding: 24px 26px 21px;
          border-bottom: 1px solid #e8eeea;
        }

        .form-modern-eyebrow {
          margin: 0 0 7px;
          color: #0f766e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          line-height: 1.6;
        }

        .form-modern-header h2 {
          margin: 0 0 7px;
          color: #123f35;
          font-size: clamp(22px, 3vw, 27px);
          font-weight: 800;
          line-height: 1.35;
          letter-spacing: -.5px;
        }

        .form-modern-description {
          max-width: 640px;
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.75;
        }

        .form-modern-body {
          padding: 24px 26px 26px;
        }

        .form-modern-section {
          margin-bottom: 27px;
        }

        .form-modern-section-heading {
          margin: 0 0 15px;
        }

        .form-modern-section-heading h3 {
          margin: 0 0 5px;
          color: #1e293b;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.5;
        }

        .form-modern-section-heading p {
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.7;
        }

        .form-modern-period-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
        }

        .form-modern-field {
          min-width: 0;
        }

        .form-modern-label {
          display: block;
          margin-bottom: 7px;
          color: #334155;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.6;
        }

        .form-modern-control {
          display: block;
          width: 100%;
          min-width: 0;
          min-height: 44px;
          padding: 10px 12px;
          box-sizing: border-box;
          border: 1px solid #d2ddd6;
          border-radius: 9px;
          background: #ffffff;
          color: #1e293b;
          font-family: inherit;
          font-size: 14px;
          line-height: 1.5;
          outline: none;
          transition: border-color .18s ease,
            box-shadow .18s ease;
        }

        .form-modern-control::placeholder {
          color: #94a3b8;
        }

        .form-modern-control:focus {
          border-color: #0f766e;
          box-shadow: 0 0 0 3px rgba(15, 118, 110, .10);
        }

        .form-modern-control:disabled {
          background: #f1f5f9;
          color: #64748b;
          cursor: not-allowed;
        }

        .form-modern-fixed-rw {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          width: 100%;
          min-height: 44px;
          padding: 10px 12px;
          box-sizing: border-box;
          color: #115e59;
          background: #f0fdfa;
          border: 1px solid #99f6e4;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 800;
        }

        .form-modern-rw-note {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 10px;
          line-height: 1.6;
        }

        .form-modern-weight-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 17px 20px;
        }

        .form-modern-hint {
          margin: 12px 0 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.75;
        }

        .form-modern-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-top: 25px;
          padding: 18px 20px;
          background: #f0f8f3;
          border: 1px solid #d6ebdd;
          border-radius: 11px;
        }

        .form-modern-total-label {
          margin: 0 0 4px;
          color: #386b57;
          font-size: 12px;
          font-weight: 700;
        }

        .form-modern-total-description {
          margin: 0;
          color: #6b8277;
          font-size: 11px;
          line-height: 1.65;
        }

        .form-modern-total-value {
          color: #115e49;
          font-size: clamp(23px, 3vw, 29px);
          font-weight: 800;
          line-height: 1.3;
          text-align: right;
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
        }

        .form-modern-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #e8eeea;
        }

        .form-modern-footer-note {
          max-width: 360px;
          margin: 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.75;
        }

        .form-modern-footer-note strong {
          color: #334155;
        }

        .form-modern-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 11px 17px;
          color: #ffffff;
          background: #0f766e;
          border: 1px solid #0f766e;
          border-radius: 9px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: background .18s ease;
        }

        .form-modern-submit:hover:not(:disabled) {
          background: #115e59;
        }

        .form-modern-submit:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        @media (min-width: 641px) and (max-width: 900px) {
          .form-modern-header,
          .form-modern-body {
            padding: 21px;
          }

          .form-modern-period-grid {
            gap: 12px;
          }

          .form-modern-weight-grid {
            gap: 16px;
          }
        }

        @media (max-width: 640px) {
          .form-modern-panel {
            border-radius: 12px;
          }

          .form-modern-header {
            padding: 19px 16px;
          }

          .form-modern-header h2 {
            font-size: 22px;
          }

          .form-modern-description {
            font-size: 12px;
          }

          .form-modern-body {
            padding: 19px 16px 20px;
          }

          .form-modern-section {
            margin-bottom: 24px;
          }

          .form-modern-period-grid,
          .form-modern-weight-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 13px;
          }

          .form-modern-control {
            min-height: 46px;
            font-size: 16px;
          }

          .form-modern-total {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
            padding: 16px;
          }

          .form-modern-total-value {
            text-align: left;
          }

          .form-modern-footer {
            align-items: stretch;
            flex-direction: column;
            gap: 13px;
          }

          .form-modern-submit {
            width: 100%;
            min-height: 46px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .form-modern-control,
          .form-modern-submit {
            transition: none;
          }
        }
      `}</style>

      <form
        className="form-modern-panel"
        onSubmit={kirimData}
        noValidate
      >
        <header className="form-modern-header">
          <p className="form-modern-eyebrow">
            PENCATATAN SETORAN
          </p>

          <h2>Input Data Setoran</h2>

          <p className="form-modern-description">
            Pilih periode pencatatan, kemudian masukkan
            berat setiap jenis sampah berdasarkan laporan
            yang diterima.
          </p>
        </header>

        <div className="form-modern-body">
          <section className="form-modern-section">
            <div className="form-modern-section-heading">
              <h3>Wilayah dan Periode</h3>
              <p>
                Pastikan wilayah, bulan, dan tahun sesuai
                dengan laporan setoran.
              </p>
            </div>

            <div className="form-modern-period-grid">
              <div className="form-modern-field">
                <label
                  className="form-modern-label"
                  htmlFor="form-rw"
                >
                  Wilayah RW *
                </label>

                {rwTerkunci ? (
                  <>
                    <div
                      id="form-rw"
                      className="form-modern-fixed-rw"
                      aria-label={`Wilayah RW terverifikasi: ${identitasRW}`}
                    >
                      <span>{identitasRW || 'Identitas RW tidak tersedia'}</span>
                      <span aria-hidden="true">✓</span>
                    </div>

                    <p className="form-modern-rw-note">
                      Wilayah ditetapkan berdasarkan kode akses.
                    </p>
                  </>
                ) : (
                  <select
                    id="form-rw"
                    name="rw"
                    className="form-modern-control"
                    value={formData.rw}
                    onChange={handleInputChange}
                    required
                    disabled={inputTerkunci}
                  >
                    <option value="">Pilih RW</option>

                    {DAFTAR_RW.map((rw) => (
                      <option value={rw} key={rw}>
                        {rw}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-modern-field">
                <label
                  className="form-modern-label"
                  htmlFor="form-bulan"
                >
                  Bulan *
                </label>

                <select
                  id="form-bulan"
                  name="bulan"
                  className="form-modern-control"
                  value={formData.bulan}
                  onChange={handleInputChange}
                  required
                  disabled={inputTerkunci}
                >
                  {DAFTAR_BULAN.map((bulan) => (
                    <option value={bulan} key={bulan}>
                      {bulan}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-modern-field">
                <label
                  className="form-modern-label"
                  htmlFor="form-tahun"
                >
                  Tahun *
                </label>

                <select
                  id="form-tahun"
                  name="tahun"
                  className="form-modern-control"
                  value={formData.tahun}
                  onChange={handleInputChange}
                  required
                  disabled={inputTerkunci}
                >
                  {!daftarTahun.includes(formData.tahun) && (
                    <option value={formData.tahun}>
                      {formData.tahun}
                    </option>
                  )}

                  {daftarTahun.map((tahun) => (
                    <option value={tahun} key={tahun}>
                      {tahun}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="form-modern-section">
            <div className="form-modern-section-heading">
              <h3>Berat Berdasarkan Jenis Sampah</h3>
              <p>
                Masukkan angka dalam kilogram. Kosong
                berbeda dengan nol.
              </p>
            </div>

            <div className="form-modern-weight-grid">
              {JENIS_SAMPAH.map((jenis) => (
                <div
                  className="form-modern-field"
                  key={jenis.kolom}
                >
                  <label
                    className="form-modern-label"
                    htmlFor={`berat-${jenis.kolom}`}
                  >
                    {jenis.nama} (kg) *
                  </label>

                  <input
                    id={`berat-${jenis.kolom}`}
                    name={jenis.kolom}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    className="form-modern-control"
                    value={formData[jenis.kolom]}
                    onChange={handleInputChange}
                    placeholder="Contoh: 1.5"
                    required
                    disabled={inputTerkunci}
                    aria-describedby="form-petunjuk-berat"
                  />
                </div>
              ))}
            </div>

            <p
              id="form-petunjuk-berat"
              className="form-modern-hint"
            >
              Gunakan titik (.) untuk angka desimal,
              misalnya 1.5. Isi 0 jika tidak ada setoran.
              Angka negatif tidak diperbolehkan.
            </p>
          </section>

          <section
            className="form-modern-total"
            aria-live="polite"
            aria-atomic="true"
          >
            <div>
              <p className="form-modern-total-label">
                Total Berat
              </p>

              <p className="form-modern-total-description">
                Jumlah otomatis dari empat jenis sampah.
              </p>
            </div>

            <div className="form-modern-total-value">
              {formatBerat(totalBerat)} kg
            </div>
          </section>

          <footer className="form-modern-footer">
            <p className="form-modern-footer-note">
              <strong>* Wajib diisi.</strong>
              <br />
              Data akan ditampilkan kembali untuk diperiksa
              sebelum dikirim ke server.
            </p>

            <button
              type="submit"
              className="form-modern-submit"
              disabled={inputTerkunci}
            >
              {sedangMengirim
                ? 'Menyimpan...'
                : 'Periksa & Lanjutkan'}
            </button>
          </footer>
        </div>
      </form>
    </section>
  );
}