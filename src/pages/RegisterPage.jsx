import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DekorasiAtas from "../assets/Group 1000005180.png"; // Gambar dekorasi atas
import Logo from "../assets/Group 1000005175.png"; // Logo
import PenyiramTanaman from "../assets/pexels-enric-cruz-lopez-6039237.jpg"; // Background kanan

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirmation: "",
    role: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (formData.password !== formData.passwordConfirmation) {
      setErrorMessage("Password dan Password Confirmation harus sama.");
      setLoading(false);
      return;
    }

    try {
      // STEP 1: Mendaftar pengguna baru
      const response = await fetch(
        "https://sipanda-production.up.railway.app/api/register/identity/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone_number: formData.phoneNumber,
            password: formData.password,
            password_confirmation: formData.passwordConfirmation,
            role: formData.role,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // STEP 2: Jika role adalah "kepala_desa", arahkan ke halaman registrasi desa
        if (formData.role === "kepala_desa") {
          navigate(`/register/kepala-desa/${data.data.id}`);
        } else {
          // Jika bukan kepala desa, langsung selesai
          alert(data.message);
          navigate("/check-status");
        }
      } else {
        // Menampilkan pesan error dari server
        if (data.errors) {
          setErrorMessage(data.errors.email?.[0] || data.message);
        } else {
          setErrorMessage(data.message);
        }
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
          <img src={Logo} alt="Logo" className="w-1/2 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-4 text-center">
            Back to{" "}
            <span
              className="font-bold text-[#48B09D] cursor-pointer"
              onClick={() => navigate("/")}
            >
              Home
            </span>
          </p>
          <h2 className="text-xl font-semibold mb-3 text-center">
            Create your account.
          </h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Already have an account?{" "}
            <span
              className="font-bold text-[#48B09D] cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </p>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Already registered?{" "}
            <span
              className="font-bold text-[#48B09D] cursor-pointer"
              onClick={() => navigate("/check-status")}
            >
              Check your registration status
            </span>
          </p>


          <form onSubmit={handleSubmit}>
            {/* Input Fields */}
            <label htmlFor="name" className="block text-left text-md mb-2">
              Nama <span className="text-red-700">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full p-3 border border-[#6E6969] rounded-xl mb-4"
              required
              value={formData.name}
              onChange={handleInputChange}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="email" className="block text-left text-md mb-2">
                  Email <span className="text-red-700">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="p-3 border border-[#6E6969] rounded-xl w-full"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-left text-md mb-2"
                >
                  No Handphone <span className="text-red-700">*</span>
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="number"
                  className="p-3 border border-[#6E6969] rounded-xl w-full"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <label htmlFor="password" className="block text-left text-md mb-2">
              Password <span className="text-red-700">*</span>
            </label>
            <div className="relative mb-4">
              <input
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                className="w-full p-3 border border-[#6E6969] rounded-xl"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            </div>

            <label
              htmlFor="passwordConfirmation"
              className="block text-left text-md mb-2"
            >
              Konfirmasi Password <span className="text-red-700">*</span>
            </label>
            <div className="relative mb-4">
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type={confirmPasswordVisible ? "text" : "password"}
                className="w-full p-3 border border-[#6E6969] rounded-xl"
                required
                value={formData.passwordConfirmation}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {confirmPasswordVisible ? "Hide" : "Show"}
              </button>
            </div>

            <label htmlFor="role" className="block text-left text-md mb-2">
              Mendaftar sebagai: <span className="text-red-700">*</span>
            </label>
            <select
              id="role"
              name="role"
              className="w-full p-3 mb-5 border border-[#6E6969] rounded-xl"
              required
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Pilih Peran
              </option>
              <option value="kepala_desa">Kepala Desa</option>
              <option value="bapanas">BAPANAS (Badan Pangan Nasional)</option>
            </select>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-sm text-red-500 text-left mb-4">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full p-3 bg-[#48B09D] hover:bg-[#a7dbd1] hover:text-black   outline-black outline outline-1 text-white font-medium rounded-full transition-all duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? "Loading..." : "Next"}
            </button>
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

export default RegisterPage;
