import React from "react";
import "./DoctorAppointment.css";
import { useNavigate } from "react-router-dom";

const DoctorAppointment = () => {

  const navigate = useNavigate();

  const handleChange = () => {
    navigate("/DrTouser-detail"); // Navigate to the next page
  };

  return (
    <div className="dams-container">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">D</div>
          <span className="logo-text">Hi, Dr. Shreya T</span>
        </div>
        {/* <div className="user-avatar">U</div> */}
        <nav className="sidebar-nav">
          <button className="nav-button">
            <i className="icon-dashboard"></i>Dashboard
          </button>
          <button className="nav-button">
            <i className="icon-appointment"></i>Appointment
          </button>
          <button className="nav-button">
            <i className="icon-search"></i>Search
          </button>
          <button className="nav-button">
            <i className="icon-report"></i>Report
          </button>
        </nav>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <button className="back-button">
              <i className="icon-arrow-left"></i>
            </button>
            <h1 className="header-title">Dashboard</h1>
          </div>
          <div className="header-right">
            <button className="header-button">
              <i className="icon-bell"></i>
            </button>
            <button className="header-button">
              <i className="icon-settings"></i>
            </button>
          </div>
        </header>
        <div className="content-wrapper">
          <div className="card-header">
            <h2 className="card-title">Patient Appointment</h2>
            <button className="settings-button">
              <i className="icon-settings"></i>
            </button>
          </div>

          <div className="appointment-card">
            <div className="pacient-info">
              <div className="appointment-details">
                <div className="detail-item1">
                  <p className="detail-label">Sr. No.</p>
                  <p className="detail-value">1</p>
                </div>
                <div className="detail-item2">
                  <p className="detail-label">Appointment Number</p>
                  <p className="detail-value">121</p>
                </div>
                <div className="detail-item3">
                  <p className="detail-label">Patient Name</p>
                  <p className="detail-value">Suyash Sharma</p>
                </div>
                <div className="detail-item4">
                  <p className="detail-label">Message</p>
                  <p className="detail-value">I am feeling very stressed</p>
                </div>
              </div>

              <div className="detail-item5">
                <div className="btn-and-checkbox" onClick={handleChange}>
                  <p className="view-patient-p">View Patient</p>
                </div>
                <div className="checkbox">
                  <input type="checkbox" name="checkbox" id="check-box" />
                </div>
              </div>
              {/* <div className="detail-item">
                <p className="detail-label">Mobile Number</p>
                <p className="detail-value">4654654464</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Email</p>
                <p className="detail-value">tina@gmail.com</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Appointment Date</p>
                <p className="detail-value">2022-11-11</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Appointment Time</p>
                <p className="detail-value">13:00:00</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Apply Date</p>
                <p className="detail-value">2022-11-10 17:38:51</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Appointment Final Status</p>
                <p className="detail-value">
                  Your appointment has been approved
                </p>
              </div> */}
            </div>
          </div>

          <div className="appointment-card">
            <div className="pacient-info">
              <div className="appointment-details">
                <div className="detail-item1">
                  <p className="detail-label">Sr. No.</p>
                  <p className="detail-value">2</p>
                </div>
                <div className="detail-item2">
                  <p className="detail-label">Appointment Number</p>
                  <p className="detail-value">122</p>
                </div>
                <div className="detail-item3">
                  <p className="detail-label">Patient Name</p>
                  <p className="detail-value">Brett kaka</p>
                </div>
                <div className="detail-item4">
                  <p className="detail-label">Message</p>
                  <p className="detail-value">I am feeling very stressed</p>
                </div>
              </div>

              <div className="detail-item5">
                <div className="btn-and-checkbox" onClick={handleChange}>
                  <p className="view-patient-p">View Patient</p>
                </div>
                <div className="checkbox">
                  <input type="checkbox" name="checkbox" id="check-box" />
                </div>
              </div>
              {/* <div className="detail-item">
                <p className="detail-label">Mobile Number</p>
                <p className="detail-value">4654654464</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Email</p>
                <p className="detail-value">tina@gmail.com</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Appointment Date</p>
                <p className="detail-value">2022-11-11</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Appointment Time</p>
                <p className="detail-value">13:00:00</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Apply Date</p>
                <p className="detail-value">2022-11-10 17:38:51</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Appointment Final Status</p>
                <p className="detail-value">
                  Your appointment has been approved
                </p>
              </div> */}
            </div>
          </div>

          <div className="appointment-card">
            <div className="pacient-info">
              <div className="appointment-details">
                <div className="detail-item1">
                  <p className="detail-label">Sr. No.</p>
                  <p className="detail-value">3</p>
                </div>
                <div className="detail-item2">
                  <p className="detail-label">Appointment Number</p>
                  <p className="detail-value">123</p>
                </div>
                <div className="detail-item3">
                  <p className="detail-label">Patient Name</p>
                  <p className="detail-value">Yashika Pandey</p>
                </div>
                <div className="detail-item4">
                  <p className="detail-label">Message</p>
                  <p className="detail-value">I am feeling very stressed</p>
                </div>
              </div>

              <div className="detail-item5">
                <div className="btn-and-checkbox" onClick={handleChange}>
                  <p className="view-patient-p">View Patient</p>
                </div>
                <div className="checkbox">
                  <input type="checkbox" name="checkbox" id="check-box" />
                </div>
              </div>
              {/* <div className="detail-item">
                <p className="detail-label">Mobile Number</p>
                <p className="detail-value">4654654464</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Email</p>
                <p className="detail-value">tina@gmail.com</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Appointment Date</p>
                <p className="detail-value">2022-11-11</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Appointment Time</p>
                <p className="detail-value">13:00:00</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Apply Date</p>
                <p className="detail-value">2022-11-10 17:38:51</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Appointment Final Status</p>
                <p className="detail-value">
                  Your appointment has been approved
                </p>
              </div> */}
            </div>
          </div>

          <div className="appointment-card">
            <div className="pacient-info">
              <div className="appointment-details">
                <div className="detail-item1">
                  <p className="detail-label">Sr. No.</p>
                  <p className="detail-value">4</p>
                </div>
                <div className="detail-item2">
                  <p className="detail-label">Appointment Number</p>
                  <p className="detail-value">124</p>
                </div>
                <div className="detail-item3">
                  <p className="detail-label">Patient Name</p>
                  <p className="detail-value"> Yadav</p>
                </div>
                <div className="detail-item4">
                  <p className="detail-label">Message</p>
                  <p className="detail-value">I am feeling very stressed</p>
                </div>
              </div>

              <div className="detail-item5">
                <div className="btn-and-checkbox" onClick={handleChange}>
                  <p className="view-patient-p">View Patient</p>
                </div>
                <div className="checkbox">
                  <input type="checkbox" name="checkbox" id="check-box" />
                </div>
              </div>
              {/* <div className="detail-item">
                <p className="detail-label">Mobile Number</p>
                <p className="detail-value">4654654464</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Email</p>
                <p className="detail-value">tina@gmail.com</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Appointment Date</p>
                <p className="detail-value">2022-11-11</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Appointment Time</p>
                <p className="detail-value">13:00:00</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Apply Date</p>
                <p className="detail-value">2022-11-10 17:38:51</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Appointment Final Status</p>
                <p className="detail-value">
                  Your appointment has been approved
                </p>
              </div> */}
            </div>
          </div>

          <div className="appointment-card">
            <div className="pacient-info">
              <div className="appointment-details">
                <div className="detail-item1">
                  <p className="detail-label">Sr. No.</p>
                  <p className="detail-value">5</p>
                </div>
                <div className="detail-item2">
                  <p className="detail-label">Appointment Number</p>
                  <p className="detail-value">125</p>
                </div>
                <div className="detail-item3">
                  <p className="detail-label">Patient Name</p>
                  <p className="detail-value">Piyush Agarwal</p>
                </div>
                <div className="detail-item4">
                  <p className="detail-label">Message</p>
                  <p className="detail-value">I am feeling very stressed</p>
                </div>
              </div>

              <div className="detail-item5">
                <div className="btn-and-checkbox" onClick={handleChange}>
                  <p className="view-patient-p">View Patient</p>
                </div>
                <div className="checkbox">
                  <input type="checkbox" name="checkbox" id="check-box" />
                </div>
              </div>
              {/* <div className="detail-item">
                <p className="detail-label">Mobile Number</p>
                <p className="detail-value">4654654464</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Email</p>
                <p className="detail-value">tina@gmail.com</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Appointment Date</p>
                <p className="detail-value">2022-11-11</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Appointment Time</p>
                <p className="detail-value">13:00:00</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Apply Date</p>
                <p className="detail-value">2022-11-10 17:38:51</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Appointment Final Status</p>
                <p className="detail-value">
                  Your appointment has been approved
                </p>
              </div> */}
            </div>
          </div>

          <div className="appointment-card">
            <div className="pacient-info">
              <div className="appointment-details">
                <div className="detail-item1">
                  <p className="detail-label">Sr. No.</p>
                  <p className="detail-value">6</p>
                </div>
                <div className="detail-item2">
                  <p className="detail-label">Appointment Number</p>
                  <p className="detail-value">126</p>
                </div>
                <div className="detail-item3">
                  <p className="detail-label">Patient Name</p>
                  <p className="detail-value">John Doe</p>
                </div>
                <div className="detail-item4">
                  <p className="detail-label">Message</p>
                  <p className="detail-value">I am feeling very stressed</p>
                </div>
              </div>

              <div className="detail-item5">
                <div className="btn-and-checkbox" onClick={handleChange}>
                  <p className="view-patient-p">View Patient</p>
                </div>
                <div className="checkbox">
                  <input type="checkbox" name="checkbox" id="check-box" />
                </div>
              </div>
              {/* <div className="detail-item">
                <p className="detail-label">Mobile Number</p>
                <p className="detail-value">4654654464</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Email</p>
                <p className="detail-value">tina@gmail.com</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Appointment Date</p>
                <p className="detail-value">2022-11-11</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Appointment Time</p>
                <p className="detail-value">13:00:00</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Apply Date</p>
                <p className="detail-value">2022-11-10 17:38:51</p>
              </div> */}
              {/* <div className="detail-item">
                <p className="detail-label">Appointment Final Status</p>
                <p className="detail-value">
                  Your appointment has been approved
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorAppointment;
