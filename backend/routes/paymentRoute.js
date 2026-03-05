import express from "express";
import paymentController, {
  getPayment,
} from "../controllers/paymentController.js";
const paymentRouter = express.Router();

// app.post("/payment-information", paymentController);
paymentRouter.get("/payment-information", getPayment);

export default paymentRouter;