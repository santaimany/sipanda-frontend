import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const StatistikHistoriHarga = () => {
  const [historiData, setHistoriData] = useState([]);
  const [jenisPangan, setJenisPangan] = useState([]);
  const [selectedPanganId, setSelectedPanganId] = useState(null);
  const chartRef = useRef(null);
  const autoSwitchTimer = useRef(null); // Timer untuk pergantian otomatis

  const API_BASE_URL = "https://sipanda-production.up.railway.app/api";

  // Fetch data jenis pangan dari /detail-pangan
  const fetchJenisPangan = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/detail-pangan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setJenisPangan(result.data); // Data jenis pangan
        if (result.data.length > 0) {
          setSelectedPanganId(result.data[0].id); // Default ke ID pangan pertama
        }
      }
    } catch (error) {
      console.error("Error fetching jenis pangan:", error);
    }
  };

  // Fetch histori harga dari /detail-pangan/histori/:id
  const fetchHistoriHarga = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/detail-pangan/histori/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setHistoriData(result.data);
      }
    } catch (error) {
      console.error("Error fetching histori harga:", error);
    }
  };

  // Initialize Chart.js
  const initializeChart = () => {
    const ctx = chartRef.current.getContext("2d");
    if (chartRef.current.chart) chartRef.current.chart.destroy();

    const labels = historiData.map((item) =>
      new Date(item.created_at).toLocaleDateString("id-ID")
    );
    const data = historiData.map((item) => parseFloat(item.harga));

    chartRef.current.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Histori Harga (Rp)",
            data,
            fill: false,
            borderColor: "#4CAF50",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
      },
    });
  };

  // Fungsi untuk rotasi otomatis antar jenis pangan
  const startAutoSwitch = () => {
    if (jenisPangan.length > 0) {
      autoSwitchTimer.current = setInterval(() => {
        setSelectedPanganId((prevId) => {
          const currentIndex = jenisPangan.findIndex((pangan) => pangan.id === prevId);
          const nextIndex = (currentIndex + 1) % jenisPangan.length; // Loop kembali ke awal
          return jenisPangan[nextIndex].id;
        });
      }, 5000); // Pergantian setiap 10 detik
    }
  };

  // Hentikan rotasi otomatis
  const stopAutoSwitch = () => {
    if (autoSwitchTimer.current) {
      clearInterval(autoSwitchTimer.current);
    }
  };

  useEffect(() => {
    fetchJenisPangan();
  }, []);

  useEffect(() => {
    if (selectedPanganId) {
      fetchHistoriHarga(selectedPanganId);
    }
  }, [selectedPanganId]);

  useEffect(() => {
    if (historiData.length > 0) {
      initializeChart();
    }
  }, [historiData]);

  useEffect(() => {
    startAutoSwitch();
    return () => stopAutoSwitch(); // Bersihkan timer ketika komponen dilepas
  }, [jenisPangan]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold text-lg mb-4 text-center">Statistik Histori Harga</h3>

      {/* Dropdown untuk memilih jenis pangan */}
      <div className="mb-4">
        <label htmlFor="jenisPangan" className="block text-sm font-medium text-gray-700">
          Pilih Jenis Pangan
        </label>
        <select
          id="jenisPangan"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#327A6D] focus:border-[#327A6D] sm:text-sm"
          value={selectedPanganId || ""}
          onChange={(e) => {
            stopAutoSwitch(); // Hentikan rotasi otomatis saat user memilih manual
            setSelectedPanganId(parseInt(e.target.value, 10));
          }}
        >
          {jenisPangan.map((pangan) => (
            <option key={pangan.id} value={pangan.id}>
              {pangan.nama_pangan}
            </option>
          ))}
        </select>
      </div>

      {/* Chart untuk histori harga */}
      {historiData.length > 0 ? (
        <canvas ref={chartRef}></canvas>
      ) : (
        <p className="text-center text-gray-500">Data histori harga tidak tersedia.</p>
      )}
    </div>
  );
};

export default StatistikHistoriHarga;
