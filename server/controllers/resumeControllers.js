import { saveFile } from "../utils/SaveFiles.js";
import Resume from "../models/ResumeModel.js";
import Job from "../models/JobModel.js";

export const uploadResume = async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  const jobRequirements = {
    title: job.title,
    description: job.description,
    skills: job.skills,
    workExperienceYears: job.workExperienceYears,
    educationLevel: job.educationLevel,
    educationField: job.educationField,
  };

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    for (const file of req.files) {
      const fileUrl = await saveFile(file.buffer, file.originalname);
      const resume = new Resume({
        fileUrl,
        jobId: jobId,
      });
      await resume.save();

      await pdfQueue.add("parse-pdf", {
        filePath: fileUrl,
        jobRequirements: jobRequirements,
      });
    }

    res.json(JSON.stringify({ message: "Resumes uploaded and processing started" }));
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ error: "Failed to upload resume" });
  }
};

export const getResumesForJob = async (req, res) => {
  const { jobId } = req.params;
  let candidatesCount;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    candidatesCount = job.candidatesCount;
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ error: "Failed to fetch job" });
  }

  try {
    const resumes = await Resume.find({ jobId }).sort({ averageScore: 1 }).limit(candidatesCount);
    res.json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
};
