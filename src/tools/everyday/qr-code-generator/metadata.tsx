import { ToolEntry } from "@/tools/registry";
import { QRCodeGenerator } from "./index";

export const qrCodeGeneratorEntry: ToolEntry = {
  metadata: {
    name: "Instant QR Code Generator",
    description: "Generate high-quality QR codes for URLs, text, or contacts instantly.",
    category: "everyday",
    slug: "qr-code-generator",
    keywords: ["qr code generator", "create qr code", "url to qr code", "instant qr"],
  },
  component: QRCodeGenerator,
  content: () => (
    <>
      <h2>How to use the Instant QR Code Generator</h2>
      <p>
        Simply paste or type your URL or text into the input field above. The QR code will instantly 
        update as you type. Once you are happy with it, click the <strong>Download PNG</strong> button 
        to save the high-quality QR code to your device.
      </p>
      <h3>What can I use QR codes for?</h3>
      <ul>
        <li>Sharing website URLs quickly without typing.</li>
        <li>Linking to your digital menu at a restaurant.</li>
        <li>Sharing your Wi-Fi credentials with guests.</li>
        <li>Printing on business cards to link to your portfolio.</li>
      </ul>
    </>
  ),
};
