import React, { useEffect, useState } from "react";
import "./ChangeSchedule.css";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  rescheduleAppointment,
  clearAllAppointmentMessages,
  clearAppointmentErrors,
} from "../../store/slices/appointmentSlice";
import { useNavigate } from "react-router-dom";

const RescheduleUserDetail = () => {
  const { loading, error, message, appointments } = useSelector(
    (state) => state.appointments
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [docSlots, setDocSlots] = useState({});
  const [slotIndex, setSlotIndex] = useState({});
  const [slotTime, setSlotTime] = useState({});

  const [patientMode, setPatientMode] = useState("");

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAppointmentErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(clearAllAppointmentMessages());
    }
  }, [dispatch, error, message]);

  useEffect(() => {
    appointments.forEach((appointment) => {
      fetchAvailableSlots(appointment._id, appointment.doctorObjectId);
    });
  }, [appointments]);

  const fetchAvailableSlots = async (appointmentId, doctorId) => {
    const appointment = appointments.find((app) => app._id === appointmentId);
    const doctorData = appointment?.doctorData;

    if (doctorData) {
      let allSlots = [];
      let today = new Date();

      for (let i = 0; i < 15; i++) {
        let currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        let endTime = new Date(currentDate);
        endTime.setHours(18, 0, 0, 0);

        if (today.getDate() === currentDate.getDate()) {
          currentDate.setHours(
            currentDate.getHours() >= 10 ? currentDate.getHours() + 1 : 10
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
          let slotDate = `${currentDate.getDate()}_${
            currentDate.getMonth() + 1
          }_${currentDate.getFullYear()}`;

          const isSlotAvailable =
            !doctorData.slots_booked ||
            !doctorData.slots_booked[slotDate] ||
            !doctorData.slots_booked[slotDate].includes(formattedTime);

          if (isSlotAvailable) {
            const holidayEnd = doctorData.holidayEndDate
              ? new Date(
                  new Date(doctorData.holidayEndDate).setDate(
                    new Date(doctorData.holidayEndDate).getDate() + 1
                  )
                )
              : null;

            const holidayStart = doctorData.holidayStartDate
              ? new Date(doctorData.holidayStartDate)
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
              console.log(
                doctorData.holidayEndDate
                  ? new Date(doctorData.holidayEndDate)
                  : "No holiday end date defined"
              );
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

  const handleReschedule = (appointmentId) => {
    Swal.fire({
      title: "Do you want to reschedule this appointment?",
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
            appointmentId,
            newAppointmentDate: formattedDate,
            newAppointmentTime: selectedTime,
            isOnlineOrOffline: patientMode,
          };

          dispatch(rescheduleAppointment(newAppointmentData)).then(
            (response) => {
              if (response.payload?.success) {
                Swal.fire("Appointment rescheduled!", "", "success").then(
                  () => {
                    navigate("/");
                  }
                );
              } else {
                Swal.fire("Failed to reschedule the appointment", "", "error");
              }
            }
          );
        } else {
          Swal.fire("Please select a new date and time", "", "warning");
        }
      } else if (result.isDenied) {
        Swal.fire("Appointment not rescheduled", "", "info");
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

  return (
    <div className="ranaReshadule-userReschedule">
      <h1 className="ranaReshadule-userReschedule-h1">Reschedule Appointment</h1>
      <div className="ranaReshadule-reschedule-userDetail">
        {appointments.map((appointment) => (
          <div className="ranaReshadule-reschedule-grid" key={appointment.appointmentNumber}>
            <div className="ranaReshadule-reschedule-doctor-container-above">
              <div className="ranaReshadule-reschedule-grid-item">
                <p className="ranaReshadule-reschedule-grid-item-p">Appointment No. :</p>
                <h3 className="ranaReshadule-reschedule-grid-item-h3">
                  {appointment.appointmentNumber}
                </h3>
              </div>
              <div className="ranaReshadule-reschedule-grid-item">
                <p className="ranaReshadule-reschedule-grid-item-p">Name : </p>
                <h3 className="ranaReshadule-reschedule-grid-item-h3">
                  {appointment.patientName}
                </h3>
              </div>
              <div className="ranaReshadule-reschedule-grid-item">
                <p className="ranaReshadule-reschedule-grid-item-p">Email : </p>
                <h3 className="ranaReshadule-reschedule-grid-item-h3">
                  {appointment.patientEmailId}
                </h3>
              </div>
              <div className="ranaReshadule-reschedule-grid-item">
                <p className="ranaReshadule-reschedule-grid-item-p">Appointment Date :</p>
                <h3 className="ranaReshadule-reschedule-grid-item-h3">
                  {formatAppointmentDate(appointment.appointmentDate)}
                </h3>
              </div>
              <div className="ranaReshadule-reschedule-grid-item">
                <p className="ranaReshadule-reschedule-grid-item-p">Appointment Time :</p>
                <h3 className="ranaReshadule-reschedule-grid-item-h3">
                  {appointment.appointmentTime}
                </h3>
              </div>
              <div className="ranaReshadule-reschedule-grid-item">
                <p className="ranaReshadule-reschedule-grid-item-p">Counsellor Name :</p>
                <h3 className="ranaReshadule-reschedule-grid-item-h3">
                  {appointment.doctorData.doctorName}
                </h3>
              </div>
              {/* Booking slots */}
              <div className="ranaReshadule-bookSlots-div">
                <div className="ranaReshadule-Available">
                  <p className="ranaReshadule-availability-p2">Availability</p>
                  <div className="ranaReshadule-Dates-Days">
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
                          className={`ranaReshadule-borderDayDAtes ${
                            slotIndex[appointment._id] === index
                              ? "ranaReshadule-borderDayDAte2s"
                              : "ranaReshadule-borderDayDAte3s"
                          }`}
                        >
                          <p>
                            {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                          </p>
                          <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                      ))}
                  </div>

                  <div className="ranaReshadule-slotTime-div ranaReshadule-Dates-Days">
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
                            className={`ranaReshadule-condition1 ${
                              slotTime[appointment._id] === item.time
                                ? "ranaReshadule-condition2"
                                : "ranaReshadule-condition3"
                            }`}
                          >
                            {item.time.toLowerCase()}
                          </p>
                        )
                      )}
                  </div>
                </div>

                <div className="ranaReshadule-mode-select">
                  <label htmlFor="mode">
                    Mode Of Appointment (Online or Offline):
                  </label>
                  <select
                    name="mode"
                    value={patientMode}
                    onChange={(e) => setPatientMode(e.target.value)}
                    className="ranaReshadule-booking-mode-select"
                    required
                  >
                    <option value="">Select Mode</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
              <div className="ranaReshadule-reshedule-btn">
                <p
                  className="ranaReshadule-reshedule-btn-p"
                  onClick={() => handleReschedule(appointment._id)}
                  disabled={loading}
                >
                  {loading ? "Rescheduling..." : "Reschedule Appointment"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RescheduleUserDetail;