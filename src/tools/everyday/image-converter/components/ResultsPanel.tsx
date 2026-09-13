import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, XCircle, ArrowRight, Download } from "lucide-react";
import { ProcessResult, ImageFile } from "../engine";

interface ResultsPanelProps {
  results: ProcessResult[];
  selectedFile: ImageFile;
  selectedResult: ProcessResult;
  onEditAgain: () => void;
  onDownloadAll: () => void;
  onRetryFailed?: () => void;
}

export function ResultsPanel({ results, selectedFile, selectedResult, onEditAgain, onDownloadAll, onRetryFailed }: ResultsPanelProps) {
  if (selectedResult.error) {
    return (
      <div className="animate-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center mb-6">
          <Button variant="outline" onClick={onEditAgain} className="rounded-full font-semibold shadow-sm text-xs sm:text-sm">
            ← Edit Requirements Again
          </Button>
        </div>
        <Card className="border-4 border-red-500 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-5">
            <XCircle className="w-32 h-32 sm:w-48 sm:h-48 text-red-500" />
          </div>
          <div className="bg-red-500 p-4 sm:p-6 text-white text-center">
             <h3 className="text-xl sm:text-3xl font-black flex items-center justify-center tracking-tight">
                <AlertCircle className="mr-2 sm:mr-3 w-6 h-6 sm:w-8 sm:h-8" /> PROCESSING FAILED
             </h3>
          </div>
          <CardContent className="p-4 sm:p-8 relative z-10 bg-background text-center flex flex-col items-center justify-center min-h-[200px]">
             <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
             <p className="font-bold text-lg mb-2">Could not process this file</p>
             <p className="text-muted-foreground">{selectedResult.error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isValid = selectedResult.validation?.valid ?? false;
  const checks = selectedResult.validation?.checks ?? [];
  const failedCount = results.filter(r => r.error || !(r.validation?.valid ?? false)).length;

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-700">
      
      <div className="flex justify-center mb-6">
        <Button variant="outline" onClick={onEditAgain} className="rounded-full font-semibold shadow-sm text-xs sm:text-sm">
          ← Edit Requirements Again
        </Button>
      </div>

      {selectedResult.fallbackUsed && (
        <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-900 p-4 sm:p-5 rounded-r-xl shadow-sm mb-6 flex flex-col sm:flex-row items-start">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 sm:mr-4 shrink-0 mt-0.5 text-amber-500 mb-2 sm:mb-0" />
          <div>
            <p className="font-bold text-sm sm:text-base mb-1">Dimensions slightly reduced</p>
            <p className="text-xs sm:text-sm">We had to shrink the image slightly to preserve acceptable visual quality while meeting your strict KB limit.</p>
          </div>
        </div>
      )}

      <Card className={`border-4 ${isValid ? 'border-green-500' : 'border-red-500'} shadow-2xl overflow-hidden relative transition-colors`}>
        <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-5">
          {isValid ? <CheckCircle2 className="w-32 h-32 sm:w-48 sm:h-48 text-green-500" /> : <XCircle className="w-32 h-32 sm:w-48 sm:h-48 text-red-500" />}
        </div>
        
        <div className={`${isValid ? 'bg-green-500' : 'bg-red-500'} p-4 sm:p-6 text-white text-center transition-colors`}>
           <h3 className="text-xl sm:text-3xl font-black flex items-center justify-center tracking-tight">
            {isValid ? (
              <><CheckCircle2 className="mr-2 sm:mr-3 w-6 h-6 sm:w-8 sm:h-8" /> READY TO UPLOAD</>
            ) : (
              <><AlertCircle className="mr-2 sm:mr-3 w-6 h-6 sm:w-8 sm:h-8" /> NEEDS ADJUSTMENT</>
            )}
          </h3>
        </div>

        <CardContent className="p-4 sm:p-8 grid md:grid-cols-2 gap-8 sm:gap-12 relative z-10 bg-gradient-to-b from-muted/30 to-background">
          
          {/* Factual Checklist */}
          <div className="space-y-4 sm:space-y-6">
            <h4 className={`font-bold text-xs sm:text-sm ${isValid ? 'text-green-700' : 'text-red-700'} uppercase tracking-widest`}>
              {isValid ? 'Requirements Met' : 'Requirements Failed'}
            </h4>
            
            <div className="space-y-3 sm:space-y-4">
              {checks.map((check, i) => (
                 <div key={i} className={`flex items-start text-sm sm:text-base font-semibold bg-background p-3 rounded-xl shadow-sm border ${check.passed ? 'border-green-100' : 'border-red-200'}`}>
                   <div className={`${check.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} p-1 sm:p-1.5 rounded-full mr-3 shrink-0`}>
                     {check.passed ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                   </div> 
                   <div>
                     <p className="text-foreground">{check.name}: {check.actual}</p>
                     {!check.passed && <p className="text-xs text-red-500 mt-1">Required: {check.expected}</p>}
                   </div>
                 </div>
              ))}
            </div>
          </div>

          {/* Savings & Download */}
          <div className="space-y-6 sm:space-y-8 flex flex-col justify-center">
             <div className="flex flex-row items-center justify-center gap-4 sm:gap-8 bg-background p-4 sm:p-6 rounded-2xl shadow-sm border border-border/50 text-center">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 sm:mb-2">Original</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-400 line-through decoration-2">{selectedFile.originalSizeKb} KB</p>
                </div>
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/30" />
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-green-600 uppercase tracking-widest mb-1 sm:mb-2">Processed</p>
                  <p className={`text-2xl sm:text-4xl font-black ${isValid ? 'text-green-600' : 'text-amber-500'}`}>
                    {selectedResult.sizeKb} KB
                  </p>
                  {isValid && selectedFile.originalSizeKb > (selectedResult.sizeKb || 0) && (
                     <p className="text-[10px] sm:text-xs font-bold text-green-700 mt-1 sm:mt-2">
                       Saved {Math.round((1 - (selectedResult.sizeKb || 0) / selectedFile.originalSizeKb) * 100)}%
                     </p>
                  )}
                </div>
             </div>
            
            <div className="flex flex-col gap-3 w-full">
              <Button 
                 size="lg" 
                 onClick={onDownloadAll} 
                 className={`w-full h-14 sm:h-16 text-lg sm:text-xl rounded-xl font-bold shadow-lg text-white transition-all hover:scale-[1.02] active:scale-[0.98] ${isValid ? 'bg-green-600 hover:bg-green-700' : 'bg-muted-foreground hover:bg-muted-foreground/80'}`}
              >
                <Download className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" /> 
                {results.length > 1 ? `Download All (${results.length} files)` : 'Download Result'}
              </Button>
              {failedCount > 0 && onRetryFailed && (
                <Button 
                   size="lg" 
                   variant="outline"
                   onClick={onRetryFailed} 
                   className="w-full h-14 sm:h-16 text-lg sm:text-xl rounded-xl font-bold border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <AlertCircle className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" /> 
                  Retry {failedCount} Failed
                </Button>
              )}
            </div>
            {!isValid && (
               <p className="text-xs text-center text-red-500 font-medium">Warning: This file does not meet your requirements.</p>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
