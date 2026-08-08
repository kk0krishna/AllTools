import { ToolEntry } from "@/tools/registry";
import { AbgAnalyzer } from "./index";

export const abgAnalyzerEntry: ToolEntry = {
  metadata: {
    name: "ABG Analyzer",
    description: "Interpret Arterial Blood Gas (ABG) results to determine primary acid-base disorders and compensation.",
    category: "pulmonology",
    slug: "abg-analyzer",
    keywords: ["abg", "arterial blood gas", "acidosis", "alkalosis", "respiratory", "metabolic", "winters formula"],
  },
  component: AbgAnalyzer,
  content: () => (
    <>
      <h2>Arterial Blood Gas (ABG) Interpretation</h2>
      <p>
        ABG analysis provides critical insights into a patient&apos;s acid-base balance and oxygenation status. It is essential for evaluating complex respiratory, metabolic, and circulatory conditions.
      </p>
      
      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Context is Key:</strong> Always interpret results alongside the patient&apos;s clinical history. Laboratory values alone cannot diagnose the underlying etiology.</li>
        <li><strong>Determine Chronicity:</strong> For respiratory acid-base disorders, calculating compensation helps differentiate between acute and chronic processes.</li>
      </ul>

      <h3>Next Steps &amp; Pitfalls</h3>
      <ul>
        <li><strong>Sampling Technique:</strong> Ensure true arterial sampling. Venous samples, air bubbles, or processing delays can falsely alter PaO2 and PaCO2.</li>
        <li><strong>Correlation:</strong> Consider checking a venous blood gas (VBG) for comparison; the pH and PaCO2 should closely correlate.</li>
        <li><strong>Repeat Testing:</strong> If calculated results conflict with the clinical picture, repeat the test to rule out pre-analytical errors.</li>
      </ul>
      <p>
        <em>Note: This tool provides educational guidance. Clinical correlation is always required.</em>
      </p>
    </>
  ),
};
