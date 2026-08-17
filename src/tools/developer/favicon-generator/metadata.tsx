import { ToolEntry, ToolMetadata } from "@/tools/registry";
import { FaviconGenerator } from ".";

export const metadata: ToolMetadata = {
  name: "Favicon Generator",
  description: "Generate a complete favicon package for your website from an image, text, or emoji. Includes ICO, PNG, and web manifest.",
  category: "developer",
  slug: "favicon-generator",
  keywords: [
    "favicon generator",
    "favicon converter",
    "image to favicon",
    "text to favicon",
    "emoji to favicon",
    "ico generator",
    "web manifest generator",
    "apple touch icon",
    "site.webmanifest"
  ]
};

export const faviconGeneratorEntry: ToolEntry = {
  metadata,
  component: FaviconGenerator,
  content: () => (
    <div className="space-y-8">
      <section>
        <h2>What is a Favicon?</h2>
        <p>
          A favicon (favorite icon) is the small, square image representing your website in browser tabs, bookmarks, search engine results, and mobile home screens. 
          It provides a visual marker for your brand, helping users instantly recognize your site among dozens of open tabs. 
          While traditionally just an <code>.ico</code> file, modern web standards require a package of multiple sizes and formats to look perfect across all devices (Windows, iOS, Android).
        </p>
      </section>

      <section>
        <h2>The Complete Favicon Package</h2>
        <p>
          Our generator provides a zip file containing everything you need for broad compatibility across legacy and modern platforms:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
            <h4 className="font-bold mb-2">Browser Tabs (Classic)</h4>
            <ul className="m-0 text-sm">
              <li><strong>favicon.ico:</strong> The universal fallback containing 16x16, 32x32, and 48x48 sizes.</li>
              <li><strong>favicon-16x16.png:</strong> Standard tab icon.</li>
              <li><strong>favicon-32x32.png:</strong> High-DPI tab icon.</li>
            </ul>
          </div>
          <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
            <h4 className="font-bold mb-2">Mobile & PWAs (Modern)</h4>
            <ul className="m-0 text-sm">
              <li><strong>apple-touch-icon.png:</strong> 180x180 icon for iOS home screens.</li>
              <li><strong>android-chrome-192/512.png:</strong> Android devices and PWAs.</li>
              <li><strong>site.webmanifest:</strong> JSON metadata linking the Android icons.</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Installation Guide</h2>
        <p>Follow these quick steps to get your new favicon live:</p>
        <ol>
          <li><strong>Generate & Download:</strong> Use the tool above to customize and download your <code>.zip</code> package.</li>
          <li><strong>Extract to Root:</strong> Unzip the files and upload them directly into the root folder of your website (e.g., <code>public/</code> for Next.js, or the main <code>www</code> folder).</li>
          <li><strong>Update HTML:</strong> Paste the snippet below into the <code>&lt;head&gt;</code> section of your global HTML or layout file.</li>
        </ol>
        <pre className="overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-lg text-sm mt-4">
          <code>{`<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`}</code>
        </pre>
      </section>

      <section>
        <h2>Frequently Asked Questions</h2>
        <div className="space-y-4 mt-4">
          <details className="group bg-card border border-border/50 rounded-lg p-4 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
            <summary className="font-semibold text-lg flex items-center justify-between">
              Do I still need the favicon.ico file?
              <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-muted-foreground text-sm">
              Yes. While modern browsers support PNG and SVG, many older browsers, RSS readers, and automated tools will blindly request <code>/favicon.ico</code>. Providing it prevents 404 errors and ensures maximum compatibility.
            </p>
          </details>

          <details className="group bg-card border border-border/50 rounded-lg p-4 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
            <summary className="font-semibold text-lg flex items-center justify-between">
              Why isn&apos;t my new favicon showing up?
              <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-muted-foreground text-sm">
              Browsers aggressively cache favicons to improve page load speeds. If you&apos;ve uploaded the new files, try clearing your browser cache, doing a hard refresh (Ctrl+F5 / Cmd+Shift+R), or checking the site in an Incognito/Private window.
            </p>
          </details>

          <details className="group bg-card border border-border/50 rounded-lg p-4 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
            <summary className="font-semibold text-lg flex items-center justify-between">
              Why isn&apos;t Google showing my favicon in search results?
              <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-muted-foreground text-sm">
              Google requires your favicon to be crawlable, square, and at least 48x48 pixels in size. Ensure your <code>robots.txt</code> allows crawling for images in your root directory, and give Google a few days to re-index your site.
            </p>
          </details>
        </div>
      </section>
    </div>
  ),
};
