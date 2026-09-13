import jsPDF from "jspdf";
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
  blob: Blob;
  sizeKb: number;
  width: number;
  height: number;
  format: string;
  downloadName: string;
  validation: {
    valid: boolean;
    checks: ValidationCheck[];
  };
  fallbackUsed: boolean;
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
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      
      let sx = 0, sy = 0, sWidth = img.naturalWidth, sHeight = img.naturalHeight;
      
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
        const imgAspect = img.naturalWidth / img.naturalHeight;

        if (imgAspect > targetAspect) {
          sHeight = img.naturalHeight;
          sWidth = sHeight * targetAspect;
          sx = (img.naturalWidth - sWidth) / 2;
        } else {
          sWidth = img.naturalWidth;
          sHeight = sWidth / targetAspect;
          sy = (img.naturalHeight - sHeight) / 2;
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
      const originalName = imgFile.file.name.replace(/\.[^/.]+$/, "");
      const newName = `ready_${originalName}.${ext}`;

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
    };
    img.onerror = reject;
    img.src = imgFile.previewUrl;
  });
};
