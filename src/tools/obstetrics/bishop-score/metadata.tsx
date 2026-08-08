import { ToolEntry } from "@/tools/registry";
import { BishopScoreCalculator } from "./index";

export const bishopScoreEntry: ToolEntry = {
  metadata: {
    name: "Modified Bishop Score",
    description: "Assess cervical favorability and probability of successful induction of labor.",
    category: "obstetrics",
    slug: "bishop-score",
    keywords: ["bishop score", "induction", "labor", "cervix", "obstetrics", "modified bishop"],
  },
  component: BishopScoreCalculator,
  content: () => (
    <>
      <h2>About the Modified Bishop Score</h2>
      <p>
        The Modified Bishop Score is the standard obstetric metric used to objectively assess cervical favorability and predict the likelihood of a successful vaginal delivery following labor induction.
      </p>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Score Interpretation:</strong> A score of &ge; 8 is considered &quot;favorable,&quot; meaning the probability of vaginal delivery is comparable to that of spontaneous labor. A score of &le; 6 is &quot;unfavorable.&quot;</li>
        <li><strong>Modifications:</strong> The classic Bishop Score used station relative to -3 to +3. The &quot;Modified&quot; version adjusts for cervical effacement measured in centimeters rather than percentages, though both are used clinically.</li>
      </ul>

      <h3>Next Steps &amp; Pitfalls</h3>
      <ul>
        <li><strong>Ripening Agents:</strong> If the cervix is unfavorable (Score &le; 6), cervical ripening agents (such as prostaglandins like Misoprostol or Dinoprostone, or mechanical methods like a Foley balloon) should be considered prior to initiating Pitocin (oxytocin).</li>
        <li><strong>Subjectivity:</strong> The exam relies on a digital cervical check, which can be highly subjective between different providers. Consistent documentation of all 5 parameters (Dilation, Effacement, Station, Consistency, Position) is vital for accurate hand-offs.</li>
      </ul>
    </>
  ),
};
