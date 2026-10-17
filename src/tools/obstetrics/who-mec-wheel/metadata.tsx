import { ToolEntry } from "@/tools/registry";
import { WhoMecWheelTool } from "./index";

export const whoMecWheelEntry: ToolEntry = {
  metadata: {
    name: "WHO MEC Wheel (Contraceptive Eligibility)",
    description: "Official interactive digital edition of the World Health Organization (WHO) Medical Eligibility Criteria Wheel for Contraceptive Use (5th Edition). Quickly assess clinical safety across 6 contraceptive tracks and 36 medical conditions.",
    category: "obstetrics",
    slug: "who-mec-wheel",
    keywords: [
      "who mec wheel",
      "medical eligibility criteria contraceptive use",
      "contraception wheel",
      "who contraception guidelines",
      "mec wheel online",
      "contraceptive eligibility calculator",
      "who family planning wheel",
      "coc contraindications",
      "iud medical eligibility",
      "postpartum contraception who"
    ],
  },
  component: WhoMecWheelTool,
  content: () => (
    <div className="space-y-8 text-foreground max-w-4xl">
      <section className="space-y-3">
        <h2 className="text-2xl font-bold font-heading">
          Clinical Guidance on the WHO Medical Eligibility Criteria for Contraceptive Use
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          The <strong>Medical Eligibility Criteria for Contraceptive Use (MEC)</strong>, now in its 5th Edition (2015 update), is one of the World Health Organization’s cornerstone evidence-based family planning guidelines. The MEC Wheel guides healthcare providers—physicians, gynaecologists, midwives, family planning nurses, and community health officers—in recommending safe, highly effective, and personalized contraception for women presenting with medical conditions or medically relevant characteristics.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold font-heading">Understanding the Four MEC Categories</h3>
        <p className="text-sm text-muted-foreground">
          The recommendations are categorized numerically from 1 to 4 to establish clear safety boundaries:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
            <strong className="text-emerald-700 dark:text-emerald-400 block font-bold text-base">
              Category 1: Use method in any circumstance
            </strong>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No medical restriction whatsoever for the use of the contraceptive method. With limited clinical judgement: <strong>YES (Use the method)</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-1">
            <strong className="text-blue-700 dark:text-blue-400 block font-bold text-base">
              Category 2: Generally use the method
            </strong>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The advantages of using the method generally outweigh the theoretical or proven risks. With limited clinical judgement: <strong>YES (Use the method)</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1">
            <strong className="text-amber-700 dark:text-amber-400 block font-bold text-base">
              Category 3: Use of method not usually recommended
            </strong>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The theoretical or proven risks usually outweigh the advantages of using the method. The method is not recommended unless other more appropriate methods are not available or acceptable. With limited clinical judgement: <strong>NO (Do not use)</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-1">
            <strong className="text-rose-700 dark:text-rose-400 block font-bold text-base">
              Category 4: Method NOT to be used
            </strong>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Represents an unacceptable health risk if the contraceptive method is used. Absolute contraindication. With limited clinical judgement: <strong>NO (Do not use)</strong>.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold font-heading">Initiation vs. Continuation</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The recommendations on the outer disc reflect <strong>Initiation</strong> of a method. If a woman develops a condition while already using a contraceptive method (e.g. developing mild pelvic inflammatory disease while using an intrauterine device), clinical continuation criteria apply. In many cases (such as PID with an IUD already in place), antimicrobial treatment can be administered with the device retained in situ.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold font-heading">Frequently Asked Questions (FAQs)</h3>
        <div className="space-y-3">
          <details className="bg-card p-4 rounded-xl border border-border/60">
            <summary className="font-semibold cursor-pointer text-sm">
              Can a woman over 35 years who smokes use Combined Oral Contraceptive pills?
            </summary>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
              No. Women aged 35 years or older who smoke heavily (≥ 15 cigarettes/day) are classified as <strong>MEC Category 4</strong> for combined hormonal contraceptives due to a markedly elevated risk of myocardial infarction and ischemic stroke. If they smoke &lt; 15 cigarettes/day, they are <strong>MEC Category 3</strong>. Safer alternatives include Progestogen-Only Pills (POP), DMPA, Implants, or Copper / LNG IUDs (all Category 1).
            </p>
          </details>

          <details className="bg-card p-4 rounded-xl border border-border/60">
            <summary className="font-semibold cursor-pointer text-sm">
              Which contraceptives are safe in patients with migraine with aura?
            </summary>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
              Combined hormonal contraceptives (COC, patch, ring, CIC) are <strong>MEC Category 4</strong> for all women with migraine with aura regardless of age due to synergistic arterial stroke risks. Safe methods include Copper IUD (Category 1), LNG-IUD (Category 2), Implants (Category 2), DMPA (Category 2), and POPs (Category 2).
            </p>
          </details>

          <details className="bg-card p-4 rounded-xl border border-border/60">
            <summary className="font-semibold cursor-pointer text-sm">
              When can a postpartum breastfeeding mother safely start contraception?
            </summary>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
              Immediate post-placental Copper IUD (&lt; 48 hours) is Category 1. Progestin-only pills and implants are Category 2 in the first 6 weeks and Category 1 after 6 weeks. Combined hormonal contraceptives are Category 4 before 6 weeks postpartum and Category 3 between 6 weeks and 6 months due to lactation suppression and thrombosis risks.
            </p>
          </details>

          <details className="bg-card p-4 rounded-xl border border-border/60">
            <summary className="font-semibold cursor-pointer text-sm">
              Do any of these methods protect against Sexually Transmitted Infections (STIs) and HIV?
            </summary>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
              <strong>No.</strong> Hormonal methods and intrauterine devices do NOT protect against STIs or HIV. Dual protection with consistent and correct condom use (male or female) is strongly advised whenever there is a potential risk of STI or HIV transmission.
            </p>
          </details>
        </div>
      </section>
    </div>
  ),
};
