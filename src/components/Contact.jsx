import React, { useState } from 'react';
import { Home } from 'lucide-react';
import './Contact.css';
export  const Contact=()=> {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    specialization: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="signup-container">
      <div className="home-icon">
        <Home size={24} />
      </div>
      <div className="logo">◇ DAMS</div>
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up With Your DAMS Account</h2>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
        <select
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
        >
          <option value="">Choose Specialization</option>
          <option value="cardiology">Cardiology</option>
          <option value="dermatology">Dermatology</option>
          <option value="neurology">Neurology</option>
          <option value="orthopedics">Orthopedics</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p className="signin-link">
        Do you have an account? <a href="/signin">SIGN IN</a>
      </p>
 
    </div>
  );
}
export default Contact;