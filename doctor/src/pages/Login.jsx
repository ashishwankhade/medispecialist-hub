import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  clearAlldoctorErrors,
  clearAlldoctorMessages,
  login,
} from "@/store/slices/doctorSlice";
import { toast } from "react-toastify";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";
import WebLogo from "../components/image/logo_hospital.png";
import "../pages/Login.css";

const Login = () => {
  const [doctorEmailId, setdoctorEmailId] = useState("");
  const [password, setPassword] = useState("");
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.doctor
  );

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogin = () => {
    dispatch(login(doctorEmailId, password));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAlldoctorErrors());
    }
    if (isAuthenticated) {
      navigateTo("/");
    }
    dispatch(clearAlldoctorMessages());
  }, [dispatch, isAuthenticated, error, loading]);

  return (
    <>
      {/* <Navbar /> */}
      <div className="CounsellorPage-container">
        <div className="CounsellorPage-wrapper">
          <div className="CounsellorPage-leftPanel">
            <div className="CounsellorPage-illustration">
              <img
                src={WebLogo}
                alt="Hospital Logo"
                className="counsellor-login-logo"
              />
              <h2>Welcome Back!</h2>
              <p>Your expertise makes a difference in peoples lives.</p>
            </div>
          </div>

          <div className="CounsellorPage-rightPanel">
            <div className="CounsellorPage-formWrapper">
              <h1 className="CounsellorPage-title">Doctor Login</h1>

              <div className="CounsellorPage-formGroup">
                <label className="CounsellorPage-label">
                  <span className="CounsellorPage-labelText">
                    Email Address
                  </span>
                  <input
                    type="email"
                    className="CounsellorPage-input"
                    placeholder="your.email@example.com"
                    value={doctorEmailId}
                    onChange={(e) => setdoctorEmailId(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="CounsellorPage-formGroup">
                <label className="CounsellorPage-label">
                  <span className="CounsellorPage-labelText">Password</span>
                  <input
                    type="password"
                    className="CounsellorPage-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <Link
                  to="/password/forgot"
                  className="CounsellorPage-forgotPassword"
                >
                  Forgot Password?
                </Link>
              </div>

              {loading ? (
                <SpecialLoadingButton content={"Signing In..."} />
              ) : (
                <button onClick={handleLogin} className="CounsellorPage-button">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
