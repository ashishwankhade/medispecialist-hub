import React from "react";
import "./Navbar.css";
import WebLogo from "../components/image/logo_hospital.png";

const Navbar = () => {
  return (
    <div className="CounsellorPage-navbar">
      <div className="CounsellorPage-navbarContent">
        <div className="CounsellorPage-logoContainer">
          <img
            src={WebLogo}
            className="CounsellorPage-logo"
            alt="Psycortex Logo"
          />
        </div>

        <div className="CounsellorPage-titleWrapper">
          <div className="CounsellorPage-marqueeContainer">
            <div className="CounsellorPage-marqueeContent">
              <h1 className="CounsellorPage-companyTitle">
                Welcome to... ENT and Gyneocologist Hospital
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
