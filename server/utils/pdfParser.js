import fs from "fs";
import { PDFParse } from "pdf-parse";

export default async function parsePdf(filePath) {
  const buffer = await fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buffer });

  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}
