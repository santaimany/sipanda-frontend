import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const PengajuanPage = () => {
  const [groupedPanganData, setGroupedPanganData] = useState({});
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Alphabet");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loader state

  const navigate = useNavigate();
  const API_BASE_URL = "https://sipanda-production.up.railway.app/api";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Anda harus login untuk mengakses halaman ini.");
      navigate("/login");
      return;
    }

    fetchPanganData(token);
  }, []);

  const fetchPanganData = async (token) => {
    setIsLoading(true); // Show loader
    try {
      const response = await fetch(`${API_BASE_URL}/pangan/desa-lain`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (response.ok) {
        const groupedData = result.data.reduce((acc, item) => {
          const { jenis_pangan } = item;
          if (!acc[jenis_pangan]) acc[jenis_pangan] = [];
          acc[jenis_pangan].push(item);
          return acc;
        }, {});

        Object.keys(groupedData).forEach((key) => {
          groupedData[key] = groupedData[key].sort((a, b) => a.jarak - b.jarak);
        });

        setGroupedPanganData(groupedData);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  const toggleAccordion = (jenisPangan) => {
    setExpandedAccordion((prev) => (prev === jenisPangan ? null : jenisPangan));
  };

  const filteredPanganData = Object.keys(groupedPanganData)
    .filter((jenis) => jenis.toLowerCase().includes(searchQuery.toLowerCase()))
    .reduce((acc, key) => {
      acc[key] = groupedPanganData[key];
      return acc;
    }, {});

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
      <Navbar title="Pengajuan Pangan" />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6">
          <section className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Data Pengajuan Pangan</h2>

            {/* Search and Sort */}
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Cari Pangan Di Sini..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-3 border rounded-md w-2/3"
              />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-3 border rounded-md"
              >
                <option value="Alphabet">Alphabet</option>
                <option value="Jarak">Jarak</option>
              </select>
            </div>

            {isLoading ? (
              renderLoader() // Show loader while data is loading
            ) : error ? (
              <div className="bg-red-100 text-red-600 p-4 rounded-lg">{error}</div>
            ) : (
              <div className="bg-white shadow rounded-lg divide-y divide-gray-300">
                {Object.keys(filteredPanganData).map((jenisPangan) => (
                  <div key={jenisPangan}>
                    {/* Accordion Header */}
                    <div
                      className="px-4 py-3 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleAccordion(jenisPangan)}
                    >
                      <h2 className="text-lg font-bold">{jenisPangan}</h2>
                      <span
                        className={`text-xl transition-transform duration-300 ${
                          expandedAccordion === jenisPangan ? "rotate-180" : ""
                        }`}
                      >
                        {expandedAccordion === jenisPangan ? "−" : "+"}
                      </span>
                    </div>

                    {/* Accordion Content */}
                    <div
                      className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${
                        expandedAccordion === jenisPangan ? "max-h-[1000px]" : "max-h-0"
                      }`}
                    >
                      <div className="p-4 bg-white">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="border px-4 py-2 text-left">Desa</th>
                              <th className="border px-4 py-2 text-left">Berat</th>
                              <th className="border px-4 py-2 text-left">Harga</th>
                              <th className="border px-4 py-2 text-left">Jarak</th>
                              <th className="border px-4 py-2 text-left">Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredPanganData[jenisPangan].map((item) => (
                              <tr key={item.id} className="hover:bg-gray-100 duration-300 ease-in-out">
                                <td className="border px-4 py-2">
                                  {item.desa.provinsi}, {item.desa.kecamatan},{" "}
                                  {item.desa.nama}
                                </td>
                                <td className="border px-4 py-2">{item.berat} Kg</td>
                                <td className="border px-4 py-2">Rp13,000/Kg</td>
                                <td className="border px-4 py-2">
                                  {Math.round(item.jarak * 10) / 10} Km
                                </td>
                                <td className="border flex justify-center px-4 py-2">
                                  <button
                                    className="bg-[#327A6D]  hover:bg-[#a7dbd1] hover:text-black   outline-black outline outline-1 font-medium  transition-all duration-300 ease-in-out text-white px-10 py-1 rounded"
                                    onClick={() =>
                                      navigate("/dashboard/pengajuan-form", {
                                        state: {
                                          desaTujuanId: item.desa_id,
                                          desaPenerima: item.desa.nama,
                                          jarak: Math.round(item.jarak * 10) / 10,
                                          jenisPangan: jenisPangan,
                                          beratTersedia: item.berat,
                                        },
                                      })
                                    }
                                  >
                                    Ajukan
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
    )}
    </div>
  );
};

export default PengajuanPage;
