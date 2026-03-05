import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";



const BASE_URL = import.meta.env.VITE_API_KEY;
// Initial state for the onlineTests slice

const initialState = {
  onlineTests: [],
  loading: false,
  error: null,
  message: null,
};

// onlineTests slice
const onlineTestSlice = createSlice({
  name: "onlineTests",
  initialState,
  reducers: {
    // Action to initiate the request
    requestForOnlineTest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    // Action to handle success
    successForOnlineTest: (state, action) => {
      state.loading = false;
      // state.onlineTests = action.payload;
      state.error = null;
      state.message = action.payload;;
    },

    // Action to handle failure
    failureForOnlineTest: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    // Action to clear all errors
    clearAllErrors: (state) => {
      state.error = null;
    },

    // Action to clear all messages
    clearAllMessages: (state) => {
      state.message = null;
    },

    // Action to reset the slice
    resetOnlineTestSlice: (state) => {
      state.loading = false;
      state.onlineTests = [];
      state.error = null;
      state.message = null;
    },
  },
});

// Asynchronous thunk action for uploading PDF
export const onlineTest = (formData) => async (dispatch) => {
  dispatch(onlineTestSlice.actions.requestForOnlineTest());
  console.log(formData, "This is form data in Redux Toolkit");

  try {
    // Make API call to upload the PDF
    const response = await axios.post(
      `${BASE_URL}/api/appointment/appointment/sendQuetionspdf`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    // Dispatch success action with API response data
    dispatch(onlineTestSlice.actions.successForOnlineTest(response.data.message));
    console.log("Online test submitted successfully:", response.data);

    // Clear errors after success
    dispatch(onlineTestSlice.actions.clearAllErrors());
  } catch (error) {
    // Handle error response and dispatch failure action
    dispatch(
      onlineTestSlice.actions.failureForOnlineTest(
        error.response?.data?.message || "Something went wrong"
      )
    );
    console.error("Error submitting online test:", error);
  }
};

// Action to clear errors
export const clearOnlineErrors = () => (dispatch) => {
  console.log("Clearing all errors");
  dispatch(onlineTestSlice.actions.clearAllErrors());
};

// Action to reset the online test slice
export const resetOnlineTestSlice = () => (dispatch) => {
  dispatch(onlineTestSlice.actions.resetOnlineTestSlice());
};

// Action to clear all messages
export const clearAllOnlineTestMessages = () => (dispatch) => {
  dispatch(onlineTestSlice.actions.clearAllMessages());
};

export default onlineTestSlice.reducer;
