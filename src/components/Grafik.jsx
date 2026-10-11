import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Grafik = ({ dataGrafik, trenTahunan }) => {
  if (!dataGrafik || !trenTahunan) {
    return <div className="card">Memuat Grafik...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: '2', minWidth: '100%' }}>
      
      {/* 1. GRAFIK BATANG */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '24px', fontSize: '18px', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px' }}>
          Kinerja Setoran per Wilayah (Bulan Ini)
        </h3>
        <div style={{ flex: 1, position: 'relative', minHeight: '300px' }}>
          <Bar 
            data={dataGrafik} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { 
                  position: 'top', 
                  labels: { 
                    font: { family: "'Inter', sans-serif" },
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 15
                  } 
                },
                tooltip: { backgroundColor: '#1e293b', padding: 12, cornerRadius: 8 }
              },
              scales: {
                y: { beginAtZero: true, grid: { color: '#e2e8f0' } },
                x: { grid: { display: false } }
              }
            }} 
          />
        </div>
      </div>

      {/* 2. GRAFIK GARIS */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '24px', fontSize: '18px', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px' }}>
          Tren Setoran Sampah (Tahunan)
        </h3>
        <div style={{ flex: 1, position: 'relative', minHeight: '300px' }}>
          <Line 
            data={trenTahunan} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { 
                  position: 'top', 
                  labels: { 
                    font: { family: "'Inter', sans-serif" },
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 15
                  } 
                },
                tooltip: { backgroundColor: '#1e293b', padding: 12, cornerRadius: 8 }
              },
              scales: {
                y: { beginAtZero: true, grid: { color: '#e2e8f0' } },
                x: { grid: { display: false } }
              }
            }} 
          />
        </div>
      </div>

    </div>
  );
};

export default Grafik;