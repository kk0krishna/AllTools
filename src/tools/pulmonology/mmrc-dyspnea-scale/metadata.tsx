import { ToolEntry } from "@/tools/registry";
import { MmrcDyspneaScale } from "./index";

export const mmrcDyspneaScaleEntry: ToolEntry = {
  metadata: {
    name: "mMRC Dyspnea Scale",
    description: "Assess the baseline functional severity of breathlessness (dyspnea) in respiratory diseases like COPD.",
    category: "pulmonology",
    slug: "mmrc-dyspnea-scale",
    keywords: ["mmrc", "dyspnea scale", "copd", "breathlessness", "respiratory", "gold criteria"],
  },
  component: MmrcDyspneaScale,
  content: () => (
    <>
      <h2>About the mMRC Scale</h2>
      <p>
        The Modified Medical Research Council (mMRC) Dyspnea Scale is a validated, easy-to-use grading system that quantifies a patient's baseline disability attributable to breathlessness.
      </p>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Baseline Assessment:</strong> The scale is excellent for capturing a patient's baseline functional impairment due to dyspnea, but it is less effective for measuring small, short-term responses to medical treatment.</li>
        <li><strong>Correlation:</strong> It correlates moderately well with healthcare-associated quality of life, morbidity, and mortality (especially in COPD), but does not consistently correlate with spirometric values (like FEV1).</li>
        <li><strong>Component Use:</strong> It is frequently used alongside other assessments. For example, it is a key variable in the BODE Index and is incorporated into the GOLD treatment guidelines for COPD.</li>
      </ul>

      <h3>Next Steps</h3>
      <ul>
        <li><strong>Contextualize:</strong> An mMRC grade of 2 or higher suggests significant impairment. In these patients, consider spirometry, determining their GOLD stage, and calculating their BODE Index.</li>
        <li><strong>Management:</strong> While the mMRC scale alone does not dictate specific medical interventions, GOLD guidelines combine the mMRC score with exacerbation history and spirometry to guide long-term COPD management strategies.</li>
      </ul>
    </>
  ),
};
