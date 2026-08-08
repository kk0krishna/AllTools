import { ToolEntry } from "@/tools/registry";
import { GlasgowComaScale } from "./index";

export const glasgowComaScaleEntry: ToolEntry = {
  metadata: {
    name: "Glasgow Coma Scale (GCS)",
    description: "Assess level of consciousness in trauma and acute medical patients.",
    category: "neurology",
    slug: "glasgow-coma-scale",
    keywords: ["gcs", "glasgow", "coma", "brain injury", "trauma", "neurology"],
  },
  component: GlasgowComaScale,
  content: () => (
    <>
      <h2>About the GCS</h2>
      <p>
        The Glasgow Coma Scale (GCS) is the universal standard for objectively assessing and describing the level of consciousness in acute medical and trauma patients.
      </p>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Motor Score Dominance:</strong> The Motor component (M) is the most predictive individual factor for patient outcome. In intubated patients where verbal response cannot be assessed, the motor score provides the best indication of neurologic status.</li>
        <li><strong>Confounders:</strong> Always account for confounding variables such as intoxication, sedation, paralytics, and severe facial trauma that may artificially lower the score.</li>
      </ul>

      <h3>Next Steps &amp; Pitfalls</h3>
      <ul>
        <li><strong>Intubation Threshold:</strong> The classic axiom "GCS less than 8, intubate" serves as a clinical heuristic for airway protection, though clinical judgment regarding airway reflexes always supersedes the raw number.</li>
        <li><strong>Serial Monitoring:</strong> A single GCS score is less valuable than the trend. A drop of 2 or more points is considered a significant neurologic decline warranting immediate reassessment or imaging (e.g., Stat CT Head).</li>
      </ul>
    </>
  ),
};
