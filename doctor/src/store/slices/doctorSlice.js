import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    loading: false,
    doctor: {},
    isAuthenticated: false,
    error: null,
    message: null,
    isUpdated: false,
  },
  reducers: {
    loginRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.doctor = {};
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.doctor = action.payload;
      state.error = null;
      // console.log(state.doctor,"this is in login function to check payload")
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.doctor = {};
      state.error = action.payload;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.doctor = {};
      state.error = null;
      state.message = action.payload;
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = state.isAuthenticated;
      state.doctor = state.doctor;
      state.error = action.payload;
    },
    loaddoctorRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.doctor = {};
      state.error = null;
    },
    loaddoctorSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.doctor = action.payload;
      state.error = null;
    },
    loaddoctorFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.doctor = {};
      state.error = action.payload;
    },
    updatePasswordRequest(state, action) {
      state.loading = true;
      state.isUpdated = false;
      state.message = null;
      state.error = null;
    },
    updatePasswordSuccess(state, action) {
      state.loading = false;
      state.isUpdated = true;
      state.message = action.payload;
      state.error = null;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.isUpdated = false;
      state.message = null;
      state.error = action.payload;
    },
    updateProfileRequest(state, action) {
      state.loading = true;
      state.isUpdated = false;
      state.message = null;
      state.error = null;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.isUpdated = true;
      state.message = action.payload;
      state.error = null;
    },
    updateProfileFailed(state, action) {
      state.loading = false;
      state.isUpdated = false;
      state.message = null;
      state.error = action.payload;
    },
    updateProfileResetAfterUpdate(state, action) {
      state.error = null;
      state.isUpdated = false;
      state.message = null;
    },

    // this is for updating availibility
    updateAvailabilityRequest: (state) => {
      state.loading = true;
    },
    updateAvailabilitySuccess: (state, action) => {
      state.loading = false;
      state.doctor = action.payload; // assuming you want to update the doctor data
    },
    updateAvailabilityFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearAllErrors(state, action) {
      state.error = null;
      state = state.doctor;
    },
    clearAllMessgesOfDoctor(state, action) {
      state.message = null;
      state.error = null;
    },
  },
});

const BASE_URL = import.meta.env.VITE_API_KEY;

console.log(import.meta.env.VITE_API_KEY);
// ${BASE_URL}

export const login = (doctorEmailId, password) => async (dispatch) => {
  dispatch(doctorSlice.actions.loginRequest());
  try {
    const { data } = await axios.post(
      ` ${BASE_URL}/api/doctor/login`,
      { doctorEmailId, password },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    // console.log(data.existingDoctor,"this is inreact redux toolkit existing doctor")
    dispatch(doctorSlice.actions.loginSuccess(data.existingDoctor));
    dispatch(doctorSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(doctorSlice.actions.loginFailed(error.response.data.message));
  }
};

export const getdoctor = () => async (dispatch) => {
  dispatch(doctorSlice.actions.loaddoctorRequest());
  try {
    const { data } = await axios.get(`${BASE_URL}/api/doctor/get-doctor`, {
      withCredentials: true,
    });
    console.log(data);
    dispatch(doctorSlice.actions.loaddoctorSuccess(data.existingDoctor));
    dispatch(doctorSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(doctorSlice.actions.loaddoctorFailed(error.response.data.message));
  }
};

export const logout = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/doctor/logout`, {
      withCredentials: true,
    });
    console.log(data, "data in logout page");
    dispatch(doctorSlice.actions.logoutSuccess(data.message));
    dispatch(doctorSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(doctorSlice.actions.logoutFailed(error.response.data.message));
  }
};

export const updatePassword =
  (currentPassword, newPassword, confirmNewPassword) => async (dispatch) => {
    dispatch(doctorSlice.actions.updatePasswordRequest());
    try {
      const { data } = await axios.put(
        "https://mern-stack-portfolio-backend-code.onrender.com/api/v1/doctor/password/update",
        { currentPassword, newPassword, confirmNewPassword },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(doctorSlice.actions.updatePasswordSuccess(data.message));
      dispatch(doctorSlice.actions.clearAllErrors());
    } catch (error) {
      dispatch(
        doctorSlice.actions.updatePasswordFailed(error.response.data.message)
      );
    }
  };

export const updateProfile = (data) => async (dispatch) => {
  dispatch(doctorSlice.actions.updateProfileRequest());
  try {
    const response = await axios.put(
      `${BASE_URL}/api/doctor/profile-update`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(doctorSlice.actions.updateProfileSuccess(response.data.message));
    dispatch(doctorSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      doctorSlice.actions.updateProfileFailed(error.response.data.message)
    );
  }
};

export const updateAvailability =
  // (isAvailable, startDate, endDate) => async (dispatch) => {
  (startDate, endDate) => async (dispatch) => {
    console.log(startDate,"this start date",endDate,"this is end Date");
    dispatch(doctorSlice.actions.updateAvailabilityRequest());
    // console.log("I am into updateAvailability", isAvailable);
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/doctor/updateAvailability`, // endpoint for updating availability
        {
          // available: isAvailable,
          holidayStart: startDate,
          holidayEnd: endDate,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(doctorSlice.actions.updateAvailabilitySuccess(data.doctor));
      console.log(data.doctor, "this is availibility ");
      dispatch(doctorSlice.actions.clearAllErrors());
    } catch (error) {
      dispatch(
        doctorSlice.actions.updateAvailabilityFailed(
          error.response.data.message
        )
      );
    }
  };

export const resetProfile = () => (dispatch) => {
  dispatch(doctorSlice.actions.updateProfileResetAfterUpdate());
};

export const clearAlldoctorErrors = () => (dispatch) => {
  dispatch(doctorSlice.actions.clearAllErrors());
};

export const clearAlldoctorMessages = () => (dispatch) => {
  dispatch(doctorSlice.actions.clearAllMessgesOfDoctor());
};

export default doctorSlice.reducer;
