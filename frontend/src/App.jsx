import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation
} from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "./components/Header";
import Footer from "./components/Footer";
import SignUpForm from "./pages/SignUpForm";
import Login from "./pages/LoginForm";
import SuperAdminLayout from "./components/Superadminlayout";

// Dashboard Imports
import Hospitalmanagement from "./Super-Admin/Hospitalmanagement";
import Adminmanagement from "./Super-Admin/Adminmanagement";
import Reports from "./Super-Admin/Reports";
import Settings from "./Super-Admin/Settings";

import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Doctors from "./pages/Doctors";
import DashboardPage from "./pages/Dashboard";
import BedManagement from "./pages/BedManagement";
import BloodBank from "./pages/BloodBank";
import MultiHospitalView from "./pages/MultiHospitalView";
import NewAppointment from "./pages/new-appointment";
import NewDoctor from "./pages/new-doctor";

import Chatbot from "./Chatbot";

import "./App.css";

// Public Layout
function PublicLayout({ isDarkMode, toggleDarkMode }) {
  return (
    <div className="app">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// الجزء الداخلي اللي فيه useLocation
function AppContent({ isDarkMode, toggleDarkMode }) {
  const location = useLocation();

  // يظهر في كل صفحات الـ admin
  const showChatbot = location.pathname.startsWith("/super-admin");

  return (
    <>
      <Routes>
        {/* Public */}
        <Route
          element={
            <PublicLayout
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        >
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>

        {/* Super Admin */}
        <Route element={<SuperAdminLayout />}>
          <Route
            path="/super-admin/hospitals"
            element={<Hospitalmanagement />}
          />
          <Route
            path="/super-admin/admins"
            element={<Adminmanagement />}
          />
          <Route path="/super-admin/reports" element={<Reports />} />
          <Route path="/super-admin/settings" element={<Settings />} />
        </Route>

        {/* Dashboard */}
        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/bed-management" element={<BedManagement />} />
          <Route path="/blood-bank" element={<BloodBank />} />
          <Route
            path="/multi-hospital-view"
            element={<MultiHospitalView />}
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/new-appointment" element={<NewAppointment />} />
          <Route path="/new-doctor" element={<NewDoctor />} />
        </Route>
      </Routes>

      {/* شرط ظهور البوت */}
      {showChatbot && <Chatbot />}
    </>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    const lang = i18n.language;

    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);

    document.body.dir = dir;
  }, [i18n.language]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setIsDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <Router>
      <AppContent
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
    </Router>
  );
}

export default App;