import { ToolEntry } from "@/tools/registry";
import { GestationalAgeCalculator } from "./index";

export const gestationalAgeCalculatorEntry: ToolEntry = {
  metadata: {
    name: "Instant Gestational Age (GA) Calculator",
    description: "Rapid clinical calculator to determine exact gestational age in weeks and days on today's date or any target clinic visit/surgery date from LMP, EDD, or ultrasound scan.",
    category: "obstetrics",
    slug: "gestational-age-calculator",
    keywords: [
      "gestational age calculator",
      "how many weeks pregnant calculator",
      "ga calculator obgyn",
      "pregnancy weeks and days calculator",
      "edd to ga calculator",
      "ultrasound gestational age calculator",
      "ward round obgyn calculator"
    ],
  },
  component: GestationalAgeCalculator,
  content: () => (
    <div className="space-y-6 text-foreground">
      <h2 className="text-2xl font-bold font-heading">Rapid Gestational Age Assessment in Clinical Practice</h2>
      <p className="text-muted-foreground leading-relaxed">
        Accurate gestational age calculation in weeks and days governs nearly every clinical intervention in obstetric care, from steroid administration for preterm labor (24-34 weeks) to magnesium sulfate neuroprotection (up to 32 weeks) and timing of elective cesarean sections (&gt;=39 weeks).
      </p>

      <h3 className="text-xl font-semibold font-heading mt-6">Frequently Asked Questions (FAQs)</h3>
      
      <div className="space-y-4">
        <details className="bg-card p-4 rounded-xl border border-border/60">
          <summary className="font-semibold cursor-pointer">Why is gestational age written as weeks and days?</summary>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            In obstetrics, fetal organ development occurs rapidly. A fetus at 34w0d is clinically distinct from a fetus at 34w6d. Standardizing nomenclature to completed weeks plus additional days (e.g., 28w3d) eliminates ambiguity across labor wards and neonatal units.
          </p>
        </details>

        <details className="bg-card p-4 rounded-xl border border-border/60">
          <summary className="font-semibold cursor-pointer">Can I calculate gestational age on a future surgery date?</summary>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Yes. By modifying the &quot;Target Date&quot; input at the top of the calculator to your planned surgery or induction date, the calculator will instantly compute the exact gestational age the patient will reach on that specific day.
          </p>
        </details>
      </div>
    </div>
  ),
};
