export interface Requirement {
  format: string;
  maxKB?: number;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

export interface PresetDef {
  id: string;
  label: string;
  icon: string;
  reqs?: Requirement;
}

export const PRESETS: Record<string, PresetDef> = {
  custom: { id: 'custom', label: 'Custom', icon: '⚙️' },
  passport: { 
    id: 'passport', 
    label: 'Form Photo', 
    icon: '🪪', 
    reqs: { format: 'image/jpeg', maxKB: 50, width: 413, height: 531, aspectRatio: 413/531 } 
  },
  signature: { 
    id: 'signature', 
    label: 'Signature', 
    icon: '✍️', 
    reqs: { format: 'image/jpeg', maxKB: 20, width: 400, height: 150, aspectRatio: 400/150 } 
  },
  document: { 
    id: 'document', 
    label: 'Document', 
    icon: '📄', 
    reqs: { format: 'image/jpeg', maxKB: 300, width: 800, height: 1000 } 
  }
};
