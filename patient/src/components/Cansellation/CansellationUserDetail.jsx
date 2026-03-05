import React, { useEffect, useState } from "react";
import "../Cansellation/cansellationUser-detail.css";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  cancelAppointment,
  clearAllAppointmentMessages,
  clearAppointmentErrors,
} from "../../store/slices/appointmentSlice";

const CansellationUserDetail = () => {
  const [loadingStates, setLoadingStates] = useState({});
  const { error, message, appointments } = useSelector(
    (state) => state.appointments
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAppointmentErrors());
      setLoadingStates({});
    }

    if (message) {
      toast.success(message);
      dispatch(clearAllAppointmentMessages());
      setLoadingStates({});
    }
  }, [dispatch, error, message]);

  // const handleClick = (appointmentId) => {
  //   Swal.fire({
  //     title: "Do you want to Cancel this Appointment?",
  //     showDenyButton: true,
  //     confirmButtonText: "Yes",
  //     denyButtonText: "No",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       setLoadingStates((prev) => ({ ...prev, [appointmentId]: true }));

  //       // Dispatch the cancelAppointment action
  //       dispatch(cancelAppointment(appointmentId)).then((response) => {
  //         if (response.success) {
  //           Swal.fire("Appointment canceled!", "", "success");
  //         } else {
  //           Swal.fire("Failed to cancel the appointment", "", "error");
  //         }

  //         // Reset loading state for this appointmentId
  //         setLoadingStates((prev) => ({ ...prev, [appointmentId]: false }));
  //       });
  //     } else if (result.isDenied) {
  //       Swal.fire("Appointment not canceled", "", "info");
  //     }
  //   });
  // };

  const handleClick = (appointmentId) => {
    Swal.fire({
      title: "Do you want to Cancel this Appointment?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoadingStates((prev) => ({ ...prev, [appointmentId]: true }));
  
        // Dispatch the cancelAppointment action
        dispatch(cancelAppointment(appointmentId))
          .unwrap() // Unwraps the action to handle the response directly
          .then(() => {
            Swal.fire("Appointment canceled!", "", "success");
          })
          .catch(() => {
            Swal.fire("Failed to cancel the appointment", "", "error");
          })
          .finally(() => {
            // Ensure loading state is reset regardless of success or failure
            setLoadingStates((prev) => ({ ...prev, [appointmentId]: false }));
          });
      } else if (result.isDenied) {
        Swal.fire("Appointment not canceled", "", "info");
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

  // const truncateAddress = (address, maxLength = 25) => {
  //   if (address.length > maxLength) {
  //     return address.substring(0, maxLength) + "...";
  //   }
  //   return address;
  // };

  return (
    <div className="userCancellation">
      <h1 className="userCancellation-h1">Cancel Appointment</h1>

      <div className="cancel-userDetail">
        <table className="cancel-table">
          <thead>
            <tr>
              <th className="table-heading">Appointment No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mode (Online/Offline)</th>
              {/* <th>Address</th> */}
              <th>Appointment Date</th>
              <th>Appointment Time</th>
              <th>Doctor Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.appointmentNumber}>
                <td>{appointment.appointmentNumber}</td>
                <td>{appointment.patientName}</td>
                <td>{appointment.patientEmailId}</td>
                <td>{appointment.isOnlineOrOffline}</td>
                {/* <td>{truncateAddress(appointment.patientAddress)}</td> */}
                <td>{formatAppointmentDate(appointment.appointmentDate)}</td>
                <td>{appointment.appointmentTime}</td>
                <td>{appointment.doctorData.doctorName}</td>
                <td>
                  <button
                    className="cancel-btn"
                    onClick={() => handleClick(appointment._id)}
                    disabled={loadingStates[appointment._id]}
                  >
                    {loadingStates[appointment._id]
                      ? "Cancelling Appointment..."
                      : "Cancel Appointment"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default CansellationUserDetail;
