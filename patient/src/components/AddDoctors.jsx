// src/components/AddDoctor.jsx
import React, { useState } from "react";
import "./AddDoctor.css";

const AddDoctors = () => {
  const [doctor, setDoctor] = useState({
    doctorName: "",
    doctorSpecialisation: "",
    doctorMobileNo: "",
    doctorEmailId: "",
    password: "",
    availability: "",
    doctorFees: "",
  });

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_KEY}/api/admin/add-doctor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctor),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Doctor added successfully!");
        setDoctor({
          doctorName: "",
          doctorSpecialisation: "",
          doctorMobileNo: "",
          doctorEmailId: "",
          password: "",
          availability: "",
          doctorFees: "",
        });
      } else {
        alert("Error: " + data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Failed to add doctor:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="add-doctor-container">
      <h2>Add Doctor</h2>
      <form onSubmit={handleSubmit} className="add-doctor-form">
        <div className="form-group">
          <label htmlFor="doctorName">Doctor Name</label>
          <input
            type="text"
            id="doctorName"
            name="doctorName"
            value={doctor.doctorName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="doctorSpecialisation">Specialization</label>
          <input
            type="text"
            id="doctorSpecialisation"
            name="doctorSpecialisation"
            value={doctor.doctorSpecialisation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="doctorMobileNo">Contact Number</label>
          <input
            type="text"
            id="doctorMobileNo"
            name="doctorMobileNo"
            value={doctor.doctorMobileNo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="doctorEmailId">Email</label>
          <input
            type="email"
            id="doctorEmailId"
            name="doctorEmailId"
            value={doctor.doctorEmailId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={doctor.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="availability">Availability (e.g., 9am - 5pm)</label>
          <input
            type="text"
            id="availability"
            name="availability"
            value={doctor.availability}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="doctorFees">Consultation Fees (₹)</label>
          <input
            type="number"
            id="doctorFees"
            name="doctorFees"
            value={doctor.doctorFees}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Add Doctor
        </button>
      </form>
    </div>
  );
};

export default AddDoctors;
