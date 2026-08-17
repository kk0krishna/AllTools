"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Type, Smile, DownloadCloud, UploadCloud } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import EmojiPicker from "emoji-picker-react";

type Tab = "image" | "text" | "emoji";
type Shape = "square" | "circle" | "rounded";

export function FaviconGenerator() {
  const [activeTab, setActiveTab] = useState<Tab>("image");

  // Image State
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Text State
  const [text, setText] = useState("AB");
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
  const [fontVariant, setFontVariant] = useState("bold");
  const [fontSize, setFontSize] = useState(110);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#0066CC");
  const [bgShape, setBgShape] = useState<Shape>("rounded");

  // Emoji State
  const [emoji, setEmoji] = useState("🔥");

  // Canvas refs for preview
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const drawPreview = useCallback(async () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (activeTab === "image" && imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(null);
        };
      });
    } else if (activeTab === "text") {
      // Draw background
      ctx.fillStyle = bgColor;
      if (bgShape === "circle") {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (bgShape === "rounded") {
        const radius = canvas.width * 0.2;
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(canvas.width - radius, 0);
        ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
        ctx.lineTo(canvas.width, canvas.height - radius);
        ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
        ctx.lineTo(radius, canvas.height);
        ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw text
      ctx.fillStyle = textColor;
      const sizeRatio = canvas.width / 150;
      const scaledFontSize = fontSize * sizeRatio;
      
      let fontStyle = fontVariant;
      if (fontVariant === "bold italic") fontStyle = "italic bold"; // order matters for css font
      ctx.font = `${fontStyle} ${scaledFontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2 + (scaledFontSize * 0.05));

    } else if (activeTab === "emoji") {
      ctx.font = `${canvas.width * 0.8}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Offset slightly to center emoji
      ctx.fillText(emoji, canvas.width / 2, canvas.height / 2 + (canvas.width * 0.08));
    }
  }, [activeTab, imageSrc, text, fontFamily, fontVariant, fontSize, textColor, bgColor, bgShape, emoji]);

  // Redraw preview when state changes
  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Helper to draw to a specific size and return a blob
  const generateImageBlob = async (size: number): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get 2d context");

    if (activeTab === "image" && imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve) => { img.onload = resolve; });
      ctx.drawImage(img, 0, 0, size, size);
    } else if (activeTab === "text") {
      ctx.fillStyle = bgColor;
      if (bgShape === "circle") {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (bgShape === "rounded") {
        const radius = size * 0.2;
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(size - radius, 0);
        ctx.quadraticCurveTo(size, 0, size, radius);
        ctx.lineTo(size, size - radius);
        ctx.quadraticCurveTo(size, size, size - radius, size);
        ctx.lineTo(radius, size);
        ctx.quadraticCurveTo(0, size, 0, size - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, size, size);
      }
      ctx.fillStyle = textColor;
      const sizeRatio = size / 150;
      const scaledFontSize = fontSize * sizeRatio;
      let fontStyle = fontVariant;
      if (fontVariant === "bold italic") fontStyle = "italic bold";
      ctx.font = `${fontStyle} ${scaledFontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, size / 2, size / 2 + (scaledFontSize * 0.05));
    } else if (activeTab === "emoji") {
      ctx.font = `${size * 0.8}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(emoji, size / 2, size / 2 + (size * 0.08));
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas to Blob failed"));
      }, 'image/png');
    });
  };

  // Helper to create an ICO file from PNG blobs
  const createIcoBlob = async (pngBlobs: Blob[]): Promise<Blob> => {
    // ICO header (6 bytes)
    const header = new Uint8Array([0, 0, 1, 0, pngBlobs.length, 0]);

    let directory = new Uint8Array(0);
    let imageData = new Uint8Array(0);
    let offset = 6 + (16 * pngBlobs.length); // Header + Directory size

    for (const blob of pngBlobs) {
      const arrayBuffer = await blob.arrayBuffer();
      const view = new Uint8Array(arrayBuffer);

      // Extract width and height from PNG IHDR chunk (assuming valid PNG)
      // IHDR chunk data is at offset 16 and 20 respectively (4 bytes each)
      const dataView = new DataView(arrayBuffer);
      const width = dataView.getUint32(16);
      const height = dataView.getUint32(20);

      // Entry (16 bytes)
      const entry = new Uint8Array(16);
      entry[0] = width >= 256 ? 0 : width;
      entry[1] = height >= 256 ? 0 : height;
      entry[2] = 0; // Color palette
      entry[3] = 0; // Reserved
      entry[4] = 1; // Color planes (little endian)
      entry[5] = 0;
      entry[6] = 32; // Bits per pixel (little endian)
      entry[7] = 0;

      // Size of image data (4 bytes, little endian)
      new DataView(entry.buffer).setUint32(8, view.length, true);
      // Offset of image data (4 bytes, little endian)
      new DataView(entry.buffer).setUint32(12, offset, true);

      // Append to directory and imageData
      const newDir = new Uint8Array(directory.length + entry.length);
      newDir.set(directory);
      newDir.set(entry, directory.length);
      directory = newDir;

      const newImgData = new Uint8Array(imageData.length + view.length);
      newImgData.set(imageData);
      newImgData.set(view, imageData.length);
      imageData = newImgData;

      offset += view.length;
    }

    const icoFile = new Uint8Array(header.length + directory.length + imageData.length);
    icoFile.set(header);
    icoFile.set(directory, header.length);
    icoFile.set(imageData, header.length + directory.length);

    return new Blob([icoFile], { type: 'image/x-icon' });
  };

  const handleDownload = async () => {
    if (activeTab === "image" && !imageSrc) {
      alert("Please upload an image first.");
      return;
    }
    if (activeTab === "text" && !text) {
      alert("Please enter some text.");
      return;
    }
    if (activeTab === "emoji" && !emoji) {
      alert("Please enter an emoji.");
      return;
    }

    try {
      const zip = new JSZip();

      // Generate sizes
      const sizes = {
        'favicon-16x16.png': 16,
        'favicon-32x32.png': 32,
        'favicon-48x48.png': 48,
        'apple-touch-icon.png': 180,
        'android-chrome-192x192.png': 192,
        'android-chrome-512x512.png': 512,
      };

      const blobs: Record<string, Blob> = {};
      for (const [filename, size] of Object.entries(sizes)) {
        blobs[filename] = await generateImageBlob(size);
        zip.file(filename, blobs[filename]);
      }

      // Generate ICO (contains 16, 32, 48)
      const icoBlob = await createIcoBlob([
        blobs['favicon-16x16.png'],
        blobs['favicon-32x32.png'],
        blobs['favicon-48x48.png']
      ]);
      zip.file("favicon.ico", icoBlob);

      // Generate site.webmanifest
      const manifest = {
        name: "My Website",
        short_name: "Website",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone"
      };
      zip.file("site.webmanifest", JSON.stringify(manifest, null, 2));

      // Generate readme
      zip.file("readme.txt", "1. Extract the contents to the root of your website.\n2. Add the HTML link tags to your index file.\n\nGenerated with Clinikkit Favicon Generator.\n\nhttps://clinikkit.web.app/tools/developer/favicon-generator\n\nVisit https://clinikkit.web.app for all tools.");

      // Download
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "favicon_package.zip");
    } catch (err) {
      console.error(err);
      alert("Failed to generate favicon package.");
    }
  };

  return (
    <Card className="w-full shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-border/40 pb-6 bg-muted/20">
        <CardTitle className="text-xl">Favicon Generator</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">

          {/* Left Column: Controls */}
          <div className="flex-1 p-6 md:border-r border-border/40">
            {/* Custom Tabs Navigation */}
            <div className="flex p-1 bg-muted rounded-lg mb-6">
              <button
                onClick={() => setActiveTab("image")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "image" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <ImageIcon className="w-4 h-4" /> Image
              </button>
              <button
                onClick={() => setActiveTab("text")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "text" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Type className="w-4 h-4" /> Text
              </button>
              <button
                onClick={() => setActiveTab("emoji")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "emoji" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Smile className="w-4 h-4" /> Emoji
              </button>
            </div>

            {/* Tab Contents */}
            <div className="min-h-[250px]">
              {activeTab === "image" && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 hover:bg-muted/30 transition-all">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/svg+xml"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <span className="text-base font-semibold text-foreground mb-1">Click to upload image</span>
                      <span className="text-sm text-muted-foreground">PNG, JPG, or SVG (Square recommended)</span>
                    </Label>
                  </div>
                  {imageSrc && (
                    <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2 font-medium">
                      Image loaded successfully!
                    </div>
                  )}
                </div>
              )}

              {activeTab === "text" && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label>Text / Initials</Label>
                    <Input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      maxLength={4}
                      placeholder="e.g. AB"
                      className="font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="font-mono text-sm uppercase"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="font-mono text-sm uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Shape</Label>
                      <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={bgShape}
                        onChange={(e) => setBgShape(e.target.value as Shape)}
                      >
                        <option value="square">Square</option>
                        <option value="rounded">Rounded</option>
                        <option value="circle">Circle</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Font Family</Label>
                      <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                      >
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Courier New', monospace">Courier New</option>
                        <option value="'Times New Roman', serif">Times New Roman</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                        <option value="Verdana, sans-serif">Verdana</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Font Variant</Label>
                      <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={fontVariant}
                        onChange={(e) => setFontVariant(e.target.value)}
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="italic">Italic</option>
                        <option value="bold italic">Bold Italic</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Font Size: {fontSize}px</Label>
                      <div className="flex items-center h-10">
                        <input 
                          type="range" 
                          min="10" 
                          max="150" 
                          value={fontSize} 
                          onChange={(e) => setFontSize(parseInt(e.target.value))}
                          className="w-full accent-primary cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "emoji" && (
                <div className="space-y-4">
                  <div className="space-y-3 flex flex-col">
                    <div className="flex items-center gap-2 mb-2 bg-muted/50 p-4 rounded-xl border border-border/50">
                      <Label className="text-lg">Selected Emoji:</Label>
                      <span className="text-3xl bg-background px-3 py-1 rounded-md shadow-sm border border-border">{emoji}</span>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                      <EmojiPicker 
                        onEmojiClick={(emojiData) => setEmoji(emojiData.emoji)} 
                        lazyLoadEmojis={true}
                        width="100%"
                        height={400}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Preview & Download */}
          <div className="w-full md:w-80 bg-muted/10 p-6 flex flex-col items-center justify-center space-y-8">
            <div className="space-y-4 w-full flex flex-col items-center">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Live Preview</Label>
              <div className="p-4 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyEwFMBDAAAlGgcEqvV4aQAAAABJRU5ErkJggg==')] rounded-2xl shadow-sm border border-border/50">
                <canvas
                  ref={previewCanvasRef}
                  width={150}
                  height={150}
                  className="w-[150px] h-[150px] shadow-lg rounded-md"
                />
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleDownload}
              className="w-full font-bold h-12 text-base shadow-md hover:shadow-lg transition-all"
            >
              <DownloadCloud className="w-5 h-5 mr-2" />
              Download Package
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Includes .ico, multiple .png sizes, and site.webmanifest.
            </p>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
