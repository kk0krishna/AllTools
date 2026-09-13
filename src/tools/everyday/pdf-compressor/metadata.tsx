import { ToolEntry } from "../../registry";
import { PDFCompressorTool } from ".";

export const pdfCompressorEntry: ToolEntry = {
  metadata: {
    name: "PDF Compressor",
    description: "Compress PDFs to specific size limits by optimizing and rasterizing pages.",
    category: "everyday",
    slug: "pdf-compressor",
    keywords: ["pdf", "compress", "size", "limit", "reduce", "resize"],
  },
  component: PDFCompressorTool,
};
