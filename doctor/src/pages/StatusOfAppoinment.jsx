import "./StatusOfAppointment.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getOnlineTestTransaction,
  clearOnlineErrors,
  clearAllOnlineTestMessages,
  resetOnlineTestTransactionSlice,
  updateCounsellorRemarks,
} from "@/store/slices/onlineTestTransactionSlice";
// import Logo from "../components/image/logo_hospital.png";

const StatusOfAppointment = () => {
  const [selectedTests, setSelectedTests] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [appointmentStatus, setAppointmentStatus] = useState({
    isAppointmentCancelled: false,
    isAppointmentClosed: false,
    isAppointmentRescheduled: false,
  });


  const dispatch = useDispatch();
  const { id } = useParams();
  const navigateTo = useNavigate();








  const handleUpdateAppointment = (e) => {
    e.preventDefault();

    for (const testId of selectedTests) {
      const consularRemark = remarks[testId] || "";
      dispatch(updateCounsellorRemarks(testId, consularRemark));
    }
  };

  const BASE_URL = import.meta.env.VITE_API_KEY;
  console.log(import.meta.env.VITE_API_KEY);

  useEffect(() => {
    const getAppointment = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/doctor/appointment/${id}`, {
          withCredentials: true,
        });
        console.log(res,"this is response");
        setAppointmentStatus({
            isAppointmentCancelled:
            res.data.appointment.isAppointmentCancelled || false,
            isAppointmentClosed: res.data.appointment.isAppointmentClosed || false,
            isAppointmentRescheduled:
            res.data.appointment.isAppointmentRescheduled || false,
          });
        console.log(res,"This is response");
        // Set appointment details here
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    getAppointment();
  }, [id, BASE_URL]);

  const handleReturnToDashboard = () => {
    navigateTo("/");
  };

  return (
    <div className="diagnosysFormDiv">
      <div className="DiagnosisFormDiv">
        <form onSubmit={handleUpdateAppointment} className="DiagnosisForm">
          <div className="formBody">
            <div className="FormBodyDiv1">
              <div className="FormBodyDiv11">
                <h2 className="FormBodyDiv11-header">
                Overview of all appointment statuses
                </h2>
                <button
                  onClick={handleReturnToDashboard}
                  className="FormBodyDiv11-returnButton"
                >
                  Return to Dashboard
                </button>
              </div>
              <div className="appointmentStatus">
                <p>
                  Appointment Cancelled:{" "}
                  {appointmentStatus.isAppointmentCancelled ? "Yes" : "No"}
                </p>
                {/* <p>
                  Appointment Closed:{" "}
                  {appointmentStatus.isAppointmentClosed ? "Yes" : "No"}
                </p> */}
                <p>
                  Appointment Rescheduled:{" "}
                  {appointmentStatus.isAppointmentRescheduled ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusOfAppointment;
