import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import Img1 from "./image/no-dp.jpg"
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const formatAppointmentDate = (dateString) => {
    const [day, month, year] = dateString.split("_");
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }

    const BASE_URL = import.meta.env.VITE_API_KEY;

    // Fetch doctors
    axios.get(`${BASE_URL}/api/admin/get-all-doctors`)
      .then((users) => setDoctors(users.data.doctors))
      .catch((err) => console.log(err));

    // Fetch appointments
    axios.get(`${BASE_URL}/api/admin/get-all-appointments`)
      .then((response) => setAppointments(response.data.appointments))
      .catch((err) => console.log(err));
  }, [navigate]);

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="profile-section">
          <img 
            src={Img1}
            alt="Rana Hospital" 
            className="hospital-logo"
          />
          <div className="hospital-info">
            <h1>ENT And Gyneocologist</h1>
            <p>Admin Dashboard</p>
          </div>
        </div>
      </header>

      {/* Stats Cards Section */}
      <div className="stats-container">
        <div 
          className="stat-card appointments"
          onClick={() => navigate("/dashboard/all-appointments")}
        >
          <div className="stat-content">
            <div>
              <h2>{appointments.length < 10 ? `0${appointments.length}` : appointments.length}</h2>
              <p>Total Appointments</p>
            </div>
            <Calendar className="stat-icon" />
          </div>
        </div>

        <div 
          className="stat-card doctors"
          onClick={() => navigate("/dashboard/doctor-list")}
        >
          <div className="stat-content">
            <div>
              <h2>{doctors.length < 10 ? `0${doctors.length}` : doctors.length}</h2>
              <p>Total Doctors</p>
            </div>
            <Users className="stat-icon" />
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-content">
            <div>
              <h2>00</h2>
              <p>Completed Appointments</p>
            </div>
            <Activity className="stat-icon" />
          </div>
        </div>
      </div>

      {/* Latest Appointments Section */}
      <div className="appointments-section">
        <div className="appointments-header">
          <h2>Latest Appointments</h2>
          <Clock className="header-icon" />
        </div>

        {appointments.length === 0 ? (
          <p className="no-appointments">No appointments found.</p>
        ) : (
          <div className="table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Appt. Number</th>
                  <th>Patient Name</th>
                  <th>Doctor</th>
                  <th className="hide-mobile">Date</th>
                  <th className="hide-tablet">Time</th>
                  <th className="hide-tablet">Mode</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 10).map((appointment, index) => (
                  <tr key={appointment._id}>
                    <td>{index + 1}</td>
                    <td>{appointment.appointmentNumber < 10 ? `0${appointment.appointmentNumber}` : appointment.appointmentNumber}</td>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.doctorData.doctorName}</td>
                    <td className="hide-mobile">{formatAppointmentDate(appointment.appointmentDate)}</td>
                    <td className="hide-tablet">{appointment.appointmentTime}</td>
                    <td className="hide-tablet">{appointment.isOnlineOrOffline}</td>
                    <td>
                      <button
                        className="view-button"
                        onClick={() => navigate("/dashboard/all-appointments")}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;