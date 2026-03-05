import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import connectDB from "./config/mongodb.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import appointmentRouter from "./routes/appoinmentRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import paymentController, {
  checkPayment,
} from "./controllers/paymentController.js";
import crypto from "crypto";
import { Cashfree } from "cashfree-pg";
// import { load } from "@cashfreepayments/cashfree-js";

// const crypto = require("crypto");
// const { Cashfree } = require("cashfree-pg");
// import "./middleware/automatedMailSmsWhatsapp.js";

const app = express();
config({ path: "./config/config.env" });

connectDB();
connectCloudinary();

const allowedOrigins = [
  process.env.FRONTEND_URI,
  process.env.FRONTEND_URI_SECOND,
  process.env.FRONTEND_URI_THIRD,
  process.env.FRONTEND_URI_FOURTH
].filter(Boolean); // remove undefined

const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: This origin is not allowed"));
    }
  },
  credentials: true, // if you use cookies / auth
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 

// app.use(cors({
//   origin: ['http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'] // Correct format
// }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;

// Environment.PRODUCTION --> production
// Environment.SANDBOX --> development
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

// generating random order Id
function generateOrderId() {
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256");
  hash.update(uniqueId);
  const orderId = hash.digest("hex");
  return orderId.substring(0, 12);
}

app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/payment-info", paymentRouter);

// Payment Gateway Integration...
// Endpoint the complete payment
app.post("/payment", async (req, res) => {
  let {
    order_amount,
    customer_id,
    customer_phone,
    customer_name,
    customer_email,
  } = req.body;
  try {
    let request = {
      order_amount: parseFloat(order_amount),
      order_currency: "INR",
      order_id: await generateOrderId(),
      customer_details: {
        customer_id: customer_id,
        customer_phone: customer_phone,
        customer_name: customer_name,
        customer_email: customer_email,
      },
    };

    // Setting versioning for cashfree, 2023-08-01
    // Function to create payments
    Cashfree.PGCreateOrder("2023-08-01", request)
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
  }
});
// Endpoint to verify payment
app.post("/verify", async (req, res) => {
  try {
    let { orderId } = req.body;

    // Setting versioning for cashfree, 2023-08-01
    // Function to Fetch payments
    Cashfree.PGOrderFetchPayments("2023-08-01", orderId)
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {}
});

// Endpoint to store completed payment details
app.post("/api/payment-information", async (req, res) => {
  try {
    paymentController(req, res);
  } catch (error) {
    console.error(error);
  }
});

// Endpoint to check payment done during online test
app.post("/api/checkPayment", (req, res) => {
  console.log(req.body);
  try {
    checkPayment(req, res);
  } catch (error) {
    console.error(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`listening... on port ${process.env.PORT}`);
});

config({ path: "./config/config.env" });
