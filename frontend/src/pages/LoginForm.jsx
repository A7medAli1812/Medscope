import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import SuccessModal from "../components/SuccessModal";
import Loader from "../components/Loader";
import { loginUser } from "../patient/services/authService.js";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fadeOut, setFadeOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("/home");

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);

    if (errorMessage) {
      setErrorMessage("");
    }
  };
  useEffect(() => {
    if (!errorMessage) return;

    setFadeOut(false);
    const timer = setTimeout(() => {
      setFadeOut(true);
      // بعد 0.5s نمسح الرسالة بالكامل
      setTimeout(() => setErrorMessage(""), 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setErrorMessage("");

  try {

    const data = await loginUser(email, password);

    if (data.isSuccess) {

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify({
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role
      }));

      // Determine redirect path based on role
      const role = data.role ? data.role.toLowerCase() : "";
      let targetPath = "/home";
      if (role === "superadmin") {
        targetPath = "/super-admin";
      } else if (role === "admin" || role === "hospitaladmin") {
        targetPath = "/admin";
      } else if (role === "doctor") {
        targetPath = "/doctor";
      } else if (role === "patient") {
        targetPath = "/patient";
      }

      setRedirectUrl(targetPath);
      setSuccessMessage("Login successful! Redirecting...");

      setTimeout(() => {
        navigate(targetPath);
      }, 1500);

    } else {
      setErrorMessage(data.message || "Invalid credentials");
    }

  } catch (error) {

    setErrorMessage(error.message || "Something went wrong");

  } finally {
    setLoading(false);
  }
};

  return (
    <AuthCard
      title="Login"
      subtitle="Access your healthcare portal"
      icon="fa-solid fa-user"
    >
      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label className="auth-label">Email Address</label>
          <div className="auth-input-group">
            <span className="auth-input-icon danger">
              <i className="fas fa-envelope"></i>
            </span>
            <input
              type="email"
              className="auth-input"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={handleInputChange(setEmail)}
            />
          </div>
        </div>

        <div className="auth-form-group mb-4">
          <label className="auth-label">Password</label>
          <div className="auth-input-group">
            <span className="auth-input-icon primary">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="auth-input"
              placeholder="Enter your password"
              required
              value={password}
              onChange={handleInputChange(setPassword)}
            />
            <button
              type="button"
              className="auth-btn-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fas fa-eye${showPassword ? "-slash" : ""}`}></i>
            </button>
          </div>
        </div>

        {/* عرض رسالة الخطأ مع fade-out */}
        {errorMessage && (
          <div
            className={`auth-error-message ${fadeOut ? "fade-out" : ""}`}
          >
            {errorMessage}
          </div>
        )}

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center mt-3 mb-3">
          <Link to="/forgot-password" className="auth-link small-text">
            <i className="fas fa-key"></i> Forgot your password?
          </Link>
        </div>

        <div className="text-center small-text text-muted">
          New here?<br />
          <Link to="/signup" className="auth-link mt-2">
            <i className="fas fa-user-plus"></i> Sign Up as Patient
          </Link>
        </div>
      </form>

      <SuccessModal
        message={successMessage}
        onClose={() => {
          setSuccessMessage("");
          navigate(redirectUrl);
        }}
        autoDismiss={2500}
      />

      {loading && <Loader message="Signing in..." />}
    </AuthCard>
  );
};

export default Login;