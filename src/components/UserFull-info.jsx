import React from "react";
import "./Userfull-info.css";

const UserFullInfo = () => {
  return (
    <div className="userFullInfo">
      <div className="patient-full-info-body">
        <h1 className="p-detail">Patient Detail</h1>
        <div className="info-body">
          <div className="info-body-subDiv">
            <div className="UF-name-div">
              <label htmlFor="name" className="UF-name">
                Name
              </label>
              <div className="auto-dr-name"></div>
            </div>

            <div className="UF-name-div">
              <label htmlFor="email" className="UF-name">
                Email
              </label>
              <div className="auto-dr-name"></div>
            </div>
            <div className="UF-name-div">
              <label htmlFor="number" className="UF-name">
                Appointment No.
              </label>
              <div className="auto-dr-name"></div>
            </div>
            <div className="UF-name-div">
              <label htmlFor="phone" className="UF-name">
                Contact
              </label>
              <div className="auto-dr-name"></div>
            </div>
            <div className="UF-name-div">
              <label htmlFor="text" className="UF-address-label">
                Address
              </label>
              <div className="auto-dr-name"></div>
            </div>
            <div className="UF-name-div">
              <label htmlFor="datetime" className="UF-DandT">
                Date & Time
              </label>
              <div className="auto-dr-name"></div>
            </div>
          </div>
          <div className="UF-name-div">
            <label htmlFor="name" className="UF-label-message">
              Message
            </label>
            <div className="auto-dr-name"></div>
          </div>

          <div className="diagnosticForm">
            <div class="form-container">
              <h2 className="PDF-h1">Patient Diagnostic Form</h2>
              <form>
                {/* <!-- Personal Information --> */}
                <div class="form-group">
                  <label for="fullName">Full Name</label>
                  <input type="text" id="fullName" name="fullName" required />
                </div>
                <div class="form-group">
                  <label for="dob">Date of Birth</label>
                  <input type="date" id="dob" name="dob" required />
                </div>
                <div class="form-group">
                  <label for="gender">Gender</label>
                  <select id="gender" name="gender" required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="contactNumber">Contact Number</label>
                  <input
                    type="text"
                    id="contactNumber"
                    name="contactNumber"
                    pattern="[0-9]{10}"
                    title="Enter a valid 10-digit phone number"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>

                {/* <!-- Medical History --> */}
                <h3 className="Medical-info">Medical Details</h3>
                <div class="form-group">
                  <label for="existingConditions">
                    Existing Medical Conditions
                  </label>
                  <textarea
                    id="existingConditions"
                    name="existingConditions"
                    rows="4"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="medications">Current Medications</label>
                  <textarea
                    id="medications"
                    name="medications"
                    rows="4"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="allergies">Allergies</label>
                  <textarea id="allergies" name="allergies" rows="4"></textarea>
                </div>

                {/* <!-- Symptoms --> */}
                <h3 className="symptoms-details">Symptoms</h3>
                <div class="form-group">
                  <label for="symptoms">Describe Your Symptoms</label>
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="symptomsDuration">
                    How long have you been experiencing these symptoms?
                  </label>
                  <input
                    type="text"
                    id="symptomsDuration"
                    name="symptomsDuration"
                    required
                  />
                </div>

                {/* <!-- Lifestyle and Habits */}
                <h3 className="landH-details">Lifestyle and Habits</h3>
                <div class="form-group">
                  <label for="smoking">Do you smoke?</label>
                  <select id="smoking" name="smoking" required>
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="occasionally">Occasionally</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="alcohol">Do you consume alcohol?</label>
                  <select id="alcohol" name="alcohol" required>
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="occasionally">Occasionally</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="exercise">How often do you exercise?</label>
                  <select id="exercise" name="exercise" required>
                    <option value="">Select</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                  </select>
                </div>

                {/* Contact Information */}
                <div class="form-group">
                  <label for="emergencyContact">Emergency Contact Name</label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="emergencyContactNumber">
                    Emergency Contact Number
                  </label>
                  <input
                    type="text"
                    id="emergencyContactNumber"
                    name="emergencyContactNumber"
                    pattern="[0-9]{10}"
                    title="Enter a valid 10-digit phone number"
                    required
                  />
                </div>

                {/* Form Actions */}
                <div class="submit-and-reset-btn">
                  <button type="submit">Save</button>
                  <button type="reset">Reset</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFullInfo;
