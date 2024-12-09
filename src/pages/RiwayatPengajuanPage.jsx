import React, { useState, useEffect } from "react";

import Logo from "../assets/Group 1883.png";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Persetujuanicon from "../assets/icons/setuju-icon.svg";
import Tolakicon from "../assets/icons/reject-icon.svg";
import Pendingicon from "../assets/icons/pending-icon.svg";

const RiwayatPengajuanPage = () => {
  const token = localStorage.getItem("token");

  const [riwayatPengajuan, setRiwayatPengajuan] = useState([]);
  const [filteredPengajuan, setFilteredPengajuan] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedInvoice] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRiwayatPengajuan = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://sipanda-production.up.railway.app/api/pengajuan/riwayat",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (response.ok) {
          setRiwayatPengajuan(result.data);
          setFilteredPengajuan(result.data);
        } else {
          setErrorMessage(result.message || "Tidak ada riwayat pengajuan.");
        }
      } catch (error) {
        console.error("Error fetching riwayat pengajuan:", error);
        setErrorMessage("Terjadi kesalahan saat memuat data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRiwayatPengajuan();
  }, [token]);

  const fetchDetailPengajuan = async (id) => {
    try {
      const response = await fetch(
        `https://sipanda-production.up.railway.app/api/pengajuan/detail/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        setSelectedDetail(result.data);
      } else {
        alert(result.message || "Detail tidak ditemukan.");
      }
    } catch (error) {
      console.error("Error fetching detail pengajuan:", error);
      alert("Terjadi kesalahan saat mengambil detail pengajuan.");
    }
  };

 

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status === "all") {
      setFilteredPengajuan(riwayatPengajuan);
    } else {
      setFilteredPengajuan(
        riwayatPengajuan.filter((item) => item.status.toLowerCase() === status)
      );
    }
  };

  const renderStatus = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <div className="flex justify-between  gap-2 px-2 py-1 rounded-full bg-[#008800] text-white w-28">
            <span className="text-sm">Disetujui</span>
            <img src={Persetujuanicon} alt="Approved" className="w-5 h-5" />
          </div>
        );
      case "rejected":
        return (
          <div className="flex justify-between gap-2 px-2 py-1 rounded-full bg-[#FF0000] text-white w-28">
            <span className="text-sm">Ditolak</span>
            <img src={Tolakicon} alt="Rejected" className="w-5 h-5" />
          </div>
        );
      case "pending":
        return (
          <div className="flex  gap-2 px-2 py-1 rounded-full bg-[#E6A800] text-white w-28">
            <span className="text-sm">Menunggu</span>
            <img src={Pendingicon} alt="Pending" className="w-5 h-5" />
          </div>
        );
      default:
        return null;
    }
  };

  const renderLoader = () => (
    <div className="flex justify-center items-center my-10">
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff]">
       {isLoading ? (
     <div className="flex justify-center min-h-screen items-center mt-4">
     <div className="loader "></div>
   </div>
    ) : (
      <>
      <Navbar title="Riwayat Pengajuan" logo={Logo} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-bold text-2xl mb-4">Riwayat Pengajuan</h2>

            <div className="flex items-center gap-4 mb-6 duration-300 ease-in-out">
              {["all", "approved", "pending", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`px-4 py-2 rounded ${
                    filterStatus === status
                      ? "bg-[#327A6D] text-white duration-300 ease-in-out"
                      : "bg-gray-200"
                  }`}
                >
                  {status === "all"
                    ? "Semua"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {isLoading ? (
              renderLoader()
            ) : errorMessage ? (
              <div className="text-red-600">{errorMessage}</div>
            ) : (
              <table className="w-full border-collapse  text-center">
                <thead>
                  <tr className="bg-[#327A6D] text-white">
                    <th className="p-3">No.</th>
                    <th className="p-3">Rincian Ajukan</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Jenis</th>
                    <th className="p-3">Berat</th>
                    <th className="p-3">Rincian</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPengajuan.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b  hover:bg-gray-100 duration-300"
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{item.desa_dituju}</td>
                      <td className="p-3">{renderStatus(item.status)}</td>
                      <td className="p-3">{item.jenis_pangan}</td>
                      <td className="p-3">{item.berat}</td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            fetchDetailPengajuan(item.id);
        
                          }}
                          className="text-blue-600 underline hover:text-purple-900 duration-300 ease-in-out"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {selectedDetail  && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
      <h2 className="font-bold text-xl mb-4">Detail Pengajuan</h2>
      <table className="w-full text-left mb-4">
        <tbody>
          <tr>
            <td className="font-semibold">Tanggal</td>
            <td className="text-right">
              {new Date(selectedDetail.created_at).toLocaleDateString("id-ID")}
            </td>
          </tr>
          <tr>
            <td className="font-semibold">Desa Penerima</td>
            <td className="text-right">{selectedDetail.desa_penerima}</td>
          </tr>
          <tr>
            <td className="font-semibold">Desa Pengirim</td>
            <td className="text-right">{selectedDetail.desa_pengirim}</td>
          </tr>
          <tr>
            <td className="font-semibold">Jenis Pangan</td>
            <td className="text-right">{selectedDetail.jenis_pangan}</td>
          </tr>
          <tr>
            <td className="font-semibold">Berat</td>
            <td className="text-right">{selectedDetail.berat}</td>
          </tr>
          <tr>
            <td className="font-semibold">Harga/Kg</td>
            <td className="text-right">{selectedDetail.harga_per_kg}</td>
          </tr>
          <tr>
            <td className="font-semibold">Ongkos Kirim</td>
            <td className="text-right">{selectedDetail.ongkir}</td>
          </tr>
          <tr>
            <td className="font-semibold">Pajak</td>
            <td className="text-right">{selectedDetail.pajak}</td>
          </tr>
          <tr>
            <td className="font-semibold">Total Harga</td>
            <td className="text-right">{selectedDetail.total_harga}</td>
          </tr>
          {selectedDetail.status === "rejected" && (
            <tr>
              <td className="font-semibold text-red-600">Alasan Penolakan</td>
              <td className="text-right text-red-600">
                {selectedDetail.alasan || "Tidak ada alasan tersedia."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-between">
        {renderStatus(selectedDetail.status)}
        <button
          onClick={() => setSelectedDetail(null)}
          className="px-4 py-2 bg-gray-300 rounded-lg"
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

export default RiwayatPengajuanPage;
