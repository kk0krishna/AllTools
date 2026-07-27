export interface MilestoneData {
  week: number;
  title: string;
  trimester: "1st Trimester" | "2nd Trimester" | "3rd Trimester" | "Post-Term";
  fetalDevelopment: string;
  clinicalSignificance: string[];
  recommendedTests: string[];
  ultrasound: string[];
  vaccinations: string[];
  counselling: string[];
  references: string[];
}

export const PREGNANCY_MILESTONES: MilestoneData[] = [
  {
    week: 4,
    title: "Implantation & Early Gestation",
    trimester: "1st Trimester",
    fetalDevelopment: "Blastocyst implants into the uterine endometrium. Neural tube and placenta begin forming. hCG hormone becomes detectable in maternal serum and urine.",
    clinicalSignificance: [
      "Confirmation of pregnancy via urine or serum beta-hCG.",
      "Assessment of ectopic pregnancy risk factors (prior ectopic, PID, tubal surgery).",
      "Evaluation of chronic maternal conditions (hypertension, diabetes, thyroid disease)."
    ],
    recommendedTests: [
      "Urine pregnancy test or quantitative serum beta-hCG",
      "Blood group and Rh factor screening",
      "Complete Blood Count (CBC)",
      "TSH (Thyroid Stimulating Hormone)",
      "Rubella, HIV, Syphilis, and Hepatitis B screening"
    ],
    ultrasound: [
      "Transvaginal scan (TVS) only indicated if ectopic pregnancy is suspected or vaginal bleeding occurs. Gestational sac typically visible at serum hCG > 1500-2000 mIU/mL."
    ],
    vaccinations: [
      "Review immunization history (Rubella, Varicella). Note: Live attenuated vaccines (MMR, Varicella) are contraindicated during pregnancy."
    ],
    counselling: [
      "Folic acid supplementation (400 mcg daily for low risk, up to 5 mg daily for high risk/prior NTD) to prevent neural tube defects.",
      "Avoid teratogens: alcohol, smoking, recreational drugs, and unprescribed NSAIDs/retinoids.",
      "Dietary counseling: avoid raw meats, unpasteurized dairy, and high-mercury fish."
    ],
    references: [
      "ACOG Practice Bulletin No. 200: Early Pregnancy Loss (2018)",
      "WHO Recommendations on Antenatal Care for a Positive Pregnancy Experience (2016)"
    ]
  },
  {
    week: 8,
    title: "Embryonic Organogenesis & Viability Confirmation",
    trimester: "1st Trimester",
    fetalDevelopment: "All major organs have begun forming. Heart beat is rhythmic and rapid (140-170 bpm). Limb buds develop into arms and legs.",
    clinicalSignificance: [
      "Critical period of organogenesis—highest sensitivity to teratogenic insults.",
      "Management of early pregnancy symptoms (nausea and vomiting of pregnancy / hyperemesis gravidarum)."
    ],
    recommendedTests: [
      "Routine prenatal lab panel if not drawn at week 4 (CBC, blood type, Rh, antibody screen)",
      "Urine culture and urinalysis (screen for asymptomatic bacteriuria)",
      "Cervical cancer screening (Pap smear) if due",
      "Offer early aneuploidy screening options (cfDNA / NIPT from 10 weeks)"
    ],
    ultrasound: [
      "Dating and viability ultrasound (TVS or transabdominal). Measurement of Crown-Rump Length (CRL) has the highest accuracy for establishing Estimated Due Date (±5-7 days).",
      "Confirm intrauterine location and fetal cardiac activity."
    ],
    vaccinations: [
      "Inactivated influenza vaccine recommended if during flu season."
    ],
    counselling: [
      "Reassurance regarding normal early pregnancy fatigue and morning sickness.",
      "Safe over-the-counter antiemetics (Vitamin B6 / Pyridoxine ± Doxylamine).",
      "Warning signs requiring immediate attention: severe abdominal pain, heavy vaginal bleeding, or inability to tolerate oral fluids."
    ],
    references: [
      "ACOG Committee Opinion No. 700: Methods for Estimating Due Date (2017)",
      "ISUOG Practice Guidelines: Performance of first-trimester fetal ultrasound scan (2013)"
    ]
  },
  {
    week: 12,
    title: "First Trimester Screening & NT Scan",
    trimester: "1st Trimester",
    fetalDevelopment: "Fetus reaches ~6 cm in length. External genitalia differentiate. Kidneys begin producing urine. Placenta takes over progesterone production from the corpus luteum.",
    clinicalSignificance: [
      "Transition from embryonic to fetal period. Risk of spontaneous miscarriage drops significantly.",
      "Optimal window for first-trimester aneuploidy screening and preeclampsia risk assessment."
    ],
    recommendedTests: [
      "First Trimester Combined Screening (Serum PAPP-A + free beta-hCG) or Cell-Free DNA (NIPT)",
      "Preeclampsia screening: Maternal serum PAPP-A/PlGF + Mean Arterial Pressure (MAP) + Uterine Artery Doppler pulsatility index (UtA-PI)"
    ],
    ultrasound: [
      "11w0d to 13w6d Ultrasound: Nuchal Translucency (NT) thickness scan (normal < 3.5 mm).",
      "Confirm nasal bone presence, assess early fetal anatomy (cranium, abdominal wall, limbs), and diagnose chorionicity/amnionicity in multiple gestations."
    ],
    vaccinations: [
      "COVID-19 vaccination booster if recommended by local health guidelines."
    ],
    counselling: [
      "Initiate low-dose Aspirin (75-150 mg nightly, ideally 150 mg) between 12-16 weeks if at moderate-to-high risk for preeclampsia (per ASPRE trial protocol).",
      "Discuss results of aneuploidy screening and indications for diagnostic testing (CVS or Amniocentesis)."
    ],
    references: [
      "FIGO Good Clinical Practice Advice: First trimester screening and prevention of preeclampsia (2019)",
      "RCOG Green-top Guideline No. 51: The Management of Women with RhD Negative Pregnancy (2011)"
    ]
  },
  {
    week: 16,
    title: "Early Second Trimester & Quad Screen Window",
    trimester: "2nd Trimester",
    fetalDevelopment: "Rapid fetal growth. Skeleton ossifies. Meconium develops in intestinal tract. Fetal movements begin (quickening felt by multiparous women).",
    clinicalSignificance: [
      "Evaluation of maternal serum markers for neural tube defects (NTDs) and chromosomal abnormalities if first-trimester screening was missed.",
      "Assessment of cervical competence in patients with history of spontaneous mid-trimester loss or preterm birth."
    ],
    recommendedTests: [
      "Maternal Serum Alpha-Fetoprotein (MSAFP) screen for open neural tube defects (optimal between 16-18 weeks).",
      "Quadruple screen (AFP, hCG, uE3, Inhibin-A) if first-trimester screening unperformed.",
      "Amniocentesis indicated if screening tests are high risk or maternal request (15-20 weeks)."
    ],
    ultrasound: [
      "Cervical length surveillance via transvaginal ultrasound in women with prior spontaneous preterm birth or cervical surgery."
    ],
    vaccinations: [
      "Continue seasonal influenza vaccination if not previously administered."
    ],
    counselling: [
      "Expectation of quickening (first perception of fetal movement between 16-20 weeks).",
      "Routine maternal exercise (150 minutes/week of moderate-intensity aerobic activity) and pelvic floor muscle exercises.",
      "Dental checkup reassurance (routine dental care and cleanings are safe and recommended during pregnancy)."
    ],
    references: [
      "ACOG Practice Bulletin No. 226: Screening for Fetal Chromosomal Abnormalities (2020)",
      "SMFM Consult Series No. 40: The role of routine cervical length screening (2016)"
    ]
  },
  {
    week: 20,
    title: "Detailed Anomaly Scan & Mid-Pregnancy Review",
    trimester: "2nd Trimester",
    fetalDevelopment: "Fetus weighs ~300g. Vernix caseosa and lanugo cover fetal skin. Fetal hearing develops. Fundal height reaches umbilicus.",
    clinicalSignificance: [
      "The 18-22 week window is the global standard for comprehensive structural anomaly evaluation.",
      "Placental localization to rule out placenta previa or low-lying placenta."
    ],
    recommendedTests: [
      "Repeat hemoglobin/hematocrit if anemia suspected.",
      "Urine protein dipstick and blood pressure screening at antenatal visit."
    ],
    ultrasound: [
      "18w0d to 22w0d Comprehensive Anatomical Survey (Anomaly Scan): Systematic examination of fetal brain, spine, face, four-chamber heart, outflow tracts, abdomen, kidneys, cord insertion, and limbs.",
      "Biometry: BPD, HC, AC, FL for baseline growth estimation.",
      "Assess placental location and amniotic fluid volume."
    ],
    vaccinations: [
      "No specific vaccines due at this week unless catch-up required."
    ],
    counselling: [
      "Review anomaly scan findings in detail with prospective parents.",
      "Warning signs of preterm labor (cramping, pelvic pressure, watery vaginal discharge) and cervical insufficiency.",
      "Discuss travel safety and venous thromboembolism (VTE) prophylaxis during long-haul flights (hydration, compression stockings, frequent ambulation)."
    ],
    references: [
      "ISUOG Practice Guidelines: Performance of the routine mid-trimester fetal ultrasound scan (2011)",
      "ACOG Practice Bulletin No. 175: Ultrasound in Pregnancy (2016)"
    ]
  },
  {
    week: 24,
    title: "Fetal Viability & Gestational Diabetes Screening",
    trimester: "2nd Trimester",
    fetalDevelopment: "Fetus weighs ~600g. Alveolar sacs form in lungs and begin surfactant synthesis. Eyelids separate. Fetus is now legally and clinically considered viable in most jurisdictions.",
    clinicalSignificance: [
      "Critical milestone: threshold of neonatal viability. Survival rates with neonatal intensive care (NICU) exceed 50-60%.",
      "Universal screening window for Gestational Diabetes Mellitus (GDM) between 24 and 28 weeks."
    ],
    recommendedTests: [
      "2-Hour 75g Oral Glucose Tolerance Test (OGTT) for GDM diagnosis (fasting, 1-hr, and 2-hr venous plasma glucose) per IADPSG/WHO criteria, OR 1-Hour 50g Glucose Challenge Test (GCT) per ACOG two-step protocol.",
      "Repeat Complete Blood Count (CBC) to screen for physiologic hemodilution vs iron-deficiency anemia.",
      "Repeat Rh antibody screening in Rh-negative mothers."
    ],
    ultrasound: [
      "Follow-up ultrasound only indicated if placental localization was low-lying at 20w scan, or if maternal clinical risk factors warrant serial fetal growth surveillance."
    ],
    vaccinations: [
      "No mandatory vaccines at week 24, prepare for third trimester immunization schedule."
    ],
    counselling: [
      "Educate on recognizing preterm premature rupture of membranes (PPROM) and symptoms of preeclampsia (severe persistent headache, visual disturbances, epigastric pain).",
      "Instructions for Oral Glucose Tolerance Test (fasting requirement for 8-10 hours).",
      "Introduction to daily fetal kick counts if high-risk pregnancy."
    ],
    references: [
      "WHO Global Report on Diabetes / Diagnosis of GDM (2013)",
      "ACOG Practice Bulletin No. 190: Gestational Diabetes Mellitus (2018)"
    ]
  },
  {
    week: 28,
    title: "Third Trimester Initiation & RhIG Administration",
    trimester: "3rd Trimester",
    fetalDevelopment: "Fetus weighs ~1,000g (1 kg). Brain develops complex sulci and gyri. Eyes open and close. Rapid subcutaneous fat deposition begins.",
    clinicalSignificance: [
      "Initiation of the third trimester. Antenatal visit frequency increases to every 2 weeks.",
      "Prophylactic prevention of Rh alloimmunization in Rh-negative mothers.",
      "Optimal window for maternal Tdap vaccination to maximize passive transplacental antibody transfer to the fetus."
    ],
    recommendedTests: [
      "Review OGTT results; initiate medical nutrition therapy or insulin/metformin if GDM diagnosed.",
      "Check hemoglobin; initiate oral elemental iron (30-60 mg daily) if Hb < 10.5 g/dL.",
      "Antibody screen in Rh-negative women prior to RhIG administration."
    ],
    ultrasound: [
      "Serial growth ultrasound (biometry + Doppler + AFI) if indicated for high-risk conditions (chronic hypertension, GDM, multiple gestation, prior SGA/FGR)."
    ],
    vaccinations: [
      "Tdap (Tetanus, Diphtheria, Pertussis) vaccine recommended between 27 and 36 weeks gestation (ideally 27-30 weeks) in EVERY pregnancy to protect newborn against whooping cough.",
      "Administer Anti-D Immunoglobulin (RhIG / RhoGAM 300 mcg IM) at 28 weeks to all non-immunized Rh-negative women."
    ],
    counselling: [
      "Daily fetal movement tracking (Cardiff count-to-10 method: 10 movements within 2 hours during active periods).",
      "Discuss birth plan preferences, pain relief options in labor, and pediatric healthcare provider selection.",
      "Counsel on sleeping position: advise left lateral or side-sleeping after 28 weeks to prevent supine hypotensive syndrome and reduce stillbirth risk."
    ],
    references: [
      "ACOG Practice Bulletin No. 181: Prevention of Rh D Alloimmunization (2017)",
      "CDC Advisory Committee on Immunization Practices (ACIP): Tdap in pregnancy (2013)"
    ]
  },
  {
    week: 32,
    title: "Fetal Growth Surveillance & Presentation Check",
    trimester: "3rd Trimester",
    fetalDevelopment: "Fetus weighs ~1,800g. Bones are fully developed but soft and pliable. Fetal lungs continue maturing with increasing surfactant production.",
    clinicalSignificance: [
      "Monitoring fetal growth trajectory to detect Fetal Growth Restriction (FGR) or Macrosomia.",
      "Assessment of fetal lie and presentation (cephalic vs breech/transverse)."
    ],
    recommendedTests: [
      "Routine dipstick urinalysis for proteinuria and maternal blood pressure evaluation.",
      "Screening for sexually transmitted infections (HIV, Syphilis, Hepatitis B) in high-risk populations if repeat screening indicated."
    ],
    ultrasound: [
      "Third-trimester growth ultrasound (32-34 weeks) for high-risk pregnancies: measure EFW, Hadlock percentiles, Umbilical Artery Doppler S/D ratio and pulsatility index, and Amniotic Fluid Index (AFI)."
    ],
    vaccinations: [
      "Ensure Tdap vaccine was administered; if not, give immediately."
    ],
    counselling: [
      "Review symptoms of preterm labor and preeclampsia.",
      "Discuss breastfeeding benefits, techniques, and lactation support resources.",
      "Hospital registration and packing maternity bag for labor ward admission."
    ],
    references: [
      "ISUOG Practice Guidelines: Use of Doppler ultrasound in obstetrics (2021)",
      "ACOG Practice Bulletin No. 204: Fetal Growth Restriction (2019)"
    ]
  },
  {
    week: 36,
    title: "Group B Streptococcus (GBS) Screen & Near Term Prep",
    trimester: "3rd Trimester",
    fetalDevelopment: "Fetus weighs ~2,600g. Fetal head may begin engaging into maternal pelvis (lightening). Lanugo mostly shed.",
    clinicalSignificance: [
      "Universal screening for Group B Streptococcus (GBS) colonization to prevent neonatal sepsis via intrapartum antibiotic prophylaxis (IAP).",
      "Final assessment of fetal presentation. If breech, offer External Cephalic Version (ECV) at 36-37 weeks."
    ],
    recommendedTests: [
      "Vaginal-rectal swab for Group B Streptococcus (GBS) culture (36w0d to 37w6d).",
      "Repeat CBC to confirm maternal hemoglobin before labor (ensure Hb >= 11 g/dL to minimize postpartum hemorrhage impact)."
    ],
    ultrasound: [
      "Bedside ultrasound to confirm cephalic presentation if abdominal palpation is equivocal.",
      "Placental localization follow-up if prior scan showed low-lying placenta (confirm >20 mm from internal cervical os for safe vaginal trial)."
    ],
    vaccinations: [
      "Final check of maternal immunization record."
    ],
    counselling: [
      "Signs of true vs false labor (Braxton Hicks contractions vs regular, progressive cervical dilating contractions).",
      "When to proceed to the hospital/birth center (5-1-1 rule: contractions 5 minutes apart, lasting 1 minute, for at least 1 hour; or spontaneous rupture of membranes / vaginal bleeding).",
      "Discuss indications and options for External Cephalic Version (ECV) or elective Cesarean delivery if breech presentation."
    ],
    references: [
      "ACOG Committee Opinion No. 797: Prevention of Group B Streptococcal Early-Onset Disease in Newborns (2020)",
      "RCOG Green-top Guideline No. 20a: External Cephalic Version and Reducing the Incidence of Term Breech Presentation (2017)"
    ]
  },
  {
    week: 37,
    title: "Early Term Milestone & Labor Readiness",
    trimester: "3rd Trimester",
    fetalDevelopment: "Fetus weighs ~2,900g. Pregnancy is officially considered 'Early Term' (37w0d to 38w6d). Fetal lung maturation is generally complete.",
    clinicalSignificance: [
      "Delivery at 37 weeks is no longer classified as preterm, though non-medically indicated elective induction or cesarean should be avoided prior to 39w0d to optimize respiratory and cognitive outcomes.",
      "Weekly antenatal visits begin until delivery."
    ],
    recommendedTests: [
      "Weekly maternal blood pressure and urine protein check.",
      "Cervical assessment (Bishop score) if induction of labor is medically indicated."
    ],
    ultrasound: [
      "Biophysical Profile (BPP) or Modified BPP (AFI + NST) if clinical surveillance indicated for fetal well-being."
    ],
    vaccinations: [
      "No new vaccinations."
    ],
    counselling: [
      "Reiterate why elective induction prior to 39w0d without medical indication is discouraged (ACOG 'Choosing Wisely' campaign).",
      "Confirm transportation plans, infant car seat installation, and emergency contact list.",
      "Discuss postpartum contraception options (LARC, pills, barrier methods) prior to hospital admission."
    ],
    references: [
      "ACOG Committee Opinion No. 579: Definition of Term Pregnancy (2013)",
      "SMFM Clinical Guideline: Medically indicated late-preterm and early-term deliveries (2021)"
    ]
  },
  {
    week: 40,
    title: "Estimated Due Date (EDD) & Post-Dates Surveillance Plan",
    trimester: "3rd Trimester",
    fetalDevelopment: "Fetus weighs ~3,400g (3.4 kg). Full term gestation completed (280 days from LMP). Amniotic fluid volume naturally begins decreasing.",
    clinicalSignificance: [
      "Exact Estimated Due Date (EDD) reached. Only ~5% of women deliver on their exact EDD.",
      "Initiation of expectant management protocols or discussion of elective induction of labor at 39-40 weeks (per ARRIVE trial data showing reduced cesarean rates with 39-week induction in low-risk nulliparous women)."
    ],
    recommendedTests: [
      "Antenatal fetal surveillance: Non-Stress Test (NST) ± Amniotic Fluid Index (AFI) or full Biophysical Profile (BPP) initiated between 40w0d and 41w0d.",
      "Cervical examination (Bishop score assessment) to evaluate readiness for membrane sweeping or induction."
    ],
    ultrasound: [
      "Amniotic fluid volume assessment (AFI < 5 cm or Maximum Vertical Pocket < 2 cm defines oligohydramnios, an indication for delivery)."
    ],
    vaccinations: [
      "Postpartum vaccine planning (MMR or Varicella booster in hospital after delivery if non-immune)."
    ],
    counselling: [
      "Offer membrane sweeping (stripping of membranes) during vaginal exam to promote endogenous prostaglandin release and reduce need for formal induction.",
      "Discuss shared decision-making regarding induction of labor between 40w0d and 41w0d.",
      "Strict instructions to report immediately if any decrease in fetal movement is perceived."
    ],
    references: [
      "ACOG Practice Bulletin No. 146: Management of Late-Term and Postterm Pregnancies (2014)",
      "NEJM ARRIVE Trial: Labor Induction versus Expectant Management in Low-Risk Nulliparous Women (2018)"
    ]
  },
  {
    week: 42,
    title: "Post-Term Gestation & Mandatory Delivery",
    trimester: "Post-Term",
    fetalDevelopment: "Fetus is officially post-term (>=42w0d). Placental aging (calcifications, infarction) increases risk of uteroplacental insufficiency, oligohydramnios, meconium aspiration, and macrosomia.",
    clinicalSignificance: [
      "High-risk status: Perinatal mortality and morbidity increase significantly beyond 41w0d and sharply beyond 42w0d.",
      "Delivery is universally recommended no later than 41w0d to 42w0d."
    ],
    recommendedTests: [
      "Continuous or twice-weekly fetal surveillance (NST + AFI or BPP) if patient declines induction prior to 42w0d.",
      "Immediate admission for induction of labor (cervical ripening with prostaglandins or balloon catheter followed by oxytocin infusion)."
    ],
    ultrasound: [
      "Immediate ultrasound for AFI/MVP and estimated fetal weight (assess for macrosomia > 4,000g or 4,500g)."
    ],
    vaccinations: [
      "Postpartum administration as indicated."
    ],
    counselling: [
      "Urgent counselling regarding the evidence-based risks of continuing pregnancy beyond 42 weeks (stillbirth, meconium aspiration syndrome, birth trauma, cesarean delivery).",
      "Explanation of labor induction methods (foley/cook balloon, oral/vaginal misoprostol, dinoprostone, oxytocin, amniotomy)."
    ],
    references: [
      "WHO Recommendations for Induction of Labour (2011)",
      "RCOG Green-top Guideline No. 70: Induction of Labour at Term in Older Mothers (2013)"
    ]
  }
];

export function getMilestoneByWeek(week: number): MilestoneData | undefined {
  return PREGNANCY_MILESTONES.find((m) => m.week === week);
}
