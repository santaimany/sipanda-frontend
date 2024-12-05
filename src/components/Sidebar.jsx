import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import dashboardIconWhite from "../assets/icons/dashboard-icon.svg";
import pengajuanIconWhite from "../assets/icons/pengajuan-icon-white.svg";
import riwayatIconWhite from "../assets/icons/riwayat-icon-white.svg";
import settingsIconWhite from "../assets/icons/settings-icon-white.svg";
import logoutIconWhite from "../assets/icons/logout-icon-white.svg";

import dashboardIconBlack from "../assets/icons/dashboard-icon-black.svg";
import pengajuanIconBlack from "../assets/icons/pengajuan-icon.svg";
import riwayatIconBlack from "../assets/icons/riwayat-icon.svg";
import settingsIconBlack from "../assets/icons/settings-icon.svg";
import logoutIconBlack from "../assets/icons/logout-icon.svg";

const Sidebar = () => {
  const [hoveredItem, setHoveredItem] = useState(null); // State untuk elemen yang di-hover

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col justify-between sticky top-0 h-screen overflow-y-auto">
      <nav className="p-6">
        <ul className="space-y-4">
          {/* Dashboard */}
          <li
            onMouseEnter={() => setHoveredItem("dashboard")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <NavLink
              to="/dashboard/kepala-desa"
              className={({ isActive }) =>
                `flex items-center space-x-4 p-3 rounded-lg ${
                  isActive
                    ? "bg-[#327A6D] text-white font-bold"
                    : "hover:bg-[#327A6D] hover:text-white font-bold transition-colors duration-200 ease-in-out"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={
                      isActive || hoveredItem === "dashboard"
                        ? dashboardIconWhite
                        : dashboardIconBlack
                    }
                    alt="Dashboard"
                    className="w-6 h-6 duration-200 ease-in-out"
                  />
                  <span>Dashboard</span>
                </>
              )}
            </NavLink>
          </li>

          <p className="font-bold">Menu</p>

          {/* Pengajuan */}
          <li
            onMouseEnter={() => setHoveredItem("pengajuan")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <NavLink
              to="/dashboard/pengajuan"
              className={({ isActive }) =>
                `flex items-center space-x-4 p-3 rounded-lg ${
                  isActive
                    ? "bg-[#327A6D] text-white font-bold"
                    : "hover:bg-[#327A6D] hover:text-white font-bold transition-colors duration-300 ease-in-out"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={
                      isActive || hoveredItem === "pengajuan"
                        ? pengajuanIconWhite
                        : pengajuanIconBlack
                    }
                    alt="Pengajuan"
                    className="w-6 h-6 duration-200 ease-in-out"
                  />
                  <span>Pengajuan</span>
                </>
              )}
            </NavLink>
          </li>

          {/* Riwayat Pengajuan */}
          <li
            onMouseEnter={() => setHoveredItem("riwayat")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <NavLink
              to="/dashboard/riwayat-pengajuan"
              className={({ isActive }) =>
                `flex items-center space-x-4 p-3 rounded-lg ${
                  isActive
                    ? "bg-[#327A6D] text-white font-bold"
                    : "hover:bg-[#327A6D] hover:text-white font-bold transition-colors duration-300 ease-in-out"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={
                      isActive || hoveredItem === "riwayat"
                        ? riwayatIconWhite
                        : riwayatIconBlack
                    }
                    alt="Riwayat Pengajuan"
                    className="w-6 h-6 duration-200 ease-in-out"
                  />
                  <span>Riwayat Pengajuan</span>
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Separator */}
      <div className="border-t mx-6 my-3"></div>

      {/* Settings dan Logout Section */}
      <nav className="p-6 -mt-4">
        <ul className="space-y-4">
          {/* Settings */}
          <li
            onMouseEnter={() => setHoveredItem("settings")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                `flex items-center space-x-4 p-3 rounded-lg ${
                  isActive
                    ? "bg-[#327A6D] text-white font-bold"
                    : "hover:bg-[#327A6D] hover:text-white font-bold transition-colors duration-300 ease-in-out"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={
                      isActive || hoveredItem === "settings"
                        ? settingsIconWhite
                        : settingsIconBlack
                    }
                    alt="Settings"
                    className="w-6 h-6 duration-200 ease-in-out"
                  />
                  <span>Settings</span>
                </>
              )}
            </NavLink>
          </li>

          {/* Logout */}
          <li
            onMouseEnter={() => setHoveredItem("logout")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                `flex items-center space-x-4 p-3 rounded-lg ${
                  isActive
                    ? "bg-[#327A6D] text-white font-bold"
                    : "hover:bg-[#327A6D] hover:text-white font-bold transition-colors duration-300 ease-in-out"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={
                      isActive || hoveredItem === "logout"
                        ? logoutIconWhite
                        : logoutIconBlack
                    }
                    alt="Logout"
                    className="w-6 h-6 duration-200 ease-in-out"
                  />
                  <span>Logout</span>
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
