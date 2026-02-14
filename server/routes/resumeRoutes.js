import express from "express";
import multer from "multer";
import { uploadResume, getResumesForJob } from "../controllers/resumeControllers.js";

const router = express.Router();

const upload = multer({
    dest: "Uploads/",
})

router.post("/upload/:id", getResumesForJob);
router.get("/:jobId", uploadResume);

export default router;

