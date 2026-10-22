import React from "react";
import { ToolEntry } from "@/tools/registry";
import { BarcodeGenerator } from ".";

export const barcodeGeneratorEntry: ToolEntry = {
  metadata: {
    name: "Barcode Generator",
    description: "Generate high-density, vector-crisp barcodes for products, retail, inventory, and packaging with instant mobile scanner preview.",
    category: "everyday",
    slug: "barcode-generator",
    keywords: [
      "barcode generator",
      "create barcode",
      "code 128",
      "ean 13 barcode",
      "upc generator",
      "vector barcode svg",
      "inventory barcode",
      "print barcode label"
    ],
  },
  component: BarcodeGenerator,
  content: () => (
    <>
      <h2>High-Resolution Barcode Generator & Scanner Studio</h2>
      <p>
        ToolVerse Barcode Studio generates industry-compliant vector barcodes for retail, inventory control, shipping cartons, and logistics. All barcodes are rendered with dynamic SVG scaling to fit any screen size without clipping or blur.
      </p>

      <h3>Supported Barcode Standards</h3>
      <ul>
        <li><strong>CODE128:</strong> Universal high-density standard for shipping labels, packaging, and logistics. Supports full alphanumeric ASCII.</li>
        <li><strong>EAN-13 (GTIN-13):</strong> Global retail standard barcode for consumer products sold internationally.</li>
        <li><strong>UPC-A:</strong> Standard 12-digit consumer product barcode used across North America.</li>
        <li><strong>CODE39:</strong> Widely adopted industrial barcode for warehouse assets, automotive tags, and defense equipment.</li>
        <li><strong>ITF-14:</strong> Interleaved 2 of 5 barcode engineered specifically for master shipping cartons and corrugated cardboard.</li>
        <li><strong>Pharmacode:</strong> Specialized binary code utilized in pharmaceutical packaging and quality control.</li>
        <li><strong>EAN-8:</strong> Compact 8-digit retail barcode for small packaging.</li>
      </ul>

      <h3>Key Features</h3>
      <ul>
        <li><strong>Responsive Vector Scaling:</strong> Fits completely on mobile screens without truncation or horizontal clipping.</li>
        <li><strong>Scanner Mode:</strong> High-contrast edge-to-edge view optimized for physical optical scanners and phone cameras.</li>
        <li><strong>Multi-Format Export:</strong> Download 1x, 2x (Retina), or 3x (300 DPI Print) PNGs, lossless vector SVGs, or copy directly to your clipboard.</li>
        <li><strong>Direct Thermal Label Printing:</strong> Built-in print preview configured for desktop and thermal label printers.</li>
      </ul>
    </>
  ),
};
