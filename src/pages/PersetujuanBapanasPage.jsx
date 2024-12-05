import React, { useEffect, useState } from "react";
import NavbarBapanas from "../components/NavbarBapanas";
import SidebarBapanas from "../components/SidebarBapanas";
import SetujuIcon from "../assets/icons/setuju-icon.svg";
import TolakIcon from "../assets/icons/reject-icon.svg";
const PersetujuanBapanasPage = () => {
  const [pengajuanData, setPengajuanData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rejectForm, setRejectForm] = useState({ id: null, alasan: "" });
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [detailPengajuan, setDetailPengajuan] = useState(null);
  const [desaMap, setDesaMap] = useState({});

  const API_BASE_URL = "https://sipanda-production.up.railway.app/api";

  // Fetch pengajuan data (pending status)
  const fetchPengajuanData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/bapanas/pengajuan/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.data) {
        setPengajuanData(result.data);
      }
    } catch (error) {
      console.error("Error fetching pengajuan data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data desa (mapping id ke nama desa)
  const fetchDesaData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/pendataan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        const map = {};
        result.data.forEach((desa) => {
          map[desa.id] = desa.nama_lengkap;
        });
        setDesaMap(map);
      }
    } catch (error) {
      console.error("Error fetching desa data:", error);
    }
  };

  // Fetch detail pengajuan
  const fetchDetailPengajuan = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/pengajuan/detail/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.data) {
        setDetailPengajuan(result.data);
        setShowDetailPopup(true);
      } else {
        alert(result.message || "Detail pengajuan tidak ditemukan.");
      }
    } catch (error) {
      console.error("Error fetching detail pengajuan:", error);
    }
  };

  // Handle approve pengajuan
  const handleApprove = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/bapanas/pengajuan/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      alert(result.message || "Pengajuan berhasil disetujui.");
      fetchPengajuanData();
    } catch (error) {
      console.error("Error approving pengajuan:", error);
    }
  };

  // Handle reject pengajuan
  const handleReject = async () => {
    const token = localStorage.getItem("token");
    const { id, alasan } = rejectForm;

    if (!alasan) {
      alert("Harap isi alasan penolakan.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bapanas/pengajuan/${id}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ alasan }),
      });
      const result = await response.json();
      alert(result.message || "Pengajuan berhasil ditolak.");
      setShowRejectPopup(false);
      fetchPengajuanData();
    } catch (error) {
      console.error("Error rejecting pengajuan:", error);
    }
  };

  useEffect(() => {
    fetchPengajuanData();
    fetchDesaData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdfa]">
       {isLoading ? (
     <div className="flex justify-center min-h-screen items-center mt-4">
     <div className="loader "></div>
   </div>
    ) : (
      <>
      <NavbarBapanas title="Persetujuan" />
      <div className="flex flex-1">
        <SidebarBapanas />
        <main className="flex-1 p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Persetujuan Pengajuan</h2>
            <p className="text-gray-600">
              Kelola persetujuan pengajuan distribusi pangan antar desa.
            </p>
          </div>

          {/* Tabel Persetujuan */}
          <div className="bg-white shadow rounded-lg p-4">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-[#327A6D] text-white">
                  <th className="px-4 py-2">No.</th>
                  <th className="px-4 py-2">Rincian Ajuan</th>
                  <th className="px-4 py-2">Jenis</th>
                  <th className="px-4 py-2">Berat</th>
                  <th className="px-4 py-2">Rincian</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pengajuanData.map((ajuan, index) => (
                  <tr key={ajuan.id} className="border-b">
                    <td className="border px-4 py-2 text-center">{index + 1}</td>
                    <td className="border px-4 py-2">
                      {`Asal: ${desaMap[ajuan.desa_asal_id] || "Loading..."}, Tujuan: ${
                        desaMap[ajuan.desa_tujuan_id] || "Loading..."
                      }`}
                    </td>
                    <td className="border px-4 py-2 text-center">{ajuan.jenis_pangan}</td>
                    <td className="border px-4 py-2 text-center">{ajuan.berat} kg</td>
                    <td
                      className="border px-4 py-2 text-center text-blue-600 hover:text-purple-900 duration-300 ease-in-out underline cursor-pointer"
                      onClick={() => fetchDetailPengajuan(ajuan.id)}
                    >
                      Lihat Detail
                    </td>
                    <td className="border px-4 py-2 text-center">
                    <div className="flex justify-center items-center space-x-4">
                        {/* Tombol Setujui */}
                        <button
                        className="bg-[#327A6D] hover:bg-[#28594D] duration-300 ease-in-out text-white font-bold flex items-center px-4 py-2 rounded-full space-x-2"
                        onClick={() => handleApprove(ajuan.id)}
                        >
                        <span>Setujui</span>
                        <img src={SetujuIcon} alt="Setuju Icon" className="w-5 h-5" />
                        </button>

                        {/* Tombol Tolak */}
                        <button
                        className="bg-[#D32F2F] hover:bg-[#A62828] duration-300 ease-in-out text-white font-bold flex items-center px-4 py-2 rounded-full space-x-2"
                        onClick={() => {
                            setRejectForm({ id: ajuan.id, alasan: "" });
                            setShowRejectPopup(true);
                        }}
                        >
                        <span>Tolak</span>
                        <img src={TolakIcon} alt="Tolak Icon" className="w-5 h-5" />
                        </button>
                    </div>
                    </td>


                  </tr>
                ))}
              </tbody>
            </table>
            {isLoading && (
  <div className="flex justify-center items-center mt-4">
    <div className="loader"></div>
  </div>
)}

          </div>

          {/* Pop-Up Form Penolakan */}
          {showRejectPopup && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h3 className="text-xl font-bold mb-4">Tolak Pengajuan</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleReject();
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Alasan Penolakan
                    </label>
                    <textarea
                      className="w-full border rounded p-2 mt-1"
                      rows={4}
                      value={rejectForm.alasan}
                      onChange={(e) =>
                        setRejectForm({ ...rejectForm, alasan: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={() => setShowRejectPopup(false)}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Tolak Pengajuan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Pop-Up Detail Pengajuan */}
          {showDetailPopup && detailPengajuan && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h3 className="text-xl font-bold mb-4">Detail Pengajuan</h3>
                <p><strong>Desa Pengirim:</strong> {detailPengajuan.desa_pengirim}</p>
                <p><strong>Desa Penerima:</strong> {detailPengajuan.desa_penerima}</p>
                <p><strong>Jenis Pangan:</strong> {detailPengajuan.jenis_pangan}</p>
                <p><strong>Berat:</strong> {detailPengajuan.berat}</p>
                <p><strong>Harga per Kg:</strong> {detailPengajuan.harga_per_kg}</p>
                <p><strong>Total Harga:</strong> {detailPengajuan.total_harga}</p>
                <p><strong>Ongkir:</strong> {detailPengajuan.ongkir}</p>
                <p><strong>Pajak:</strong> {detailPengajuan.pajak}</p>
                <p><strong>Status:</strong> {detailPengajuan.status}</p>
                <p><strong>Tanggal Dibuat:</strong> {new Date(detailPengajuan.created_at).toLocaleString("id-ID")}</p>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowDetailPopup(false)}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      </>
    )}
    </div>
  );
};

export default PersetujuanBapanasPage;
