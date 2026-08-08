import { ToolEntry } from "@/tools/registry";
import { PackYearsCalculator } from "./index";

export const packYearsCalculatorEntry: ToolEntry = {
  metadata: {
    name: "Pack Years Calculator",
    description: "Quantify cumulative smoking history to assess lung disease and cancer risk.",
    category: "pulmonology",
    slug: "pack-years-calculator",
    keywords: ["pack years", "smoking history", "lung cancer risk", "copd", "smoking calculator"],
  },
  component: PackYearsCalculator,
  content: () => (
    <>
      <h2>Understanding Pack Years</h2>
      <p>
        A &quot;pack year&quot; is the standard clinical metric used to quantify a patient&apos;s cumulative lifetime exposure to tobacco smoke. It is a critical predictor for lung disease and malignancy risk.
      </p>
      
      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Standard Metric:</strong> This calculation is universally used to document smoking history and assess risk. 1 pack is equivalent to 20 cigarettes.</li>
        <li><strong>Prognostic Value:</strong> Higher pack years correlate strongly with adverse outcomes. In patients diagnosed with advanced non-small cell lung cancer, those with a &gt;15 pack-year history have significantly worse survival rates than those with fewer pack years.</li>
      </ul>

      <h3>Next Steps &amp; Guidelines</h3>
      <ul>
        <li><strong>Screening Recommendations:</strong> Current guidelines (USPSTF, AAFP) strongly recommend annual low-dose CT lung cancer screening for adults aged 50-80 who have at least a 20 pack-year smoking history and currently smoke or have quit within the past 15 years.</li>
        <li><strong>Counseling:</strong> A high pack-year history should immediately trigger robust smoking cessation counseling and intervention.</li>
      </ul>
    </>
  ),
};
