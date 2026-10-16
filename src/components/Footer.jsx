import React from 'react';

export default function Footer() {
  const tahunSekarang = new Date().getFullYear();

  return (
    <footer className="footer-bank-sampah">
      <div className="footer-container">
        {/* Identitas Bank Sampah */}
        <section
          className="footer-brand"
          aria-label="Identitas Bank Sampah"
        >
          <div className="footer-brand-header">
            <div
              className="footer-logo-container"
              aria-label="Logo wilayah"
            >
              <img
                src="/jakarta%20timur.png"
                alt="Logo Jakarta Timur"
                className="footer-logo"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
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
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
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
            Sistem informasi pencatatan dan rekapitulasi setoran
            sampah di lingkungan Kelurahan Pinang Ranti.
          </p>
        </section>

        {/* Alamat dan Kontak */}
        <section
          className="footer-section"
          aria-labelledby="footer-alamat"
        >
          <h3
            id="footer-alamat"
            className="footer-heading"
          >
            Alamat dan Kontak
          </h3>

          <address className="footer-address">
            Jl. SMA N 48 Jakarta, RT.14/RW.1, Pinang Ranti,
            Kecamatan Makasar, Kota Administrasi Jakarta Timur,
            DKI Jakarta 13560.
          </address>

          <div className="footer-contact">
            <span className="footer-contact-label">
              Nomor telepon
            </span>

            <a
              className="footer-contact-link"
              href="tel:+62218001403"
            >
              (021) 8001403
            </a>
          </div>
        </section>

        {/* Cakupan Sistem */}
        <section
          className="footer-section"
          aria-labelledby="footer-cakupan"
        >
          <h3
            id="footer-cakupan"
            className="footer-heading"
          >
            Cakupan Sistem
          </h3>

          <p className="footer-scope-intro">
            Wilayah yang tercakup dalam sistem:
          </p>

          <p className="footer-rw-list">
            RW 001 · RW 002 · RW 003 · RW 004 · RW 005
          </p>

          <div className="footer-features">
            <p>Pencatatan setoran sampah</p>
            <p>Rekapitulasi bulanan dan tahunan</p>
            <p>Grafik perbandingan setoran antar-RW</p>
          </div>
        </section>
      </div>

      {/* Bagian bawah */}
      <div className="footer-bottom-container">
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {tahunSekarang} Bank Sampah Kelurahan Pinang Ranti
          </p>

          <p className="footer-developer">
            Dikembangkan oleh{' '}
            <strong>Arsyaf Dwi Nur Prasetyo</strong>
          </p>
        </div>
      </div>

      <style>{`
        .footer-bank-sampah,
        .footer-bank-sampah * {
          box-sizing: border-box;
        }

        .footer-bank-sampah {
          width: 100%;
          min-width: 0;
          margin-top: 30px;
          color: #1e293b;
          background: #ffffff;
          border-top: 3px solid #0f766e;
          font-family: 'Inter', Arial, sans-serif;
        }

        .footer-container {
          display: grid;
          grid-template-columns:
            minmax(0, 1.18fr)
            minmax(0, 1fr)
            minmax(0, 1fr);
          gap: 30px;
          width: 100%;
          max-width: 1220px;
          margin: 0 auto;
          padding: 32px 24px 28px;
        }

        .footer-brand,
        .footer-section {
          min-width: 0;
        }

        .footer-brand-header {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
          margin-bottom: 14px;
        }

        .footer-logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          gap: 8px;
          min-height: 72px;
          padding: 8px 10px;
          background: #fbfdfc;
          border: 1px solid #e1ebe5;
          border-radius: 12px;
        }

        .footer-logo {
          display: block;
          width: 40px;
          height: 52px;
          object-fit: contain;
        }

        .footer-logo-divider {
          width: 1px;
          height: 36px;
          flex: 0 0 auto;
          background: #d7e3dc;
        }

        .footer-brand-title {
          min-width: 0;
        }

        .footer-brand-label {
          display: block;
          margin-bottom: 4px;
          color: #0f766e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .45px;
          line-height: 1.6;
        }

        .footer-brand-title h2 {
          margin: 0;
          color: #115e59;
          font-size: 19px;
          font-weight: 800;
          line-height: 1.35;
          overflow-wrap: anywhere;
        }

        .footer-brand-title h2 span {
          display: block;
        }

        .footer-description {
          max-width: 390px;
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.8;
        }

        .footer-heading {
          margin: 3px 0 13px;
          color: #1e293b;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .footer-address {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.8;
          font-style: normal;
          overflow-wrap: anywhere;
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 3px;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid #e5ece8;
        }

        .footer-contact-label {
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
        }

        .footer-contact-link {
          color: #115e59;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.5;
          text-decoration: none;
        }

        .footer-contact-link:hover {
          text-decoration: underline;
        }

        .footer-scope-intro {
          margin: 0 0 8px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.65;
        }

        .footer-rw-list {
          margin: 0 0 12px;
          color: #115e59;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.9;
          overflow-wrap: anywhere;
        }

        .footer-features {
          display: grid;
          gap: 7px;
        }

        .footer-features p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .footer-bottom-container {
          border-top: 1px solid #e2e8f0;
          background: #f7faf8;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px 18px;
          width: 100%;
          max-width: 1220px;
          margin: 0 auto;
          padding: 14px 24px;
        }

        .footer-copyright,
        .footer-developer {
          margin: 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .footer-developer strong {
          color: #115e59;
          font-weight: 800;
        }

        /* Tablet */
        @media (min-width: 641px) and (max-width: 1023px) {
          .footer-container {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px;
            padding: 30px 22px 26px;
          }

          .footer-brand {
            grid-column: 1 / -1;
          }

          .footer-description {
            max-width: 650px;
          }
        }

        /* HP */
        @media (max-width: 640px) {
          .footer-bank-sampah {
            margin-top: 24px;
          }

          .footer-container {
            grid-template-columns: minmax(0, 1fr);
            gap: 18px;
            padding: 23px 16px 20px;
          }

          .footer-brand-header {
            align-items: center;
            gap: 11px;
            margin-bottom: 10px;
          }

          .footer-logo-container {
            gap: 6px;
            min-height: 67px;
            padding: 6px 8px;
          }

          .footer-logo {
            width: 36px;
            height: 49px;
          }

          .footer-logo-divider {
            height: 33px;
          }

          .footer-brand-label {
            font-size: 9px;
            letter-spacing: .15px;
          }

          .footer-brand-title h2 {
            font-size: 17px;
          }

          .footer-description,
          .footer-address,
          .footer-scope-intro,
          .footer-features p {
            font-size: 12px;
          }

          .footer-section {
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
          }

          .footer-heading {
            margin-top: 0;
            margin-bottom: 9px;
            font-size: 14px;
          }

          .footer-rw-list {
            font-size: 12px;
          }

          .footer-features {
            gap: 5px;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
            padding: 12px 16px;
          }
        }

        /* HP sangat kecil */
        @media (max-width: 360px) {
          .footer-container {
            padding-right: 12px;
            padding-left: 12px;
          }

          .footer-brand-header {
            gap: 8px;
          }

          .footer-logo-container {
            gap: 4px;
            padding: 5px 6px;
          }

          .footer-logo {
            width: 32px;
            height: 45px;
          }

          .footer-brand-label {
            font-size: 8px;
          }

          .footer-brand-title h2 {
            font-size: 16px;
          }
        }
      `}</style>
    </footer>
  );
}