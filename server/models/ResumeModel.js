import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  fileUrl: { type: String, required: true },
  name: { type: String},
  phone: { type: String },
  email: { type: String },
  skillScore: { type: Number },
  workScore: { type: Number },
  educationScore: { type: Number },
  similarityScore: { type: Number },
  averageScore: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;