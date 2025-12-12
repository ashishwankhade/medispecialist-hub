import React, { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";
import "./AddDoctor.css";

const AddDoctor = () => {
  const initialDoctorData = {
    doctorImage: null,
    doctorName: "",
    doctorEmailId: "",
    doctorMobileNo: "",
    doctorWhatsappNo: "",
    doctorSpecialisation: "",
    doctorQualifications: "",
    experience: "",
    doctorAddress: "",
    doctorLocation: "",
    password: "",
    doctorMeetLink: "",
    doctorFees: "",
    about: "",
    isOnlineOrOffline: "Online", // Default value
  };

  const [inputData, setInputData] = useState(initialDoctorData);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleData = (name, value) => {
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setInputData((prev) => ({ ...prev, doctorImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(inputData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/api/admin/add-doctor`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add doctor");
      }

      setInputData(initialDoctorData);
      setImagePreview(null);
      toast.success("Doctor added successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addDoctorMainDiv">
      <form className="addDoctor-form" onSubmit={handleSubmit}>
        <div className="addDoctor-header">
          <h2 className="addDoctor-title">Add New Doctor</h2>
        </div>

        <div className="addDoctor-container">
          <div className="addDoctor-imageUpload">
            <p className="addDoctor-label">Upload Doctor Image</p>
            <label htmlFor="doctorImage" className="addDoctor-imageLabel">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="addDoctor-imagePreview"
                />
              ) : (
                <div className="addDoctor-imagePlaceholder">
                  <Upload className="addDoctor-uploadIcon" />
                  <span>Click to upload image</span>
                </div>
              )}
            </label>
            <input
              type="file"
              id="doctorImage"
              className="addDoctor-imageInput"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="addDoctor-formGrid">
            <div className="addDoctor-formField">
              <label className="addDoctor-label">Doctor Name</label>
              <input
                className="addDoctor-input"
                type="text"
                value={inputData.doctorName}
                onChange={(e) => handleData("doctorName", e.target.value)}
                placeholder="Enter doctor's name"
                required
              />
            </div>

            <div className="addDoctor-formField">
              <label className="addDoctor-label">Email</label>
              <input
                className="addDoctor-input"
                type="email"
                value={inputData.doctorEmailId}
                onChange={(e) => handleData("doctorEmailId", e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="addDoctor-formField">
              <label className="addDoctor-label">Mobile Number</label>
              <input
                className="addDoctor-input"
                type="tel"
                value={inputData.doctorMobileNo}
                onChange={(e) => handleData("doctorMobileNo", e.target.value)}
                placeholder="Enter mobile number"
                required
              />
            </div>

            <div className="addDoctor-formField">
              <label className="addDoctor-label">WhatsApp Number</label>
              <input
                className="addDoctor-input"
                type="tel"
                value={inputData.doctorWhatsappNo}
                onChange={(e) => handleData("doctorWhatsappNo", e.target.value)}
                placeholder="Enter WhatsApp number"
                required
              />
            </div>

            <div className="addDoctor-formField">
              <label className="addDoctor-label">Experience</label>
              <select
                className="addDoctor-select"
                value={inputData.experience}
                onChange={(e) => handleData("experience", e.target.value)}
                required
              >
                <option value="">Select Experience</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option
                    key={i + 1}
                    value={`${i + 1} Year${i + 1 > 1 ? "s" : ""}`}
                  >
                    {i + 1} Year{i + 1 > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="addDoctor-formField">
              <label className="addDoctor-label">Consultation Fees</label>
              <input
                className="addDoctor-input"
                type="number"
                value={inputData.doctorFees}
                onChange={(e) => handleData("doctorFees", e.target.value)}
                placeholder="Enter consultation fees"
                required
              />
            </div>

            <div className="addDoctor-formField">
              <label className="addDoctor-label">Specialization</label>
              <input
                className="addDoctor-input"
                type="text"
                value={inputData.doctorSpecialisation}
                onChange={(e) =>
                  handleData("doctorSpecialisation", e.target.value)
                }
                placeholder="Enter specialization"
                required
              />
            </div>

            <div className="addDoctor-formField">
              <label className="addDoctor-label">Qualifications</label>
              <input
                className="addDoctor-input"
                type="text"
                value={inputData.doctorQualifications}
                onChange={(e) =>
                  handleData("doctorQualifications", e.target.value)
                }
                placeholder="e.g. MBBS, MD"
                required
              />
            </div>

            <div className="addDoctor-formField">
              <label className="addDoctor-label">Address</label>
              <input
                className="addDoctor-input"
                type="text"
                value={inputData.doctorAddress}
                onChange={(e) => handleData("doctorAddress", e.target.value)}
                placeholder="Enter complete address"
                required
              />
            </div>

            <div className="addDoctor-formField">
              <label className="addDoctor-label">Location</label>
              <input
                className="addDoctor-input"
                type="text"
                value={inputData.doctorLocation}
                onChange={(e) => handleData("doctorLocation", e.target.value)}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="addDoctor-formField">
              <label className="addDoctor-label">Google Meet Link</label>
              <input
                className="addDoctor-input"
                type="url"
                value={inputData.doctorMeetLink}
                onChange={(e) => handleData("doctorMeetLink", e.target.value)}
                placeholder="Enter Google Meet link"
                required
              />
            </div>

            <div className="addDoctor-formField">
              <label className="addDoctor-label">Password</label>
              <input
                className="addDoctor-input"
                type="password"
                value={inputData.password}
                onChange={(e) => handleData("password", e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="addDoctor-formField">
              <label className="addDoctor-label">Consultation Type</label>
              <select
                className="addDoctor-select"
                value={inputData.isOnlineOrOffline}
                onChange={(e) => handleData("isOnlineOrOffline", e.target.value)}
                required
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>

          <div className="addDoctor-formField addDoctor-textareaField">
            <label className="addDoctor-label">About Doctor</label>
            <textarea
              className="addDoctor-textarea"
              value={inputData.about}
              onChange={(e) => handleData("about", e.target.value)}
              placeholder="Write about the doctor's background and expertise"
              rows={5}
            />
          </div>

          <button type="submit" className="addDoctor-button" disabled={loading}>
            {loading ? "Adding..." : "Add Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;