import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, UserCheck } from "lucide-react";
import "./GetAllAppointment.css";

const GetAllAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleViewAppointment = (appointments) => {
    navigate("viewSingleAppointment", { state: { appointments } });
  };

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
    const fetchAppointments = async () => {
      const BASE_URL = import.meta.env.VITE_API_KEY;
      try {
        const response = await axios.get(
          `${BASE_URL}/api/admin/get-all-appointments`
        );
        setAppointments(response.data.appointments);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="getAllAppointmentDiv loading">
        Loading appointments...
      </div>
    );
  }

  if (error) {
    return <div className="getAllAppointmentDiv error">Error: {error}</div>;
  }

  const filteredAppointments = appointments.filter((appointment) =>
    (appointment.patientName?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (appointment.doctorData?.doctorName?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="getAllAppointmentDiv">
      <div className="getAllAppointment-header">
        <h1 className="getAllAppointment-h1">All Appointments</h1>
        <div className="getAllAppointment-search">
          <input
            type="text"
            placeholder="Search by patient or doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="appointments-stats">
        <div className="stat-item">
          <User className="stat-icon" />
          <div className="stat-info">
            <span className="stat-number">{appointments.length}</span>
            <span className="stat-label">Total Appointments</span>
          </div>
        </div>
      </div>

      <div className="appointments-grid">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <div className="appointment-card" key={appointment._id}>
              <div className="appointment-card-header">
                <span className="appointment-number">
                  #
                  {appointment.appointmentNumber < 10
                    ? `0${appointment.appointmentNumber}`
                    : appointment.appointmentNumber}
                </span>
              </div>

              <div className="appointment-card-content">
                <div className="appointment-detail">
                  <User className="detail-icon" />
                  <div>
                    <p className="detail-label">Patient</p>
                    <p className="detail-value">{appointment.patientName}</p>
                  </div>
                </div>

                <div className="appointment-detail">
                  <UserCheck className="detail-icon" />
                  <div>
                    <p className="detail-label">Doctor</p>
                    <p className="detail-value">
                      {appointment.doctorData.doctorName}
                    </p>
                  </div>
                </div>

                <div className="appointment-detail">
                  <Calendar className="detail-icon" />
                  <div>
                    <p className="detail-label">Date & Time</p>
                    <p className="detail-value">
                      {formatAppointmentDate(appointment.appointmentDate)}
                      <br />
                      <span className="appointment-time">
                        {appointment.appointmentTime}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="viewBtnContainer">
                <button
                  className="viewBtn"
                  onClick={() => handleViewAppointment(appointment)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-appointments">
            <Calendar className="no-appointments-icon" />
            <p>No appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAllAppointment;
