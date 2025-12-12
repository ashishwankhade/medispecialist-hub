import React from "react";
import { useNavigate } from "react-router-dom";
import { Hospital } from "lucide-react";
import "./Home.css";
import logo from "../components/image/logo_hospital.png";
import Navbar from "./Navbar";
// import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate("/booking");
  };

  return (
    <div className="hospital-container">
      {/* Header */}
      <div className="RanaHospitalNav">
      <img className="RanaHospital-logo" src={logo} alt="Rana Hospital Logo" onClick={() => navigate("/")} />
        <h1 className="RanaHospital-h1">ENT And Gynecologist Hospital</h1>
      </div>

      {/* Main Content */}
      <main className="hospital-main">
        <div className="hero-section">
          <div className="hero-content">
            <button
              className="booking-button primary-button"
              onClick={handleBooking}
            >
              <Hospital className="button-icon" />
              Book Your Appointment
            </button>
            <Navbar />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="hospital-footer">
        <div className="footer-content">
          <p className="specialties">
            Laparoscopic • Gynecology and Obstetrics • Ear, Nose and Throat
            (ENT) • Endoscopic • Thyroid • Head and Neck Cancer • Facial Trauma
          </p>
          <h2 className="footer-title">ENT and Maternity Hospital</h2>
        </div>
      </footer>

 
    </div>
  );
};

export default Home;
