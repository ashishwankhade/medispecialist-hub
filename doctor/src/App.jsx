import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
// import ManageSkills from "./pages/ManageSkills";
// import ManageProjects from "./pages/ManageProjects";
import UpdateAppointment from "./pages/UpdateAppointment";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
import { getdoctor } from "./store/slices/doctorSlice";
import { getAllonlineTests } from "./store/slices/onlineTestSlice";
import Navbar from "./pages/Navbar";
// import OnlineTestDetails from "./pages/OnlineTestDetails";
import StatusOfAppoinment from "./pages/StatusOfAppoinment";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getdoctor());
    dispatch(getAllonlineTests());
    
    
  }, []);
  return (
    <Router>
      {/* <Navbar/> */}
      {/* <>this is navabar</> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
     {/*   <Route path="/password/reset/:token" element={<ResetPassword />} />*/}

        {/* <Route path="/online/onlinetest/:id" element={<OnlineTestDetails/>} />  */}
        <Route path="/update/appointment/:id" element={<UpdateAppointment/>} /> 
        <Route path="/status/appointment/:id" element={<StatusOfAppoinment/>} /> 
      </Routes>
      <ToastContainer position="top-right" theme="dark" />
    </Router>
  );
}

export default App;


