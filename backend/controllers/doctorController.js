import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import sendEmailNotification from "../middleware/sendEmailNotification.js";
import {
  comparePassword,
  hashPassword,
  hmacProcess,
} from "../utils/hashing.js"; // assuming you have these utility functions
import {
  loginSchema,
  changePasswordSchema,
  sendVerificationCodeSchema,
  acceptCodeSchema,
  sendForgotPasswordCodeSchema,
  acceptFPCodeSchema,
  diagnosisSchema,
} from "../middleware/validator.js"; //
import appointmentModel from "../models/appointmentModel.js";
import transport from "../middleware/sendMail.js";
import { updateDoctorSchema } from "../middleware/validator.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import diagnosisModel from "../models/diagnosisModel.js";
import axios from "axios";
// Doctor Login
const loginDoctor = async (req, res) => {
  const { doctorEmailId, password } = req.body;
  try {
    const { error } = loginSchema.validate({ doctorEmailId, password });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const existingDoctor = await doctorModel
      .findOne({ doctorEmailId })
      .select("+password");

    if (!existingDoctor) {
      return res.status(401).json({
        success: false,
        message: "You are not registered as a doctor!",
      });
    }

    const result = await comparePassword(password, existingDoctor.password);
    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      {
        doctorId: existingDoctor._id,
        doctorEmailId: existingDoctor.doctorEmailId,
        verified: existingDoctor.verified,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRE }
    );

    res
      .cookie("Authorization", "Bearer " + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        // httpOnly: process.env.NODE_ENV === 'production',
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        token,
        message: "Logged in successfully",
        existingDoctor,
      });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong in doctor login",
    });
  }
};

const getDoctor = async (req, res) => {
  try {
    // Extract the userId from the token or session
    const doctorId = req.doctor.doctorId; // Assuming the userId is attached to the request via authentication middleware

    // Fetch the user using the userId from the database
    const existingDoctor = await doctorModel.findById(doctorId); // Replace `userModel` with the correct model (e.g., doctorModel if it's for doctors)

    if (!existingDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // If you need to include image data like in the doctor profile, handle it here
    // You can add any necessary logic to return image data or any other fields

    // Return the user data as a response
    return res.status(200).json({
      success: true,
      existingDoctor, // This will include all user data fetched from the database
    });
  } catch (error) {
    // Handle any errors during fetching user data
    console.error("Error fetching user data: ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message + " in catch block of getUser function",
    });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    // Extract the appointment ID from the request parameters
    const appointmentId = req.params.id; // Assuming appointment ID is passed in the URL as a parameter

    // Fetch the appointment using the appointment ID from the database
    const existingAppointment = await appointmentModel.findById(appointmentId);

    if (!existingAppointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // If appointment is found, return the appointment data as a response
    return res.status(200).json({
      success: true,
      appointment: existingAppointment,
    });
  } catch (error) {
    // Handle any errors during the fetching process
    console.error("Error fetching appointment data: ", error.message);
    return res.status(500).json({
      success: false,
      message: `Error occurred: ${error.message}`,
    });
  }
};

// Doctor Logout
const logoutDoctor = async (req, res) => {
  res
    .clearCookie("Authorization")
    .status(200)
    .json({ success: true, message: "Logged out successfully " });
};
const updateDoctorProfile = async (req, res) => {
  const {
    doctorName,
    doctorEmailId,
    doctorSpecialisation,
    doctorQualifications,
    experience,
    about,
    doctorLocation,
    doctorAddress,
    doctorMobileNo,
    doctorWhatsappNo,
    doctorMeetLink,
  } = req.body;
  console.log(req.doctor.doctorId, "this is doctor data from cookies");

  const doctorId = req.doctor.doctorId; // Get doctorId from the token
  try {
    // Fetch the doctor using doctorId
    const existingDoctor = await doctorModel.findById(doctorId);
    if (!existingDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // Validate incoming data
    const { error, value } = updateDoctorSchema.validate({
      doctorName,
      doctorEmailId,
      doctorSpecialisation,
      doctorQualifications,
      experience,
      about,
      doctorLocation,
      doctorAddress,
      doctorMobileNo,
      doctorWhatsappNo,
      doctorMeetLink,
    });

    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    // Update doctor data
    const doctorData = {
      doctorName,
      doctorEmailId,
      doctorSpecialisation,
      doctorQualifications,
      experience,
      about,
      doctorLocation,
      doctorAddress,
      doctorMobileNo,
      doctorWhatsappNo,
      doctorMeetLink,
      date: Date.now(), // Update date on profile change
    };

    // Handle image upload if there’s a new file
    if (req.file) {
      const { path: imageTempPath } = req.file;
      console.log(req.file, "this is image");
      if (imageTempPath) {
        try {
          console.log("Image temp path: ", imageTempPath);

          // Upload new image to Cloudinary
          const cloudinaryResponse = await cloudinary.uploader.upload(
            imageTempPath,
            {
              folder: "DOCTORS_IMAGES",
            }
          );
          console.log(cloudinaryResponse, "this is cloudinary response");
          if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.log("Cloudinary upload failed: ", cloudinaryResponse.error);
            fs.unlinkSync(imageTempPath); // Remove temp file if upload failed
            return res.json({
              success: false,
              message: "Failed to upload image to Cloudinary",
            });
          }

          // Remove the old image from Cloudinary if it exists
          if (
            existingDoctor.doctorImage &&
            existingDoctor.doctorImage.public_id
          ) {
            console.log(
              "Removing old image from Cloudinary:",
              existingDoctor.doctorImage.public_id
            );
            await cloudinary.uploader.destroy(
              existingDoctor.doctorImage.public_id
            );
          }

          // Update doctorImage with new Cloudinary data
          doctorData.doctorImage = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
          };

          console.log(
            "Image uploaded successfully: ",
            cloudinaryResponse.secure_url
          );

          // Remove temporary file from the server
          fs.unlinkSync(imageTempPath);
        } catch (error) {
          console.error("Error uploading image: ", error.message);
          fs.unlinkSync(imageTempPath); // Remove temp file if an error occurs
          return res.json({
            success: false,
            message: "Error occurred while uploading the image",
          });
        }
      }
    }

    // Update the doctor profile in the database
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      doctorData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Doctor profile updated successfully",
      doctor: updatedDoctor,
    });

  } catch (error) {
    console.error("Error in profile update: ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message + " in catch block of doctor profile update",
    });
  }
};


const updateAvailability = async (req, res) => {
  const { holidayStart, holidayEnd } = req.body;
  const doctorId = req.doctor.doctorId; // Assuming doctorId is retrieved from authentication middleware

  console.log(holidayStart, "Vacation dates start");
  console.log(holidayEnd, "Vacation dates end");

  try {
    // Fetch the doctor using doctorId
    const existingDoctor = await doctorModel.findById(doctorId);
    if (!existingDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // Update the doctor's holiday dates
    existingDoctor.holidayStartDate = holidayStart;
    existingDoctor.holidayEndDate = holidayEnd;
    const updatedDoctor = await existingDoctor.save();

    // Fetch all appointments for the doctor
    const appointments = await appointmentModel.find({
      doctorObjectId: doctorId,
    });
    if (appointments.length > 0) {
      // Update the doctorData field in each appointment
      await Promise.all(
        appointments.map(async (appointment) => {
          appointment.doctorData = {
            ...appointment.doctorData,
            holidayStartDate: holidayStart,
            holidayEndDate: holidayEnd,
          };
          await appointment.save();
        })
      );
    }

    return res.json({
      success: true,
      message: "Doctor availability updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Error in updating availability: ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message + " in catch block of update availability",
    });
  }
};

const sendDoctorVerificationCode = async (req, res) => {
  const { doctorEmailId } = req.body;

  try {
    const { error } = sendVerificationCodeSchema.validate({ doctorEmailId });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const existingDoctor = await doctorModel.findOne({ doctorEmailId });
    if (!existingDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor does not exist! " });
    }
    if (existingDoctor.verified) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor is already verified!" });
    }

    const codeValue = Math.floor(100000 + Math.random() * 900000).toString();

    let info = await transport.sendMail({
      from: process.env.NODdoctorEmailIdER_SENDING_doctorEmailId_ADDRESS,
      to: existingDoctor.doctorEmailId,
      subject: "Verification Code",
      html: `<h1>${codeValue}</h1>`,
    });

    if (info.accepted[0] === existingDoctor.doctorEmailId) {
      const hashedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      existingDoctor.verificationCode = hashedCodeValue;
      existingDoctor.verificationCodeValidation = Date.now();
      await existingDoctor.save();

      return res
        .status(200)
        .json({ success: true, message: "Code sent successfully!" });
    }

    res.status(500).json({ success: false, message: "Failed to send code!" });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong in sending verification code!",
    });
  }
};

const verifyDoctorVerificationCode = async (req, res) => {
  const { doctorEmailId, providedCode } = req.body;
  try {
    const { error } = acceptCodeSchema.validate({
      doctorEmailId,
      providedCode,
    });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const codeValue = providedCode.toString();
    const existingDoctor = await doctorModel
      .findOne({ doctorEmailId })
      .select("+verificationCode +verificationCodeValidation");
    if (!existingDoctor) {
      return res
        .status(401)
        .json({ success: false, message: "Doctor does not exist!" });
    }
    if (existingDoctor.verified) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor is already verified!" });
    }

    if (
      Date.now() - existingDoctor.verificationCodeValidation >
      5 * 60 * 1000
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Code has expired!" });
    }

    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );
    if (hashedCodeValue === existingDoctor.verificationCode) {
      existingDoctor.verified = true;
      existingDoctor.verificationCode = undefined;
      existingDoctor.verificationCodeValidation = undefined;
      await existingDoctor.save();

      return res
        .status(200)
        .json({ success: true, message: "Account verified successfully!" });
    }

    res.status(400).json({ success: false, message: "Invalid code provided!" });
  } catch (error) {
    // console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error verifying the code!" });
  }
};

const changeDoctorPassword = async (req, res) => {
  const { doctorId, verified } = req.doctor;
  const { oldPassword, newPassword } = req.body;
  try {
    const { error } = changePasswordSchema.validate({
      oldPassword,
      newPassword,
    });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    if (!verified) {
      return res
        .status(401)
        .json({ success: false, message: "You are not a verified doctor!" });
    }

    const existingDoctor = await doctorModel
      .findOne({ _id: doctorId })
      .select("+password");
    if (!existingDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor does not exist!" });
    }

    const result = await comparePassword(oldPassword, existingDoctor.password);
    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Old password is incorrect!" });
    }

    const hashedPassword = await hashPassword(newPassword, 12);
    existingDoctor.password = hashedPassword;
    await existingDoctor.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    // console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error changing the password!" });
  }
};

import { authenticator } from "otplib";

const sendDoctorForgotPasswordCode = async (req, res) => {
  const { doctorEmailId } = req.body;
  try {
    // Validate input
    const { error } = sendForgotPasswordCodeSchema.validate({ doctorEmailId });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    // Check if the doctor exists
    const existingDoctor = await doctorModel.findOne({ doctorEmailId });
    if (!existingDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor does not exist!" });
    }

    // Generate random 6-digit code
    // const codeValue = Math.floor(Math.random() * 1000000).toString();

    // Configure the authenticator to generate a 6-digit OTP
    authenticator.options = { digits: 6 };

    function generateOTP(secret) {
      return authenticator.generate(secret);
    }

    // You can use a unique secret per user or session
    const secret = authenticator.generateSecret();
    const codeValue = generateOTP(secret); // Example output: "749302"

    let info = await transport.sendMail({
      from: process.env.NODEMAILER_SENDING_EMAIL_ADDRESS,
      to: existingDoctor.doctorEmailId,
      subject: "Password Reset Code",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #1c1c1c; color: #f4f4f4;">
            <h2 style="color: #00ccff; text-align: center;"></h2>
            <h3 style="text-align: center;">Password Reset Request</h3>
            <p>Hello ${existingDoctor.doctorName},</p>
            <p>We received a request to reset your password. Please use the following verification code to proceed with the reset:</p>
            
            <div style="text-align: center; margin: 20px;">
              <span style="font-size: 24px; font-weight: bold; color: #ff6600;">${codeValue}</span>
            </div>
    
            <p>If you did not request a password reset, please disregard this message. Your account remains secure.</p>
    
            <div style="border-top: 1px solid #eaeaea; margin-top: 20px; padding-top: 10px;">
              <p style="font-size: 12px; text-align: center; color: #999;">
                &copy; ${new Date().getFullYear()} . All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    // If the email is accepted, hash the code and store it
    if (info.accepted.includes(existingDoctor.doctorEmailId)) {
      const hashedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      existingDoctor.forgetPasswordCode = hashedCodeValue; // Use the correct field name
      existingDoctor.forgetPasswordCodeValidation = Date.now(); // Use the correct field name

      // Save the updated doctor record
      await existingDoctor.save();

      return res
        .status(200)
        .json({ success: true, message: "Forgot password code sent!" });
    }

    res.status(500).json({
      success: false,
      message: "Failed to send forgot password code!",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error sending forgot password code!" });
  }
};

const verifyDoctorForgotPasswordCode = async (req, res) => {
  const { doctorEmailId, providedCode, newPassword } = req.body;
  console.log(req.body, "this is in doctor verify code ");
  try {
    // Validate input data
    const { error } = acceptFPCodeSchema.validate({
      doctorEmailId,
      providedCode,
      newPassword,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    // Find doctor and include forgot password fields
    const existingDoctor = await doctorModel
      .findOne({ doctorEmailId })
      .select("+forgetPasswordCode +forgetPasswordCodeValidation");

    if (!existingDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor does not exist!" });
    }

    // Check if code is expired (5-minute limit)
    if (
      Date.now() - existingDoctor.forgetPasswordCodeValidation >
      5 * 60 * 1000
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Forgot password code expired!" });
    }

    // Hash the provided code and check if it matches
    const hashedCodeValue = hmacProcess(
      providedCode,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );
    if (hashedCodeValue !== existingDoctor.forgetPasswordCode) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid forgot password code!" });
    }

    // Hash the new password and update the doctor record
    const hashedPassword = await hashPassword(newPassword, 12);
    existingDoctor.password = hashedPassword;
    existingDoctor.forgetPasswordCode = undefined;
    existingDoctor.forgetPasswordCodeValidation = undefined;

    await existingDoctor.save();

    // Send success response
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error resetting the password!" });
  }
};

// Import the appointment model

// Controller to find all appointments for a specific doctor
const getDoctorAppointments = async (req, res) => {
  const { doctorObjectId } = req.params; // Extract doctorObjectId from request parameters
  console.log(doctorObjectId, "this is doctor object id in backend");
  try {
    // Find all appointments where doctorObjectId matches the provided doctorObjectId
    const appointments = await appointmentModel.find({ doctorObjectId });

    // Check if appointments exist
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found for this doctor",
      });
    }

    // Respond with the found appointments
    res.status(200).json({
      success: true,
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching appointments",
    });
  }
};

// const PDFDocument = require('pdfkit');
import PDFDocument from 'pdfkit';

const createDiagnosis = async (req, res) => {
  const {
    appointmentId,
    // Patient basic details
    age,
    sex,
    education,
    occupation,
    maritalStatus,
    residence,
    family,
    membersInFamily,

    // Medical details and prescription
    diagnosis,
    symptoms,
    prescriptions,

    // Additional medical recommendations
    lifestyle,
    dietaryRestrictions,
    followUpDate,
    labTests,

    // Notes
    doctorNotes,
    treatmentPlan,
  } = req.body;

  const doctorId = req.doctor?.doctorId;

  try {
    // Check if the appointment and doctor exist
    const appointment = await appointmentModel.findById(appointmentId);
    const doctor = await doctorModel.findById(doctorId);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    if (appointment.isAppointmentDiagnosised) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment already diagnosed" });
    }

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // Create a new diagnosis entry
    const newDiagnosis = new diagnosisModel({
      appointmentId,
      doctorId,

      // Patient basic details
      age,
      sex,
      education,
      occupation,
      maritalStatus,
      residence,
      family,
      membersInFamily,

      // Medical details and prescription
      diagnosis,
      symptoms: symptoms || [],
      prescriptions: prescriptions || [],

      // Additional medical recommendations
      lifestyle,
      dietaryRestrictions,
      followUpDate,
      labTests: labTests || [],

      // Notes
      doctorNotes,
      treatmentPlan,
    });

    const savedDiagnosis = await newDiagnosis.save();

    // Mark the appointment as diagnosed
    appointment.isAppointmentDiagnosised = true;
    await appointment.save();

    // Generate PDF after saving diagnosis
    // Generate PDF
    const pdfDoc = new PDFDocument();
    const pdfChunks = [];

    pdfDoc.on("data", (chunk) => pdfChunks.push(chunk));
    pdfDoc.on("end", async () => {
      const pdfBuffer = Buffer.concat(pdfChunks);

      try {
        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "raw",
              folder: "DiagnosisReports",
              public_id: `DiagnosisReport_${appointmentId}.pdf`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(pdfBuffer);
        });

        // Update diagnosis record with PDF URL
        savedDiagnosis.reportPdfUrl = result.secure_url;
        await savedDiagnosis.save();

        await sendEmailNotification(
          appointment.patientEmailId,
          "Complete Analysis Report",
          `
          Dear ${appointment.patientName},
        
          Your complete analysis report is ready. 
          You can download it using the link below:
        
          ${savedDiagnosis.reportPdfUrl}
        
          Thank you for choosing us.
        
          Best regards,  
          Rana Hospital Team.
          `
        );
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        // Continue with the response even if PDF generation fails
      }
    });

    // PDF Design
    // Header
    pdfDoc.fillColor("#1573b3").rect(0, 0, pdfDoc.page.width, 60).fill();
    pdfDoc
      .fillColor("#c58700")
      .polygon([0, 60], [pdfDoc.page.width, 10], [pdfDoc.page.width, 60])
      .fill();

    // Logo
    // const imagePath = path.join(__dirname, "images", "Logo.png");
    // pdfDoc.image(imagePath, 50, 70, { height: 70 });

    // Company Information
    pdfDoc
      .fontSize(20)
      .fillColor("#4b1979")
      .font("Helvetica-Bold")
      .text("Rana Hospital", 150, 70, { align: "left" });

    pdfDoc
      .fontSize(10)
      .fillColor("black")
      .text("", 150, 100)
      .text("Maharashtra", 150, 115)
      .text("75458464746    |    ranahospital@gmail.com", 150, 130);

    // Divider
    pdfDoc
      .moveTo(50, 150)
      .lineTo(pdfDoc.page.width - 50, 150)
      .strokeColor("#4b1979")
      .lineWidth(1)
      .stroke()
      .moveDown(3);

    // Watermark
    // pdfDoc.save();
    // pdfDoc.opacity(0.3);
    // pdfDoc.image(imagePath, 200, 300, {
    //   width: 300,
    //   height: 300,
    //   align: "center",
    //   valign: "center"
    // });
    pdfDoc.restore();

    // Patient Information
    pdfDoc
      .fontSize(14)
      .fillColor("black")
      .text("DIAGNOSIS REPORT", { align: "center" })
      .moveDown();

    pdfDoc.fontSize(12).fillColor("#333333");

    // Basic Patient Details
    pdfDoc
      .text("Patient Details:", { underline: true })
      .moveDown(0.5)
      .text(`Appointment Number: ${appointment.appointmentNumber}`)
      .text(`Name: ${appointment.patientName}`)
      .text(`Age: ${age}`)
      .text(`Sex: ${sex}`)
      // .text(`Education: ${education}`)
      // .text(`Occupation: ${occupation}`)
      .text(`Marital Status: ${maritalStatus}`)
      // .text(`Residence: ${residence}`)
      .moveDown();

    // // Family Information
    // pdfDoc.text("Family Information:", { underline: true })
    //   .moveDown(0.5)
    //   .text(`Family Type: ${family}`)
    //   .text(`Members in Family: ${membersInFamily}`)
    //   .moveDown();

    // Medical Details
    pdfDoc
      .text("Medical Information:", { underline: true })
      .moveDown(0.5)
      .text(`Diagnosis: ${diagnosis}`)
      .text("Symptoms:")
      .list(symptoms || [])
      .moveDown();

    // Prescriptions Section
    pdfDoc.text("Prescriptions:", { underline: true }).moveDown(0.5);

    if (Array.isArray(prescriptions) && prescriptions.length > 0) {
      prescriptions.forEach((prescription, index) => {
        pdfDoc
          .text(`${index + 1}. Medication: ${prescription.medicationName}`, {
            indent: 20,
            lineGap: 5,
          })
          .text(`    Dosage: ${prescription.dosage}`, {
            indent: 20,
            lineGap: 5,
          })
          .text(`    Frequency: ${prescription.frequency}`, {
            indent: 20,
            lineGap: 5,
          })
          .text(`    Duration: ${prescription.duration}`, {
            indent: 20,
            lineGap: 5,
          })
          .text(`    Instructions: ${prescription.instructions}`, {
            indent: 20,
            lineGap: 10, // Extra gap after each prescription
          });
      });
    } else {
      pdfDoc.text("No prescriptions provided", { indent: 20 });
    }

    pdfDoc.moveDown();

    // Recommendations
    pdfDoc
      .text("Recommendations:", { underline: true })
      .moveDown(0.5)
      // .text(`Lifestyle Changes: ${lifestyle}`)
      // .text(`Dietary Restrictions: ${dietaryRestrictions}`)
      .text(`Follow-up Date: ${new Date(followUpDate).toLocaleDateString()}`)
      .moveDown();

    // Lab Tests Section
    // if (Array.isArray(labTests) && labTests.length > 0) {
    //   pdfDoc.text("Recommended Lab Tests:", { underline: true }).moveDown(0.5);

    //   labTests.forEach((test, index) => {
    //     pdfDoc
    //       .text(`${index + 1}. Test Name: ${test.testName}`, {
    //         indent: 20,
    //         lineGap: 5,
    //       })
    //       .text(`    Instructions: ${test.instructions}`, {
    //         indent: 20,
    //         lineGap: 5,
    //       })
    //       .text(`    Required: ${test.required ? "Yes" : "No"}`, {
    //         indent: 20,
    //         lineGap: 10, // Extra gap after each test
    //       });
    //   });
    //   pdfDoc.moveDown();
    // } else {
    //   pdfDoc.text("No lab tests recommended", { indent: 20 });
    // }

    pdfDoc.moveDown();

    // Notes
    pdfDoc
      .text("Additional Notes:", { underline: true })
      .moveDown(0.5)
      .text(`Doctor's Notes: ${doctorNotes}`)
      .text(`Treatment Plan: ${treatmentPlan}`)
      .moveDown();

    // Footer
    pdfDoc
      .fontSize(10)
      .text(`Report Generated: ${new Date().toLocaleString()}`, {
        align: "right",
      });

    pdfDoc.end();

    // Return response immediately after saving diagnosis
    return res.status(201).json({
      success: true,
      message: "Diagnosis completed successfully",
      diagnosis: savedDiagnosis,
    });
  } catch (error) {
    console.error("Error creating diagnosis:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};




export {
  loginDoctor,
  getDoctor,
  updateAvailability,
  createDiagnosis,
  getAppointmentById,
  logoutDoctor,
  updateDoctorProfile,
  sendDoctorVerificationCode,
  verifyDoctorVerificationCode,
  changeDoctorPassword,
  sendDoctorForgotPasswordCode,
  verifyDoctorForgotPasswordCode,
  getDoctorAppointments,
};
