const mongoose = require("mongoose");

const evaluationCriteriaSchema = new mongoose.Schema({
  skillWeight: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  experienceWeight: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  educationWeight: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  }
}, { _id: false });

const workExperienceSchema = new mongoose.Schema({
  minYears: {
    type: Number,
    required: true,
    min: 0
  },
  maxYears: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  description: {
    type: String,
    required: true
  },

  requiredSkills: {
    type: [String],
    required: true,
    index: true
  },

  work_experience: {
    type: workExperienceSchema,
    required: true
  },

  education: {
    type: [String],
    required: true
  },

  employmentType: {
    type: String,
    enum: ["full-time", "part-time", "contract", "internship"],
    required: true
  },

  evaluationCriteria: {
    type: evaluationCriteriaSchema,
    required: true
  },

  status: {
    type: String,
    enum: ["open", "closed", "paused"],
    default: "open",
    index: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
