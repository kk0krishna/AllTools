import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for ToolVerse.",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12 px-4 md:py-24 md:px-8 mx-auto">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: August 2026</p>
        
        <h2>1. Introduction</h2>
        <p>At ToolVerse, we respect your privacy and are committed to protecting it. This Privacy Policy explains our practices regarding the collection, use, and disclosure of information that you may provide via our website.</p>

        <h2>2. Data Collection and Usage</h2>
        <p><strong>Offline Functionality:</strong> ToolVerse is designed primarily as a client-side application. The vast majority of our tools, including all clinical calculators, process data locally on your device. We do not transmit or store patient data, medical metrics, or personal health information on our servers.</p>
        <p><strong>Analytics & Telemetry:</strong> To improve our services, we use Google Firebase Analytics and Firestore to collect anonymous, non-personally identifiable telemetry data. This includes page views, feature usage frequency, browser types, and timestamp information. This data helps us understand which tools are most valuable to our community and informs our development priorities.</p>

        <h2>3. Cookies</h2>
        <p>We use cookies and similar tracking technologies (like Firebase Analytics session tokens) to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

        <h2>4. Third-Party Services</h2>
        <p>We do not sell, trade, or rent users' personal identification information to others. We use Google Firebase (a third-party service provider) exclusively for hosting and anonymous usage analytics.</p>

        <h2>5. Your Acceptance of These Terms</h2>
        <p>By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site.</p>
      </div>
    </div>
  );
}
