import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./sub-components/Dashboard";
// import AddSkill from "./sub-components/AddSkill";
// import AddProject from "./sub-components/AddProject";
// import AddSoftwareApplications from "./sub-components/AddSoftwareApplications";
import Account from "./sub-components/Account";
import { useDispatch, useSelector } from "react-redux";
import { clearAlldoctorErrors, logout } from "@/store/slices/doctorSlice";
import { toast } from "react-toastify";
import { getAllappointments } from "@/store/slices/appointmentSlice";
// import Messages from "./sub-components/Messages";
// import AddTimeline from "./sub-components/AddTimeline";
import "./Homepage.css";
import logo from "../components/image/logo_hospital.png";
const HomePage = () => {
  const [active, setActive] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { isAuthenticated, error, doctor } = useSelector(
    (state) => state.doctor
  );
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged Out!");
  };
  const navigateTo = useNavigate();

  useEffect(() => {
    // Handle errors with toast notifications
    if (error) {
      toast.error(error);
      dispatch(clearAlldoctorErrors());
    }

    // Navigate to login if not authenticated
    if (!isAuthenticated) {
      navigateTo("/login");
    }

    // Ensure doctor._id is available before dispatching the getAllappointments action
    if (doctor && doctor._id) {
      console.log(doctor._id, "this is doctor id in home page");
      dispatch(getAllappointments(doctor._id));
    }
  }, [isAuthenticated, doctor?._id, error, dispatch, navigateTo]);


  const handleToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className="slideBar-div">
      <button className={ `toggle-btn  ${sidebarOpen ? "hiddenToggleBtn":""}  `} onClick={handleToggle}>
        ☰
      </button>
      <aside
        className={`fixed bhushan inset-y-0 left-0 flex-col border-r bg-background sm:flex z-50 ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <img src={logo} alt="counsellor" className="image-logo" />
        <nav className="slideBar-list">
          <ul>
            <li>
              <Link
                className={`slideBar-link ${
                  active === "Dashboard" ? "active-link" : ""
                }`}
                onClick={() => {
                  setActive("Dashboard");
                  setSidebarOpen(false);
                }}
              >
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                className={`slideBar-link ${
                  active === "Account" ? "active-link" : ""
                }`}
                onClick={() => {
                  setActive("Account");
                  setSidebarOpen(false);
                }}
              >
                <span>Account</span>
              </Link>
            </li>
          </ul>
        </nav>
        <nav className="mt-auto slideBar-list">
          <Link className="btnLogout" onClick={handleLogout}>
            <span>Logout</span>
          </Link>
        </nav>
      </aside>

      {/* Dynamic Content based on active page */}
      <div className="content-area">
        {(() => {
          switch (active) {
            case "Dashboard":
              return <Dashboard />;
            case "Messages":
              return <Messages />;
            case "Account":
              return <Account />;
            default:
              return <Dashboard />;
          }
        })()}
      </div>
    </div>
  );
};

export default HomePage;