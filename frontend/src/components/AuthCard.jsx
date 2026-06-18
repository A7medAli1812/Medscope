import React from "react";
import "../pages/Auth.css";

const AuthCard = ({ children, title, subtitle, icon, isSignup }) => {
  return (
    <div className="auth-page-wrapper">
      <div className={`auth-card ${isSignup ? "signup-card" : ""}`}>
        <div className="auth-card-body">
          <div className="auth-header">
            {icon && (
              <div className="auth-icon-wrapper">
                <i className={icon}></i>
              </div>
            )}
            {title && <h2 className="auth-title">{title}</h2>}
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
