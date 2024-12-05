import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DekorasiAtas from "../assets/Group 1000005180.png"; // Gambar dekorasi atas
import PenyiramTanaman from "../assets/pexels-enric-cruz-lopez-6039237.jpg"; // Background kanan

const RegisterDesaPage = () => {
  const { userId } = useParams(); // Mendapatkan userId dari URL
  const navigate = useNavigate();

  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [formData, setFormData] = useState({
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    kelurahan: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
 
  

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://sipanda-production.up.railway.app/api/location/provinces");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        setErrorMessage("Gagal memuat data provinsi.");
      }
    };
    fetchProvinces();
  }, []);

  // Fetch regencies based on province
  const fetchRegencies = async (provinceId) => {
    try {
      const response = await fetch(`https://sipanda-production.up.railway.app/api/location/regencies/${provinceId}`);
      const data = await response.json();
      setRegencies(data);
      setDistricts([]); // Reset districts
      setVillages([]); // Reset villages
    } catch (error) {
      setErrorMessage("Gagal memuat data kabupaten.");
    }
  };

  // Fetch districts based on regency
  const fetchDistricts = async (regencyId) => {
    try {
      const response = await fetch(`https://sipanda-production.up.railway.app/api/location/districts/${regencyId}`);
      const data = await response.json();
      setDistricts(data);
      setVillages([]); // Reset villages
    } catch (error) {
      setErrorMessage("Gagal memuat data kecamatan.");
    }
  };

  // Fetch villages based on district
  const fetchVillages = async (districtId) => {
    try {
      const response = await fetch(`https://sipanda-production.up.railway.app/api/location/villages/${districtId}`);
      const data = await response.json();
      setVillages(data);
    } catch (error) {
      setErrorMessage("Gagal memuat data kelurahan/desa.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Fetch data based on selection
    if (name === "provinsi") {
      fetchRegencies(value);
    } else if (name === "kabupaten") {
      fetchDistricts(value);
    } else if (name === "kecamatan") {
      fetchVillages(value);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
  
    try {
      const response = await fetch(
        `https://sipanda-production.up.railway.app/api/register/kepaladesa/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            province_id: formData.provinsi, // ID Provinsi
            regency_id: formData.kabupaten, // ID Kabupaten
            district_id: formData.kecamatan, // ID Kecamatan
            village_id: formData.kelurahan, // ID Kelurahan/Desa
          }),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccessMessage(data.message);
        setTimeout(() => navigate("/check-status"), 3000); // Redirect ke halaman verifikasi lisensi
      } else {
        setErrorMessage(data.message || "Registrasi gagal.");
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan pada server. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };


  

  return (
    <div className="flex flex-wrap w-full min-h-screen font-poppins">
      {/* Left Side: Registration Form */}
      <div className="relative flex flex-col w-full md:w-1/2 lg:w-[55%] items-center justify-center bg-white p-6">
        {/* Decorative Background */}
        <img
          src={DekorasiAtas}
          alt="Dekorasi Atas"
          className="absolute top-0 left-0 max-w-[150px] md:max-w-[250px]"
        />
        <img
          src={DekorasiAtas}
          alt="Dekorasi Bawah"
          className="absolute bottom-0 right-0 max-w-[150px] md:max-w-[250px] rotate-180"
        />

        {/* Registration Box */}
        <div className="w-full max-w-lg px-4 z-10">
          <h2 className="text-xl font-semibold mb-3 text-center">
            Register Desa
          </h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Silakan pilih lokasi desa Anda.
          </p>

          {/* Success Message */}
          {successMessage && (
            <p className="text-sm text-green-500 text-center mb-4">
              {successMessage}
            </p>
          )}

          {/* Error Message */}
          {errorMessage && (
            <p className="text-sm text-red-500 text-center mb-4">
              {errorMessage}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Provinsi */}
              <div>
                <label htmlFor="provinsi" className="block text-left text-md mb-2">
                  Provinsi *
                </label>
                <select
                  id="provinsi"
                  name="provinsi"
                  className="w-full p-3 mb-5 border border-[#6E6969] rounded-xl"
                  required
                  value={formData.provinsi}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    Pilih Provinsi
                  </option>
                  {provinces.map((provinsi) => (
                    <option key={provinsi.id} value={provinsi.id}>
                      {provinsi.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kabupaten */}
              <div>
                <label htmlFor="kabupaten" className="block text-left text-md mb-2">
                  Kabupaten *
                </label>
                <select
                  id="kabupaten"
                  name="kabupaten"
                  className="w-full p-3 mb-5 border border-[#6E6969] rounded-xl"
                  required
                  value={formData.kabupaten}
                  onChange={handleInputChange}
                  disabled={!regencies.length}
                >
                  <option value="" disabled>
                    Pilih Kabupaten
                  </option>
                  {regencies.map((kabupaten) => (
                    <option key={kabupaten.id} value={kabupaten.id}>
                      {kabupaten.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kecamatan */}
              <div>
                <label htmlFor="kecamatan" className="block text-left text-md mb-2">
                  Kecamatan *
                </label>
                <select
                  id="kecamatan"
                  name="kecamatan"
                  className="w-full p-3 mb-5 border border-[#6E6969] rounded-xl"
                  required
                  value={formData.kecamatan}
                  onChange={handleInputChange}
                  disabled={!districts.length}
                >
                  <option value="" disabled>
                    Pilih Kecamatan
                  </option>
                  {districts.map((kecamatan) => (
                    <option key={kecamatan.id} value={kecamatan.id}>
                      {kecamatan.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kelurahan/Desa */}
              <div>
                <label htmlFor="kelurahan" className="block text-left text-md mb-2">
                  Kelurahan/Desa *
                </label>
                <select
                  id="kelurahan"
                  name="kelurahan"
                  className="w-full p-3 mb-5 border border-[#6E6969] rounded-xl"
                  required
                  value={formData.kelurahan}
                  onChange={handleInputChange}
                  disabled={!villages.length}
                >
                  <option value="" disabled>
                    Pilih Kelurahan/Desa
                  </option>
                  {villages.map((kelurahan) => (
                    <option key={kelurahan.id} value={kelurahan.id}>
                      {kelurahan.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid w-full place-content-center ">
              <button
                type="submit"
                className="mt-10 py-3 px-10 bg-[#48B09D] hover:bg-[#a7dbd1] hover:text-black   outline-black outline outline-1 text-white font-medium rounded-full transition-all duration-300 ease-in-out"
                disabled={loading}
              >
                {loading ? "Loading..." : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side: Content Area */}
      <div className="hidden md:flex w-full md:w-1/2 lg:w-[45%]">
        <div
          className="w-full h-[300px] md:h-full"
          style={{
            backgroundImage: `url(${PenyiramTanaman})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-label="Gambar Penyiram Tanaman"
        ></div>
      </div>
    </div>
  );
};

export default RegisterDesaPage;
