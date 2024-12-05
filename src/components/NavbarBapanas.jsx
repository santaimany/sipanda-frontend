import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Group 1883.png";

const Navbar = ({ title }) => {
  const [greeting, setGreeting] = useState("");
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const API_BASE_URL = "https://sipanda-production.up.railway.app/api";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Anda harus login untuk mengakses halaman ini.");
      navigate("/login");
      return;
    }

    fetchUserData(token);
    fetchGreeting(token);
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bapanas/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setUserData(result.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchGreeting = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/kepala_desa/greet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setGreeting(result.greeting);
      }
    } catch (error) {
      console.error("Error fetching greeting:", error);
    }
  };

  return (
<header className="flex justify-between items-center bg-[#327A6D] p-6 text-white sticky top-0 z-50">
  <span className="flex items-center space-x-4">
    <img src={Logo} alt="Logo" className="w-48" />
    <div>
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="text-sm">{greeting}</p>
    </div>
  </span>
  <div className="flex items-center space-x-4">
  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
    <div>
      <p className="font-semibold">{userData.name}</p>
      <p className="text-sm">Staff Bapanas</p>
    </div>

  </div>
</header>

  );
};

export default Navbar;
