import React, { useEffect } from "react";
import "./Doctors-list.css";
import noDp from "./image/no-dp.jpg";
import logo from "../components/image/logo_hospital.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearAllDoctorsErrors,
  getAllMyDoctors,
  resetAllDoctorSlice,
} from "../store/slices/doctorsSlice";

const DoctorsList = () => {
  const { loading, error, message, doctors } = useSelector(
    (state) => state.doctors
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllMyDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllDoctorsErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAllDoctorSlice());
    }
  }, [loading, error, message, dispatch]);

  const handleViewSingleDoctor = (drData) => {
    navigate("viewSingleCounsellor", { state: { drData } });
  };

  const handleClick = (id) => {
    navigate(`/book-now/${id}`);
  };

  return (
    <div className="doctors-list-page">
      <div className="dummydiv">
        <div className="RanaHospitalNav">
          <img className="RanaHospital-logo" src={logo} alt="" />
          <h1 className="RanaHospital-h1">ENT And Gyneocologist Hospital</h1>
        </div>
      </div>
      <main>
        <h2 className="page-title">Meet Our Doctors</h2>
        <div className="doctors-list">
          {loading ? (
            <p>Loading...</p>
          ) : doctors && doctors.length > 0 ? (
            doctors.map((drData) => (
              <div className="doctor-card" key={drData._id}>
                <div className="image-container">
                  <img
                    className="doctor-img"
                    src={drData.doctorImage ? drData.doctorImage.url : noDp}
                    alt={drData.doctorName}
                  />
                </div>
                <div className="doctor-info">
                  <h3 className="doctor-name">{drData.doctorName}</h3>
                  <p className="doctor-specialisation">
                    {drData.doctorSpecialisation}
                  </p>{" "}
                  <br />
                  <p className="doctor-experience">
                    {drData.experience} years of experience
                  </p>
                </div>
                <div className="action-buttons">
                  <button
                    className="view-profile-btn"
                    onClick={() => handleViewSingleDoctor(drData)}
                  >
                    View Profile
                  </button>
                  <button
                    className="book-appointment-btn"
                    onClick={() => handleClick(drData._id)}
                    disabled={!drData.available}
                  >
                    {drData.available ? "Book Appointment" : "Not Available"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No doctors found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorsList;
