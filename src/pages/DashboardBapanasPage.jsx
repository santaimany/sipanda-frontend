import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarBapanas from "../components/NavbarBapanas";
import SidebarBapanas from "../components/SidebarBapanas";
import StatistikHistoriHarga from "../components/StatistikHistoriHarga";
import Approveicon from "../assets/icons/approve-icon-notif.svg";
import Rejecticon from "../assets/icons/reject-icon-notif.svg";
import Pendingicon from "../assets/icons/pending-icon-notif.svg";
import Infoicon from "../assets/icons/info-icon-notif.svg";

const DashboardBapanasPage = () => {
  const [calendarDates, setCalendarDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const [todayDate, setTodayDate] = useState(new Date().getDate());
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(true);


  const navigate = useNavigate();
  const API_BASE_URL = "https://sipanda-production.up.railway.app/api";

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentDate = new Date();
    initializeCalendar(currentDate);

    if (!token) {
      alert("Anda harus login untuk mengakses halaman ini.");
      navigate("/login");
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchNotifications(token),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    initializeCalendar(new Date());
    fetchNotifications();
  }, []);

  

  const initializeCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    setCurrentMonth(
      date.toLocaleString("default", { month: "long", year: "numeric" })
    );

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dates = [];
    for (let i = 0; i < firstDay; i++) {
      dates.push(""); // Empty space before the first day
    }
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(i);
    }
    setCalendarDates(dates);
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (response.ok) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, is_read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdfa]">
      {/* Navbar */}
      <NavbarBapanas title="Dashboard" />

      <div className="flex flex-1">
        {/* Sidebar */}
        <SidebarBapanas />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Welcome Back, Bapanas!</h2>
            <p className="text-gray-600">
              Ini adalah dashboard yang berisi data-data penting mengenai
              ketahanan pangan nasional.
            </p>
          </div>

          {/* Layout: Peta dan Kalender */}
          
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <div id="map-container"></div>
            </div>
            {/* Kalender */}
            <div className="bg-white p-4 h-fit rounded-lg shadow">
              <h3 className="font-bold text-center mb-2">{currentMonth}</h3>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {["M", "S", "S", "R", "K", "J", "S"].map((day, idx) => (
                  <div key={idx} className="font-bold text-gray-600">
                    {day}
                  </div>
                ))}
                {calendarDates.map((date, idx) => (
                  <div
                    key={idx}
                    className={`p-2 ${
                      date === todayDate
                        ? "bg-[#327A6D] text-white rounded-md"
                        : "bg-gray-100 hover:bg-gray-300 rounded-md"
                    }`}
                  >
                    {date}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Layout: Statistik dan Notifikasi */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Statistik Histori Harga */}
            <StatistikHistoriHarga />

            {/* Notifikasi */}
            <div className="bg-white p-4 overflow-x-hidden rounded-lg shadow md:w-full max-h-[500px] overflow-y-scroll">
              <h3 className="font-bold mb-4 text-center bg-[#1C443D] text-white p-2 rounded-lg">
                Notifikasi
              </h3>
              {loadingNotifications ? (
                <p className="text-center text-gray-600">Loading...</p>
              ) : (
                <ul>
                  {notifications.map((notif) => {
                    let icon = null;
                    let textColor = "";

                    switch (notif.type) {
                      case "approval":
                        icon = Approveicon;
                        textColor = "text-green-500";
                        break;
                      case "reject":
                        icon = Rejecticon;
                        textColor = "text-red-500";
                        break;
                      case "pengajuan":
                        icon = Pendingicon;
                        textColor = "text-yellow-500";
                        break;
                      default:
                        icon = Infoicon;
                        break;
                    }

                    return (
                      <li
                        key={notif.id}
                        className="mb-4 flex items-start gap-4 p-4 border-b border-gray-200"
                      >
                        <img
                          src={icon}
                          alt={`${notif.type} icon`}
                          className="w-6 h-6"
                        />
                        <div className="flex-1">
                          <p className={`font-bold ${textColor}`}>
                            {notif.message}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {notif.created_at}
                          </p>
                          {!notif.is_read && (
                            <button
                              className="text-blue-500 text-sm underline"
                              onClick={() => markAsRead(notif.id)}
                            >
                              Tandai sebagai dibaca
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardBapanasPage;
