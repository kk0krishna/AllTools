import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Clinikkit.",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12 px-4 md:py-24 md:px-8 mx-auto">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: September 2026</p>
        
        <h2>1. Introduction</h2>
        <p>At Clinikkit, we respect your privacy and are committed to protecting it. This Privacy Policy explains our practices regarding the collection, use, and disclosure of information that you may provide via our website.</p>

        <h2>2. Data Collection and Usage</h2>
        <p><strong>Tool inputs:</strong> Many tools process inputs locally in your browser. Some features use third-party services or account storage; do not enter patient or other sensitive health information unless a tool specifically requires it and you are comfortable with its stated handling.</p>
        <p><strong>Analytics & telemetry:</strong> Firebase Analytics records page views and page information. Our Firestore usage logs also record page path, URL, browser user agent, referrer, and timestamp; aggregate tool-view counts are stored to support trending tools. These records are not accurately described as anonymous in every context.</p>


        <h2>3. Cookies</h2>
        <p>We use cookies and similar tracking technologies (like Firebase Analytics session tokens) to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

        <h2>4. Third-Party Services</h2>
        <p><strong>Firebase and Google:</strong> Firebase provides authentication, Firestore storage, hosting, and analytics.</p>
        <p>We do not sell or rent personal information. Third-party providers process data to operate the services described above.</p>

        <h2>5. Your Acceptance of These Terms</h2>
        <p>By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site.</p>
      </div>
    </div>
  );
}
