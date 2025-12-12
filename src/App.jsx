import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Dashboard from "./pages/";
import DashbordPage from "./pages/DashbordPage";
import { useState } from "react";
import ViewCounsellorDetail from "./Component/Admin/ViewCounsellorDetail";
import ViewSingleAppointment from "./Component/Admin/ViewSingleAppointment";
import UpdateCounsellorByAdmin from "./Component/Admin/UpdateCounsellorByAdmin";

function App() {
  const [adminData, setAdminDAta] = useState("");

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login data={setAdminDAta} />} />
          <Route path="/dashboard/*" element={<DashbordPage />} />

          <Route
            path="/dashboard/doctor-list/viewCounsellorDetail"
            element={<ViewCounsellorDetail />}
          />

          <Route
            path="/dashboard/all-appointments/viewSingleAppointment"
            element={<ViewSingleAppointment />}
          />
          <Route
            path="/dashboard/doctor-list/updateCounsellor"
            element={<UpdateCounsellorByAdmin />}
          />

          <Route path="/dashboard/*" element={<DashbordPage adminData={adminData}/>} />
        </Routes>

        <div className="Admin-DashboardAPP">
          {/* <Dashbord /> */}
          {/* <Routes> */}
          {/* <Route path="/" element={<></>} /> */}
          {/* <Route path="/admin-dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/all-appointments" element={<GetAllAppointment />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctor-list" element={<DoctorList />} /> */}
          {/* <Route path="/doctor-dashboard" element={<DoctorDashboard />} /> */}
          {/* <Route path="/doctor-appointments" element={<DoctorAppointments />}/> */}
          {/* <Route path="/doctor-profile" element={<DoctorProfile />} /> */}
          {/* </Routes> */}
        </div>
      </Router>
      <ToastContainer position="top-right" theme="dark" />{" "}
      {/* Add ToastContainer to your component */}
    </div>
  );
}

export default App;
