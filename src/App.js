import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RegisterDesaPage from "./pages/RegisterDesaPage";
import WaitingListPage from "./pages/WaitingListPage";
import "./index.css";
import './App.css';  
// index.js atau App.js
import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css';



import CheckStatusPage from "./pages/CheckStatusPage";
import DashboardPage from "./pages/DashboardPage";
import PengajuanPage from "./pages/PengajuanPage";
import PengajuanFormPage from "./pages/PengajuanForm";
import RiwayatPengajuanPage from "./pages/RiwayatPengajuanPage";
import LogoutPage from "./pages/Logout";
import DashboardBapanasPage from "./pages/DashboardBapanasPage";
import PendataanBapanasPage from "./pages/PendataanBapanasPage";
import PersetujuanBapanasPage from "./pages/PersetujuanBapanasPage";
import DetailPanganBapanasPage from "./pages/DetailPanganBapanasPage";
import RiwayatPersetujuanBapanasPage from "./pages/RiwayatPersetujuanBapanasPage";
import LogoutPageBapanas from "./pages/LogoutBapanas";
import SettingsPage from "./pages/SettingsPage";
import LandingPage from "./pages/LandingPage";
import DashboardAdmin from "./pages/DashboardAdminPage";
import LogoutAdmin from "./pages/LogoutAdmin";
import SettingsBapanas from "./pages/SettingsBapanas";
import { ToastContainer } from "react-toastify";


const App = () => {
  return (
    <Router>
      <div >
        <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/kepala-desa/:userId" element={<RegisterDesaPage />} />
   <Route path="/dashboard/kepala-desa" element={<DashboardPage />} />
<Route path="/verify-license" element={<WaitingListPage />} />
<Route path="/check-status" element={<CheckStatusPage />} />
<Route path="/dashboard/pengajuan" element={<PengajuanPage />} />
<Route path="/dashboard/pengajuan-form" element={<PengajuanFormPage />} />
<Route path="/dashboard/settings" element={<SettingsPage />} />
<Route path="/dashboard/riwayat-pengajuan" element={<RiwayatPengajuanPage />} />
<Route path="/logout" element={<LogoutPage />} />

<Route path="/dashboard/bapanas" element={<DashboardBapanasPage />} />
<Route path="/dashboard/pendataan" element={<PendataanBapanasPage /> } />
<Route path="/dashboard/persetujuan" element={<PersetujuanBapanasPage />} />  
<Route path="/dashboard/detail-pangan" element={<DetailPanganBapanasPage />} />
<Route path="/dashboard/riwayat-persetujuan" element={<RiwayatPersetujuanBapanasPage />} />
<Route path="/dashboard/settings/bapanas" element={<SettingsBapanas />} />
<Route path="/logout/bapanas" element={<LogoutPageBapanas />} />

<Route path="/dashboard/admin" element={<DashboardAdmin />} />
<Route path="/logout/admin" element={<LogoutAdmin />} />

      </Routes>
      </div>
    </Router>
  );
};

export default App;
