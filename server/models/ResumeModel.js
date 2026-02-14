import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  uniqueName: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  skillScore: {type: Map, of: Number},
  workScore: { type: Number },
  educationScore: { type: Number },
  averageScore: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const Resume = mongoose.model("Resume", resumeSchema);
