import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_KEY;
export const paymentInformation = async (paymentInfo) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/payment-information`,
      paymentInfo,
      { headers: { "Content-Type": "application/json" } }
    );
    // dispatch(appointmentSlice.actions.successForAppointmentBooking(response.data.appointment));
    // dispatch(appointmentSlice.actions.clearAllErrors());
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};
