import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";




const onlineTestsSlice = createSlice({
  name: "onlineTests",
  initialState: {
    loading: false,
    onlineTests : [],
    error: null,
    message: null,
  },
  reducers: {
    getAllonlineTestsRequest(state, action) {
      state.onlineTests  = [];
      state.error = null;
      state.loading = true;
    },
    getAllonlineTestsSuccess(state, action) {
      state.onlineTests  = action.payload;
      state.error = null;
      state.loading = false;
    },
    getAllonlineTestsFailed(state, action) {
      state.onlineTests  = state.onlineTests ;
      state.error = action.payload;
      state.loading = false;
    },
    deleteMessageRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteonlineTestsuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    deleteMessageFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    resetonlineTestsSlice(state, action) {
      state.error = null;
      state.onlineTests  = state.onlineTests ;
      state.message = null;
      state.loading = false;
    },
    clearAllErrors(state, action) {
      state.error = null;
      state.onlineTests  = state.onlineTests ;
    },
  },
});


const BASE_URL=import.meta.env.VITE_API_KEY;

console.log(import.meta.env.VITE_API_KEY);

export const getAllonlineTests  = () => async (dispatch) => {
  dispatch(onlineTestsSlice.actions.getAllonlineTestsRequest());
  try {
    const response = await axios.get(
      `${BASE_URL}/api/doctor/get-all-online-tests`,
      { withCredentials: true }
    );
    dispatch(
      onlineTestsSlice.actions.getAllonlineTestsSuccess(response.data.onlineTests)
    );
    dispatch(onlineTestsSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      onlineTestsSlice.actions.getAllonlineTestsFailed(error.response.data.message)
    );
  }
};

export const deleteMessage = (id) => async (dispatch) => {
  dispatch(onlineTestsSlice.actions.deleteMessageRequest());
  try {
    const response = await axios.delete(
      `https://mern-stack-portfolio-backend-code.onrender.com/api/v1/message/delete/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch(onlineTestsSlice.actions.deleteonlineTestsuccess(response.data.message));
    dispatch(onlineTestsSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      onlineTestsSlice.actions.deleteMessageFailed(error.response.data.message)
    );
  }
};

export const clearAllOnlineTestErrors = () => (dispatch) => {
  dispatch(onlineTestsSlice.actions.clearAllErrors());
};


export const resetonlineTestsSlice = () => (dispatch) => {
  dispatch(onlineTestsSlice.actions.resetonlineTestsSlice());
};

export default onlineTestsSlice.reducer;



