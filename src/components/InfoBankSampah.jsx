import React from 'react';

const InfoBankSampah = () => {
  return (
    <div className="card" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <h2 style={{ color: 'var(--primary-color)', marginBottom: '16px', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px' }}>
        Panduan & Informasi Bank Sampah
      </h2>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>Apa itu Bank Sampah?</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Bank Sampah adalah program pemberdayaan masyarakat yang bertujuan untuk mengelola sampah anorganik menjadi sesuatu yang bernilai ekonomis. Warga dapat menyetorkan sampah yang telah dipilah, yang kemudian akan ditimbang dan dihargai dalam bentuk tabungan.
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>Jenis Sampah yang Diterima</h3>
        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '20px' }}>
          <li><strong>Plastik:</strong> Botol minuman, gelas plastik, kantong kresek bersih.</li>
          <li><strong>Kertas:</strong> Kardus, buku bekas, majalah, koran.</li>
          <li><strong>Logam:</strong> Kaleng minuman, besi tua, aluminium.</li>
          <li><strong>Kaca:</strong> Botol kaca utuh (sirup, kecap).</li>
          <li><strong>Minyak Jelantah:</strong> Minyak sisa menggoreng yang sudah disaring.</li>
        </ul>
      </div>

      <div>
        <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>Alur Penyetoran</h3>
        <ol style={{ color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '20px' }}>
          <li>Pilah sampah dari rumah sesuai jenisnya (plastik, kertas, dll).</li>
          <li>Bawa sampah yang sudah dipilah ke lokasi penimbangan di RW masing-masing pada jadwal yang telah ditentukan.</li>
          <li>Petugas akan menimbang dan mencatat hasil setoran ke dalam buku tabungan warga.</li>
          <li>Data rekapitulasi tingkat RW akan diinput oleh koordinator ke dalam sistem ini.</li>
        </ol>
      </div>
    </div>
  );
};

export default InfoBankSampah;