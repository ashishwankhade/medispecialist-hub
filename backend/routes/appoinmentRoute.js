import express from 'express';
import { bookAppointment, cancelAppointment, rescheduleAppointment ,switchDoctorAppointment,getAllAppointmentsByEmail, getAllAppointmentsByEmailOnlyDiagnosis, } from '../controllers/appointmentController.js';
import { upload } from '../middleware/multer.js';
const appointmentRouter=express.Router();

appointmentRouter.post("/book-appointment",upload.single('reportPdf'),bookAppointment);
appointmentRouter.post("/cancel-appointment",cancelAppointment);
appointmentRouter.post("/reschedule-appointment",rescheduleAppointment);
appointmentRouter.post("/switch-doctor",switchDoctorAppointment);

appointmentRouter.get('/appointments/:email', getAllAppointmentsByEmail);

appointmentRouter.get('/appointment/:email', getAllAppointmentsByEmailOnlyDiagnosis);


export default appointmentRouter;