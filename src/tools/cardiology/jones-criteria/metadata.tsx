import { ToolEntry } from "@/tools/registry";
import { JonesCriteria } from "./index";

export const jonesCriteriaEntry: ToolEntry = {
  metadata: {
    name: "Jones Criteria for ARF",
    description: "Diagnose Acute Rheumatic Fever (ARF) based on major and minor criteria.",
    category: "cardiology",
    slug: "jones-criteria",
    keywords: ["jones criteria", "rheumatic fever", "arf", "strep", "cardiology", "pediatrics"],
  },
  component: JonesCriteria,
  content: () => (
    <>
      <h2>Jones Criteria</h2>
      <p>
        The Jones Criteria are the gold standard for diagnosing Acute Rheumatic Fever (ARF), providing a structured evaluation of major and minor clinical manifestations.
      </p>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Strep Validation is Mandatory:</strong> Laboratory evidence of an antecedent Group A Streptococcal (GAS) infection (e.g., positive throat culture, rapid strep test, or elevated antibody titers) is mandatory for diagnosis.</li>
        <li><strong>Infection Site:</strong> Only GAS infections of the upper respiratory tract can precipitate ARF. Cutaneous GAS infections (like impetigo) do not lead to ARF.</li>
        <li><strong>Age Considerations:</strong> Children under 3 years old rarely develop the autoimmune response necessary for ARF. In this age group, pursue other etiologies first.</li>
      </ul>

      <h3>Next Steps &amp; Pitfalls</h3>
      <ul>
        <li><strong>Minor Criteria Trap:</strong> Do not diagnose an initial episode of ARF based exclusively on minor criteria.</li>
        <li><strong>Chorea &amp; Carditis:</strong> Isolated chorea, indolent carditis, or a recurrent history of ARF are highly suggestive. In these specific cases, ARF is the presumptive diagnosis even if all criteria are not strictly met.</li>
        <li><strong>Management:</strong> If ARF is diagnosed, perform a screening echocardiogram (even in the absence of a murmur) and begin appropriate antibiotic therapy (typically penicillin).</li>
      </ul>
    </>
  ),
};
