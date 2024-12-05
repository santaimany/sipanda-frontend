import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SidebarAdmin from "../components/SidebarAdmin";

const DashboardAdmin = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  const API_BASE_URL = "https://sipanda-production.up.railway.app/api";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/pending-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setPendingUsers(result.data);
      } else {
        console.error(result.message || "Gagal memuat daftar pengguna.");
      }
    } catch (error) {
      console.error("Error fetching pending users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyUser = async (userId, action) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/verify-user/${userId}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setActionMessage(result.message);
        if (action === "approve") {
          console.log("QR Code Path:", result.qr_code_path);
        }
        fetchPendingUsers(); // Refresh list
      } else {
        setActionMessage(result.message || "Gagal memproses tindakan.");
      }
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdfa]">
      <Navbar title="Dashboard Admin" />
      <div className="flex flex-1">
        <SidebarAdmin />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard Admin</h2>

          {actionMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
              {actionMessage}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center min-h-screen">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Pengguna Pending</h3>
              {pendingUsers.length === 0 ? (
                <p>Tidak ada pengguna yang menunggu verifikasi.</p>
              ) : (
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">#</th>
                      <th className="border border-gray-300 px-4 py-2">Nama</th>
                      <th className="border border-gray-300 px-4 py-2">Email</th>
                      <th className="border border-gray-300 px-4 py-2">Role</th>
                      <th className="border border-gray-300 px-4 py-2">Status</th>
                      <th className="border border-gray-300 px-4 py-2">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className="text-yellow-600">{user.status}</span>
                        </td>
                        <td className="border flex justify-center border-gray-300 px-4 py-2">
                          <button
                            onClick={() => handleVerifyUser(user.id, "approve")}
                            className="bg-[#327A6D]  hover:bg-[#a7dbd1] hover:text-black   outline-black outline outline-1 font-medium  transition-all duration-300 ease-in-out text-white px-2 py-1 mr-3 rounded"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerifyUser(user.id, "reject")}
                            className="bg-red-500 font-medium  transition-all duration-300 ease-in-out text-white px-4 py-1 mr-3 rounded"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
