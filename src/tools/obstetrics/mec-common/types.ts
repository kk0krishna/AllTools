export type MecCategoryScore = "1" | "2" | "3" | "4" | "1/2" | "2/3" | "3/4" | "1/4" | "NA" | "C" | "D" | "S";

export interface MecMethodDefinition {
  id: string;
  name: string;
  shortName: string;
  type: "hormonal" | "non-hormonal" | "barrier" | "permanent" | "behavioral";
  description: string;
  indiaBrandNames?: string[];
  administration: string;
  typicalFailureRate: string;
  perfectFailureRate: string;
  duration?: string;
  mechanism: string;
  advantages: string[];
  disadvantages: string[];
  initiationGuidelines: {
    routine: string;
    postpartumBreastfeeding: string;
    postpartumNonBreastfeeding: string;
    postAbortion: string;
    emergencyBackupNeeded: boolean;
    backupDuration?: string;
  };
}

export interface MecSectorData {
  id: string;
  sectorIndex: number; // 0 to 35 (10 deg each)
  categoryName: string;
  conditionName: string;
  subCondition?: string;
  startAngle: number; // in degrees
  endAngle: number;
  // Array of scores corresponding to each method track (outer to inner)
  scores: {
    methodId: string;
    score: string; // e.g. "1", "2", "3", "4", "2-3", "3/4", "1-2"
    notes?: string[]; // footnotes e.g. ["A", "Z"]
    clarification?: string;
  }[];
}

export interface MecClinicalNote {
  code: string;
  title?: string;
  text: string;
  appliesToMethods?: string[];
}

export interface MecDataset {
  wheelId: "who-mec-2015" | "india-mec-2022";
  title: string;
  subtitle: string;
  edition: string;
  organization: string;
  primaryColor: string;
  accentColor: string;
  bgGradient: string;
  lowerWheelImage: string;
  upperWheelImage: string;
  methods: MecMethodDefinition[];
  sectors: MecSectorData[];
  notes: Record<string, MecClinicalNote>;
  safeConditions: {
    reproductive: string[];
    medical: string[];
    other: string[];
  };
  emergencyContraception?: {
    conditions: {
      condition: string;
      cuIud: string;
      coc?: string;
      lng: string;
      upa?: string;
      notes?: string;
    }[];
    guidanceNotes: string[];
  };
  antiretroviralInteractions?: {
    drugClass: string;
    abbreviation: string;
    drugs: string[];
    chcScore: string;
    popScore: string;
    dmpaScore: string;
    implantsScore: string;
    lngIudScore: string;
    cuIudScore: string;
    notes?: string;
  }[];
  sterilizationGuidelines?: {
    female: {
      category: "A" | "C" | "D" | "S";
      meaning: string;
      conditions: string[];
    }[];
    male: {
      category: "A" | "C" | "D" | "S";
      meaning: string;
      conditions: string[];
    }[];
  };
}
