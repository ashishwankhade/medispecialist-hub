import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const login = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/doctor-dashboard"); // Navigate to the next page
  };

  return (
    <div className="login-form">
      <div class="login-container">
        <h2 className=" login-h1">Login</h2>
        <form action="/submit-login" method="post" />
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required />

        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />

        <input type="submit" onClick={handleClick} value="Login" />
        <form />
      </div>
    </div>
  );
};

export default login;
