import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearAlldoctorErrors } from "@/store/slices/doctorSlice";
import {
  forgotPassword,
  verifyForgotPasswordCode,
} from "@/store/slices/forgotResetPasswordSlice";
import { toast } from "react-toastify";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";
import WebLogo from "../assets/RanaLogoMain.jpg";
import "./ForgotPassword.css";
const ForgotPassword = () => {
  const [doctorEmailId, setDoctorEmailId] = useState("");
  const [providedCode, setProvidedCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const { loading, error, message } = useSelector(
    (state) => state.forgotPassword
  );
  const { isAuthenticated } = useSelector((state) => state.doctor);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleForgotPassword = () => {
    dispatch(forgotPassword(doctorEmailId)).then(() => {
      if (!error) {
        setCodeSent(true);
        toast.success("Verification code sent to your email!");
      }
    });
  };

  const handleVerifyCode = () => {
    dispatch(
      verifyForgotPasswordCode(doctorEmailId, providedCode, newPassword)
    ).then(() => {
      if (!error) {
        toast.success("Password reset successfully! Please log in.");
        navigateTo("/login");
      }
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAlldoctorErrors());
    }
    if (isAuthenticated) {
      navigateTo("/");
    }
    if (message) {
      toast.success(message);
    }
  }, [dispatch, isAuthenticated, error, message, navigateTo]);

  return (
    <>
      <div className="CounsellorPage-container">
        <div className="CounsellorPage-wrapper">
          <div className="CounsellorPage-leftPanel">
            <div className="CounsellorPage-illustration">
              <img
                src={WebLogo}
                alt="Hospital Logo"
                className="counsellor-login-logo"
              />
              <h2>Password Recovery</h2>
              <p>
                {!codeSent
                  ? "Don't worry! We'll help you get back into your account."
                  : "Check your email for the verification code."}
              </p>
            </div>
          </div>

          <div className="CounsellorPage-rightPanel">
            <div className="CounsellorPage-formWrapper">
              <h1 className="CounsellorPage-title">
                {!codeSent ? "Forgot Password" : "Reset Password"}
              </h1>

              {!codeSent ? (
                <>
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
                        onChange={(e) => setDoctorEmailId(e.target.value)}
                        required
                      />
                    </label>
                  </div>

                  {loading ? (
                    <SpecialLoadingButton content={"Sending Code..."} />
                  ) : (
                    <button
                      onClick={handleForgotPassword}
                      className="CounsellorPage-button"
                    >
                      Send Verification Code
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div className="CounsellorPage-formGroup">
                    <label className="CounsellorPage-label">
                      <span className="CounsellorPage-labelText">
                        Verification Code
                      </span>
                      <input
                        type="text"
                        className="CounsellorPage-input"
                        placeholder="Enter the code from your email"
                        value={providedCode}
                        onChange={(e) => setProvidedCode(e.target.value)}
                        required
                      />
                    </label>
                  </div>

                  <div className="CounsellorPage-formGroup">
                    <label className="CounsellorPage-label">
                      <span className="CounsellorPage-labelText">
                        New Password
                      </span>
                      <input
                        type="password"
                        className="CounsellorPage-input"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </label>
                  </div>

                  {loading ? (
                    <SpecialLoadingButton content={"Resetting Password..."} />
                  ) : (
                    <button
                      onClick={handleVerifyCode}
                      className="CounsellorPage-button"
                    >
                      Reset Password
                    </button>
                  )}
                </>
              )}

              <Link to="/login" className="CounsellorPage-backToLogin">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
