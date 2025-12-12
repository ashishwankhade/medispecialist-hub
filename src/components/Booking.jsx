import React, { useEffect } from "react";
import logo from "../components/image/logo_hospital.png";
import "./Booking.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Model from "react-modal";
import { jsPDF } from "jspdf";
import axios from "axios";
import "./ConsentComponent.css";
import { toast, useToast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  bookingAppointment,
  clearAllAppointmentMessages,
  clearAppointmentErrors,
  resetAppointmentSlice,
} from "../store/slices/appointmentSlice";

const cipher = import.meta.env.VITE_ENCRYPTION_CIPHER;
const BASE_URL = import.meta.env.VITE_API_KEY;
// import { getSingleDoctorById } from "../store/slices/doctorsSlice";
const Booking = () => {
  const [doctorObjectId, setDoctorObjectId] = useState("");
  const [patientEmailId, setPatientEmailId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientMobileNo, setPatientMobileNo] = useState("");
  const [patientWhatsappNo, setPatientWhatsappNo] = useState("");
  const [patientLocation, setPatientLocation] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [patientProblemDesc, setPatientProblemDesc] = useState("");
  const [patientPinCode, setPatientPinCode] = useState("");
  const [patientMode, setPatientMode] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [consentFormReadSignedAgreed, setConsentFormReadSignedAgreed] =
    useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("FAILED");
  const { loading, error, message } = useSelector(
    (state) => state.appointments
  );
  const [Sex, setSex] = useState("");

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  // console.log(param.id, "params ids");

  const { doctors } = useSelector((state) => state.doctors); // Access singleDoctor from Redux state

  // console.log(doctors, "this is all doctor");

  // Find the doctor with the matching id
  const singleDoctor = doctors.find((dr) => dr._id === param.id);
  // console.log(singleDoctor, "Single doctor")

  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);

      if (isBooking) {
        resetFormFields();
        navigate("/");
      }
      // dispatch(resetAppointmentSlice());
    }
    dispatch(clearAppointmentErrors());
    dispatch(clearAllAppointmentMessages());
  }, [dispatch, error, message]);

  const [doctor, setDoctor] = useState([]);
  const [docInfo, setDocInfo] = useState();
  const [docSlots, setDocSlots] = useState([]);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  useEffect(() => {
    if (singleDoctor) {
      setDoctor(singleDoctor);
      setDocInfo(singleDoctor);
    }
  }, [singleDoctor]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(
      (file) =>
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg"
    );

    setSelectedImages(imageFiles);
  };

  const getAvailableSolts = async () => {
    setDocSlots([]);

    let today = new Date();
    for (let i = 0; i < 15; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let endTime = new Date(currentDate);
      endTime.setHours(18, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        formattedTime = formattedTime.replace("am", "AM").replace("pm", "PM");
        // console.log(formattedTime); // Outputs: "08:30 AM" or "08:30 PM"
        let slotDate = `${currentDate.getDate()}_${
          currentDate.getMonth() + 1
        }_${currentDate.getFullYear()}`;

        const isSlotAvailable =
          docInfo.slots_booked === undefined ||
          !docInfo.slots_booked[slotDate] ||
          !docInfo.slots_booked[slotDate].includes(formattedTime);

        // if (isSlotAvailable) {
        //   const holidayEnd = new Date();
        //   holidayEnd.setDate(new Date(docInfo.holidayEndDate).getDate() + 1);
        //   if (
        //     currentDate > holidayEnd ||
        //     currentDate < new Date(docInfo.holidayStartDate)
        //   ) {
        //     timeSlots.push({
        //       datetime: new Date(currentDate),
        //       time: formattedTime,
        //     });
        //     console.log(new Date(docInfo.holidayEndDate));
        //   }
        // }

        if (isSlotAvailable) {
          const holidayEnd = docInfo.holidayEndDate
            ? new Date(
                new Date(docInfo.holidayEndDate).setDate(
                  new Date(docInfo.holidayEndDate).getDate() + 1
                )
              )
            : null;

          const holidayStart = docInfo.holidayStartDate
            ? new Date(docInfo.holidayStartDate)
            : null;

          if (
            !holidayEnd ||
            currentDate > holidayEnd ||
            !holidayStart ||
            currentDate < holidayStart
          ) {
            timeSlots.push({
              datetime: new Date(currentDate),
              time: formattedTime,
            });
            // console.log(
            //   docInfo.holidayEndDate
            //     ? new Date(docInfo.holidayEndDate)
            //     : "No holiday end date defined"
            // );
          }
        }

        currentDate.setMinutes(currentDate.getMinutes() + 60);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

const convertImagesToPDF = async (images) => {
    const pdf = new jsPDF();
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (i > 0) {
        pdf.addPage();
      }

      const imageUrl = URL.createObjectURL(image);
      
      await new Promise((resolve) => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imgData = canvas.toDataURL('image/jpeg');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          URL.revokeObjectURL(imageUrl);
          resolve();
        };
      });
    }
    
    return pdf;
  };

  const handleBookingAppointment = async (e) => {
    e.preventDefault();
    
    if (!slotTime || !docSlots[slotIndex] || docSlots[slotIndex].length === 0) {
      toast.error("Please select an appointment time slot");
      return;
    }
  
    try {
      const formData = new FormData();
      
      // Add basic form fields
      formData.append("doctorObjectId", param.id);
      formData.append("patientEmailId", patientEmailId);
      formData.append("patientName", patientName);
      formData.append("patientMobileNo", patientMobileNo);
      formData.append("patientLocation", patientLocation);
      formData.append("patientProblemDesc", patientProblemDesc);
      formData.append("Sex", Sex);
  
      // Get and format the appointment date
      const date = docSlots[slotIndex][0].datetime;
      const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
      formData.append("appointmentDate", slotDate);
      formData.append("appointmentTime", slotTime);
      formData.append("consentFormReadSignedAgreed", consentFormReadSignedAgreed);
  
      // Handle image conversion if images are selected
      if (selectedImages.length > 0) {
        try {
          const pdf = await convertImagesToPDF(selectedImages);
          const pdfBlob = pdf.output('blob');
          // Make sure the field name matches what multer expects on the server
          formData.append("reportPdf", pdfBlob, "patient_images.pdf");
        } catch (error) {
          console.error("Error converting images to PDF:", error);
          toast.error("Error processing images. Please try again.");
          return;
        }
      }
  
      // Dispatch booking action with proper error handling
      await dispatch(bookingAppointment(formData)).unwrap()
        .then(() => {
          // Success handling
          toast.success("Appointment booked successfully!");
          resetFormFields();
          setSelectedImages([]);
          setIsBooking(true);
          
          // Update slot booking
          if (!docInfo.slots_booked[slotDate]) {
            docInfo.slots_booked[slotDate] = [];
          }
          docInfo.slots_booked[slotDate].push(slotTime.split(" - ")[0]);
          
          // Refresh available slots
          getAvailableSolts();
        })
        .catch((error) => {
          console.error("Booking error:", error);
          toast.error(error || "Failed to book appointment. Please try again.");
        });
  
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  // Helper function to reset the form fields
  const resetFormFields = () => {
    setPatientEmailId("");
    setPatientName("");
    setPatientMobileNo("");
    setPatientWhatsappNo("");
    setPatientLocation("");
    setPatientAddress("");
    setPatientProblemDesc("");
    setPatientPinCode("");
    setConsentFormReadSignedAgreed(false);
    setSex("");
  };

  useEffect(() => {
    if (docInfo) {
      getAvailableSolts();
      // console.log(docInfo);
    }
  }, [docInfo]);

  useEffect(() => {
    // console.log(Doctors, "this is doctor list");
    console.log("This is docSlots", docSlots);
  }, [docSlots]);

  // console.log(doctor, "this is doctor")

  const [showConsentForm, setShowConsentForm] = useState(false);

  const handleConsentClick = () => {
    setShowConsentForm(true);
  };

  // Function to handle closing the consent form and checking the box
  const handleCloseClick = () => {
    setConsentFormReadSignedAgreed(true); // Set checkbox state to true
    setShowConsentForm(false); // Close the consent form
  };

  return (
    <>
      <div className="BookingSystemPage">
        <div className="dummydiv">
          <div className="RanaHospitalNav">
            <img
              className="RanaHospital-logo"
              src={logo}
              alt="Rana Hospital Logo"
            />
            <h1 className="RanaHospital-h1">Rana Hospital</h1>
          </div>
        </div>

        <div className="appointment-booking">
          <h1 className="Book_an_appointment">Book an appointment</h1>
          <form className="booking-form" onSubmit={handleBookingAppointment}>
            <div className="form-row">
              <div className="form-row-left">
                <label>Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter Client Name"
                  required
                />
              </div>

              <div className="form-row-left">
                <label>Patient Whatsapp/Phone No.</label>
                <input
                  type="tel"
                  value={patientMobileNo}
                  onChange={(e) => setPatientMobileNo(e.target.value)}
                  placeholder="Enter Client Whatsapp/Phone Number."
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-row-right">
                <label>Patient Email</label>
                <input
                  type="email"
                  value={patientEmailId}
                  onChange={(e) => setPatientEmailId(e.target.value)}
                  placeholder="Enter Client Email"
                  required
                />
              </div>

              <div className="form-row-right">
                <label>Patient Location.</label>
                <input
                  type="text"
                  name="location"
                  value={patientLocation}
                  onChange={(e) => setPatientLocation(e.target.value)}
                  placeholder="Enter Client Location"
                  className="booking-address-inp"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="mode-select">
                <label htmlFor="mode">Gender :</label>
                <select
                  name="mode"
                  value={Sex} // assuming you have a state variable for the mode
                  onChange={(e) => setSex(e.target.value)} // update the mode state
                  className="booking-mode-select"
                  required
                >
                  <option className="booking-mode-select-option" value="">
                    Select Gender
                  </option>
                  <option className="booking-mode-select-option" value="Male">
                    Male
                  </option>
                  <option className="booking-mode-select-option" value="Female">
                    Female
                  </option>
                  <option className="booking-mode-select-option" value="Other">
                    Other
                  </option>
                </select>
              </div>
            </div>

            <div className="form-row">
            <div className="form-row-left">
              <label>Upload Medical Reports (Optional)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                multiple
                onChange={handleImageSelect}
                className="file-input"
              />
              {selectedImages.length > 0 && (
                <div className="selected-files">
                  <p>Selected Files: {selectedImages.length}</p>
                  <ul>
                    {selectedImages.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

            <div className="form-row">
              <div className="dr-speciality">
                <label htmlFor="">Doctor Name</label>
                <div className="auto-dr-name">
                  {doctor.doctorName ? doctor.doctorName : ""}
                </div>
              </div>
            </div>

            {/* Booking slots  */}
            <div className="bookSlot-div">
              <p className="availability-p2">Availability</p>
              <div className="date-day">
                {docSlots.length &&
                  docSlots.map((item, index) => (
                    <div
                      onClick={() => setSlotIndex(index)}
                      key={index}
                      className={`'borderDayDAte' ${
                        slotIndex === index
                          ? "borderDayDAte2"
                          : "borderDayDAte3"
                      }`}
                    >
                      {/* <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  
                  <p>{item[0] && item[0].datetime.getDate()}</p> */}

                      <p
                        style={{ color: item.length === 0 ? "red" : "inherit" }}
                      >
                        {item.length > 0
                          ? daysOfWeek[item[0].datetime.getDay()]
                          : "Booked slots"}
                      </p>

                      <p>{item.length > 0 ? item[0].datetime.getDate() : ""}</p>
                    </div>
                  ))}
              </div>

              <div className="slotTime-Div">
                {docSlots.length &&
                  docSlots[slotIndex].map((item, index) => (
                    <p
                      onClick={() => setSlotTime(item.time)}
                      key={index}
                      className={`'condition1' ${
                        item.time === slotTime ? "condition2" : "condition3"
                      }`}
                    >
                      {item.time.toLowerCase()}
                    </p>
                  ))}
              </div>

              {/* <p> 🌟 for these dates appointments are booked... </p> */}
            </div>
            <label>Enter your problem Here</label>
            <input
              type="text"
              placeholder="Enter your problem Here..."
              // rows={4}
              value={patientProblemDesc}
              onChange={(e) => setPatientProblemDesc(e.target.value)}
            ></input>

            <div className="term-condition">
              <input
                type="checkbox"
                id="check-termCondi"
                className="mr-2"
                checked={consentFormReadSignedAgreed} // Bind boolean state to checkbox
                onChange={(e) =>
                  setConsentFormReadSignedAgreed(e.target.checked)
                } // Update state with boolean value
              />
              <div>
                <p className="text-sm">
                  Please read the consent form carefully and accept terms and
                  conditions
                  <span id="termConditn-span" onClick={handleConsentClick}>
                    Read the consent form ...
                  </span>
                </p>
                {showConsentForm && (
                  <div className="overlay">
                    <div className="consentForm">
                      <div className="consentForm-ranaLogoDiv">
                        <img
                          className="consentForm-ranaLogo"
                          src={logo}
                          alt="logo"
                        />
                        <h1 className="consentForm-ranaHeading">
                          Rana Hospital
                        </h1>
                      </div>
                      <div className="consentForm-body">
                        <h1 className="consentForm-h1">Consent Form</h1>
                        <h3 className="consentForm-h3">Patient Information</h3>
                        <br />

                        <ul className="consentForm-ul">
                          <li>
                            Every health condition or disease can not be treated
                            by online consultation.
                          </li>
                          <li>
                            Online consultation has its limitation as it does
                            not allow detailed examination of physical symptoms.
                          </li>
                          <li>
                            In case of any deterioration of health or emergency
                            symptoms you need to visit Hospital physically.
                          </li>
                          <li>
                            For any technical issues or internet connectivity
                            issue, fees will not be refundable.
                          </li>
                          <li>
                            As the online consultation is only as advice not
                            complete treatment, this can not be held valid for
                            medicolegal purpose.
                          </li>
                          <li>
                            If you miss the schedule appointment in the given
                            time slot fees will not be refunded.
                          </li>
                        </ul>
                        <div className="concern-btn-div">
                          <p className="concern-btn" onClick={handleCloseClick}>
                            Accept
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button type="submit" className="book-now-btn" disabled={loading}>
              {loading ? "Booking..." : `BOOK NOW`}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
export default Booking;
