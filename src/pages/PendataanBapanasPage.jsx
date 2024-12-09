import React, { useEffect, useState } from "react";
import NavbarBapanas from "../components/NavbarBapanas";
import SidebarBapanas from "../components/SidebarBapanas";
import Updateicon from "../assets/icons/update-icon.svg";
import Deleteicon from "../assets/icons/delete-icon.svg";
import { toast } from "react-toastify";

const PendataanBapanasPage = () => {
  const [desaData, setDesaData] = useState([]);
  const [jenisPanganData, setJenisPanganData] = useState([]);
  const [selectedDesaId, setSelectedDesaId] = useState(null);
  const [newPangan, setNewPangan] = useState({ jenis_pangan_id: "", berat: "" });
  const [editPangan, setEditPangan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("insert");
 

  const API_BASE_URL = "https://sipanda-production.up.railway.app/api";

 
  const fetchDesaData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/pendataan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setDesaData(result.data);
      }
    } catch (error) {
      console.error("Error fetching desa data:", error);
      toast.error("Gagal memuat data desa.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJenisPanganData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/detail-pangan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setJenisPanganData(result.data);
      }
    } catch (error) {
      console.error("Error fetching jenis pangan data:", error);
      toast.error("Gagal memuat data jenis pangan.");
    }
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const endpoint =
      formMode === "insert"
        ? `${API_BASE_URL}/pendataan/insert/${selectedDesaId}`
        : `${API_BASE_URL}/pendataan/update/${editPangan.id}`;
    const method = formMode === "insert" ? "POST" : "PUT";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formMode === "insert" ? newPangan : editPangan),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Data berhasil disimpan.");
        fetchDesaData();
        setShowForm(false);
      } else {
        toast.error(result.message || "Gagal menyimpan data.");
      }
    } catch (error) {
      console.error("Error adding/updating pangan:", error);
      toast.error("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePangan = async (id) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/pendataan/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Data berhasil dihapus.");
        fetchDesaData();
      } else {
        toast.error(result.message || "Gagal menghapus data.");
      }
    } catch (error) {
      console.error("Error deleting pangan:", error);
      toast.error("Terjadi kesalahan saat menghapus data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDesaData();
    fetchJenisPanganData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdfa]">
       {isLoading ? (
     <div className="flex justify-center min-h-screen items-center mt-4">
     <div className="loader "></div>
   </div>
    ) : (
      <>
      <NavbarBapanas title="Pendataan" />

      <div className="flex flex-1">
        <SidebarBapanas />
        <main className="flex-1 p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Pendataan Pangan Desa</h2>
            <p className="text-gray-600">Kelola data pangan desa secara efektif dan efisien.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-[#327A6D] text-white">
                    <th className="px-4 py-2">Desa</th>
                    <th className="px-4 py-2">Data Pangan</th>
                    <th className="px-4 py-2">Last Updates</th>
                    <th className="px-4 py-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {desaData.map((desa) => (
                    <React.Fragment key={desa.id}>
                      <tr>
                        <td className="border px-4 py-2 font-semibold">{desa.nama_lengkap}</td>
                        <td className="border px-4 py-2">{desa.jumlah_pangan} Pangan Terdatar</td>
                        <td className="border px-4 py-2">{desa.last_update}</td>
                        <td className="border px-4 py-2">
                          <button
                            className="bg-gray-300 px-3 py-1 rounded"
                            onClick={() =>
                              setSelectedDesaId(selectedDesaId === desa.id ? null : desa.id)
                            }
                          >
                            {selectedDesaId === desa.id ? "Tutup" : "Detail"}
                          </button>
                        </td>
                      </tr>
                      {selectedDesaId === desa.id && (
                        <tr>
                          <td colSpan={4} className=" p-4">
                            <table className="w-full table-auto">
                              <thead>
                                <tr>
                                  <th className="border px-4 py-2">Jenis Pangan</th>
                                  <th className="border px-4 py-2">Berat</th>
                                  <th className="border px-4 py-2">Aksi</th>
                                </tr>
                              </thead>
                              <tbody>
                                {desa.pangan.map((pangan) => (
                                  <tr key={pangan.id}>
                                    <td className="border px-4 py-2">{pangan.jenis_pangan}</td>
                                    <td className="border px-4 py-2">{pangan.berat} Kg</td>
                                    <td className="border px-4 py-2 flex space-x-2 justify-center">
                                      <button
                                        className="p-2 rounded"
                                        onClick={() => {
                                          setEditPangan(pangan);
                                          setFormMode("update");
                                          setShowForm(true);
                                        }}
                                      >
                                        <img src={Updateicon} alt="Edit" />
                                      </button>
                                      <button
                                        className="p-2  rounded"
                                        onClick={() => handleDeletePangan(pangan.id)}
                                      >
                                        <img src={Deleteicon} alt="Delete" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="flex justify-end">
                            <button
                              className="mt-4 bg-[#327A6D]  hover:bg-[#a7dbd1] hover:text-black   outline-black outline outline-1 font-medium  transition-all duration-300 ease-in-out text-white px-4 py-2 rounded"
                              onClick={() => {
                                setFormMode("insert");
                                setShowForm(true);
                              }}
                            >
                              Tambah Data
                            </button>
                            {showForm && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div className=" hover:bg-gray-100 rounded-lg shadow p-6 w-1/3">
      <h3 className="text-xl font-bold mb-4">
        {formMode === "insert" ? "Form Tambah Data Pangan" : "Form Edit Data Pangan"}
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
      >
        {/* Dropdown Jenis Pangan */}
        {formMode === "insert" && (
          <div className="mb-4">
            <label htmlFor="jenis_pangan" className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Pangan
            </label>
            <select
              id="jenis_pangan"
              className="w-full border rounded-lg p-2"
              value={newPangan.jenis_pangan_id}
              onChange={(e) => setNewPangan({ ...newPangan, jenis_pangan_id: e.target.value })}
            >
              <option value="">Pilih Jenis Pangan</option>
              {jenisPanganData.map((jenis) => (
                <option key={jenis.id} value={jenis.id}>
                  {jenis.nama_pangan}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Input Berat */}
        <div className="mb-4">
          <label htmlFor="berat" className="block text-sm font-medium text-gray-700 mb-1">
            Berat (Kg)
          </label>
          <input
            id="berat"
            type="number"
            className="w-full border rounded-lg p-2"
            value={formMode === "insert" ? newPangan.berat : editPangan?.berat || ""}
            onChange={(e) =>
              formMode === "insert"
                ? setNewPangan({ ...newPangan, berat: e.target.value })
                : setEditPangan({ ...editPangan, berat: e.target.value })
            }
          />
        </div>

        {/* Form Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setShowForm(false)}
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

                            </div>
                           
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      <style>
        {`
          .loader {
            width: 50px;
            aspect-ratio: 1;
            --_c:no-repeat radial-gradient(farthest-side,#25b09b 92%,#0000);
            background: 
              var(--_c) top,
              var(--_c) left,
              var(--_c) right,
              var(--_c) bottom;
            background-size: 12px 12px;
            animation: l7 1s infinite;
          }
          @keyframes l7 {to{transform: rotate(.5turn)}}
        `}
      </style>
    </>
    )}
    </div>
  );
};

export default PendataanBapanasPage;
