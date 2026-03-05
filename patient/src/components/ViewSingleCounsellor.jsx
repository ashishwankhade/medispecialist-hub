import React from "react";
import "./ViewSingleCounsellor.css";
import { useLocation, useNavigate } from "react-router-dom";
// import defaultImage from "../components/image/no-dp.jpg";
import logo from "../components/image/logo_hospital.png";

const ViewSingleCounsellor = () => {
  const navigate = useNavigate();

  const handleReturnToDoctorList = () => {
    navigate("/booking");
  };

  const location = useLocation();
  const { drData } = location.state;

  return (
    <>
    <div className="dummydiv">
        <div className="RanaHospitalNav">
          <img className="RanaHospital-logo" src={logo} alt="Rana Logo" />
          <h1 className="RanaHospital-h1">Rana Hospital</h1>
        </div>
      </div>
    <div className="viewCounselor">
      <div className="viewCounselor-form-container">
        <div className="viewCounselor-image-container">
          <img
            src={drData.doctorImage ? drData.doctorImage.url : defaultImage}
            alt="Counselor"
            className="viewCounselor-counselor-image"
          />
        </div>
        <div className="viewCounselor-details-form">
          <div className="viewCounselor-form-row">
            <div className="viewCounselor-form-field">
              <label>Doctor Name</label>
              <input type="text" value={drData.doctorName} readOnly />
            </div>
            <div className="viewCounselor-form-field">
              <label>Doctor Specialization</label>
              <input type="text" value={drData.doctorSpecialisation} readOnly />
            </div>
            <div className="viewCounselor-form-field">
              <label>Doctor Qualification</label>
              <input type="text" value={drData.doctorQualifications} readOnly />
            </div>
          </div>

          <div className="viewCounselor-form-row">
            <div className="viewCounselor-form-field">
              <label>Doctor Experience</label>
              <input type="text" value={drData.experience} readOnly />
            </div>
            <div className="viewCounselor-form-field">
              <label>Doctor Address</label>
              <input type="text" value={drData.doctorAddress} readOnly />
            </div>
          </div>

          <div className="viewCounselor-form-row viewCounselor-label-grid">
            <div className="viewCounselor-form-field">
              <label>Doctor About</label>
              <textarea rows="5" readOnly>
                {drData.about}
              </textarea>
            </div>
          </div>
        </div>
      </div>

      <div className="viewCounselor-returnToDashBoard">
        <button
          className="returnToDashBoard"
          onClick={handleReturnToDoctorList}
        >
          Return to Back
        </button>
      </div>
    </div>
    </>
  );
};

export default ViewSingleCounsellor;
