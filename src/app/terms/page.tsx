import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service and conditions of use for AllTools.",
};

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12 px-4 md:py-24 md:px-8 mx-auto">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: August 2026</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using AllTools (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Service's particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

        <h2>2. Educational and Reference Purpose Only</h2>
        <p>AllTools, including its Obstetric Clinical Suite (OCS) and all other medical calculators, is provided strictly for educational and informational purposes. The Service is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>

        <h2>3. Accuracy of Information</h2>
        <p>While we strive to ensure the formulas and data presented on this site are accurate, we make no representations, warranties, or guarantees, whether express or implied, that the content on our site is accurate, complete, or up-to-date. Clinical data and guidelines are subject to change rapidly.</p>

        <h2>4. User Responsibilities</h2>
        <p>You agree to use the Service only for lawful purposes. You agree not to take any action that might compromise the security of the site, render the site inaccessible to others, or otherwise cause damage to the site or its content.</p>

        <h2>5. Modifications to Service</h2>
        <p>We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice at any time. You agree that AllTools shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.</p>
      </div>
    </div>
  );
}
