import React, { useEffect, useState } from "react";
// import "../ChangeSchedule/ChangeSchedule.css";
import { getAllMyDoctors } from "../../store/slices/doctorsSlice";
import "./SwitchDoctorNew.css";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  switchAppointment,
  clearAllAppointmentMessages,
  clearAppointmentErrors,
} from "../../store/slices/appointmentSlice";
import { useNavigate } from "react-router-dom";

const SwitchDoctor = () => {
  const { loading, error, message, appointments } = useSelector(
    (state) => state.appointments
  );

  const { doctors } = useSelector((state) => state.doctors);

  const dispatch = useDispatch();
  const [selectedDoctor, setSelectedDoctor] = useState({});
  const [docSlots, setDocSlots] = useState({});
  const [slotIndex, setSlotIndex] = useState({});
  const [slotTime, setSlotTime] = useState({});
  const [reason, setReason] = useState("");
  const [patientMode, setPatientMode] = useState("");

  // const [isSwitching, setIsSwitching] = useState(false);
  const navigate = useNavigate();

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAppointmentErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(clearAllAppointmentMessages());

      // if (isSwitching) {
      //   navigate("/");
      // }
    }
    dispatch(getAllMyDoctors());
  }, [dispatch, error, message]);

  useEffect(() => {
    appointments.forEach((appointment) => {
      fetchAvailableSlots(appointment._id, appointment.doctorObjectId);
    });
  }, [appointments]);

  const fetchAvailableSlots = async (appointmentId, doctorId) => {
    const doctor = doctors.find((doc) => doc._id === doctorId);

    if (doctor) {
      let allSlots = [];
      let today = new Date();

      for (let i = 0; i < 15; i++) {
        let currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        let endTime = new Date(currentDate);
        endTime.setHours(24, 0, 0, 0);

        if (today.getDate() === currentDate.getDate()) {
          currentDate.setHours(
            currentDate.getHours() >= 6 ? currentDate.getHours() + 1 : 6
          );
          currentDate.setMinutes(0);
        } else {
          currentDate.setHours(6);
          currentDate.setMinutes(0);
        }

        let timeSlots = [];
        while (currentDate < endTime) {
          let formattedTime = currentDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          let slotDate = `${currentDate.getDate()}_${
            currentDate.getMonth() + 1
          }_${currentDate.getFullYear()}`;

          const isSlotAvailable =
            !doctor.slots_booked ||
            !doctor.slots_booked[slotDate] ||
            !doctor.slots_booked[slotDate].includes(formattedTime);

          if (isSlotAvailable) {
            const holidayEnd = doctor.holidayEndDate
              ? new Date(
                  new Date(doctor.holidayEndDate).setDate(
                    new Date(doctor.holidayEndDate).getDate() + 1
                  )
                )
              : null;

            const holidayStart = doctor.holidayStartDate
              ? new Date(doctor.holidayStartDate)
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
            }
          }

          currentDate.setMinutes(currentDate.getMinutes() + 60);
        }

        if (timeSlots.length > 0) {
          allSlots.push(timeSlots);
        }
      }

      setDocSlots((prev) => ({
        ...prev,
        [appointmentId]: allSlots,
      }));
    }
  };

  const handleDoctorChange = (event, appointmentId) => {
    const selectedDoctorId = event.target.value;
    const selectedDoctorData = doctors.find(
      (doctor) => doctor._id === selectedDoctorId
    );
    setSelectedDoctor(selectedDoctorData);
    fetchAvailableSlots(appointmentId, selectedDoctorId); // Fetch slots for the selected doctor
  };

  const handleReschedule = (appointmentId) => {
    if (!selectedDoctor || !slotTime || !reason || !patientMode) {
      Swal.fire("Please fill all required fields.", "", "warning");
      return;
    }

    Swal.fire({
      title: "Do you want to Switch this appointment?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        if (slotTime[appointmentId]) {
          const selectedSlot =
            docSlots[appointmentId][slotIndex[appointmentId]][0];
          const selectedDate = selectedSlot.datetime;
          const selectedTime = slotTime[appointmentId];

          const formattedDate = `${selectedDate.getDate()}_${
            selectedDate.getMonth() + 1
          }_${selectedDate.getFullYear()}`;

          const newAppointmentData = {
            selectedDoctorId: selectedDoctor?._id,
            appointmentId,
            reasonForSwitchDoctor: reason,
            newAppointmentDate: formattedDate,
            newAppointmentTime: selectedTime,
            isOnlineOrOffline: patientMode,
          };

          console.log(
            newAppointmentData,
            "this is new appointment data bhushan"
          );
          dispatch(switchAppointment(newAppointmentData)).then((response) => {
            console.log("Response", response);
            if (response) {
              Swal.fire("Counsellor Switch!", "", "success");
              navigate("/");
            } else {
              Swal.fire("Failed to Counsellor Switch", "", "error");
            }
          });
        } else {
          Swal.fire("Please select a new date and time", "", "warning");
        }
      } else if (result.isDenied) {
        Swal.fire("Appointment not Switch", "", "info");
      }
    });
  };

  const formatAppointmentDate = (dateString) => {
    const [day, month, year] = dateString.split("_");
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  console.log(doctors, "this is all doctors");

  // Handler function for textarea change
  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };
  // const truncateAddress = (address, maxLength = 52) => {
  //   if (address.length > maxLength) {
  //     return address.substring(0, maxLength) + "...";
  //   }
  //   return address;
  // };

  return (
    <div className="userReschedule">
      <h1 className="userReschedule-h1">Switch Counsellor</h1>
      <div className="reschedule-userDetail">
        {appointments.map((appointment) => (
          <div className="reschedule-grid" key={appointment.appointmentNumber}>
            <div className="reschedule-doctor-container-above">
              <div className="reschedule-grid-item">
                <p className="reschedule-grid-item-p">Appointment No. :</p>
                <h3 className="reschedule-grid-item-h3">
                  {appointment.appointmentNumber}
                </h3>
              </div>
              <div className="reschedule-grid-item">
                <p className="reschedule-grid-item-p">Name :</p>
                <h3 className="reschedule-grid-item-h3">
                  {appointment.patientName}
                </h3>
              </div>
              <div className="reschedule-grid-item">
                <p className="reschedule-grid-item-p">Email :</p>
                <h3 className="reschedule-grid-item-h3">
                  {appointment.patientEmailId}
                </h3>
              </div>
              <div className="reschedule-grid-item">
                <p className="reschedule-grid-item-p">Appointment Date :</p>
                <h3 className="reschedule-grid-item-h3">
                  {formatAppointmentDate(appointment.appointmentDate)}
                </h3>
              </div>
              <div className="reschedule-grid-item">
                <p className="reschedule-grid-item-p">Appointment Time :</p>
                <h3 className="reschedule-grid-item-h3">
                  {appointment.appointmentTime}
                </h3>
              </div>
              <div className="reschedule-grid-item">
                <p className="reschedule-grid-item-p">Counsellor Name :</p>
                <h3 className="reschedule-grid-item-h3">
                  {appointment.doctorData.doctorName}
                </h3>
              </div>

              <div className="switch-grid1">
                <p className="switch-grid1-p switch-grid-item-p">
                  New Counsellor :
                </p>
                <div className="form-row">
                  <select
                    value={selectedDoctor?._id || ""}
                    onChange={(event) =>
                      handleDoctorChange(event, appointment._id)
                    }
                    required
                  >
                    <option value="">Select Counsellor</option>
                    {doctors
                      .filter(
                        (doctor) => doctor._id !== appointment.doctorData._id
                      ) // Exclude current counselor
                      .map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          {`${doctor.doctorName} (${doctor.doctorSpecialisation})`}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Booking slots */}
              <div className="bookSlots-div">
                <div className="Available">
                  <p className="availability-p2">Availability</p>
                  <div className="Dates-Days slotTime-div">
                    {docSlots[appointment._id] &&
                      docSlots[appointment._id].map((item, index) => (
                        <div
                          onClick={() =>
                            setSlotIndex((prev) => ({
                              ...prev,
                              [appointment._id]: index,
                            }))
                          }
                          key={index}
                          className={`borderDayDAtes ${
                            slotIndex[appointment._id] === index
                              ? "borderDayDAte2s"
                              : "borderDayDAte3s"
                          }`}
                        >
                          <p>
                            {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                          </p>
                          <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                      ))}
                  </div>

                  <div className="slotTime-div Dates-Days">
                    {docSlots[appointment._id] &&
                      slotIndex[appointment._id] !== undefined &&
                      docSlots[appointment._id][slotIndex[appointment._id]].map(
                        (item, index) => (
                          <p
                            onClick={() =>
                              setSlotTime((prev) => ({
                                ...prev,
                                [appointment._id]: item.time,
                              }))
                            }
                            key={index}
                            className={`condition1 ${
                              slotTime[appointment._id] === item.time
                                ? "condition2"
                                : "condition3"
                            }`}
                          >
                            {item.time.toLowerCase()}
                          </p>
                        )
                      )}
                  </div>
                </div>

                <div className="mode-select">
                  <label htmlFor="mode">
                    Mode Of Appointment (Online or Offline):
                  </label>
                  <select
                    name="mode"
                    value={patientMode}
                    onChange={(e) => setPatientMode(e.target.value)}
                    className="booking-mode-select"
                    required
                  >
                    <option value="">Select Mode</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="reason-div">
                <p className="reason-p">Reason for switching counsellor</p>
                <textarea
                  type="text"
                  value={reason}
                  onChange={handleReasonChange}
                  placeholder="Enter reason for switching counsellor"
                  required
                />
              </div>

              <div className="reshedule-btn">
                <p
                  className="reshedule-btn-p"
                  onClick={() => handleReschedule(appointment._id)}
                  disabled={loading}
                >
                  {loading ? "Switching Counsellor..." : "Switch Counsellor"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwitchDoctor;
