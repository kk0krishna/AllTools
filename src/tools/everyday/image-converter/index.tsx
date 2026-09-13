"use client";

import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { PRESETS, Requirement } from "./presets";
import { ImageFile, ProcessResult, processImage, ImageCropData } from "./engine";
import { UploadZone } from "./components/UploadZone";
import { RequirementSelector } from "./components/RequirementSelector";
import { CropEditor } from "./components/CropEditor";
import { ResultsPanel } from "./components/ResultsPanel";

export function ImageConverterTool() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessResult[]>([]);
  
  // UX Mode
  const [presetId, setPresetId] = useState<string | null>(null);

  // Requirements State (Unified)
  const [req, setReq] = useState<Requirement>({ format: "image/jpeg" });

  // Manual Interactive Crop (Applies to currently selected image only)
  const [manualCrops, setManualCrops] = useState<Record<string, ImageCropData>>({});

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: ImageFile[] = Array.from(e.target.files).map(f => ({
        id: Math.random().toString(36).substring(7),
        file: f,
        previewUrl: URL.createObjectURL(f),
        originalSizeKb: Math.round(f.size / 1024)
      }));
      setFiles(prev => [...prev, ...newFiles]);
      if (!selectedFileId) setSelectedFileId(newFiles[0].id);
      setResults([]); 
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (selectedFileId === id) {
      const remaining = files.filter(f => f.id !== id);
      setSelectedFileId(remaining.length > 0 ? remaining[0].id : null);
    }
    setResults(prev => prev.filter(r => r.id !== id));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResults([]);

    try {
      const processed: ProcessResult[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await processImage(
          file, 
          req,
          manualCrops[file.id]
        );
        processed.push(res);
      }
      setResults(processed);
      window.setTimeout(() => {
         window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (e) {
      console.error(e);
      alert("An error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAll = async () => {
    if (results.length === 1) {
      saveAs(results[0].blob, results[0].downloadName);
    } else if (results.length > 1) {
      const zip = new JSZip();
      results.forEach((r, i) => {
        const uniqueName = r.downloadName.replace(/\.([^.]+)$/, `_${i + 1}.$1`);
        zip.file(uniqueName, r.blob);
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
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-24 px-4 sm:px-6 lg:px-8">
      
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
                <Button 
                  className="w-full h-16 sm:h-20 text-xl sm:text-2xl font-black rounded-xl sm:rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]" 
                  onClick={handleProcess} 
                  disabled={isProcessing}
                >
                  {isProcessing ? "PROCESSING..." : (
                    <>MAKE READY <ArrowRight className="ml-2 sm:ml-3 w-6 h-6 sm:w-8 sm:h-8" /></>
                  )}
                </Button>
                {files.length > 1 && (
                  <p className="text-center text-xs sm:text-sm font-medium text-muted-foreground mt-3 sm:mt-4">
                    Will intelligently apply these requirements to all {files.length} images.
                  </p>
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
        />
      )}
    </div>
  );
}
