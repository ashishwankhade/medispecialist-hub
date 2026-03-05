import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: {
    loading: false,
    appointments: [],
    error: null,
    message: null,
    singleappointments: {},
  },
  reducers: {
    getAllappointmentsRequest(state, action) {
      state.appointments = [];
      state.error = null;
      state.loading = true;
    },
    getAllappointmentsSuccess(state, action) {
      state.appointments = action.payload;
      state.error = null;
      state.loading = false;
    },
    getAllappointmentsFailed(state, action) {
      state.appointments = state.appointments;
      state.error = action.payload;
      state.loading = false;
    },
    addNewProjectRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addNewappointmentsuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    addNewProjectFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    deleteProjectRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteappointmentsuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    deleteProjectFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    updateProjectRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateappointmentsuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },
    updateProjectFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    resetappointmentsSlice(state, action) {
      state.error = null;
      state.appointments = state.appointments;
      state.message = null;
      state.loading = false;
    },
    clearAllErrors(state, action) {
      state.error = null;
      state = state.appointments;
    },
  },
});


const BASE_URL=import.meta.env.VITE_API_KEY;

console.log(import.meta.env.VITE_API_KEY);



export const getAllappointments = (doctorObjectId) => async (dispatch) => {
  dispatch(appointmentsSlice.actions.getAllappointmentsRequest());
  console.log(doctorObjectId,"this is doctor appointment id in redux bhushan")
  try {
    const response = await axios.get(
      `${BASE_URL}/api/doctor/appointments/${doctorObjectId}`,
      { withCredentials: true }
    
    );

    console.log(response,"this is  appointments data response in redux toolkit ");
    dispatch(
      appointmentsSlice.actions.getAllappointmentsSuccess(response.data.appointments)
    );
    dispatch(appointmentsSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      appointmentsSlice.actions.getAllappointmentsFailed(error.response.data.message)
    );
  }
};


export const resetappointmentsSlice = () => (dispatch) => {
  dispatch(appointmentsSlice.actions.resetappointmentsSlice());
};

export const clearAllappointmentsErrors = () => (dispatch) => {
  dispatch(appointmentsSlice.actions.clearAllErrors());
};

export default appointmentsSlice.reducer;
