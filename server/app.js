import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:8080",
    "http://localhost:8081",
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
  })
);

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(morgan("dev"));

app.use(
  "/Uploads",
  cors(corsOptions),
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cache-Control", `public, max-age=${7 * 24 * 60 * 60}`);
    next();
  },
  express.static(path.join(__dirname, "Uploads"))
);

app.get("/", (req, res) => {
  res.send("✅ Welcome to the CV Screening API!");
});

export default app;