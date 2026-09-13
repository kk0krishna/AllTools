import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings2, CheckCircle2, Share } from "lucide-react";
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
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'general' | 'passports' | 'exams'>('passports');

  const handleShare = () => {
    try {
      const encoded = btoa(JSON.stringify(req));
      const url = `${window.location.origin}${window.location.pathname}?preset=${encoded}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to share preset", e);
    }
  };

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
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            {/* Main Format Converter Option */}
            <Button 
              variant="outline" 
              className="w-full h-auto py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/40 transition-all shadow-sm group" 
              onClick={() => onSelectPreset('converter')}
            >
              <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">{PRESETS['converter'].icon}</span>
              <div className="text-center sm:text-left">
                <span className="font-bold text-lg sm:text-xl text-primary block">{PRESETS['converter'].label}</span>
                <span className="text-xs sm:text-sm text-muted-foreground mt-1 block">Convert images to JPG, PNG, WEBP, AVIF, PDF, and more</span>
              </div>
            </Button>

            <div className="flex items-center gap-4">
              <div className="h-px bg-border flex-1"></div>
              <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Or choose specific requirements</span>
              <div className="h-px bg-border flex-1"></div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2 p-1 bg-muted/40 rounded-xl w-full sm:w-fit overflow-x-auto scrollbar-none">
                <button 
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex-shrink-0 ${activeCategory === 'passports' ? 'bg-background shadow-sm text-foreground ring-1 ring-border' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}`}
                  onClick={() => setActiveCategory('passports')}
                >Passports & Visas</button>
                <button 
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex-shrink-0 ${activeCategory === 'exams' ? 'bg-background shadow-sm text-foreground ring-1 ring-border' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}`}
                  onClick={() => setActiveCategory('exams')}
                >Exams & Forms</button>
                <button 
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex-shrink-0 ${activeCategory === 'general' ? 'bg-background shadow-sm text-foreground ring-1 ring-border' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}`}
                  onClick={() => setActiveCategory('general')}
                >General Purpose</button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {Object.values(PRESETS).filter(p => p.category === activeCategory && p.id !== 'converter').map(p => (
                    <Button key={p.id} variant="outline" className="h-auto py-4 sm:py-6 px-2 sm:px-4 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all hover:scale-[1.02]" onClick={() => onSelectPreset(p.id)}>
                      <span className="text-2xl sm:text-3xl">{p.icon}</span>
                      <span className="font-semibold text-xs sm:text-sm text-wrap text-center leading-tight">{p.label}</span>
                    </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-right-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => onSelectPreset(null)} className="h-8 px-2 text-muted-foreground hover:text-foreground">← Back</Button>
                <h4 className="font-bold text-lg flex items-center">
                  <span className="text-xl mr-2">{PRESETS[presetId].icon}</span> {PRESETS[presetId].label}
                </h4>
              </div>
              {PRESETS[presetId].authority && (
                <div className="flex w-fit items-center text-xs font-semibold bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full border border-green-500/20 sm:ml-2">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Verified by {PRESETS[presetId].authority}
                </div>
              )}
            </div>

            <div className="bg-primary/5 rounded-xl p-4 sm:p-5 border border-primary/10">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
                <h4 className="font-bold text-sm text-primary tracking-wide">YOUR REQUIREMENTS</h4>
                <div className="flex flex-row flex-wrap gap-2">
                  <Button variant="ghost" size="sm" className="h-8 text-xs font-medium bg-background/50 hover:bg-background border shadow-sm" onClick={handleShare}>
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-500" /> : <Share className="w-3.5 h-3.5 mr-1.5"/>}
                    {copied ? "Copied Link!" : "Share Preset"}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-xs font-medium bg-background/50 hover:bg-background border shadow-sm" onClick={() => setShowAdvanced(!showAdvanced)}>
                    <Settings2 className="w-3.5 h-3.5 mr-1.5"/> {showAdvanced ? "Hide Details" : "Edit Details"}
                  </Button>
                </div>
              </div>
              
              {showAdvanced ? (
                <div className="flex flex-wrap gap-4 animate-in fade-in">
                  <div className="space-y-1.5 flex-1 min-w-[160px]">
                    <Label className="text-xs font-semibold text-muted-foreground flex items-center">Target Format</Label>
                    <select 
                      value={req.format} 
                      onChange={e => onChangeReq({ format: e.target.value })} 
                      className="w-full text-sm font-medium bg-background border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none shadow-sm cursor-pointer"
                    >
                      <optgroup label="Popular">
                        <option value="image/jpeg">JPG / JPEG</option>
                        <option value="image/png">PNG</option>
                        <option value="image/webp">WEBP</option>
                        <option value="application/pdf">PDF</option>
                      </optgroup>
                      <optgroup label="Advanced">
                        <option value="image/avif">AVIF</option>
                        <option value="image/gif">GIF</option>
                        <option value="image/bmp">BMP</option>
                        <option value="image/tiff">TIFF</option>
                        <option value="image/x-icon">ICO</option>
                      </optgroup>
                    </select>
                  </div>
                  <div className="space-y-1.5 w-full sm:w-[140px]">
                    <Label className="text-xs font-semibold text-muted-foreground flex items-center">Max Size (KB)</Label>
                    <Input 
                      className="h-[38px] text-sm font-medium bg-background shadow-sm" 
                      type="number" 
                      placeholder="No limit" 
                      value={req.maxKB || ""} 
                      onChange={e => onChangeReq({ maxKB: e.target.value ? parseFloat(e.target.value) : undefined })} 
                      disabled={!['image/jpeg', 'image/webp', 'image/avif'].includes(req.format)} 
                    />
                  </div>
                  <div className="space-y-1.5 w-full sm:w-[120px]">
                    <Label className="text-xs font-semibold text-muted-foreground">Width (px)</Label>
                    <Input 
                      className="h-[38px] text-sm font-medium bg-background shadow-sm" 
                      type="number" 
                      placeholder="Auto" 
                      value={req.width || ""} 
                      onChange={e => onChangeReq({ width: e.target.value ? parseInt(e.target.value) : undefined })} 
                    />
                  </div>
                  <div className="space-y-1.5 w-full sm:w-[120px]">
                    <Label className="text-xs font-semibold text-muted-foreground">Height (px)</Label>
                    <Input 
                      className="h-[38px] text-sm font-medium bg-background shadow-sm" 
                      type="number" 
                      placeholder="Auto" 
                      value={req.height || ""} 
                      onChange={e => onChangeReq({ height: e.target.value ? parseInt(e.target.value) : undefined })} 
                    />
                  </div>
                  <div className="space-y-1.5 w-full mt-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Custom Filename Pattern</Label>
                    <Input 
                      className="h-[38px] text-sm font-medium bg-background shadow-sm" 
                      placeholder="e.g. ready_{name}.{format}" 
                      value={req.filenamePattern || ""} 
                      onChange={e => onChangeReq({ filenamePattern: e.target.value || undefined })} 
                    />
                    <p className="text-[11px] text-muted-foreground pl-1 mt-1">Available tags: {'{name}, {original}, {width}, {height}, {format}'}</p>
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
