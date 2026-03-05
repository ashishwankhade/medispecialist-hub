import React, { useState } from "react";
import "./UpdateCounsellorByAdmin.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
// import LogoImage from "../Admin/image/logo_hospital.png";
import noDp from "../Admin/image/no-dp.jpg";
import { toast } from "react-toastify";

const UpdateCounsellorByAdmin = () => {

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();
  const { drData } = location.state;

  const [doctorName, setDoctorName] = useState(drData && drData.doctorName);

  const [doctorSpecialisation, setDoctorSpecialisation] = useState(
    drData && drData.doctorSpecialisation
  );

  const [doctorLocation, setdoctorLocation] = useState(
    drData && drData.doctorLocation
  );
  const [doctorAddress, setDoctorAddress] = useState(
    drData && drData.doctorAddress
  );
  const [doctorEmailId, setDoctorEmailId] = useState(
    drData && drData.doctorEmailId
  );
  const [doctorMobileNo, setDoctorMobileNo] = useState(
    drData && drData.doctorMobileNo
  );
  const [doctorWhatsappNo, setDoctorWhatsappNo] = useState(
    drData && drData.doctorWhatsappNo
  );
  const [doctorQualifications, setDoctorQualifications] = useState(
    drData && drData.doctorQualifications
  );
  const [experience, setDoctorExperience] = useState(
    drData && drData.experience
  );
  const [about, setDoctorAbout] = useState(drData && drData.about);
  const [doctorImage, setDoctorImage] = useState(
    drData && drData.doctorImage && drData.doctorImage.url
  );

  const [doctorMeetLink, setDoctorMeetLink] = useState(
    drData && drData.doctorMeetLink
  );

  const [doctorFees, setDoctorFees] = useState(
    drData && drData.doctorFees
  );

  const [avatarPreview, setAvatarPreview] = useState(
    drData.doctorImage ? drData.doctorImage.url : noDp
  );

  const avatarHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setDoctorImage(file);
    };
  };

  const handleUpdateProfile = async () => {
    setIsButtonDisabled(true); // Disable the button on click
    setShowSuccess(false); // Hide success message initially

    const formData = new FormData();
    formData.append("doctorName", doctorName);
    formData.append("doctorSpecialisation", doctorSpecialisation);
    formData.append("doctorLocation", doctorLocation);
    formData.append("doctorAddress", doctorAddress);
    formData.append("doctorEmailId", doctorEmailId);
    formData.append("doctorMobileNo", doctorMobileNo);
    formData.append("doctorWhatsappNo", doctorWhatsappNo);
    formData.append("doctorQualifications", doctorQualifications);
    formData.append("experience", experience);
    formData.append("doctorMeetLink", doctorMeetLink);
    formData.append("about", about);
    formData.append("doctorImage", doctorImage);
    formData.append("doctorFees", doctorFees);


    // .env
    const BASE_URL = import.meta.env.VITE_API_KEY;
    // console.log("this is API KEy ", BASE_URL);
    // console.log(formData);

    try {
      const response = await axios.put(
        `${BASE_URL}/api/admin/profile-update`,
        formData,
        { withCredentials: true },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setShowSuccess(true); // Show success message

      // Display success message
      toast.success(response.data.message);
      navigate("/dashboard/doctor-list");

      // Process response data if needed
      // console.log("Response:", response);
    } catch (error) {
      // Display error message
      toast.error(error.response.data.message);
      // console.error("Error:", error);
    } finally {
      setIsButtonDisabled(false); // Re-enable button after the operation
    }
  };

  return (
    <div className="updateDoctor-form">
      <div className="viewCounselor">
        {/* <img
          src={LogoImage}
          alt="View Counsellor Logo"
          className="viewCounsellorLogo"
        /> */}
        <h1 className="ViewCounsellor-title">Update Profile</h1>
        <div className="viewCounselor-form-container">
          <form
            className="viewCounselor-details-form"
            onSubmit={handleUpdateProfile}
          >
            <div className="viewCounselor-image-container">
              <label className="upload_image_counsellor">
                Upload New Image
              </label>
              <img
                src={avatarPreview ? avatarPreview : "./no-dp.jpg"}
                alt="avatar"
                className="viewCounselor-counselor-image"
              />
              <input type="file" onChange={avatarHandler} className="" />
            </div>
            <div className="viewCounselor-form-row">
              <div className="viewCounselor-form-field">
                <label>Counsellor Name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  required
                />
              </div>
              <div className="viewCounselor-form-field">
                <label>Counsellor Email</label>
                <input
                  type="email"
                  value={doctorEmailId}
                  readOnly
                  onChange={(e) => setDoctorEmailId(e.target.value)}
                />
              </div>
              <div className="viewCounselor-form-field">
                <label>Counsellor Mobile Number</label>
                <input
                  type="tel"
                  value={doctorMobileNo}
                  onChange={(e) => setDoctorMobileNo(e.target.value)}
                />
              </div>
            </div>

            {/* Repeat rows for additional fields as needed */}

            <div className="viewCounselor-form-row">
              <div className="viewCounselor-form-field">
                <label>Counsellor Whatsapp Number</label>
                <input
                  type="tel"
                  value={doctorWhatsappNo}
                  onChange={(e) => setDoctorWhatsappNo(e.target.value)}
                />
              </div>
              <div className="viewCounselor-form-field">
                <label>Counsellor Specialization</label>
                <input
                  type="text"
                  value={doctorSpecialisation}
                  onChange={(e) => setDoctorSpecialisation(e.target.value)}
                />
              </div>
              <div className="viewCounselor-form-field">
                <label>Counsellor Qualification</label>
                <input
                  type="text"
                  value={doctorQualifications}
                  onChange={(e) => setDoctorQualifications(e.target.value)}
                />
              </div>
            </div>

            <div className="viewCounselor-form-row">
              <div className="viewCounselor-form-field">
                <label>Counsellor Experience</label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setDoctorExperience(e.target.value)}
                />
              </div>
              <div className="viewCounselor-form-field">
                <label>Counsellor Address</label>
                <input
                  type="text"
                  value={doctorAddress}
                  onChange={(e) => setDoctorAddress(e.target.value)}
                />
              </div>

              <div className="viewCounselor-form-field">
                <label>Counsellor Google Meet Link</label>
                <input
                  type="url"
                  value={doctorMeetLink}
                  onChange={(e) => setDoctorMeetLink(e.target.value)}
                />
              </div>
            </div>

            <div className="viewCounselor-form-row">
              <div className="viewCounselor-form-field">
                <label>Counsellor fees</label>
                <input
                  type="text"
                  value={doctorFees}
                  // readOnly
                  onChange={(e) => setDoctorFees(e.target.value)}
                />
              </div>
            </div>

            <div className="viewCounselor-form-row viewCounselor-label-grid">
              <div className="viewCounselor-form-field">
                <label>Counsellor About</label>
                <textarea
                  rows="5"
                  className="viewCounsellorTextArea"
                  value={about}
                  onChange={(e) => setDoctorAbout(e.target.value)}
                ></textarea>
              </div>
            </div>
          </form>

          <div className="viewCounselor-returnToDashBoard">
            <button
              className="returnToDashBoard"
              onClick={handleUpdateProfile}
              disabled={isButtonDisabled}
            >
              Update Profile
            </button>
            {showSuccess && <p>Profile updated successfully!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCounsellorByAdmin;
