import express from 'express';
import { changeDoctorPassword, createDiagnosis, getAppointmentById, getDoctor, getDoctorAppointments, loginDoctor, logoutDoctor,  sendDoctorForgotPasswordCode, sendDoctorVerificationCode, updateAvailability,  updateDoctorProfile, verifyDoctorForgotPasswordCode, verifyDoctorVerificationCode } from '../controllers/doctorController.js';
import { doctorIdentifier } from '../middleware/adminIdentification.js';
import { upload } from '../middleware/multer.js';

const doctorRouter=express.Router();

doctorRouter.post("/login",loginDoctor);

doctorRouter.get("/logout",logoutDoctor);


doctorRouter.get("/get-doctor", doctorIdentifier, getDoctor);

doctorRouter.get("/appointments/:doctorObjectId",getDoctorAppointments);

doctorRouter.put("/profile-update",upload.single('doctorImage'), doctorIdentifier, updateDoctorProfile);

doctorRouter.put('/updateAvailability', doctorIdentifier, updateAvailability);

doctorRouter.get("/appointment/:id",getAppointmentById);
doctorRouter.post("/update-profile",upload.single('image'),doctorIdentifier,updateDoctorProfile);



//sinding verifiaction code
doctorRouter.patch('/send-verification-code-for-doctor',doctorIdentifier,sendDoctorVerificationCode);
doctorRouter.patch('/verify-verification-code-for-doctor',doctorIdentifier,verifyDoctorVerificationCode);
//for changing the password of Admin
doctorRouter.patch('/change-password-for-doctor',doctorIdentifier,changeDoctorPassword);
//for forget password
doctorRouter.patch('/send-forgot-password-code-for-doctor',sendDoctorForgotPasswordCode)
doctorRouter.patch(
	'/verify-forgot-password-code-for-doctor',
	verifyDoctorForgotPasswordCode
);

//diagnosis 
doctorRouter.post("/diagnosis",doctorIdentifier,createDiagnosis);




export default doctorRouter;