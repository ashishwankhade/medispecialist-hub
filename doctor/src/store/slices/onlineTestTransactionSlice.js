import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state for the onlineTestsTransaction slice
const initialState = {
  onlineTestsTransaction: [],
  loading: false,
  error: null,
  message: null,
};

// onlineTestsTransaction slice
const onlineTestTransactionSlice = createSlice({
  name: "onlineTestsTransaction",
  initialState,
  reducers: {
    requestForOnlineTestTransaction: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForOnlineTestTransaction: (state, action) => {
      state.loading = false;
      state.onlineTestsTransaction = action.payload;
      state.error = null;
    },
    failureForOnlineTestTransaction: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    updateCounsellorRemarksSuccess: (state, action) => {
      const { testId, counsellorRemarks } = action.payload;
      const testIndex = state.onlineTestsTransaction.findIndex(
        (test) => test.onlineTestId === testId
      );
      if (testIndex >= 0) {
        state.onlineTestsTransaction[testIndex].counsellorRemarks = counsellorRemarks;
      }
      state.message = "Counsellor remarks updated successfully";
    },
    updateCounsellorRemarksFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearAllErrors: (state) => {
      state.error = null;
    },
    clearAllMessages: (state) => {
      state.message = null;
    },
    resetOnlineTestTransactionSlice: (state) => {
      state.loading = false;
      state.onlineTestsTransaction = [];
      state.error = null;
      state.message = null;
    },
  },
});

const BASE_URL=import.meta.env.VITE_API_KEY;

console.log(import.meta.env.VITE_API_KEY);


export const getOnlineTestTransaction = (id) => async (dispatch) => {
  dispatch(onlineTestTransactionSlice.actions.requestForOnlineTestTransaction());

  try {
    const response = await axios.get(
      `${BASE_URL}/api/doctor/get-all-online-tests-completes`,
      {
        params: { appointmentId: id },
        withCredentials: true,
      }
    );
    
    dispatch(
      onlineTestTransactionSlice.actions.successForOnlineTestTransaction(
        response.data.onlineTests
      )
    );
    dispatch(onlineTestTransactionSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      onlineTestTransactionSlice.actions.failureForOnlineTestTransaction(
        error.response?.data?.message || "Something went wrong"
      )
    );
  }
};

export const updateCounsellorRemarks = (testId, counsellorRemarks) => async (dispatch) => {
  try {

    console.log("this is something",testId,"this is testId",counsellorRemarks,"this is counsellor remark");
    const response = await axios.put(
      // /online-test-transaction/:transactionId/consular-remarks
      `${BASE_URL}/api/doctor/online-test-transaction/${testId}/consular-remarks`,
      { counsellorRemarks },
      { withCredentials: true }
    );


    dispatch(
      onlineTestTransactionSlice.actions.updateCounsellorRemarksSuccess({
        testId,
        counsellorRemarks: response.data.updatedCounsellorRemarks,
      })
    );
    dispatch(onlineTestTransactionSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      onlineTestTransactionSlice.actions.updateCounsellorRemarksFailure(
        error.response?.data?.message || "Failed to update counsellor remarks"
      )
    );
  }
};

export const clearOnlineErrors = () => (dispatch) => {
  dispatch(onlineTestTransactionSlice.actions.clearAllErrors());
};

export const resetOnlineTestTransactionSlice = () => (dispatch) => {
  dispatch(onlineTestTransactionSlice.actions.resetOnlineTestTransactionSlice());
};

export const clearAllOnlineTestMessages = () => (dispatch) => {
  dispatch(onlineTestTransactionSlice.actions.clearAllMessages());
};

export default onlineTestTransactionSlice.reducer;
