import React, { useEffect, useState } from "react";
import NavbarBapanas from "../components/NavbarBapanas";
import SidebarBapanas from "../components/SidebarBapanas";

const RiwayatPersetujuanBapanasPage = () => {
  const [approvedData, setApprovedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("approved"); // Tab aktif (approved/rejected)
  const [desaMap, setDesaMap] = useState({}); // Mapping desa ID ke nama desa
  const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10); // Jumlah data per halaman


const indexOfLastItem = currentPage * itemsPerPage; // Indeks item terakhir
const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Indeks item pertama
const currentData = approvedData.slice(indexOfFirstItem, indexOfLastItem); // Data saat ini


const paginate = (pageNumber) => setCurrentPage(pageNumber);



  const API_BASE_URL = "https://sipanda-production.up.railway.app/api";

  // Fetch approved pengajuan
  const fetchApprovedPengajuan = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/bapanas/pengajuan/approved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      console.log("Approved Response", result);
      if (result.data) {
        setApprovedData(result.data);
      }
    } catch (error) {
      console.error("Error fetching approved pengajuan:", error);
    } finally {
      setIsLoading(false);
   


    }
  };

  // Fetch rejected pengajuan
  const fetchRejectedPengajuan = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/bapanas/pengajuan/rejected`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      console.log("Rejected Response", result);
      if (result.data) {
        setRejectedData(result.data);
      }
    } catch (error) {
      console.error("Error fetching rejected pengajuan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data desa untuk mapping ID ke nama
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

  useEffect(() => {
    fetchApprovedPengajuan();
    fetchRejectedPengajuan();
    fetchDesaData();
  }, []);

  const renderPengajuanTable = (data) => {
    // Pagination
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    // Data yang ditampilkan sesuai halaman aktif
    const indexOfLastItem = currentPage * itemsPerPage; // Indeks item terakhir
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Indeks item pertama
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem); // Data pada halaman saat ini
  
    return (
      <>
        <table className="w-full table-auto mb-4">
          <thead>
            <tr className="bg-[#327A6D] text-white">
              <th className="px-4 py-2">No.</th>
              <th className="px-4 py-2">Invoice</th>
              <th className="px-4 py-2">Rincian</th>
              <th className="px-4 py-2">Jenis</th>
              <th className="px-4 py-2">Berat</th>
              <th className="px-4 py-2">Total Harga</th>
              <th className="px-4 py-2">Ongkir</th>
              <th className="px-4 py-2">Pajak</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Jasa Pengiriman</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Tanggal</th>
              {activeTab === "rejected" && <th className="px-4 py-2">Alasan</th>}
            </tr>
          </thead>
          <tbody>
            {currentData.map((pengajuan, index) => (
              <tr key={pengajuan.id} className="border-b">
                <td className="border px-4 py-2 text-center">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className="border px-4 py-2 text-center">
                  {pengajuan.invoice_number}
                </td>
                <td className="border px-4 py-2">
                  {`Asal: ${desaMap[pengajuan.desa_asal_id] || "Loading..."}, Tujuan: ${
                    desaMap[pengajuan.desa_tujuan_id] || "Loading..."
                  }`}
                </td>
                <td className="border px-4 py-2 text-center">
                  {pengajuan.jenis_pangan}
                </td>
                <td className="border px-4 py-2 text-center">
                  {pengajuan.berat} kg
                </td>
                <td className="border px-4 py-2 text-center">
                  Rp {parseFloat(pengajuan.total_harga).toLocaleString()}
                </td>
                <td className="border px-4 py-2 text-center">
                  Rp {parseFloat(pengajuan.ongkir).toLocaleString()}
                </td>
                <td className="border px-4 py-2 text-center">
                  Rp {parseFloat(pengajuan.pajak).toLocaleString()}
                </td>
                <td className="border px-4 py-2 text-center">
                  Rp {parseFloat(pengajuan.total).toLocaleString()}
                </td>
                <td className="border px-4 py-2 text-center">
                  {pengajuan.jasa_pengiriman}
                </td>
                <td className="border px-4 py-2 text-center">
                  {pengajuan.status.charAt(0).toUpperCase() +
                    pengajuan.status.slice(1)}
                </td>
                <td className="border px-4 py-2 text-center">
                  {new Date(pengajuan.created_at).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                {activeTab === "rejected" && (
                  <td className="border px-4 py-2 text-center">
                    {pengajuan.alasan || "-"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
  
        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === number
                  ? "bg-[#327A6D] text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {number}
            </button>
          ))}
        </div>
      </>
    );
  };
  

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdfa]">
       {isLoading ? (
     <div className="flex justify-center min-h-screen items-center mt-4">
     <div className="loader "></div>
   </div>
    ) : (
      <>
      <NavbarBapanas title="Riwayat Persetujuan" />
      <div className="flex flex-1">
        <SidebarBapanas />
        <main className="flex-1 p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Riwayat Persetujuan</h2>
            <p className="text-gray-600">Lihat data pengajuan yang telah disetujui atau ditolak.</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-4 flex space-x-4">
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "approved" ? "bg-[#327A6D] text-white duration-300 ease-in-out" : "bg-gray-300"
              }`}
              onClick={() => setActiveTab("approved")}
            >
              Disetujui
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "rejected" ? "bg-[#327A6D] text-white duration-300 ease-in-out " : "bg-gray-300"
              }`}
              onClick={() => setActiveTab("rejected")}
            >
              Ditolak
            </button>
          </div>

          {/* Tabel Riwayat */}
          <div className="bg-white shadow rounded-lg p-4">
            {isLoading ? (
        <div className="flex justify-center items-center mt-4">
        <div className="loader"></div>
      </div>
            ) : activeTab === "approved" ? (
              renderPengajuanTable(approvedData)
            ) : (
              renderPengajuanTable(rejectedData)
            )}
          </div>
        </main>
      </div>
      </>
    )}
    </div>
  );
};

export default RiwayatPersetujuanBapanasPage;
