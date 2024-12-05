import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import dashboardIconWhite from "../assets/icons/dashboard-icon.svg";
import pendataanIconWhite from "../assets/icons/pendataan-icon-white.svg";
import persetujuanIconWhite from "../assets/icons/persetujuan-icon-white.svg";
import detailPanganIconWhite from "../assets/icons/detail-pangan-icon-white.svg";
import riwayatIconWhite from "../assets/icons/riwayat-icon-white.svg";
import settingsIconWhite from "../assets/icons/settings-icon-white.svg";
import logoutIconWhite from "../assets/icons/logout-icon-white.svg";

import dashboardIconBlack from "../assets/icons/dashboard-icon-black.svg";
import pendataanIconBlack from "../assets/icons/pendataan-icon-black.svg";
import persetujuanIconBlack from "../assets/icons/persetujuan-icon-black.svg";
import detailPanganIconBlack from "../assets/icons/detail-pangan-icon-black.svg";
import riwayatIconBlack from "../assets/icons/riwayat-icon.svg";
import settingsIconBlack from "../assets/icons/settings-icon.svg";
import logoutIconBlack from "../assets/icons/logout-icon.svg";

const SidebarBapanas = () => {
  const [hoveredItem, setHoveredItem] = useState(null); // State untuk elemen yang sedang di-hover

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
              to="/dashboard/bapanas"
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

          {/* Pendataan */}
          <li
            onMouseEnter={() => setHoveredItem("pendataan")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <NavLink
              to="/dashboard/pendataan"
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
                      isActive || hoveredItem === "pendataan"
                        ? pendataanIconWhite
                        : pendataanIconBlack
                    }
                    alt="Pendataan"
                    className="w-6 h-6 duration-200 ease-in-out"
                  />
                  <span>Pendataan</span>
                </>
              )}
            </NavLink>
          </li>

          {/* Persetujuan */}
          <li
            onMouseEnter={() => setHoveredItem("persetujuan")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <NavLink
              to="/dashboard/persetujuan"
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
                      isActive || hoveredItem === "persetujuan"
                        ? persetujuanIconWhite
                        : persetujuanIconBlack
                    }
                    alt="Persetujuan"
                    className="w-6 h-6 duration-200 ease-in-out"
                  />
                  <span>Persetujuan</span>
                </>
              )}
            </NavLink>
          </li>

          {/* Detail Pangan */}
          <li
            onMouseEnter={() => setHoveredItem("detail-pangan")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <NavLink
              to="/dashboard/detail-pangan"
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
                      isActive || hoveredItem === "detail-pangan"
                        ? detailPanganIconWhite
                        : detailPanganIconBlack
                    }
                    alt="Detail Pangan"
                    className="w-6 h-6 duration-200 ease-in-out"
                  />
                  <span>Detail Pangan</span>
                </>
              )}
            </NavLink>
          </li>

          {/* Riwayat Persetujuan */}
          <li
            onMouseEnter={() => setHoveredItem("riwayat-persetujuan")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <NavLink
              to="/dashboard/riwayat-persetujuan"
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
                      isActive || hoveredItem === "riwayat-persetujuan"
                        ? riwayatIconWhite
                        : riwayatIconBlack
                    }
                    alt="Riwayat Persetujuan"
                    className="w-6 h-6 duration-200 ease-in-out"
                  />
                  <span>Riwayat Persetujuan</span>
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Separator */}
      <div className="border-t mx-6"></div>

      <nav className="p-6">
        <ul className="space-y-4">
          {/* Settings */}
          <li
            onMouseEnter={() => setHoveredItem("settings")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <NavLink
              to="/dashboard/settings/bapanas"
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
              to="/logout/bapanas"
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

export default SidebarBapanas;
