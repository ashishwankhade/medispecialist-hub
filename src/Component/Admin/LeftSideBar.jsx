import React, { useState, useEffect, useRef } from "react";
import "./LeftSideBar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "./image/logo_hospital.png";
import { CiLogout } from "react-icons/ci";
import axios from "axios";
import { AiOutlineMenu } from "react-icons/ai";

const LeftSideBar = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleLogoutAdmin = async () => {
    const BASE_URL = import.meta.env.VITE_API_KEY;

    try {
      await axios.post(`${BASE_URL}/api/admin/logout`);

      localStorage.removeItem("token");
      toast.success("Logout Successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleContentClick = () => {
    setIsSidebarVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`slideBar-div ${isSidebarVisible ? "show-sidebar" : ""}`}
      ref={sidebarRef}
    >
      <div className="toggleButtonDiv">
        <button className="toggleButton" onClick={handleToggleSidebar}>
          <AiOutlineMenu size={24} />
        </button>
      </div>
      <div className="sidebar-content" onClick={handleContentClick}>
        <div className="logoDiv">
          <img src={Logo} alt="Logo" className="Website-Logo" />
        </div>
        <ul className="slideBar-list">
          <NavLink
            to={"admin-dashboard"}
            className={({ isActive }) =>
              `slideBar-link ${isActive ? "active-link" : ""}`
            }
          >
            <p className="slideBar-text">Dashboard</p>
          </NavLink>
          <NavLink
            to={"all-appointments"}
            className={({ isActive }) =>
              `slideBar-link ${isActive ? "active-link" : ""}`
            }
          >
            <p className="slideBar-text">Appointments</p>
          </NavLink>
          <NavLink
            to={"add-doctor"}
            className={({ isActive }) =>
              `slideBar-link ${isActive ? "active-link" : ""}`
            }
          >
            <p className="slideBar-text">Add New Doctor</p>
          </NavLink>
          <NavLink
            to={"doctor-list"}
            className={({ isActive }) =>
              `slideBar-link ${isActive ? "active-link" : ""}`
            }
          >
            <p className="slideBar-text">Doctor List</p>
          </NavLink>
          {/* <NavLink
            to={"upload-allDoctors"}
            className={({ isActive }) =>
              `slideBar-link ${isActive ? "active-link" : ""}`
            }
          >
            <p className="slideBar-text">Upload Doctor</p>
          </NavLink> */}
          {/* <NavLink
            to={"add-OnlineTest"}
            className={({ isActive }) =>
              `slideBar-link ${isActive ? "active-link" : ""}`
            }
          >
            <p className="slideBar-text">Add Online Test</p>
          </NavLink> */}
          {/* <NavLink
            to={"transactionTable"}
            className={({ isActive }) =>
              `slideBar-link ${isActive ? "active-link" : ""}`
            }
          >
            <p className="slideBar-text">Payment Transactions</p>
          </NavLink> */}
        </ul>
        <div className="LogoutAdminDiv">
          <button className="AdminLogOutBtn" onClick={handleLogoutAdmin}>
            <CiLogout /> <span className="AdminLogOutBtn-text">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
