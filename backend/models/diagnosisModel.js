import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema({
  appointmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Appointment", 
    required: true 
  },
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "doctor", 
    required: true 
  },
  
  // Patient basic details
  age: { type: Number },
  sex: { type: String },
  education: { type: String },
  occupation: { type: String },
  maritalStatus: { type: String },
  residence: { type: String },
  family: { type: String },
  membersInFamily: { type: Number },

  // Medical details and prescription
  diagnosis: { type: String },
  symptoms: [{ type: String }],
  prescriptions: [{
    medicationName: { type: String },
    dosage: { type: String },
    frequency: { type: String },
    duration: { type: String },
    instructions: { type: String }
  }],
  
  // Additional medical recommendations
  lifestyle: { type: String },
  dietaryRestrictions: { type: String },
  followUpDate: { type: Date },
  labTests: [{
    testName: { type: String },
    instructions: { type: String },
    required: { type: Boolean, default: false }
  }],
  
  // Notes
  doctorNotes: { type: String },
  treatmentPlan: { type: String },
  
  reportPdfUrl:{type:String},
}, {
  timestamps: true,
});

const diagnosisModel = mongoose.models.diagnosis || mongoose.model("diagnosis", diagnosisSchema);
export default diagnosisModel;