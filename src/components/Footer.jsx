import React from 'react';

const Footer = () => {
  const tahunSekarang = new Date().getFullYear();

  return (
    <>
      <footer className="footer-bank-sampah">
        <div className="footer-container">
          {/* Kolom 1: Identitas Bank Sampah */}
          <section className="footer-brand">
            <div className="footer-brand-header">
              <div className="footer-logo-container">
                <img
                  src="/jakarta%20timur.png"
                  alt="Logo Jakarta Timur"
                  className="footer-logo"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />

                <span
                  className="footer-logo-divider"
                  aria-hidden="true"
                />

                <img
                  src="/jaya%20raya.png"
                  alt="Logo Jaya Raya"
                  className="footer-logo"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div className="footer-brand-title">
                <span className="footer-brand-label">
                  KELURAHAN PINANG RANTI
                </span>

                <h2>
                  Bank Sampah
                  <span>Pinang Ranti</span>
                </h2>
              </div>
            </div>

            <p className="footer-description">
              Sistem informasi untuk pencatatan dan
              rekapitulasi data setoran sampah warga
              di lingkungan Kelurahan Pinang Ranti.
            </p>
          </section>

          {/* Kolom 2: Alamat dan Kontak */}
          <section className="footer-section">
            <div className="footer-heading">
              <span
                className="footer-heading-icon"
                aria-hidden="true"
              >
                📍
              </span>

              <h3>Alamat Kantor Kelurahan</h3>
            </div>

            <address className="footer-address">
              Jl. SMA N 48 Jakarta, RT.14/RW.1,
              Pinang Ranti, Kecamatan Makasar,
              Kota Administrasi Jakarta Timur,
              DKI Jakarta 13560.
            </address>

            <div className="footer-contact">
              <span aria-hidden="true">☎️</span>

              <div>
                <span className="footer-contact-label">
                  Nomor telepon
                </span>

                <strong>(021) 8001403</strong>
              </div>
            </div>
          </section>

          {/* Kolom 3: Cakupan Sistem */}
          <section className="footer-section">
            <div className="footer-heading">
              <span
                className="footer-heading-icon"
                aria-hidden="true"
              >
                ♻️
              </span>

              <h3>Cakupan Sistem</h3>
            </div>

            <ul className="footer-list">
              <li>
                <span aria-hidden="true">✓</span>
                <span>Wilayah RW 01 hingga RW 05</span>
              </li>

              <li>
                <span aria-hidden="true">✓</span>
                <span>Pencatatan setoran sampah</span>
              </li>

              <li>
                <span aria-hidden="true">✓</span>
                <span>Rekapitulasi data bulanan dan tahunan</span>
              </li>

              <li>
                <span aria-hidden="true">✓</span>
                <span>Grafik perbandingan setoran antar-RW</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Bagian bawah footer */}
        <div className="footer-bottom-container">
          <div className="footer-bottom">
            <p className="footer-copyright">
              © {tahunSekarang} Pemerintah Kelurahan Pinang
              Ranti. Hak cipta dilindungi.
            </p>

            <p className="footer-developer">
              Dikembangkan oleh
              <strong>Arsyaf Dwi Nur Prasetyo</strong>
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        .footer-bank-sampah {
          width: 100%;
          min-width: 0;
          margin-top: auto;
          background: #ffffff;
          border-top: 3px solid #0f766e;
          font-family: 'Inter', Arial, sans-serif;
          color: #1e293b;
          box-sizing: border-box;
        }

        .footer-container {
          display: grid;
          grid-template-columns:
            minmax(0, 1.2fr)
            minmax(0, 1fr)
            minmax(0, 1fr);

          gap: 36px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 42px 24px 36px;
          box-sizing: border-box;
        }

        .footer-brand,
        .footer-section {
          min-width: 0;
        }

        .footer-brand-header {
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: 0;
          margin-bottom: 18px;
        }

        .footer-logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-shrink: 0;
          padding: 9px 11px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 2px 7px rgba(15, 23, 42, 0.04);
        }

        .footer-logo {
          display: block;
          width: 38px;
          height: 48px;
          object-fit: contain;
        }

        .footer-logo-divider {
          display: block;
          width: 1px;
          height: 34px;
          flex-shrink: 0;
          background: #cbd5e1;
        }

        .footer-brand-title {
          min-width: 0;
        }

        .footer-brand-label {
          display: block;
          margin-bottom: 5px;
          color: #0f766e;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.6px;
          line-height: 1.7;
        }

        .footer-brand-title h2 {
          margin: 0;
          color: #115e59;
          font-size: 17px;
          font-weight: 800;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .footer-brand-title h2 span {
          display: block;
        }

        .footer-description {
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.9;
          overflow-wrap: anywhere;
        }

        .footer-section {
          padding-top: 5px;
        }

        .footer-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .footer-heading-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          flex-shrink: 0;
          background: #f0fdfa;
          border: 1px solid #ccfbf1;
          border-radius: 9px;
          font-size: 17px;
        }

        .footer-heading h3 {
          margin: 0;
          color: #1e293b;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .footer-address {
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.9;
          font-style: normal;
          overflow-wrap: anywhere;
        }

        .footer-contact {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 17px;
          padding-top: 14px;
          border-top: 1px solid #e2e8f0;
        }

        .footer-contact > span {
          font-size: 17px;
          line-height: 1.5;
        }

        .footer-contact-label {
          display: block;
          margin-bottom: 3px;
          color: #64748b;
          font-size: 11px;
          line-height: 1.6;
        }

        .footer-contact strong {
          display: block;
          color: #115e59;
          font-size: 13px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .footer-list {
          display: grid;
          gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .footer-list li {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.8;
        }

        .footer-list li > span:first-child {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 19px;
          height: 19px;
          flex-shrink: 0;
          margin-top: 1px;
          color: #0f766e;
          background: #ccfbf1;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 800;
        }

        .footer-bottom-container {
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 18px 24px;
          box-sizing: border-box;
        }

        .footer-copyright,
        .footer-developer {
          margin: 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .footer-developer {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 5px;
        }

        .footer-developer strong {
          color: #115e59;
          font-weight: 800;
        }

        /* Tablet */
        @media (min-width: 768px) and (max-width: 1023px) {
          .footer-container {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 30px;
            padding: 34px 22px;
          }

          .footer-brand {
            grid-column: 1 / -1;
          }

          .footer-brand-header {
            justify-content: flex-start;
          }

          .footer-description {
            max-width: 650px;
          }

          .footer-bottom {
            padding: 17px 22px;
          }
        }

        /* HP */
        @media (max-width: 767px) {
          .footer-container {
            grid-template-columns: minmax(0, 1fr);
            gap: 25px;
            padding: 28px 18px;
          }

          .footer-brand-header {
            align-items: center;
            gap: 13px;
          }

          .footer-logo-container {
            gap: 8px;
            padding: 8px 9px;
          }

          .footer-logo {
            width: 33px;
            height: 43px;
          }

          .footer-logo-divider {
            height: 31px;
          }

          .footer-brand-title h2 {
            font-size: 16px;
          }

          .footer-brand-label {
            font-size: 9px;
          }

          .footer-description,
          .footer-address,
          .footer-list li {
            font-size: 12px;
          }

          .footer-section {
            padding-top: 19px;
            border-top: 1px solid #e2e8f0;
          }

          .footer-heading {
            margin-bottom: 12px;
          }

          .footer-contact {
            margin-top: 13px;
            padding-top: 12px;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 9px;
            padding: 16px 18px;
          }

          .footer-copyright,
          .footer-developer {
            font-size: 11px;
          }
        }

        /* HP kecil */
        @media (max-width: 380px) {
          .footer-container {
            padding: 24px 13px;
            gap: 22px;
          }

          .footer-brand-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }

          .footer-brand-title h2 {
            font-size: 17px;
          }

          .footer-bottom {
            padding: 14px 13px;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;