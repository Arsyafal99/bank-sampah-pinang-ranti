import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Informasi from './components/Informasi';
import FormInput from './components/FormInput';
import Grafik from './components/Grafik';
import Footer from './components/Footer';
import TabelData from './components/TabelData';
import InfoBankSampah from './components/InfoBankSampah';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyPSYQsJAuVhCi5CmAswNy0wEkr94zwxxsgoRXjyNaOccYWlCykS-g7GroBxMlY0NXBeg/exec';

  const [formData, setFormData] = useState({
    bulan: 'Oktober',
    tahun: '2026',
    rw: 'RW 01',
    plastik: '',
    kertas: '',
    logam: '',
    kaca: '',
  });

  const [totalSampahKeseluruhan, setTotalSampahKeseluruhan] = useState(0);
  const [wilayahTeraktif, setWilayahTeraktif] = useState('-');

  const [dataGrafik, setDataGrafik] = useState({
    labels: ['RW 01', 'RW 02', 'RW 03', 'RW 04', 'RW 05'],
    datasets: [{
      label: 'Total Sampah (Kg) - Akumulasi',
      data: [0, 0, 0, 0, 0],
      backgroundColor: '#0f766e', borderRadius: 4, barPercentage: 0.6,
    }],
  });

  const [trenTahunan, setTrenTahunan] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      { label: 'RW 01', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], borderColor: '#ef4444', backgroundColor: '#ef4444', tension: 0.4 },
      { label: 'RW 02', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], borderColor: '#3b82f6', backgroundColor: '#3b82f6', tension: 0.4 },
      { label: 'RW 03', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], borderColor: '#10b981', backgroundColor: '#10b981', tension: 0.4 },
      { label: 'RW 04', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], borderColor: '#f59e0b', backgroundColor: '#f59e0b', tension: 0.4 },
      { label: 'RW 05', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], borderColor: '#8b5cf6', backgroundColor: '#8b5cf6', tension: 0.4 },
    ],
  });

  useEffect(() => {
    fetch(WEB_APP_URL)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const totalsPerRW = { 'RW 01': 0, 'RW 02': 0, 'RW 03': 0, 'RW 04': 0, 'RW 05': 0 };
          let totalSemua = 0;

          const bulanList = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
          const rwTren = {
            'RW 01': Array(12).fill(0),
            'RW 02': Array(12).fill(0),
            'RW 03': Array(12).fill(0),
            'RW 04': Array(12).fill(0),
            'RW 05': Array(12).fill(0),
          };

          data.forEach((item) => {
            const rw = item.rw || item.RW || item.Wilayah;
            const totalKg = Number(item.total || item.Total || item.total_berat || 0);
            const bulanInput = item.bulan || item.Bulan;

            totalSemua += totalKg;

            if (totalsPerRW[rw] !== undefined) {
              totalsPerRW[rw] += totalKg;
            }

            if (rwTren[rw]) {
              const foundIndex = bulanList.findIndex(b => bulanInput && bulanInput.toLowerCase().startsWith(b.toLowerCase()));
              if (foundIndex !== -1) {
                rwTren[rw][foundIndex] += totalKg;
              }
            }
          });

          let maxRW = '-';
          let maxKg = -1;
          for (const [rwKey, kgVal] of Object.entries(totalsPerRW)) {
            if (kgVal > maxKg) {
              maxKg = kgVal;
              maxRW = rwKey;
            }
          }

          setTotalSampahKeseluruhan(totalSemua);
          setWilayahTeraktif(maxKg > 0 ? maxRW : '-');

          setDataGrafik({
            labels: ['RW 01', 'RW 02', 'RW 03', 'RW 04', 'RW 05'],
            datasets: [{
              label: 'Total Sampah (Kg) - Akumulasi',
              data: [totalsPerRW['RW 01'], totalsPerRW['RW 02'], totalsPerRW['RW 03'], totalsPerRW['RW 04'], totalsPerRW['RW 05']],
              backgroundColor: '#0f766e', borderRadius: 4, barPercentage: 0.6,
            }],
          });

          setTrenTahunan({
            labels: bulanList,
            datasets: [
              { label: 'RW 01', data: rwTren['RW 01'], borderColor: '#ef4444', backgroundColor: '#ef4444', tension: 0.4 },
              { label: 'RW 02', data: rwTren['RW 02'], borderColor: '#3b82f6', backgroundColor: '#3b82f6', tension: 0.4 },
              { label: 'RW 03', data: rwTren['RW 03'], borderColor: '#10b981', backgroundColor: '#10b981', tension: 0.4 },
              { label: 'RW 04', data: rwTren['RW 04'], borderColor: '#f59e0b', backgroundColor: '#f59e0b', tension: 0.4 },
              { label: 'RW 05', data: rwTren['RW 05'], borderColor: '#8b5cf6', backgroundColor: '#8b5cf6', tension: 0.4 },
            ],
          });
        }
      })
      .catch((err) => {
        console.error('Gagal memuat data statistik dan grafik:', err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const kirimData = async (e) => {
    e.preventDefault();

    const dataKirim = {
      tahun: formData.tahun,
      bulan: formData.bulan,
      rw: formData.rw,
      plastik: Number(formData.plastik),
      kertas: Number(formData.kertas),
      logam: Number(formData.logam),
      kaca: Number(formData.kaca),
    };

    try {
      alert("Mengirim data ke Google Sheets...");

      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(dataKirim)
      });

      const result = await response.json();
      console.log('Respon dari server:', result);

      alert(`Berhasil! Data setoran ${formData.rw} untuk bulan ${formData.bulan} (${formData.tahun}) berhasil dikirim ke Google Sheets.`);

      setFormData({
        bulan: 'Oktober',
        tahun: '2026',
        rw: 'RW 01',
        plastik: '',
        kertas: '',
        logam: '',
        kaca: '',
      });

    } catch (error) {
      console.error('Error:', error);
      alert('Gagal mengirim data. Coba cek koneksi atau URL Apps Script.');
    }
  };

  const getTabStyle = (tabName) => {
    const isActive = activeTab === tabName;
    return {
      padding: '14px 22px',
      cursor: 'pointer',
      fontWeight: '600',
      background: isActive ? 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)' : '#ffffff',
      color: isActive ? '#ffffff' : '#475569',
      borderRadius: '10px',
      transition: 'all 0.25s ease',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: isActive ? '0 4px 12px rgba(15, 118, 110, 0.25)' : '0 1px 3px rgba(0,0,0,0.04)',
      border: isActive ? '1px solid transparent' : '1px solid #e2e8f0',
      flex: '1',
      minWidth: '180px',
      justifyContent: 'center'
    };
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <Header />

        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} className="mobile-menu-bar">
            <span style={{ fontWeight: '700', fontSize: '14px', color: '#0f766e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📌 Menu: {activeTab === 'dashboard' ? 'Dashboard Utama' : activeTab === 'input' ? 'Input Setoran Baru' : activeTab === 'rekap' ? 'Rekap Data' : 'Info & Panduan'}
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: '#0f766e', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
            >
              {mobileMenuOpen ? '✕ Tutup' : '☰ Menu'}
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '12px',
              flexWrap: 'wrap'
            }}
            className="nav-tabs-container"
          >
            <button style={getTabStyle('dashboard')} onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}>
              📊 Dashboard Utama
            </button>
            <button style={getTabStyle('input')} onClick={() => { setActiveTab('input'); setMobileMenuOpen(false); }}>
              📝 Input Setoran Baru
            </button>
            <button style={getTabStyle('rekap')} onClick={() => { setActiveTab('rekap'); setMobileMenuOpen(false); }}>
              🗂️ Rekap Data
            </button>
            <button style={getTabStyle('info')} onClick={() => { setActiveTab('info'); setMobileMenuOpen(false); }}>
              📖 Info & Panduan
            </button>
          </div>
        </div>

        <style>{`
          @media (min-width: 768px) {
            .mobile-menu-bar { display: none !important; }
            .nav-tabs-container { display: flex !important; }
          }
          @media (max-width: 767px) {
            .mobile-menu-bar { display: flex !important; }
            .nav-tabs-container { 
              display: ${mobileMenuOpen ? 'grid' : 'none'} !important; 
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        {activeTab === 'dashboard' && (
          <div>
            <Informasi
              totalSampahBulanIni={totalSampahKeseluruhan}
              wilayahTeraktif={wilayahTeraktif}
            />
            <Grafik dataGrafik={dataGrafik} trenTahunan={trenTahunan} />
          </div>
        )}

        {activeTab === 'input' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <FormInput formData={formData} handleInputChange={handleInputChange} kirimData={kirimData} />
          </div>
        )}

        {activeTab === 'rekap' && (
          <div><TabelData /></div>
        )}

        {activeTab === 'info' && (
          <div><InfoBankSampah /></div>
        )}

      </div>
      <Footer />
    </div>
  );
}

export default App;