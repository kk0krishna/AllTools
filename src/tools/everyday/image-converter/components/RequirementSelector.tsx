import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings2, CheckCircle2 } from "lucide-react";
import { PRESETS, Requirement } from "../presets";
import { useState, useEffect } from "react";

interface RequirementSelectorProps {
  presetId: string | null;
  onSelectPreset: (id: string | null) => void;
  req: Requirement;
  onChangeReq: (updates: Partial<Requirement>) => void;
}

export function RequirementSelector({ presetId, onSelectPreset, req, onChangeReq }: RequirementSelectorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (presetId === 'custom') {
      setShowAdvanced(true);
    } else {
      setShowAdvanced(false);
    }
  }, [presetId]);

  return (
    <Card className="border-2 shadow-sm overflow-hidden border-border/50 animate-in fade-in">
      <div className="bg-muted/30 px-4 sm:px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold">1. Choose what you need</h3>
      </div>
      
      <CardContent className="p-4 sm:p-6 space-y-6">
        {!presetId ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 animate-in zoom-in-95">
            {Object.values(PRESETS).map(p => (
                <Button key={p.id} variant="outline" className="h-auto py-4 sm:py-6 px-2 sm:px-4 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5" onClick={() => onSelectPreset(p.id)}>
                  <span className="text-2xl sm:text-3xl">{p.icon}</span>
                  <span className="font-semibold text-xs sm:text-sm">{p.label}</span>
                </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-right-4">
            <div className="flex items-center gap-3 mb-2">
              <Button variant="ghost" size="sm" onClick={() => onSelectPreset(null)} className="h-8 px-2 text-muted-foreground hover:text-foreground">← Back</Button>
              <h4 className="font-bold text-lg flex items-center">
                <span className="text-xl mr-2">{PRESETS[presetId].icon}</span> {PRESETS[presetId].label}
              </h4>
            </div>

            <div className="bg-primary/5 rounded-xl p-4 sm:p-5 border border-primary/10">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <h4 className="font-bold text-sm text-primary tracking-wide">YOUR REQUIREMENTS</h4>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground w-fit" onClick={() => setShowAdvanced(!showAdvanced)}>
                  <Settings2 className="w-3 h-3 mr-1"/> {showAdvanced ? "Hide Details" : "Edit Details"}
                </Button>
              </div>
              
              {showAdvanced ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 animate-in fade-in">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground flex items-center">Format</Label>
                    <select 
                      value={req.format} 
                      onChange={e => onChangeReq({ format: e.target.value })} 
                      className="w-full text-sm font-medium bg-background border rounded-md px-2 py-1.5 focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="image/jpeg">JPG</option>
                      <option value="image/png">PNG</option>
                      <option value="image/webp">WEBP</option>
                      <option value="application/pdf">PDF</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground flex items-center">Max KB</Label>
                    <Input 
                      className="h-8 text-sm font-medium bg-background" 
                      type="number" 
                      placeholder="No limit" 
                      value={req.maxKB || ""} 
                      onChange={e => onChangeReq({ maxKB: e.target.value ? parseFloat(e.target.value) : undefined })} 
                      disabled={req.format === 'image/png' || req.format === 'application/pdf'} 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground">Exact Width (px)</Label>
                    <Input 
                      className="h-8 text-sm font-medium bg-background" 
                      type="number" 
                      placeholder="Original" 
                      value={req.width || ""} 
                      onChange={e => onChangeReq({ width: e.target.value ? parseInt(e.target.value) : undefined })} 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground">Exact Height (px)</Label>
                    <Input 
                      className="h-8 text-sm font-medium bg-background" 
                      type="number" 
                      placeholder="Original" 
                      value={req.height || ""} 
                      onChange={e => onChangeReq({ height: e.target.value ? parseInt(e.target.value) : undefined })} 
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <div className="flex items-center text-xs sm:text-sm font-semibold bg-background px-3 py-1.5 rounded-full border shadow-sm text-foreground">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1.5 sm:mr-2"/> Format: {req.format.split('/')[1].toUpperCase()}
                  </div>
                  <div className="flex items-center text-xs sm:text-sm font-semibold bg-background px-3 py-1.5 rounded-full border shadow-sm text-foreground">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1.5 sm:mr-2"/> Max Size: {req.maxKB ? `${req.maxKB} KB` : 'Original'}
                  </div>
                  <div className="flex items-center text-xs sm:text-sm font-semibold bg-background px-3 py-1.5 rounded-full border shadow-sm text-foreground">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1.5 sm:mr-2"/> Dims: {req.width || req.height ? `${req.width || 'Original'} × ${req.height || 'Original'} px` : 'Original'}
                  </div>
                </div>
              )}
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-4 italic">
                * If exact dimensions are set, we intelligently center-crop the image to fit without stretching.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
