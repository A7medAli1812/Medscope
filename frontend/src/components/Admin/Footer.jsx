
import React from "react";
import "./Footer.css";
import { useTranslation } from "react-i18next";

const logoImage = "/ChatGPT Image Sep 29, 2025, 03_40_38 PM.png";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo Section */}
        <div className="footer-logo-section">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <img
                src={logoImage}
                alt="MedScope Logo"
                className="logo-icon-img"
                width={30}
                height={30}
              />
            </div>
            <div className="footer-logo-text">
              <h2 className="footer-logo-title">{t("footer.title")}</h2>
              <p className="footer-logo-subtitle">{t("footer.empower")}</p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-copyright">
          <p className="copyright-text">{t("footer.copyright")}</p>
        </div>

        {/* Social Media Icons */}
        <div className="footer-social">
          <a href="#facebook" className="social-link" aria-label={t("footer.facebook")}>
            <i className="fab fa-facebook-f social-icon"></i>
          </a>
          <a href="#instagram" className="social-link" aria-label={t("footer.instagram")}>
            <i className="fab fa-instagram social-icon"></i>
          </a>
          <a href="#twitter" className="social-link" aria-label={t("footer.twitter")}>
            <i className="fab fa-twitter social-icon"></i>
          </a>
          <a href="#linkedin" className="social-link" aria-label={t("footer.linkedin")}>
            <i className="fab fa-linkedin-in social-icon"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
