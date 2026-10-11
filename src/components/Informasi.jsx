import React from 'react';

const Informasi = ({ totalSampahBulanIni, wilayahTeraktif }) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '24px', 
      marginBottom: '32px' 
    }}>
      
      {/* Card 1: Total Setoran */}
      <div className="card" style={{ borderLeft: '5px solid #0f766e', padding: '20px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
          Total Setoran (Bulan Ini)
        </h4>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-main)' }}>
            {totalSampahBulanIni !== undefined ? totalSampahBulanIni.toFixed(1) : '0.0'}
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Kg</span>
        </div>
      </div>

      {/* Card 2: Wilayah Teraktif */}
      <div className="card" style={{ borderLeft: '5px solid #f59e0b', padding: '20px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
          Wilayah Teraktif
        </h4>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-main)' }}>
            {wilayahTeraktif || '-'}
          </span>
        </div>
      </div>

      {/* Card 3: Papan Informasi */}
      <div className="card" style={{ borderLeft: '5px solid #3b82f6', padding: '20px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
          Papan Informasi
        </h4>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5' }}>
          Pastikan data timbangan sudah <strong>divalidasi</strong> sebelum disimpan ke dalam sistem.
        </p>
      </div>

    </div>
  );
};

export default Informasi;