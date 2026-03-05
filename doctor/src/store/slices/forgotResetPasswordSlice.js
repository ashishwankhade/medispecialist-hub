import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const forgotResetPassSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    forgotPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    forgotPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    verifyForgotPasswordCodeRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    verifyForgotPasswordCodeSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    verifyForgotPasswordCodeFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    resetPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    resetPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    clearAllErrors(state) {
      state.error = null;
    },
  },
});


const BASE_URL=import.meta.env.VITE_API_KEY;

console.log(import.meta.env.VITE_API_KEY);

// Forgot password action (sending the code)
export const forgotPassword = (doctorEmailId) => async (dispatch) => {
  try {
    dispatch(forgotResetPassSlice.actions.forgotPasswordRequest());
    const response = await axios.patch(
      `${BASE_URL}/api/doctor/send-forgot-password-code-for-doctor`,
      { doctorEmailId },
      // { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(
      forgotResetPassSlice.actions.forgotPasswordSuccess(response.data.message)
    );
  } catch (error) {
    dispatch(
      forgotResetPassSlice.actions.forgotPasswordFailed(
        error.response?.data?.message || "Error sending forgot password code!"
      )
    );
  }
};

// Verifying the forgot password code and resetting password
export const verifyForgotPasswordCode =
  (doctorEmailId, providedCode, newPassword) => async (dispatch) => {
    try {
      dispatch(forgotResetPassSlice.actions.verifyForgotPasswordCodeRequest());
      const response = await axios.patch(
        `${BASE_URL}/api/doctor/verify-forgot-password-code-for-doctor`,
        { doctorEmailId, providedCode, newPassword },
        // { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      dispatch(
        forgotResetPassSlice.actions.verifyForgotPasswordCodeSuccess(
          response.data.message
        )
      );
    } catch (error) {
      dispatch(
        forgotResetPassSlice.actions.verifyForgotPasswordCodeFailed(
          error.response?.data?.message || "Error verifying the code!"
        )
      );
    }
  };

// Reset password action
export const resetPassword =
  (token, password, confirmPassword) => async (dispatch) => {
    try {
      dispatch(forgotResetPassSlice.actions.resetPasswordRequest());
      const response = await axios.put(
        `https://mern-stack-portfolio-backend-code.onrender.com/api/v1/doctor/password/reset/${token}`,
        { password, confirmPassword },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(
        forgotResetPassSlice.actions.resetPasswordSuccess(response.data.message)
      );
    } catch (error) {
      dispatch(
        forgotResetPassSlice.actions.resetPasswordFailed(
          error.response?.data?.message || "Error resetting the password!"
        )
      );
    }
  };

// Clear all errors
export const clearAllForgotResetPassErrors = () => (dispatch) => {
  dispatch(forgotResetPassSlice.actions.clearAllErrors());
};

export default forgotResetPassSlice.reducer;
