import React from "react";
import { useSelector } from "react-redux";
import "./Profile.css"

const Profile = () => {
  const { doctor } = useSelector((state) => state.doctor);

  return (
    <div className="CounsellorPage-profileContainer">
      <div className="CounsellorPage-profileHeader">
        <h2 className="CounsellorPage-profileTitle">Profile Details</h2>
        <p className="CounsellorPage-profileSubtitle">View your profile information</p>
      </div>

      <div className="CounsellorPage-profileGrid">
        <div className="CounsellorPage-imageSection">
          <div className="CounsellorPage-imageWrapper">
            <img
              src={doctor?.doctorImage?.url || "/placeholder-avatar.png"}
              alt="Profile"
              className="CounsellorPage-profileImage"
            />
          </div>
          <h3 className="CounsellorPage-doctorName">{doctor?.doctorName}</h3>
          <p className="CounsellorPage-doctorSpecialization">{doctor?.doctorSpecialisation}</p>
        </div>

        <div className="CounsellorPage-infoSection">
          <div className="CounsellorPage-infoGrid">
            <div className="CounsellorPage-infoCard">
              <label>Email</label>
              <p>{doctor?.doctorEmailId}</p>
            </div>

            <div className="CounsellorPage-infoCard">
              <label>Phone Number</label>
              <p>{doctor?.doctorMobileNo}</p>
            </div>

            <div className="CounsellorPage-infoCard">
              <label>WhatsApp</label>
              <p>{doctor?.doctorWhatsappNo}</p>
            </div>

            <div className="CounsellorPage-infoCard">
              <label>Location</label>
              <p>{doctor?.doctorLocation}</p>
            </div>

            <div className="CounsellorPage-infoCard">
              <label>Address</label>
              <p>{doctor?.doctorAddress}</p>
            </div>

            <div className="CounsellorPage-infoCard">
              <label>Google Meet Link</label>
              <p>{doctor?.doctorMeetLink}</p>
            </div>
          </div>

          <div className="CounsellorPage-detailsSection">
            <div className="CounsellorPage-detailCard">
              <label>Qualifications</label>
              <div className="CounsellorPage-detailContent">
                {doctor?.doctorQualifications}
              </div>
            </div>

            <div className="CounsellorPage-detailCard">
              <label>Experience</label>
              <div className="CounsellorPage-detailContent">
                {doctor?.experience}
              </div>
            </div>

            <div className="CounsellorPage-detailCard">
              <label>About Me</label>
              <div className="CounsellorPage-detailContent">
                {doctor?.about}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;