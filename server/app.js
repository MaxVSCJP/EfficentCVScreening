import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import jobRoutes from "./routes/jobRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "http://localhost:5173",
          "http://localhost:5174",
          "http://localhost:8081",
          "http://localhost:8080",
        ],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        objectSrc: ["'none'"],
        connectSrc: ["'self'"],
        mediaSrc: ["'self'"],
        fontSrc: ["'self'"],
      },
    },
  }),
);

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(morgan("dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/Uploads",
  cors(corsOptions),
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cache-Control", `public, max-age=${7 * 24 * 60 * 60}`);
    next();
  },
  express.static(path.join(__dirname, "Uploads")),
);

app.get("/", (req, res) => {
  res.send("✅ Welcome to the CV Screening API!");
});

app.use("/api/jobs", jobRoutes);
app.use("/api/resumes", resumeRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Server Error" });
});

export default app;
