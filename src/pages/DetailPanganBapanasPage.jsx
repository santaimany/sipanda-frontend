import React, { useEffect, useState } from "react";
import NavbarBapanas from "../components/NavbarBapanas";
import SidebarBapanas from "../components/SidebarBapanas";
import UpdateIcon from "../assets/icons/update-icon.svg";
import { toast } from "react-toastify";

const DetailPanganBapanasPage = () => {
  const [dataPangan, setDataPangan] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [editPangan, setEditPangan] = useState({ id: null, harga: "" });
  const [newPangan, setNewPangan] = useState({ nama_pangan: "", harga: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const API_BASE_URL = "https://sipanda-production.up.railway.app/api";

  // Fetch data detail pangan
  const fetchDetailPangan = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/detail-pangan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();   
      if (result.success) {
        setDataPangan(result.data);
        setFilteredData(result.data);
        console.log("Data berhasil dimuat.");
      } else {
        toast.warn(result.message || "Gagal memuat data.");
      }
    } catch (error) {
      console.error("Error fetching detail pangan:", error);
      toast.error("Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle update harga pangan
  const handleUpdateHarga = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/detail-pangan/update/${editPangan.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ harga: editPangan.harga }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Harga berhasil diupdate.");
        setShowPopup(false);
        fetchDetailPangan();
      } else {
        toast.warn(result.message || "Gagal mengupdate harga.");
      }
    } catch (error) {
      console.error("Error updating harga:", error);
      toast.error("Terjadi kesalahan saat mengupdate harga.");
    }
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = dataPangan.filter((item) =>
      item.nama_pangan.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page
  };

  // Handle pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchDetailPangan();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdfa]">
       {isLoading ? (
     <div className="flex justify-center min-h-screen items-center mt-4">
     <div className="loader "></div>
   </div>
    ) : (
      <>
      <NavbarBapanas title="Detail Pangan" />
      <div className="flex flex-1">
        <SidebarBapanas />
        <main className="flex-1 p-6">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Detail Pangan</h2>
            <input
              type="text"
              placeholder="Cari jenis pangan di sini"
              className="border rounded-lg px-4 py-2 w-1/3"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Tabel Detail Pangan */}
          <div className="bg-white shadow rounded-lg p-4">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-[#327A6D] text-white">
                  <th className="px-4 py-2">Jenis Pangan</th>
                  <th className="px-4 py-2">Harga Pangan</th>
                  <th className="px-4 py-2">Last Updates</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((pangan) => (
                  <tr key={pangan.id} className="border-b">
                    <td className="border px-4 py-2">{pangan.nama_pangan}</td>
                    <td className="border px-4 py-2">Rp {parseFloat(pangan.harga).toLocaleString()}</td>
                    <td className="border px-4 py-2">
                      {new Date(pangan.updated_at).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className=" px-4 py-2 flex justify-center">
                      <button
                        className="  text-white px-3 py-1 rounded flex  "
                        onClick={() => {
                          setEditPangan({ id: pangan.id, harga: pangan.harga });
                          setShowPopup(true);
                        }}
                      >
                        <img src={UpdateIcon} alt="Edit" className="w-5 h-5" />
                      </button>
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

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 duration-300 ease-in-out" : "bg-[#327A6D] duration-300 ease-in-out text-white"}`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              {"<"}
            </button>
            <p>
              Halaman {currentPage} dari {totalPages}
            </p>
            <button
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-[#327A6D] text-white"}`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              {">"}
            </button>
          </div>

          {/* Pop-Up Form */}
          {showPopup && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h3 className="text-xl font-bold mb-4">Edit Harga Pangan</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateHarga();
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Harga</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={editPangan.harga}
                      onChange={(e) => setEditPangan({ ...editPangan, harga: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={() => setShowPopup(false)}
                    >
                      Batal
                    </button>
                    <button type="submit" className="bg-[#327A6D]  hover:bg-[#a7dbd1] hover:text-black   outline-black outline outline-1 font-medium  transition-all duration-300 ease-in-out text-white px-4 py-2 rounded">
                      Simpan
                    </button>
                  </div>
                </form>
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

export default DetailPanganBapanasPage;
