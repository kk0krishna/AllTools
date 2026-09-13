"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, FileText, ArrowRight, Download, CheckCircle2, AlertCircle, XCircle, Trash2, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { processPDF, PDFFile, PDFProcessResult, PDFRequirement } from "./engine";
import { saveAs } from "file-saver";
import JSZip from "jszip";

export function PDFCompressorTool() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [results, setResults] = useState<PDFProcessResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [req, setReq] = useState<PDFRequirement>({ compressionLevel: 'medium' });
  const [customKB, setCustomKB] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: PDFFile[] = Array.from(e.target.files).map(f => ({
        id: Math.random().toString(36).substring(7),
        file: f,
        originalSizeKb: Math.round(f.size / 1024)
      }));
      setFiles(prev => [...prev, ...newFiles]);
      setResults([]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setResults(prev => prev.filter(r => r.id !== id));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResults([]);

    try {
      const processed: PDFProcessResult[] = [];
      for (const file of files) {
        const currentReq = { ...req };
        if (customKB && !isNaN(Number(customKB))) {
          currentReq.maxKB = Number(customKB);
        } else {
          currentReq.maxKB = undefined;
        }

        const res = await processPDF(file, currentReq);
        processed.push(res);
      }
      setResults(processed);
      window.setTimeout(() => {
         window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
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
      saveAs(zipBlob, "compressed_pdfs.zip");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      
      <div className="text-center space-y-6 pt-8">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight flex justify-center items-center gap-3">
            <FileText className="w-10 h-10 text-primary" /> PDF Compressor
          </h1>
          <p className="text-xl text-muted-foreground font-medium px-4">Compress and rasterize PDFs to specific KB limits.</p>
        </div>

        <Label className="flex flex-col items-center justify-center w-full h-40 border-4 border-dashed border-primary/20 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group shadow-sm">
          <Upload className="w-12 h-12 text-primary/60 mb-4 group-hover:text-primary transition-colors" />
          <span className="text-lg font-semibold text-foreground">Drop PDF files here</span>
          <span className="text-sm text-muted-foreground mt-1">or click to browse</span>
          <input type="file" multiple accept="application/pdf" className="hidden" onChange={handleFileChange} />
        </Label>
        
        <p className="text-xs text-muted-foreground font-medium flex justify-center items-center gap-1">
          🔒 Processed entirely securely in your browser. Files never leave your device.
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-500">
          
          <div className="bg-muted/30 rounded-2xl p-4 sm:p-6 border">
            <h3 className="font-bold mb-4">Selected Files ({files.length})</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
              {files.map(f => (
                <div key={f.id} className="flex items-center justify-between bg-background p-3 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-6 h-6 text-red-500 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="font-medium text-sm truncate">{f.file.name}</p>
                      <p className="text-xs text-muted-foreground">{f.originalSizeKb} KB</p>
                    </div>
                  </div>
                  <button onClick={() => removeFile(f.id)} className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
               <Label className="cursor-pointer text-sm font-semibold text-primary flex items-center gap-2 hover:underline">
                 <FilePlus className="w-4 h-4" /> Add more PDFs
                 <input type="file" multiple accept="application/pdf" className="hidden" onChange={handleFileChange} />
               </Label>
            </div>
          </div>

          {!results.length && (
            <Card className="border-2 shadow-xl bg-gradient-to-b from-card to-muted/20">
              <div className="p-6 border-b bg-muted/30">
                <h3 className="text-xl font-bold">Compression Settings</h3>
              </div>
              <CardContent className="p-6 space-y-6">
                
                <div className="grid grid-cols-3 gap-4">
                  {(['low', 'medium', 'high'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => { setReq({ compressionLevel: level }); setCustomKB(''); }}
                      className={`p-4 rounded-xl border-2 font-bold capitalize transition-all ${req.compressionLevel === level && !customKB ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'}`}
                    >
                      {level} Compression
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-px bg-border flex-1" />
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">OR Target Max KB</span>
                  <div className="h-px bg-border flex-1" />
                </div>

                <div>
                  <Label className="font-bold mb-2 block">Maximum File Size (KB)</Label>
                  <input 
                    type="number" 
                    placeholder="e.g. 500" 
                    value={customKB}
                    onChange={(e) => { setCustomKB(e.target.value); setReq({ compressionLevel: undefined }); }}
                    className="w-full p-4 border-2 rounded-xl bg-background font-bold text-lg"
                  />
                  <p className="text-xs text-muted-foreground mt-2 font-medium">Note: Targeting specific KB limits rasterizes the PDF to images. Text will not be selectable.</p>
                </div>

                <Button 
                  className="w-full h-16 text-xl font-black rounded-xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-6" 
                  onClick={handleProcess} 
                  disabled={isProcessing}
                >
                  {isProcessing ? "COMPRESSING..." : (
                    <>COMPRESS {files.length} FILE{files.length > 1 ? 'S' : ''} <ArrowRight className="ml-3 w-6 h-6" /></>
                  )}
                </Button>

              </CardContent>
            </Card>
          )}

        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 pt-8">
           <div className="flex justify-center mb-6">
            <Button variant="outline" onClick={() => setResults([])} className="rounded-full font-semibold shadow-sm">
              ← Change Settings
            </Button>
          </div>

          <div className="space-y-4">
            {results.map((res, i) => {
              const file = files.find(f => f.id === res.id)!;
              
              if (res.error) {
                return (
                  <Card key={i} className="border-2 border-red-500 overflow-hidden">
                    <div className="bg-red-500 p-3 text-white font-bold flex items-center gap-2">
                      <XCircle className="w-5 h-5" /> FAILED: {file.file.name}
                    </div>
                    <div className="p-4 bg-background">
                      <p className="text-red-500 text-sm font-medium">{res.error}</p>
                    </div>
                  </Card>
                );
              }

              return (
                <Card key={i} className={`border-2 ${res.valid ? 'border-green-500' : 'border-amber-500'} overflow-hidden`}>
                  <div className={`${res.valid ? 'bg-green-500' : 'bg-amber-500'} p-3 text-white font-bold flex items-center justify-between`}>
                    <div className="flex items-center gap-2 truncate pr-4">
                      {res.valid ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />} 
                      <span className="truncate">{file.file.name}</span>
                    </div>
                    <span className="shrink-0">{res.sizeKb} KB</span>
                  </div>
                  <div className="p-4 bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-center">
                       <div>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Original</p>
                         <p className="text-lg font-bold text-red-400 line-through decoration-2">{file.originalSizeKb} KB</p>
                       </div>
                       <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                       <div>
                         <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Compressed</p>
                         <p className={`text-xl font-black ${res.valid ? 'text-green-600' : 'text-amber-500'}`}>
                           {res.sizeKb} KB
                         </p>
                       </div>
                    </div>
                    <Button 
                      onClick={() => saveAs(res.blob!, res.downloadName)}
                      variant={res.valid ? "default" : "secondary"}
                      className="font-bold"
                    >
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="pt-4">
            <Button 
                size="lg" 
                onClick={downloadAll} 
                className="w-full h-16 text-xl rounded-xl font-bold shadow-lg"
            >
              <Download className="mr-3 w-6 h-6" /> 
              {results.length > 1 ? `Download All (${results.length} files)` : 'Download Result'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
