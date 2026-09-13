import * as pdfjsLib from 'pdfjs-dist';
import jsPDF from 'jspdf';

// Set worker source for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

export interface PDFFile {
  id: string;
  file: File;
  originalSizeKb: number;
}

export interface PDFRequirement {
  maxKB?: number;
  compressionLevel?: 'low' | 'medium' | 'high'; // low = high quality, high = low quality
}

export interface PDFProcessResult {
  id: string;
  blob?: Blob;
  sizeKb?: number;
  downloadName?: string;
  error?: string;
  valid?: boolean;
}

export const processPDF = async (
  pdfFile: PDFFile,
  req: PDFRequirement
): Promise<PDFProcessResult> => {
  try {
    const arrayBuffer = await pdfFile.file.arrayBuffer();
    const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdfDocument.numPages;

    let targetKB = req.maxKB;
    // Default compression levels if maxKB is not provided
    let quality = 0.8;
    let scale = 1.5;

    if (req.compressionLevel === 'high') {
      quality = 0.4;
      scale = 1.0;
    } else if (req.compressionLevel === 'medium') {
      quality = 0.6;
      scale = 1.25;
    }

    if (targetKB) {
       // Estimate needed scale based on target KB
       const averagePageTargetKB = targetKB / numPages;
       if (averagePageTargetKB < 50) {
         scale = 1.0;
         quality = 0.4;
       } else if (averagePageTargetKB < 150) {
         scale = 1.25;
         quality = 0.6;
       } else {
         scale = 1.5;
         quality = 0.8;
       }
    }

    const doc = new jsPDF({ unit: 'px', compress: true });

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error("Could not create canvas context");
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext: any = {
        canvasContext: context,
        viewport: viewport,
        canvas: canvas
      };

      await page.render(renderContext).promise;

      const imgData = canvas.toDataURL('image/jpeg', quality);

      if (pageNum === 1) {
        // First page defines doc orientation and size
        doc.deletePage(1);
        doc.addPage([viewport.width, viewport.height], viewport.width > viewport.height ? 'landscape' : 'portrait');
      } else {
        doc.addPage([viewport.width, viewport.height], viewport.width > viewport.height ? 'landscape' : 'portrait');
      }

      doc.addImage(imgData, 'JPEG', 0, 0, viewport.width, viewport.height);
    }

    const finalBlob = doc.output('blob');
    const finalSizeKb = Math.round(finalBlob.size / 1024);

    let valid = true;
    if (targetKB && finalSizeKb > targetKB) {
      valid = false;
    }

    const originalName = pdfFile.file.name.replace(/\.[^/.]+$/, "");

    return {
      id: pdfFile.id,
      blob: finalBlob,
      sizeKb: finalSizeKb,
      downloadName: `compressed_${originalName}.pdf`,
      valid: valid
    };

  } catch (error: any) {
    console.error("PDF Processing Error:", error);
    return {
      id: pdfFile.id,
      error: error.message || "Failed to process PDF. It may be encrypted or corrupted."
    };
  }
};
