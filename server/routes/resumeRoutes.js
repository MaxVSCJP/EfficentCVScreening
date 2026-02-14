import express from "express";
import multer from "multer";
import { uploadResume, getResumesForJob } from "../controllers/resumeControllers.js";

const router = express.Router();

const upload = multer();

router.post("/upload/:jobId", upload.array("resume"), uploadResume);
router.get("/:jobId", getResumesForJob);

export default router;

