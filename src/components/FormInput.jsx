import React, { useState } from 'react';

const FormInput = ({ formData, handleInputChange, kirimData }) => {
  // State untuk sistem PIN
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleLoginPin = (e) => {
    e.preventDefault();
    if (pin === '2627') { 
      setIsAuthorized(true);
    } else {
      alert('PIN Akses Salah! Hanya pengurus RW atau petugas kelurahan yang dapat mengisi.');
      setPin('');
    }
  };

  // 1. TAMPILAN JIKA BELUM MEMASUKKAN PIN (TERKUNCI)
  if (!isAuthorized) {
    return (
      <div className="card" style={{ maxWidth: '450px', margin: '40px auto', textAlign: 'center', padding: '36px' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
        <h3 style={{ marginBottom: '12px', fontSize: '20px', color: 'var(--text-main)' }}>
          Akses Terbatas 
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
          Masukkan <strong>PIN Akses</strong> yang valid untuk membuka formulir input data setoran Bank Sampah Kelurahan Pinang Ranti.
        </p>
        <form onSubmit={handleLoginPin}>
          <input 
            type="password" 
            placeholder="Masukkan PIN Rahasia" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)}
            className="form-input"
            style={{ marginBottom: '16px', textAlign: 'center', letterSpacing: '6px', fontSize: '18px' }}
            required
            autoFocus
          />
          <button type="submit" className="btn-submit">
            Buka Formulir Input
          </button>
        </form>
      </div>
    );
  }

  // 2. TAMPILAN JIKA PIN BENAR (FORMULIR ASLI)
  return (
    <div className="card" style={{ flex: '1', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>
          Input Data Setoran
        </h3>
        <button 
          type="button" 
          onClick={() => setIsAuthorized(false)}
          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
        >
          🔒 Kunci Kembali
        </button>
      </div>

      <form onSubmit={kirimData}>
        
        {/* Baris 1: Bulan, Tahun, Wilayah */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '120px' }}>
            <label className="form-label">Bulan Laporan</label>
            <select className="form-input" name="bulan" value={formData.bulan} onChange={handleInputChange}>
              {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(bln => (
                <option key={bln} value={bln}>{bln}</option>
              ))}
            </select>
          </div>
          
          <div style={{ flex: '1', minWidth: '100px' }}>
            <label className="form-label">Tahun</label>
            <select className="form-input" name="tahun" value={formData.tahun} onChange={handleInputChange}>
              {['2026', '2027', '2028', '2029', '2030'].map(thn => (
                <option key={thn} value={thn}>{thn}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '100px' }}>
            <label className="form-label">Wilayah</label>
            <select className="form-input" name="rw" value={formData.rw} onChange={handleInputChange}>
              {['RW 01', 'RW 02', 'RW 03', 'RW 04', 'RW 05'].map(rw => (
                <option key={rw} value={rw}>{rw}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Baris 2: Input 4 Jenis Sampah Utama */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div>
            <label className="form-label">Plastik (Kg)</label>
            <input className="form-input" type="number" step="0.1" min="0" name="plastik" value={formData.plastik} onChange={handleInputChange} required />
          </div>
          <div>
            <label className="form-label">Kertas (Kg)</label>
            <input className="form-input" type="number" step="0.1" min="0" name="kertas" value={formData.kertas} onChange={handleInputChange} required />
          </div>
          <div>
            <label className="form-label">Logam (Kg)</label>
            <input className="form-input" type="number" step="0.1" min="0" name="logam" value={formData.logam} onChange={handleInputChange} required />
          </div>
          <div>
            <label className="form-label">Kaca (Kg)</label>
            <input className="form-input" type="number" step="0.1" min="0" name="kaca" value={formData.kaca} onChange={handleInputChange} required />
          </div>
        </div>

        <button type="submit" className="btn-submit">
          Simpan Data Laporan
        </button>
      </form>
    </div>
  );
};

export default FormInput;