import mongoose from "mongoose";
import nodemailer from "nodemailer";
import cron from "node-cron";
import Appointment from "../models/appointmentModel.js"; // Make sure to import your Appointment model
import axios from "axios";
import onlineTestTransactionModel from "../models/onlineTestTransactionModel.js";
import sendEmailNotification from "./sendEmailNotification.js";
// Configure Nodemailer
const transport = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE, // Use your email service
  auth: {
    user: process.env.NODEMAILER_SENDING_EMAIL_ADDRESS, // Your email address
    pass: process.env.NODEMAILER_SENDING_EMAIL_PASSWORD, // Your email password
  },
});

// Function to send an email
const sendEmail = async (email, subject, text) => {
  try {
    await transport.sendMail({
      from: process.env.NODEMAILER_SENDING_EMAIL_ADDRESS, // Correctly using the email address from env
      to: email,
      subject: subject,
      text: text,
    });
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Schedule a cron job to run every minute and check for reminders
cron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log("Node cron is working properly");

  // Fetch all upcoming appointments
  const appointments = await Appointment.find({
    isAppointmentCancelled: false, // Only consider non-cancelled appointments
    appointmentDate: { $exists: true },
    appointmentTime: { $exists: true },
  });

  appointments.forEach(async (appointment) => {
    // Convert appointment date and time to a Date object
    let [day, month, year] = appointment.appointmentDate.split("_").map(Number);
    let [time, modifier] = appointment.appointmentTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Adjust hours for 24-hour format
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);

    // Calculate the time differences
    const diffInMs = appointmentDateTime - now;
    const diffInMinutes = diffInMs / (1000 * 60);

    // Check if it's time to send reminders in the new order
    if (diffInMinutes <= 720 && !appointment.emailReminder12HourSent) {
      await sendEmailNotification(
        appointment.patientEmailId,
        'Rana Hospital Appointment Reminder',
        `Dear ${appointment.patientName},
        This is a reminder that your appointment is in 12 Hours.
        Thank you for choosing Rana Hospital!`
      );
      

      appointment.emailReminder12HourSent = true; // Mark as sent
    } else if (diffInMinutes <= 360 && !appointment.emailReminder6HourSent) {
      await sendEmailNotification(
        appointment.patientEmailId,
        'Rana Hospital Appointment Reminder',
    `Dear ${appointment.patientName},
    This is a reminder that your appointment is in 6 Hours.
     Thank you for choosing Rana Hospital!`
      );

      appointment.emailReminder6HourSent = true; // Mark as sent
    } else if (diffInMinutes <= 30 && !appointment.emailReminder30MinSent) {


// Reminder email logic
await sendEmailNotification(
  appointment.patientEmailId,
  'Rana Hospital Appointment Reminder',
  `Dear ${appointment.patientName},
   This is a reminder that your appointment is in 30 minutes.
   ${
     appointment.isOnlineOrOffline === "online"
       ? `You can join the online meeting using the following link: ${appointment.doctorData.doctorMeetLink}.`
       : `Please visit us at our counsellor office for your appointment.`
   }
   Thank you for choosing Rana Hospital!`
);


      appointment.emailReminder30MinSent = true; // Mark as sent

      //for counsellor remainders 
      // Reminder email logic for counsellor
await sendEmailNotification(
  appointment.doctorData.doctorEmailId,
  'Rana Hospital Appointment Reminder',
  `Dear Counsellor,
   This is a reminder that you have an upcoming appointment with ${appointment.patientName} in 30 minutes.
   ${
     appointment.isOnlineOrOffline === "online"
       ? `The meeting link for the online session is: ${appointment.doctorData.doctorMeetLink}.`
       : `The appointment will be held at the counsellor's office.`
   }
   Thank you for your commitment to Rana Hospital!`
);


    }

    await appointment.save(); // Save changes to the database
  });


  //for sending final report
  const nowdate = new Date();

  console.log("Checking for completed appointments for report generation...");

  // Fetch all closed appointments where the report hasn't been sent
  // const closedAppointments = await Appointment.find({
  //   isAppointmentClosed: true,
  //   isAppointmentClosedDateTimeStamp: { $exists: true },
  //   reportSent: { $ne: true }, // Ensure we don't resend
  // });
  const closedAppointments = await Appointment.find({
    isappointmentClosed: true,
  });

  console.log("this is closed appointment",closedAppointments);

  closedAppointments.forEach(async (appointment) => {
    const closedTimestamp = new Date(appointment.isappointmentClosedDateTimeStamp);

    console.log(closedTimestamp,"this is closed Time stamp");

    const diffInMs = nowdate - closedTimestamp;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInMinutes = diffInMs / (1000 * 60);

    // console.log("this is appointment",appointment)
    if (diffInHours >= 6 && !(appointment.reportSent)) { 
      // if ( diffInMinutes > 1 && !(appointment.reportSent)) {
        console.log("after one minutes");
      // Send the complete analysis report link
      const appointmentId = appointment._id;

      // Fetch the corresponding onlineTestTransaction document
      const onlineTestTransaction = await onlineTestTransactionModel.findOne({
        appointmentId: new mongoose.Types.ObjectId(appointmentId), // Corrected usage
      });

      console.log("this is appointment inside 1 minutes",onlineTestTransaction)
     
      await sendEmailNotification(
        appointment.patientEmailId,
        'Rana Hospital Complete Analysis Report',
    `Dear ${appointment.patientName},
         Your complete analysis report is ready.
         You can download it here: ${onlineTestTransaction.completeAnaylysisReportLink}.
         Thank you for choosing Rana Hospital!`
      );

      // Mark the report as sent
      appointment.reportSent = true;
      await appointment.save();
    }
  });

});

