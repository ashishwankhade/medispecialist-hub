import React, { useEffect, useState } from "react";
import "./DoctorList.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import noDoctorImage from "../Admin/image/no-dp.jpg";

const DoctorList = () => {
  const navigate = useNavigate();

  const handleCounsellorView = (drdata) => {
    navigate("viewCounsellorDetail", { state: { drdata } });
  };

  const handleUpdateCounselor = (drData) => {
    navigate("updateCounsellor", { state: { drData } });
  };

  const [Doctors, setDoctors] = useState([]);

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_API_KEY;

    axios
      .get(`${BASE_URL}/api/admin/get-all-doctors`)
      .then((users) => {
        setDoctors(users.data.doctors);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="counsellorsListDiv">
      <h1 className="counsellors-h1">Our Doctors</h1>

      <div className="counsellorsDiv-Body">
        {Doctors !== 0 &&
          Doctors.map((drData) => {
            return (
              <div className="counsellorCard" key={drData._id}>
                <div className="counsellorImage">
                  <img
                    className="counsellor-img"
                    src={
                      drData.doctorImage
                        ? drData.doctorImage.url
                        : noDoctorImage
                    }
                    alt="Doctor"
                  />
                </div>
                <div className="counsellorDetails">
                  <h1 className="counsellorName">{drData.doctorName}</h1>
                  <p className="counsellorEmail">Email: {drData.doctorEmailId}</p>
                  <p className="counsellorMobile">Mobile: {drData.doctorMobileNo}</p>
                  <p className="counsellorSpecialisation">
                    Specialization: {drData.doctorSpecialisation}
                  </p>
                  <p className="counsellorExperience">
                    Experience: {drData.experience}
                  </p>

                  <div className="buttonGroup">
                    <button
                      className="viewDetailButton"
                      onClick={() => handleCounsellorView(drData)}
                    >
                      View Details
                    </button>
                    <button
                      className="updateProfileButton"
                      onClick={() => handleUpdateCounselor(drData)}
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DoctorList;
