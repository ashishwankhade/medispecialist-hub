import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// VITE_API_KEY

const BASE_URL = import.meta.env.VITE_API_KEY;

// Initial state for the appointment slice
const initialState = {
  appointments: [],
  loading: false,
  error: null,
  message: null,
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    // Booking Actions
    requestForAppointmentBooking: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForAppointmentBooking: (state, action) => {
      state.loading = false;
      state.appointments.push(action.payload); // Push new appointment to the list
      state.message = "Appointment booked successfully!";
    },
    failureForAppointmentBooking: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetching All Appointments
    requestForAllAppointment: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForAllAppointment: (state, action) => {
      state.loading = false;
      state.appointments = action.payload; // Replace appointments list with fetched data
      state.message = "Appointments fetched successfully!";
    },
    failureForAllAppointment: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Cancel Appointment
    requestForCancelAppointment: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForCancelAppointment: (state, action) => {
      state.loading = false;
      // Remove canceled appointment from the list
      state.appointments = state.appointments.filter(
        (appointment) =>
          appointment.appointmentNumber !== action.payload.appointmentNumber
      );
      state.message = "Appointment canceled successfully!";
    },
    failureForCancelAppointment: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Switch Appointment (Doctor)
    requestForSwitchAppointment: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForSwitchAppointment: (state, action) => {
      state.loading = false;
      // Update switched appointment
      state.appointments = state.appointments.map((appointment) =>
        appointment._id === action.payload._id ? action.payload : appointment
      );
      state.message = "Doctor switched successfully!";
    },
    failureForSwitchAppointment: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Reschedule Appointment
    requestForRescheduleAppointment: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForRescheduleAppointment: (state, action) => {
      state.loading = false;
      // Update rescheduled appointment
      state.appointments = state.appointments.map((appointment) =>
        appointment._id === action.payload._id ? action.payload : appointment
      );
      state.message = "Appointment rescheduled successfully!";
    },
    failureForRescheduleAppointment: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Online Diagnosis Appointments
    requestForAllAppointmentDiagnosis: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForAllAppointmentDiagnosis: (state, action) => {
      state.loading = false;
      state.appointments = action.payload;
      state.message = "Diagnosis appointments fetched successfully!";
    },
    failureForAllAppointmentDiagnosis: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear Errors and Messages
    clearAllErrors: (state) => {
      console.log("I am in clearAlErrors", state.error);
      state.error = null;
    },
    clearAllMessages: (state) => {
      state.message = null;
    },

    // Reset the Slice
    resetAppointmentSlice: (state) => {
      state.loading = false;
      state.appointments = [];
      state.error = null;
      state.message = null;
    },
  },
});

// Thunk Actions
export const bookingAppointment = (formData) => async (dispatch) => {
  dispatch(appointmentSlice.actions.requestForAppointmentBooking());

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout

    const response = await axios.post(
      `${BASE_URL}/api/appointment/book-appointment`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    dispatch(
      appointmentSlice.actions.successForAppointmentBooking(
        response.data.appointment
      )
    );

    dispatch(appointmentSlice.actions.clearAllErrors());
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong with the appointment booking";

    dispatch(
      appointmentSlice.actions.failureForAppointmentBooking(errorMessage)
    );

    throw errorMessage; // Re-throw for component-level handling
  }
};
export const getAllAppointmentsByEmail = (patientEmail) => async (dispatch) => {
  dispatch(appointmentSlice.actions.requestForAllAppointment());

  console.log(BASE_URL, "this is base url");

  try {
    const response = await axios.get(
      `${BASE_URL}/api/appointment/appointments/${patientEmail}`
    );
    dispatch(
      appointmentSlice.actions.successForAllAppointment(
        response.data.appointments
      )
    );
    dispatch(appointmentSlice.actions.clearAllErrors());
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch appointments";
    dispatch(
      appointmentSlice.actions.failureForAllAppointment(
        // error.response?.data?.message || "Failed to fetch appointments"
        errorMessage
      )
    );
    if (
      error.response?.status === 404 &&
      errorMessage === "No appointments found"
    ) {
      setTimeout(() => {
        dispatch(resetAppointmentSlice());
      }, 0); // 2-second delay before resetting
    }
  }
};

export const cancelAppointment = (appointmentId) => async (dispatch) => {
  dispatch(appointmentSlice.actions.requestForCancelAppointment());
  console.log(BASE_URL, "this is base url");
  try {
    const response = await axios.post(
      `${BASE_URL}/api/appointment/cancel-appointment`,
      {
        appointmentId,
      }
    );
    dispatch(
      appointmentSlice.actions.successForCancelAppointment(response.data)
    );
    console.log(response.data, "bhushan");
    dispatch(appointmentSlice.actions.clearAllErrors());
  } catch (error) {
    console.log(error, "this is error data");
    dispatch(
      appointmentSlice.actions.failureForCancelAppointment(
        error.response?.data?.message || "Failed to cancel appointment"
        // "failed to cancel appointment"
      )
    );
    // dispatch(appointmentSlice.actions.clearAllErrors());
  }
};

export const switchAppointment = (data) => async (dispatch) => {
  const {
    appointmentId,
    selectedDoctorId,
    newAppointmentDate,
    newAppointmentTime,
    reasonForSwitchDoctor,
    isOnlineOrOffline,
  } = data;

  console.log(
    newAppointmentDate,
    "this is appointment date",
    newAppointmentTime,
    "this is appointment time"
  );
  dispatch(appointmentSlice.actions.requestForSwitchAppointment());

  try {
    const response = await axios.post(
      `${BASE_URL}/api/appointment/switch-doctor`,
      {
        appointmentId,
        selectedDoctorId,
        newAppointmentDate,
        newAppointmentTime,
        reasonForSwitchDoctor,
        isOnlineOrOffline,
      }
    );
    console.log("RESPONSE: ", response);
    dispatch(
      appointmentSlice.actions.successForSwitchAppointment(response.data)
    );
    dispatch(appointmentSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      appointmentSlice.actions.failureForSwitchAppointment(
        error.response?.data?.message || "Failed to switch appointment"
      )
    );
  }
};

export const rescheduleAppointment = (data) => async (dispatch) => {
  const {
    appointmentId,
    newAppointmentDate,
    newAppointmentTime,
    isOnlineOrOffline,
  } = data;
  dispatch(appointmentSlice.actions.requestForRescheduleAppointment());

  try {
    const response = await axios.post(
      `${BASE_URL}/api/appointment/reschedule-appointment`,
      {
        appointmentId,
        newAppointmentDate,
        newAppointmentTime,
        isOnlineOrOffline,
      }
    );
    dispatch(
      appointmentSlice.actions.successForRescheduleAppointment(response.data)
    );
    dispatch(appointmentSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      appointmentSlice.actions.failureForRescheduleAppointment(
        error.response?.data?.message || "Failed to reschedule appointment"
      )
    );
  }
};

export const getAllAppointmentsByEmailOnlyDiagnosis =
  (patientEmail) => async (dispatch) => {
    dispatch(appointmentSlice.actions.requestForAllAppointmentDiagnosis());

    try {
      const response = await axios.get(
        `${BASE_URL}/api/appointment/appointment/${patientEmail}`
      );
      dispatch(
        appointmentSlice.actions.successForAllAppointmentDiagnosis(
          response.data.appointments
        )
      );
      dispatch(appointmentSlice.actions.clearAllErrors());
    } catch (error) {
      dispatch(
        appointmentSlice.actions.failureForAllAppointmentDiagnosis(
          error.response?.data?.message ||
            "Failed to fetch diagnosis appointments"
        )
      );
    }
  };

// Additional Actions for Resetting and Clearing
export const clearAppointmentErrors = () => (dispatch) => {
  dispatch(appointmentSlice.actions.clearAllErrors());
};

export const resetAppointmentSlice = () => (dispatch) => {
  dispatch(appointmentSlice.actions.resetAppointmentSlice());
};

export const clearAllAppointmentMessages = () => (dispatch) => {
  dispatch(appointmentSlice.actions.clearAllMessages());
};

export default appointmentSlice.reducer;
