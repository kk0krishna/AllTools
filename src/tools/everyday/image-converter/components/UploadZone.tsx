import { Upload, ShieldCheck, ImagePlus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ImageFile } from "../engine";

interface UploadZoneProps {
  files: ImageFile[];
  selectedFileId: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectFile: (id: string) => void;
  onRemoveFile: (id: string) => void;
}

export function UploadZone({ files, selectedFileId, onFileChange, onSelectFile, onRemoveFile }: UploadZoneProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero & Dropzone */}
      <div className="text-center space-y-4 sm:space-y-6 pt-4 sm:pt-8">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight flex justify-center items-center gap-2 sm:gap-3">
            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-primary" /> UPLOADREADY
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground font-medium px-4">Make any file fit the requirement.</p>
        </div>

        <Label className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-4 border-dashed border-primary/20 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group shadow-sm">
          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-primary/60 mb-2 sm:mb-4 group-hover:text-primary transition-colors" />
          <span className="text-base sm:text-lg font-semibold text-foreground">Drop files here</span>
          <span className="text-xs sm:text-sm text-muted-foreground mt-1">or click to browse</span>
          <input type="file" multiple accept="image/*" className="hidden" onChange={onFileChange} />
        </Label>
        
        <p className="text-xs text-muted-foreground font-medium flex justify-center items-center gap-1">
          🔒 Private by design · Processed securely in your browser
        </p>
      </div>

      {files.length > 0 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin animate-in fade-in">
          {files.map(f => (
            <div 
              key={f.id} 
              className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${selectedFileId === f.id ? 'border-primary ring-2 ring-primary/30 shadow-md scale-105' : 'border-border opacity-60 hover:opacity-100 hover:scale-100'}`}
              onClick={() => onSelectFile(f.id)}
            >
              <img src={f.previewUrl} className="w-full h-full object-cover" />
              <button 
                className="absolute top-1 right-1 bg-background/80 hover:bg-red-500 hover:text-white text-muted-foreground rounded-full p-1 backdrop-blur-sm transition-colors"
                onClick={(e) => { e.stopPropagation(); onRemoveFile(f.id); }}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          <Label className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
            <ImagePlus className="w-5 h-5 sm:w-6 sm:h-6" />
            <input type="file" multiple accept="image/*" className="hidden" onChange={onFileChange} />
          </Label>
        </div>
      )}
    </div>
  );
}
