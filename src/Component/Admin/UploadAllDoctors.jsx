import axios from "axios";
import React, { useState } from "react";
import "./AddDoctor.css";
import { toast } from "react-toastify";

const UploadAllDoctors = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(file);

    const formData = new FormData();
    formData.append("excelFile", file);
    console.log("Form Data", formData);


    const BASE_URL = import.meta.env.VITE_API_KEY;

    try {
      const response = await axios.post(
          `${BASE_URL}/api/admin/upload-all-doctor`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      setMessage("File uploaded successfully");
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      setMessage("File upload failed");
    }
  };

  return (
    // <h1 className="counsellors-h1">Our Counsellors</h1>
    <div className="uploadDoctorMainDiv">
      <h1 className="uploadDoctorTitle">Upload Counsellor</h1>
      <div className="uploadDoctor-container">
        <form onSubmit={handleSubmit} className="uploadDoctor-form">
          <input
            type="file"
            onChange={handleFileChange}
            className="uploadDoctor-input"
          />
          <button type="submit" className="uploadDoctorBtn">
            Upload Counsellor
          </button>
          {message && <p className="uploadDoctor-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default UploadAllDoctors;
