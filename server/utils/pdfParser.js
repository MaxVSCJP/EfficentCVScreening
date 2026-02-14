import fs from "fs";
import pdfParse from "pdf-parser";

export default async function parsePdf(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
}
