import React from "react";
import { ToolEntry } from "@/tools/registry";
import { ImageConverterTool } from ".";

export const imageConverterEntry: ToolEntry = {
  metadata: {
    name: "UploadReady: Image Requirements Solver",
    description: "Tell us what the form requires, and we'll make your image fit. Precise KB compression, dimension resizing, and format conversion.",
    category: "everyday",
    slug: "image-converter",
    keywords: ["image requirements", "compress image to 50kb", "passport photo size", "signature resizer", "photo under 20kb", "form photo"],
  },
  component: ImageConverterTool,
  content: () => (
    <>
      <h2>UploadReady: The Image Requirements Solver</h2>
      <p>
        Don't waste time trying to manually figure out pixels, quality sliders, and formats. Just tell us what the portal, application, or form requires, and <strong>UploadReady</strong> will generate a file that perfectly matches those specifications.
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
