
import "./ViewSingleAppointment.css";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewSingleAppointment = () => {
  const location = useLocation();
  const { appointments } = location.state;

  // console.log("hfghfdgfh", appointments);

  const navigate = useNavigate();

  const [diagonisisData, setdiagonisisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_KEY;
  // Fetch the online test transactions when the component mounts
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
     const   appointmentId= appointments._id;
        console.log(  appointmentId, "this is appointment id")
        // Replace 'your-backend-url' with your actual backend URL
        const response = await axios.get(
          `${BASE_URL}/api/admin/get-online-test-transactions`,
          {
            params: { appointmentId }, // Pass the appointmentId as a query parameter
          }
        );
        console.log(response," this is going good")
        setdiagonisisData(response.data.diagnoses);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch transactions");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [appointments._id]);

  const handleReturnToDashboardButton = () => {
    navigate("/dashboard/admin-dashboard");
  };

  const formatAppointmentDate = (dateString) => {
    // console.log(dateString,"this is date ")
    const [day, month, year] = dateString.split("_");
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="viewSingleAppointment">
      <h1 className="viewSingleAppointment-title">
        Appointment No : {appointments.appointmentNumber}
      </h1>
      <div className="viewSingleAppointment-form-container">
        <form className="viewSingleAppointment-details-form">
          <div className="viewSingleAppointment-form-row">
            <div className="viewSingleAppointment-form-field">
              <label>Patient Name</label>
              <input type="text" value={appointments.patientName} readOnly />
            </div>
            <div className="viewSingleAppointment-form-field">
              <label>Patient Email</label>
              <input type="text" value={appointments.patientEmailId} readOnly />
            </div>
            <div className="viewSingleAppointment-form-field">
              <label>Patient Mobile Number</label>
              <input type="text" value={appointments.patientMobileNo} readOnly />
            </div>
          </div>


          <div className="viewSingleAppointment-form-row">
            {/* <div className="viewSingleAppointment-form-field">
              <label>Client Whatsapp No.</label>
              <input type="text" value={appointments.patientWhatsappNo} readOnly />
            </div> */}
            {/* <div className="viewSingleAppointment-form-field">
              <label>Client Address</label>
              <input type="text" value={appointments.patientAddress} readOnly />
            </div> */}
            <div className="viewSingleAppointment-form-field">
              <label>Patient Location</label>
              <input type="text" value={appointments.patientLocation} readOnly />
            </div>

            <div className="viewSingleAppointment-form-field">
              <label>Booking Date</label>
              <input type="text" value={formatAppointmentDate(appointments.appointmentDate)} readOnly />
            </div>

            <div className="viewSingleAppointment-form-field">
              <label>Booking Time</label>
              <input type="text" value={appointments.appointmentTime} readOnly />
            </div>
          </div>

          <div className="viewSingleAppointment-form-row">
            <div className="viewSingleAppointment-form-field">
              <label>Order ID</label>
              <input type="text" value={appointments.orderId} readOnly />
            </div>


            <div className="viewSingleAppointment-form-field">
              <label>Payment Status</label>
              <input type="text" value={appointments.paymentStatus} readOnly />
            </div>
          </div>

         
          <div className="viewSingleAppointment-form-row-textArea">
            <div className="viewSingleAppointment-form-field">
              <label>Patient problem Description</label>
              <textarea rows="5" className="viewSingleAppointmentTextArea" readOnly>
                {appointments.patientProblemDesc}
              </textarea>
            </div>
          </div><br />

          <div className="viewSingleAppointment-form-row">
            <div className="viewSingleAppointment-form-field">
              <label>Doctor Name</label>
              <input type="text" value={appointments.doctorData.doctorName} readOnly />
            </div>
            <div className="viewSingleAppointment-form-field">
              <label>Doctor Email</label>
              <input type="text" value={appointments.doctorData.doctorEmailId} readOnly />
            </div>
            <div className="viewSingleAppointment-form-field">
              <label>Doctor Mobile Number</label>
              <input type="text" value={appointments.doctorData.doctorMobileNo} readOnly />
            </div>
          </div>
        </form> 

        <div className="viewSingleAppointment-returnToDashBoard">
          <button
            className="returnToDashBoard"
            onClick={handleReturnToDashboardButton}
          >
            Return to DashBoard
          </button>

          <div className="testReportPdfDiv">

      {/* {loading && <p>Loading...</p>} */}
      {/* {error && <p className="error">{error}</p>} */}
      
      {!loading && !error && diagonisisData.length > 0 && (
        diagonisisData.map((transaction, index) => (
          <a
            key={index} // Use index as key if there's no unique ID available
            className="returnToDashBoard decorationNone"
            href={transaction.reportPdfUrl} 
                target="_blank"
                rel="noopener noreferrer"
            
            // onClick={() => handleReturnToDashboardButton(transaction._id)} // Modify if you want to handle differently for each button
          >
            View Diagnosis Case Record {index + 1}
          </a>
        ))
      )}
    </div>

        </div>
      </div>
    </div>
  );
};

export default ViewSingleAppointment;
