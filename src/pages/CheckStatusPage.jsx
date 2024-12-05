import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DekorasiAtas from "../assets/Group 1000005180.png"; // Dekorasi atas
import DekorasiBawah from "../assets/Group 1000005186.png"; // Dekorasi bawah
import Logo from "../assets/Group 2.png"; // Logo
import SuccessIcon from "../assets/success.png"; // Icon untuk approved
import HourglassIcon from "../assets/hourglass.png"; // Icon untuk pending
import RejectedIcon from "../assets/rejected.png"; // Icon untuk rejected

const CheckStatusPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setResponse(null);

    try {
      const response = await fetch(
        "https://sipanda-production.up.railway.app/api/user/check-status",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setResponse(data);
      } else {
        setErrorMessage(data.message || "Terjadi kesalahan.");
      }
    } catch (error) {
      setErrorMessage("Gagal menghubungi server. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center font-poppins bg-white overflow-hidden">
      {/* Decorations */}
      <img
        src={DekorasiAtas}
        alt="Dekorasi Atas"
        className="absolute top-0 right-0 max-w-[200px] md:max-w-[300px] rotate-90"
      />
      <img
        src={DekorasiBawah}
        alt="Dekorasi Bawah"
        className="absolute bottom-0 left-0 max-w-[200px] md:max-w-[300px]"
      />

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg relative">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src={Logo} alt="Logo" className="h-10 mx-auto" />
        </div>

        {/* Display response or form */}
        {response ? (
          <div className="text-center">
            {response.status === "approved" && (
              <>
                <img
                  src={SuccessIcon}
                  alt="Approved"
                  className="w-16 mx-auto mb-4"
                />
                <p className="text-xl font-semibold text-gray-800 mb-4">
                  Selamat!
                </p>
                <p className="text-sm text-gray-600 mb-6">{response.message}</p>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg"
                >
                  Login
                </button>
              </>
            )}
            {response.status === "pending" && (
              <>
                <img
                  src={HourglassIcon}
                  alt="Pending"
                  className="w-16 mx-auto mb-4"
                />
                <p className="text-xl font-semibold text-gray-800 mb-4">
                  Menunggu Persetujuan
                </p>
                <p className="text-sm text-gray-600 mb-6">{response.message}</p>
                <button
                  onClick={() => setResponse(null)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg"
                >
                  Back
                </button>
              </>
            )}
            {response.status === "pending_qr" && (
              <>
                <img
                  src={HourglassIcon}
                  alt="Pending QR"
                  className="w-16 mx-auto mb-4"
                />
                <p className="text-xl font-semibold text-gray-800 mb-4">
                  Verifikasi QR
                </p>
                <p className="text-sm text-gray-600 mb-4">{response.message}</p>
                {/* Menampilkan QR Code */}
                <img
                  src={response.qr_code_url}
                  alt="QR Code"
                  className="w-32 h-32 mx-auto mb-4 border-2 border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => setResponse(null)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg"
                >
                  Back
                </button>
              </>
            )}
            {response.status === "rejected" && (
              <>
                <img
                  src={RejectedIcon}
                  alt="Rejected"
                  className="w-16 mx-auto mb-4"
                />
                <p className="text-xl font-semibold text-red-600 mb-4">
                  Ditolak
                </p>
                <p className="text-sm text-gray-600 mb-6">{response.message}</p>
                <button
                  onClick={() => setResponse(null)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg"
                >
                  Back
                </button>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
              Check Status Account
            </h2>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            {errorMessage && (
              <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white bg-[#48B09D]  hover:bg-[#a7dbd1] hover:text-black   outline-black outline outline-1 font-medium  transition-all duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? "Checking..." : "Submit"}
            </button>
          </form>
        )}

        {/* Links to other pages */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>{" "}
          | Need an account?{" "}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>{" "}
          | Want to verify your license?{" "}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => navigate("/verify-license")}
          >
            Verify License
          </span>
        </p>
      </div>
    </div>
  );
};

export default CheckStatusPage;
