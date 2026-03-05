import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
import DoctorAppointment from './components/DoctorAppointment';
import DoctorDahbord from './components/DoctorDahbord.jsx';
import DoctorsList from './components/Doctors-list.jsx';
import { Contact } from 'lucide-react';
import Login from './components/Login.jsx';
import CansellationUserDetail from './components/Cansellation/CansellationUserDetail.jsx';
import SwitchDoctor from './components/SwitchDoctor/SwitchDoctor.jsx';
import ChangeSchedule from './components/ChangeSchedule/ChangeSchedule.jsx';
import ConsentForm from './components/ConsernForm/ConcernForm.jsx';
import UserFullInfo from './components/UserFull-info.jsx';
import Booking from './components/Booking.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from './components/Home.jsx';
import ViewSingleCounsellor from './components/ViewSingleCounsellor.jsx';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* <Navbar /> */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/about" element={<About />} /> */}
            <Route path="/doctor-appointment" element={<DoctorAppointment />} />
            <Route path="/booking" element={<DoctorsList />} />
            <Route path='/book-now/:id' element={<Booking />} />
            <Route path="/doctor-dashboard" element={<DoctorDahbord />} />
            <Route path="/contact" element={<Contact />} />
            <Route path='/login' element={<Login />} />
            <Route path='/appointment-cancel' element={<CansellationUserDetail />} />
            <Route path='/switch-doctor' element={<SwitchDoctor />} />
            <Route path='/change-schedule' element={<ChangeSchedule />} />
            <Route path='/consent-form' element={<ConsentForm />} />
            <Route path='/DrTouser-detail' element={<UserFullInfo />} />

            <Route path='/booking/viewSingleCounsellor' element={<ViewSingleCounsellor/>} />
        
          </Routes>
        </div>
        <ToastContainer position="top-right" theme="dark" />
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
