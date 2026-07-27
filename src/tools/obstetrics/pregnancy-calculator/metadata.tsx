import { ToolEntry } from "@/tools/registry";
import { PregnancyCalculator } from "./index";

export const pregnancyCalculatorEntry: ToolEntry = {
  metadata: {
    name: "Pregnancy Dating & Due Date Engine",
    description: "Advanced obstetric calculator for estimating due date (EDD), gestational age (GA), viability milestones, and trimester progress by LMP, ultrasound scan, IVF transfer, or conception date.",
    category: "obstetrics",
    slug: "pregnancy-calculator",
    keywords: [
      "pregnancy calculator",
      "edd calculator",
      "lmp calculator",
      "due date calculator",
      "ivf due date calculator",
      "ultrasound due date",
      "gestational age calculator",
      "viability calculator",
      "pregnancy wheel online",
      "acog due date calculator"
    ],
  },
  component: PregnancyCalculator,
  content: () => (
    <div className="space-y-6 text-foreground">
      <h2 className="text-2xl font-bold font-heading">Comprehensive Clinical Guidance on Pregnancy Dating</h2>
      <p className="text-muted-foreground leading-relaxed">
        Establishing an accurate Estimated Due Date (EDD) and Gestational Age (GA) is the most critical initial step in obstetrics. This comprehensive tool provides instant mathematical precision adhering to standard protocols from ACOG, RCOG, and FIGO.
      </p>

      <h3 className="text-xl font-semibold font-heading mt-6">Frequently Asked Questions (FAQs)</h3>
      
      <div className="space-y-4">
        <details className="bg-card p-4 rounded-xl border border-border/60">
          <summary className="font-semibold cursor-pointer">When should ultrasound dating replace LMP dating?</summary>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            According to ACOG Committee Opinion No. 700, if early first-trimester ultrasound (CRL measurement &lt;= 13w6d) differs from Naegele&apos;s rule LMP dating by more than 7 days, the ultrasound EDD should become the official due date. In the second trimester (14w0d to 21w6d), a discrepancy of more than 10 to 14 days justifies redating.
          </p>
        </details>

        <details className="bg-card p-4 rounded-xl border border-border/60">
          <summary className="font-semibold cursor-pointer">How is IVF or Frozen Embryo Transfer (FET) due date calculated?</summary>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            For Day 5 Blastocyst transfers, add 261 days to the transfer date. For Day 3 Cleavage stage embryo transfers, add 263 days. For Day 6 Blastocyst transfers, add 260 days. In assisted reproductive technology (ART), the transfer date is definitive and should never be modified by subsequent routine ultrasound measurements.
          </p>
        </details>

        <details className="bg-card p-4 rounded-xl border border-border/60">
          <summary className="font-semibold cursor-pointer">Why does cycle length affect due date in Naegele&apos;s rule?</summary>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Standard Naegele&apos;s rule assumes a 28-day cycle with ovulation occurring precisely on Day 14. If a woman has a 35-day cycle, ovulation typically occurs 7 days later (on Day 21). Therefore, 7 days must be added to the standard 280-day EDD calculation to accurately reflect fertilization timing.
          </p>
        </details>
      </div>
    </div>
  ),
};
