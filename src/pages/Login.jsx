import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import LogoImage from "../Component/Admin/image/logo_hospital.png";
import "./Login.css"

const Login = ({ data }) => {
  // State management
  const [formData, setFormData] = useState({
    adminEmailId: "",
    adminPassword: "",
  });
  const [registerData, setRegisterData] = useState({
    adminEmailId: "",
    adminPassword: "",
    adminName: "",
    adminLocation: "",
    adminMobileNo: "",
    adminWhatsappNo: "",
    adminImagelink: null,
  });
  const [view, setView] = useState("login"); // login, register, forgot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  
  const navigate = useNavigate();

  // Handlers
  const handleLoginInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterInput = (e) => {
    if (e.target.name === "adminImagelink") {
      setRegisterData({
        ...registerData,
        adminImagelink: e.target.files[0],
      });
    } else {
      setRegisterData({
        ...registerData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const BASE_URL = import.meta.env.VITE_API_KEY;
      const response = await axios.post(
        `${BASE_URL}/api/admin/login`,
        formData,
        { withCredentials: true }
      );

      if (response.data) {
        localStorage.setItem("token", JSON.stringify(response.data.token));
        data(response.data.adminId);
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const BASE_URL = import.meta.env.VITE_API_KEY;
      const formData = new FormData();
      Object.keys(registerData).forEach(key => {
        formData.append(key, registerData[key]);
      });

      const response = await axios.post(
        `${BASE_URL}/api/admin/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(response.data.message);
      setView("login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const BASE_URL = import.meta.env.VITE_API_KEY;
      const response = await axios.patch(
        `${BASE_URL}/api/admin/send-forgot-password-code`,
        { adminEmailId: formData.adminEmailId }
      );

      toast.success(response.data.message);
      setShowOtp(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const BASE_URL = import.meta.env.VITE_API_KEY;
      const response = await axios.patch(
        `${BASE_URL}/api/admin/verify-forgot-password-code`,
        {
          adminEmailId: formData.adminEmailId,
          providedCode: otp,
          newPassword: newPassword,
        }
      );

      toast.success(response.data.message);
      setView("login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-wrapper">
        {/* Left Panel */}
        <div className="admin-login-left">
          <img src={LogoImage} alt="Hospital Logo" className="admin-login-logo" />
          <h1>ENT And Gyneocologist</h1>
          <p>Healthcare Administration Portal</p>
        </div>

        {/* Right Panel */}
        <div className="admin-login-right">
          {view === "login" && (
            <form onSubmit={handleLogin} className="admin-login-form">
              <h2>Admin Login</h2>
              {error && <div className="admin-login-error">{error}</div>}
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="adminEmailId"
                  value={formData.adminEmailId}
                  onChange={handleLoginInput}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleLoginInput}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </button>
              <div className="admin-login-links">
                <span onClick={() => setView("forgot")}>Forgot Password?</span>
                <span onClick={() => setView("register")}>Register</span>
              </div>
            </form>
          )}

          {view === "register" && (
            <form onSubmit={handleRegister} className="admin-login-form">
              <h2>Admin Registration</h2>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="adminName"
                  value={registerData.adminName}
                  onChange={handleRegisterInput}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="adminEmailId"
                  value={registerData.adminEmailId}
                  onChange={handleRegisterInput}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="adminPassword"
                  value={registerData.adminPassword}
                  onChange={handleRegisterInput}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="adminLocation"
                  value={registerData.adminLocation}
                  onChange={handleRegisterInput}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="adminMobileNo"
                  value={registerData.adminMobileNo}
                  onChange={handleRegisterInput}
                  required
                />
              </div>
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input
                  type="tel"
                  name="adminWhatsappNo"
                  value={registerData.adminWhatsappNo}
                  onChange={handleRegisterInput}
                  required
                />
              </div>
              <div className="form-group">
                <label>Profile Image</label>
                <input
                  type="file"
                  name="adminImagelink"
                  onChange={handleRegisterInput}
                  accept="image/*"
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
              <div className="admin-login-links">
                <span onClick={() => setView("login")}>Back to Login</span>
              </div>
            </form>
          )}

          {view === "forgot" && (
            <form onSubmit={showOtp ? handleResetPassword : handleForgotPassword} className="admin-login-form">
              <h2>Reset Password</h2>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="adminEmailId"
                  value={formData.adminEmailId}
                  onChange={handleLoginInput}
                  required
                />
              </div>
              {showOtp && (
                <>
                  <div className="form-group">
                    <label>OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : showOtp ? "Reset Password" : "Send OTP"}
              </button>
              <div className="admin-login-links">
                <span onClick={() => setView("login")}>Back to Login</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;