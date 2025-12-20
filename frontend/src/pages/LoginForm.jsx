import { Link } from "react-router-dom";
import "../pages/LoginForm.css";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; 

  return (
    <div className="login-container" dir={isRTL ? "rtl" : "ltr"}>
      <div className="login-card">
        <div className="login-header">
          <div className="login-header-icon">
            <i
              className="fa-solid fa-user"
              style={{
                fontSize: "2rem",
                color: "#084668",
                marginBottom: "1rem",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            ></i>
          </div>
          <h2 className="login-title">{t("login.title")}</h2>
          <p className="login-subtitle">{t("login.subtitle")}</p>
        </div>

        <form className="login-form">
          {/* Email Field */}
          <div className={`form-group ${isRTL ? "rtl" : "ltr"}`}>
            <label className="form-label">{t("login.email")}</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                placeholder={t("login.email")}
                className="form-input"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className={`form-group ${isRTL ? "rtl" : "ltr"}`}>
            <label className="form-label">{t("login.password")}</label>
            <div className="input-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                placeholder={t("login.password")}
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            {t("login.submit")}
          </button>

          <a
            style={{
              textDecoration: "none",
              color: "#0b8ae9",
              margin: "auto",
            }}
            href="/forgot-password"
          >
            {t("login.forgotPassword")}
          </a>

          <div>
            <p className="signin-link">
              {t("login.noAccount")}{" "}
              <Link to="/signup">{t("login.create")}</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
