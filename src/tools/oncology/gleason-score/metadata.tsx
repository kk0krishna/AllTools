import { ToolEntry } from "@/tools/registry";
import { GleasonScore } from "./index";

export const gleasonScoreEntry: ToolEntry = {
  metadata: {
    name: "Gleason Score",
    description: "Determine the histologic grade and prognostic group for prostate cancer.",
    category: "oncology",
    slug: "gleason-score",
    keywords: ["gleason score", "prostate cancer", "oncology", "urology", "isup", "grade group"],
  },
  component: GleasonScore,
  content: () => (
    <>
      <h2>Understanding the Gleason Score</h2>
      <p>
        The Gleason scoring system evaluates the architectural pattern of prostate cancer tissue from a biopsy to determine histologic grade and prognosis.
      </p>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Sum of Patterns:</strong> The score is the sum of the primary (most prevalent) and secondary (second most prevalent) tumor patterns. In modern practice, patterns 1 and 2 are rarely assigned, meaning total scores effectively range from 6 to 10.</li>
        <li><strong>ISUP Grade Groups:</strong> Because a Gleason 6 represents the lowest grade of prostate cancer (with excellent prognosis), the International Society of Urological Pathology (ISUP) introduced Grade Groups (1-5). A Gleason 3+3=6 is Grade Group 1, helping to reduce patient anxiety regarding the &quot;6&quot; out of 10 score.</li>
      </ul>

      <h3>Next Steps &amp; Pitfalls</h3>
      <ul>
        <li><strong>Risk Stratification:</strong> The Gleason Score, combined with PSA levels and clinical staging (TNM), drives treatment decisions—ranging from active surveillance for low-risk disease to radical prostatectomy or radiation for higher-risk groups.</li>
        <li><strong>Order Matters:</strong> A Gleason score of 4+3=7 represents a more aggressive tumor than a 3+4=7 because the more aggressive pattern (4) is primary.</li>
      </ul>
    </>
  ),
};
