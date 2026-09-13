"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { PRESETS, Requirement } from "./presets";
import { ImageFile, ProcessResult, processImage, ImageCropData } from "./engine";
import { UploadZone } from "./components/UploadZone";
import { RequirementSelector } from "./components/RequirementSelector";
import { CropEditor } from "./components/CropEditor";
import { ResultsPanel } from "./components/ResultsPanel";

export interface ImageConverterProps {
  initialReq?: Requirement;
  metadata?: any;
}

function ImageConverterContent({ initialReq }: ImageConverterProps) {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<{
    total: number;
    current: number;
    passed: number;
    failed: number;
  } | null>(null);
  const [results, setResults] = useState<ProcessResult[]>([]);
  
  // UX Mode
  const [presetId, setPresetId] = useState<string | null>(initialReq ? 'custom' : null);

  // Requirements State (Unified)
  const [req, setReq] = useState<Requirement>(initialReq || { format: "image/jpeg" });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [sharedPreset, setSharedPreset] = useState<Requirement | null>(null);

  useEffect(() => {
    const presetParam = searchParams.get('preset');
    if (presetParam) {
      try {
        const decoded = JSON.parse(atob(presetParam));
        if (decoded && decoded.format) {
          setSharedPreset(decoded);
        }
      } catch (e) {
        console.error("Failed to parse preset from URL", e);
      }
    }
  }, [searchParams]);

  // Manual Interactive Crop (Applies to currently selected image only)
  const [manualCrops, setManualCrops] = useState<Record<string, ImageCropData>>({});
  const [applyCropToAll, setApplyCropToAll] = useState(false); // NEW for batch crop semantics

  // Cleanup Object URLs to prevent memory leaks
  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach(f => URL.revokeObjectURL(f.previewUrl));
    };
  }, []);

  const handleSelectPreset = (id: string | null) => {
    setPresetId(id);
    if (id && PRESETS[id]?.reqs) {
      setReq({ ...PRESETS[id].reqs! });
    } else {
      setReq({ format: "image/jpeg" });
    }
  };

  const handleUpdateReq = (updates: Partial<Requirement>) => {
    setReq(prev => ({ ...prev, ...updates }));
  };

  const addFiles = async (fileList: File[]) => {
    if (fileList.length > 0) {
      setIsProcessing(true);
      const newFiles: ImageFile[] = [];
      for (const f of fileList) {
        let finalFile = f;
        const nameLower = f.name.toLowerCase();
        if (nameLower.endsWith('.heic') || nameLower.endsWith('.heif')) {
          try {
            const heic2any = (await import('heic2any')).default;
            const converted = await heic2any({
              blob: f,
              toType: "image/jpeg",
              quality: 0.9
            });
            const blob = Array.isArray(converted) ? converted[0] : converted;
            finalFile = new File([blob], f.name.replace(/\.heic|\.heif/i, '.jpg'), { type: 'image/jpeg' });
          } catch(err) {
            console.error("HEIC conversion failed", err);
          }
        }
        newFiles.push({
          id: Math.random().toString(36).substring(7),
          file: finalFile,
          previewUrl: URL.createObjectURL(finalFile),
          originalSizeKb: Math.round(finalFile.size / 1024)
        });
      }
      setFiles(prev => [...prev, ...newFiles]);
      setSelectedFileId(prev => prev || (newFiles.length > 0 ? newFiles[0].id : null));
      setResults([]); 
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files) {
        const pastedFiles = Array.from(e.clipboardData.files).filter(f => f.type.startsWith("image/"));
        if (pastedFiles.length > 0) {
           addFiles(pastedFiles);
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter(f => f.id !== id);
    });
    if (selectedFileId === id) {
      const remaining = files.filter(f => f.id !== id);
      setSelectedFileId(remaining.length > 0 ? remaining[0].id : null);
    }
    setResults(prev => prev.filter(r => r.id !== id));
  };

  const handleProcess = async (targetFileIds?: string[]) => {
    const filesToProcess = targetFileIds ? files.filter(f => targetFileIds.includes(f.id)) : files;
    if (filesToProcess.length === 0) return;
    
    setIsProcessing(true);
    if (!targetFileIds) setResults([]);
    
    setProcessingProgress({ total: filesToProcess.length, current: 0, passed: 0, failed: 0 });

    try {
      const newResults: ProcessResult[] = [];
      let passed = 0;
      let failed = 0;

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        const cropToUse = applyCropToAll && selectedFileId
          ? manualCrops[selectedFileId]
          : manualCrops[file.id];
          
        const res = await processImage(
          file, 
          req,
          cropToUse
        );
        newResults.push(res);

        const isValid = res.validation?.valid ?? false;
        if (isValid) passed++;
        else failed++;

        setProcessingProgress({ total: filesToProcess.length, current: i + 1, passed, failed });
        // Yield to UI thread to render progress
        await new Promise(r => setTimeout(r, 0));
      }
      
      if (targetFileIds) {
        setResults(prev => {
          const next = [...prev];
          newResults.forEach(nr => {
            const idx = next.findIndex(r => r.id === nr.id);
            if (idx >= 0) next[idx] = nr;
            else next.push(nr);
          });
          return next;
        });
      } else {
        setResults(newResults);
      }
      
      window.setTimeout(() => {
         window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (e) {
      console.error("An unexpected error occurred during processing:", e);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(null);
    }
  };

  const handleRetryFailed = () => {
    const failedIds = results.filter(r => r.error || !(r.validation?.valid ?? false)).map(r => r.id);
    if (failedIds.length > 0) {
      handleProcess(failedIds);
    }
  };

  const downloadAll = async () => {
    const successfulResults = results.filter(r => !r.error && r.blob && r.downloadName);
    if (successfulResults.length === 1) {
      saveAs(successfulResults[0].blob!, successfulResults[0].downloadName);
    } else if (successfulResults.length > 1) {
      const zip = new JSZip();
      successfulResults.forEach((r, i) => {
        const uniqueName = r.downloadName!.replace(/\.([^.]+)$/, `_${i + 1}.$1`);
        zip.file(uniqueName, r.blob!);
      });
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "upload_ready_images.zip");
    }
  };

  const selectedFile = files.find(f => f.id === selectedFileId);
  const selectedResult = results.find(r => r.id === selectedFileId);

  const showCropEditor = Boolean(
    selectedFile && presetId && (req.width || req.height || req.aspectRatio || presetId === 'custom')
  );

  return (
    <div className={`mx-auto space-y-8 pb-32 transition-all duration-500 ${showCropEditor ? 'max-w-6xl' : 'max-w-3xl'}`}>
      
      {sharedPreset && (
        <div className="bg-primary/10 border-2 border-primary rounded-xl p-6 shadow-md animate-in slide-in-from-top-4">
          <h3 className="text-xl font-black text-primary flex items-center mb-2">
            <CheckCircle2 className="w-6 h-6 mr-2" /> Shared Preset Detected!
          </h3>
          <p className="text-sm font-medium mb-4">Someone shared a custom image requirement preset with you.</p>
          <div className="bg-background rounded-lg p-3 mb-4 shadow-sm text-sm grid gap-2">
            <div><strong>Format:</strong> {sharedPreset.format.split('/')[1].toUpperCase()}</div>
            {sharedPreset.maxKB && <div><strong>Max Size:</strong> {sharedPreset.maxKB} KB</div>}
            {(sharedPreset.width || sharedPreset.height) && <div><strong>Dimensions:</strong> {sharedPreset.width || 'Original'} × {sharedPreset.height || 'Original'} px</div>}
          </div>
          <div className="flex gap-3">
            <Button onClick={() => {
               setReq(sharedPreset);
               setPresetId('custom');
               setSharedPreset(null);
               router.replace(pathname);
            }}>Apply Preset</Button>
            <Button variant="outline" onClick={() => {
               setSharedPreset(null);
               router.replace(pathname);
            }}>Dismiss</Button>
          </div>
        </div>
      )}

      <UploadZone 
        files={files} 
        selectedFileId={selectedFileId}
        onFileChange={handleFileChange}
        onSelectFile={setSelectedFileId}
        onRemoveFile={removeFile}
      />

      {files.length > 0 && !results.length && (
        <div className={`grid grid-cols-1 ${showCropEditor ? 'lg:grid-cols-2' : ''} gap-6 sm:gap-8 animate-in slide-in-from-bottom-8 fade-in duration-500`}>
          
          {/* Left Column (or full width if no crop editor) */}
          <div className="space-y-6 sm:space-y-8 flex flex-col">
            <RequirementSelector 
              presetId={presetId}
              onSelectPreset={handleSelectPreset}
              req={req}
              onChangeReq={handleUpdateReq}
            />

            {presetId && (
              <div className="pt-2 sm:pt-4 mt-auto">
                {isProcessing && processingProgress ? (
                  <div className="w-full h-auto min-h-20 sm:min-h-24 bg-card border-2 shadow-sm rounded-xl p-4 flex flex-col justify-center animate-in fade-in zoom-in-95">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-sm">Processing {processingProgress.current} / {processingProgress.total} files...</span>
                      <span className="text-xs font-semibold">{Math.round((processingProgress.current / processingProgress.total) * 100)}%</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden mb-3">
                      <div 
                        className="h-full bg-primary transition-all duration-200 ease-out" 
                        style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-green-600 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1"/> {processingProgress.passed} ready</span>
                      <span className="text-amber-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> {processingProgress.failed} failed</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button 
                      className="w-full h-16 sm:h-20 text-xl sm:text-2xl font-black rounded-xl sm:rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]" 
                      onClick={() => handleProcess()} 
                      disabled={isProcessing}
                    >
                      MAKE READY <ArrowRight className="ml-2 sm:ml-3 w-6 h-6 sm:w-8 sm:h-8" />
                    </Button>
                    {files.length > 1 && (
                      <p className="text-center text-xs sm:text-sm font-medium text-muted-foreground mt-3 sm:mt-4">
                        Will apply requirements to all {files.length} images.
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Column (Crop Editor) */}
          {showCropEditor && (
            <div className="h-full">
              <CropEditor 
                selectedFile={selectedFile!}
                req={req}
                manualCropData={manualCrops[selectedFile!.id]}
                showApplyToAll={files.length > 1}
                applyToAll={applyCropToAll}
                onToggleApplyToAll={() => setApplyCropToAll(!applyCropToAll)}
                onUpdateCrop={(data) => {
                  setManualCrops(prev => {
                    const newCrops = { ...prev };
                    if (data) {
                      newCrops[selectedFile!.id] = data;
                    } else {
                      delete newCrops[selectedFile!.id];
                    }
                    return newCrops;
                  });
                }}
              />
            </div>
          )}

        </div>
      )}

      {results.length > 0 && selectedFile && selectedResult && (
        <ResultsPanel 
          results={results}
          selectedFile={selectedFile}
          selectedResult={selectedResult}
          onEditAgain={() => setResults([])}
          onDownloadAll={downloadAll}
          onRetryFailed={handleRetryFailed}
        />
      )}
    </div>
  );
}

export function ImageConverterTool({ initialReq }: ImageConverterProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center animate-pulse">Loading image tool...</div>}>
      <ImageConverterContent initialReq={initialReq} />
    </Suspense>
  );
}
