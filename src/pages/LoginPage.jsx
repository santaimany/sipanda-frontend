import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DekorasiAtas from "../assets/Group 1000005180.png"; // Gambar dekorasi atas
import Logo from "../assets/Group 1000005175.png"; // Logo
import PenyiramTanaman from "../assets/pexels-enric-cruz-lopez-6039237.jpg"; // Background kanan

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    setErrorMessage("");

    // Client-side validation
    if (!formData.email.includes("@")) {
      setErrorMessage("Format email tidak valid.");
      return;
    }
   

    setLoading(true);

    try {
      const response = await fetch(
        "https://sipanda-production.up.railway.app/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data;

        // Simpan token dan data user ke localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect sesuai role
        if (user.role === "kepala_desa") {
          navigate("/dashboard/kepala-desa");
        } else if (user.role === "bapanas") {
          navigate("/dashboard/bapanas");
        } else if (user.role === "admin") {
          navigate("/dashboard/admin");
        }
      } else {
        setErrorMessage(data.message || "Login gagal. Silakan coba lagi.");
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan pada server. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap w-full min-h-screen font-poppins">
      {/* Left Side: Login Form */}
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

        {/* Login Box */}
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
            Welcome Back!
          </h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Don't have an account?{" "}
            <span
              className="font-bold text-[#48B09D] cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </span>
          </p>
          {/* New link to check status */}
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
            {/* Email Input */}
            <label htmlFor="email" className="block text-left text-md mb-2">
              Email <span className="text-red-700">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full p-3 border border-[#6E6969] rounded-xl mb-4"
              required
              value={formData.email}
              onChange={handleInputChange}
            />

            {/* Password Input */}
            <label htmlFor="password" className="block text-left text-md mb-2">
              Password <span className="text-red-700">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="w-full p-3 border border-[#6E6969] rounded-xl mb-4"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-sm text-red-500 text-left mb-4">
                {errorMessage}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full p-3 bg-[#48B09D] hover:bg-[#a7dbd1] hover:text-black   outline-black outline outline-1 text-white font-medium rounded-full transition-all duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
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

export default LoginPage;
