import React from 'react';

export default function Header() {
  return (
    <>
      <header className="clean-site-header">
        <div className="clean-header-brand">
          <div
            className="clean-header-logos"
            aria-label="Identitas Pemerintah Daerah"
          >
            <img
              src="/jakarta%20timur.png"
              alt="Logo Jakarta Timur"
              width="48"
              height="60"
              loading="eager"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />

            <span
              className="clean-logo-divider"
              aria-hidden="true"
            />

            <img
              src="/jaya%20raya.png"
              alt="Logo Jaya Raya"
              width="48"
              height="60"
              loading="eager"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="clean-header-copy">
            <span className="clean-header-eyebrow">
              KELURAHAN PINANG RANTI
            </span>

            <h1>Bank Sampah</h1>

            <p>Sistem Informasi Data Setoran Sampah</p>
          </div>
        </div>

        <div className="clean-header-location">
          <span
            className="clean-location-dot"
            aria-hidden="true"
          />
          <span>Jakarta Timur</span>
        </div>
      </header>

      <style>{`
        .clean-site-header,
        .clean-site-header * {
          box-sizing: border-box;
        }

        .clean-site-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          width: 100%;
          min-width: 0;
          margin: 0 0 25px;
          padding: 20px 24px;
          background: #ffffff;
          border: 1px solid #e2eae5;
          border-radius: 16px;
          box-shadow: 0 3px 12px rgba(15, 61, 46, 0.035);
        }

        .clean-header-brand {
          display: flex;
          align-items: center;
          gap: 17px;
          min-width: 0;
          flex: 1 1 auto;
        }

        .clean-header-logos {
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 76px;
          padding: 8px 10px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
        }

        .clean-header-logos img {
          display: block;
          width: 48px;
          height: 60px;
          object-fit: contain;
        }

        .clean-logo-divider {
          display: block;
          width: 1px;
          height: 40px;
          flex-shrink: 0;
          background: #dbe5df;
        }

        .clean-header-copy {
          min-width: 0;
        }

        .clean-header-eyebrow {
          display: block;
          margin-bottom: 3px;
          color: #0f766e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          line-height: 1.6;
        }

        .clean-header-copy h1 {
          margin: 0;
          color: #123f35;
          font-size: clamp(22px, 2.5vw, 27px);
          font-weight: 800;
          line-height: 1.35;
          letter-spacing: -0.6px;
          overflow-wrap: anywhere;
        }

        .clean-header-copy p {
          margin: 3px 0 0;
          color: #64748b;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.65;
        }

        .clean-header-location {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          color: #386b57;
          background: #f0f8f3;
          border: 1px solid #dcece1;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .clean-location-dot {
          width: 7px;
          height: 7px;
          flex-shrink: 0;
          background: #168467;
          border-radius: 50%;
        }

        /* Tablet */
        @media (min-width: 641px) and (max-width: 900px) {
          .clean-site-header {
            gap: 15px;
            padding: 18px;
            margin-bottom: 21px;
          }

          .clean-header-brand {
            gap: 12px;
          }

          .clean-header-logos {
            gap: 6px;
            min-height: 69px;
            padding: 7px 8px;
          }

          .clean-header-logos img {
            width: 43px;
            height: 54px;
          }

          .clean-logo-divider {
            height: 35px;
          }

          .clean-header-copy h1 {
            font-size: 23px;
          }

          .clean-header-location {
            padding: 8px 10px;
            font-size: 11px;
          }
        }

        /* HP */
        @media (max-width: 640px) {
          .clean-site-header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            padding: 16px 14px;
            margin-bottom: 19px;
            border-radius: 13px;
          }

          .clean-header-brand {
            align-items: center;
            gap: 11px;
            width: 100%;
          }

          .clean-header-logos {
            gap: 5px;
            min-height: 76px;
            padding: 7px 8px;
          }

          .clean-header-logos img {
            width: 42px;
            height: 57px;
          }

          .clean-logo-divider {
            height: 39px;
          }

          .clean-header-eyebrow {
            margin-bottom: 3px;
            font-size: 9px;
            letter-spacing: 0.4px;
            line-height: 1.5;
          }

          .clean-header-copy h1 {
            font-size: 22px;
            letter-spacing: -0.45px;
          }

          .clean-header-copy p {
            max-width: 240px;
            font-size: 11px;
            line-height: 1.55;
          }

          .clean-header-location {
            align-self: flex-end;
            gap: 6px;
            padding: 6px 9px;
            margin-top: 0;
            font-size: 10px;
          }

          .clean-location-dot {
            width: 6px;
            height: 6px;
          }
        }

        /* HP sangat kecil */
        @media (max-width: 380px) {
          .clean-site-header {
            padding: 14px 10px;
          }

          .clean-header-brand {
            gap: 9px;
          }

          .clean-header-logos {
            gap: 4px;
            min-height: 69px;
            padding: 6px 6px;
          }

          .clean-header-logos img {
            width: 36px;
            height: 51px;
          }

          .clean-logo-divider {
            height: 34px;
          }

          .clean-header-eyebrow {
            font-size: 8px;
            letter-spacing: 0.2px;
          }

          .clean-header-copy h1 {
            font-size: 20px;
          }

          .clean-header-copy p {
            max-width: 190px;
            font-size: 10px;
          }
        }
      `}</style>
    </>
  );
}