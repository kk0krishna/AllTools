import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; // CRITICAL: Fixes missing crop handles and preview
import { useRef, useState, useEffect } from "react";
import { Requirement } from "../presets";
import { ImageFile, ImageCropData } from "../engine";

interface CropEditorProps {
  selectedFile: ImageFile;
  req: Requirement;
  manualCropData?: ImageCropData;
  showApplyToAll?: boolean;
  applyToAll?: boolean;
  onToggleApplyToAll?: () => void;
  onUpdateCrop: (cropData: ImageCropData | undefined) => void;
}

export function CropEditor({ selectedFile, req, manualCropData, showApplyToAll, applyToAll, onToggleApplyToAll, onUpdateCrop }: CropEditorProps) {
  const [tempCrop, setTempCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

  // If selected file changes, reset temp crop
  useEffect(() => {
    setTempCrop(undefined);
  }, [selectedFile.id]);

  let cropAspect: number | undefined = undefined;
  if (req.width && req.height) {
    cropAspect = req.width / req.height;
  } else if (req.aspectRatio) {
    cropAspect = req.aspectRatio;
  }

  const onCropComplete = (c: PixelCrop) => {
    if (imgRef.current && c.width > 0 && c.height > 0) {
      // Convert UI pixel crop to absolute image pixels
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      const absoluteCrop: ImageCropData = {
        x: c.x * scaleX,
        y: c.y * scaleY,
        width: c.width * scaleX,
        height: c.height * scaleY
      };
      onUpdateCrop(absoluteCrop);
    }
  }

  return (
    <Card className="border-2 shadow-sm overflow-hidden border-border/50 animate-in fade-in">
      <div className="bg-muted/30 px-4 sm:px-6 py-4 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h3 className="text-base sm:text-lg font-bold">2. Adjust Crop (Optional)</h3>
          {showApplyToAll && (
            <div className="flex items-center space-x-2 sm:border-l sm:pl-4">
              <Switch 
                id="apply-all" 
                checked={applyToAll} 
                onCheckedChange={onToggleApplyToAll}
              />
              <Label htmlFor="apply-all" className="text-sm cursor-pointer">Apply to all images</Label>
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => { setTempCrop(undefined); onUpdateCrop(undefined); }} className="h-7 text-xs w-fit">
          Clear Custom Crop
        </Button>
      </div>
      <CardContent className="p-0 bg-black/5 flex items-center justify-center min-h-[250px] sm:min-h-[300px]">
          <ReactCrop
            crop={tempCrop}
            aspect={cropAspect}
            onChange={(_, percentCrop) => setTempCrop(percentCrop)}
            onComplete={onCropComplete}
            className="max-h-[400px] w-full flex justify-center"
          >
            <img 
              ref={imgRef}
              src={selectedFile.previewUrl} 
              className="max-h-[400px] object-contain shadow-2xl mx-auto"
              alt="Crop preview"
              onLoad={() => {
                // If a user has a saved crop for this file, we could re-render it here by converting absolute to relative
                // But for simplicity, we just let them start fresh if they switch tabs.
              }}
            />
          </ReactCrop>
      </CardContent>
    </Card>
  );
}
