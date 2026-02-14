import { Worker } from "bullmq";
import connection from "../utils/redis.js";
import parsePdf from "../utils/pdfParser.js";
import extractJsonFromText from "../services/aiService.js";

import Resume from "../models/ResumeModel.js";

const worker = new Worker(
  "pdf-processing",
  async job => {
    const { filePath, jobRequirements } = job.data;

    console.log("Processing:", filePath);

    // 1. Parse PDF
    const text = await parsePdf(filePath);

    // 2. Send to AI → JSON
    const json = await extractJsonFromText(text, jobRequirements);

    // 3. Save result
    await Resume.findOneAndUpdate(
      { fileUrl: filePath },
      {
        skillScore: json.skillScore,
        experienceScore: json.experienceScore,
        educationScore: json.educationScore,
        similarityScore: json.similarityScore,
        averageScore: json.averageScore,
    }, { new: true });
  },
  { connection }
);

worker.on("completed", job => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
