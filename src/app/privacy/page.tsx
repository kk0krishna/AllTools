import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for AllTools.",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12 px-4 md:py-24 md:px-8 mx-auto">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: August 2026</p>
        
        <h2>1. Introduction</h2>
        <p>At AllTools, we respect your privacy and are committed to protecting it. This Privacy Policy explains our practices regarding the collection, use, and disclosure of information that you may provide via our website.</p>

        <h2>2. Data Collection and Usage</h2>
        <p><strong>Offline Functionality:</strong> AllTools is designed primarily as a client-side application. The vast majority of our tools, including all clinical calculators, process data locally on your device. We do not transmit or store patient data, medical metrics, or personal health information on our servers.</p>
        <p><strong>Analytics:</strong> We may collect non-personally identifiable information, such as browser type, operating system, and the date and time of your visit, to help us optimize the user experience.</p>

        <h2>3. Cookies</h2>
        <p>We may use "cookies" to enhance user experience. Your web browser places cookies on your hard drive for record-keeping purposes and sometimes to track information about you. You may choose to set your web browser to refuse cookies, or to alert you when cookies are being sent.</p>

        <h2>4. Third-Party Services</h2>
        <p>We do not sell, trade, or rent users' personal identification information to others. We may use third-party service providers (such as hosting providers) to help us operate our business and the Site.</p>

        <h2>5. Your Acceptance of These Terms</h2>
        <p>By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site.</p>
      </div>
    </div>
  );
}
