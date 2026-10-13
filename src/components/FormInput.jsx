import React, { useState } from 'react';

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

const DAFTAR_TAHUN = [
  '2026',
  '2027',
  '2028',
  '2029',
  '2030',
];

const DAFTAR_RW = [
  'RW 01',
  'RW 02',
  'RW 03',
  'RW 04',
  'RW 05',
];

const JENIS_SAMPAH = [
  {
    nama: 'Plastik',
    kolom: 'plastik',
    keterangan: 'Berat plastik yang disetorkan.',
    warna: '#0f766e',
  },
  {
    nama: 'Kertas',
    kolom: 'kertas',
    keterangan: 'Berat kertas yang disetorkan.',
    warna: '#2563eb',
  },
  {
    nama: 'Logam',
    kolom: 'logam',
    keterangan: 'Berat logam yang disetorkan.',
    warna: '#b45309',
  },
  {
    nama: 'Kaca',
    kolom: 'kaca',
    keterangan: 'Berat kaca yang disetorkan.',
    warna: '#7c3aed',
  },
];

const formatBerat = (angka) =>
  new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
  }).format(angka);

const FormInput = ({
  formData,
  handleInputChange,
  kirimData,
}) => {
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pesanPIN, setPesanPIN] = useState('');

  const handleLoginPin = (e) => {
    e.preventDefault();

    if (pin === '2627') {
      setIsAuthorized(true);
      setPin('');
      setPesanPIN('');
    } else {
      setPesanPIN(
        'PIN yang dimasukkan salah. Silakan periksa kembali.'
      );
      setPin('');
    }
  };

  const kunciFormulir = () => {
    setIsAuthorized(false);
    setPin('');
    setPesanPIN('');
  };

  const totalBerat = JENIS_SAMPAH.reduce(
    (total, jenis) => {
      const nilai = Number(formData[jenis.kolom]);

      return (
        total +
        (Number.isFinite(nilai) && nilai >= 0
          ? nilai
          : 0)
      );
    },
    0
  );

  // Tampilan sebelum PIN dimasukkan.
  if (!isAuthorized) {
    return (
      <>
        <section className="card form-pin-card">
          <div
            className="form-pin-icon"
            aria-hidden="true"
          >
            <span>🔒</span>
          </div>

          <div className="form-pin-heading">
            <p className="form-kicker">
              BANK SAMPAH KELURAHAN PINANG RANTI
            </p>

            <h2>Akses Pencatatan Setoran</h2>

            <p>
              Formulir ini digunakan oleh pengurus RW
              dan petugas kelurahan untuk mencatat
              setoran sampah.
            </p>
          </div>

          <form
            onSubmit={handleLoginPin}
            className="form-pin-content"
          >
            <div className="form-group">
              <label
                htmlFor="pin-akses"
                className="form-label"
              >
                PIN Akses
              </label>

              <input
                id="pin-akses"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Masukkan PIN akses"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setPesanPIN('');
                }}
                className="form-input"
                required
                maxLength={20}
                aria-describedby={
                  pesanPIN ? 'pesan-pin' : 'petunjuk-pin'
                }
              />

              <p
                id="petunjuk-pin"
                className="form-help"
              >
                Masukkan PIN yang diberikan kepada
                petugas pencatatan.
              </p>

              {pesanPIN && (
                <p
                  id="pesan-pin"
                  className="form-error"
                  role="alert"
                >
                  {pesanPIN}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-submit"
            >
              Buka Formulir
            </button>
          </form>

          <div className="form-pin-footer">
            <span aria-hidden="true">ℹ️</span>
            <p>
              Akses ini ditujukan untuk petugas yang
              bertanggung jawab atas pencatatan.
            </p>
          </div>
        </section>

        <style>{`
          .form-pin-card {
            max-width: 480px;
            margin: 36px auto;
            padding: 30px;
          }

          .form-pin-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            margin: 0 auto 20px;
            background: #ccfbf1;
            border-radius: 18px;
            font-size: 30px;
          }

          .form-pin-heading {
            text-align: center;
          }

          .form-kicker {
            margin: 0 0 10px;
            color: #0f766e;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.8px;
            line-height: 1.7;
          }

          .form-pin-heading h2 {
            margin: 0 0 12px;
            color: #1e293b;
            font-size: 22px;
            line-height: 1.4;
          }

          .form-pin-heading > p:last-child {
            margin: 0;
            color: #64748b;
            font-size: 14px;
            line-height: 1.8;
          }

          .form-pin-content {
            margin-top: 28px;
          }

          .form-help {
            margin: 8px 0 0;
            color: #64748b;
            font-size: 12px;
            line-height: 1.7;
          }

          .form-error {
            margin: 10px 0 0;
            padding: 10px 12px;
            color: #991b1b;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            font-size: 13px;
            line-height: 1.6;
          }

          .form-pin-footer {
            display: flex;
            align-items: flex-start;
            gap: 9px;
            margin-top: 22px;
            padding-top: 18px;
            border-top: 1px solid #e2e8f0;
          }

          .form-pin-footer p {
            margin: 0;
            color: #64748b;
            font-size: 12px;
            line-height: 1.7;
          }

          @media (max-width: 767px) {
            .form-pin-card {
              margin: 18px auto;
              padding: 22px 18px;
            }

            .form-pin-heading h2 {
              font-size: 20px;
            }
          }

          @media (max-width: 380px) {
            .form-pin-card {
              padding: 18px 14px;
            }

            .form-pin-heading h2 {
              font-size: 18px;
            }
          }
        `}</style>
      </>
    );
  }

  // Tampilan setelah PIN benar.
  return (
    <>
      <section
        className="card form-setoran-card"
        aria-labelledby="judul-form-setoran"
      >
        <header className="form-setoran-header">
          <div className="form-setoran-heading">
            <p className="form-kicker">
              PENCATATAN BANK SAMPAH
            </p>

            <h2 id="judul-form-setoran">
              Catat Setoran Sampah
            </h2>

            <p>
              Isi periode laporan, wilayah RW, dan berat
              setiap jenis sampah sesuai hasil penimbangan.
            </p>
          </div>

          <button
            type="button"
            onClick={kunciFormulir}
            className="form-lock-button"
          >
            🔒 Kunci Formulir
          </button>
        </header>

        <form onSubmit={kirimData}>
          <fieldset className="form-section">
            <legend className="form-section-title">
              1. Periode dan Wilayah
            </legend>

            <div className="form-period-grid">
              <div className="form-group">
                <label
                  htmlFor="bulan-setoran"
                  className="form-label"
                >
                  Bulan Laporan
                </label>

                <select
                  id="bulan-setoran"
                  name="bulan"
                  value={formData.bulan}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  {DAFTAR_BULAN.map((bulan) => (
                    <option key={bulan} value={bulan}>
                      {bulan}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label
                  htmlFor="tahun-setoran"
                  className="form-label"
                >
                  Tahun Laporan
                </label>

                <select
                  id="tahun-setoran"
                  name="tahun"
                  value={formData.tahun}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  {DAFTAR_TAHUN.map((tahun) => (
                    <option key={tahun} value={tahun}>
                      {tahun}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label
                  htmlFor="rw-setoran"
                  className="form-label"
                >
                  Wilayah RW
                </label>

                <select
                  id="rw-setoran"
                  name="rw"
                  value={formData.rw}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  {DAFTAR_RW.map((rw) => (
                    <option key={rw} value={rw}>
                      {rw}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset className="form-section form-sampah-section">
            <legend className="form-section-title">
              2. Berat Sampah
            </legend>

            <p className="form-section-description">
              Masukkan berat dalam kilogram. Gunakan angka
              nol jika jenis sampah tidak disetorkan.
            </p>

            <div className="form-sampah-grid">
              {JENIS_SAMPAH.map((jenis) => (
                <div
                  className="form-sampah-item"
                  key={jenis.kolom}
                  style={{
                    '--warna-jenis': jenis.warna,
                  }}
                >
                  <label
                    htmlFor={`berat-${jenis.kolom}`}
                    className="form-label"
                  >
                    {jenis.nama}
                    <span className="form-satuan">
                      (kg)
                    </span>
                  </label>

                  <div className="form-berat-control">
                    <input
                      id={`berat-${jenis.kolom}`}
                      className="form-input"
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min="0"
                      name={jenis.kolom}
                      value={formData[jenis.kolom]}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />

                    <span
                      className="form-berat-satuan"
                      aria-hidden="true"
                    >
                      kg
                    </span>
                  </div>

                  <p className="form-sampah-help">
                    {jenis.keterangan}
                  </p>
                </div>
              ))}
            </div>
          </fieldset>

          <div
            className="form-total-panel"
            aria-live="polite"
          >
            <div>
              <span className="form-total-caption">
                Perkiraan Total Setoran
              </span>

              <p className="form-total-note">
                Jumlah empat jenis sampah di atas
              </p>
            </div>

            <strong className="form-total-value">
              {formatBerat(totalBerat)}
              <span> kg</span>
            </strong>
          </div>

          <div className="form-submit-area">
            <p className="form-submit-note">
              Pastikan periode, wilayah, dan berat sampah
              sudah benar sebelum menyimpan.
            </p>

            <button
              type="submit"
              className="btn-submit"
            >
              Simpan Data Setoran
            </button>
          </div>
        </form>
      </section>

      <style>{`
        .form-setoran-card {
          width: 100%;
          min-width: 0;
          padding: 28px;
        }

        .form-setoran-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 26px;
          padding-bottom: 22px;
          border-bottom: 1px solid #e2e8f0;
        }

        .form-setoran-heading {
          min-width: 0;
        }

        .form-setoran-heading h2 {
          margin: 0 0 10px;
          color: #1e293b;
          font-size: 23px;
          line-height: 1.4;
        }

        .form-setoran-heading > p:last-child {
          max-width: 640px;
          margin: 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.8;
        }

        .form-lock-button {
          flex-shrink: 0;
          min-height: 42px;
          padding: 10px 12px;
          color: #b91c1c;
          background: #fff;
          border: 1px solid #fecaca;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .form-lock-button:hover {
          background: #fef2f2;
        }

        .form-section {
          min-width: 0;
          margin: 0;
          padding: 0;
          border: 0;
        }

        .form-section-title {
          display: block;
          width: 100%;
          margin: 0 0 16px;
          padding: 0;
          color: #1e293b;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.6;
        }

        .form-section-description {
          margin: -6px 0 18px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.8;
        }

        .form-period-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .form-group {
          min-width: 0;
          margin-bottom: 18px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.6;
        }

        .form-input {
          display: block;
          width: 100%;
          min-width: 0;
          min-height: 46px;
          padding: 11px 12px;
          color: #1e293b;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          font-family: inherit;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-input:focus {
          border-color: #0f766e;
          outline: 3px solid rgba(15, 118, 110, 0.12);
        }

        .form-sampah-section {
          margin-top: 10px;
        }

        .form-sampah-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .form-sampah-item {
          min-width: 0;
          padding: 17px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-top: 3px solid var(--warna-jenis);
          border-radius: 10px;
        }

        .form-sampah-item .form-label {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .form-satuan {
          color: #64748b;
          font-size: 12px;
          font-weight: 500;
        }

        .form-berat-control {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-berat-control .form-input {
          padding-right: 44px;
          background: #ffffff;
          font-size: 16px;
          font-weight: 600;
        }

        .form-berat-satuan {
          position: absolute;
          right: 12px;
          color: #64748b;
          font-size: 12px;
          pointer-events: none;
        }

        .form-sampah-help {
          margin: 9px 0 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.6;
        }

        .form-total-panel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 24px;
          padding: 18px;
          background: #f0fdfa;
          border: 1px solid #99f6e4;
          border-radius: 12px;
        }

        .form-total-caption {
          display: block;
          color: #115e59;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.6;
        }

        .form-total-note {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.6;
        }

        .form-total-value {
          flex-shrink: 0;
          color: #115e59;
          font-size: 25px;
          line-height: 1.3;
          white-space: nowrap;
        }

        .form-total-value span {
          font-size: 14px;
          font-weight: 600;
        }

        .form-submit-area {
          margin-top: 24px;
        }

        .form-submit-note {
          margin: 0 0 14px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.8;
        }

        .form-submit-area .btn-submit {
          width: 100%;
          min-height: 48px;
          padding: 14px 18px;
          color: #ffffff;
          background: #0f766e;
          border: 0;
          border-radius: 9px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .form-submit-area .btn-submit:hover {
          background: #115e59;
        }

        @media (max-width: 767px) {
          .form-setoran-card {
            padding: 19px 16px;
          }

          .form-setoran-header {
            flex-direction: column;
            gap: 16px;
            margin-bottom: 22px;
            padding-bottom: 18px;
          }

          .form-setoran-heading h2 {
            font-size: 20px;
          }

          .form-setoran-heading > p:last-child {
            font-size: 13px;
          }

          .form-lock-button {
            width: 100%;
          }

          .form-period-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 0;
          }

          .form-sampah-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 12px;
          }

          .form-sampah-item {
            padding: 14px;
          }

          .form-total-panel {
            align-items: flex-start;
            padding: 14px;
          }

          .form-total-caption {
            font-size: 13px;
          }

          .form-total-note {
            font-size: 11px;
          }

          .form-total-value {
            font-size: 22px;
          }
        }

        @media (min-width: 480px) and (max-width: 767px) {
          .form-sampah-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 380px) {
          .form-setoran-card {
            padding: 15px 12px;
          }

          .form-total-panel {
            flex-direction: column;
            gap: 8px;
          }

          .form-total-value {
            align-self: flex-start;
          }
        }
      `}</style>
    </>
  );
};

export default FormInput;