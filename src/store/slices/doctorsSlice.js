import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_KEY;

const initialState = {
  doctors: [],
  singleDoctor: null,  // To hold single doctor data
  loading: false,
  error: null,
  message: null,
};

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    // Action to handle request state
    requestForAllDoctors: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Action for successfully fetching all doctors
    successForAllDoctors: (state, action) => {
      state.loading = false;
      state.doctors = action.payload;
      state.error = null;
    },
    // Action for handling failure in fetching doctors
    failureForAllDoctors: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    requestForSingleDoctor: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Action for successfully fetching a single doctor
    successForSingleDoctor: (state, action) => {
      state.loading = false;
      state.singleDoctor = action.payload;
      state.error = null;
    },
    // Action to clear any existing errors
    clearAllErrors: (state) => {
      state.error = null;
    },
    // Action to reset doctor-related state
    resetDoctorSlice: (state) => {
      state.loading = false;
      state.doctors = [];
      state.error = null;
      state.message = null;
    },
  },
});

// Thunk to fetch all doctors from the backend
export const getAllMyDoctors = () => async (dispatch) => {
  dispatch(doctorsSlice.actions.requestForAllDoctors());
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/get-all-doctors`);
    
    // Dispatch success action with received doctors data
    dispatch(doctorsSlice.actions.successForAllDoctors(response.data.doctors));
    // console.log(response.data.doctors)
    // Optionally, clear errors after successful fetch
    dispatch(doctorsSlice.actions.clearAllErrors());
  } catch (error) {
    // Dispatch failure action with error message
    dispatch(doctorsSlice.actions.failureForAllDoctors(
      error.response?.data?.message || "Failed to fetch doctors"
    ));
  }
};

export const getSingleDoctorById = (doctorId) => (dispatch, getState) => {
  dispatch(doctorsSlice.actions.requestForSingleDoctor());
  
  try {
    const { doctors } = getState().doctors;  // Get the current doctors list from state
    
    // Ensure the list of doctors exists before trying to filter
    if (doctors && doctors.length > 0) {
      const singleDoctor = doctors.find(doctor => doctor._id === doctorId);

      if (singleDoctor) {
        dispatch(doctorsSlice.actions.successForSingleDoctor(singleDoctor));
      } else {
        throw new Error("Doctor not found");
      }
    } else {
      throw new Error("Doctors list is empty or not loaded");
    }
  } catch (error) {
    // dispatch(doctorsSlice.actions.failureForSingleDoctor(
    //   error.message || "Failed to fetch doctor"
    // ));
  }
};

// Action to clear errors
export const clearAllDoctorsErrors = () => (dispatch) => {
  dispatch(doctorsSlice.actions.clearAllErrors());
};

// Action to reset the doctors slice
export const resetAllDoctorSlice = () => (dispatch) => {
  dispatch(doctorsSlice.actions.resetDoctorSlice());
};

// Export the reducer to be used in the store
export default doctorsSlice.reducer;
