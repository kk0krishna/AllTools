import { Requirement } from './presets';

export interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
  originalSizeKb: number;
}

export interface ValidationCheck {
  name: string;
  passed: boolean;
  actual: string;
  expected: string;
}

export interface ProcessResult {
  id: string;
  blob?: Blob;
  sizeKb?: number;
  width?: number;
  height?: number;
  format?: string;
  downloadName?: string;
  validation?: {
    valid: boolean;
    checks: ValidationCheck[];
  };
  fallbackUsed?: boolean;
  error?: string;
}

export interface ImageCropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const validateResult = (
  blob: Blob, 
  actualW: number, 
  actualH: number, 
  actualFormat: string, 
  req: Requirement
): { valid: boolean, checks: ValidationCheck[] } => {
  const checks: ValidationCheck[] = [];
  const sizeKb = Math.round(blob.size / 1024);

  // 1. Format
  checks.push({
    name: "Format",
    passed: actualFormat === req.format,
    actual: actualFormat.split('/')[1].toUpperCase(),
    expected: req.format.split('/')[1].toUpperCase()
  });

  // 2. Size
  if (req.maxKB) {
    checks.push({
      name: "File Size",
      passed: sizeKb <= req.maxKB,
      actual: `${sizeKb} KB`,
      expected: `≤ ${req.maxKB} KB`
    });
  }

  // 3. Dimensions
  if (req.width && req.height) {
    checks.push({
      name: "Dimensions",
      passed: actualW === req.width && actualH === req.height,
      actual: `${actualW} × ${actualH}`,
      expected: `${req.width} × ${req.height}`
    });
  } else if (req.width) {
     checks.push({
      name: "Width",
      passed: actualW === req.width,
      actual: `${actualW}px`,
      expected: `${req.width}px`
    });
  } else if (req.height) {
     checks.push({
      name: "Height",
      passed: actualH === req.height,
      actual: `${actualH}px`,
      expected: `${req.height}px`
    });
  }

  // 4. Aspect Ratio
  if (req.aspectRatio) {
    const actualAspect = actualW / actualH;
    // Allow small rounding tolerance for pixel math
    const passed = Math.abs(actualAspect - req.aspectRatio) < 0.02;
    checks.push({
      name: "Aspect Ratio",
      passed,
      actual: actualAspect.toFixed(2),
      expected: req.aspectRatio.toFixed(2)
    });
  }

  const valid = checks.every(c => c.passed);
  return { valid, checks };
};

export const processImage = async (
  imgFile: ImageFile, 
  req: Requirement,
  manualCrop?: ImageCropData
): Promise<ProcessResult> => {
  return new Promise(async (resolve, reject) => {
    let img: ImageBitmap | HTMLImageElement | HTMLCanvasElement;
    try {
      let sourceFile = imgFile.file;
      const fileType = sourceFile.type.toLowerCase();
      const fileName = sourceFile.name.toLowerCase();

      // 1. Lazy load HEIC decoder if needed
      if (fileType === 'image/heic' || fileType === 'image/heif' || fileName.endsWith('.heic') || fileName.endsWith('.heif')) {
        const heic2any = (await import('heic2any')).default;
        const converted = await heic2any({
          blob: sourceFile,
          toType: 'image/jpeg',
          quality: 0.9
        });
        sourceFile = (Array.isArray(converted) ? converted[0] : converted) as File;
      }

      // 2. Lazy load PDF rasterizer if needed
      if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        const pdfjsLib = await import('pdfjs-dist');
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        }
        const url = URL.createObjectURL(sourceFile);
        const pdf = await pdfjsLib.getDocument({ url }).promise;
        const page = await pdf.getPage(1); // Only process first page
        const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for crispness
        URL.revokeObjectURL(url);
        
        const pdfCanvas = document.createElement('canvas');
        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;
        const pdfCtx = pdfCanvas.getContext('2d');
        await page.render({ canvasContext: pdfCtx!, viewport } as any).promise;
        
        img = pdfCanvas;
      } else {
        // Guaranteed EXIF normalization in modern browsers for standard images
        img = await createImageBitmap(sourceFile, { imageOrientation: 'from-image' });
      }
    } catch (e) {
      // Fallback for formats not supported by createImageBitmap (e.g. SVG in some browsers)
      try {
        img = await new Promise<HTMLImageElement>((res, rej) => {
          const i = new Image();
          i.crossOrigin = 'anonymous';
          i.onload = () => res(i);
          i.onerror = rej;
          i.src = imgFile.previewUrl;
        });
      } catch (err) {
        return resolve({
          id: imgFile.id,
          error: "Failed to process image. It may be corrupt or an unsupported format."
        });
      }
    }

    const imgWidth = img instanceof HTMLImageElement ? img.naturalWidth : img.width;
    const imgHeight = img instanceof HTMLImageElement ? img.naturalHeight : img.height;
    
    let sx = 0, sy = 0, sWidth = imgWidth, sHeight = imgHeight;
    
    if (manualCrop && manualCrop.width > 0 && manualCrop.height > 0) {
       // UI provided explicit absolute image crop coordinates
       sx = manualCrop.x;
       sy = manualCrop.y;
       sWidth = manualCrop.width;
       sHeight = manualCrop.height;
    } 
    else if (req.width && req.height) {
      // AUTO CROP-TO-FIT
      const targetW = req.width;
      const targetH = req.height;
      const targetAspect = targetW / targetH;
      const imgAspect = imgWidth / imgHeight;

      if (imgAspect > targetAspect) {
        sHeight = imgHeight;
        sWidth = sHeight * targetAspect;
        sx = (imgWidth - sWidth) / 2;
      } else {
        sWidth = imgWidth;
        sHeight = sWidth / targetAspect;
        sy = (imgHeight - sHeight) / 2;
      }
    }

      // Determine Destination Size
      let dWidth = req.width ? req.width : sWidth;
      let dHeight = req.height ? req.height : sHeight;

      if (!req.width && req.height) {
        dWidth = Math.round(dHeight * (sWidth / sHeight));
      } else if (!req.height && req.width) {
        dHeight = Math.round(dWidth / (sWidth / sHeight));
      }

      // Initial Canvas
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('No 2d context'));
      canvas.width = dWidth;
      canvas.height = dHeight;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);

      let finalBlob: Blob | null = null;
      let finalW = dWidth;
      let finalH = dHeight;
      let fallbackUsed = false;

      if (req.format === 'application/pdf') {
        const jsPDF = (await import('jspdf')).default;
        const pdf = new jsPDF({
          orientation: dWidth > dHeight ? 'landscape' : 'portrait',
          unit: 'px',
          format: [dWidth, dHeight]
        });
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, dWidth, dHeight);
        finalBlob = pdf.output('blob');
      } 
      else if (req.maxKB && (req.format === 'image/jpeg' || req.format === 'image/webp')) {
        // AGGRESSIVE TARGET-KB SOLVER
        const targetBytes = req.maxKB * 1024;
        let attempts = 0;
        let currentScale = 1.0;
        
        while (attempts < 5) {
          let minQ = 0.05, maxQ = 1.0, bestBlobForThisScale: Blob | null = null;
          
          // Binary search quality at current dimensions
          for (let i = 0; i < 6; i++) {
            const quality = (minQ + maxQ) / 2;
            const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, req.format, quality));
            if (!blob) break;
            
            if (blob.size <= targetBytes) {
              bestBlobForThisScale = blob;
              minQ = quality; // Try for better quality
            } else {
              maxQ = quality; // Need lower quality
            }
          }

          if (bestBlobForThisScale) {
            // Success! We found a valid quality at this dimension
            finalBlob = bestBlobForThisScale;
            break;
          } else {
            // Failed. Quality reduction wasn't enough. Must scale down physically.
            attempts++;
            fallbackUsed = true;
            currentScale *= 0.85; // Reduce area by ~25%
            
            finalW = Math.max(1, Math.floor(dWidth * currentScale));
            finalH = Math.max(1, Math.floor(dHeight * currentScale));
            
            if (finalW < 10 || finalH < 10) break; // Hard limit

            // Redraw onto smaller canvas
            const newCanvas = document.createElement('canvas');
            const newCtx = newCanvas.getContext('2d');
            newCanvas.width = finalW;
            newCanvas.height = finalH;
            newCtx!.imageSmoothingEnabled = true;
            newCtx!.imageSmoothingQuality = 'high';
            // Draw from ORIGINAL source coordinates to maintain crispness, rather than scaling a canvas
            newCtx!.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, finalW, finalH);
            
            canvas = newCanvas; // Update canvas for next quality loop
          }
        }
        
        if (!finalBlob) {
          // Absolute worst case fallback (should rarely happen with loop)
          finalBlob = await new Promise<Blob>(r => canvas.toBlob(b => r(b!), req.format, 0.1));
        }

      } 
      else {
        // No strict KB limit
        finalBlob = await new Promise<Blob>(r => canvas.toBlob(b => r(b!), req.format, 0.92));
      }

      const ext = req.format === 'application/pdf' ? 'pdf' : req.format.split('/')[1];
      const originalNameWithoutExt = imgFile.file.name.replace(/\.[^/.]+$/, "");
      const originalNameFull = imgFile.file.name;
      
      let newName = `ready_${originalNameWithoutExt}.${ext}`;
      
      if (req.filenamePattern) {
        newName = req.filenamePattern
          .replace(/{name}/g, originalNameWithoutExt)
          .replace(/{original}/g, originalNameFull)
          .replace(/{width}/g, String(finalW))
          .replace(/{height}/g, String(finalH))
          .replace(/{format}/g, ext);
      }

      const validation = validateResult(finalBlob!, finalW, finalH, req.format, req);

      resolve({
        id: imgFile.id,
        blob: finalBlob!,
        sizeKb: Math.round(finalBlob!.size / 1024),
        width: finalW,
        height: finalH,
        format: req.format,
        downloadName: newName,
        validation,
        fallbackUsed
      });
  });
};
