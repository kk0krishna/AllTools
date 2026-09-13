import React from "react";
import { ToolEntry } from "@/tools/registry";
import { ImageConverterTool } from ".";

export const imageConverterEntry: ToolEntry = {
  metadata: {
    name: "Upload Ready: Image Requirements Solver",
    description: "Precise KB compression, dimension resizing, and format conversion.",
    category: "everyday",
    slug: "image-converter",
    keywords: ["image requirements", "compress image to 50kb", "passport photo size", "signature resizer", "photo under 20kb", "form photo"],
    hideHeader: true,
  },
  component: ImageConverterTool,
  content: () => (
    <>
      <h2>UploadReady: Image Requirements Solver</h2>
      <p>
        Tell us what the form requires, and we'll make your image fit. Precise KB compression, dimension resizing, and format conversion.
      </p>
      <h3>Features</h3>
      <ul>
        <li><strong>Smart Mode:</strong> Select common presets like Passport Photos or Signatures, and we handle the rest.</li>
        <li><strong>Strict KB Target:</strong> Need an image under 50 KB? We'll compress it to the highest possible quality that strictly fits the requirement.</li>
        <li><strong>Validation Checklist:</strong> Never guess if your file will be accepted. We validate the final output against your requirements before you download it.</li>
        <li><strong>Batch Processing:</strong> Apply the same strict requirements to dozens of images at once.</li>
      </ul>
    </>
  ),
};
