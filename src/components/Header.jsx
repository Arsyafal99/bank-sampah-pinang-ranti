import React from 'react';

const Header = () => {
  return (
    <header style={{ 
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
      borderRadius: '16px', 
      padding: 'clamp(20px, 4vw, 32px) clamp(20px, 4vw, 40px)', 
      marginBottom: '32px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      borderLeft: '8px solid var(--primary-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap', // Otomatis turun ke bawah kalau layar gak muat
      gap: '24px'
    }}>
      {/* Sisi Kiri: Logo & Judul Instansi */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', 
        flexWrap: 'wrap', // Biar di HP logo & teks bisa menyesuaikan jika layar sempit
        flex: '1 1 300px'
      }}>
        
        {/* Kontainer Kedua Logo Berdampingan (Proporsional & Pas di Semua Device) */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '14px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '12px 18px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
          border: '1px solid #f1f5f9',
          flexShrink: 0
        }}>
          <img 
            src="/jakarta timur.png" 
            alt="Logo Jakarta Timur" 
            style={{ width: '58px', height: '70px', objectFit: 'contain', display: 'block' }}
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
          <div style={{ width: '1px', height: '48px', background: '#cbd5e1' }}></div>
          <img 
            src="/jaya raya.png" 
            alt="Logo Jaya Raya" 
            style={{ width: '58px', height: '70px', objectFit: 'contain', display: 'block' }}
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
        </div>

        {/* Area Teks Judul */}
        <div style={{ flex: '1 1 220px' }}>
          <h1 style={{ 
            color: 'var(--primary-color)', 
            margin: '0 0 6px 0', 
            fontSize: 'clamp(20px, 2.5vw, 28px)', // Ukuran font menyesuaikan otomatis secara mulus
            fontWeight: '800',
            letterSpacing: '-0.5px',
            fontFamily: "'Inter', sans-serif",
            lineHeight: '1.2'
          }}>
            Sistem Informasi Bank Sampah
          </h1>
          <p style={{ 
            color: 'var(--text-muted)', 
            margin: 0, 
            fontSize: 'clamp(13px, 1.5vw, 15px)', 
            fontWeight: '600',
            letterSpacing: '0.2px',
            lineHeight: '1.4'
          }}>
            Pemerintah Kelurahan Pinang Ranti • Jakarta Timur
          </p>
        </div>
      </div>

      {/* Sisi Kanan: Badge Status */}
      <div style={{ 
        backgroundColor: '#f0fdf4', 
        border: '1px solid #bbf7d0', 
        padding: '10px 18px', 
        borderRadius: '30px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        boxShadow: '0 2px 4px rgba(22, 101, 52, 0.05)',
        flexShrink: 0
      }}>
        <span style={{ fontSize: '12px', animation: 'pulse 2s infinite' }}>🟢</span>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#166534', letterSpacing: '0.3px' }}>
          Portal Resmi Warga
        </span>
      </div>
    </header>
  );
};

export default Header;