import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_KEY;
// Initial state for the appointment slice
const initialState = {
  dignosisappointments: [],  // Changed 'appoinment' to plural for clarity
  loading:false,
  error: null,
  message: null,
};


const dignosisappointmentsSlice = createSlice({
  name: "dignosisappointments",
  initialState,
  reducers: {
    // Action to initiate booking (loading state)

       //for online test appointments appointment
    requestForAllAppointmentDiagnosis: (state) => {
    state.loading = true;
    state.error = null;
    state.message = null;
  },

  successForAllAppointmentDiagnosis: (state, action) => {
    state.loading = false;
    state.appointments = action.payload;
    state.error = null;
    state.message = "Appointment online test fetched successfully!";
  },
  failureForAllAppointmentDiagnosis: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.message = null;
  },
    // Action to clear all errors
    clearAllErrors: (state) => {
      state.error = null;
      // state.message=null;
    },
    clearAllMessages: (state) => {
      state.message=null;
      state.error = null;
    },
    // Action to reset the slice
    resetdignosisappointmentsSlice: (state) => {
      state.loading = false;
      state.appointments = [];
      state.error = null;
      state.message = null;
    },

  },  
});

// Asynchronous thunk action for booking an appointment
export const bookingAppointment = (formData) => async (dispatch) => {
  dispatch(dignosisappointmentsSlice.actions.requestForAppointmentBooking());

  try {
    // Make API call to book an appointment
    const response = await axios.post(
      `${BASE_URL}/api/appointment/book-appointment`,
      formData,
      { headers: { "Content-Type": "application/json" } }
    );

    // Dispatch success action with API response data
    dispatch(dignosisappointmentsSlice.actions.successForAppointmentBooking(response.data.appointment));
    console.log("Appointment booked successfully:", response.data);

    // Optionally clear errors after successful booking
    dispatch(dignosisappointmentsSlice.actions.clearAllErrors());

  } catch (error) {
    // Dispatch failure action with error message
    dispatch(
      dignosisappointmentsSlice.actions.failureForAppointmentBooking(
        error.response?.data?.message || "Something went wrong"
      )
    );
    console.error("Error booking appointment:", error);
  }
};



export const getAllAppointmentsByEmailOnlyDiagnosis= (patientEmaild) => async (dispatch) => {
  console.log("bhushan in online ",patientEmaild);
  dispatch(dignosisappointmentsSlice.actions.requestForAllAppointmentDiagnosis());
  try {
    const response = await axios.get(`${BASE_URL}/api/appointment/appointment/${patientEmaild}`);   
    // Dispatch success action with received doctors data
    console.log(response.data, "This is data about diagnosis")
    dispatch(dignosisappointmentsSlice.actions.successForAllAppointmentDiagnosis(response.data.appointments));    
    // Optionally, clear errors after successful fetch
    console.log("i am in redux toolkit in getall appoinment by email middle")
    dispatch(dignosisappointmentsSlice.actions.clearAllErrors());
  } catch (error) {
    // Dispatch failure action with error message
    dispatch(dignosisappointmentsSlice.actions.failureForAllAppointmentDiagnosis(
      error.response?.data?.message || "Failed to fetch Appoinments"
    ));
  }
};


// Action to clear appointment-related errors
export const clearAppointmentErrors = () => (dispatch) => {
  dispatch(dignosisappointmentsSlice.actions.clearAllErrors());
};

// Action to reset the appointment slice
export const resetdignosisappointmentsSlice = () => (dispatch) => {
  dispatch(dignosisappointmentsSlice.actions.resetdignosisappointmentsSlice());
};

//for clearing all messages
export const clearAllappoinmetnMessges = () => (dispatch) => {
  dispatch(dignosisappointmentsSlice.actions.clearAllMessages());
};


export default dignosisappointmentsSlice.reducer;
