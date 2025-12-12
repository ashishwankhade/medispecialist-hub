import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "./slices/doctorsSlice";
import appoinmentReducer from "./slices/appointmentSlice";
import  onlineTestReducer  from "./slices/onlineTestSlice";
const store = configureStore({
  reducer: {
    doctors: doctorReducer ,
    appointments:appoinmentReducer,
    onlineTests:onlineTestReducer,
  },
});

export default store;


