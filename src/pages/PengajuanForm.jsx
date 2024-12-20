import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/Group 1883.png";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import FormpageIlustrasi from "../assets/formpage-ilustrasi.png";
import { toast } from "react-toastify";

const PengajuanFormPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    berat: "",
    jasaPengiriman: "",
  });
  const [invoiceData, setInvoiceData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const { desaTujuanId, desaPenerima, jarak, jenisPangan, beratTersedia } =
    location.state || {};

  useEffect(() => {
    if (!desaTujuanId || !jenisPangan || !beratTersedia) {
      setErrorMessage("Data yang diperlukan untuk pengajuan tidak tersedia.");
    }
  }, [desaTujuanId, jenisPangan, beratTersedia]);

  const simulateInvoice = async () => {
    if (!formData.berat || !formData.jasaPengiriman) {
      setErrorMessage("Lengkapi berat dan jasa pengiriman.");
      setInvoiceData(null);
      return;
    }

    if (isNaN(formData.berat) || formData.berat <= 0) {
      setErrorMessage("Berat harus berupa angka yang valid.");
      setInvoiceData(null);
      return;
    }

    setLoadingInvoice(true);
    try {
      const response = await fetch(
        "https://sipanda-production.up.railway.app/api/pengajuan/simulate-invoice",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            desa_tujuan_id: desaTujuanId,
            jenis_pangan: jenisPangan,
            berat: formData.berat,
            jasa_pengiriman: formData.jasaPengiriman,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setInvoiceData(result);
        setErrorMessage("");
      } else {
        setErrorMessage(result.message || "Terjadi kesalahan.");
        setInvoiceData(null);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Terjadi kesalahan saat simulasi invoice.");
      setInvoiceData(null);
    } finally {
      setLoadingInvoice(false);
    }
  };

  useEffect(() => {
    if (formData.berat && formData.jasaPengiriman) {
      simulateInvoice();
    }
  }, [formData.berat, formData.jasaPengiriman]);

  const handleSubmitPengajuan = async () => {
    if (!invoiceData) {
      toast.error("Isi data terlebih dahulu untuk menampilkan invoice.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
  
    setLoadingInvoice(true);
    try {
      const response = await fetch(
        "https://sipanda-production.up.railway.app/api/pengajuan/submit",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            desa_tujuan_id: desaTujuanId,
            jenis_pangan: jenisPangan,
            berat: formData.berat,
            jasa_pengiriman: formData.jasaPengiriman,
          }),
        }
      );
  
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message, {
          position: "top-right",
          autoClose: 3000,
          onClose: () => navigate("/dashboard/kepala-desa"),
        });
      } else {
        toast.error(result.message || "Terjadi kesalahan.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat mengajukan pengajuan.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoadingInvoice(false);
    }
  };

  if (!desaTujuanId || !jenisPangan || !beratTersedia) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Kesalahan</h1>
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdfa]">
      {/* Navbar */}
     <Navbar title="Pengajuan Pangan" logo={Logo} />

      <div className="flex flex-1 shadow-sm">
        {/* Sidebar */}
       <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
            
        <h1 className="text-2xl font-bold">Form Pengajuan Data Pangan</h1>
          
            <div className="flex justify-center">

          <img src={FormpageIlustrasi} alt="Form Illustration" className=""/>
         
            </div>
       
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Illustration */}
          

            {/* Form Input */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="font-bold text-lg mb-4">Data Desa</h2>
              <p>Desa Penerima: {desaPenerima}</p>
              <p>Jarak: {jarak} KM</p>
              <p>Jenis Pangan: {jenisPangan}</p>
              <div className="mb-4">
                <label className="block font-bold mb-2">Berat (Kg)</label>
                <input
                  type="number"
                  className="p-2 border rounded w-full"
                  value={formData.berat}
                  onChange={(e) =>
                    setFormData({ ...formData, berat: e.target.value })
                  }
                  placeholder={`Max ${beratTersedia} Kg`}
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2">Jasa Pengiriman</label>
                <select
                  className="p-2 border rounded w-full"
                  value={formData.jasaPengiriman}
                  onChange={(e) =>
                    setFormData({ ...formData, jasaPengiriman: e.target.value })
                  }
                >
                  <option value="">Pilih Jasa Pengiriman</option>
                  <option value="JNE">JNE</option>
                  <option value="SICEPAT">SICEPAT</option>
                  <option value="JNT">JNT</option>
                </select>
              </div>
            </div>

            {/* Invoice Data */}
            <div className="bg-white rounded-lg shadow p-6">
  <h3 className="text-xl font-bold mb-4">Invoice</h3>
  <div className="space-y-4">
    <div className="flex justify-between">
      <p className="text-gray-600">Desa Penerima</p>
      <p className="text-gray-800">{invoiceData?.desa_penerima || "-"}</p>
    </div>
    <div className="flex justify-between">
      <p className="text-gray-600">Desa Pengirim</p>
      <p className="text-gray-800">{invoiceData?.desa_pengirim || "Desa Darmo"}</p>
    </div>
    <div className="flex justify-between">
      <p className="text-gray-600">Jarak</p>
      <p className="text-gray-800">{invoiceData?.jarak || "-"} </p>
    </div>
    <div className="flex justify-between">
      <p className="text-gray-600">Jenis Pangan</p>
      <p className="text-gray-800">{invoiceData?.jenis_pangan || "Beras Kualitas II"}</p>
    </div>
    <div className="flex justify-between">
      <p className="text-gray-600">Harga Pangan/kg</p>
      <p className="text-gray-800">
        {invoiceData?.harga_per_kg ? `${invoiceData.harga_per_kg}` : "-"}
      </p>
    </div>
    <div className="flex justify-between">
      <p className="text-gray-600">Berat Diajukan</p>
      <p className="text-gray-800">{invoiceData?.berat_diajukan || "-"}</p>
    </div>
    <div className="flex justify-between">
      <p className="text-gray-600">Jasa Pengiriman</p>
      <p className="text-gray-800">{formData.jasaPengiriman || "-"}</p>
    </div>
    <div className="flex justify-between">
      <p className="text-gray-600">Ongkos Pengiriman</p>
      <p className="text-gray-800">
        {invoiceData?.ongkir ? `${invoiceData.ongkir}` : "-"}
      </p>
    </div>
    <div className="flex justify-between">
      <p className="text-gray-600">Pajak</p>
      <p className="text-gray-800">
        {invoiceData?.pajak ? `Rp ${invoiceData.pajak}` : "-"}
      </p>
    </div>
    <hr />
    <div className="flex justify-between">
      <p className="text-gray-600 font-bold">Total</p>
      <p className="text-gray-800 font-bold">
        {invoiceData?.total ? ` ${invoiceData.total}` : "-"}
      </p>
    </div>
    <hr />
  </div>
  <div className="mt-6 text-center">
    <button
      onClick={handleSubmitPengajuan}
      className="bg-[#327A6D]  hover:bg-[#a7dbd1] hover:text-black   outline-black outline outline-1 font-medium transition-all duration-300 ease-in-out w-full text-white py-2 px-6 rounded-lg"
      disabled={loadingInvoice}
    >
      {loadingInvoice ? "Memuat..." : "Proceed"}
    </button>
  </div>
</div>

          </div>

          {errorMessage && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
    <strong className="font-bold">Error: </strong>
    <span className="block sm:inline">{errorMessage}</span>
    <button
      onClick={() => setErrorMessage("")}
      className="absolute top-0 bottom-0 right-0 px-4 py-3"
    >
      <svg
        className="fill-current h-6 w-6 text-red-500"
        role="button"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <title>Close</title>
        <path d="M14.348 14.849a1 1 0 11-1.414 1.415L10 11.414l-2.933 2.934a1 1 0 01-1.415-1.415L8.586 10 5.653 7.067a1 1 0 011.415-1.415L10 8.586l2.933-2.934a1 1 0 011.414 1.415L11.414 10l2.934 2.933z" />
      </svg>
    </button>
  </div>
)}

        </main>
      </div>
    </div>
  );
};

export default PengajuanFormPage;
