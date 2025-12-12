import React from "react";
import "./viewCounsellor.css";
import { useLocation, useNavigate } from "react-router-dom";
import noDp from "../Admin/image/no-dp.jpg";

const ViewCounsellorDetail = () => {
  const navigate = useNavigate();

  const handleReturnToDashboardButton = () => {
    navigate("/dashboard/admin-dashboard");
  };
  const location = useLocation();
  const { drdata } = location.state;
  console.log("This Is Doctor data", drdata);

  return (
    <div className="viewCounselor">
      {/* <img
        src={viewCounsellorLogo}
        alt="View Counsellor Logo"
        className="viewCounsellorLogo"
      /> */}
      <h1 className="ViewCounsellor-title">About {drdata.doctorName}</h1>
      <div className="viewCounselor-form-container">
        <div className="viewCounselor-image-container">
          <img
            src={drdata.doctorImage ? drdata.doctorImage.url : noDp}
            alt="Counselor"
            className="viewCounselor-counselor-image"
          />
        </div>
        <form className="viewCounselor-details-form">
          <div className="viewCounselor-form-row">
            <div className="viewCounselor-form-field">
              <label>Doctor Name</label>
              <input type="text" value={drdata.doctorName} readOnly />
            </div>
            <div className="viewCounselor-form-field">
              <label>Doctor Email</label>
              <input type="text" value={drdata.doctorEmailId} readOnly />
            </div>
            <div className="viewCounselor-form-field">
              <label>Doctor Mobile Number</label>
              <input type="text" value={drdata.doctorMobileNo} readOnly />
            </div>
          </div>

          {/* Repeat rows for additional fields as needed */}

          <div className="viewCounselor-form-row">
            <div className="viewCounselor-form-field">
              <label>Doctor Whatsapp Number</label>
              <input type="text" value={drdata.doctorWhatsappNo} readOnly />
            </div>
            <div className="viewCounselor-form-field">
              <label>Doctor Specialization</label>
              <input type="text" value={drdata.doctorSpecialisation} readOnly />
            </div>
            <div className="viewCounselor-form-field">
              <label>Doctor Qualification</label>
              <input type="text" value={drdata.doctorQualifications} readOnly />
            </div>
          </div>

          <div className="viewCounselor-form-row">
            <div className="viewCounselor-form-field">
              <label>Doctor Experience</label>
              <input type="text" value={drdata.experience} readOnly />
            </div>
            <div className="viewCounselor-form-field">
              <label>Doctor Address</label>
              <input type="text" value={drdata.doctorAddress} readOnly />
            </div>

            <div className="viewCounselor-form-field">
              <label>Doctor Google Meet Link</label>
              <input type="text" value={drdata.doctorMeetLink} readOnly />
            </div>
          </div>

          <div className="viewCounselor-form-row">
            <div className="viewCounselor-form-field">
              <label>Doctor fees</label>
              <input type="text" value={drdata.doctorFees} readOnly />
            </div>
          </div>

          <div className="viewCounselor-form-row viewCounselor-label-grid">
            <div className="viewCounselor-form-field">
              <label>Doctor About</label>
              <textarea rows="5" className="viewCounsellorTextArea" readOnly>
                {drdata.about}
              </textarea>
            </div>
          </div>
        </form>

        <div className="viewCounselor-returnToDashBoard">
          <button
            className="returnToDashBoard"
            onClick={handleReturnToDashboardButton}
          >
            Return to DashBoard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCounsellorDetail;