import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "./slices/doctorSlice";
import forgotPasswordReducer from "./slices/forgotResetPasswordSlice";
import diagnosisReducer from "./slices/detailDiagnosisSlice";
import appointmentsReducer from "./slices/appointmentSlice";
// import timelineReducer from "./slices/timelineSlice";
// import softwareApplicationReducer from "./slices/softwareApplicationSlice";
import onlineTestReducer from "./slices/onlineTestSlice";
import  onlineTestTransactionReducer from "./slices/onlineTestTransactionSlice";

export const store = configureStore({
  reducer: {
    doctor: doctorReducer,
    forgotPassword: forgotPasswordReducer,
    diagnosis: diagnosisReducer,
    appointments: appointmentsReducer,
    // timeline: timelineReducer,
    // softwareApplications: softwareApplicationReducer,
    onlineTests: onlineTestReducer,
    onlineTestTransaction:onlineTestTransactionReducer,
  },
});
