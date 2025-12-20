import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "./components/Header";
import Footer from "./components/Footer";
import SignUpForm from "./pages/SignUpForm";
import Login from "./pages/LoginForm";

import "./App.css";

function AppContent({ isDarkMode, toggleDarkMode }) {
  return (
    <div className="app">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Routes>
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
      <AppContent isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </Router>
  );
}

export default App;
