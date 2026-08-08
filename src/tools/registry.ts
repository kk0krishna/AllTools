import { ComponentType } from "react";

export interface ToolMetadata {
  name: string;
  description: string;
  category: string;
  slug: string;
  keywords: string[];
}

export interface ToolComponentProps {
  metadata: ToolMetadata;
}

export interface ToolEntry {
  metadata: ToolMetadata;
  component: ComponentType<ToolComponentProps>;
  content?: ComponentType<Record<string, unknown>>;
}

import { ageCalculatorEntry } from "./calculators/age-calculator/metadata";
import { bmiCalculatorEntry } from "./calculators/bmi-calculator/metadata";
import { jsonFormatterEntry } from "./developer/json-formatter/metadata";
import { qrCodeGeneratorEntry } from "./everyday/qr-code-generator/metadata";
import { audioSpectrumAnalyzerEntry } from "./audio/audio-spectrum-analyzer/metadata";
import { pregnancyCalculatorEntry } from "./obstetrics/pregnancy-calculator/metadata";
import { pregnancyTimelineEntry } from "./obstetrics/pregnancy-timeline/metadata";
import { eddReverseCalculatorEntry } from "./obstetrics/edd-reverse-calculator/metadata";
import { gestationalAgeCalculatorEntry } from "./obstetrics/gestational-age-calculator/metadata";
import { bishopScoreEntry } from "./obstetrics/bishop-score/metadata";
import { preeclampsiaRiskEntry } from "./obstetrics/preeclampsia-risk/metadata";

export const toolsRegistry: ToolEntry[] = [
  ageCalculatorEntry,
  bmiCalculatorEntry,
  jsonFormatterEntry,
  qrCodeGeneratorEntry,
  audioSpectrumAnalyzerEntry,
  pregnancyCalculatorEntry,
  pregnancyTimelineEntry,
  eddReverseCalculatorEntry,
  gestationalAgeCalculatorEntry,
  bishopScoreEntry,
  preeclampsiaRiskEntry,
];

export function getToolBySlug(category: string, slug: string): ToolEntry | undefined {
  return toolsRegistry.find(
    (tool) => tool.metadata.category === category && tool.metadata.slug === slug
  );
}

export function getAllTools(): ToolEntry[] {
  return toolsRegistry;
}
