import React from "react";
import "./Footer.css";

const logoImage = "/ChatGPT Image Sep 29, 2025, 03_40_38 PM.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Columns Grid */}
        <div className="footer-grid">
          
          {/* Column 1: Logo, Description & Socials */}
          <div className="footer-col col-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <img src={logoImage} alt="MedScope Logo" className="logo-icon-img" width={40} height={40} />
              </div>
              <div className="footer-logo-text">
                <h2 className="footer-logo-title">MedScope</h2>
                <p className="footer-logo-subtitle">Healthcare Excellence</p>
              </div>
            </div>
            
            <p className="footer-brand-desc">
              Advanced hospital management platform connecting patients with quality healthcare services. 
              Your health is our priority, and we're committed to providing exceptional medical care.
            </p>

            <div className="footer-social">
              <a href="#facebook" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook-f social-icon"></i>
              </a>
              <a href="#instagram" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram social-icon"></i>
              </a>
              <a href="#twitter" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter social-icon"></i>
              </a>
              <a href="#linkedin" className="social-link" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in social-icon"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col col-links">
            <h3 className="footer-col-title">
              <i className="fas fa-link title-icon"></i> Quick links
            </h3>
            <ul className="footer-links-list">
              <li>
                <a href="#privacy">
                  <i className="fas fa-chevron-right list-arrow"></i> Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms">
                  <i className="fas fa-chevron-right list-arrow"></i> Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#faqs">
                  <i className="fas fa-chevron-right list-arrow"></i> FAQs
                </a>
              </li>
              <li>
                <a href="#support">
                  <i className="fas fa-chevron-right list-arrow"></i> Support Center
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="footer-col col-contact">
            <h3 className="footer-col-title">
              <i className="fas fa-phone-alt title-icon"></i> Contact Info
            </h3>
            
            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-item-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-item-text">
                  <span className="contact-label">Email</span>
                  <a href="mailto:info@medscope.com" className="contact-value">info@medscope.com</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="contact-item-text">
                  <span className="contact-label">Phone</span>
                  <span className="contact-value">01003252891</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <i className="fas fa-ambulance"></i>
                </div>
                <div className="contact-item-text">
                  <span className="contact-label">Emergency</span>
                  <span className="contact-value highlight">123</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="footer-bottom">
          <p className="copyright-text">
            © 2025 MedScope. All rights reserved. Empowering Healthcare Excellence
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
