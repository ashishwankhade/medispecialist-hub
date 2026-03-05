import sendEmailNotification from "../middleware/sendEmailNotification.js";
import nodemailer from "nodemailer";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import {
  appointmentSchema,
  cancelAppointmentSchema,
  rescheduleAppointmentSchema,
  switchDoctorAppointmentSchema,
} from "../middleware/validator.js";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import getNextAppointmentNumber from "../utils/getNextAppointmentNumber.js";

import formatAppointmentDate from "../utils/formatAppointmentDate.js";
import axios from "axios";

const bookAppointment = async (req, res) => {
  let pdfUrl = null; // Initialize with null

  try {
    // Check if there's a file in the request
    const {
      doctorObjectId,
      patientEmailId,
      patientName,
      patientMobileNo,
      patientLocation,
      patientProblemDesc,
      appointmentDate,
      appointmentTime,
      consentFormReadSignedAgreed,
      paymentStatus,
      orderId,
      Sex,
    } = req.body;

    // Validate input data, including the new field
    const { error, value } = appointmentSchema.validate({
      doctorObjectId,
      patientEmailId,
      patientName,
      patientMobileNo,
      patientLocation,
      patientProblemDesc,
      appointmentDate,
      appointmentTime,
      consentFormReadSignedAgreed,
      Sex,
    });

    if (error) {
      return res
        .status(402)
        .json({ success: false, message: error.details[0].message });
    }

    // Check if the doctor exists and is registered by the admin
    const doctorData = await doctorModel
      .findById(doctorObjectId)
      .select("-password");

    if (!doctorData) {
      return res.status(401).json({
        success: false,
        message: "This doctor is not registered by admin!",
      });
    }

    if (!doctorData.available) {
      return res
        .status(401)
        .json({ success: false, message: "Doctor Not Available!" });
    }

    // Check if the slot is available for this doctor
    let slots_booked = doctorData.slots_booked || {};
    if (slots_booked[appointmentDate]) {
      if (slots_booked[appointmentDate].includes(appointmentTime)) {
        return res
          .status(401)
          .json({ success: false, message: "Slot Not Available!" });
      } else {
        slots_booked[appointmentDate].push(appointmentTime);
      }
    } else {
      slots_booked[appointmentDate] = [];
      slots_booked[appointmentDate].push(appointmentTime);
    }

    // Update the doctor's booked slots
    await doctorModel.findByIdAndUpdate(doctorObjectId, { slots_booked });

    if (req.file && req.file.path) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          req.file.path,
          {
            resource_type: "raw",
            folder: "clientReportPDF",
          }
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
          fs.unlinkSync(req.file.path); // Delete local file in case of failure
          return res.status(400).json({
            success: false,
            message: "Failed to upload PDF to Cloudinary",
          });
        }

        // Delete the PDF file from local storage after upload
        fs.unlinkSync(req.file.path);

        // Set the Cloudinary PDF URL
        pdfUrl = cloudinaryResponse.secure_url;
      } catch (uploadError) {
        // If file exists but upload fails, clean up and continue without the file
        if (req.file.path) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (err) {
            /* ignore cleanup errors */
          }
        }
        console.error("Error uploading file:", uploadError);
        // Continue without file instead of failing the whole appointment
      }
    }

    // Get the next appointment number
    const appointmentNumber = await getNextAppointmentNumber();

    // Save the new appointment
    const appointmentData = {
      appointmentNumber,
      doctorObjectId,
      patientEmailId,
      patientName,
      patientMobileNo,
      patientLocation,
      patientProblemDesc,
      appointmentDate,
      appointmentTime,
      consentFormReadSignedAgreed,
      pdf: pdfUrl, // Now this will be null if no file was uploaded
      Sex,
      doctorData,
      paymentStatus,
      orderId,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment Booked Successfully",
      appointment: newAppointment,
    });

    //send gmail to client for booking
    await sendEmailNotification(
      newAppointment.patientEmailId,
      "Appointment Confirmation",
      `"Thank you for visiting " Your appointment is confirmed. Your appointment ID is ${newAppointment.appointmentNumber
      }, and counsellor is ${doctorData.doctorName
      }. Appointment date is ${formatAppointmentDate(
        appointmentDate
      )}, and appointment time is ${appointmentTime}.`
    );
  } catch (error) {
    // If there was a file upload in progress, clean up
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        /* ignore cleanup errors */
      }
    }

    res.status(500).json({
      success: false,
      message: `Error in Booking Appointment: ${error.message}`,
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // Validate input data
    const { error, value } = cancelAppointmentSchema.validate({
      appointmentId,
    });

    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    // Find the appointment by ID
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Check if the appointment is already cancelled
    if (appointment.isAppointmentCancelled) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment is already cancelled" });
    }

    // Check if onlineTestIds length is greater than 0
    if (appointment.onlineTestIds.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment cannot be cancelled as there are associated online tests",
      });
    }

    const now = new Date();
    console.log(now, "this is now");

    // Split the `DD_MM_YYYY` format into its parts
    let [day, month, year] = appointment.appointmentDate.split("_").map(Number); // Extract day, month, year

    // Create a Date object using the extracted day, month (subtracting 1 since months are 0-indexed), and year
    const formattedAppointmentDate = new Date(year, month - 1, day);

    console.log(formattedAppointmentDate, "this is formatted date");
    // Log the raw appointment time
    console.log(appointment.appointmentTime, "appointment time");

    // Parse the appointment time in "hh:mm AM/PM" format
    let [time, modifier] = appointment.appointmentTime.split(" "); // Split time from AM/PM
    let [hours, minutes] = time.split(":").map(Number); // Split hours and minutes

    // Adjust hours for 24-hour format
    if (modifier === "PM" && hours < 12) {
      hours += 12; // Convert PM hour to 24-hour format
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0; // Midnight case
    }

    // Log the parsed hours and minutes
    console.log(hours, "hours");
    console.log(minutes, "minutes");

    // Check for NaN values
    if (isNaN(hours) || isNaN(minutes)) {
      console.error("Parsed hours or minutes are NaN:", { hours, minutes });
      return res
        .status(400)
        .json({ success: false, message: "Invalid appointment time values" });
    }

    // Set the hours and minutes for the date object
    formattedAppointmentDate.setHours(hours, minutes, 0, 0);

    console.log(formattedAppointmentDate, "appointment date time");

    // Calculate the difference in hours
    const hoursDifference = (formattedAppointmentDate - now) / (1000 * 60 * 60); // Difference in hours
    console.log("hoursDifference", hoursDifference);

    if (hoursDifference <= 6) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment cannot be cancelled within 6 hours of the scheduled time",
      });
    }

    appointment.isAppointmentCancelled = true;
    appointment.appointmentCancelledDateTimeStamp = now;
    await appointment.save();

    // Free up the slot in the doctor's schedule
    const doctorData = await doctorModel.findById(appointment.doctorObjectId);

    if (!doctorData) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const slotsBooked = doctorData.slots_booked || {};
    if (slotsBooked[appointment.appointmentDate]) {
      slotsBooked[appointment.appointmentDate] = slotsBooked[
        appointment.appointmentDate
      ].filter((time) => time !== appointment.appointmentTime);
      await doctorModel.findByIdAndUpdate(appointment.doctorObjectId, {
        slots_booked: slotsBooked,
      });
    }

    // Optionally: Send an email notification for cancellation
    // await sendEmailNotification(appointment.patientEmaild, 'Appointment Cancelled', 'Your appointment has been successfully cancelled.');
    res
      .status(200)
      .json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Error in cancelling appointment: ${error.message}`,
    });
  }
};

const rescheduleAppointment = async (req, res) => {
  try {
    const {
      appointmentId,
      newAppointmentDate,
      newAppointmentTime,
      isOnlineOrOffline,
    } = req.body;

    // Validate the input data
    const { error, value } = rescheduleAppointmentSchema.validate({
      appointmentId,
      newAppointmentDate,
      newAppointmentTime,
      isOnlineOrOffline,
    });

    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    // Find the appointment by its ObjectId
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Check if the appointment is already cancelled
    if (appointment.isAppointmentCancelled) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment is already cancelled" });
    }

    // Check if the appointment has already been rescheduled
    if (appointment.isAppointmentRescheduled) {
      return res.status(400).json({
        success: false,
        message: "Appointment has already been rescheduled",
      });
    }

    // Check if onlineTestIds length is greater than 0
    if (appointment.onlineTestIds.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment cannot be rescheduled as there are associated online tests",
      });
    }

    // Find the doctor data using doctorObjectId
    const doctorData = await doctorModel.findById(appointment.doctorObjectId);

    if (!doctorData) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // Check if the new slot is available for the doctor
    let slots_booked = doctorData.slots_booked;

    if (
      slots_booked[newAppointmentDate] &&
      slots_booked[newAppointmentDate].includes(newAppointmentTime)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "The new slot is not available" });
    }

    // Free up the old slot
    if (slots_booked[appointment.appointmentDate]) {
      slots_booked[appointment.appointmentDate] = slots_booked[
        appointment.appointmentDate
      ].filter((time) => time !== appointment.appointmentTime);
    }

    // Book the new slot
    if (!slots_booked[newAppointmentDate]) {
      slots_booked[newAppointmentDate] = [];
    }
    slots_booked[newAppointmentDate].push(newAppointmentTime);

    // Update the doctor's booked slots
    await doctorModel.findByIdAndUpdate(appointment.doctorObjectId, {
      slots_booked,
    });

    // Update the appointment details with the new date and time, and mark as rescheduled
    appointment.appointmentDate = newAppointmentDate;
    appointment.appointmentTime = newAppointmentTime;
    appointment.isAppointmentRescheduled = true;
    appointment.isOnlineOrOffline = isOnlineOrOffline;
    appointment.appointmentRescheduledDateTimeStamp = new Date(); // Set the reschedule timestamp
    await appointment.save();

    res
      .status(200)
      .json({ success: true, message: "Appointment rescheduled successfully" });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error in rescheduling appointment: ${error.message}`,
    });
  }
};

const switchDoctorAppointment = async (req, res) => {
  try {
    const {
      appointmentId,
      selectedDoctorId,
      newAppointmentDate,
      newAppointmentTime,
      reasonForSwitchDoctor,
      isOnlineOrOffline,
    } = req.body;
    console.log(req.body, "all data of switchappointment");
    console.log(
      appointmentId,
      selectedDoctorId,
      newAppointmentDate,
      newAppointmentTime,
      reasonForSwitchDoctor,
      isOnlineOrOffline,
      "all data of switchappointment"
    );

    // Validate the input data (assuming Joi schema is predefined for validation)
    const { error } = switchDoctorAppointmentSchema.validate({
      appointmentId,
      selectedDoctorId,
      newAppointmentDate,
      newAppointmentTime,
      reasonForSwitchDoctor,
      isOnlineOrOffline,
    });

    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    // Find the existing appointment using appointmentId
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or already cancelled",
      });
    }

    // Check if the doctor has already been switched for this appointment
    if (appointment.isSwitchedDoctor) {
      return res.status(400).json({
        success: false,
        message: "Counsellor has already been switched for this appointment",
      });
    }

    // Check if onlineTestIds length is greater than 0
    if (appointment.onlineTestIds.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment cannot be switch as there are associated online tests",
      });
    }

    // Free up the old doctor's slot
    const oldDoctorData = await doctorModel.findById(
      appointment.doctorObjectId
    );
    if (!oldDoctorData) {
      return res
        .status(404)
        .json({ success: false, message: "Old Counsellor not found" });
    }

    let oldDoctorSlotsBooked = oldDoctorData.slots_booked || {};
    if (oldDoctorSlotsBooked[appointment.appointmentDate]) {
      oldDoctorSlotsBooked[appointment.appointmentDate] = oldDoctorSlotsBooked[
        appointment.appointmentDate
      ].filter((time) => time !== appointment.appointmentTime);
    }

    // Update the old doctor's slots
    await doctorModel.findByIdAndUpdate(appointment.doctorObjectId, {
      slots_booked: oldDoctorSlotsBooked,
    });

    // Book the new doctor's slot
    const newDoctorData = await doctorModel.findById(selectedDoctorId);
    if (!newDoctorData) {
      return res
        .status(404)
        .json({ success: false, message: "New doctor not found" });
    }

    let newDoctorSlotsBooked = newDoctorData.slots_booked || {};
    if (
      newDoctorSlotsBooked[newAppointmentDate] &&
      newDoctorSlotsBooked[newAppointmentDate].includes(newAppointmentTime)
    ) {
      return res.status(400).json({
        success: false,
        message: "The new doctor is not available at the requested time",
      });
    }

    if (!newDoctorSlotsBooked[newAppointmentDate]) {
      newDoctorSlotsBooked[newAppointmentDate] = [];
    }
    newDoctorSlotsBooked[newAppointmentDate].push(newAppointmentTime);

    // Update the new doctor's slots
    await doctorModel.findByIdAndUpdate(newDoctorData._id, {
      slots_booked: newDoctorSlotsBooked,
    });

    // Update the appointment with the new doctor, new date, and time, and mark it as switched
    appointment.doctorObjectId = newDoctorData._id;
    appointment.doctorData = newDoctorData;
    appointment.appointmentDate = newAppointmentDate;
    appointment.appointmentTime = newAppointmentTime;
    appointment.reasonForSwitchDoctor = reasonForSwitchDoctor;
    appointment.isSwitchedDoctor = true;
    appointment.isSwitchedDoctorDateTimeStamp = new Date(); // Log the time of the switch
    // appointment.isOnlineOrOffline=isOnlineOrOffline;
    await appointment.save();

    // Optionally, send a notification about the doctor switch
    // await sendEmailNotification(appointment.patientEmailId, 'Doctor switched', 'Doctor switched and appointment updated successfully.');

    res.status(200).json({
      success: true,
      message: "Counsellor switched and appointment updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in switching doctor: ${error.message}`,
    });
  }
};

const getAllAppointmentsByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Fetch email from request params
    console.log(email);
    // Fetch all appointments for the given email
    const appointments = await appointmentModel
      .find({
        patientEmailId: email, // Match with the patient's email
        isAppointmentCancelled: false, // Exclude cancelled appointments
      })
      .sort({ appointmentDate: 1 }); // Optional: sort by appointment date in ascending order

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: `Error in fetching appointments: ${error.message}`,
    });
  }
};

const getAllAppointmentsByEmailOnlyDiagnosis = async (req, res) => {
  try {
    const { email } = req.params; // Fetch email from request params
    // Fetch all appointments for the given email where isAppointmentDiagnosised is true
    const appointments = await appointmentModel
      .find({
        patientEmailId: email, // Match with the patient's email
        isAppointmentCancelled: false, // Exclude cancelled appointments
        isAppointmentDiagnosised: true, // Only include diagnosed appointments
      })
      .sort({ appointmentDate: 1 })
      .populate("onlineTestIds"); // Optional: sort by appointment date in ascending order

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No diagnosed appointments found for this email",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Diagnosed appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: `Error in fetching diagnosed appointments: ${error.message}`,
    });
  }
};

export {
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment,
  switchDoctorAppointment,
  getAllAppointmentsByEmail,
  getAllAppointmentsByEmailOnlyDiagnosis,
};
