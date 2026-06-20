import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { useTranslation } from "react-i18next";
import axiosInstance from "../api/axios";

const Login = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/Auth/login", {
        email,
        password,
      });

      const data = response.data;

      if (!data.isSuccess) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // حفظ البيانات في localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("fullName", data.fullName);
      localStorage.setItem("email", data.email);
      if (data.hospitalId) {
        localStorage.setItem("hospitalId", data.hospitalId);
      }

      // التوجيه حسب الدور
      const role = data.role?.toLowerCase();
      if (role === "superadmin") {
        navigate("/super-admin");
      } else if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (role === "patient") {
        navigate("/patient-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      // لو الـ backend رجع error response (مثلاً 401)
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: "#fff3cd",
                border: "1px solid #ffc107",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "12px",
                color: "#856404",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <i className="fas fa-exclamation-triangle"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Email Field */}
          <div className={`form-group ${isRTL ? "rtl" : "ltr"}`}>
            <label className="form-label">{t("login.email")}</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                placeholder={t("login.email")}
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin"></i>{" "}
                {isRTL ? "جاري الدخول..." : "Logging in..."}
              </span>
            ) : (
              t("login.submit")
            )}
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
