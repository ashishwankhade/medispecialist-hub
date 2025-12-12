import React, { useEffect } from "react";
import GetAllAppointment from "../Component/Admin/GetAllAppointment";
import AddDoctor from "../Component/Admin/AddDoctor";
import DoctorList from "../Component/Admin/DoctorList";
import UploadAllDoctors from "../Component/Admin/UploadAllDoctors";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LeftSideBar from "../Component/Admin/LeftSideBar";
import AdminDashboard from "../Component/Admin/AdminDashboard";
// import AddOnlineTest from "../Component/Admin/AddOnlineTest";
import TransactionTable from "../Component/Admin/TransactionTable";

const DashbordPage = () => {
  const navigate = useNavigate();

  // console.log("adminDAta", adminData);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <div className="Admin-DashboardAPP">
      <div className="Admin-Dashboard-left">
        <LeftSideBar className="LeftSideBar" />
      </div>
      <div className="Admin-Dashboard-right">
        <Routes className="content-area">
          <Route path="/" element={<Navigate to="admin-dashboard" />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="all-appointments" element={<GetAllAppointment />} />
          <Route path="add-doctor" element={<AddDoctor />} />
          <Route path="doctor-list" element={<DoctorList />} />
          <Route path="upload-allDoctors" element={<UploadAllDoctors />} />
          {/* <Route path="add-OnlineTest" element={<AddOnlineTest />} /> */}
          <Route path="transactionTable" element={<TransactionTable />} />
          {/* <Route path="/doctor-dashboard" element={<DoctorDashboard />} /> */}
          {/* <Route path="/doctor-appointments" element={<DoctorAppointments />}/> */}
          {/* <Route path="/doctor-profile" element={<DoctorProfile />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default DashbordPage;
