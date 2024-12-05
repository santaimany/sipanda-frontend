import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Group 1883.png";
import LogoutImage from "../assets/logout.png"; // Sesuaikan dengan path gambar logout
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const LogoutPage = () => {
  const [showPopup, setShowPopup] = useState(true); // Mengatur pop-up
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Animasi logout
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true); // Memulai animasi logout
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://sipanda-production.up.railway.app/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        localStorage.removeItem("token"); // Menghapus token dari localStorage

        setTimeout(() => {
          navigate("/login"); // Redirect ke halaman login setelah logout
        }, 1500); // Delay 1.5 detik untuk animasi
      } else {
        alert("Terjadi kesalahan saat logout.");
        setIsLoggingOut(false); // Menghentikan animasi jika gagal
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Terjadi kesalahan saat logout.");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdfa]">
      {/* Navbar */}
      <Navbar title="Logout" logo={Logo} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center">
          {showPopup && (
            <div className="bg-white p-8 rounded-lg shadow-md text-center relative">
              {isLoggingOut ? (
                <div className="flex flex-col items-center">
                  <div className="loader mb-4"></div>
                  <p className="text-lg font-bold text-gray-700">Logging out...</p>
                </div>
              ) : (
                <>
                  <img src={LogoutImage} alt="Logout" className="w-32 mx-auto mb-6" />
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Anda Yakin Ingin Log Out?
                  </h2>
                  <div className="flex justify-center space-x-4 mt-6">
                    <button
                      onClick={() => setShowPopup(false)}
                      className="px-6 py-2 bg-gray-200 rounded shadow hover:bg-gray-300 outline-black outline outline-1  font-medium transition-all duration-200 ease-in-out"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-2 bg-[#327A6D]  hover:bg-[#a7dbd1] hover:text-black   outline-black outline outline-1  font-medium transition-all duration-200 ease-in-out text-white rounded shadow-2xl"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Loader Animation CSS */}
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
          @keyframes l7 {
            to {
              transform: rotate(.5turn);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LogoutPage;
