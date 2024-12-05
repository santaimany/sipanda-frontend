import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const SettingsPage = () => {
  const [settingsData, setSettingsData] = useState({
    name: "",
    email: "",
    role: "",
    profilePicture: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    profilePicture: null,
  });
  const [isEditing, setIsEditing] = useState({ email: false, password: false });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL = "https://sipanda-production.up.railway.app/api";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Anda harus login untuk mengakses halaman ini.");
      navigate("/login");
      return;
    }

    fetchUserSettings(token);
  }, []);

  const fetchUserSettings = async (token) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setSettingsData(result.data);
      } else {
        console.error(result.message || "Gagal memuat data settings.");
      }
    } catch (error) {
      console.error("Error fetching settings data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSettings = async (field, value) => {
    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();
    

    if (field === "profilePicture" && value instanceof File) {
      formDataToSend.append("profile_picture", value);
    } else {
      formDataToSend.append(field, value);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/settings/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Data berhasil diperbarui.");
        fetchUserSettings(token);
      } else {
        alert(result.message || "Gagal memperbarui data.");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdfa]">
      <Navbar title="Settings" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-screen">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Laman Pengaturan</h2>
              <div className="bg-yellow-100 p-4 rounded-lg mb-6">
                <p className="text-yellow-700 font-semibold">
                  Informasi Penting Untuk Kelengkapan Profil!
                </p>
                <p>
                  Lengkapi biodata Anda sekarang untuk pengalaman yang lebih personal dan optimal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informasi Akun */}
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-4">Informasi Akun</h3>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Foto Profil</label>
                    <div className="flex items-center">
                      <img
                        src={
                          formData.profilePicture
                            ? URL.createObjectURL(formData.profilePicture)
                            : settingsData.profilePicture || "https://via.placeholder.com/150"
                        }
                        alt="Profile"
                        className="w-16 h-16 rounded-full mr-4"
                      />
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="mb-2"
                        />
                        {formData.profilePicture && (
                          <button
                            onClick={() =>
                              handleUpdateSettings("profilePicture", formData.profilePicture)
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                          >
                            Simpan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Nama</label>
                    <p className="text-gray-800">{settingsData.name}</p>
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Sebagai</label>
                    <p className="text-gray-800">{settingsData.role}</p>
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Email</label>
                    {isEditing.email ? (
                      <div className="flex items-center">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-2 border rounded"
                        />
                        <button
                          onClick={() => {
                            handleUpdateSettings("email", formData.email);
                            handleEditToggle("email");
                          }}
                          className="ml-3 px-4 py-2 bg-green-500 text-white rounded"
                        >
                          Simpan
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <p className="text-gray-800">{settingsData.email}</p>
                        <button
                          onClick={() => handleEditToggle("email")}
                          className="text-blue-500 underline"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Password</label>
                    {isEditing.password ? (
                      <div className="flex items-center">
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-2 border rounded"
                        />
                        <button
                          onClick={() => {
                            handleUpdateSettings("password", formData.password);
                            handleEditToggle("password");
                          }}
                          className="ml-3 px-4 py-2 bg-green-500 text-white rounded"
                        >
                          Simpan
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <p className="text-gray-800">********</p>
                        <button
                          onClick={() => handleEditToggle("password")}
                          className="text-blue-500 underline"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Layanan Bantuan */}
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-4">Layanan Bantuan</h3>
                  <p className="text-gray-600 mb-4">
                    Butuh bantuan? Hubungi tim dukungan kami untuk mendapatkan bantuan yang cepat
                    dan personal atas pertanyaan dan kekhawatiran Anda.
                  </p>
                  <button className="bg-[#327A6D]  hover:bg-[#a7dbd1] hover:text-black   outline-black outline outline-1 font-medium  transition-all duration-300 ease-in-out text-white px-4 py-2 rounded">
                    Layanan Bantuan
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
