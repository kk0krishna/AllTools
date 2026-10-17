const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");

function generateIndiaMecPdf() {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const primaryColor = [5, 150, 105]; // Emerald
  const darkTextColor = [24, 30, 42];
  const mutedTextColor = [80, 90, 105];

  // Page 1: Header & Program Overview
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("MINISTRY OF HEALTH & FAMILY WELFARE (MoHFW) - GOVT. OF INDIA", 105, 12, { align: "center" });
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("India-Adapted WHO Medical Eligibility Criteria (MEC) for Contraceptive Use", 105, 20, { align: "center" });

  doc.setTextColor(...darkTextColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("1. Executive Summary & National Program Guidelines", 14, 38);

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...mutedTextColor);
  const intro = [
    "The Medical Eligibility Criteria (MEC) Wheel for Contraceptive Use - India (2022 Update) has been formulated",
    "by the Family Planning Division, Ministry of Health and Family Welfare (MoHFW), Government of India, in technical",
    "collaboration with the World Health Organization (WHO) India Country Office. It adapts global WHO evidence-based",
    "criteria to align with India's expanded contraceptive basket under Mission Parivar Vikas (MPV)."
  ];
  let y = 45;
  intro.forEach(line => { doc.text(line, 14, y); y += 5; });

  // MEC Categories Legend Box
  y += 2;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(14, y, 182, 38, 3, 3, "F");
  doc.setDrawColor(220, 225, 230);
  doc.roundedRect(14, y, 182, 38, 3, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...darkTextColor);
  doc.text("MEC Medical Eligibility Categories (1 to 4):", 18, y + 7);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  const cats = [
    "Category 1 (GREEN): Use method in any circumstance. No restriction on contraceptive use. (YES)",
    "Category 2 (BLUE): Generally use the method. Advantages generally outweigh theoretical or proven risks. (YES)",
    "Category 3 (ORANGE): Use of method not usually recommended unless other methods unavailable. (NO*)",
    "Category 4 (RED): Method NOT to be used. Unacceptable health risk. Absolute contraindication. (NO)"
  ];
  let cy = y + 14;
  cats.forEach(c => { doc.text(c, 18, cy); cy += 5.5; });

  // Key Indian Adaptations
  y += 45;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...darkTextColor);
  doc.text("2. Key National Contraceptive Methods & Special Directives", 14, y);

  const adaptations = [
    {
      title: "Centchroman (Ormeloxifene - Chhaya / Saheli):",
      body: "Indigenous non-steroidal, non-hormonal SERM. Dosing: Twice weekly for the first 3 months (e.g., Sun & Wed), then once weekly thereafter on the first designated day. Safe during any stage of lactation. Free of estrogenic/progestational vascular risks. 8-10% of users experience delayed periods in first 3 months (benign pharmacological effect)."
    },
    {
      title: "Antara Programme (DMPA - 150 mg IM / 104 mg SC):",
      body: "3-monthly progestogen-only injectable. Given within first 7 days of menses, immediately postpartum (<48 hours) or 6 weeks postpartum if breastfeeding. Window period: Up to 2 weeks early or up to 4 weeks late without requiring backup contraception."
    },
    {
      title: "Copper IUCD (Cu-IUCD 380A & Cu-IUCD 375):",
      body: "Cu-380A provides 10-year protection; Cu-375 provides 5-year protection. Postpartum IUCD (PPIUCD) can be safely inserted post-placental (within 10 min), intracesarean, or within 48 hours of delivery. If >48 hours elapsed, defer insertion to 6 weeks postpartum."
    },
    {
      title: "Female & Male Sterilization Guidelines (A, C, D, S):",
      body: "Categorized as A (Accept), C (Caution), D (Delay), and S (Special). Male sterilization (Non-Scalpel Vasectomy - NSV) is preferred. Condom backup required for 3 months post-vasectomy until azoospermia is confirmed."
    }
  ];

  y += 6;
  adaptations.forEach(item => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...primaryColor);
    doc.text(item.title, 14, y);
    y += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...darkTextColor);
    const splitBody = doc.splitTextToSize(item.body, 182);
    doc.text(splitBody, 14, y);
    y += splitBody.length * 4.2 + 3.5;
  });

  // Footer Page 1
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedTextColor);
  doc.text("India-Adapted WHO MEC Reference Guide • Ministry of Health & Family Welfare, Govt. of India • Page 1 of 2", 105, 290, { align: "center" });

  // Page 2: Summary Matrix Table & ARV Guidance
  doc.addPage();
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 16, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("India MEC Wheel 2022-2023: Clinical Summary Matrix & Prescribing Directives", 105, 11, { align: "center" });

  y = 24;
  doc.setTextColor(...darkTextColor);
  doc.setFontSize(12);
  doc.text("3. High-Priority Conditions & Contraindications Quick Table", 14, y);

  y += 6;
  // Table header
  doc.setFillColor(235, 240, 245);
  doc.rect(14, y, 182, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Medical Condition", 16, y + 5);
  doc.text("COCs & CICs", 72, y + 5);
  doc.text("Chhaya", 100, y + 5);
  doc.text("Antara / DMPA", 125, y + 5);
  doc.text("Cu-IUCD", 155, y + 5);
  doc.text("LNG-IUD", 178, y + 5);

  const tableRows = [
    ["Severe Hypertension (>= 160 / >= 100)", "4 (Contraindicated)", "1 (Safe)", "3 (Caution)", "1 (Safe)", "2 (Generally Use)"],
    ["Migraine with Aura (Any age)", "4 (Contraindicated)", "1 (Safe)", "2 (Generally Use)", "1 (Safe)", "2 (Generally Use)"],
    ["Smoking >= 35 years (>=15 cigs/day)", "4 (Contraindicated)", "1 (Safe)", "1 (Safe)", "1 (Safe)", "1 (Safe)"],
    ["Deep Vein Thrombosis (Acute DVT/PE)", "4 (Contraindicated)", "1 (Safe)", "2 (Generally Use)", "1 (Safe)", "2 (Generally Use)"],
    ["Breast Cancer (Current)", "4 (Contraindicated)", "4 (Contraindicated)", "4 (Contraindicated)", "1 (Safe)", "4 (Contraindicated)"],
    ["Postpartum < 48 Hours (Breastfeeding)", "4 (Contraindicated)", "1 (Safe)", "1 (Safe - MPV)", "1 (Safe - PPIUCD)", "2 (Generally Use)"],
    ["Postpartum 48 hrs to 6 weeks", "4 (Contraindicated)", "1 (Safe)", "1 (Safe)", "3 (Delay insertion)", "3 (Delay insertion)"],
    ["Current PID / Purulent Cervicitis", "1 (Safe)", "1 (Safe)", "1 (Safe)", "4 (Contraindicated)", "4 (Contraindicated)"],
    ["Unexplained Vaginal Bleeding", "1 (Safe)", "1 (Safe)", "2 (Generally Use)", "4 (Evaluate 1st)", "4 (Evaluate 1st)"],
    ["Tuberculosis on Rifampicin (ATT)", "3 (Interacts)", "2 (Can use)", "1 (Safe)", "1 (Safe)", "1 (Safe)"],
    ["Epilepsy on Enzyme Inducers", "3 (Interacts)", "1 (Safe)", "1 (Safe)", "1 (Safe)", "1 (Safe)"],
    ["Severe Decompensated Cirrhosis", "4 (Contraindicated)", "4 (Contraindicated)", "3 (Caution)", "1 (Safe)", "3 (Caution)"]
  ];

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  tableRows.forEach((row, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 6.5, "F");
    }
    doc.setDrawColor(230, 235, 240);
    doc.line(14, y + 6.5, 196, y + 6.5);

    doc.setTextColor(...darkTextColor);
    doc.text(row[0], 16, y + 4.5);

    // Color code scores
    const printScore = (val, x) => {
      if (val.startsWith("4")) doc.setTextColor(225, 29, 72);
      else if (val.startsWith("3")) doc.setTextColor(217, 119, 6);
      else if (val.startsWith("2")) doc.setTextColor(37, 99, 235);
      else doc.setTextColor(5, 150, 105);
      doc.text(val, x, y + 4.5);
    };

    printScore(row[1], 72);
    printScore(row[2], 100);
    printScore(row[3], 125);
    printScore(row[4], 155);
    printScore(row[5], 178);

    y += 6.5;
  });

  // Clinical Practice Pearls
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...darkTextColor);
  doc.text("4. Emergency Contraceptive Pills (ECPs) & Lactational Amenorrhea (LAM)", 14, y);

  y += 5.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const eNotes = [
    "• Levonorgestrel ECP (1.5 mg single dose): Must be taken as early as possible within 72 hours of unprotected intercourse.",
    "• Ulipristal Acetate (30 mg): Can be taken up to 120 hours (5 days) post-coitus with higher efficacy in overweight women.",
    "• Cu-IUCD as Emergency Contraception: Insertion within 5 days is >99% effective and provides long-term ongoing contraception.",
    "• LAM 3 Criteria: (1) Baby <6 months of age, (2) Exclusive breastfeeding day and night, (3) Mother remains amenorrhoeic."
  ];
  eNotes.forEach(en => { doc.text(en, 14, y); y += 5; });

  // References & Verification Note
  y += 6;
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(14, y, 182, 22, 2, 2, "F");
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, y, 182, 22, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryColor);
  doc.text("Official Clinical Sources:", 18, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...darkTextColor);
  doc.text("1. Ministry of Health & Family Welfare (MoHFW), Nirman Bhawan, New Delhi - Reference Manual for MEC Wheel (2022).", 18, y + 11);
  doc.text("2. World Health Organization (WHO) - Medical Eligibility Criteria for Contraceptive Use (5th Edition 2015 / India Update).", 18, y + 15.5);
  doc.text("3. Clinikkit Digital Health Suite (https://clinikkit.web.app/tools/obstetrics/india-mec-wheel/)", 18, y + 19.5);

  // Footer Page 2
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedTextColor);
  doc.text("India-Adapted WHO MEC Reference Guide • Ministry of Health & Family Welfare, Govt. of India • Page 2 of 2", 105, 290, { align: "center" });

  const outPath = path.join(__dirname, "..", "public", "docs", "india-adapted-mec-reference-guide.pdf");
  fs.writeFileSync(outPath, Buffer.from(doc.output("arraybuffer")));
  console.log("Successfully generated India MEC Reference PDF at", outPath);
}

generateIndiaMecPdf();
