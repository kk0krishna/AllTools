import { MecDataset } from "./types";

export const indiaMecData: MecDataset = {
  wheelId: "india-mec-2022",
  title: "India-Adapted WHO MEC Wheel",
  subtitle: "Medical Eligibility Criteria for Contraceptive Use (India 2022-2023 Update)",
  edition: "India Adapted (2022-2023 Edition)",
  organization: "Ministry of Health & Family Welfare (MoHFW), Govt. of India & WHO India",
  primaryColor: "#059669", // Emerald Green
  accentColor: "#047857",
  bgGradient: "from-emerald-950/20 via-background to-background",
  lowerWheelImage: "/images/mec/india_lower_wheel.png",
  upperWheelImage: "/images/mec/india_upper_wheel.png",
  methods: [
    {
      id: "coc_cic",
      name: "Combined Oral Contraceptives & Injectables",
      shortName: "COCs & CICs",
      type: "hormonal",
      description: "Low-dose combined oral contraceptive pills (e.g. Mala-N, Mala-D containing 30 µg Ethinylestradiol + 150 µg Levonorgestrel) and combined injectables.",
      indiaBrandNames: ["Mala-N (Free in Govt supply)", "Mala-D (Subsidized)", "Combined Injectable Contraceptive"],
      administration: "One pill daily for 21 days followed by 7 iron tablets (Ferrous Fumarate), or monthly injection.",
      typicalFailureRate: "7% per year",
      perfectFailureRate: "0.3% per year",
      mechanism: "Inhibits gonadotropin secretion, suppresses ovulation, thickens cervical mucus, and creates atrophic endometrium.",
      advantages: [
        "Rapidly reversible with predictable, lighter withdrawal bleeding",
        "Free or highly subsidized in National Family Planning Programme",
        "Reduces iron-deficiency anemia (includes 7 ferrous fumarate tablets)",
        "Protects against ovarian and endometrial cancer, PID, and ovarian cysts"
      ],
      disadvantages: [
        "Requires daily intake compliance",
        "Contraindicated in women ≥35 years who smoke, severe hypertension, migraine with aura, active DVT",
        "Does not protect against STIs or HIV"
      ],
      initiationGuidelines: {
        routine: "Start on Day 1 to 5 of menses without backup. If started > day 5, use condoms or abstain for 7 days.",
        postpartumBreastfeeding: "< 6 weeks: Category 4. 6 weeks to 6 months: Category 3. > 6 months: Category 2.",
        postpartumNonBreastfeeding: "< 3 weeks without VTE risk: Category 3 (with risk: Category 4). 3 to 6 weeks: Category 2. > 6 weeks: Category 1.",
        postAbortion: "Initiate immediately post-abortion (medical or surgical) on the day misoprostol is taken. No backup needed.",
        emergencyBackupNeeded: true,
        backupDuration: "7 days if started after cycle day 5"
      }
    },
    {
      id: "centchroman",
      name: "Centchroman (Ormeloxifene) Non-Hormonal Oral Pill",
      shortName: "Centchroman (Chhaya / Saheli)",
      type: "non-hormonal",
      description: "Selective Estrogen Receptor Modulator (SERM). India's indigenous once-a-week non-steroidal, non-hormonal oral contraceptive pill.",
      indiaBrandNames: ["Chhaya (Govt of India National Programme)", "Saheli (HLL Lifecare)", "Centron"],
      administration: "Twice a week for the first 3 months (e.g. Sunday & Wednesday), then once a week from the 4th month onwards on the first designated day.",
      typicalFailureRate: "1-2% per year",
      perfectFailureRate: "1% per year",
      mechanism: "Creates asynchrony between blastocyst development and endometrial receptive window, preventing implantation. Does not disrupt ovulation or normal ovarian hormone synthesis.",
      advantages: [
        "100% free of steroid hormones (estrogen and progesterone free)",
        "Zero estrogenic risks: no weight gain, no nausea, no fluid retention, no VTE/clotting risks",
        "Completely safe for lactating mothers at any stage postpartum",
        "Convenient schedule: only twice a week for 3 months, then only once a week regardless of cycle",
        "Prompt return to fertility upon discontinuation"
      ],
      disadvantages: [
        "May cause prolongation of menstrual cycle or delayed menses (scanty periods) during the first 3 months (not harmful)",
        "Strict adherence to designated pill days required",
        "Does not protect against STIs/HIV"
      ],
      initiationGuidelines: {
        routine: "First pill on Day 1 of menstrual period; second pill 3 days later. Continue this bi-weekly schedule for 3 months, then once a week from month 4.",
        postpartumBreastfeeding: "Can be started at any time if < 21 days postpartum without backup. If ≥ 21 days postpartum, ensure not pregnant and use backup for 2 days.",
        postpartumNonBreastfeeding: "Can be initiated immediately postpartum or at any time.",
        postAbortion: "Can be safely taken immediately after abortion, miscarriage, or ectopic pregnancy on the day of misoprostol.",
        emergencyBackupNeeded: true,
        backupDuration: "2 days if started outside early postpartum or cycle day 1"
      }
    },
    {
      id: "pop",
      name: "Progestogen-Only Pills",
      shortName: "POPs",
      type: "hormonal",
      description: "Low-dose progestin-only daily oral contraceptive tablets.",
      indiaBrandNames: ["Minipill (Levonorgestrel / Norethisterone / Desogestrel)"],
      administration: "One tablet every single day at the exact same hour with zero pill-free intervals.",
      typicalFailureRate: "7% per year",
      perfectFailureRate: "0.3% per year",
      mechanism: "Thickens cervical mucus to block sperm motility; suppresses ovulation in a subset of cycles.",
      advantages: [
        "Safe in breastfeeding women early postpartum",
        "Free from estrogen side effects and clotting risks",
        "Rapid return of fertility upon cessation"
      ],
      disadvantages: [
        "Rigid 3-hour daily dosing window",
        "High incidence of unscheduled spotting and menstrual changes"
      ],
      initiationGuidelines: {
        routine: "Start within 5 days of menses start with no backup. If started > day 5, use backup for 2 days.",
        postpartumBreastfeeding: "Category 2 in first 6 weeks, Category 1 after 6 weeks.",
        postpartumNonBreastfeeding: "Can be started immediately postpartum (Category 1).",
        postAbortion: "Initiate immediately post-abortion.",
        emergencyBackupNeeded: true,
        backupDuration: "2 days (48 hours)"
      }
    },
    {
      id: "dmpa",
      name: "DMPA & NET-EN Injectables",
      shortName: "DMPA / NET-EN (Antara)",
      type: "hormonal",
      description: "Depot medroxyprogesterone acetate 150 mg intramuscular every 3 months or subcutaneous 104 mg, or NET-EN 200 mg every 2 months.",
      indiaBrandNames: ["Antara Programme (Govt of India)", "Depo-Provera", "Noristerat"],
      administration: "Deep intramuscular injection in upper arm/gluteus every 3 months (DMPA) or every 2 months (NET-EN).",
      typicalFailureRate: "3-4% per year",
      perfectFailureRate: "0.2% per year",
      duration: "3 months (DMPA) or 2 months (NET-EN)",
      mechanism: "Potently suppresses ovulation via pituitary LH/FSH inhibition; thickens cervical mucus; thins endometrium.",
      advantages: [
        "Highly effective and private: 1 injection every 3 months",
        "Provided free across Indian Public Health Facilities under Antara Programme",
        "Relieves painful menstruation and endometriosis symptoms",
        "Safe for breastfeeding mothers from 6 weeks postpartum"
      ],
      disadvantages: [
        "Irregular bleeding or amenorrhea (often welcome once counselled)",
        "Delayed return to fertility (average 7–10 months after stopping)",
        "Transient mild bone mineral density loss with prolonged use"
      ],
      initiationGuidelines: {
        routine: "Give within 7 days of menses start without backup. If > 7 days, ensure not pregnant and use backup for 7 days.",
        postpartumBreastfeeding: "< 6 weeks: Category 3 (Category 2 in India when other methods unavailable). ≥ 6 weeks: Category 1.",
        postpartumNonBreastfeeding: "< 21 days: Category 1.",
        postAbortion: "Give immediately or within 7 days of medical or surgical abortion without backup.",
        emergencyBackupNeeded: true,
        backupDuration: "7 days if given after cycle day 7"
      }
    },
    {
      id: "implants",
      name: "Subdermal Implants",
      shortName: "Implants (LNG / ETG)",
      type: "hormonal",
      description: "Subdermal progestogen-releasing flexible rods inserted in inner upper arm.",
      indiaBrandNames: ["Implanon / Nexplanon (ETG 1 rod)", "Jadelle (LNG 2 rods)"],
      administration: "Minor in-clinic outpatient insertion under local anaesthesia.",
      typicalFailureRate: "0.05% per year (Tier 1 effectiveness)",
      perfectFailureRate: "0.05% per year",
      duration: "3 to 5 years",
      mechanism: "Slow continuous progestin release inhibits ovulation and thickens cervical mucus.",
      advantages: [
        "Most effective reversible contraceptive in existence",
        "Complete 'fit-and-forget' convenience for 3 to 5 years",
        "Prompt return to fertility after removal"
      ],
      disadvantages: [
        "Requires trained provider for placement and removal",
        "Bleeding pattern irregularity"
      ],
      initiationGuidelines: {
        routine: "Insert within 7 days of menstrual onset. If inserted > day 7, use backup for 7 days.",
        postpartumBreastfeeding: "< 6 weeks: Category 2. ≥ 6 weeks: Category 1.",
        postpartumNonBreastfeeding: "Immediately postpartum: Category 1.",
        postAbortion: "Insert immediately post-abortion.",
        emergencyBackupNeeded: true,
        backupDuration: "7 days"
      }
    },
    {
      id: "cu_iucd",
      name: "Copper Intrauterine Contraceptive Device",
      shortName: "Copper IUCD (Cu-T 380A / 375)",
      type: "non-hormonal",
      description: "Copper-bearing intrauterine devices including Cu-IUCD 380A (effective for 10 years) and Multiload Cu-IUCD 375 (effective for 5 years).",
      indiaBrandNames: ["Cu-IUCD 380A (10 Years)", "Cu-IUCD 375 (5 Years)", "PPIUCD"],
      administration: "Intrauterine placement by trained doctor, nurse, or LHV using 'no-touch' aseptic technique.",
      typicalFailureRate: "0.8% per year",
      perfectFailureRate: "0.6% per year",
      duration: "10 years (Cu-T 380A) or 5 years (Cu-375)",
      mechanism: "Continuous release of copper ions creates local spermicidal environment, inhibiting sperm motility and fertilization.",
      advantages: [
        "100% hormone-free: no systemic side effects, safe in cardiovascular disease, hypertension, and liver disorders",
        "Longest duration of reversible contraception (up to 10 years)",
        "Postpartum PPIUCD: Can be inserted immediately post-placental within 48 hours of delivery",
        "Excellent post-abortion contraception and most effective emergency contraception"
      ],
      disadvantages: [
        "Can cause heavier bleeding or cramping during the first 3–4 months",
        "Contraindicated in active pelvic sepsis, purulent discharge, unexplained bleeding, distorted cavity"
      ],
      initiationGuidelines: {
        routine: "Insert within 12 days after start of menstrual bleeding without backup. Can be inserted at any time if not pregnant.",
        postpartumBreastfeeding: "< 48 hours (Post-placental / PPIUCD): Category 1. 48 hours to < 6 weeks: Category 3. ≥ 6 weeks: Category 1.",
        postpartumNonBreastfeeding: "< 48 hours: Category 1. 48 hours to < 6 weeks: Category 3. ≥ 6 weeks: Category 1.",
        postAbortion: "Immediately after 1st trimester abortion: Category 1. After 2nd trimester abortion: Category 2 (skilled PPIUCD provider required). Post-septic abortion: Category 4.",
        emergencyBackupNeeded: false
      }
    },
    {
      id: "lng_iud",
      name: "Levonorgestrel Intrauterine Device",
      shortName: "LNG-IUD (Mirena)",
      type: "hormonal",
      description: "T-shaped polyethylene frame with levonorgestrel reservoir releasing 20 µg/day locally into the uterine cavity.",
      indiaBrandNames: ["Mirena", "Eloira", "Kyleena"],
      administration: "In-clinic intrauterine insertion by trained gynaecologist/physician.",
      typicalFailureRate: "0.2% per year",
      perfectFailureRate: "0.2% per year",
      duration: "5 to 8 years",
      mechanism: "Local levonorgestrel release causes profound endometrial suppression and thickens cervical mucus.",
      advantages: [
        "Over 80-90% reduction in menstrual blood flow (first-line therapy for idiopathic menorrhagia / DUB)",
        "Remarkable relief of dysmenorrhoea and endometriosis pain",
        "Tier-1 effectiveness with long duration of action"
      ],
      disadvantages: [
        "Spotting during initial 3-6 months",
        "Higher cost in private sector compared to Copper IUCD",
        "Contraindicated in active PID, purulent discharge, distorted cavity, breast cancer"
      ],
      initiationGuidelines: {
        routine: "Insert within 7 days of cycle start without backup. If inserted > day 7, use backup for 7 days.",
        postpartumBreastfeeding: "< 48 hours: Category 2 (Category 1 if non-breastfeeding). 48 hours to 6 weeks: Category 3. ≥ 6 weeks: Category 1.",
        postpartumNonBreastfeeding: "< 48 hours: Category 1. 48 hours to 6 weeks: Category 3. ≥ 6 weeks: Category 1.",
        postAbortion: "Immediately post-abortion (first trimester): Category 1. Second trimester: Category 2. Septic: Category 4.",
        emergencyBackupNeeded: true,
        backupDuration: "7 days if inserted after cycle day 7"
      }
    }
  ],
  sectors: [
    {
      id: "ind-hiv",
      sectorIndex: 0,
      categoryName: "HIV/AIDS",
      conditionName: "HIV / AIDS",
      subCondition: "Asymptomatic, mild, or on antiretroviral therapy",
      startAngle: 0,
      endAngle: 10,
      scores: [
        { methodId: "coc_cic", score: "1", notes: ["G"], clarification: "Category 1 for WHO stage 1/2; Category 2 if taking certain ARVs (EFV, NVP, boosted PIs)." },
        { methodId: "centchroman", score: "1", clarification: "Safe; non-hormonal, does not interact with ARVs." },
        { methodId: "pop", score: "1", notes: ["G"] },
        { methodId: "dmpa", score: "1", notes: ["G"], clarification: "DMPA remains Category 1 even with enzyme-inducing ARVs." },
        { methodId: "implants", score: "1", notes: ["G"] },
        { methodId: "cu_iucd", score: "2-3", notes: ["H"], clarification: "Category 2 for asymptomatic/mild disease; Category 3 to initiate in WHO Stage 3/4 until clinically stable on ART." },
        { methodId: "lng_iud", score: "2-3", notes: ["H"], clarification: "Category 2 for mild disease; Category 3 to initiate in severe/advanced disease." }
      ]
    },
    {
      id: "ind-tb",
      sectorIndex: 1,
      categoryName: "TB",
      conditionName: "Tuberculosis (On Rifampicin / Rifabutin)",
      subCondition: "Patients receiving rifampicin-based anti-tubercular therapy (ATT)",
      startAngle: 10,
      endAngle: 20,
      scores: [
        { methodId: "coc_cic", score: "2-3", notes: ["I"], clarification: "Rifampicin markedly induces hepatic enzymes, lowering COC levels. Category 3 for COCs, Category 2 for CICs." },
        { methodId: "centchroman", score: "2", clarification: "Centchroman can be used; monitor cycle regularity." },
        { methodId: "pop", score: "3", clarification: "Enzyme induction drastically lowers POP efficacy." },
        { methodId: "dmpa", score: "1-2", notes: ["J"], clarification: "DMPA is Category 1 (dose overcomes enzyme induction); NET-EN is Category 2." },
        { methodId: "implants", score: "2", clarification: "Mildly decreased efficacy; can be used." },
        { methodId: "cu_iucd", score: "1", notes: ["K"], clarification: "Category 1 for non-pelvic TB. If pelvic TB is diagnosed, Cu-IUCD = 4." },
        { methodId: "lng_iud", score: "1", notes: ["K"], clarification: "Category 1 for pulmonary TB. If pelvic TB, LNG-IUD = 4." }
      ]
    },
    {
      id: "ind-epilepsy",
      sectorIndex: 2,
      categoryName: "Epilepsy",
      conditionName: "Epilepsy (On Anticonvulsants)",
      subCondition: "Taking phenytoin, carbamazepine, barbiturates, primidone, topiramate",
      startAngle: 20,
      endAngle: 30,
      scores: [
        { methodId: "coc_cic", score: "3", clarification: "Hepatic CYP450 inducers increase pill failure." },
        { methodId: "centchroman", score: "1", clarification: "Excellent alternative; not cleared by steroid metabolic pathways." },
        { methodId: "pop", score: "3", notes: ["L"], clarification: "Category 1 if on lamotrigine alone." },
        { methodId: "dmpa", score: "1", clarification: "High depot progesterone levels maintain full contraceptive effect." },
        { methodId: "implants", score: "2", notes: ["L"] },
        { methodId: "cu_iucd", score: "1", clarification: "Completely unaffected by anti-seizure medications." },
        { methodId: "lng_iud", score: "1", clarification: "Local intrauterine effect; unaffected by hepatic clearance." }
      ]
    },
    {
      id: "ind-smoking",
      sectorIndex: 3,
      categoryName: "Smoking",
      conditionName: "Smoking (> 35 Years)",
      subCondition: "Women 35 years or older who smoke cigarettes or bidis",
      startAngle: 30,
      endAngle: 40,
      scores: [
        { methodId: "coc_cic", score: "3", notes: ["M"], clarification: "Category 3 if light smoker (< 15 cigarettes/day); Category 4 if heavy smoker (≥ 15 cigarettes/day)." },
        { methodId: "centchroman", score: "1", clarification: "Non-hormonal; zero thromboembolic risk in smokers." },
        { methodId: "pop", score: "1", clarification: "Safe; no estrogen." },
        { methodId: "dmpa", score: "1", clarification: "Safe; no estrogen-mediated arterial thrombosis." },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "1" },
        { methodId: "lng_iud", score: "1" }
      ]
    },
    {
      id: "ind-htn-mod",
      sectorIndex: 4,
      categoryName: "Hypertension",
      conditionName: "Hypertension (< 160 / 100)",
      subCondition: "Mild-moderate elevated blood pressure or adequately controlled",
      startAngle: 40,
      endAngle: 50,
      scores: [
        { methodId: "coc_cic", score: "3", clarification: "Estrogens can further increase blood pressure." },
        { methodId: "centchroman", score: "1", clarification: "Completely safe; no adverse hemodynamic effects." },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "2", clarification: "Generally use; periodic blood pressure check recommended." },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "1" },
        { methodId: "lng_iud", score: "1" }
      ]
    },
    {
      id: "ind-htn-sev",
      sectorIndex: 5,
      categoryName: "Hypertension",
      conditionName: "Hypertension (> 160 / 100)",
      subCondition: "Severe hypertension or with end-organ vascular involvement",
      startAngle: 50,
      endAngle: 60,
      scores: [
        { methodId: "coc_cic", score: "4", clarification: "Absolute contraindication; high risk of ischemic stroke and coronary events." },
        { methodId: "centchroman", score: "1", clarification: "Safe; no vascular or thromboembolic risk." },
        { methodId: "pop", score: "2" },
        { methodId: "dmpa", score: "3", clarification: "Use of method not usually recommended unless other methods unavailable." },
        { methodId: "implants", score: "2" },
        { methodId: "cu_iucd", score: "1", clarification: "Ideal first-line method; non-hormonal." },
        { methodId: "lng_iud", score: "2", clarification: "Generally use; local action." }
      ]
    },
    {
      id: "ind-headache-aura",
      sectorIndex: 6,
      categoryName: "Headache",
      conditionName: "Migraine with Aura",
      subCondition: "Focal neurological symptoms (bright zigzag lights, vision loss)",
      startAngle: 60,
      endAngle: 70,
      scores: [
        { methodId: "coc_cic", score: "4", clarification: "Unacceptable risk of ischemic stroke; absolute contraindication." },
        { methodId: "centchroman", score: "2", clarification: "Can generally be used; monitor symptom frequency." },
        { methodId: "pop", score: "2", clarification: "If aura develops while on method, consider switching to non-hormonal." },
        { methodId: "dmpa", score: "2-3", notes: ["O"], clarification: "Category 2 to initiate; Category 3 if migraine with aura develops during use." },
        { methodId: "implants", score: "2" },
        { methodId: "cu_iucd", score: "1", clarification: "Safest method; completely non-hormonal." },
        { methodId: "lng_iud", score: "2-3", notes: ["O"] }
      ]
    },
    {
      id: "ind-headache-no-aura",
      sectorIndex: 7,
      categoryName: "Headache",
      conditionName: "Migraine without Aura",
      subCondition: "Migraine headaches without focal neurological aura",
      startAngle: 70,
      endAngle: 80,
      scores: [
        { methodId: "coc_cic", score: "2-3", notes: ["O"], clarification: "Category 2 if age < 35 years; Category 3 if age ≥ 35 years." },
        { methodId: "centchroman", score: "1", clarification: "Safe and well-tolerated." },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "2" },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "1" },
        { methodId: "lng_iud", score: "2" }
      ]
    },
    {
      id: "ind-cvd-ihd",
      sectorIndex: 8,
      categoryName: "Cardiovascular Diseases",
      conditionName: "Stroke, IHD, Multiple Risk Factors",
      subCondition: "History of stroke, myocardial infarction, angina, or multiple risk factors",
      startAngle: 80,
      endAngle: 90,
      scores: [
        { methodId: "coc_cic", score: "4", clarification: "Contraindicated; high risk of recurrent ischemic events." },
        { methodId: "centchroman", score: "2", clarification: "Can be considered under clinical supervision; non-steroidal." },
        { methodId: "pop", score: "2" },
        { methodId: "dmpa", score: "3", clarification: "Not usually recommended; may affect lipid profile." },
        { methodId: "implants", score: "2" },
        { methodId: "cu_iucd", score: "1", clarification: "Non-hormonal; first-line safe contraceptive." },
        { methodId: "lng_iud", score: "2-3", notes: ["Q"], clarification: "Category 2 for initiating; if IHD develops during use, switch to non-hormonal." }
      ]
    },
    {
      id: "ind-cvd-valvular",
      sectorIndex: 9,
      categoryName: "Cardiovascular Diseases",
      conditionName: "Valvular Heart Disease (Complicated)",
      subCondition: "Pulmonary hypertension, history of subacute bacterial endocarditis, or prosthetic valve",
      startAngle: 90,
      endAngle: 100,
      scores: [
        { methodId: "coc_cic", score: "4", clarification: "Severe risk of thromboembolism." },
        { methodId: "centchroman", score: "2" },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "1", clarification: "Prophylactic antibiotics recommended at insertion." },
        { methodId: "lng_iud", score: "1", clarification: "Prophylactic antibiotics recommended at insertion." }
      ]
    },
    {
      id: "ind-dvt-history",
      sectorIndex: 10,
      categoryName: "Deep Vein Thrombosis",
      conditionName: "H/O DVT / PE, On Anticoagulants, Bedridden",
      subCondition: "Past deep vein thrombosis or prolonged immobilization",
      startAngle: 100,
      endAngle: 110,
      scores: [
        { methodId: "coc_cic", score: "4", clarification: "Absolute contraindication; high recurrent VTE hazard." },
        { methodId: "centchroman", score: "3", clarification: "Use with caution in active thrombotic conditions." },
        { methodId: "pop", score: "2" },
        { methodId: "dmpa", score: "2" },
        { methodId: "implants", score: "2" },
        { methodId: "cu_iucd", score: "2", clarification: "Category 2 if on anticoagulant therapy due to potential heavy menstrual bleeding." },
        { methodId: "lng_iud", score: "2", clarification: "Generally use; reduces heavy bleeding from anticoagulants." }
      ]
    },
    {
      id: "ind-dvt-acute",
      sectorIndex: 11,
      categoryName: "Deep Vein Thrombosis",
      conditionName: "Acute DVT / PE",
      subCondition: "Current acute venous thromboembolism under active treatment",
      startAngle: 110,
      endAngle: 120,
      scores: [
        { methodId: "coc_cic", score: "4", clarification: "Absolute contraindication." },
        { methodId: "centchroman", score: "3", clarification: "Avoid during acute phase." },
        { methodId: "pop", score: "2" },
        { methodId: "dmpa", score: "2" },
        { methodId: "implants", score: "2" },
        { methodId: "cu_iucd", score: "2" },
        { methodId: "lng_iud", score: "2" }
      ]
    },
    {
      id: "ind-diabetes",
      sectorIndex: 12,
      categoryName: "Diabetes Mellitus",
      conditionName: "Diabetes Mellitus (Current)",
      subCondition: "Non-vascular or long-standing diabetes",
      startAngle: 120,
      endAngle: 130,
      scores: [
        { methodId: "coc_cic", score: "2", notes: ["S"], clarification: "Category 3-4 if complicated with nephropathy/retinopathy or duration > 20 years." },
        { methodId: "centchroman", score: "1", clarification: "Does not interfere with carbohydrate metabolism or insulin sensitivity." },
        { methodId: "pop", score: "2" },
        { methodId: "dmpa", score: "2", clarification: "Category 3 if complicated or > 20 years duration." },
        { methodId: "implants", score: "2" },
        { methodId: "cu_iucd", score: "1", clarification: "Completely inert regarding metabolic pathways." },
        { methodId: "lng_iud", score: "2", notes: ["X"] }
      ]
    },
    {
      id: "ind-liver-hepatitis",
      sectorIndex: 13,
      categoryName: "Liver Disease",
      conditionName: "Acute Viral Hepatitis",
      subCondition: "Active symptomatic hepatic inflammation or flare",
      startAngle: 130,
      endAngle: 140,
      scores: [
        { methodId: "coc_cic", score: "3/4", clarification: "Avoid initiation until liver function normalizes." },
        { methodId: "centchroman", score: "3", clarification: "Delay until acute hepatitis resolves." },
        { methodId: "pop", score: "1", clarification: "Low dose, minimally hepatic." },
        { methodId: "dmpa", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "1", clarification: "Non-hormonal; zero hepatic involvement." },
        { methodId: "lng_iud", score: "1" }
      ]
    },
    {
      id: "ind-liver-cirrhosis",
      sectorIndex: 14,
      categoryName: "Liver Disease",
      conditionName: "Cirrhosis / Liver Tumour",
      subCondition: "Severe decompensated cirrhosis or hepatic adenoma/hepatoma",
      startAngle: 140,
      endAngle: 150,
      scores: [
        { methodId: "coc_cic", score: "4", clarification: "Absolute contraindication." },
        { methodId: "centchroman", score: "3" },
        { methodId: "pop", score: "3" },
        { methodId: "dmpa", score: "3" },
        { methodId: "implants", score: "3" },
        { methodId: "cu_iucd", score: "1", clarification: "Safe; no liver metabolism." },
        { methodId: "lng_iud", score: "2", clarification: "Category 2 in mild cirrhosis; Category 3 in severe decompensated cirrhosis." }
      ]
    },
    {
      id: "ind-sle",
      sectorIndex: 15,
      categoryName: "SLE",
      conditionName: "Systemic Lupus Erythematosus (SLE)",
      subCondition: "Positive or unknown antiphospholipid antibodies",
      startAngle: 150,
      endAngle: 160,
      scores: [
        { methodId: "coc_cic", score: "4", clarification: "Severe risk of arterial and venous thrombosis with antiphospholipid antibodies." },
        { methodId: "centchroman", score: "2" },
        { methodId: "pop", score: "2" },
        { methodId: "dmpa", score: "2" },
        { methodId: "implants", score: "2" },
        { methodId: "cu_iucd", score: "1", clarification: "Category 1 if not thrombocytopenic." },
        { methodId: "lng_iud", score: "2" }
      ]
    },
    {
      id: "ind-anaemia",
      sectorIndex: 16,
      categoryName: "Anaemia",
      conditionName: "Anaemia (Iron Deficiency / Sickle Cell)",
      subCondition: "High prevalence in Indian clinical settings",
      startAngle: 160,
      endAngle: 170,
      scores: [
        { methodId: "coc_cic", score: "1", clarification: "Reduces menstrual flow; Mala-N/D includes 7 ferrous fumarate tablets." },
        { methodId: "centchroman", score: "1", clarification: "Reduces menstrual loss over time; safe." },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "1", clarification: "Produces amenorrhea; dramatically improves hemoglobin levels." },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "2", clarification: "Category 2 in severe anemia (Hb < 7 g/dL) due to increased menstrual flow." },
        { methodId: "lng_iud", score: "1", clarification: "Outstanding therapeutic benefit: >85% reduction in bleeding." }
      ]
    },
    {
      id: "ind-bleeding",
      sectorIndex: 17,
      categoryName: "Unexplained Vaginal Bleeding",
      conditionName: "Unexplained Vaginal Bleeding",
      subCondition: "Before evaluation of serious underlying disease",
      startAngle: 170,
      endAngle: 180,
      scores: [
        { methodId: "coc_cic", score: "2" },
        { methodId: "centchroman", score: "2" },
        { methodId: "pop", score: "2" },
        { methodId: "dmpa", score: "3" },
        { methodId: "implants", score: "3" },
        { methodId: "cu_iucd", score: "4", clarification: "Do not insert until etiology investigated and malignancy ruled out." },
        { methodId: "lng_iud", score: "4", clarification: "Do not insert until investigated." }
      ]
    },
    {
      id: "ind-fibroid",
      sectorIndex: 18,
      categoryName: "Uterus Fibroid",
      conditionName: "Uterine Fibroids",
      subCondition: "Leiomyoma with or without cavity distortion",
      startAngle: 180,
      endAngle: 190,
      scores: [
        { methodId: "coc_cic", score: "1" },
        { methodId: "centchroman", score: "1", clarification: "Can be used safely." },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "1", clarification: "Decreases fibroid-associated bleeding." },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "1/4", clarification: "Category 1 without distortion; Category 4 if cavity distorted." },
        { methodId: "lng_iud", score: "1/4", clarification: "Category 1 without distortion (greatly reduces menorrhagia); Category 4 if cavity distorted." }
      ]
    },
    {
      id: "ind-pcod",
      sectorIndex: 19,
      categoryName: "PCOD",
      conditionName: "Polycystic Ovarian Disease (PCOD / PCOS)",
      subCondition: "Oligo-ovulation, hyperandrogenism, metabolic syndrome",
      startAngle: 190,
      endAngle: 200,
      scores: [
        { methodId: "coc_cic", score: "1", clarification: "Regulates cycles, decreases androgen levels, treats acne and hirsutism." },
        { methodId: "centchroman", score: "1", clarification: "Non-hormonal once-a-week method; safe." },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "1" },
        { methodId: "lng_iud", score: "1", clarification: "Protects endometrium against hyperplasia." }
      ]
    },
    {
      id: "ind-cancer-breast",
      sectorIndex: 20,
      categoryName: "Cancer",
      conditionName: "Breast Cancer (Current)",
      subCondition: "Hormone-sensitive breast carcinoma",
      startAngle: 200,
      endAngle: 210,
      scores: [
        { methodId: "coc_cic", score: "4", clarification: "Absolute contraindication." },
        { methodId: "centchroman", score: "4", clarification: "Contraindicated in active breast malignancy." },
        { methodId: "pop", score: "4", clarification: "Absolute contraindication." },
        { methodId: "dmpa", score: "4", clarification: "Absolute contraindication." },
        { methodId: "implants", score: "4", clarification: "Absolute contraindication." },
        { methodId: "cu_iucd", score: "1", clarification: "Completely non-hormonal; safest first-line choice." },
        { methodId: "lng_iud", score: "4", clarification: "Absolute contraindication." }
      ]
    },
    {
      id: "ind-cancer-cervical",
      sectorIndex: 21,
      categoryName: "Cancer",
      conditionName: "Cervical Cancer",
      subCondition: "Awaiting oncologic staging / therapy",
      startAngle: 210,
      endAngle: 220,
      scores: [
        { methodId: "coc_cic", score: "2" },
        { methodId: "centchroman", score: "2" },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "2" },
        { methodId: "implants", score: "2" },
        { methodId: "cu_iucd", score: "4", clarification: "Contraindicated for initiation; risk of hemorrhage and pelvic sepsis." },
        { methodId: "lng_iud", score: "4", clarification: "Contraindicated for initiation." }
      ]
    },
    {
      id: "ind-gtd",
      sectorIndex: 22,
      categoryName: "Gestational Trophoblastic Disease",
      conditionName: "Gestational Trophoblastic Disease",
      subCondition: "Molar pregnancy with decreasing or undetectable β-hCG",
      startAngle: 220,
      endAngle: 230,
      scores: [
        { methodId: "coc_cic", score: "1" },
        { methodId: "centchroman", score: "1" },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "4", clarification: "Risk of uterine perforation and bleeding if persistent trophoblastic disease." },
        { methodId: "lng_iud", score: "4", clarification: "Contraindicated until β-hCG normal for 6 months." }
      ]
    },
    {
      id: "ind-age-young",
      sectorIndex: 23,
      categoryName: "Age",
      conditionName: "Menarche to < 18 Years",
      subCondition: "Young adolescent women",
      startAngle: 230,
      endAngle: 240,
      scores: [
        { methodId: "coc_cic", score: "1" },
        { methodId: "centchroman", score: "1", clarification: "Safe and convenient." },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "2", clarification: "Mild concern over peak bone mass accumulation; overall benefits outweigh risks." },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "2" },
        { methodId: "lng_iud", score: "2" }
      ]
    },
    {
      id: "ind-age-older",
      sectorIndex: 24,
      categoryName: "Age",
      conditionName: "40 Years and Above",
      subCondition: "Perimenopausal women",
      startAngle: 240,
      endAngle: 250,
      scores: [
        { methodId: "coc_cic", score: "2", clarification: "Generally use if non-smoker and blood pressure is normal." },
        { methodId: "centchroman", score: "1", clarification: "Excellent non-hormonal option with no cardiovascular risk." },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "1" },
        { methodId: "lng_iud", score: "1", clarification: "Provides outstanding endometrial protection and reduces perimenopausal menorrhagia." }
      ]
    },
    {
      id: "ind-nulliparous",
      sectorIndex: 25,
      categoryName: "Nulliparous",
      conditionName: "Nulliparous",
      subCondition: "Women with zero prior deliveries",
      startAngle: 250,
      endAngle: 260,
      scores: [
        { methodId: "coc_cic", score: "1" },
        { methodId: "centchroman", score: "1", clarification: "First choice for young newly married couples looking to delay first pregnancy." },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "2", clarification: "Cu-375 or Cu-T 380A can be used; counsel on dual protection." },
        { methodId: "lng_iud", score: "2" }
      ]
    },
    {
      id: "ind-pp-lt-48h",
      sectorIndex: 26,
      categoryName: "Postpartum Breastfeeding",
      conditionName: "< 48 Hours Postpartum",
      subCondition: "Immediate post-delivery / post-placental",
      startAngle: 260,
      endAngle: 270,
      scores: [
        { methodId: "coc_cic", score: "4", clarification: "Contraindicated: suppresses lactation volume and raises VTE risk." },
        { methodId: "centchroman", score: "1", clarification: "Safe immediately postpartum at any time." },
        { methodId: "pop", score: "2" },
        { methodId: "dmpa", score: "2", clarification: "Can be initiated if other methods are not available or acceptable." },
        { methodId: "implants", score: "2" },
        { methodId: "cu_iucd", score: "1", clarification: "PPIUCD: Ideal timing for post-placental Cu-IUCD insertion within 48 hours of normal or LSCS delivery." },
        { methodId: "lng_iud", score: "1-2", notes: ["A"], clarification: "Category 1 if not breastfeeding; Category 2 if breastfeeding." }
      ]
    },
    {
      id: "ind-pp-48h-6w",
      sectorIndex: 27,
      categoryName: "Postpartum Breastfeeding",
      conditionName: "48 Hours to 6 Weeks Postpartum",
      subCondition: "Uterine involution period",
      startAngle: 270,
      endAngle: 280,
      scores: [
        { methodId: "coc_cic", score: "4", clarification: "Contraindicated during lactation." },
        { methodId: "centchroman", score: "1", clarification: "Can be started at any time; no steroid hormones." },
        { methodId: "pop", score: "2" },
        { methodId: "dmpa", score: "2" },
        { methodId: "implants", score: "2" },
        { methodId: "cu_iucd", score: "3", clarification: "Subinvolution carries high perforation risk. Delay insertion until ≥ 6 weeks." },
        { methodId: "lng_iud", score: "3", clarification: "Delay until ≥ 6 weeks postpartum." }
      ]
    },
    {
      id: "ind-pp-6w-6m",
      sectorIndex: 28,
      categoryName: "Postpartum Breastfeeding",
      conditionName: "6 Weeks to 6 Months Postpartum",
      subCondition: "Lactation well established",
      startAngle: 280,
      endAngle: 290,
      scores: [
        { methodId: "coc_cic", score: "3", clarification: "Use of method not usually recommended unless other methods unavailable." },
        { methodId: "centchroman", score: "1", clarification: "Safe and effective." },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "1", clarification: "Safe; does not compromise breast milk quantity or composition." },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "1", clarification: "Standard interval IUCD insertion safe at 6 weeks postpartum." },
        { methodId: "lng_iud", score: "1", clarification: "Safe for interval insertion." }
      ]
    },
    {
      id: "ind-prev-lscs",
      sectorIndex: 29,
      categoryName: "Previous LSCS",
      conditionName: "Previous Caesarean Section (LSCS)",
      subCondition: "History of one or more lower segment caesarean deliveries",
      startAngle: 290,
      endAngle: 300,
      scores: [
        { methodId: "coc_cic", score: "1" },
        { methodId: "centchroman", score: "1" },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "1", clarification: "Can be placed intracesarean or as an interval insertion." },
        { methodId: "lng_iud", score: "1" }
      ]
    },
    {
      id: "ind-post-abortal-med",
      sectorIndex: 30,
      categoryName: "Post Abortal",
      conditionName: "Post-Abortion (Medical)",
      subCondition: "Following medical termination of pregnancy (Mifepristone + Misoprostol)",
      startAngle: 300,
      endAngle: 310,
      scores: [
        { methodId: "coc_cic", score: "1", clarification: "Initiate on the day Misoprostol is administered." },
        { methodId: "centchroman", score: "1", notes: ["C"], clarification: "Start on the day Misoprostol is taken. No backup protection needed." },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "1", clarification: "Can be given on the day Misoprostol is administered." },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "1", clarification: "Insert once abortion is confirmed complete." },
        { methodId: "lng_iud", score: "1", clarification: "Insert once abortion is confirmed complete." }
      ]
    },
    {
      id: "ind-post-abortal-surg",
      sectorIndex: 31,
      categoryName: "Post Abortal",
      conditionName: "Post-Abortion (Surgical)",
      subCondition: "Following manual vacuum aspiration (MVA) or surgical evacuation",
      startAngle: 310,
      endAngle: 320,
      scores: [
        { methodId: "coc_cic", score: "1" },
        { methodId: "centchroman", score: "1", notes: ["C"], clarification: "Can be initiated immediately post-evacuation." },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "1", clarification: "Can be inserted immediately following surgical evacuation in absence of sepsis." },
        { methodId: "lng_iud", score: "1", clarification: "Can be inserted immediately." }
      ]
    },
    {
      id: "ind-sepsis",
      sectorIndex: 32,
      categoryName: "Sepsis",
      conditionName: "Puerperal / Post-Abortion Sepsis",
      subCondition: "Pelvic or systemic infection following childbirth or abortion",
      startAngle: 320,
      endAngle: 330,
      scores: [
        { methodId: "coc_cic", score: "1" },
        { methodId: "centchroman", score: "1" },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "4", clarification: "Absolute contraindication; high risk of septic shock and peritonitis." },
        { methodId: "lng_iud", score: "4", clarification: "Absolute contraindication." }
      ]
    },
    {
      id: "ind-pid",
      sectorIndex: 33,
      categoryName: "Pelvic Inflammatory Disease",
      conditionName: "Current PID",
      subCondition: "Active salpingo-oophoritis, endometritis, or tubo-ovarian abscess",
      startAngle: 330,
      endAngle: 340,
      scores: [
        { methodId: "coc_cic", score: "1" },
        { methodId: "centchroman", score: "1" },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "4", clarification: "Do not insert. If woman develops PID while using IUD, give antibiotic treatment and continue with the device." },
        { methodId: "lng_iud", score: "4", clarification: "Do not insert. Treat with device in situ." }
      ]
    },
    {
      id: "ind-sti-purulent",
      sectorIndex: 34,
      categoryName: "STIs/RTIs",
      conditionName: "STIs / RTIs (Purulent Discharge)",
      subCondition: "Active purulent cervicitis / urethral discharge (Gonorrhoea, Chlamydia)",
      startAngle: 340,
      endAngle: 350,
      scores: [
        { methodId: "coc_cic", score: "1" },
        { methodId: "centchroman", score: "1" },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "4", notes: ["E"], clarification: "Do not insert; provides a conduit for ascending pelvic infection. If already using, treat and continue." },
        { methodId: "lng_iud", score: "4", notes: ["E"] }
      ]
    },
    {
      id: "ind-sti-non-purulent",
      sectorIndex: 35,
      categoryName: "STIs/RTIs",
      conditionName: "STIs / RTIs (Non-Purulent Discharge / High Risk)",
      subCondition: "Trichomonas, candidiasis, BV, or individual with high behavioral risk",
      startAngle: 350,
      endAngle: 360,
      scores: [
        { methodId: "coc_cic", score: "1" },
        { methodId: "centchroman", score: "1" },
        { methodId: "pop", score: "1" },
        { methodId: "dmpa", score: "1" },
        { methodId: "implants", score: "1" },
        { methodId: "cu_iucd", score: "2", notes: ["D"], clarification: "Generally use. Recommend dual protection with Nirodh (condoms)." },
        { methodId: "lng_iud", score: "2", notes: ["D"] }
      ]
    }
  ],
  notes: {
    A: {
      code: "A",
      title: "Postpartum Non-Breastfeeding LNG-IUD",
      text: "If not breastfeeding, LNG-IUD = Cat 1. In breastfeeding women, LNG-IUD = Cat 2 within 48 hours."
    },
    C: {
      code: "C",
      title: "Centchroman Post-Abortion Initiation",
      text: "Centchroman can be safely taken by women just after abortion, miscarriage, or ectopic pregnancy on the day of misoprostol."
    },
    D: {
      code: "D",
      title: "Dual Protection STI Warning",
      text: "If at increased risk of STI or HIV, advise condom (Nirodh) use in addition to any other contraceptive method."
    },
    E: {
      code: "E",
      title: "Purulent Discharge & IUD Continuation",
      text: "Current PID and Current STI (Purulent discharge): Cu-IUCD and LNG-IUD = 4 for insertion; if she develops these conditions while using Cu-IUCD and LNG-IUD, give antimicrobial treatment and continue with the device."
    },
    F: {
      code: "F",
      title: "Condoms for STI Protection",
      text: "IUDs and hormonal methods do not protect against sexually transmitted infections (STIs), including HIV. If there is a risk of STI/HIV, correct and consistent use of condoms is recommended."
    },
    G: {
      code: "G",
      title: "HIV Stage 1 and 2",
      text: "HIV asymptomatic or mild clinical disease (WHO Stage 1 or 2): all hormonal methods and Centchroman = Cat 1."
    },
    H: {
      code: "H",
      title: "Advanced HIV / AIDS and IUDs",
      text: "If not receiving ARV treatment and not clinically well (WHO Stage 3 or 4), Cu-IUCD and LNG-IUD = 3 for insertion. If already in place and client develops advanced HIV, continue device."
    },
    I: {
      code: "I",
      title: "Tuberculosis and Rifampicin",
      text: "On Rifampicin/Rifabutin: COCs = 3; CICs = 2. Centchroman = 2."
    },
    J: {
      code: "J",
      title: "Injectable Progestins with ATT",
      text: "DMPA = 1; NET-EN = 2."
    },
    K: {
      code: "K",
      title: "Pelvic Tuberculosis",
      text: "If non-pelvic TB, Cu-IUCD = 1. If pelvic TB, Cu-IUCD and LNG-IUD = 4."
    },
    L: {
      code: "L",
      title: "Lamotrigine Interaction",
      text: "For Lamotrigine, POP and Implants = 1."
    },
    M: {
      code: "M",
      title: "Smoking and Age",
      text: "COCs and heavy smoking (≥15/day) = 4; COCs and light smoking (<15/day) = 3; COCs in smokers < 35 yrs = 2."
    },
    N: {
      code: "N",
      title: "Headache Differential",
      text: "For simple non-migrainous headache, most contraceptives can be safely used (Cat 1)."
    },
    O: {
      code: "O",
      title: "Migraine Protocol",
      text: "To check if migraine has aura, ask: 'Do you see bright spots, flashes, or zig-zag patterns in your vision before bad headaches?' If condition develops while on method, switch to non-hormonal method."
    },
    Q: {
      code: "Q",
      title: "Multiple Cardiovascular Risk Factors",
      text: "Multiple risk factors include: older age, smoking, hypertension, diabetes, obesity, and known dyslipidaemia. If stroke or IHD develops while on method, switch to non-hormonal method."
    },
    S: {
      code: "S",
      title: "Diabetes Duration Protocol",
      text: "If diabetes is complicated (nephropathy, neuropathy, retinopathy) or has lasted > 20 years: COCs, CICs, DMPA, and NET-EN = 3-4."
    },
    X: {
      code: "X",
      title: "Diabetes and LNG-IUD",
      text: "In complicated diabetes or > 20 years duration, LNG-IUD = 2."
    }
  },
  safeConditions: {
    reproductive: [
      "Benign breast disease or undiagnosed breast mass",
      "Benign ovarian tumours, including cysts",
      "Dysmenorrhoea",
      "Endometriosis",
      "History of gestational diabetes",
      "History of high blood pressure during pregnancy (preeclampsia/eclampsia)",
      "History of pelvic surgery, including caesarean delivery (LSCS)",
      "Irregular, heavy or prolonged menstrual bleeding (explained)",
      "Past ectopic pregnancy",
      "Past pelvic inflammatory disease",
      "Post-abortion (no sepsis)",
      "Postpartum ≥ 6 months"
    ],
    medical: [
      "Depression",
      "Epilepsy (uncomplicated)",
      "HIV asymptomatic or mild clinical disease (WHO Stage 1 or 2)",
      "Iron-deficiency anaemia, sickle-cell disease and thalassaemia",
      "Malaria",
      "Mild cirrhosis",
      "Schistosomiasis",
      "Superficial venous disorders, including varicose veins",
      "Thyroid disorders",
      "Tuberculosis (non-pelvic)",
      "Uncomplicated valvular heart disease",
      "Viral hepatitis (carrier or chronic asymptomatic)"
    ],
    other: [
      "Adolescents",
      "Family history of breast cancer",
      "Family history of venous thromboembolism (VTE)",
      "High risk for HIV (recommend dual protection with condoms)",
      "Surgery without prolonged immobilization",
      "Taking standard antibiotics (excluding rifampicin/rifabutin)"
    ]
  },
  sterilizationGuidelines: {
    female: [
      {
        category: "A",
        meaning: "Accept: There is no medical reason to deny sterilization to a person with this condition.",
        conditions: [
          "Younger or older age (with voluntary informed consent)",
          "Nulliparous or high parity",
          "Mild-to-moderate hypertension (< 160/100)",
          "Uncomplicated diabetes mellitus",
          "Mild anemia (Hb 7-10 g/dL)",
          "Depression or controlled psychiatric disorder",
          "Epilepsy",
          "Past pelvic inflammatory disease",
          "Previous caesarean delivery (LSCS)"
        ]
      },
      {
        category: "C",
        meaning: "Caution: The procedure can be conducted in a routine setting, but with extra preparation and precautions.",
        conditions: [
          "Severe hypertension (≥ 160/100)",
          "Moderately severe anemia (Hb 7-9 g/dL)",
          "Obesity (BMI ≥ 30 kg/m² - requires surgical expertise)",
          "Controlled heart disease",
          "Extensive previous abdominal or pelvic surgery",
          "Uterine fibroids"
        ]
      },
      {
        category: "D",
        meaning: "Delay: The procedure should be delayed until the condition is evaluated and/or treated.",
        conditions: [
          "Current pregnancy",
          "Postpartum 7 to 42 days (increased risk of infection and uterine injury)",
          "Severe puerperal or post-abortion sepsis",
          "Acute pelvic inflammatory disease (PID)",
          "Active purulent STI / cervicitis",
          "Severe acute respiratory illness",
          "Severe anemia (Hb < 7 g/dL - treat anemia first)"
        ]
      },
      {
        category: "S",
        meaning: "Special: The procedure should be undertaken only in a setting with experienced surgeon and anaesthetist, with backup emergency facilities.",
        conditions: [
          "Complicated heart disease with pulmonary hypertension",
          "Coagulation disorders or patient on anticoagulation therapy",
          "Severe diaphragmatic hernia",
          "Fixed pelvic adhesions / frozen pelvis",
          "Abdominal wall infection or hernia"
        ]
      }
    ],
    male: [
      {
        category: "A",
        meaning: "Accept: No medical restriction for vasectomy (Non-Scalpel Vasectomy - NSV).",
        conditions: [
          "Younger or older men (voluntary informed choice)",
          "Men who have not fathered children (requires extra counseling)",
          "Controlled hypertension",
          "Diabetes mellitus",
          "Asymptomatic HIV infection"
        ]
      },
      {
        category: "C",
        meaning: "Caution: Take extra precautions; procedure can be performed in standard outpatient setting.",
        conditions: [
          "Varicocele or moderate hydrocele",
          "Diabetes with autonomic neuropathy",
          "History of scrotal injury"
        ]
      },
      {
        category: "D",
        meaning: "Delay: Postpone procedure until condition is treated.",
        conditions: [
          "Active scrotal skin infection",
          "Active balanitis or epididymo-orchitis",
          "Active systemic infection or high fever"
        ]
      },
      {
        category: "S",
        meaning: "Special: Perform in hospital setting with general or spinal anesthesia.",
        conditions: [
          "Large hydrocele or large inguinal hernia",
          "Cryptorchidism or impalpable vas deferens",
          "Bleeding diathesis"
        ]
      }
    ]
  }
};
