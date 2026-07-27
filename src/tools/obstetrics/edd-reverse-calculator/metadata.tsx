import { ToolEntry } from "@/tools/registry";
import { EDDReverseCalculator } from "./index";

export const eddReverseCalculatorEntry: ToolEntry = {
  metadata: {
    name: "Reverse Due Date & Conception Estimator",
    description: "Reverse obstetric calculator to determine exact conception window, ovulation date, LMP, and IVF embryo transfer schedule from any target Estimated Due Date (EDD).",
    category: "obstetrics",
    slug: "edd-reverse-calculator",
    keywords: [
      "reverse due date calculator",
      "conception date calculator",
      "when did i get pregnant calculator",
      "ivf transfer date calculator from due date",
      "reverse pregnancy wheel",
      "ovulation calculator from due date",
      "edd calculator reverse",
      "fertile window calculator"
    ],
  },
  component: EDDReverseCalculator,
  content: () => (
    <div className="space-y-6 text-foreground">
      <h2 className="text-2xl font-bold font-heading">Reverse Obstetric Calculations & Conception Timing</h2>
      <p className="text-muted-foreground leading-relaxed">
        Whether planning an assisted reproductive technology (ART) cycle or determining the timeline of fertilization for clinical counseling, reverse pregnancy calculations translate a delivery date into exact fertilization and embryology milestones.
      </p>

      <h3 className="text-xl font-semibold font-heading mt-6">Frequently Asked Questions (FAQs)</h3>
      
      <div className="space-y-4">
        <details className="bg-card p-4 rounded-xl border border-border/60">
          <summary className="font-semibold cursor-pointer">How accurate is reverse conception dating?</summary>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            For IVF and IUI pregnancies where the delivery due date was established from embryo transfer or insemination timing, reverse dating is mathematically exact to the day. For spontaneous pregnancies, sperm viability (up to 5 days) means the actual intercourse date resulting in conception may occur anywhere within a 5-day window prior to the calculated ovulation date.
          </p>
        </details>

        <details className="bg-card p-4 rounded-xl border border-border/60">
          <summary className="font-semibold cursor-pointer">What is the difference between Day 3 and Day 5 IVF transfer dating?</summary>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            In IVF, egg retrieval is equivalent to ovulation/conception (Day 0). A Day 3 cleavage embryo has grown for 3 days in the laboratory, so 263 days remain in the 266-day gestation period. A Day 5 blastocyst has grown for 5 days, leaving 261 days until full term.
          </p>
        </details>
      </div>
    </div>
  ),
};
