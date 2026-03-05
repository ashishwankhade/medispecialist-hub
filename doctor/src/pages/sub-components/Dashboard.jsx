import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateAvailability } from "@/store/slices/doctorSlice";
import { clearAllappointmentsErrors } from "@/store/slices/appointmentSlice";
import "./Dashboard.css";

const Dashboard = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const { doctor } = useSelector((state) => state.doctor);
  const { appointments, error: appointmentsError } = useSelector(
    (state) => state.appointments
  );
  const [holidayStart, setHolidayStart] = useState("");
  const [holidayEnd, setHolidayEnd] = useState("");

  useEffect(() => {
    if (appointmentsError) {
      toast.error(appointmentsError);
      dispatch(clearAllappointmentsErrors());
    }
  }, [dispatch, appointmentsError]);

  const handleAvailabilityChange = () => {
    dispatch(updateAvailability(holidayStart, holidayEnd));
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

  return (
    <div className="DoctorHome-dashboard">
      <div className="DoctorHome-overview">
        {/* Profile Section */}
        <div className="DoctorHome-profile">
          <div className="DoctorHome-profileImage">
            <img
              src={doctor?.doctorImage?.url || "/logo_hospital.png"}
              alt={doctor?.doctorName}
            />
          </div>
          <div className="DoctorHome-profileInfo">
            <h2>{doctor?.doctorName}</h2>
            <p>{doctor?.about}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="DoctorHome-statsContainer">
          <div className="DoctorHome-statsCard">
            <div className="DoctorHome-statsIcon">👥</div>
            <div className="DoctorHome-statsContent">
              <h3>Total Appointments</h3>
              <p>{appointments?.length || 0}</p>
            </div>
          </div>

          {/* <div className="DoctorHome-statsCard"></div> */}
        </div>

        {/* Leave Calendar */}
        <div className="DoctorHome-leaveCalendar">
          <h3>Schedule Leave</h3>
          <div className="DoctorHome-dateInputs">
            <div className="DoctorHome-inputGroup">
              <label>Start Date</label>
              <input
                type="date"
                value={holidayStart}
                onChange={(e) => setHolidayStart(e.target.value)}
              />
            </div>
            <div className="DoctorHome-inputGroup">
              <label>End Date</label>
              <input
                type="date"
                value={holidayEnd}
                onChange={(e) => setHolidayEnd(e.target.value)}
              />
            </div>
            <button
              className="DoctorHome-submitLeave"
              onClick={handleAvailabilityChange}
            >
              Submit Leave
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="DoctorHome-appointmentsList">
          <h3>Recent Appointments</h3>
          {appointments && appointments.length > 0 ? (
            <div className="DoctorHome-appointmentsGrid">
              {appointments.map((appointment, index) => (
                <div
                  key={appointment.appointmentNumber}
                  className="DoctorHome-appointmentCard"
                >
                  <div className="DoctorHome-appointmentHeader">
                    <span className="DoctorHome-appointmentNumber">
                      #{appointment.appointmentNumber}
                    </span>
                  </div>
                  <div className="DoctorHome-appointmentDetails">
                    <h4>{appointment.patientName}</h4>
                    <p>{formatAppointmentDate(appointment.appointmentDate)}</p>
                    <p>Time: {appointment.appointmentTime}</p>
                    <p>Gender: {appointment.Sex}</p>
                  </div>
                  <div className="DoctorHome-appointmentActions">
                    <a
                      href={appointment.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="DoctorHome-viewReport"
                    >
                      View Report
                    </a>
                    <Link
                      to={`/update/appointment/${appointment._id}`}
                      className="DoctorHome-diagnosis"
                    >
                      Diagnosis
                    </Link>
                    <Link
                      to={`/status/appointment/${appointment._id}`}
                      className="DoctorHome-status"
                    >
                      Status
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="DoctorHome-noAppointments">
              No appointments scheduled
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
