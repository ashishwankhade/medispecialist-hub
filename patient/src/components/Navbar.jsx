import React, { useState, useEffect } from "react";
import "./Navbar.css"; // Importing the CSS file for styling
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAppointmentsByEmail,
  getAllAppointmentsByEmailOnlyDiagnosis,
  resetAppointmentSlice,
} from "../store/slices/appointmentSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const { loading, error, message, appointments } = useSelector(
    (state) => state.appointments
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for modal visibility
  const [cancelVisible, setCancelVisible] = useState(false);
  const [switchDoctorVisible, setSwitchDoctorVisible] = useState(false);
  const [changeScheduleVisible, setChangeScheduleVisible] = useState(false);
  const [onlineVisible, setOnlineVisible] = useState(false);

  // State for form input
  const [inputData, setInputData] = useState({ userEmail: "" });
  const [actionType, setActionType] = useState(""); // Track the action type (cancel, switch, etc.)

  // Handle form data change
  const handleData = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!loading && actionType) {
      if (appointments?.length > 0) {
        // Handle navigation based on action type
        switch (actionType) {
          case "cancel":
            setCancelVisible(false);
            navigate("/appointment-cancel");
            break;
          case "change-schedule":
            setChangeScheduleVisible(false);
            navigate("/change-schedule");
            break;
          default:
            break;
        }
        setActionType("");
      } else {
        toast.error("No appointments found");
      }
    }
  }, [appointments, loading, actionType, navigate]);

  // Error and success handler (only once)
  useEffect(() => {
    if (error) {
      // toast.error(error);
      // dispatch(resetAppointmentSlice()); // Clear slice state after handling error
    }
    if (message) {
      // toast.success(message);
      // dispatch(resetAppointmentSlice()); // Clear slice state after handling success
    }
  }, [error, message, dispatch]);

  // Handlers for different actions
  const handleCancelAppointment = (e) => {
    e.preventDefault();
    setActionType("cancel");
    dispatch(getAllAppointmentsByEmail(inputData.userEmail));
  };

  // const handleSwitchAppointment = (e) => {
  //   e.preventDefault();
  //   setActionType("switch");
  //   dispatch(getAllAppointmentsByEmail(inputData.userEmail));
  // };

  const handleChangeSchedule = (e) => {
    e.preventDefault();
    setActionType("change-schedule");
    dispatch(getAllAppointmentsByEmail(inputData.userEmail));
  };

  // const handleOnlineAppointment = (e) => {
  //   e.preventDefault();
  //   setActionType("online-test");
  //   dispatch(getAllAppointmentsByEmailOnlyDiagnosis(inputData.userEmail));
  // };

  return (
    <div className="homepage">
      <div className="navbarDiv">
        <nav className="navbar">
          <div className="nav-3btn">
            {/* Cancel Appointment Modal */}
            <div className="nav-btn">
              <p className="nav-btn-p" onClick={() => setCancelVisible(true)}>
                Cancel Appointment
              </p>
              <Modal
                isOpen={cancelVisible}
                onRequestClose={() => setCancelVisible(false)}
                style={modalStyle}
              >
                <div className="modal-body">
                  <h1 className="modal-h1">Cancel Appointment</h1>
                  <form onSubmit={handleCancelAppointment}>
                    <div className="modalForm-name">
                      <label htmlFor="userEmail">Enter Your Email ID</label>
                      <input
                        type="email"
                        name="userEmail"
                        value={inputData.userEmail}
                        onChange={handleData}
                        placeholder="Enter Patient Email ID"
                        required
                      />
                    </div>
                    <div className="modal-btn-div">
                      <button
                        type="submit"
                        className="modal-btn"
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </Modal>
            </div>

            {/* Switch Doctor Modal */}
            {/* <div className="nav-btn">
              <p className="nav-btn-p" onClick={() => setSwitchDoctorVisible(true)}>Switch Counsellor</p>
              <Modal isOpen={switchDoctorVisible} onRequestClose={() => setSwitchDoctorVisible(false)} style={modalStyle}>
                <div className="modal-body">
                  <h1 className="modal-h1">Switch Counsellor</h1>
                  <form onSubmit={handleSwitchAppointment}>
                    <div className="modalForm-name">
                      <label htmlFor="userEmail">Enter Your Email ID</label>
                      <input
                        type="email"
                        name="userEmail"
                        value={inputData.userEmail}
                        onChange={handleData}
                        placeholder="Enter Patient Email ID"
                        required
                      />
                    </div>
                    <div className="modal-btn-div">
                      <button type="submit" className="modal-btn" disabled={loading}>
                        {loading ? "Loading..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </Modal>
            </div> */}

            {/* Change Schedule Modal */}
            <div className="nav-btn">
              <p
                className="nav-btn-p"
                onClick={() => setChangeScheduleVisible(true)}
              >
                Reschedule Appointment
              </p>
              <Modal
                isOpen={changeScheduleVisible}
                onRequestClose={() => setChangeScheduleVisible(false)}
                style={modalStyle}
              >
                <div className="modal-body">
                  <h1 className="modal-h1">Reschedule Appointment</h1>
                  <form onSubmit={handleChangeSchedule}>
                    <div className="modalForm-name">
                      <label htmlFor="userEmail">Enter Your Email ID</label>
                      <input
                        type="email"
                        name="userEmail"
                        value={inputData.userEmail}
                        onChange={handleData}
                        placeholder="Enter Patient Email ID"
                        className="ModelInput"
                        required
                      />
                    </div>

                    <div className="modal-btn-div">
                      <button
                        type="submit"
                        className="modal-btn"
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </Modal>
            </div>

            {/* handleOnlineAppointment Doctor Modal */}
            {/* <div className="nav-btn">
              <p className="nav-btn-p" onClick={() => setOnlineVisible(true)}>
                Online Test
              </p>
              <Modal
                isOpen={onlineVisible}
                onRequestClose={() => setOnlineVisible(false)}
                style={modalStyle}
              >
                <div className="modal-body">
                  <h1 className="modal-h1">Online Test</h1>
                  <form onSubmit={handleOnlineAppointment}>
                    <div className="modalForm-name">
                      <label htmlFor="userEmail">Enter Your Email ID</label>
                      <input
                        className="inputbox"
                        type="email"
                        name="userEmail"
                        value={inputData.userEmail}
                        onChange={handleData}
                        placeholder="Enter Patient Email ID"
                        required
                      />
                    </div>
                    <div className="modal-btn-div">
                      <button
                        type="submit"
                        className="modal-btn"
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </Modal>
            </div> */}
          </div>
        </nav>
      </div>
    </div>
  );
};

// Modal style object for consistency
const modalStyle = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000, // Increase z-index to ensure it appears on top
  },
  content: {
    top: "50%",
    left: "50%",
    width: "450px",
    // height: "300px",
    // background: "rgb(134, 174, 2)",
    // borderRadius: "20px",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
  },
};

export default Navbar;
