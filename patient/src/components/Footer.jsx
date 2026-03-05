import React from "react";
import { CiFacebook } from "react-icons/ci";
import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import { IoLogoInstagram, IoLogoYoutube } from "react-icons/io5";
import { PiTelegramLogoDuotone } from "react-icons/pi";
import { Link } from "react-router-dom";
import './Footer.css'
const Footer = () => {
  return (
    <div>
      <div className="footer">
        <div className="footer_navBar">
          <Link to="/" className="footer-li">
           HOME
          </Link>
          <Link to="/booking" className="footer-li">
           BOOKING
          </Link>
        </div>
        <div className="footer_icons">
        <a
            href="https://www.instagram.com/psycortex_pvt_ltd"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoInstagram className="footerlogo" />
          </a>

          <a
            href="https://wa.me/918767027078"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp className="footerlogo" />
          </a>

          <a
            href="https://x.com/PPsycortex"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiTwitter className="footerlogo"/>
          </a>

          <a
            href="https://www.facebook.com/psycortex.bt"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="footerlogo" />
          </a>

          <a
            href="https://youtube.com/@psycortex_private_limited?si=G1QQLzgS0TkxJtVs "
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoYoutube className="footerlogo" />
          </a>


          <a
            href="https://www.linkedin.com/company/psycortex-pvt-ltd/?viewAsMember=true"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="footerlogo" />
          </a>

        </div>
        <div>
          <p className="CopyRight">
            Copyright &copy; {new Date().getFullYear()} All rights reserved |
            This website is developed & maintained{" "}
            <span role="img" aria-label="heart" className="heart">
              ❤
            </span>
            by ANORG TECHNOLOGY PVT. LTD.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;