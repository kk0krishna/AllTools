import React from "react";
import { ToolEntry } from "@/tools/registry";
import { BarcodeGenerator } from ".";

export const barcodeGeneratorEntry: ToolEntry = {
  metadata: {
    name: "Barcode Generator",
    description: "Generate high-quality barcodes for products, inventory, and more.",
    category: "everyday",
    slug: "barcode-generator",
    keywords: ["barcode generator", "create barcode", "code128", "inventory barcode"],
  },
  component: BarcodeGenerator,
  content: () => (
    <>
      <h2>How to use the Barcode Generator</h2>
      <p>
        Simply paste or type your value into the input field above. The barcode will instantly 
        update as you type. You can select different barcode formats, colors, and sizes. Once you are happy with it, click the <strong>Download</strong> button 
        to save the high-quality barcode to your device.
      </p>
    </>
  ),
};
