"use client";

import React, { useMemo } from "react";
import { MecDataset } from "./types";

interface MecSvgWheelProps {
  dataset: MecDataset;
  currentRotation: number;
  activeSectorIndex: number;
  highlightedSectorIndex?: number | null;
  onSectorClick: (index: number) => void;
  isDragging: boolean;
  wheelGroupRef?: React.RefObject<SVGGElement | null>;
}

// Helper to calculate arc SVG path for donut wedges
function createArcPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startDeg: number,
  endDeg: number
): string {
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const startAngle = toRad(startDeg);
  const endAngle = toRad(endDeg);

  const x1 = cx + rOuter * Math.cos(startAngle);
  const y1 = cy + rOuter * Math.sin(startAngle);
  const x2 = cx + rOuter * Math.cos(endAngle);
  const y2 = cy + rOuter * Math.sin(endAngle);

  const x3 = cx + rInner * Math.cos(endAngle);
  const y3 = cy + rInner * Math.sin(endAngle);
  const x4 = cx + rInner * Math.cos(startAngle);
  const y4 = cy + rInner * Math.sin(startAngle);

  const largeArcFlag = endDeg - startDeg > 180 ? 1 : 0;

  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;
}

// Curved path for text along arc
function createTextArcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number
): string {
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const startAngle = toRad(startDeg);
  const endAngle = toRad(endDeg);

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);

  const largeArcFlag = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

// Generates solid Upper Disc path with an open 10-degree cutout slot at 12 o'clock (NO MASK needed)
function getUpperDiscPath(cx: number, cy: number, rOuter: number, rHub: number): string {
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const startAngle = toRad(5);
  const endAngle = toRad(355);

  const xA = cx + rOuter * Math.cos(startAngle);
  const yA = cy + rOuter * Math.sin(startAngle);

  const xD = cx + rOuter * Math.cos(endAngle);
  const yD = cy + rOuter * Math.sin(endAngle);

  const xC = cx + rHub * Math.cos(endAngle);
  const yC = cy + rHub * Math.sin(endAngle);

  const xB = cx + rHub * Math.cos(startAngle);
  const yB = cy + rHub * Math.sin(startAngle);

  return (
    `M ${xA.toFixed(2)} ${yA.toFixed(2)} ` +
    `A ${rOuter} ${rOuter} 0 1 1 ${xD.toFixed(2)} ${yD.toFixed(2)} ` +
    `L ${xC.toFixed(2)} ${yC.toFixed(2)} ` +
    `A ${rHub} ${rHub} 0 0 0 ${xB.toFixed(2)} ${yB.toFixed(2)} ` +
    `Z`
  );
}

// Color lookup for India wheel cell backgrounds matching physical disc
function getIndiaCellColor(scoreStr: string): string {
  const clean = scoreStr.split(/[\^A-Za-z]/)[0].trim();
  if (clean === "1") return "#6eb634"; // Vibrant Lime green (Cat 1)
  if (clean === "2") return "#1d63bf"; // Royal blue (Cat 2)
  if (clean === "3") return "#f2722b"; // Vibrant Orange (Cat 3)
  if (clean === "4") return "#d62828"; // Crimson red (Cat 4)
  if (clean.includes("2-3") || clean.includes("2/3")) return "url(#split-blue-orange)";
  if (clean.includes("3-4") || clean.includes("3/4")) return "url(#split-orange-red)";
  if (clean.includes("1-2") || clean.includes("1/2")) return "url(#split-green-blue)";
  return "#6eb634";
}

// Multi-line category label mapping for the outer rim (Exact Title Case match to physical images)
const CATEGORY_LINE_MAP: Record<string, string[]> = {
  // India Categories
  "Cardiovascular Diseases": ["Cardiovascular", "Diseases"],
  "Deep Vein Thrombosis": ["Deep Vein", "Thrombosis"],
  "Diabetes Mellitus": ["Diabetes", "Mellitus"],
  "Liver Disease": ["Liver", "Disease"],
  "SLE": ["SLE"],
  "Anaemia": ["Anaemia"],
  "Unexplained Vaginal Bleeding": ["Unexplained", "Vaginal", "Bleeding"],
  "Uterus Fibroid": ["Uterus", "Fibroid"],
  "PCOD": ["PCOD"],
  "Cancer": ["Cancer"],
  "Gestational Trophoblastic Disease": ["Gestational", "Trophoblastic", "Disease"],
  "Age": ["Age"],
  "Nulliparous": ["Nulliparous"],
  "Postpartum Breastfeeding": ["Postpartum", "Breastfeeding"],
  "Previous LSCS": ["Previous", "LSCS"],
  "Post Abortal": ["Post", "Abortal"],
  "Sepsis": ["Sepsis"],
  "Pelvic Inflammatory Disease": ["Pelvic", "Inflammatory"],
  "STIs/RTIs": ["STIs/RTIs"],
  "HIV/AIDS": ["HIV/AIDS"],
  "TB": ["TB"],
  "Epilepsy": ["Epilepsy"],
  "Smoking": ["Smoking"],
  "Hypertension": ["Hypertension"],
  "Headache": ["Headache"],

  // WHO Categories
  "POSTPARTUM AND BREASTFEEDING": ["POSTPARTUM AND", "BREASTFEEDING"],
  "NULLIPARITY": ["NULLIPARITY"],
  "ADOLESCENTS": ["ADOLESCENTS"],
  "VAGINAL BLEEDING": ["VAGINAL", "BLEEDING"],
  "UTERINE FIBROIDS": ["UTERINE", "FIBROIDS"],
  "CERVICAL NEOPLASIA": ["CERVICAL", "NEOPLASIA"],
  "CERVICAL CANCER": ["CERVICAL", "CANCER"],
  "BREAST CANCER": ["BREAST", "CANCER"],
  "LIVER DISEASES": ["LIVER", "DISEASES"],
  "VENOUS THROMBOEMBOLISM": ["VENOUS", "THROMBOEMBOLISM"],
  "CARDIOVASCULAR DISEASE": ["CARDIOVASCULAR", "DISEASE"],
  "HYPERTENSION": ["HYPERTENSION ᴰ"],
  "OBESITY": ["OBESITY"],
  "DIABETES": ["DIABETES ᴳ"],
  "SMOKING": ["SMOKING"],
  "HEADACHE": ["HEADACHE"],
  "MEDICATIONS": ["MEDICATIONS"],
  "HIV": ["HIV"],
  "SEXUALLY TRANSMITTED INFECTIONS": ["SEXUALLY TRANSMITTED", "INFECTIONS"],
  "PELVIC INFLAMMATORY DISEASE": ["P I D ᶜ"],
  "SEPSIS": ["SEPSIS"]
};

// Formats outer rim category name into multiple lines
function getCategoryLines(name: string): string[] {
  if (CATEGORY_LINE_MAP[name]) return CATEGORY_LINE_MAP[name];
  const words = name.split(/\s+/);
  if (words.length <= 2) return words;
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

// Comprehensive dictionary mapping for EVERY sector condition matching the physical printed wheel
const CONDITION_LINE_MAP: Record<string, string[]> = {
  // WHO MEC 36 Conditions (Exact dataset conditionName matches)
  "< 48 Hours Postpartum": ["< 48 hours"],
  "48 Hours to < 4 Weeks Postpartum": ["48 hours to", "< 4 weeks"],
  "4 Weeks to < 6 Weeks Postpartum": ["4 weeks to", "< 6 weeks"],
  "6 Weeks to < 6 Months Postpartum": ["6 weeks to", "< 6 months"],
  "Nulliparous": ["Nulliparous"],
  "Menarche to age < 18 years": ["Menarche", "to age", "< 18 yrs"],
  "Unexplained Vaginal Bleeding": ["Unexplained"],
  "Uterine Fibroids": ["Uterine", "fibroids"],
  "Cervical Intraepithelial Neoplasia (CIN)": ["CIN"],
  "Cervical Cancer (Pre-treatment)": ["Pre-", "treatment"],
  "Current Breast Cancer": ["Current"],
  "Liver Tumour (Benign / Malignant)": ["Liver", "tumour ᴶ"],
  "Acute Viral Hepatitis / Flare": ["Hepatitis", "acute/flare"],
  "History of Hepatitis / Carrier": ["History"],
  "Acute DVT / PE": ["Acute"],
  "Major Surgery with Prolonged Immobilization": ["Major surgery", "with prolonged", "immobiliz."],
  "Stroke (History of CVA)": ["Stroke"],
  "Ischaemic Heart Disease (IHD)": ["Ischaemic", "heart", "disease"],
  "Multiple Cardiovascular Risk Factors": ["Multiple", "risk", "factors ᴺ"],
  "Severe Hypertension (≥ 160 / ≥ 100)": ["≥ 160 /", "≥ 100"],
  "Moderate / Controlled Hypertension": ["140-159/90-99", "or adequately", "controlled"],
  "Obesity (BMI ≥ 30 kg/m²)": ["BMI", "≥ 30 kg/m²"],
  "Smoking: Age < 35 Years": ["Age < 35"],
  "Smoking: Age ≥ 35 Years": ["Age ≥ 35"],
  "Non-migrainous Headache": ["Non-", "migrainous"],
  "Migraine with Aura (Any Age)": ["Migraine", "with aura ˢ"],
  "Certain Anti-convulsants": ["Certain", "anti-", "convulsants ᵀ"],
  "Rifampicin / Rifabutin Therapy": ["Rifampicin /", "Rifabutin"],
  "Antiretroviral Therapy (ART)": ["Antiretroviral", "therapy"],
  "WHO Stage 3 or 4 Clinical Disease": ["WHO", "Stage 3 or 4"],
  "Gonorrhoea & Chlamydia (Current)": ["Gonorrhoea", "and", "Chlamydia"],
  "Other STIs and Vaginitis": ["Other STIs", "and", "vaginitis"],
  "Increased Risk of STIs": ["Increased", "risk of", "STIs"],
  "Current PID": ["Current"],
  "Puerperal / Post-Abortion Sepsis": ["Puerperal", "and post-", "abortion"],

  // India MEC 36 Conditions (Exact dataset conditionName matches)
  "HIV / AIDS": ["HIV / AIDS"],
  "Tuberculosis (On Rifampicin / Rifabutin)": ["On", "rifampicin", "rifabutin"],
  "Epilepsy (On Anticonvulsants)": ["On", "anticonvul-", "sants"],
  "Smoking (> 35 Years)": ["> 35 Yrs"],
  "Hypertension (< 160 / 100)": ["< 160 / 100"],
  "Hypertension (> 160 / 100)": ["> 160 / 100"],
  "Migraine with Aura": ["Migraine", "with aura°"],
  "Migraine without Aura": ["Migraine", "without", "aura°"],
  "Stroke, IHD, Multiple Risk Factors": ["Stroke, IHD,", "multiple risk", "factorsᴺ"],
  "Valvular Heart Disease (Complicated)": ["Valvular", "heart disease", "(complicated)"],
  "H/O DVT / PE, On Anticoagulants, Bedridden": ["H/O DVT/PE, on", "anticoagulant,", "prolonged", "immobilization"],
  "Diabetes Mellitus (Current)": ["Current"],
  "Acute Viral Hepatitis": ["Acute viral", "hepatitis"],
  "Cirrhosis / Liver Tumour": ["Cirrhosis /", "liver Tumor"],
  "Systemic Lupus Erythematosus (SLE)": ["SLE", "(Lupus)"],
  "Anaemia (Iron Deficiency / Sickle Cell)": ["Anaemia", "(Hb < 7)"],
  "Polycystic Ovarian Disease (PCOD / PCOS)": ["PCOD /", "PCOS"],
  "Breast Cancer (Current)": ["Breast", "cancer"],
  "Cervical Cancer": ["Cervical", "cancer"],
  "Gestational Trophoblastic Disease": ["Gestational", "trophoblast."],
  "Menarche to < 18 Years": ["Menarche to", "< 18 years"],
  "40 Years and Above": ["40 years", "and above"],
  "48 Hours to 6 Weeks Postpartum": ["48 hrs -", "6 weeks"],
  "6 Weeks to 6 Months Postpartum": ["6 weeks -", "6 months"],
  "Previous Caesarean Section (LSCS)": ["Previous", "Caesarean"],
  "Post-Abortion (Medical)": ["Medical"],
  "Post-Abortion (Surgical)": ["Surgical"],
  "STIs / RTIs (Purulent Discharge)": ["Purulent", "discharge"],
  "STIs / RTIs (Non-Purulent Discharge / High Risk)": ["Non-purulent", "discharge &", "high risk"],
};

// Formats condition names into lines with intelligent wrapping fallback
function getConditionLines(name: string, isIndia: boolean): string[] {
  if (isIndia) {
    if (name === "Diabetes Mellitus (Current)") return ["Current"];
    if (name === "Acute DVT / PE") return ["Acute DVT"];
    if (name === "Smoking (> 35 Years)") return ["> 35 Yrs"];
    if (name === "Hypertension (< 160 / 100)") return ["< 160 / 100"];
    if (name === "Hypertension (> 160 / 100)") return ["> 160 / 100"];
    if (name === "< 48 Hours Postpartum") return ["< 48 hrs"];
    if (name === "48 Hours to 6 Weeks Postpartum") return ["48 hrs -", "6 weeks"];
    if (name === "6 Weeks to 6 Months Postpartum") return ["6 weeks -", "6 months"];
    if (name === "Current PID") return ["Current"];
    if (name === "Cirrhosis / Liver Tumour") return ["Cirrhosis /", "liver Tumor"];
    if (name === "Systemic Lupus Erythematosus (SLE)") return ["SLE", "(Lupus)"];
    if (name === "Anaemia (Iron Deficiency / Sickle Cell)") return ["Anaemia", "(Hb < 7)"];
    if (name === "Polycystic Ovarian Disease (PCOD / PCOS)") return ["PCOD /", "PCOS"];
    if (name === "Uterine Fibroids") return ["Uterine", "fibroids"];
    if (name === "Unexplained Vaginal Bleeding") return ["Unexplained", "bleeding"];
    if (name === "Gestational Trophoblastic Disease") return ["Gestational", "trophoblast."];
    if (name === "Puerperal / Post-Abortion Sepsis") return ["Puerperal /", "postabortal"];
  }
  if (!isIndia) {
    if (name === "Current PID") return ["Current"];
    if (name === "Diabetes Mellitus (Current)") return ["Current"];
    if (name === "Unexplained Vaginal Bleeding") return ["Unexplained"];
    if (name === "Acute DVT / PE") return ["Acute"];
    if (name === "Stroke (History of CVA)") return ["Stroke"];
    if (name === "History of Hepatitis / Carrier") return ["History"];
    if (name === "Cervical Intraepithelial Neoplasia (CIN)") return ["CIN"];
    if (name === "Current Breast Cancer") return ["Current"];
    if (name === "Smoking: Age < 35 Years") return ["Age < 35"];
    if (name === "Smoking: Age ≥ 35 Years") return ["Age ≥ 35"];
    if (name === "Severe Hypertension (≥ 160 / ≥ 100)") return ["≥ 160 /", "≥ 100"];
    if (name === "Obesity (BMI ≥ 30 kg/m²)") return ["BMI", "≥ 30 kg/m²"];
    if (name === "Liver Tumour (Benign / Malignant)") return ["Liver", "tumour ᴶ"];
    if (name === "Major Surgery with Prolonged Immobilization") return ["Major surgery", "with prolonged", "immobiliz."];
    if (name === "Ischaemic Heart Disease (IHD)") return ["Ischaemic", "heart", "disease"];
    if (name === "Multiple Cardiovascular Risk Factors") return ["Multiple", "risk", "factors ᴺ"];
    if (name === "Moderate / Controlled Hypertension") return ["140-159/90-99", "or adequately", "controlled"];
    if (name === "Migraine with Aura (Any Age)") return ["Migraine", "with aura ˢ"];
    if (name === "Certain Anti-convulsants") return ["Certain", "anti-", "convulsants ᵀ"];
    if (name === "Rifampicin / Rifabutin Therapy") return ["Rifampicin /", "Rifabutin"];
    if (name === "Antiretroviral Therapy (ART)") return ["Antiretroviral", "therapy"];
    if (name === "WHO Stage 3 or 4 Clinical Disease") return ["WHO", "Stage 3 or 4"];
    if (name === "Gonorrhoea & Chlamydia (Current)") return ["Gonorrhoea", "and", "Chlamydia"];
    if (name === "Other STIs and Vaginitis") return ["Other STIs", "and", "vaginitis"];
    if (name === "Increased Risk of STIs") return ["Increased", "risk of", "STIs"];
    if (name === "Puerperal / Post-Abortion Sepsis") return ["Puerperal", "and post-", "abortion"];
    if (name === "< 48 Hours Postpartum") return ["< 48 hours"];
    if (name === "48 Hours to < 4 Weeks Postpartum") return ["48 hours to", "< 4 weeks"];
    if (name === "4 Weeks to < 6 Weeks Postpartum") return ["4 weeks to", "< 6 weeks"];
    if (name === "6 Weeks to < 6 Months Postpartum") return ["6 weeks to", "< 6 months"];
    if (name === "Menarche to age < 18 years") return ["Menarche", "to age", "< 18 yrs"];
    if (name === "Cervical Cancer (Pre-treatment)") return ["Pre-", "treatment"];
    if (name === "Acute Viral Hepatitis / Flare") return ["Hepatitis", "acute/flare"];
  }
  if (CONDITION_LINE_MAP[name]) {
    return CONDITION_LINE_MAP[name];
  }

  // Automatic smart wrapping ensuring no line exceeds 12 characters
  const words = name.split(/\s+/);
  const lines: string[] = [];
  let cur = "";

  for (const w of words) {
    if (!cur) {
      cur = w;
    } else if ((cur + " " + w).length <= 12) {
      cur += " " + w;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);

  return lines.length > 0 ? lines : [name];
}

// Splits score string into main value and superscript footnote note (e.g. "2S" -> { value: "2", note: "S" })
function parseScore(scoreStr: string): { value: string; note: string } {
  const match = scoreStr.match(/^([0-9\-/]+)\s*[\^]?([A-Za-z]+)?$/);
  if (match) {
    return { value: match[1], note: match[2] || "" };
  }
  return { value: scoreStr, note: "" };
}

export function MecSvgWheel({
  dataset,
  currentRotation,
  activeSectorIndex,
  highlightedSectorIndex,
  onSectorClick,
  isDragging,
  wheelGroupRef
}: MecSvgWheelProps) {
  const isIndia = dataset.wheelId === "india-mec-2022";
  const cx = 400;
  const cy = 400;

  // Geometry dimensions
  const rOuter = 398;
  const rCatInner = 338;
  const rCondInner = 276;
  const rHub = 106;

  const methodCount = dataset.methods.length;
  const trackWidth = (rCondInner - rHub) / methodCount;

  // Group continuous sectors into category arcs
  const categoryGroups = useMemo(() => {
    const groups: Array<{
      id: string;
      name: string;
      lines: string[];
      startDeg: number;
      endDeg: number;
      midDeg: number;
      count: number;
    }> = [];

    let current = {
      name: dataset.sectors[0].categoryName,
      startIdx: 0,
      count: 0
    };

    dataset.sectors.forEach((sec, idx) => {
      if (sec.categoryName === current.name) {
        current.count++;
      } else {
        const startDeg = current.startIdx * 10;
        const endDeg = (current.startIdx + current.count) * 10;
        groups.push({
          id: `cat-${current.startIdx}`,
          name: current.name,
          lines: getCategoryLines(current.name),
          startDeg,
          endDeg,
          midDeg: (startDeg + endDeg) / 2,
          count: current.count
        });
        current = { name: sec.categoryName, startIdx: idx, count: 1 };
      }
    });

    const startDeg = current.startIdx * 10;
    const endDeg = (current.startIdx + current.count) * 10;
    groups.push({
      id: `cat-${current.startIdx}`,
      name: current.name,
      lines: getCategoryLines(current.name),
      startDeg,
      endDeg,
      midDeg: (startDeg + endDeg) / 2,
      count: current.count
    });

    return groups;
  }, [dataset.sectors]);

  // Method tracks metadata
  const tracks = useMemo(() => {
    return dataset.methods.map((method, idx) => {
      const outerR = rCondInner - idx * trackWidth;
      const innerR = rCondInner - (idx + 1) * trackWidth;
      const midR = (outerR + innerR) / 2;
      return { method, idx, outerR, innerR, midR };
    });
  }, [dataset.methods, trackWidth, rCondInner]);

  // Authentic theme colors matching physical wheel images
  const themePrimary = isIndia ? "#165b40" : "#00158a";
  const themeCategoryBg1 = isIndia ? "#165b40" : "#00158a";
  const themeCategoryBg2 = isIndia ? "#1b6849" : "#001c9e";
  const themeConditionBg = isIndia ? "#d4e6dd" : "#a2a8d3";
  const themeConditionText = isIndia ? "#0f3b2a" : "#00126b";
  const themeUpperTrackBg1 = isIndia ? "#dbe9e2" : "#dcd6ed";
  const themeUpperTrackBg2 = isIndia ? "#c8dfd5" : "#eae6f5";

  // Upper disc native path with 10-degree slot at 12 o'clock
  const upperDiscPath = useMemo(() => {
    return getUpperDiscPath(cx, cy, rCondInner, rHub);
  }, [cx, cy, rCondInner, rHub]);

  return (
    <svg
      viewBox="0 0 800 800"
      className="w-full h-full select-none"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Drop Shadows */}
        <filter id="mec-wheel-drop-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#000000" floodOpacity="0.25" />
        </filter>
        <filter id="upper-disc-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.2" />
        </filter>

        {/* Pivot metallic gradient */}
        <linearGradient id="pivot-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="45%" stopColor="#94a3b8" />
          <stop offset="70%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* Split cell gradients for India wheel */}
        <linearGradient id="split-blue-orange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="50%" stopColor="#1d63bf" />
          <stop offset="50%" stopColor="#f2722b" />
        </linearGradient>
        <linearGradient id="split-orange-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="50%" stopColor="#f2722b" />
          <stop offset="50%" stopColor="#d62828" />
        </linearGradient>
        <linearGradient id="split-green-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="50%" stopColor="#6eb634" />
          <stop offset="50%" stopColor="#1d63bf" />
        </linearGradient>

        {/* Text paths for concentric upper tracks: Left curves up to slot, Right curves down from slot */}
        {tracks.map(({ idx, midR }) => {
          const leftPath = createTextArcPath(cx, cy, midR - 1, 230, 353.5);
          const rightPath = createTextArcPath(cx, cy, midR - 1, 6.5, 130);
          return (
            <React.Fragment key={`paths-${idx}`}>
              <path id={`track-left-${idx}`} d={leftPath} fill="none" />
              <path id={`track-right-${idx}`} d={rightPath} fill="none" />
            </React.Fragment>
          );
        })}
      </defs>

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. ROTATING LOWER BASE WHEEL (Categories, Conditions, & Concentric Scores)
      ───────────────────────────────────────────────────────────────────────────── */}
      <g
        ref={wheelGroupRef}
        style={{
          transformOrigin: "400px 400px",
          transform: `rotate(${currentRotation}deg)`,
          transition: isDragging ? "none" : undefined
        }}
        filter="url(#mec-wheel-drop-shadow)"
      >
        {/* Outer Wheel Base Disc Background */}
        <circle cx={cx} cy={cy} r={rOuter} fill="#ffffff" stroke={themePrimary} strokeWidth="2.5" />

        {/* Concentric Method Track Background Rings for WHO */}
        {!isIndia &&
          tracks.map(({ idx, outerR, innerR }) => (
            <path
              key={`who-ring-${idx}`}
              d={`M ${cx - outerR} ${cy} A ${outerR} ${outerR} 0 1 0 ${cx + outerR} ${cy} A ${outerR} ${outerR} 0 1 0 ${cx - outerR} ${cy} M ${cx - innerR} ${cy} A ${innerR} ${innerR} 0 1 1 ${cx + innerR} ${cy} A ${innerR} ${innerR} 0 1 1 ${cx - innerR} ${cy}`}
              fill={idx % 2 === 0 ? "#ffffff" : "#f1eff9"}
              stroke="#cbd5e1"
              strokeWidth="0.75"
            />
          ))}

        {/* Category Ring Arcs on Outer Edge */}
        {categoryGroups.map((grp, gIdx) => {
          const pathD = createArcPath(cx, cy, rCatInner, rOuter, grp.startDeg, grp.endDeg);
          const bgFill = gIdx % 2 === 0 ? themeCategoryBg1 : themeCategoryBg2;

          // Compute font size to guarantee text never clips and fits comfortably in arc box
          const lineCount = grp.lines.length;
          let catFontSize = "13px";
          let spacing = 13.5;
          if (grp.count === 1) {
            if (grp.lines[0].length > 10) catFontSize = "10px";
            else if (grp.lines[0].length > 7) catFontSize = "11px";
            else catFontSize = "12px";
          } else if (lineCount === 1) {
            catFontSize = grp.lines[0].length > 10 ? "11.5px" : "13px";
          } else if (lineCount === 2) {
            catFontSize = "11px";
            spacing = 13;
          } else {
            catFontSize = "9.5px";
            spacing = 11.5;
          }

          const catMidR = (rOuter + rCatInner) / 2;

          return (
            <g key={grp.id}>
              {/* Outer Arc Wedge */}
              <path
                d={pathD}
                fill={bgFill}
                stroke="#ffffff"
                strokeWidth="1.2"
              />
              {/* Multi-Line Centered Category Text (Exact match to physical disc, zero clipping) */}
              <g transform={`rotate(${grp.midDeg}, ${cx}, ${cy})`}>
                <text
                  x={cx}
                  y={cy - catMidR}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#ffffff"
                  fontWeight="800"
                  fontSize={catFontSize}
                  letterSpacing="-0.01em"
                  className="pointer-events-none select-none"
                  style={{ fontFamily: "Arial, -apple-system, sans-serif" }}
                >
                  {grp.lines.map((line, lIdx) => {
                    const totalOffset = (lineCount - 1) * spacing * 0.5;
                    const dy = lIdx === 0 ? `-${totalOffset.toFixed(1)}px` : `${spacing.toFixed(1)}px`;
                    return (
                      <tspan key={lIdx} x={cx} dy={dy}>
                        {line}
                      </tspan>
                    );
                  })}
                </text>
              </g>
            </g>
          );
        })}

        {/* 36 Condition Sectors & Score Cells */}
        {dataset.sectors.map((sec) => {
          const startDeg = sec.sectorIndex * 10;
          const endDeg = (sec.sectorIndex + 1) * 10;
          const midDeg = startDeg + 5;
          const isSelected = activeSectorIndex === sec.sectorIndex;
          const isHighlighted = highlightedSectorIndex === sec.sectorIndex;

          const condPathD = createArcPath(cx, cy, rCondInner, rCatInner, startDeg, endDeg);

          // Condition sector background matching physical disc
          const sectorBg = isSelected
            ? (isIndia ? "#80b4c8" : "#8e98dd")
            : isHighlighted
            ? "#fbbf24"
            : themeConditionBg;

          // Formatted condition text lines matching physical disc
          const lines = getConditionLines(sec.conditionName, isIndia);
          const condMidR = (rCatInner + rCondInner) / 2;

          // Calibrated large font size matching Image 1
          let condFontSize = "13px";
          let lineSpacing = 13;
          if (lines.length === 1) {
            condFontSize = lines[0].length > 10 ? "12px" : "13.5px";
          } else if (lines.length === 2) {
            condFontSize = "11px";
            lineSpacing = 12;
          } else if (lines.length === 3) {
            condFontSize = "9.5px";
            lineSpacing = 10.5;
          } else {
            condFontSize = "8.2px";
            lineSpacing = 9.2;
          }

          return (
            <g
              key={sec.id}
              className="cursor-pointer"
              onClick={() => onSectorClick(sec.sectorIndex)}
            >
              {/* Condition Arc Wedge with prominent highlight when selected */}
              <path
                d={condPathD}
                fill={sectorBg}
                stroke={isSelected ? (isIndia ? "#06283d" : "#001050") : "#ffffff"}
                strokeWidth={isSelected ? "2" : "0.8"}
              >
                <title>{`${sec.categoryName}: ${sec.conditionName}`}</title>
              </path>

              {/* Condition Label: Clear, large, bold font perfectly matching Image 1 */}
              <g transform={`rotate(${midDeg}, ${cx}, ${cy})`}>
                <text
                  x={cx}
                  y={cy - condMidR}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isSelected ? (isIndia ? "#06283d" : "#001050") : themeConditionText}
                  fontWeight="800"
                  fontSize={condFontSize}
                  letterSpacing="-0.02em"
                  className="pointer-events-none select-none"
                  style={{
                    fontFamily: "Arial, -apple-system, sans-serif",
                    fontStretch: "condensed"
                  }}
                >
                  {lines.map((line, lIdx) => {
                    const totalOffset = (lines.length - 1) * lineSpacing * 0.5;
                    const dy = lIdx === 0 ? `-${totalOffset.toFixed(1)}px` : `${lineSpacing.toFixed(1)}px`;
                    return (
                      <tspan key={lIdx} x={cx} dy={dy}>
                        {line}
                      </tspan>
                    );
                  })}
                </text>
              </g>

              {/* Concentric Score Cells */}
              {tracks.map(({ method, outerR, innerR, midR }) => {
                const scoreObj = sec.scores.find((s) => s.methodId === method.id);
                const scoreStr = scoreObj?.score || "-";
                let { value, note } = parseScore(scoreStr);
                if (!note && scoreObj?.notes && scoreObj.notes.length > 0) {
                  note = scoreObj.notes[0];
                }
                const rawNum = value.split(/[\^/, -]/)[0].trim();

                if (isIndia) {
                  // INDIA WHEEL: Every cell is individually color-coded by category
                  const cellPath = createArcPath(cx, cy, innerR, outerR, startDeg, endDeg);
                  const cellFill = getIndiaCellColor(scoreStr);
                  return (
                    <g key={method.id}>
                      <path
                        d={cellPath}
                        fill={cellFill}
                        stroke="#ffffff"
                        strokeWidth="0.8"
                      />
                      <g transform={`rotate(${midDeg}, ${cx}, ${cy})`}>
                        <text
                          x={cx}
                          y={cy - midR}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#ffffff"
                          className="pointer-events-none select-none"
                          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
                        >
                          <tspan fontWeight="900" fontSize="13px">
                            {value}
                          </tspan>
                          {note && (
                            <tspan fontWeight="bold" fontSize="8.5px" dy="-5px">
                              {note}
                            </tspan>
                          )}
                        </text>
                      </g>
                    </g>
                  );
                } else {
                  // WHO WHEEL: Crisp navy score text with clinical footnotes on alternating lavender rings
                  const textColor =
                    rawNum === "4"
                      ? "#991b1b"
                      : rawNum === "3"
                      ? "#b45309"
                      : "#001050";

                  return (
                    <g key={method.id} transform={`rotate(${midDeg}, ${cx}, ${cy})`}>
                      <text
                        x={cx}
                        y={cy - midR}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={textColor}
                        className="pointer-events-none select-none"
                        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
                      >
                        <tspan fontWeight="900" fontSize="13px">
                          {value}
                        </tspan>
                        {note && (
                          <tspan fontWeight="bold" fontSize="8px" dy="-5px">
                            {note}
                          </tspan>
                        )}
                      </text>
                    </g>
                  );
                }
              })}
            </g>
          );
        })}

        {/* Center Hub Circle of Lower Wheel */}
        <circle cx={cx} cy={cy} r={rHub} fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      </g>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. UPPER STATIONARY COVER DISC (Viewing Slot at 12 o'clock, Method Labels)
      ───────────────────────────────────────────────────────────────────────────── */}
      <g filter="url(#upper-disc-shadow)" className="pointer-events-none">
        {/* Base Solid Medical White Disc with 10-degree slot opening at 12 o'clock */}
        <path
          d={upperDiscPath}
          fill="#ffffff"
          stroke={themePrimary}
          strokeWidth="2"
        />

        {/* Left & Right Concentric Band Arcs in Top Half */}
        {tracks.map(({ idx, outerR, innerR }) => {
          const bgFill = idx % 2 === 0 ? themeUpperTrackBg1 : themeUpperTrackBg2;
          const leftBandD = createArcPath(cx, cy, innerR, outerR, 230, 354.5);
          const rightBandD = createArcPath(cx, cy, innerR, outerR, 5.5, 130);
          return (
            <React.Fragment key={`bands-${idx}`}>
              <path d={leftBandD} fill={bgFill} stroke="#ffffff" strokeWidth="1" />
              <path d={rightBandD} fill={bgFill} stroke="#ffffff" strokeWidth="1" />
            </React.Fragment>
          );
        })}

        {/* Clean Frame Border around Cutout Viewing Slot */}
        <path
          d={createArcPath(cx, cy, rHub, rCondInner, 355, 360 + 5)}
          fill="none"
          stroke={themePrimary}
          strokeWidth="2.5"
        />

        {/* Method Names Curved along LEFT tracks (Full readable method names matching Image 1) */}
        {tracks.map(({ method, idx }) => {
          let leftLabel = method.name;
          if (isIndia) {
            if (idx === 0) leftLabel = "Combined pills and combined injectables (COCs & CiCs)";
            else if (idx === 1) leftLabel = "Centchroman pills";
            else if (idx === 2) leftLabel = "Progestogen-only pills (POPs)";
            else if (idx === 3) leftLabel = "DMPA & NET-EN";
            else if (idx === 4) leftLabel = "Implants";
            else if (idx === 5) leftLabel = "Copper IUCD";
            else if (idx === 6) leftLabel = "LNG-IUD";
          } else {
            if (idx === 0) leftLabel = "Combined hormonal contraceptives";
            else if (idx === 1) leftLabel = "Progestogen-only pills";
            else if (idx === 2) leftLabel = "Progestogen-only injectables";
            else if (idx === 3) leftLabel = "Implants";
            else if (idx === 4) leftLabel = "Levonorgestrel IUD";
            else if (idx === 5) leftLabel = "Copper IUD";
          }

          return (
            <text
              key={`left-text-${idx}`}
              fill={themePrimary}
              fontWeight="700"
              fontSize={idx === 0 ? "9.5px" : idx > 3 ? "10.5px" : "11px"}
              dy="3.5"
              style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              <textPath href={`#track-left-${idx}`} startOffset="98%" textAnchor="end">
                {leftLabel}
              </textPath>
            </text>
          );
        })}

        {/* Method Names Curved along RIGHT tracks (Full readable method names matching Image 1) */}
        {tracks.map(({ method, idx }) => {
          let rightLabel = method.name;
          if (isIndia) {
            if (idx === 0) rightLabel = "Combined pills and combined injectables (COCs & CiCs)";
            else if (idx === 1) rightLabel = "Centchroman pills";
            else if (idx === 2) rightLabel = "Progestogen-only pills (POPs)";
            else if (idx === 3) rightLabel = "DMPA & NET-EN";
            else if (idx === 4) rightLabel = "Implants";
            else if (idx === 5) rightLabel = "Copper IUCD";
            else if (idx === 6) rightLabel = "LNG-IUD";
          } else {
            if (idx === 0) rightLabel = "Pill, patch, ring, injectable (COC, P, CVR, CIC)";
            else if (idx === 1) rightLabel = "POP";
            else if (idx === 2) rightLabel = "DMPA (IM, SC) / NET-EN";
            else if (idx === 3) rightLabel = "LNG / ETG";
            else if (idx === 4) rightLabel = "LNG-IUD";
            else if (idx === 5) rightLabel = "Cu-IUD";
          }

          return (
            <text
              key={`right-text-${idx}`}
              fill={themePrimary}
              fontWeight="700"
              fontSize={idx === 0 ? "9.5px" : idx > 3 ? "10.5px" : "11px"}
              dy="3.5"
              style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              <textPath href={`#track-right-${idx}`} startOffset="2%" textAnchor="start">
                {rightLabel}
              </textPath>
            </text>
          );
        })}

        {/* Horizontal Divider Line Across Center */}
        <line
          x1={cx - rCondInner}
          y1={cy}
          x2={cx + rCondInner}
          y2={cy}
          stroke={themePrimary}
          strokeWidth="1.5"
        />

        {/* ─────────────────────────────────────────────────────────────────────────────
            3. LOWER HALF OF UPPER DISC (Authentic Category Legend, Title & Emblems)
        ───────────────────────────────────────────────────────────────────────────── */}
        <g transform={`translate(${cx}, ${cy})`} className="select-none">
          {/* Row 1: Cat 1 (left) and Cat 3 (right) */}
          <g transform="translate(0, 24)">
            {/* Category 1 */}
            <g transform="translate(-250, 0)">
              <circle cx="12" cy="12" r="11" fill={isIndia ? "#6eb634" : "#00158a"} />
              <text x="12" y="16" fill="#ffffff" textAnchor="middle" fontWeight="bold" fontSize="12px" style={{ fontFamily: "Arial, sans-serif" }}>
                1
              </text>
              <text x="30" y="10" fill={themePrimary} fontWeight="bold" fontSize="9px" style={{ fontFamily: "Arial, sans-serif" }}>
                Use the method in any
              </text>
              <text x="30" y="21" fill={themePrimary} fontWeight="bold" fontSize="9px" style={{ fontFamily: "Arial, sans-serif" }}>
                circumstance
              </text>
            </g>

            {/* Category 3 */}
            <g transform="translate(42, 0)">
              <circle cx="12" cy="12" r="11" fill={isIndia ? "#f2722b" : "#00158a"} />
              <text x="12" y="16" fill="#ffffff" textAnchor="middle" fontWeight="bold" fontSize="12px" style={{ fontFamily: "Arial, sans-serif" }}>
                3
              </text>
              <text x="30" y="7" fill={themePrimary} fontWeight="bold" fontSize="8.5px" style={{ fontFamily: "Arial, sans-serif" }}>
                Use of the method not usually
              </text>
              <text x="30" y="17" fill={themePrimary} fontWeight="bold" fontSize="8.5px" style={{ fontFamily: "Arial, sans-serif" }}>
                recommended unless other methods
              </text>
              <text x="30" y="27" fill={themePrimary} fontWeight="bold" fontSize="8.5px" style={{ fontFamily: "Arial, sans-serif" }}>
                unavailable or unacceptable
              </text>
            </g>
          </g>

          {/* Row 2: Cat 2 (left) and Cat 4 (right) */}
          <g transform="translate(0, 64)">
            {/* Category 2 */}
            <g transform="translate(-250, 0)">
              <circle cx="12" cy="12" r="11" fill={isIndia ? "#1d63bf" : "#00158a"} />
              <text x="12" y="16" fill="#ffffff" textAnchor="middle" fontWeight="bold" fontSize="12px" style={{ fontFamily: "Arial, sans-serif" }}>
                2
              </text>
              <text x="30" y="15" fill={themePrimary} fontWeight="bold" fontSize="9px" style={{ fontFamily: "Arial, sans-serif" }}>
                Generally use the method
              </text>
            </g>

            {/* Category 4 */}
            <g transform="translate(42, 0)">
              <circle cx="12" cy="12" r="11" fill={isIndia ? "#d62828" : "#00158a"} />
              <text x="12" y="16" fill="#ffffff" textAnchor="middle" fontWeight="bold" fontSize="12px" style={{ fontFamily: "Arial, sans-serif" }}>
                4
              </text>
              <text x="30" y="10" fill={themePrimary} fontWeight="bold" fontSize="9px" style={{ fontFamily: "Arial, sans-serif" }}>
                Method not to be used
              </text>
              <text x="30" y="21" fill={themePrimary} fontWeight="bold" fontSize="8.5px" style={{ fontFamily: "Arial, sans-serif" }}>
                (Unacceptable health risk)
              </text>
            </g>
          </g>

          {/* Disc Central Title & Attribution */}
          <g transform="translate(0, 126)">
            <text
              x="0"
              y="0"
              fill={themePrimary}
              textAnchor="middle"
              fontWeight="900"
              fontSize={isIndia ? "12px" : "11.5px"}
              letterSpacing="0.04em"
              style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              {isIndia ? "MEDICAL ELIGIBILITY CRITERIA WHEEL" : "WHO Medical Eligibility Criteria Wheel"}
            </text>
            <text
              x="0"
              y="13"
              fill={themePrimary}
              textAnchor="middle"
              fontWeight="700"
              fontSize={isIndia ? "10px" : "9.5px"}
              letterSpacing="0.02em"
              style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              {isIndia ? "FOR CONTRACEPTIVE USE" : "for contraceptive use, 2015"}
            </text>
            <text
              x="0"
              y="26"
              fill="#64748b"
              textAnchor="middle"
              fontWeight="600"
              fontSize="8px"
              style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              {isIndia ? "Ministry of Health and Family Welfare, Govt. of India (2022)" : "World Health Organization (WHO) • 5th Edition"}
            </text>
            {!isIndia && (
              <text
                x="0"
                y="37"
                fill="#64748b"
                textAnchor="middle"
                fontWeight="500"
                fontSize="6.8px"
                style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
              >
                These methods do not protect against STI/HIV. Dual condom protection recommended.
              </text>
            )}
          </g>
        </g>

        {/* Center Metallic Pivot Pin */}
        <circle cx={cx} cy={cy} r="18" fill="url(#pivot-gradient)" stroke="#1e293b" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="7" fill="#0f172a" />
      </g>
    </svg>
  );
}
