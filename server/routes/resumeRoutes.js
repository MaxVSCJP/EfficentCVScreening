import express from "express";
import multer from "multer";
import { uploadResume, getResumesForJob } from "../controllers/resumeControllers.js";

const router = express.Router();

const upload = multer({
    dest: "Uploads/",
})

router.post("/upload", upload.array("resume"), uploadResume);
router.get("/:jobId", getResumesForJob);

export default router;


