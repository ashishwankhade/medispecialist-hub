import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const detailDiagnosisSlice = createSlice({
  name: "diagnosis",
  initialState: {
    loading: false,
    diagnosis: [],
    error: null,
    message: null,
  },
  reducers: {
    getAlldiagnosisRequest(state, action) {
      state.diagnosis = [];
      state.error = null;
      state.loading = true;
    },
    getAlldiagnosisSuccess(state, action) {
      state.diagnosis = action.payload;
      state.error = null;
      state.loading = false;
    },
    getAlldiagnosisFailed(state, action) {
      state.diagnosis = state.diagnosis;
      state.error = action.payload;
      state.loading = false;
    },

    addNewDetailDiagnosisRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addNewDetailDiagnosisSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    addNewDetailDiagnosisFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    

    deleteSkillRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deletediagnosisuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    deleteSkillFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    updateSkillRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updatediagnosisuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },
    updateSkillFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    resetdetailDiagnosisSlice(state, action) {
      state.error = null;
      state.diagnosis = state.diagnosis;
      state.message = null;
      state.loading = false;
    },
    clearAllErrors(state, action) {
      state.error = null;
      state.diagnosis = state.diagnosis;
    },

    resetAllDiagnosisMessageSlice(state, action) {
    state.message=null;
    state.error = null;
    },
  },
});


const BASE_URL=import.meta.env.VITE_API_KEY;

console.log(import.meta.env.VITE_API_KEY);

// export const getAlldiagnosis = () => async (dispatch) => {
//   dispatch(detailDiagnosisSlice.actions.getAlldiagnosisRequest());
//   try {
//     const response = await axios.get(
//       "https://mern-stack-portfolio-backend-code.onrender.com/api/v1/skill/getall",
//       { withCredentials: true }
//     );
//     dispatch(detailDiagnosisSlice.actions.getAlldiagnosisSuccess(response.data.diagnosis));
//     dispatch(detailDiagnosisSlice.actions.clearAllErrors());
//   } catch (error) {
//     dispatch(
//       detailDiagnosisSlice.actions.getAlldiagnosisFailed(error.response.data.message)
//     );
//   }
// };

export const addNewDetailDiagnosis = (data) => async (dispatch) => {
  console.log("detail diagnosis of patient",data);
  dispatch(detailDiagnosisSlice.actions.addNewDetailDiagnosisRequest());
  try {
    const response = await axios.post(
      `${BASE_URL}/api/doctor/diagnosis`,
      data,
      {
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    console.log(response);
    console.log(response.data.message);
    dispatch(detailDiagnosisSlice.actions.addNewDetailDiagnosisSuccess(response.data.message));
    dispatch(detailDiagnosisSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(detailDiagnosisSlice.actions.addNewDetailDiagnosisFailed(error.response.data.message));
  }
};


export const clearAllSkillErrors = () => (dispatch) => {
  dispatch(detailDiagnosisSlice.actions.clearAllErrors());
};

export const resetdetailDiagnosisSlice = () => (dispatch) => {
  dispatch(detailDiagnosisSlice.actions.resetdetailDiagnosisSlice());
};

export const resetAllDiagnosisMessageSlice = () => (dispatch) => {
  dispatch(detailDiagnosisSlice.actions.resetAllDiagnosisMessageSlice());
};

export default detailDiagnosisSlice.reducer;
