import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import LogoCard from "../assets/logo-card.png";
import PriceIcon from "../assets/icons/price-icon.svg";
import WeightIcon from "../assets/icons/weight-icon.svg";
import StatistikIcon from "../assets/icons/statistik-icon.svg";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Approveicon from "../assets/icons/approve-icon-notif.svg";
import Rejecticon from "../assets/icons/reject-icon-notif.svg";
import Pendingicon from "../assets/icons/pending-icon-notif.svg";
import Infoicon from "../assets/icons/info-icon-notif.svg";

const DashboardPage = () => {
  const [greeting, setGreeting] = useState("");
  const [userData, setUserData] = useState({});
  const [panganData, setPanganData] = useState([]);
  const [notifications, setNotifications] = useState([]);

  
  const [pieChartData, setPieChartData] = useState({
    labels: [],
    data: [],
    colors: ["#A3FAC2", "#83e", "#56C9DC", "#FFD700", "#FF6347", "#FFA07A", "#FFDAB9", "#ac7faf"],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const pieChartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [calendarDates, setCalendarDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const [todayDate, setTodayDate] = useState(new Date().getDate());
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const API_BASE_URL = "https://sipanda-production.up.railway.app/api";
  useEffect(() => {
    console.log("panganData:", panganData);
    console.log("notifications:", notifications);
    console.log("pieChartData:", pieChartData);
  }, [panganData, notifications, pieChartData]);


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
          
          fetchUserData(token),
          fetchGreeting(token),
          fetchPanganData(token),
          fetchPanganStatistics(token),
          fetchNotifications(token),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    };
  }, []);
  

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/kepala_desa/user`, {
        headers: {
          Accept : `application/json`,
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
          Accept : `application/json`,
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
  const fetchPanganData = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pangan`, {
        headers: {
          Accept : `application/json`,
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok && Array.isArray(result.data)) {
        setPanganData(result.data);
      } else {
        setPanganData([]); // Set sebagai array kosong jika tidak ada data
        console.warn(result.message || "Data pangan tidak ditemukan.");
      }
    } catch (error) {
      console.error("Error fetching pangan data:", error);
      setPanganData([]); // Set array kosong pada error
    }
  };
  
  const fetchPanganStatistics = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pangan/persentase`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Periksa tipe konten
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format (not JSON)");
      }
  
      const result = await response.json();
  
      if (response.ok && result.data) {
        const labels = Object.keys(result.data || {});
        const data = Object.values(result.data || {});
        if (labels.length > 0 && data.length > 0) {
          setPieChartData((prev) => ({ ...prev, labels, data }));
          initializePieChart(labels, data);
        } else {
          console.warn("No valid data for pie chart");
          setPieChartData((prev) => ({ ...prev, labels: [], data: [] }));
        }
      } else {
        console.warn(result.message || "Data not found");
        setPieChartData((prev) => ({ ...prev, labels: [], data: [] }));
      }
    } catch (error) {
      console.error("Error fetching pangan statistics:", error);
    }
  };
  

  const fetchNotifications = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          Accept : `application/json`,
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setNotifications(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Accept : `application/json`,
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const initializePieChart = (labels, data) => {
    if (!labels || !Array.isArray(labels) || labels.length === 0 || 
        !data || !Array.isArray(data) || data.length === 0) {
      console.warn("Pie chart data is invalid:", { labels, data });
      return; // Jangan melanjutkan jika data tidak valid
    }
  
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();
  
    chartInstanceRef.current = new Chart(pieChartRef.current, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: pieChartData.colors,
            hoverOffset: 20,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
      },
    });
  };
  

  const initializeCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    setCurrentMonth(date.toLocaleString("default", { month: "long", year: "numeric" }));

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
 

  const totalPages = Math.ceil((panganData?.length || 0) / itemsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);
  
  const paginatedData = (panganData?.length || 0) > 0
    ? panganData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];
  

  const renderPagination = () => {

    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center space-x-5 mt-4 mb-10">
      
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-full ${
            currentPage === 1 ? "text-gray-300 duration-300 ease-in-out" : "text-gray-600"
          }`}
        >
          {"<"}
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page ? "bg-[#1C443D] text-white duration-500 ease-in-out" : "bg-white text-[#1C443D]"
            } border border-[#1C443D]`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full ${
            currentPage === totalPages ? "text-gray-300 duration-300 ease-in-out" : "text-gray-600"
          }`}
        >
          {">"}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdfa]">
     {isLoading ? (
     <div className="flex justify-center min-h-screen items-center mt-4">
     <div className="loader "></div>
   </div>
    ) : (
      <>
      <Navbar title="Dashboard" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-2 p-6">
            <h2 className="text-2xl font-bold mb-2">Welcome Back, Kepala Desa!</h2>
            <p className="text-gray-600">
              Ini adalah dashboard yang berisi data-data penting mengenai pangan desa.
            </p>
          </div>

          {/* Layout Cards dan Kalender */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            {panganData.length > 0 && !panganData.length != null ? (
              paginatedData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow rounded-[20px] border border-gray-300 flex flex-col justify-between outline outline-1"
                >
                  <div className="bg-[#1C443D] rounded-t-[20px] p-4 text-white flex items-center">
                    <img
                      src={LogoCard}
                      alt="Logo"
                      className="w-10 h-10 mr-3"
                    />
                    <h3 className="text-lg font-bold">{item.jenis_pangan}</h3>
                  </div>
                  <div className="p-4 flex-1">
                    <div className="items-center mb-4">
                      <div className="flex">
                        <img
                          src={PriceIcon}
                          alt="Logo"
                          className="w-6 h-6 mr-3 mt-2"
                        />
                        <span className="text-black text-2xl font-bold">Rp {item.harga}</span>
                      </div>
                      <span className="text-sm ml-10">Rp/Kg</span>
                    </div>
                    <div className="items-center">
                      <span className="text-black mt-6 font-semibold text-2xl flex items-center">
                        <img
                          src={WeightIcon}
                          alt="Logo"
                          className="w-7 h-7 mr-3"
                        />
                        Berat:
                      </span>
                      <span className="text-sm font-bold ml-10 bg-[#327A6D] text-white px-2 py-1 rounded-lg">
                        {item.berat} Kg
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-2 text-sm flex justify-end text-gray-500 text-center">
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                Tidak ada data pangan tersedia.
              </p>
            )}
            </div>
           

            {/* Kalender */}
            <div className="bg-white p-4 rounded-lg shadow md:w-full">
  <h3 className="font-bold mb-2 text-center">{currentMonth}</h3>
  <div className="grid grid-cols-7 gap-1 text-center text-sm">
    {/* Nama hari */}
    {["M", "S", "S", "R", "K", "J", "S"].map((day, idx) => (
      <div key={idx} className="font-bold text-gray-600">
        {day}
      </div>
    ))}
    {/* Tanggal */}
    {calendarDates.map((date, idx) => (
      <div
        key={idx}
        className={`p-2 ${
          date === todayDate
            ? "bg-[#327A6D] text-white rounded-md"
            : "bg-gray-100 hover:bg-gray-300 rounded-md"
        }`}
      >
        {date || ""}
      </div>
    ))}
  </div>
</div>

          </section>

          {/* Pagination */}
          {renderPagination()}

          {/* Statistik dan Notifikasi */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-custom-gradient text-white p-6 rounded-[60px] shadow col-span-2">
              <div className="grid grid-cols-2 items-center">
                <div className="col-span-1 grid place-content-center">
                  <div className="flex items-center space-x-2 mb-20">
                    <img
                      src={StatistikIcon}
                      alt="Logo"
                      className="w-10 h-10 mr-3"
                    />
                    <span>
                      <h3 className="text-2xl font-bold text-white">Statistik Pangan Desa</h3>
                      <p className="text-sm text-[#A3D1D8]">
                        Laporan Jumlah Presentase Pangan Desa
                      </p>
                    </span>
                  </div>
                  {pieChartData?.labels?.length > 0 && pieChartData?.data?.length > 0 ? (
                  <ul className="space-y-4">
                    
                    {pieChartData.labels.map((label, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between w-64 pb-2 border-b border-gray-400"
                      >
                        <div className="flex items-center">
                          <span
                            className="w-4 h-4 rounded-full"
                            style={{
                              backgroundColor: pieChartData.colors[idx] || '#cccccc',
                              marginRight: "10px",
                            }}
                          ></span>
                          <span>{label}</span>
                        </div>
                        <span>{pieChartData.data[idx] || 0}%</span>
                      </li>
                    ))}
                  </ul>
               ) : (
                <p className="text-white text-center">Tidak ada data statistik tersedia.</p>
              )}
                </div>
                <div className="col-span-1 flex justify-center">
                  <canvas ref={pieChartRef} style={{ maxWidth: "350px", maxHeight: "350px" }}></canvas>
                </div>
                <p className="text-white col-start-2 text-xs text-center mt-4">
                  *Data statistik bisa berubah <br />
                  sesuai pembaruan dari bapanas
                </p>
              </div>
            </div>
            <div className="bg-white p-4 overflow-x-hidden rounded-lg shadow md:w-full max-h-[500px] overflow-y-scroll  ">
            <h3 className="font-bold mb-4 text-center bg-[#1C443D] text-white p-2 rounded-lg">
              Notifikasi
            </h3> <ul>
            {Array.isArray(notifications) && notifications.length > 0 ? (
              notifications.slice().map((notif) => {
                let icon = null;
                let textColor = "";

                switch (notif.type) {
                  case "approval":
                    icon = Approveicon;
                    textColor = "text-green-500";
                    break;
                  case "rejected":
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
                        {notif.timestamp}
                      </p>
                      {!notif.read && (
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
              })
            ) : (
              <p className="text-center text-gray-500">Tidak ada notifikasi tersedia.</p>
            )}
            </ul>
        </div>

          </section>
        </main>
      </div>
      </>
         )}       
    </div>
    
            
  );
};

export default DashboardPage;
