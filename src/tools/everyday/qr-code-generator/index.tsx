"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

export function QRCodeGenerator() {
  const [url, setUrl] = useState("https://alltools-cb86e.web.app");

  const downloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qrcode.png";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">URL or Text</Label>
            <Input 
              id="url" 
              type="text" 
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-xl space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <QRCodeSVG 
                id="qr-code-svg"
                value={url || "https://alltools-cb86e.web.app"} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <Button onClick={downloadQR} className="w-full" disabled={!url}>
              Download PNG
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
