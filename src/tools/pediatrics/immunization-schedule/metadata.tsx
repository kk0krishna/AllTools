import { ToolEntry } from "@/tools/registry";
import { ImmunizationSchedule } from "./index";

export const immunizationScheduleEntry: ToolEntry = {
  metadata: {
    name: "Immunization Schedule Calculator",
    description: "View standard CDC childhood immunizations due based on age.",
    category: "pediatrics",
    slug: "immunization-schedule",
    keywords: ["immunization", "vaccine", "pediatrics", "cdc", "schedule", "vaccination"],
  },
  component: ImmunizationSchedule,
  content: () => (
    <>
      <h2>Childhood Immunization Schedule</h2>
      <p>
        The standard childhood immunization schedule is an evidence-based roadmap designed by the CDC and ACIP to protect infants and adolescents from preventable, life-threatening infectious diseases.
      </p>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Herd Immunity:</strong> Consistent adherence to the schedule is crucial not only for individual protection but to maintain herd immunity for immunocompromised patients who cannot be vaccinated.</li>
        <li><strong>Simultaneous Administration:</strong> Most childhood vaccines can be safely administered at the same visit without decreasing efficacy or increasing adverse events.</li>
      </ul>

      <h3>Next Steps &amp; Pitfalls</h3>
      <ul>
        <li><strong>Catch-up Schedules:</strong> If a child falls behind, refer to the CDC&apos;s dedicated catch-up schedule. Do not restart a vaccine series simply because the interval was prolonged.</li>
        <li><strong>Live Vaccines:</strong> Pay special attention to live-attenuated vaccines (e.g., MMR, Varicella, Rotavirus), which have specific contraindications (like severe immunodeficiency or pregnancy) and spacing requirements.</li>
      </ul>
      <p>
        <em>Note: Always refer to the most recent official CDC/ACIP guidelines for definitive clinical decision-making.</em>
      </p>
    </>
  ),
};
