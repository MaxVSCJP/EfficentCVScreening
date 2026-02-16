import { Worker } from "bullmq";
import mongoose from "mongoose";

import "dotenv/config";
import connection from "../utils/redis.js";
import parsePdf from "../utils/pdfParser.js";
import extractJsonFromText from "../services/aiService.js";
import Resume from "../models/ResumeModel.js";

// Ensure the worker connects to the DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Worker connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const worker = new Worker(
  "pdf-processing",
  async (job) => {
    const { filePath, jobRequirements, fileUrl } = job.data;

    console.log("Processing:", filePath);

    // 1. Parse PDF
    const text = await parsePdf(filePath);

    // 2. Send to AI → JSON
    const json = await extractJsonFromText(text, jobRequirements);

    // 3. Save result
    await Resume.findOneAndUpdate(
      { fileUrl: fileUrl },
      {
        name: json.name,
        email: json.email,
        phone: json.phone,
        skillScore: json.skillScore,
        workScore: json.workScore,
        educationScore: json.educationScore,
        similarityScore: json.similarityScore,
        averageScore: json.averageScore,
      },
      { returnDocument: "after" },
    );
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
