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
  content?: ComponentType<any>;
}

import { ageCalculatorEntry } from "./calculators/age-calculator/metadata";
import { jsonFormatterEntry } from "./developer/json-formatter/metadata";
import { qrCodeGeneratorEntry } from "./everyday/qr-code-generator/metadata";

export const toolsRegistry: ToolEntry[] = [
  ageCalculatorEntry,
  jsonFormatterEntry,
  qrCodeGeneratorEntry,
];

export function getToolBySlug(category: string, slug: string): ToolEntry | undefined {
  return toolsRegistry.find(
    (tool) => tool.metadata.category === category && tool.metadata.slug === slug
  );
}

export function getAllTools(): ToolEntry[] {
  return toolsRegistry;
}
