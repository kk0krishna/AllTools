import { ToolEntry } from "@/tools/registry";
import { PreeclampsiaRiskCalculator } from "./index";

export const preeclampsiaRiskEntry: ToolEntry = {
  metadata: {
    name: "Preeclampsia Risk Assessment",
    description: "ACOG Practice Bulletin 222-based preeclampsia risk stratification with low-dose aspirin recommendation for high-risk patients.",
    category: "obstetrics",
    slug: "preeclampsia-risk",
    keywords: [
      "preeclampsia risk",
      "preeclampsia calculator",
      "aspirin pregnancy",
      "ACOG preeclampsia",
      "maternal risk assessment",
      "PIH risk",
      "low dose aspirin obstetrics",
    ],
  },
  component: PreeclampsiaRiskCalculator,
};
