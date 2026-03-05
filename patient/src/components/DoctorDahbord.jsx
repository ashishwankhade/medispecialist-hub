import React from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/doctor-appointment"); // Navigate to the next page
  };


  return (
    <div className="dams-container">
      <aside className="sidebar">
        <div className="logo">
          {/* <span className="logo-icon">◇</span> */}
          <span className="logo-text">Hi, Dr. Shreya T</span>
        </div>
        <div className="user-avatar">
          <span className="avatar-placeholder">👤</span>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-button active">
            <span className="nav-icon">□</span>
            Dashboard
          </button>
          <button className="nav-button" onClick={handleClick}>
            <span className="nav-icon">◷</span>
            Appointment
          </button>
          <button className="nav-button">
            <span className="nav-icon">🔍</span>
            Search
          </button>
          <button className="nav-button">
            <span className="nav-icon">📊</span>
            Report
          </button>
        </nav>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <button className="back-button">←</button>
            <h1 className="header-title">Dashboard</h1>
          </div>
          <div className="header-right">
            <button className="header-button">🔔</button>
            <button className="header-button">⚙️</button>
          </div>
        </header>
        <div className="dashboard-grid">
          <div className="dashboard-card yellow">
            <div className="card-content">
              <span className="card-icon">📅</span>
              <div className="card-info">
                <span className="card-number">2</span>
                <span className="card-label">Today's Appointment</span>
              </div>
            </div>
            <button className="card-button"  onClick={handleClick}>View Patient</button>
          </div>
          <div className="dashboard-card green">
            <div className="card-content">
              <span className="card-icon">✅</span>
              <div className="card-info">
                <span className="card-number">10</span>
                <span className="card-label">Total Patient</span>
              </div>
            </div>
            <button className="card-button">View Patient</button>
          </div>
          {/* <div className="dashboard-card red">
            <div className="card-content">
              <span className="card-icon">❌</span>
              <div className="card-info">
                <span className="card-number">0</span>
                <span className="card-label">Cancelled Appointment</span>
              </div>
            </div>
            <button className="card-button">View Detail</button>
          </div> */}
          {/* <div className="dashboard-card blue">
            <div className="card-content">
              <span className="card-icon">📊</span>
              <div className="card-info">
                <span className="card-number">3</span>
                <span className="card-label">Total Appointment</span>
              </div>
            </div>
            <button className="card-button">View Detail</button>
          </div> */}
        </div>
        <footer className="dashboard-footer">
          <p>Doctor Appointment Management System</p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
