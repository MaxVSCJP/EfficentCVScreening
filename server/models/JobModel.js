import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  skills: {type: Map, of: Number},
  workExperienceYears: { type: Number },
  eduacationLevel: { type: Number },
  educationField: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);
