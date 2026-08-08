import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Disclaimer",
  description: "Medical disclaimer for AllTools clinical calculators.",
};

export default function DisclaimerPage() {
  return (
    <div className="container max-w-4xl py-12 px-4 md:py-24 md:px-8 mx-auto">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Medical Disclaimer</h1>
        <p className="text-muted-foreground mb-8">Last updated: August 2026</p>
        
        <h2>1. No Medical Advice</h2>
        <p>The information, calculators, and other tools provided on AllTools (the "Site") are intended for educational and informational purposes only. The Site does not provide medical advice, diagnosis, or treatment.</p>

        <h2>2. Target Audience</h2>
        <p>While our tools are built to professional standards, they are designed to serve as quick-reference utilities. They are not intended to replace the clinical judgment of a healthcare professional. Non-medical users should not use this site to self-diagnose or self-treat any medical condition.</p>

        <h2>3. Professional Verification</h2>
        <p>Medical knowledge and practice guidelines change constantly. While we make every effort to ensure the accuracy of the formulas and reference ranges provided, errors may occur. It is the responsibility of the treating physician or healthcare provider to independently verify the accuracy of all calculations and clinical guidelines before applying them to patient care.</p>

        <h2>4. Limitation of Liability</h2>
        <p>In no event shall AllTools, its authors, contributors, or affiliated parties be liable for any direct, indirect, incidental, consequential, special, or exemplary damages arising out of or in connection with the use of the Site, the content, or the calculators, whether based in contract, tort, strict liability, or otherwise.</p>
      </div>
    </div>
  );
}
