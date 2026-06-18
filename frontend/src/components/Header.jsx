import React, { useState } from "react";
import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
    const logoImage = "/ChatGPT Image Sep 29, 2025, 03_40_38 PM.png";

    const toggleTheme = () => {
        const nextDark = !isDark;
        setIsDark(nextDark);
        if (nextDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const isSignupPage = location.pathname === "/signup";
    const isLoginPage = location.pathname === "/login";
    const isLandingPage = location.pathname === "/" || location.pathname === "/home";

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        if (isLandingPage) {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            navigate(`/#${targetId}`);
        }
        closeMobileMenu();
    };

    return (
        <header className="header">
            <div className="header-container">
                {/* Logo */}
                <div className="logo-section">
                    <div className="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                        <div className="logo-icon">
                            <img src={logoImage} alt="MedScope Logo" className="logo-icon-img" width={35} height={35} />
                        </div>
                        <div className="logo-text">
                            <h1 className="logo-title">MedScope</h1>
                            <p className="logo-subtitle">Healthcare Excellence</p>
                        </div>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="navigation">
                    <ul className="nav-list">
                        <li><a href="#home" className="nav-link" onClick={(e) => handleNavClick(e, "home")}>Home</a></li>
                        <li><a href="#hospitals" className="nav-link" onClick={(e) => handleNavClick(e, "hospitals")}>Hospitals</a></li>
                        <li><a href="#services" className="nav-link" onClick={(e) => handleNavClick(e, "services")}>Services</a></li>
                        <li><a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, "about")}>About</a></li>
                    </ul>
                </nav>

                {/* Right Section */}
                <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle Theme" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'inherit', padding: '8px' }}>
                        <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
                    </button>
                    {(isLandingPage || isSignupPage) && (
                        <button className="signin-btn" onClick={() => { navigate("/login"); closeMobileMenu(); }}>
                            <i className="fas fa-user signin-icon"></i>
                            Sign in
                        </button>
                    )}
                    {(isLandingPage || isLoginPage) && (
                        <button className="signup-btn" onClick={() => { navigate("/signup"); closeMobileMenu(); }}>
                            <i className="fas fa-user-plus signup-icon"></i>
                            Sign up
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                     className={`mobile-menu-btn ${isMobileMenuOpen ? "active" : ""}`}
                     onClick={toggleMobileMenu}
                     aria-label="Toggle mobile menu"
                >
                     <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"} mobile-menu-icon`}></i>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
                <div className="mobile-menu-content">
                    <nav className="mobile-nav">
                        <ul className="mobile-nav-list">
                            <li><a href="#home" className="mobile-nav-link" onClick={(e) => handleNavClick(e, "home")}>Home</a></li>
                            <li><a href="#hospitals" className="mobile-nav-link" onClick={(e) => handleNavClick(e, "hospitals")}>Hospitals</a></li>
                            <li><a href="#services" className="mobile-nav-link" onClick={(e) => handleNavClick(e, "services")}>Services</a></li>
                            <li><a href="#about" className="mobile-nav-link" onClick={(e) => handleNavClick(e, "about")}>About</a></li>
                        </ul>
                    </nav>
                    <div className="mobile-menu-actions">
                        {(isLandingPage || isSignupPage) && (
                            <button className="mobile-signin-btn" onClick={() => { navigate("/login"); closeMobileMenu(); }}>
                                <i className="fas fa-user mobile-signin-icon"></i>
                                Sign in
                            </button>
                        )}
                        {(isLandingPage || isLoginPage) && (
                            <button className="mobile-signup-btn" onClick={() => { navigate("/signup"); closeMobileMenu(); }} style={{ marginTop: (isLandingPage ? "10px" : "0") }}>
                                <i className="fas fa-user-plus mobile-signup-icon"></i>
                                Sign up
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
