export interface Requirement {
  format: string;
  minKB?: number;
  maxKB?: number;
  width?: number;
  height?: number;
  aspectRatio?: number;
  resizeMode?: "fit" | "fill" | "stretch" | "crop";
  background?: "keep" | "white" | "black" | "transparent";
  filenamePattern?: string;
  removeMetadata?: boolean;
}

export interface PresetDef {
  id: string;
  label: string;
  icon: string;
  category: "general" | "passports" | "exams";
  authority?: string;
  verifiedAt?: string;
  reqs?: Requirement;
}

export const PRESETS: Record<string, PresetDef> = {
  // General
  converter: { 
    id: 'converter', 
    label: 'Format Converter', 
    icon: '🔄', 
    category: 'general',
    reqs: { format: 'image/jpeg' } 
  },
  custom: { id: 'custom', label: 'Custom', icon: '⚙️', category: 'general' },
  signature: { 
    id: 'signature', 
    label: 'Signature', 
    icon: '✍️', 
    category: 'general',
    reqs: { format: 'image/jpeg', maxKB: 20, width: 400, height: 150, aspectRatio: 400/150 } 
  },
  document: { 
    id: 'document', 
    label: 'Document', 
    icon: '📄', 
    category: 'general',
    reqs: { format: 'image/jpeg', maxKB: 300, width: 800, height: 1000 } 
  },
  
  // Passports & Visas
  us_passport: { 
    id: 'us_passport', 
    label: 'US Passport / Visa', 
    icon: '🇺🇸', 
    category: 'passports',
    authority: 'US Department of State',
    verifiedAt: '2026-09-13',
    reqs: { format: 'image/jpeg', maxKB: 240, width: 600, height: 600, aspectRatio: 1, filenamePattern: 'passport_{name}.{format}' } 
  },
  uk_passport: { 
    id: 'uk_passport', 
    label: 'UK Passport', 
    icon: '🇬🇧', 
    category: 'passports',
    authority: 'HM Passport Office',
    verifiedAt: '2026-09-13',
    reqs: { format: 'image/jpeg', minKB: 50, maxKB: 250, width: 600, height: 750, aspectRatio: 600/750, filenamePattern: 'passport_{name}.{format}' } 
  },
  schengen_visa: {
    id: 'schengen_visa',
    label: 'Schengen Visa',
    icon: '🇪🇺',
    category: 'passports',
    authority: 'European Union',
    verifiedAt: '2026-09-13',
    reqs: { format: 'image/jpeg', maxKB: 300, width: 413, height: 531, aspectRatio: 413/531 }
  },
  india_pan: {
    id: 'india_pan',
    label: 'India PAN Card',
    icon: '🇮🇳',
    category: 'passports',
    authority: 'NSDL / UTIITSL',
    verifiedAt: '2026-09-13',
    reqs: { format: 'image/jpeg', maxKB: 50, width: 213, height: 213, aspectRatio: 1 }
  },

  // Exams & Applications
  neet_photo: {
    id: 'neet_photo',
    label: 'NEET Photo (India)',
    icon: '📝',
    category: 'exams',
    authority: 'NTA NEET',
    verifiedAt: '2026-09-13',
    reqs: { format: 'image/jpeg', maxKB: 200, minKB: 10, width: 350, height: 450, aspectRatio: 350/450, removeMetadata: true }
  },
  neet_signature: {
    id: 'neet_signature',
    label: 'NEET Signature',
    icon: '🖋️',
    category: 'exams',
    authority: 'NTA NEET',
    verifiedAt: '2026-09-13',
    reqs: { format: 'image/jpeg', maxKB: 30, minKB: 4, width: 400, height: 200, aspectRatio: 400/200 }
  },
  jee_photo: {
    id: 'jee_photo',
    label: 'JEE Main Photo',
    icon: '💻',
    category: 'exams',
    authority: 'NTA JEE',
    verifiedAt: '2026-09-13',
    reqs: { format: 'image/jpeg', maxKB: 200, minKB: 10, width: 350, height: 450, aspectRatio: 350/450 }
  }
};
