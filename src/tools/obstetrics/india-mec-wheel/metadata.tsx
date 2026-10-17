import { ToolEntry } from "@/tools/registry";
import { IndiaMecWheelTool } from "./index";

export const indiaMecWheelEntry: ToolEntry = {
  metadata: {
    name: "India-Adapted WHO MEC Wheel",
    description: "Official India-adapted WHO Medical Eligibility Criteria (MEC) Wheel for Contraceptive Use (MoHFW & WHO India). Features Centchroman (Chhaya / Saheli), Antara (DMPA), Cu-IUCD 380A & 375, and sterilization guidance.",
    category: "obstetrics",
    slug: "india-mec-wheel",
    keywords: [
      "india mec wheel",
      "chhaya contraceptive pill",
      "saheli centchroman",
      "antara injection dmpa",
      "who mec wheel india",
      "mohfw contraceptive eligibility",
      "cu iucd 380a",
      "cu iucd 375",
      "postpartum iucd ppiucd",
      "female sterilization criteria india",
      "nsv male sterilization"
    ],
  },
  component: IndiaMecWheelTool,
  content: () => (
    <div className="space-y-8 text-foreground max-w-4xl">
      <section className="space-y-3">
        <h2 className="text-2xl font-bold font-heading">
          India-Adapted Medical Eligibility Criteria (MEC) Wheel for Contraceptive Use
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          The <strong>India-adapted WHO MEC Wheel (2022-2023 update)</strong> has been formulated by the <strong>Ministry of Health & Family Welfare (MoHFW), Government of India</strong> in close collaboration with the World Health Organization Country Office for India. It adapts the global WHO 4th and 5th Edition Medical Eligibility Criteria into national guidelines aligned with the expanded contraceptive basket under the <em>National Family Planning Programme</em> and <em>Mission Parivar Vikas (MPV)</em>.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold font-heading">
          Key Adaptations in the Indian National Guidelines
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
            <strong className="text-emerald-700 dark:text-emerald-400 font-bold block">
              1. Centchroman / Ormeloxifene (Chhaya / Saheli)
            </strong>
            <p className="text-xs text-muted-foreground leading-relaxed">
              India is the only country in the world offering <strong>Centchroman</strong>, an indigenous non-steroidal, non-hormonal selective estrogen receptor modulator (SERM) as part of its public family planning program. It is taken <strong>twice a week for the first 3 months</strong>, and <strong>once a week thereafter</strong>. It is completely safe during lactation and has zero steroid-associated vascular or metabolic side effects.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
            <strong className="text-emerald-700 dark:text-emerald-400 font-bold block">
              2. Antara Programme (DMPA Subcutaneous & Intramuscular)
            </strong>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Provides 3-monthly progestin-only injectable contraception (150 mg DMPA-IM or 104 mg DMPA-SC) at all levels of the Indian health system. Repeat injections can be given up to <strong>2 weeks early</strong> or up to <strong>4 weeks late</strong> without requiring additional contraceptive protection.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
            <strong className="text-emerald-700 dark:text-emerald-400 font-bold block">
              3. Copper IUCD Options (Cu-IUCD 380A & Cu-IUCD 375)
            </strong>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Includes both <strong>Cu-IUCD 380A (effective for 10 years)</strong> and the flexible-arm <strong>Cu-IUCD 375 (effective for 5 years)</strong>. Both are extensively utilized for Post-Partum Intrauterine Contraceptive Device (PPIUCD) insertion within 48 hours of delivery (post-placental or intra-cesarean).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
            <strong className="text-emerald-700 dark:text-emerald-400 font-bold block">
              4. Surgical Sterilization Classification (A, C, D, S)
            </strong>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Permanent contraception is categorized as <strong>A (Accept)</strong>, <strong>C (Caution)</strong>, <strong>D (Delay)</strong>, and <strong>S (Special)</strong>. Vasectomy (Non-Scalpel Vasectomy - NSV) requires backup contraception for <strong>3 months</strong> post-procedure until azoospermia is confirmed.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold font-heading">Frequently Asked Questions (FAQs)</h3>
        <div className="space-y-3">
          <details className="bg-card p-4 rounded-xl border border-border/60">
            <summary className="font-semibold cursor-pointer text-sm">
              How is Centchroman (Chhaya) initiated and dosed?
            </summary>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
              The first pill is taken on the first day of menstrual bleeding (Day 1) and the second pill 3 days later (e.g., Sunday and Wednesday). This twice-a-week pattern is strictly maintained for the first 3 months. Starting from the 4th month onwards, it is taken only <strong>once a week</strong> on the designated first pill day (e.g., every Sunday), regardless of menstrual cycle status.
            </p>
          </details>

          <details className="bg-card p-4 rounded-xl border border-border/60">
            <summary className="font-semibold cursor-pointer text-sm">
              Can Centchroman cause a delay in menstrual periods?
            </summary>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
              Yes. In the first 3 months of use, a delay in periods or prolonged cycle length occurs in approximately 8–10% of users. This is a recognized benign pharmacological effect of ormeloxifene and does not indicate contraceptive failure. The client should continue taking the pill on her regular designated days.
            </p>
          </details>

          <details className="bg-card p-4 rounded-xl border border-border/60">
            <summary className="font-semibold cursor-pointer text-sm">
              When can a postpartum mother have a PPIUCD inserted?
            </summary>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
              A Post-Partum IUCD (PPIUCD) can be placed within 10 minutes of placental expulsion (post-placental), during a Caesarean section before uterine closure (intracesarean), or anytime within <strong>48 hours of delivery</strong>. If more than 48 hours have elapsed, IUD insertion is deferred until <strong>6 weeks postpartum</strong> to prevent perforation during the subinvolution phase.
            </p>
          </details>

          <details className="bg-card p-4 rounded-xl border border-border/60">
            <summary className="font-semibold cursor-pointer text-sm">
              Which contraceptive methods are best for anemic women in India?
            </summary>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
              Injectable DMPA (Antara) and the LNG-IUD (Mirena) are exceptional choices because they produce amenorrhea or significantly reduce menstrual blood loss, leading to clinically significant rises in hemoglobin levels. Mala-N and Mala-D provide 7 ferrous fumarate tablets in every cycle pack. In women with severe anemia (Hb &lt; 7 g/dL), Copper IUCD insertion is classified as Category 2.
            </p>
          </details>
        </div>
      </section>
    </div>
  ),
};
