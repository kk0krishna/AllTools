import { ToolEntry } from "@/tools/registry";
import { LightsCriteria } from "./index";

export const lightsCriteriaEntry: ToolEntry = {
  metadata: {
    name: "Light's Criteria",
    description: "Differentiate between exudative and transudative pleural effusions using fluid and serum markers.",
    category: "pulmonology",
    slug: "lights-criteria",
    keywords: ["lights criteria", "pleural effusion", "exudate", "transudate", "ldh", "pulmonology"],
  },
  component: LightsCriteria,
  content: () => (
    <>
      <h2>Understanding Light's Criteria</h2>
      <p>
        Light's Criteria is used to accurately distinguish between exudative and transudative pleural effusions, guiding further diagnostic workup and treatment.
      </p>
      
      <h3>The Criteria</h3>
      <p>An effusion is considered <strong>exudative</strong> if <em>at least one</em> of the following is met:</p>
      <ul>
        <li>Pleural Fluid Protein / Serum Protein &gt; 0.5</li>
        <li>Pleural Fluid LDH / Serum LDH &gt; 0.6</li>
        <li>Pleural Fluid LDH &gt; 2/3 the upper limit of normal for serum LDH</li>
      </ul>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>High Sensitivity:</strong> Light's criteria are highly sensitive (up to 98%) for identifying exudates, meaning it rarely misses one. However, specificity is lower (~83%), so it may misclassify a transudate as an exudate (especially in patients taking diuretics).</li>
        <li><strong>Exudative Etiologies:</strong> Common causes include malignancy, infection (pneumonia, TB), pulmonary embolism, and inflammatory conditions.</li>
        <li><strong>Transudative Etiologies:</strong> Typically caused by systemic imbalances in hydrostatic or oncotic pressures (e.g., heart failure, cirrhosis, nephrotic syndrome).</li>
      </ul>

      <h3>Next Steps</h3>
      <ul>
        <li><strong>Diagnostic Workup:</strong> Exudative effusions usually require further investigation (cytology, culture, biopsy) to determine the exact cause, whereas transudative effusions often resolve by treating the underlying systemic condition.</li>
      </ul>
    </>
  ),
};
