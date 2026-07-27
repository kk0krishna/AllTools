import { ToolEntry } from "@/tools/registry";
import { PregnancyTimeline } from "./index";

export const pregnancyTimelineEntry: ToolEntry = {
  metadata: {
    name: "Interactive Gestational Timeline & Protocol Guide",
    description: "Week-by-week clinical milestone tracker detailing required ultrasound scans, laboratory screening tests, vaccinations, and patient counselling guidelines from Week 4 to 42.",
    category: "obstetrics",
    slug: "pregnancy-timeline",
    keywords: [
      "pregnancy timeline",
      "gestation timeline",
      "antenatal care schedule",
      "obstetric scan schedule",
      "pregnancy test schedule",
      "pregnancy vaccination schedule",
      "week by week pregnancy clinical",
      "acog prenatal guidelines",
      "who antenatal schedule"
    ],
  },
  component: PregnancyTimeline,
  content: () => (
    <div className="space-y-6 text-foreground">
      <h2 className="text-2xl font-bold font-heading">Standardized Antenatal Surveillance Protocols</h2>
      <p className="text-muted-foreground leading-relaxed">
        Adherence to evidence-based gestational timelines significantly reduces maternal and perinatal morbidity. This interactive clinical timeline aggregates recommendations from WHO, ACOG, RCOG, and CDC into an accessible week-by-week protocol.
      </p>

      <h3 className="text-xl font-semibold font-heading mt-6">Frequently Asked Questions (FAQs)</h3>
      
      <div className="space-y-4">
        <details className="bg-card p-4 rounded-xl border border-border/60">
          <summary className="font-semibold cursor-pointer">When is the optimal time for the routine anatomical survey?</summary>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            International consensus guidelines (ISUOG, ACOG, RCOG) recommend performing the detailed second-trimester anatomical survey between 18w0d and 22w0d gestation. During this window, amniotic fluid volume and fetal organ maturation allow optimal acoustic visualization of cardiac outflow tracts, central nervous system structures, and spinal integrity.
          </p>
        </details>

        <details className="bg-card p-4 rounded-xl border border-border/60">
          <summary className="font-semibold cursor-pointer">Why is Tdap vaccination recommended in every pregnancy?</summary>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            The CDC and ACOG recommend administering the Tdap (Tetanus, Diphtheria, and Pertussis) vaccine between 27 and 36 weeks of gestation in every individual pregnancy, regardless of prior immunization history. This timing maximizes transplacental transfer of maternal pertussis antibodies to protect the newborn during the vulnerable first months of life before primary infant immunization begins.
          </p>
        </details>

        <details className="bg-card p-4 rounded-xl border border-border/60">
          <summary className="font-semibold cursor-pointer">What is the recommended screening window for Gestational Diabetes?</summary>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Universal screening for Gestational Diabetes Mellitus (GDM) is performed between 24w0d and 28w6d gestation using either the 75g 2-hour Oral Glucose Tolerance Test (OGTT) or the two-step 50g Glucose Challenge Test (GCT). Women with high-risk factors (prior GDM, obesity BMI &gt;= 30, strong family history) should be screened at their initial first-trimester prenatal visit.
          </p>
        </details>
      </div>
    </div>
  ),
};
