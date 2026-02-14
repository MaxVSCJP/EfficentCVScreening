import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const origin = process.env.ORIGIN || "http://localhost:5000";

const uploadDir = process.env.UPLOAD_DIR || "./Uploads";

const ensureDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const saveFile = async (pdfBuffer, originalname) => {
  try {
    const fileName = `${Date.now()}-${originalname}`;
    const outputDir = path.join(uploadDir, "PortfolioPDFs");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, fileName);

    await fs.promises.writeFile(filePath, pdfBuffer);

    return `${origin}/Uploads/PortfolioPDFs/${fileName}`;
  } catch (error) {
    console.error("Error saving PDF:", error);
  }
};

export const deleteFileByUrl = async (fileUrl) => {
  try {
    if (typeof fileUrl !== "string" || !fileUrl.startsWith(origin)) {
      return false;
    }

    const urlObj = new URL(fileUrl);
    const filePath = decodeURIComponent(urlObj.pathname);
    const absolutePath = path.resolve(
      process.cwd(),
      ".",
      filePath.replace(/^[\\/]/, "")
    );

    if (fs.existsSync(absolutePath)) {
      await fs.promises.unlink(absolutePath);
      await invalidateCloudflareCache([filePath]);
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error deleting file:", err);
    return false;
  }
};
