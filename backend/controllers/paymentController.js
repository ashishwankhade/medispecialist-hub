import mongoose from "mongoose";
import paymentModel from "../models/paymentGateway.js";
const paymentController = async (req, res) => {
  try {
    console.log(req.body);
    const {
      order_id,
      payment_amount,
      payment_completion_time,
      payment_group,
      gateway_payment_id,
      payment_status,
      card_number,
      card_type,
      card_network,

      card_country,
      gateway_order_id,
      gateway_name,
      client_name,
      client_email,
      client_phone,

      appointmentId,
    } = req.body;

    const paymentData = {
      order_id: order_id,
      payment_amount: payment_amount,
      payment_group: payment_group,
      gateway_payment_id: gateway_payment_id,
      payment_status: payment_status,
      card_number: card_number,
      card_type: card_type,
      card_network: card_network,
      card_country: card_country,
      gateway_order_id: gateway_order_id,
      gateway_name: gateway_name,
      payment_completion_time: payment_completion_time,
      client_name: client_name,
      client_email: client_email,
      client_phone: client_phone,
      appointmentId: appointmentId,
    };

    const newPayment = new paymentModel(paymentData);
    await newPayment.save();
    res.status(200).json({
      msg: "Data stored ",
    });
  } catch (error) {
    console.error(error);
  }
};
export const getPayment = async (req, res) => {
  try {
    const paymentData = await paymentModel.find();
    if (!paymentData.length) {
      res.status(404).send("No Data Found");
    } else {
      res.status(200).json(paymentData);
    }
  } catch (error) {
    console.error(error);
  }
};
export const checkPayment = async (req, res) => {
  try {
    const ids = req.body.appointmentId;
    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

    const data = await paymentModel.find({
      appointmentId: { $in: objectIds },
    });
    // if (data) {
    //   console.log(data);
    // }
    console.log(objectIds);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
export default paymentController;
