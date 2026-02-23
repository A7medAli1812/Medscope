import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "./components/Header";
import Footer from "./components/Footer";
import SignUpForm from "./pages/SignUpForm";
import Login from "./pages/LoginForm";

// Dashboard Imports
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Doctors from "./pages/Doctors";
import DashboardPage from "./pages/Dashboard"; // Renamed to avoid confusion with the Layout or Route concept widely

import "./App.css";

// Public Layout Wrapper
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

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    const lang = i18n.language;

    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);

    document.body.dir = dir;

    document.documentElement.style.transition = "all 0.2s ease";
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
      <Routes>
        {/* Public Routes with Header & Footer */}
        <Route element={<PublicLayout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>

        {/* Dashboard Routes with Sidebar only */}
        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/bed-management" element={<BedManagement />} />
          <Route path="/blood-bank" element={<BloodBank />} />
          <Route path="/multi-hospital-view" element={<MultiHospitalView />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
