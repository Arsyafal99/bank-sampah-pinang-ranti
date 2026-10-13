import React from 'react';

const Header = () => {
  return (
    <>
      <header className="app-header">
        {/* Bagian identitas situs */}
        <div className="app-header-brand">
          {/* Logo instansi */}
          <div className="app-header-logos">
            <img
              src="/jakarta%20timur.png"
              alt="Logo Jakarta Timur"
              className="app-header-logo"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />

            <span
              className="app-header-logo-divider"
              aria-hidden="true"
            />

            <img
              src="/jaya%20raya.png"
              alt="Logo Jaya Raya"
              className="app-header-logo"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Judul dan nama instansi */}
          <div className="app-header-title">
            <span className="app-header-eyebrow">
              KELURAHAN PINANG RANTI
            </span>

            <h1>Sistem Informasi Bank Sampah</h1>

            <p>
              Pemerintah Kelurahan Pinang Ranti
              <span className="app-header-separator" aria-hidden="true">
                •
              </span>
              Jakarta Timur
            </p>
          </div>
        </div>

        {/* Penanda sistem */}
        <div
          className="app-header-status"
          aria-label="Sistem informasi Bank Sampah"
        >
          <span className="app-header-status-dot" aria-hidden="true" />

          <span>Sistem Informasi Warga</span>
        </div>
      </header>

      <style>{`
        .app-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;

          width: 100%;
          min-width: 0;
          margin-bottom: 30px;
          padding: clamp(20px, 3vw, 32px);

          background: linear-gradient(
            135deg,
            #ffffff 0%,
            #f8fcfb 100%
          );

          border: 1px solid #e2e8f0;
          border-left: 6px solid #0f766e;
          border-radius: 16px;

          box-shadow:
            0 8px 24px rgba(15, 23, 42, 0.045),
            0 2px 5px rgba(15, 23, 42, 0.025);

          box-sizing: border-box;
        }

        .app-header-brand {
          display: flex;
          align-items: center;
          gap: 22px;

          flex: 1 1 auto;
          min-width: 0;
        }

        .app-header-logos {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;

          flex-shrink: 0;
          padding: 12px 15px;

          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;

          box-shadow: 0 3px 9px rgba(15, 23, 42, 0.04);
        }

        .app-header-logo {
          display: block;
          width: 52px;
          height: 64px;
          object-fit: contain;
        }

        .app-header-logo-divider {
          display: block;
          width: 1px;
          height: 45px;
          flex-shrink: 0;
          background: #cbd5e1;
        }

        .app-header-title {
          min-width: 0;
          flex: 1 1 auto;
        }

        .app-header-eyebrow {
          display: block;
          margin-bottom: 7px;

          color: #0f766e;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          line-height: 1.6;
        }

        .app-header-title h1 {
          margin: 0 0 10px;

          color: #115e59;
          font-size: clamp(21px, 2.5vw, 29px);
          font-weight: 800;
          letter-spacing: -0.6px;
          line-height: 1.3;

          overflow-wrap: anywhere;
        }

        .app-header-title p {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;

          margin: 0;
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.8;
        }

        .app-header-separator {
          color: #0f766e;
          font-weight: 800;
        }

        .app-header-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;

          flex: 0 0 auto;
          max-width: 100%;
          padding: 10px 14px;

          color: #166534;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 999px;

          font-size: 12px;
          font-weight: 700;
          line-height: 1.6;
          white-space: normal;
        }

        .app-header-status-dot {
          display: block;
          width: 9px;
          height: 9px;
          flex-shrink: 0;

          background: #16a34a;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
        }

        /* Tablet dan laptop berukuran sedang */
        @media (min-width: 768px) and (max-width: 1023px) {
          .app-header {
            gap: 16px;
            padding: 22px;
          }

          .app-header-brand {
            gap: 16px;
          }

          .app-header-logos {
            gap: 9px;
            padding: 10px;
          }

          .app-header-logo {
            width: 43px;
            height: 56px;
          }

          .app-header-title h1 {
            font-size: 23px;
          }

          .app-header-status {
            padding: 9px 11px;
            font-size: 11px;
          }
        }

        /* HP */
        @media (max-width: 767px) {
          .app-header {
            flex-direction: column;
            align-items: stretch;
            gap: 18px;

            margin-bottom: 22px;
            padding: 20px 17px;

            border-left-width: 5px;
            border-radius: 13px;
          }

          .app-header-brand {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }

          .app-header-logos {
            align-self: flex-start;
            gap: 12px;
            padding: 10px 14px;
            border-radius: 12px;
          }

          .app-header-logo {
            width: 43px;
            height: 54px;
          }

          .app-header-logo-divider {
            height: 40px;
          }

          .app-header-title {
            width: 100%;
          }

          .app-header-eyebrow {
            font-size: 10px;
            margin-bottom: 6px;
          }

          .app-header-title h1 {
            margin-bottom: 9px;
            font-size: clamp(21px, 5.7vw, 26px);
            letter-spacing: -0.4px;
            line-height: 1.35;
          }

          .app-header-title p {
            gap: 4px 7px;
            font-size: 12px;
            line-height: 1.8;
          }

          .app-header-status {
            align-self: flex-start;
            padding: 8px 12px;
            font-size: 11px;
          }
        }

        /* HP kecil */
        @media (max-width: 380px) {
          .app-header {
            padding: 16px 12px;
            gap: 15px;
          }

          .app-header-brand {
            gap: 14px;
          }

          .app-header-logos {
            gap: 9px;
            padding: 8px 11px;
          }

          .app-header-logo {
            width: 39px;
            height: 49px;
          }

          .app-header-title h1 {
            font-size: 20px;
          }

          .app-header-title p {
            font-size: 11px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .app-header * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Header;