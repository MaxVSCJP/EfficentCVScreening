const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({

  // Candidate basic info
  candidateName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    index: true
  },

  phone: {
    type: String
  },

  // File info (stored in storage, not DB)
  fileName: {
    type: String,
    required: true
  },

  fileUrl: {
    type: String,
    required: true
  },

  fileSize: {
    type: Number
  },

  // Extracted structured data
  extractedData: {
    skills: {
      type: [String],
      default: []
    },

    education: {
      type: [String],
      default: []
    },

    totalExperienceYears: {
      type: Number,
      default: 0
    },

    previousCompanies: {
      type: [String],
      default: []
    }
  },

  // AI Evaluation results (per job)
  evaluations: [
    {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
      },

      matchScore: {
        type: Number
      },

      skillScore: Number,
      experienceScore: Number,
      educationScore: Number,

      strengths: [String],
      weaknesses: [String],

      aiSummary: String,

      status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending"
      },

      evaluatedAt: Date
    }
  ],

  processingStatus: {
    type: String,
    enum: ["uploaded", "processing", "completed", "failed"],
    default: "uploaded",
    index: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);
