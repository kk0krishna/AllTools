import { MecDataset } from "./types";

export const whoMecData: MecDataset = {
  wheelId: "who-mec-2015",
  title: "WHO Medical Eligibility Criteria Wheel",
  subtitle: "Medical Eligibility Criteria for Contraceptive Use (5th Edition)",
  edition: "5th Edition (2015 Update)",
  organization: "World Health Organization (WHO)",
  primaryColor: "#0284c7", // Sky/Blue
  accentColor: "#0369a1",
  bgGradient: "from-sky-900/20 via-background to-background",
  lowerWheelImage: "/images/mec/who_lower_wheel.png",
  upperWheelImage: "/images/mec/who_upper_wheel.png",
  methods: [
    {
      id: "chc",
      name: "Combined Hormonal Contraceptives",
      shortName: "COC, P, CVR, CIC",
      type: "hormonal",
      description: "Low-dose combined oral contraceptives (≤ 35 μg ethinyl estradiol), contraceptive patch, vaginal ring, or combined injectable contraceptives.",
      administration: "Daily pill, weekly patch, monthly ring, or monthly injection.",
      typicalFailureRate: "7% per year (oral), 4% (injectable)",
      perfectFailureRate: "0.3% per year",
      mechanism: "Prevents ovulation, thickens cervical mucus to inhibit sperm penetration, alters endometrium.",
      advantages: [
        "Highly effective and rapidly reversible",
        "Reduces menstrual cramps, dysmenorrhoea, and blood loss",
        "Decreases risk of ovarian and endometrial cancers, PID, and benign breast disease",
        "Helps manage acne and PCOS symptoms"
      ],
      disadvantages: [
        "Requires daily compliance (or regular re-administration)",
        "Small risk of venous thromboembolism (VTE), stroke, and myocardial infarction",
        "No protection against STIs or HIV",
        "Contraindicated in smokers ≥35 years, uncontrolled hypertension, migraine with aura, acute DVT"
      ],
      initiationGuidelines: {
        routine: "Can be started on days 1–5 of menstrual cycle without backup. If started > day 5, abstain or use backup for 7 days.",
        postpartumBreastfeeding: "< 6 weeks: Category 4. 6 weeks to < 6 months: Category 3. ≥ 6 months: Category 2.",
        postpartumNonBreastfeeding: "< 3 weeks without VTE risk: Category 3 (with risk: Category 4). 3 to 6 weeks: Category 2 (with risk: Category 3). ≥ 6 weeks: Category 1.",
        postAbortion: "Initiate immediately post-abortion. No additional contraceptive protection required.",
        emergencyBackupNeeded: true,
        backupDuration: "7 days if started after cycle day 5"
      }
    },
    {
      id: "pop",
      name: "Progestogen-Only Pills",
      shortName: "POP (Minipill)",
      type: "hormonal",
      description: "Oral tablets containing only a progestin (e.g. norethisterone, levonorgestrel, or desogestrel).",
      administration: "One pill taken every single day at the exact same hour without any hormone-free breaks.",
      typicalFailureRate: "7% per year",
      perfectFailureRate: "0.3% per year",
      mechanism: "Thickens cervical mucus to prevent sperm entry; suppresses ovulation in ~50-97% of cycles depending on progestin.",
      advantages: [
        "Safe while breastfeeding and early postpartum (< 6 weeks)",
        "No estrogen-related thromboembolic risks (safe in smokers ≥35, hypertension, migraines without aura)",
        "Immediate return to fertility after stopping",
        "Reduces dysmenorrhoea and endometriosis pain"
      ],
      disadvantages: [
        "Strict 3-hour daily compliance window (12 hours for desogestrel)",
        "Irregular bleeding, spotting, or amenorrhea is common",
        "No protection against STIs/HIV"
      ],
      initiationGuidelines: {
        routine: "Initiate on days 1–5 of menstrual cycle with no backup. If started at any other time, use backup for 2 days (48 hours).",
        postpartumBreastfeeding: "< 6 weeks: Category 2. ≥ 6 weeks: Category 1.",
        postpartumNonBreastfeeding: "Immediate postpartum: Category 1.",
        postAbortion: "Initiate immediately or within 7 days post-abortion without backup.",
        emergencyBackupNeeded: true,
        backupDuration: "48 hours (2 days) if started outside days 1–5"
      }
    },
    {
      id: "poi",
      name: "Progestogen-Only Injectables",
      shortName: "DMPA / NET-EN",
      type: "hormonal",
      description: "Depot medroxyprogesterone acetate 150 mg IM / 104 mg SC every 3 months, or norethisterone enanthate 200 mg IM every 2 months.",
      administration: "Deep intramuscular or subcutaneous injection given every 12 weeks (DMPA) or 8 weeks (NET-EN).",
      typicalFailureRate: "4% per year",
      perfectFailureRate: "0.2% per year",
      duration: "3 months (DMPA) or 2 months (NET-EN)",
      mechanism: "Potently suppresses pituitary gonadotropins (LH/FSH), preventing ovulation; thickens cervical mucus; atrophies endometrium.",
      advantages: [
        "Very discreet and convenient (only 4 injections per year)",
        "High clinical efficacy not dependent on daily adherence",
        "Significant reduction in sickle cell crisis frequency",
        "Reduces risk of endometrial cancer and symptomatic uterine fibroids",
        "Can be used safely while breastfeeding from 6 weeks postpartum"
      ],
      disadvantages: [
        "Amenorrhea in >50% of users after 1 year, irregular spotting in early months",
        "Delayed return to fertility (average 7–10 months after final injection)",
        "Modest temporary loss of bone mineral density (BMD)",
        "Mild weight gain in some individuals"
      ],
      initiationGuidelines: {
        routine: "Can be given on days 1–7 of cycle without backup. If > day 7, ensure not pregnant and use backup for 7 days.",
        postpartumBreastfeeding: "< 6 weeks: Category 3 (unless no other method available). ≥ 6 weeks: Category 1.",
        postpartumNonBreastfeeding: "< 21 days: Category 1. Repeat injection window: up to 4 weeks late for DMPA, 2 weeks for NET-EN.",
        postAbortion: "Can be given immediately or within 7 days post-abortion.",
        emergencyBackupNeeded: true,
        backupDuration: "7 days if initiated after day 7"
      }
    },
    {
      id: "implants",
      name: "Progestogen-Only Implants",
      shortName: "LNG / ETG Implants",
      type: "hormonal",
      description: "Subdermal flexible rods releasing etonogestrel (Nexplanon, 1 rod for 3 years) or levonorgestrel (Jadelle, 2 rods for 5 years).",
      administration: "Minor in-clinic outpatient insertion under local anaesthesia in the inner upper arm.",
      typicalFailureRate: "0.05% per year (most effective reversible contraceptive available)",
      perfectFailureRate: "0.05% per year",
      duration: "3 to 5 years",
      mechanism: "Continuous low-dose progestin release inhibits ovulation, thickens cervical mucus, and suppresses endometrial proliferation.",
      advantages: [
        "Highest efficacy of any reversible contraceptive (tier 1 effectiveness)",
        "Zero daily, weekly, or coital maintenance required for up to 3–5 years",
        "Rapid return to baseline fertility upon removal (within 7–14 days)",
        "Completely safe for breastfeeding women from 6 weeks postpartum (Category 1)"
      ],
      disadvantages: [
        "Requires trained health provider for insertion and removal",
        "Changes in bleeding pattern (unpredictable spotting, lighter menses, amenorrhea)",
        "Minor procedural discomfort or bruising at insertion site"
      ],
      initiationGuidelines: {
        routine: "Insert on days 1–5 of menstrual cycle with no backup. If inserted later, use backup for 7 days.",
        postpartumBreastfeeding: "< 6 weeks: Category 2. ≥ 6 weeks: Category 1.",
        postpartumNonBreastfeeding: "Immediately postpartum: Category 1.",
        postAbortion: "Insert immediately post-abortion. No additional contraceptive protection required.",
        emergencyBackupNeeded: true,
        backupDuration: "7 days if inserted after cycle day 5"
      }
    },
    {
      id: "lng_iud",
      name: "Levonorgestrel IUD",
      shortName: "LNG-IUD (Mirena/Kyleena)",
      type: "hormonal",
      description: "Intrauterine device releasing 20 µg/day (or 19.5/13.5 µg/day) levonorgestrel into the uterine cavity.",
      administration: "Office intrauterine insertion using sterile technique by a trained clinician.",
      typicalFailureRate: "0.2% per year",
      perfectFailureRate: "0.2% per year",
      duration: "3 to 8 years (depending on model)",
      mechanism: "Profound local anti-estrogenic effect on endometrium, prevents implantation; thickens cervical mucus; partial ovulation inhibition.",
      advantages: [
        "Dramatic reduction in menstrual blood loss (>85-90% reduction, excellent for menorrhagia)",
        "Marked relief of dysmenorrhoea and adenomyosis pain",
        "Tier 1 contraceptive effectiveness with top-tier user continuation rates",
        "Safe in women with cardiovascular risk factors where estrogen is contraindicated"
      ],
      disadvantages: [
        "Contraindicated in active pelvic infection, unexplained vaginal bleeding, distorted cavity",
        "Requires sterile pelvic exam and speculum insertion",
        "Frequent spotting during first 3–6 months",
        "Small risk of expulsion (~3-5%) or uterine perforation (1 per 1000 insertions)"
      ],
      initiationGuidelines: {
        routine: "Insert within 7 days of cycle start with no backup. If inserted later, abstain or use backup for 7 days.",
        postpartumBreastfeeding: "< 48 hours: Category 2 (Cat 1 if non-breastfeeding). 48 hours to < 4 weeks: Category 3. ≥ 4 weeks: Category 1.",
        postpartumNonBreastfeeding: "< 48 hours: Category 1. 48 hours to < 4 weeks: Category 3. ≥ 4 weeks: Category 1.",
        postAbortion: "Immediate post-first trimester abortion: Category 1. Septic abortion: Category 4.",
        emergencyBackupNeeded: true,
        backupDuration: "7 days if inserted after cycle day 7"
      }
    },
    {
      id: "cu_iud",
      name: "Copper Intrauterine Device",
      shortName: "Cu-IUD (TCu 380A)",
      type: "non-hormonal",
      description: "T-shaped polyethylene frame with pure electrolytic copper wire wound around the stem and copper sleeves on horizontal arms.",
      administration: "In-office sterile intrauterine placement by a qualified healthcare professional.",
      typicalFailureRate: "0.8% per year",
      perfectFailureRate: "0.6% per year",
      duration: "10 to 12 years (TCu 380A)",
      mechanism: "Copper ions cause sterile inflammatory reaction in endometrium; highly toxic/spermicidal to sperm; inhibits sperm motility and viability.",
      advantages: [
        "100% hormone-free: no metabolic, vascular, hepatic, or hormonal side effects whatsoever",
        "Immediate contraceptive protection upon insertion and immediate return of fertility after removal",
        "Extremely cost-effective, long-acting (up to 12 years of continuous protection)",
        "Can be used as the most effective Emergency Contraceptive within 5 days of unprotected intercourse (>99.9% effective)"
      ],
      disadvantages: [
        "Can increase menstrual flow and dysmenorrhoea in first 3–6 months",
        "Contraindicated in acute pelvic inflammatory disease, purulent cervicitis, unexplained bleeding",
        "Requires pelvic examination and sterile insertion technique"
      ],
      initiationGuidelines: {
        routine: "Insert within 12 days of cycle start without backup. Can be inserted at any time if reasonably certain not pregnant.",
        postpartumBreastfeeding: "< 48 hours: Category 1. 48 hours to < 4 weeks: Category 3. ≥ 4 weeks: Category 1.",
        postpartumNonBreastfeeding: "< 48 hours: Category 1. 48 hours to < 4 weeks: Category 3. ≥ 4 weeks: Category 1.",
        postAbortion: "Immediate post-first trimester abortion: Category 1. Post-septic abortion: Category 4.",
        emergencyBackupNeeded: false
      }
    }
  ],
  sectors: [
    {
      id: "who-nulliparity",
      sectorIndex: 0,
      categoryName: "NULLIPARITY",
      conditionName: "Nulliparous",
      subCondition: "Women who have not given birth",
      startAngle: 0,
      endAngle: 10,
      scores: [
        { methodId: "chc", score: "1" },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "2", clarification: "Safe; smaller uterus may cause slight increase in expulsion or cramp sensation." },
        { methodId: "cu_iud", score: "2", clarification: "Safe; nulliparity is not a contraindication to IUD use." }
      ]
    },
    {
      id: "who-adolescents",
      sectorIndex: 1,
      categoryName: "ADOLESCENTS",
      conditionName: "Menarche to age < 18 years",
      subCondition: "Younger adolescent clients",
      startAngle: 10,
      endAngle: 20,
      scores: [
        { methodId: "chc", score: "1" },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "2", clarification: "Theoretical concern regarding bone mineral density acquisition; benefits generally outweigh risks." },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "2", clarification: "Eligible; STI screening recommended if at increased risk." },
        { methodId: "cu_iud", score: "2", clarification: "Eligible; counsel on condom dual protection for STI prevention." }
      ]
    },
    {
      id: "who-unexplained-bleeding",
      sectorIndex: 2,
      categoryName: "VAGINAL BLEEDING",
      conditionName: "Unexplained Vaginal Bleeding",
      subCondition: "Suspicious for serious condition prior to evaluation",
      startAngle: 20,
      endAngle: 30,
      scores: [
        { methodId: "chc", score: "1" },
        { methodId: "pop", score: "2" },
        { methodId: "poi", score: "2" },
        { methodId: "implants", score: "2" },
        { methodId: "lng_iud", score: "4", notes: ["A"], clarification: "Do not initiate until etiology evaluated and pelvic malignancy excluded. If condition develops during use, can continue (Cat 2)." },
        { methodId: "cu_iud", score: "4", notes: ["A"], clarification: "Do not initiate until underlying cause diagnosed. If develops while using, can continue during treatment (Cat 2)." }
      ]
    },
    {
      id: "who-uterine-fibroids",
      sectorIndex: 3,
      categoryName: "UTERINE FIBROIDS",
      conditionName: "Uterine Fibroids",
      subCondition: "With or without distortion of the uterine cavity",
      startAngle: 30,
      endAngle: 40,
      scores: [
        { methodId: "chc", score: "1" },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "1", notes: ["H"], clarification: "Category 1 without cavity distortion; Category 4 if uterine cavity distorted preventing proper placement." },
        { methodId: "cu_iud", score: "1", notes: ["H"], clarification: "Category 1 without cavity distortion; Category 4 if cavity distorted." }
      ]
    },
    {
      id: "who-cervical-neoplasia",
      sectorIndex: 4,
      categoryName: "CERVICAL NEOPLASIA",
      conditionName: "Cervical Intraepithelial Neoplasia (CIN)",
      subCondition: "Cervical ectropion or dysplastic changes",
      startAngle: 40,
      endAngle: 50,
      scores: [
        { methodId: "chc", score: "2", clarification: "Mild concern over cervical cancer progression with long-term use; monitoring advised." },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "2" },
        { methodId: "implants", score: "2" },
        { methodId: "lng_iud", score: "2" },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-cervical-cancer",
      sectorIndex: 5,
      categoryName: "CERVICAL CANCER",
      conditionName: "Cervical Cancer (Pre-treatment)",
      subCondition: "Awaiting curative oncologic treatment",
      startAngle: 50,
      endAngle: 60,
      scores: [
        { methodId: "chc", score: "2" },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "2" },
        { methodId: "implants", score: "2" },
        { methodId: "lng_iud", score: "4", notes: ["A"], clarification: "Do not initiate in presence of untreated cervical cancer. If diagnosed while in place, can continue pending therapy." },
        { methodId: "cu_iud", score: "4", notes: ["A"], clarification: "Do not initiate; risk of severe infection and bleeding during insertion." }
      ]
    },
    {
      id: "who-breast-cancer",
      sectorIndex: 6,
      categoryName: "BREAST CANCER",
      conditionName: "Current Breast Cancer",
      subCondition: "Active hormone-sensitive malignancy",
      startAngle: 60,
      endAngle: 70,
      scores: [
        { methodId: "chc", score: "4", clarification: "Hormone dependent tumour: absolute contraindication." },
        { methodId: "pop", score: "4", clarification: "Absolute contraindication: progestins promote tumor proliferation." },
        { methodId: "poi", score: "4", clarification: "Absolute contraindication: depot progestin stimulates hormone receptors." },
        { methodId: "implants", score: "4", clarification: "Absolute contraindication." },
        { methodId: "lng_iud", score: "4", clarification: "Absolute contraindication: systemic absorption occurs." },
        { methodId: "cu_iud", score: "1", clarification: "Completely non-hormonal; first-line safest choice for breast cancer patients." }
      ]
    },
    {
      id: "who-liver-tumour",
      sectorIndex: 7,
      categoryName: "LIVER DISEASES",
      conditionName: "Liver Tumour (Benign / Malignant)",
      subCondition: "Hepatocellular adenoma or carcinoma / hepatoma",
      startAngle: 70,
      endAngle: 80,
      scores: [
        { methodId: "chc", score: "4", notes: ["J"], clarification: "Estrogens stimulate adenoma rupture and malignant progression." },
        { methodId: "pop", score: "3", notes: ["J"] },
        { methodId: "poi", score: "3", notes: ["J"] },
        { methodId: "implants", score: "3", notes: ["J"] },
        { methodId: "lng_iud", score: "3", notes: ["J"] },
        { methodId: "cu_iud", score: "1", clarification: "Non-hormonal; no hepatic metabolism." }
      ]
    },
    {
      id: "who-hepatitis-acute",
      sectorIndex: 8,
      categoryName: "LIVER DISEASES",
      conditionName: "Acute Viral Hepatitis / Flare",
      subCondition: "Active hepatic inflammation or acute jaundice",
      startAngle: 80,
      endAngle: 90,
      scores: [
        { methodId: "chc", score: "3/4", notes: ["K", "A"], clarification: "Category 3/4 to initiate; if flare occurs while already using, can continue (Cat 2)." },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "1" },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-hepatitis-history",
      sectorIndex: 9,
      categoryName: "LIVER DISEASES",
      conditionName: "History of Hepatitis / Carrier",
      subCondition: "Chronic viral hepatitis or asymptomatic carrier",
      startAngle: 90,
      endAngle: 100,
      scores: [
        { methodId: "chc", score: "1" },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "1" },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-vte-acute",
      sectorIndex: 10,
      categoryName: "VENOUS THROMBOEMBOLISM",
      conditionName: "Acute DVT / PE",
      subCondition: "Current acute deep venous thrombosis or pulmonary embolism",
      startAngle: 100,
      endAngle: 110,
      scores: [
        { methodId: "chc", score: "4", clarification: "Estrogen triggers hypercoagulability and marked thrombosis recurrence." },
        { methodId: "pop", score: "2" },
        { methodId: "poi", score: "2" },
        { methodId: "implants", score: "2" },
        { methodId: "lng_iud", score: "2" },
        { methodId: "cu_iud", score: "1", notes: ["L"], clarification: "Category 2 if established on anticoagulation therapy (risk of heavy bleeding)." }
      ]
    },
    {
      id: "who-vte-surgery",
      sectorIndex: 11,
      categoryName: "VENOUS THROMBOEMBOLISM",
      conditionName: "Major Surgery with Prolonged Immobilization",
      subCondition: "High risk of post-operative venous stasis",
      startAngle: 110,
      endAngle: 120,
      scores: [
        { methodId: "chc", score: "4", clarification: "Avoid CHC due to compounded thromboembolic risk." },
        { methodId: "pop", score: "2" },
        { methodId: "poi", score: "2" },
        { methodId: "implants", score: "2" },
        { methodId: "lng_iud", score: "2" },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-cvd-stroke",
      sectorIndex: 12,
      categoryName: "CARDIOVASCULAR DISEASE",
      conditionName: "Stroke (History of CVA)",
      subCondition: "Past ischemic or hemorrhagic cerebrovascular accident",
      startAngle: 120,
      endAngle: 130,
      scores: [
        { methodId: "chc", score: "4", clarification: "High risk of recurrent ischemic or thromboembolic stroke." },
        { methodId: "pop", score: "2", notes: ["M"] },
        { methodId: "poi", score: "3", notes: ["L"] },
        { methodId: "implants", score: "2", notes: ["M"] },
        { methodId: "lng_iud", score: "2", notes: ["M"] },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-cvd-ihd",
      sectorIndex: 13,
      categoryName: "CARDIOVASCULAR DISEASE",
      conditionName: "Ischaemic Heart Disease (IHD)",
      subCondition: "Current or history of myocardial infarction or angina",
      startAngle: 130,
      endAngle: 140,
      scores: [
        { methodId: "chc", score: "4", clarification: "Contraindicated; substantial risk of recurrent coronary events." },
        { methodId: "pop", score: "2", notes: ["M"] },
        { methodId: "poi", score: "3", notes: ["L"] },
        { methodId: "implants", score: "2", notes: ["M"] },
        { methodId: "lng_iud", score: "2", notes: ["M"] },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-cvd-risk-factors",
      sectorIndex: 14,
      categoryName: "CARDIOVASCULAR DISEASE",
      conditionName: "Multiple Cardiovascular Risk Factors",
      subCondition: "Combination of older age, smoking, diabetes, hypertension, obesity, dyslipidemia",
      startAngle: 140,
      endAngle: 150,
      scores: [
        { methodId: "chc", score: "3/4", notes: ["N"], clarification: "Category 3 or 4 depending on severity and number of concurrent risk factors." },
        { methodId: "pop", score: "2" },
        { methodId: "poi", score: "3", notes: ["L"] },
        { methodId: "implants", score: "2" },
        { methodId: "lng_iud", score: "2" },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-htn-severe",
      sectorIndex: 15,
      categoryName: "HYPERTENSION",
      conditionName: "Severe Hypertension (≥ 160 / ≥ 100)",
      subCondition: "Systolic ≥ 160 mm Hg or Diastolic ≥ 100 mm Hg, or with vascular disease",
      startAngle: 150,
      endAngle: 160,
      scores: [
        { methodId: "chc", score: "4", notes: ["O"], clarification: "Severe risk of stroke and cardiac event." },
        { methodId: "pop", score: "2" },
        { methodId: "poi", score: "3", clarification: "DMPA may slightly elevate blood pressure or affect lipid profile." },
        { methodId: "implants", score: "2" },
        { methodId: "lng_iud", score: "2" },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-htn-moderate",
      sectorIndex: 16,
      categoryName: "HYPERTENSION",
      conditionName: "Moderate / Controlled Hypertension",
      subCondition: "140–159 / 90–99 mm Hg or adequately controlled on medication",
      startAngle: 160,
      endAngle: 170,
      scores: [
        { methodId: "chc", score: "3", notes: ["O"], clarification: "Generally not recommended unless other methods unavailable." },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "2" },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "1" },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-obesity",
      sectorIndex: 17,
      categoryName: "OBESITY",
      conditionName: "Obesity (BMI ≥ 30 kg/m²)",
      subCondition: "BMI ≥ 30 kg/m² across all age groups",
      startAngle: 170,
      endAngle: 180,
      scores: [
        { methodId: "chc", score: "2", clarification: "Baseline VTE risk is elevated; CHC can generally be used." },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "1", notes: ["P"], clarification: "Category 2 if age < 18 years and obese." },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "1" },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-diabetes",
      sectorIndex: 18,
      categoryName: "DIABETES",
      conditionName: "Diabetes Mellitus (Current)",
      subCondition: "Non-vascular, uncomplicated insulin/non-insulin dependent",
      startAngle: 180,
      endAngle: 190,
      scores: [
        { methodId: "chc", score: "2", notes: ["Q"], clarification: "Category 3/4 if complicated (nephropathy, retinopathy, neuropathy) or > 20 years duration." },
        { methodId: "pop", score: "2" },
        { methodId: "poi", score: "2", notes: ["Q"], clarification: "Category 3 if complicated or > 20 years duration." },
        { methodId: "implants", score: "2" },
        { methodId: "lng_iud", score: "2" },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-smoking-lt-35",
      sectorIndex: 19,
      categoryName: "SMOKING",
      conditionName: "Smoking: Age < 35 Years",
      subCondition: "Smoker of any quantity under 35 years of age",
      startAngle: 190,
      endAngle: 200,
      scores: [
        { methodId: "chc", score: "2" },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "1" },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-smoking-gte-35",
      sectorIndex: 20,
      categoryName: "SMOKING",
      conditionName: "Smoking: Age ≥ 35 Years",
      subCondition: "Smoker 35 years or older",
      startAngle: 200,
      endAngle: 210,
      scores: [
        { methodId: "chc", score: "3/4", notes: ["R"], clarification: "Category 3 if < 15 cigarettes/day; Category 4 if ≥ 15 cigarettes/day." },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "1" },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-headache-non-migraine",
      sectorIndex: 21,
      categoryName: "HEADACHE",
      conditionName: "Non-migrainous Headache",
      subCondition: "Tension, cluster, or sinus headache without neurological symptoms",
      startAngle: 210,
      endAngle: 220,
      scores: [
        { methodId: "chc", score: "1/2", clarification: "Category 1 if mild/tension; Category 2 for migraine without aura in women < 35." },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "1" },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-headache-aura",
      sectorIndex: 22,
      categoryName: "HEADACHE",
      conditionName: "Migraine with Aura (Any Age)",
      subCondition: "Focal neurological symptoms such as scintillating scotoma or numbness",
      startAngle: 220,
      endAngle: 230,
      scores: [
        { methodId: "chc", score: "4", notes: ["S"], clarification: "Unacceptable risk of ischemic stroke." },
        { methodId: "pop", score: "2", notes: ["M", "S"], clarification: "Category 2 to initiate. If aura develops during use, switch to non-hormonal (Cat 3)." },
        { methodId: "poi", score: "2", notes: ["M"] },
        { methodId: "implants", score: "2", notes: ["M"] },
        { methodId: "lng_iud", score: "2", notes: ["M"] },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-meds-anticonvulsants",
      sectorIndex: 23,
      categoryName: "MEDICATIONS",
      conditionName: "Certain Anti-convulsants",
      subCondition: "Carbamazepine, phenytoin, phenobarbital, primidone, topiramate, lamotrigine",
      startAngle: 230,
      endAngle: 240,
      scores: [
        { methodId: "chc", score: "3", notes: ["T", "U"], clarification: "Hepatic CYP450 inducers speed estrogen clearance, risking method failure." },
        { methodId: "pop", score: "3", notes: ["V"], clarification: "Category 1 if taking lamotrigine alone." },
        { methodId: "poi", score: "1", notes: ["W"], clarification: "DMPA = 1 (depot dose overcomes induction); NET-EN = 2." },
        { methodId: "implants", score: "2", clarification: "Efficacy may be mildly reduced." },
        { methodId: "lng_iud", score: "1", clarification: "Local action; unhindered by hepatic enzyme induction." },
        { methodId: "cu_iud", score: "1", clarification: "Completely unaffected by enzyme-inducing drugs." }
      ]
    },
    {
      id: "who-meds-rifampicin",
      sectorIndex: 24,
      categoryName: "MEDICATIONS",
      conditionName: "Rifampicin / Rifabutin Therapy",
      subCondition: "Potent cytochrome P450 3A4 enzyme inducers used in tuberculosis",
      startAngle: 240,
      endAngle: 250,
      scores: [
        { methodId: "chc", score: "3", notes: ["X"], clarification: "Marked clearance of ethinylestradiol leads to contraceptive breakthrough." },
        { methodId: "pop", score: "3" },
        { methodId: "poi", score: "1" },
        { methodId: "implants", score: "2" },
        { methodId: "lng_iud", score: "1" },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-meds-arv",
      sectorIndex: 25,
      categoryName: "MEDICATIONS",
      conditionName: "Antiretroviral Therapy (ART)",
      subCondition: "Taking ARV regimens for HIV (EFV, NVP, ritonavir-boosted PIs, NRTIs)",
      startAngle: 250,
      endAngle: 260,
      scores: [
        { methodId: "chc", score: "1-2", notes: ["Y"], clarification: "Category 2 for EFV, NVP, ATV/r, LPV/r, DRV/r, RTV. Category 1 for all NRTIs and Integrase Inhibitors." },
        { methodId: "pop", score: "1-2", notes: ["Y"] },
        { methodId: "poi", score: "1-2", notes: ["Y"], clarification: "Category 1 for DMPA with all ARVs; Category 2 for NET-EN." },
        { methodId: "implants", score: "1-2", notes: ["Y"] },
        { methodId: "lng_iud", score: "1" },
        { methodId: "cu_iud", score: "1" }
      ]
    },
    {
      id: "who-hiv-stage-3-4",
      sectorIndex: 26,
      categoryName: "HIV",
      conditionName: "WHO Stage 3 or 4 Clinical Disease",
      subCondition: "Severe or advanced HIV clinical disease / opportunistic infections",
      startAngle: 260,
      endAngle: 270,
      scores: [
        { methodId: "chc", score: "1" },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "2/3", notes: ["A", "Z"], clarification: "Category 3 to initiate in Stage 3/4 until clinically stable on ART; Category 2 to continue." },
        { methodId: "cu_iud", score: "2/3", notes: ["A", "Z"], clarification: "Category 3 to initiate; Category 2 to continue." }
      ]
    },
    {
      id: "who-sti-gonorrhoea-chlamydia",
      sectorIndex: 27,
      categoryName: "SEXUALLY TRANSMITTED INFECTIONS",
      conditionName: "Gonorrhoea & Chlamydia (Current)",
      subCondition: "Purulent cervicitis or verified Neisseria / Chlamydia infection",
      startAngle: 270,
      endAngle: 280,
      scores: [
        { methodId: "chc", score: "1", clarification: "Hormonal method does not alter upper tract infection risk." },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "4", notes: ["A"], clarification: "Do not insert IUD during acute cervical infection; risk of severe pelvic sepsis. If already in place, treat without removal." },
        { methodId: "cu_iud", score: "4", notes: ["A"], clarification: "Do not insert. Treat infection first." }
      ]
    },
    {
      id: "who-sti-other-vaginitis",
      sectorIndex: 28,
      categoryName: "SEXUALLY TRANSMITTED INFECTIONS",
      conditionName: "Other STIs and Vaginitis",
      subCondition: "Trichomonas, Bacterial Vaginosis, HPV, HSV",
      startAngle: 280,
      endAngle: 290,
      scores: [
        { methodId: "chc", score: "1" },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "2", clarification: "Generally use; treat vaginitis concomitantly." },
        { methodId: "cu_iud", score: "2", clarification: "Generally use; treat concomitantly." }
      ]
    },
    {
      id: "who-sti-increased-risk",
      sectorIndex: 29,
      categoryName: "SEXUALLY TRANSMITTED INFECTIONS",
      conditionName: "Increased Risk of STIs",
      subCondition: "Multiple partners or partner with active STI",
      startAngle: 290,
      endAngle: 300,
      scores: [
        { methodId: "chc", score: "1" },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "2/3", notes: ["B"], clarification: "Category 3 if very high individual likelihood of exposure to gonorrhoea/chlamydia; otherwise Category 2." },
        { methodId: "cu_iud", score: "2/3", notes: ["B"] }
      ]
    },
    {
      id: "who-pid-current",
      sectorIndex: 30,
      categoryName: "PELVIC INFLAMMATORY DISEASE",
      conditionName: "Current PID",
      subCondition: "Active pelvic inflammatory disease / salpingitis",
      startAngle: 300,
      endAngle: 310,
      scores: [
        { methodId: "chc", score: "1" },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "4", notes: ["C", "A"], clarification: "Do not insert. If woman develops PID while using IUD, give antibiotic treatment and continue method." },
        { methodId: "cu_iud", score: "4", notes: ["C", "A"], clarification: "Do not insert. If past PID without current symptoms, all methods = 1." }
      ]
    },
    {
      id: "who-sepsis",
      sectorIndex: 31,
      categoryName: "SEPSIS",
      conditionName: "Puerperal / Post-Abortion Sepsis",
      subCondition: "Active postpartum or post-abortive uterine sepsis",
      startAngle: 310,
      endAngle: 320,
      scores: [
        { methodId: "chc", score: "1" },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "4", clarification: "Absolute contraindication: insertion into infected uterus carries severe risk of peritonitis and septic shock." },
        { methodId: "cu_iud", score: "4", clarification: "Absolute contraindication." }
      ]
    },
    {
      id: "who-postpartum-lt-48h",
      sectorIndex: 32,
      categoryName: "POSTPARTUM AND BREASTFEEDING",
      conditionName: "< 48 Hours Postpartum",
      subCondition: "Immediate post-placental insertion or early postpartum",
      startAngle: 320,
      endAngle: 330,
      scores: [
        { methodId: "chc", score: "4", notes: ["D"], clarification: "High VTE risk and estrogen suppression of milk volume. If not breastfeeding and no VTE risk: Category 3." },
        { methodId: "pop", score: "2" },
        { methodId: "poi", score: "3", clarification: "Theoretical concern regarding neonatal steroid exposure; Cat 1 if non-breastfeeding." },
        { methodId: "implants", score: "2" },
        { methodId: "lng_iud", score: "2", notes: ["E"], clarification: "Category 1 if not breastfeeding; Category 2 if breastfeeding." },
        { methodId: "cu_iud", score: "1", clarification: "Immediate post-placental placement (< 48 hrs) is safe, convenient, and highly effective." }
      ]
    },
    {
      id: "who-postpartum-48h-4w",
      sectorIndex: 33,
      categoryName: "POSTPARTUM AND BREASTFEEDING",
      conditionName: "48 Hours to < 4 Weeks Postpartum",
      subCondition: "Uterine involution phase",
      startAngle: 330,
      endAngle: 340,
      scores: [
        { methodId: "chc", score: "4", notes: ["D", "F"], clarification: "Category 4 if breastfeeding. If not breastfeeding: Category 3 (<3 weeks), Category 2 (3 to <6 weeks without VTE risk)." },
        { methodId: "pop", score: "2" },
        { methodId: "poi", score: "3" },
        { methodId: "implants", score: "2" },
        { methodId: "lng_iud", score: "3", clarification: "Elevated risk of uterine perforation during subinvolution; delay until 4 weeks." },
        { methodId: "cu_iud", score: "3", clarification: "Elevated risk of perforation; delay insertion until ≥ 4 weeks postpartum." }
      ]
    },
    {
      id: "who-postpartum-4w-6w",
      sectorIndex: 34,
      categoryName: "POSTPARTUM AND BREASTFEEDING",
      conditionName: "4 Weeks to < 6 Weeks Postpartum",
      subCondition: "Involution complete; establishing lactation",
      startAngle: 340,
      endAngle: 350,
      scores: [
        { methodId: "chc", score: "4", notes: ["F"], clarification: "Category 4 if breastfeeding. If not breastfeeding: Category 2 (or 3 with VTE risk factors)." },
        { methodId: "pop", score: "2" },
        { methodId: "poi", score: "3" },
        { methodId: "implants", score: "2" },
        { methodId: "lng_iud", score: "1", clarification: "Safe to insert; uterine involution complete." },
        { methodId: "cu_iud", score: "1", clarification: "Safe to insert." }
      ]
    },
    {
      id: "who-postpartum-6w-6m",
      sectorIndex: 35,
      categoryName: "POSTPARTUM AND BREASTFEEDING",
      conditionName: "6 Weeks to < 6 Months Postpartum",
      subCondition: "Established lactation / infant growing",
      startAngle: 350,
      endAngle: 360,
      scores: [
        { methodId: "chc", score: "3", notes: ["G"], clarification: "Use of method not usually recommended unless other methods unavailable. Category 1 if not breastfeeding." },
        { methodId: "pop", score: "1" },
        { methodId: "poi", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "lng_iud", score: "1" },
        { methodId: "cu_iud", score: "1" }
      ]
    }
  ],
  notes: {
    A: {
      code: "A",
      title: "Continuation During Treatment",
      text: "If the condition develops while using the method, the woman can continue using it during treatment."
    },
    B: {
      code: "B",
      title: "High Risk of Gonorrhoea or Chlamydia",
      text: "If there is a very high likelihood of exposure to gonorrhoea or chlamydia, category is 3."
    },
    C: {
      code: "C",
      title: "Past Pelvic Inflammatory Disease",
      text: "If past pelvic inflammatory disease (PID) without current symptoms, all methods = 1, including IUDs."
    },
    D: {
      code: "D",
      title: "Early Postpartum Non-Breastfeeding VTE Risk",
      text: "If < 3 weeks, not breastfeeding and no other VTE risk factors = 3."
    },
    E: {
      code: "E",
      title: "Postpartum Non-Breastfeeding LNG-IUD",
      text: "If not breastfeeding, LNG-IUD = 1."
    },
    F: {
      code: "F",
      title: "Postpartum Non-Breastfeeding 3 to 6 Weeks",
      text: "If 3 to < 6 weeks, not breastfeeding and no other VTE risk factors = 2; with other VTE risk factors = 3."
    },
    G: {
      code: "G",
      title: "Postpartum Breastfeeding ≥ 6 Weeks",
      text: "If ≥ 6 weeks and not breastfeeding = 1."
    },
    H: {
      code: "H",
      title: "Distorted Uterine Cavity",
      text: "If uterine cavity is distorted, preventing insertion = 4."
    },
    I: {
      code: "I",
      title: "Liver Tumour Classification",
      text: "Refers to hepatocellular adenoma (benign) or hepatocellular carcinoma / hepatoma (malignant)."
    },
    J: {
      code: "J",
      title: "Injectables with Liver Tumours",
      text: "If adenoma CIC = 3; if carcinoma / hepatoma CIC = 3/4."
    },
    K: {
      code: "K",
      title: "Combined Injectables in Acute Hepatitis",
      text: "CIC = 3."
    },
    L: {
      code: "L",
      title: "Anticoagulation Therapy",
      text: "If established on anticoagulation therapy = 2."
    },
    M: {
      code: "M",
      title: "Vascular Condition Developing on Method",
      text: "If condition developed while on this method, consider switching to a non-hormonal method."
    },
    N: {
      code: "N",
      title: "Cardiovascular Risk Factors",
      text: "Risk factors: older age, smoking, diabetes, hypertension, obesity, and known dyslipidaemias."
    },
    O: {
      code: "O",
      title: "Blood Pressure Measurement",
      text: "If cannot measure blood pressure and no known history of hypertension, can use all methods. Either systolic or diastolic blood pressure may be elevated."
    },
    P: {
      code: "P",
      title: "Adolescent Obesity and Injectables",
      text: "If age < 18 years and obese, DMPA / NET-EN = 2."
    },
    Q: {
      code: "Q",
      title: "Diabetes Complications and Duration",
      text: "For insulin-dependent and non-insulin-dependent. If complicated or > 20 years duration, COC/P/CVR, CIC = 3/4; DMPA, NET-EN = 3."
    },
    R: {
      code: "R",
      title: "Smoking Quantity over Age 35",
      text: "If < 15 cigarettes/day CIC = 2. If ≥ 15 cigarettes/day COC/P/CVR = 4."
    },
    S: {
      code: "S",
      title: "Migraine Aura Definition",
      text: "Aura is focal neurological symptoms, such as flickering lights or zigzag lines. If no aura & age < 35 COC/P/CVR, CIC = 2, POP = 1. If no aura & age ≥ 35 COC/P/CVR, CIC = 3, POP = 1."
    },
    T: {
      code: "T",
      title: "Enzyme-Inducing Anticonvulsants",
      text: "Barbiturates, carbamazepine, oxcarbazepine, phenytoin, primidone, topiramate, and lamotrigine."
    },
    U: {
      code: "U",
      title: "Combined Injectables with Anticonvulsants",
      text: "If barbiturates, carbamazepine, oxcarbazepine, phenytoin, primidone or topiramate, CIC = 2."
    },
    V: {
      code: "V",
      title: "Lamotrigine Interaction",
      text: "If lamotrigine = 1."
    },
    W: {
      code: "W",
      title: "Injectable Progestins with Anticonvulsants",
      text: "DMPA = 1, NET-EN = 2."
    },
    X: {
      code: "X",
      title: "Combined Injectables with Rifampicin",
      text: "CICs = 2."
    },
    Y: {
      code: "Y",
      title: "Antiretroviral Therapy Regimens",
      text: "If antiretroviral therapy with EFV, NVP, ATV/r, LPV/r, DRV/r, RTV: COC/P/CVR, CIC, POP, NET-EN, Implants = 2; DMPA = 1. For all NRTIs, ETR, RPV, RAL each method = 1."
    },
    Z: {
      code: "Z",
      title: "Advanced HIV Clinical Disease",
      text: "If WHO Stage 3 or 4 (severe or advanced HIV clinical disease), IUD = 3."
    }
  },
  safeConditions: {
    reproductive: [
      "Benign breast disease or undiagnosed breast mass",
      "Benign ovarian tumours, including ovarian cysts",
      "Dysmenorrhoea (painful periods)",
      "Endometriosis",
      "History of gestational diabetes",
      "History of high blood pressure during pregnancy",
      "History of pelvic surgery, including caesarean delivery",
      "Irregular, heavy or prolonged menstrual bleeding (explained)",
      "Past ectopic pregnancy",
      "Past pelvic inflammatory disease (PID)",
      "Post-abortion (no sepsis)",
      "Postpartum ≥ 6 months"
    ],
    medical: [
      "Depression and depressive disorders",
      "Epilepsy (uncomplicated)",
      "HIV asymptomatic or mild clinical disease (WHO Stage 1 or 2)",
      "Iron-deficiency anaemia, sickle-cell disease and thalassaemia",
      "Malaria (past or acute)",
      "Mild compensated cirrhosis",
      "Schistosomiasis (bilharzia)",
      "Superficial venous disorders, including varicose veins",
      "Thyroid disorders (goitre, hyperthyroid, hypothyroid)",
      "Tuberculosis (non-pelvic)",
      "Uncomplicated valvular heart disease",
      "Viral hepatitis (carrier or chronic asymptomatic)"
    ],
    other: [
      "Adolescent age group",
      "Breast cancer family history",
      "Venous thromboembolism (VTE) family history",
      "High risk for HIV (condom dual protection recommended)",
      "Surgery without prolonged immobilization",
      "Taking standard antibiotics (excluding rifampicin/rifabutin)"
    ]
  },
  emergencyContraception: {
    conditions: [
      { condition: "Pregnancy", cuIud: "4", coc: "NA", lng: "NA", upa: "NA", notes: "ECPs are not effective once pregnancy is established, but will not harm an established pregnancy." },
      { condition: "Breastfeeding", cuIud: "1", coc: "1", lng: "1", upa: "2", notes: "Breastfeeding not recommended for 1 week after UPA (discard expressed milk)." },
      { condition: "Past ectopic pregnancy", cuIud: "1", coc: "1", lng: "1", upa: "1" },
      { condition: "Obesity (BMI ≥ 30 kg/m²)", cuIud: "1", coc: "1", lng: "1", upa: "1", notes: "ECPs may be less effective in BMI ≥ 30 kg/m²; Cu-IUD is first-choice; no safety concerns." },
      { condition: "History of severe cardiovascular disease", cuIud: "1", coc: "2", lng: "2", upa: "2" },
      { condition: "Migraine", cuIud: "1", coc: "2", lng: "2", upa: "2" },
      { condition: "Severe liver disease (including jaundice)", cuIud: "1", coc: "2", lng: "2", upa: "2" },
      { condition: "CYP3A4 inducers (e.g. rifampicin, phenytoin, efavirenz)", cuIud: "1", coc: "1", lng: "1", upa: "1", notes: "Strong CYP3A4 inducers reduce ECP levels; consider double-dose LNG or Cu-IUD." },
      { condition: "Repeated ECP use", cuIud: "1", coc: "1", lng: "1", upa: "1", notes: "Safe; indicate need for routine contraceptive counseling." },
      { condition: "Rape / sexual assault (low STI risk)", cuIud: "1", coc: "1", lng: "1", upa: "1" },
      { condition: "Rape / sexual assault (high STI risk)", cuIud: "3", coc: "1", lng: "1", upa: "1", notes: "Cu-IUD Cat 3 due to PID risk; oral ECPs preferred." }
    ],
    guidanceNotes: [
      "Cu-IUD is the most effective form of emergency contraception (>99% effective) and can be inserted within 5 days of unprotected intercourse.",
      "If ovulation timing is known, Cu-IUD can be inserted beyond 5 days after intercourse as long as it is within 5 days after ovulation.",
      "Levonorgestrel (LNG 1.5 mg) should be taken as soon as possible within 72 hours (3 days).",
      "Ulipristal acetate (UPA 30 mg) maintains high efficacy for up to 120 hours (5 days) after unprotected sex."
    ]
  },
  antiretroviralInteractions: [
    {
      drugClass: "Nucleoside Reverse Transcriptase Inhibitors (NRTIs)",
      abbreviation: "ABC, TDF, AZT, 3TC, DDI, FTC, D4T",
      drugs: ["Abacavir", "Tenofovir", "Zidovudine", "Lamivudine", "Didanosine", "Emtricitabine", "Stavudine"],
      chcScore: "1",
      popScore: "1",
      dmpaScore: "1",
      implantsScore: "1",
      lngIudScore: "1",
      cuIudScore: "1",
      notes: "No interactions. All contraceptive methods can be used without restrictions."
    },
    {
      drugClass: "Non-Nucleoside Reverse Transcriptase Inhibitors (NNRTIs)",
      abbreviation: "EFV, NVP",
      drugs: ["Efavirenz", "Nevirapine"],
      chcScore: "2",
      popScore: "2",
      dmpaScore: "1",
      implantsScore: "2",
      lngIudScore: "1",
      cuIudScore: "1",
      notes: "Enzyme-induction can reduce systemic progestin levels. DMPA and IUDs are ideal choices."
    },
    {
      drugClass: "Non-Nucleoside Reverse Transcriptase Inhibitors (NNRTIs)",
      abbreviation: "ETR, RPV",
      drugs: ["Etravirine", "Rilpivirine"],
      chcScore: "1",
      popScore: "1",
      dmpaScore: "1",
      implantsScore: "1",
      lngIudScore: "1",
      cuIudScore: "1",
      notes: "No significant interaction with contraceptive steroids."
    },
    {
      drugClass: "Protease Inhibitors (Ritonavir-boosted PIs)",
      abbreviation: "ATV/r, LPV/r, DRV/r, RTV",
      drugs: ["Ritonavir-boosted Atazanavir", "Ritonavir-boosted Lopinavir", "Ritonavir-boosted Darunavir", "Ritonavir"],
      chcScore: "2",
      popScore: "2",
      dmpaScore: "1",
      implantsScore: "2",
      lngIudScore: "1",
      cuIudScore: "1",
      notes: "May alter ethinylestradiol and progestin AUC. DMPA and IUDs remain category 1."
    },
    {
      drugClass: "Integrase Inhibitors (INSTIs)",
      abbreviation: "RAL, DTG",
      drugs: ["Raltegravir", "Dolutegravir"],
      chcScore: "1",
      popScore: "1",
      dmpaScore: "1",
      implantsScore: "1",
      lngIudScore: "1",
      cuIudScore: "1",
      notes: "No clinically significant interaction with any contraceptive method."
    }
  ]
};
