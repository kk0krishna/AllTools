import { ToolEntry } from "@/tools/registry";
import { BishopScoreCalculator } from "./index";

export const bishopScoreEntry: ToolEntry = {
  metadata: {
    name: "Bishop Score Calculator",
    description: "Cervical assessment tool to estimate likelihood of successful labor induction. Scores dilation, effacement, station, consistency and position.",
    category: "obstetrics",
    slug: "bishop-score",
    keywords: [
      "bishop score",
      "bishop score calculator",
      "cervical ripening",
      "labor induction",
      "induction of labor",
      "cervix assessment",
      "VBAC bishop score",
    ],
  },
  component: BishopScoreCalculator,
};
