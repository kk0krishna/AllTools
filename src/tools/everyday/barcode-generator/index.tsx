"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Barcode from "react-barcode";

export function BarcodeGenerator() {
  const [value, setValue] = useState("123456789012");
  const [format, setFormat] = useState("CODE128");
  const [lineColor, setLineColor] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const svgRef = useRef<HTMLDivElement>(null);

  const downloadBarcode = () => {
    const svg = svgRef.current?.querySelector("svg");
    if (!svg) return;
    
    // Convert SVG to Canvas to PNG
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
      downloadLink.download = `barcode-${value}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="value">Barcode Value</Label>
              <Input 
                id="value" 
                type="text" 
                placeholder="Enter text or numbers"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="format">Barcode Format</Label>
              <select 
                id="format"
                value={format} 
                onChange={(e) => setFormat(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="CODE128">CODE128</option>
                <option value="CODE39">CODE39</option>
                <option value="EAN13">EAN13</option>
                <option value="EAN8">EAN8</option>
                <option value="UPC">UPC</option>
                <option value="ITF14">ITF14</option>
                <option value="MSI">MSI</option>
                <option value="pharmacode">Pharmacode</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lineColor">Line Color</Label>
              <Input 
                id="lineColor" 
                type="color" 
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                className="h-10 cursor-pointer"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="background">Background Color</Label>
              <Input 
                id="background" 
                type="color" 
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="h-10 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-xl space-y-6 overflow-hidden">
            <div ref={svgRef} className="bg-white p-4 rounded-xl shadow-sm overflow-x-auto max-w-full">
              {value ? (
                <Barcode 
                  value={value} 
                  format={format as any} 
                  lineColor={lineColor}
                  background={background}
                  renderer="svg"
                />
              ) : (
                <div className="text-muted-foreground p-8 text-center">
                  Enter a value to generate barcode
                </div>
              )}
            </div>
            <Button onClick={downloadBarcode} className="w-full max-w-xs" disabled={!value}>
              Download PNG
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
