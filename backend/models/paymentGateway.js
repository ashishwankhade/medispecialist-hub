import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    card_number: {
      type: String,
      required: [true],
    },

    card_type: {
      type: String,
      required: [true],
    },
    card_network: {
      type: String,
      required: [true],
    },
    card_country: {
      type: String,
      required: [true],
    },

    gateway_order_id: {
      type: String,
      required: [true],
    },

    gateway_payment_id: {
      type: String,
      required: [true],
    },

    gateway_name: {
      type: String,
      required: [true],
    },

    payment_status: {
      type: String,
      required: [true],
    },

    // payment_id: {
    //   type: String,
    //   required: [true]
    // },

    order_id: {
      type: String,
      required: [true],
    },

    // payment_timestamp_date: {
    //   type: Date,
    // },

    payment_amount: {
      type: Number,
      required: [true],
    },

    payment_completion_time: {
      type: Date,
      required: [true],
    },

    client_name: {
      type: String,
      required: [true],
    },

    client_email: {
      type: String,
      required: [true],
    },

    client_phone: {
      type: String,
      required: [true],
    },

    payment_group: {
      type: String,
      required: [true],
    },
    appointmentId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

const paymentModel =
  mongoose.models.payment || mongoose.model("payment", paymentSchema);
export default paymentModel;
