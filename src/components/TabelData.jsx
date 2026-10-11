import React, { useState, useEffect } from 'react';

const TabelData = () => {
  const [dataSetoran, setDataSetoran] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Filter Bulan & Tahun
  const [selectedBulan, setSelectedBulan] = useState('Semua');
  const [selectedTahun, setSelectedTahun] = useState('Semua');

  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyPSYQsJAuVhCi5CmAswNy0wEkr94zwxxsgoRXjyNaOccYWlCykS-g7GroBxMlY0NXBeg/exec';

  useEffect(() => {
    fetch(WEB_APP_URL)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDataSetoran(data);
          setFilteredData(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal memuat data:', err);
        setLoading(false);
      });
  }, []);

  // Fungsi untuk Filter Data berdasarkan Bulan & Tahun
  useEffect(() => {
    let result = dataSetoran;

    if (selectedBulan !== 'Semua') {
      result = result.filter(item => {
        const bulanItem = item.bulan || item.Bulan || '';
        return bulanItem.toLowerCase() === selectedBulan.toLowerCase();
      });
    }

    if (selectedTahun !== 'Semua') {
      result = result.filter(item => {
        const tahunItem = String(item.tahun || item.Tahun || '');
        return tahunItem === String(selectedTahun);
      });
    }

    setFilteredData(result);
  }, [selectedBulan, selectedTahun, dataSetoran]);

  // Fungsi untuk Download File Excel (.xls) dengan Kop Surat Resmi & Garis Pembatas
  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data yang sesuai untuk diunduh!');
      return;
    }

    let totalPlastik = 0;
    let totalKertas = 0;
    let totalLogam = 0;
    let totalKaca = 0;
    let grandTotalBerat = 0;

    filteredData.forEach(item => {
      totalPlastik += Number(item.plastik || item.Plastik || 0);
      totalKertas += Number(item.kertas || item.Kertas || 0);
      totalLogam += Number(item.logam || item.Logam || 0);
      totalKaca += Number(item.kaca || item.Kaca || 0);
      grandTotalBerat += Number(item.total || item.Total || item.total_berat || 0);
    });

    let excelHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Segoe UI', Calibri, sans-serif; }
          .kop-instansi { font-weight: bold; font-size: 12pt; color: #00332C; text-align: center; }
          .kop-sub { font-weight: bold; font-size: 11pt; color: #004D40; text-align: center; }
          .kop-alamat { font-size: 9pt; color: #555555; text-align: center; font-style: italic; }
          .judul-laporan { font-weight: bold; font-size: 11pt; color: #000000; text-align: center; margin-top: 15px; }
          
          table { border-collapse: collapse; width: 100%; margin-top: 10px; }
          th {
            background-color: #004D40;
            color: #FFFFFF;
            font-weight: bold;
            text-align: center;
            vertical-align: middle;
            padding: 10px;
            border: 1px solid #000000;
            font-size: 10pt;
          }
          td {
            border: 1px solid #A6A6A6;
            vertical-align: middle;
            padding: 6px 8px;
            font-size: 10pt;
          }
          .center { text-align: center; }
          .right { text-align: right; }
          .left { text-align: left; }
          .bold { font-weight: bold; }
          .total-tr {
            background-color: #E0F2F1;
            font-weight: bold;
            color: #004D40;
          }
        </style>
      </head>
      <body>
        <table>
          <tr><td colspan="10" class="kop-instansi" style="border:none;">PEMERINTAH PROVINSI DKI JAKARTA</td></tr>
          <tr><td colspan="10" class="kop-instansi" style="border:none;">KOTA ADMINISTRASI JAKARTA TIMUR</td></tr>
          <tr><td colspan="10" class="kop-sub" style="border:none;">KECAMATAN MAKASAR - KELURAHAN PINANG RANTI</td></tr>
          <tr><td colspan="10" class="kop-alamat" style="border:none;">Jl. SMA N 48 Jakarta, RT.14/RW.1, Pinang Ranti, Kec. Makasar, Kota Jakarta Timur, 13560</td></tr>
          <tr>
            <td colspan="10" style="border:none; border-bottom: 2.5px solid #004D40; padding-bottom: 5px;"></td>
          </tr>
          
          <tr><td colspan="10" class="judul-laporan" style="border:none;">LAPORAN REKAPITULASI DATA BANK SAMPAH - PERIODE: ${selectedBulan.toUpperCase()} ${selectedTahun}</td></tr>
          <tr><td colspan="10" style="border:none;"></td></tr>

          <thead>
            <tr>
              <th>NO.</th>
              <th>TIMESTAMP</th>
              <th>TAHUN</th>
              <th>BULAN</th>
              <th>NOMOR RW</th>
              <th>PLASTIK (KG)</th>
              <th>KERTAS (KG)</th>
              <th>LOGAM (KG)</th>
              <th>KACA (KG)</th>
              <th>TOTAL BERAT (KG)</th>
            </tr>
          </thead>
          <tbody>
    `;

    filteredData.forEach((item, index) => {
      excelHTML += `
        <tr>
          <td class="center">${index + 1}</td>
          <td class="left">${item.timestamp || item.Timestamp || '-'}</td>
          <td class="center">${item.tahun || item.Tahun || ''}</td>
          <td class="center">${item.bulan || item.Bulan || ''}</td>
          <td class="center">${item.rw || item.RW || item.Wilayah || ''}</td>
          <td class="right">${Number(item.plastik || item.Plastik || 0).toFixed(1)}</td>
          <td class="right">${Number(item.kertas || item.Kertas || 0).toFixed(1)}</td>
          <td class="right">${Number(item.logam || item.Logam || 0).toFixed(1)}</td>
          <td class="right">${Number(item.kaca || item.Kaca || 0).toFixed(1)}</td>
          <td class="right bold">${Number(item.total || item.Total || item.total_berat || 0).toFixed(1)}</td>
        </tr>
      `;
    });

    excelHTML += `
          </tbody>
          <tfoot>
            <tr class="total-tr">
              <td colspan="5" class="left bold">TOTAL KESELURUHAN</td>
              <td class="right">${totalPlastik.toFixed(1)}</td>
              <td class="right">${totalKertas.toFixed(1)}</td>
              <td class="right">${totalLogam.toFixed(1)}</td>
              <td class="right">${totalKaca.toFixed(1)}</td>
              <td class="right">${grandTotalBerat.toFixed(1)}</td>
            </tr>
          </tfoot>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelHTML], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Resmi_Bank_Sampah_${selectedBulan}_${selectedTahun}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card" style={{ padding: '24px' }}>
      
      {/* Header & Tombol Download Excel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>
          Riwayat Setoran Bank Sampah (Google Sheets)
        </h3>
        
        <button 
          onClick={handleExportExcel}
          style={{
            backgroundColor: '#0f766e',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#115e59'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#0f766e'}
        >
          📥 Download File 
        </button>
      </div>

      {/* Bagian Filter Bulan & Tahun */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Filter Bulan:</label>
          <select 
            value={selectedBulan} 
            onChange={(e) => setSelectedBulan(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '14px', background: 'var(--bg-color)', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            <option value="Semua">Semua Bulan</option>
            <option value="Januari">Januari</option>
            <option value="Februari">Februari</option>
            <option value="Maret">Maret</option>
            <option value="April">April</option>
            <option value="Mei">Mei</option>
            <option value="Juni">Juni</option>
            <option value="Juli">Juli</option>
            <option value="Agustus">Agustus</option>
            <option value="September">September</option>
            <option value="Oktober">Oktober</option>
            <option value="November">November</option>
            <option value="Desember">Desember</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Filter Tahun:</label>
          <select 
            value={selectedTahun} 
            onChange={(e) => setSelectedTahun(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '14px', background: 'var(--bg-color)', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            <option value="Semua">Semua Tahun</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>
      </div>
      
      {/* TAMPILAN DESKTOP (TABEL) */}
      <div className="desktop-table-view" style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderRadius: '6px 0 0 0' }}>Bulan</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Tahun</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Wilayah</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Plastik (Kg)</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Kertas (Kg)</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Logam (Kg)</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Kaca (Kg)</th>
              <th style={{ padding: '12px', textAlign: 'center', borderRadius: '0 6px 0 0' }}>Total (Kg)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Memuat data dari Google Sheets...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Tidak ada data setoran yang cocok dengan filter bulan/tahun tersebut.
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px' }}>{item.bulan || item.Bulan}</td>
                  <td style={{ padding: '12px' }}>{item.tahun || item.Tahun}</td>
                  <td style={{ padding: '12px' }}>{item.rw || item.RW || item.Wilayah}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{Number(item.plastik || item.Plastik || 0).toFixed(1)}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{Number(item.kertas || item.Kertas || 0).toFixed(1)}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{Number(item.logam || item.Logam || 0).toFixed(1)}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{Number(item.kaca || item.Kaca || 0).toFixed(1)}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {Number(item.total || item.Total || item.total_berat || 0).toFixed(1)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TAMPILAN MOBILE / HP (CARD VIEW) */}
      <div className="mobile-card-view" style={{ display: 'none', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Memuat data dari Google Sheets...
          </div>
        ) : filteredData.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Tidak ada data setoran yang cocok dengan filter bulan/tahun tersebut.
          </div>
        ) : (
          filteredData.map((item, index) => (
            <div key={index} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <span style={{ fontWeight: '700', color: '#0f766e', fontSize: '15px' }}>
                  📍 {item.rw || item.RW || item.Wilayah}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '600', background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '20px' }}>
                  {item.bulan || item.Bulan} {item.tahun || item.Tahun}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '13px', marginBottom: '12px' }}>
                <div>Plastik: <strong>{Number(item.plastik || item.Plastik || 0).toFixed(1)} Kg</strong></div>
                <div>Kertas: <strong>{Number(item.kertas || item.Kertas || 0).toFixed(1)} Kg</strong></div>
                <div>Logam: <strong>{Number(item.logam || item.Logam || 0).toFixed(1)} Kg</strong></div>
                <div>Kaca: <strong>{Number(item.kaca || item.Kaca || 0).toFixed(1)} Kg</strong></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', fontSize: '14px' }}>
                <span style={{ fontWeight: '600', color: '#64748b' }}>Total Berat:</span>
                <span style={{ fontWeight: '800', color: '#0f766e', fontSize: '16px' }}>
                  {Number(item.total || item.Total || item.total_berat || 0).toFixed(1)} Kg
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CSS RESPONSIF */}
      <style>{`
        @media (max-width: 767px) {
          .desktop-table-view { display: none !important; }A
          .mobile-card-view { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default TabelData;