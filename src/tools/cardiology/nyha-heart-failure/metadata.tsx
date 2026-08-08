import { ToolEntry } from "@/tools/registry";
import { NyhaHeartFailure } from "./index";

export const nyhaHeartFailureEntry: ToolEntry = {
  metadata: {
    name: "NYHA Heart Failure Classification",
    description: "Stratify the severity of heart failure based on functional capacity.",
    category: "cardiology",
    slug: "nyha-heart-failure",
    keywords: ["nyha", "heart failure", "chf", "cardiology", "dyspnea", "classification"],
  },
  component: NyhaHeartFailure,
  content: () => (
    <>
      <h2>NYHA Functional Classification</h2>
      <p>
        The NYHA Functional Classification is a widely utilized system to categorize the severity of heart failure based on a patient's physical limitations and symptom burden.
      </p>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Subjective Nature:</strong> This classification was developed by consensus rather than derivation. It is inherently subjective, and studies show it has poor interobserver agreement (around 54%).</li>
        <li><strong>Prognostic Value:</strong> Despite its subjectivity, higher NYHA classes strongly correlate with higher rates of cardiovascular events and hospitalizations.</li>
      </ul>

      <h3>Next Steps &amp; Pitfalls</h3>
      <ul>
        <li><strong>Clinical Context:</strong> The AHA/ACC guidelines recommend using the NYHA class to characterize symptom burden in Stage C and D heart failure. However, it should never be the sole metric for clinical decision-making.</li>
        <li><strong>Objective Correlation:</strong> Always interpret a patient's NYHA class alongside objective clinical data (e.g., LVEF via echocardiogram, BNP levels, and 6-minute walk test results).</li>
      </ul>
    </>
  ),
};
