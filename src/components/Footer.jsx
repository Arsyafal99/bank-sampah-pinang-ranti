import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#ffffff', 
      borderTop: '2px solid var(--border-color)', 
      padding: '48px 24px 24px 24px', 
      marginTop: 'auto',
      fontFamily: "'Inter', sans-serif",
      color: 'var(--text-main)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
        gap: '40px',
        marginBottom: '32px',
        alignItems: 'center'
      }}>
        
        {/* Kolom 1: Logo & Judul */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            {/* Bungkus kedua logo dengan ukuran besar yang proporsional */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              background: '#ffffff',
              padding: '10px 14px',
              borderRadius: '12px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0',
              flexShrink: 0
            }}>
              <img 
                src="/jakarta timur.png" 
                alt="Logo Jakarta Timur" 
                style={{ width: '42px', height: '52px', objectFit: 'contain', display: 'block' }} 
                onError={(e) => { e.target.style.display = 'none'; }} 
              />
              <div style={{ width: '1px', height: '36px', background: '#cbd5e1' }}></div>
              <img 
                src="/jaya raya.png" 
                alt="Logo Jaya Raya" 
                style={{ width: '42px', height: '52px', objectFit: 'contain', display: 'block' }} 
                onError={(e) => { e.target.style.display = 'none'; }} 
              />
            </div>
            <h4 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '16px', fontWeight: '800', lineHeight: '1.3' }}>
              Bank Sampah<br />Pinang Ranti
            </h4>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            Sistem Informasi Pengelolaan dan Rekapitulasi Data Setoran Sampah Warga Berbasis Digital di Lingkungan Kelurahan Pinang Ranti.
          </p>
        </div>

        {/* Kolom 2: Alamat & Kontak Resmi */}
        <div>
          <h5 style={{ color: 'var(--text-main)', margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600' }}>
            Kantor Kelurahan
          </h5>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', margin: '0 0 8px 0' }}>
            Jl. SMA N 48 Jakarta, RT.14/RW.1, Pinang Ranti, Kec. Makasar, Kota Jakarta Timur, 13560
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
            📞 Telepon: <strong style={{ color: 'var(--text-main)' }}>(021) 8001403</strong>
          </p>
        </div>

        {/* Kolom 3: Cakupan Wilayah */}
        <div>
          <h5 style={{ color: 'var(--text-main)', margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600' }}>
            Cakupan Wilayah
          </h5>
          <ul style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.8', margin: 0, paddingLeft: '18px' }}>
            <li>RW 01 s.d. RW 05 Pinang Ranti</li>
            <li>Pelaporan Data Bulanan & Tahunan</li>
            <li>Integrasi Transparansi Warga</li>
          </ul>
        </div>

      </div>

      {/* Bagian Bawah: Copyright & Pembuat */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        borderTop: '1px solid #e2e8f0', 
        paddingTop: '20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '12px',
        fontSize: '12px', 
        color: 'var(--text-muted)' 
      }}>
        <p style={{ margin: 0 }}>
          &copy; 2026 Pemerintah Kelurahan Pinang Ranti. Hak Cipta Dilindungi.
        </p>
        <p style={{ margin: 0, fontStyle: 'italic' }}>
          Dikembangkan oleh <strong style={{ color: 'var(--text-main)' }}>Arsyaf Dwi Nur Prasetyo</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;