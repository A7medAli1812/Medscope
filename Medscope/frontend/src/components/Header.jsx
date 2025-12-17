

import React, { useState, useEffect } from "react";
import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = ({ isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logoImage = "/ChatGPT Image Sep 29, 2025, 03_40_38 PM.png";

  //  Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
      document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
    }
  }, [i18n]);

  //  Toggle language and save to localStorage
  const handleLanguageToggle = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("appLanguage", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const isSignupPage = location.pathname === "/signup";
  const buttonText = isSignupPage ? t("header.signIn") : t("header.signUp");
  const buttonIcon = isSignupPage ? "fas fa-user" : "fas fa-user-plus";

  const handleButtonClick = () => {
    navigate(isSignupPage ? "/" : "/signup");
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* 🔹 Logo section */}
        <div className="logo-section">
          <div className="logo">
            <div className="logo-icon">
              <img
                src={logoImage}
                alt="MedScope Logo"
                className="logo-icon-img"
                width={35}
                height={35}
              />
            </div>
            <div className="logo-text">
              <h1 className="logo-title">{t("header.title")}</h1>
              <p className="logo-subtitle">{t("header.subtitle")}</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="navigation">
          <ul className="nav-list">
            <li><a href="#home" className="nav-link">{t("header.home")}</a></li>
            <li><a href="#hospitals" className="nav-link">{t("header.hospitals")}</a></li>
            <li><a href="#services" className="nav-link">{t("header.services")}</a></li>
            <li><a href="#about" className="nav-link">{t("header.about")}</a></li>
          </ul>
        </nav>

        {/*  Right Section */}
        <div className="header-right">
          {/*  Language Switcher */}
          <button
            className="lang-switch-btn"
            onClick={handleLanguageToggle}
            title={i18n.language === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
          >
            <i className="fa-solid fa-language"></i>
          </button>

          {/*  Dark Mode */}
          <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            <i
              className={`dark-mode-icon ${
                isDarkMode ? "fas fa-sun" : "fas fa-moon"
              }`}
            ></i>
          </button>

          {/*  Sign In / Sign Up Button */}
          <button className="signin-btn" onClick={handleButtonClick}>
            <i className={`${buttonIcon} signin-icon`}></i>
            {buttonText}
          </button>
        </div>

        {/* 🔹 Mobile Menu Button */}
        <button
          className={`mobile-menu-btn ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <i
            className={`fas ${
              isMobileMenuOpen ? "fa-times" : "fa-bars"
            } mobile-menu-icon`}
          ></i>
        </button>
      </div>

      {/*  Mobile Menu Dropdown */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-content">
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              <li><a href="#home" className="mobile-nav-link" onClick={closeMobileMenu}>{t("header.home")}</a></li>
              <li><a href="#hospitals" className="mobile-nav-link" onClick={closeMobileMenu}>{t("header.hospitals")}</a></li>
              <li><a href="#services" className="mobile-nav-link" onClick={closeMobileMenu}>{t("header.services")}</a></li>
              <li><a href="#about" className="mobile-nav-link" onClick={closeMobileMenu}>{t("header.about")}</a></li>
            </ul>
          </nav>

          <div className="mobile-menu-actions">
            <button
              className="mobile-signin-btn"
              onClick={() => {
                handleButtonClick();
                closeMobileMenu();
              }}
            >
              <i className={`${buttonIcon} mobile-signin-icon`}></i>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
