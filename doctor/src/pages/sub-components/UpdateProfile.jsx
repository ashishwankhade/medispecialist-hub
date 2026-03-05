import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  clearAlldoctorErrors,

  // getdoctor,
  resetProfile,
  updateProfile,
} from "@/store/slices/doctorSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import SpecialLoadingButton from "./SpecialLoadingButton";
import { Link } from "react-router-dom";
import { clearAllappointmentsErrors } from "@/store/slices/appointmentSlice";
import "./Updateprofile.css";
const UpdateProfile = () => {
  const { doctor, loading, error, isUpdated, message } = useSelector(
    (state) => state.doctor
  );

  const [doctorName, setDoctorName] = useState(doctor && doctor.doctorName);

  const [doctorSpecialisation, setDoctorSpecialisation] = useState(
    doctor && doctor.doctorSpecialisation
  );

  const [doctorLocation, setdoctorLocation] = useState(
    doctor && doctor.doctorLocation
  );
  const [doctorAddress, setDoctorAddress] = useState(
    doctor && doctor.doctorAddress
  );
  const [doctorEmailId, setDoctorEmailId] = useState(
    doctor && doctor.doctorEmailId
  );
  const [doctorMobileNo, setDoctorMobileNo] = useState(
    doctor && doctor.doctorMobileNo
  );
  const [doctorWhatsappNo, setDoctorWhatsappNo] = useState(
    doctor && doctor.doctorWhatsappNo
  );
  const [doctorQualifications, setDoctorQualifications] = useState(
    doctor && doctor.doctorQualifications
  );
  const [doctorMeetLink, setDoctorMeetLink] = useState(
    doctor && doctor.doctorMeetLink
  );
  const [experience, setDoctorExperience] = useState(
    doctor && doctor.experience
  );
  const [about, setDoctorAbout] = useState(doctor && doctor.about);
  // const [portfolioURL, setPortfolioURL] = useState(doctor && doctor.portfolioURL);

  // const [linkedInURL, setLinkedInURL] = useState(
  //   doctor && (doctor.linkedInURL === "undefined" ? "" : doctor.linkedInURL)
  // );

  const [doctorImage, setDoctorImage] = useState(
    doctor && doctor.doctorImage && doctor.doctorImage.url
  );

  const [avatarPreview, setAvatarPreview] = useState(
    doctor && doctor.doctorImage && doctor.doctorImage.url
  );

  const dispatch = useDispatch();

  const avatarHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setDoctorImage(file);
    };
  };

  const handleUpdateProfile = () => {
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
    dispatch(updateProfile(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAlldoctorErrors());
    }
    if (isUpdated) {
      // dispatch(getdoctor());
      dispatch(resetProfile());
    }
    if (message) {
      toast.success(message);
    }
    // dispatch(clearAllappointmentsErrors())
  }, [dispatch, loading, error, isUpdated]);

  return (
    <div className="updateProfileCounsellor-container">
      <div className="updateProfileCounsellor-mainCard">
        <div className="updateProfileCounsellor-header">
          <h1 className="updateProfileCounsellor-title">Update Profile</h1>
          <p className="updateProfileCounsellor-subtitle">Manage your personal information and credentials</p>
        </div>

        <div className="updateProfileCounsellor-content">
          <aside className="updateProfileCounsellor-sidebar">
            <div className="updateProfileCounsellor-avatarSection">
              <div className="updateProfileCounsellor-avatarWrapper">
                <img
                  src={avatarPreview ? avatarPreview : "/avatarHolder.jpg"}
                  alt="Profile"
                  className="updateProfileCounsellor-avatar"
                />
              </div>
              <label className="updateProfileCounsellor-uploadLabel">Profile Photo</label>
              <label className="updateProfileCounsellor-uploadButton">
                Upload New Photo
                <input
                  type="file"
                  onChange={avatarHandler}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </aside>

          <main className="updateProfileCounsellor-formSection">
            <div className="updateProfileCounsellor-formCard">
              <h2 className="updateProfileCounsellor-formTitle">Personal Information</h2>
              <div className="updateProfileCounsellor-formGrid">
                <div className="updateProfileCounsellor-inputGroup">
                  <label className="updateProfileCounsellor-label">Full Name</label>
                  <input
                    type="text"
                    className="updateProfileCounsellor-input"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                  />
                </div>
                <div className="updateProfileCounsellor-inputGroup">
                  <label className="updateProfileCounsellor-label">Specialisation</label>
                  <input
                    type="text"
                    className="updateProfileCounsellor-input"
                    value={doctorSpecialisation}
                    onChange={(e) => setDoctorSpecialisation(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="updateProfileCounsellor-formCard">
              <h2 className="updateProfileCounsellor-formTitle">Contact Information</h2>
              <div className="updateProfileCounsellor-formGrid">
                <div className="updateProfileCounsellor-inputGroup">
                  <label className="updateProfileCounsellor-label">Email</label>
                  <input
                    type="email"
                    className="updateProfileCounsellor-input"
                    value={doctorEmailId}
                    readOnly
                    onChange={(e) => setDoctorEmailId(e.target.value)}
                  />
                </div>
                <div className="updateProfileCounsellor-inputGroup">
                  <label className="updateProfileCounsellor-label">Mobile Number</label>
                  <input
                    type="text"
                    className="updateProfileCounsellor-input"
                    value={doctorMobileNo}
                    onChange={(e) => setDoctorMobileNo(e.target.value)}
                  />
                </div>
                <div className="updateProfileCounsellor-inputGroup">
                  <label className="updateProfileCounsellor-label">WhatsApp Number</label>
                  <input
                    type="text"
                    className="updateProfileCounsellor-input"
                    value={doctorWhatsappNo}
                    onChange={(e) => setDoctorWhatsappNo(e.target.value)}
                  />
                </div>
                <div className="updateProfileCounsellor-inputGroup">
                  <label className="updateProfileCounsellor-label">Google Meet Link</label>
                  <input
                    type="text"
                    className="updateProfileCounsellor-input"
                    value={doctorMeetLink}
                    onChange={(e) => setDoctorMeetLink(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="updateProfileCounsellor-formCard">
              <h2 className="updateProfileCounsellor-formTitle">Location</h2>
              <div className="updateProfileCounsellor-formGrid">
                <div className="updateProfileCounsellor-inputGroup">
                  <label className="updateProfileCounsellor-label">Location</label>
                  <input
                    type="text"
                    className="updateProfileCounsellor-input"
                    value={doctorLocation}
                    onChange={(e) => setdoctorLocation(e.target.value)}
                  />
                </div>
                <div className="updateProfileCounsellor-inputGroup">
                  <label className="updateProfileCounsellor-label">Address</label>
                  <input
                    type="text"
                    className="updateProfileCounsellor-input"
                    value={doctorAddress}
                    onChange={(e) => setDoctorAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="updateProfileCounsellor-formCard">
              <h2 className="updateProfileCounsellor-formTitle">Professional Details</h2>
              <div className="updateProfileCounsellor-inputGroup">
                <label className="updateProfileCounsellor-label">Qualifications</label>
                <textarea
                  className="updateProfileCounsellor-textarea"
                  value={doctorQualifications}
                  onChange={(e) => setDoctorQualifications(e.target.value)}
                />
              </div>
              <div className="updateProfileCounsellor-inputGroup">
                <label className="updateProfileCounsellor-label">Experience</label>
                <textarea
                  className="updateProfileCounsellor-textarea"
                  value={experience}
                  onChange={(e) => setDoctorExperience(e.target.value)}
                />
              </div>
              <div className="updateProfileCounsellor-inputGroup">
                <label className="updateProfileCounsellor-label">About</label>
                <textarea
                  className="updateProfileCounsellor-textarea"
                  value={about}
                  onChange={(e) => setDoctorAbout(e.target.value)}
                />
              </div>
            </div>

            {!loading ? (
              <button
                onClick={handleUpdateProfile}
                className="updateProfileCounsellor-submitBtn"
              >
                Save Changes
              </button>
            ) : (
              <SpecialLoadingButton content={"Updating..."} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;




