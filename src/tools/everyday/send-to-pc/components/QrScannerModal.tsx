"use client";

import React, { useState, useEffect, useRef } from "react";
import jsQR from "jsqr";
import { X, ScanLine, AlertCircle, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

export function QrScannerModal({ isOpen, onClose, onScan }: QrScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isActive = true;
    let timerId: NodeJS.Timeout | null = null;
    let animId: number | null = null;
    setError("");

    // Detect native BarcodeDetector if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let barcodeDetector: any = null;
    if (typeof window !== "undefined" && "BarcodeDetector" in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        barcodeDetector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
      } catch {
        barcodeDetector = null;
      }
    }

    // Off-screen canvas for frame processing
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const scanFrame = async () => {
      if (!isActive) return;

      const video = videoRef.current;
      if (video && video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        // 1. Native BarcodeDetector (instant hardware detection)
        if (barcodeDetector) {
          try {
            const barcodes = await barcodeDetector.detect(video);
            if (barcodes.length > 0 && barcodes[0].rawValue) {
              onScan(barcodes[0].rawValue);
              return;
            }
          } catch {
            // Fall back to jsQR
          }
        }

        // 2. jsQR with downscaled canvas for fast processing
        if (ctx) {
          const maxWidth = 480;
          const scale = Math.min(1, maxWidth / Math.max(video.videoWidth, video.videoHeight));
          canvas.width = Math.floor(video.videoWidth * scale);
          canvas.height = Math.floor(video.videoHeight * scale);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height, {
            inversionAttempts: "attemptBoth",
          });

          if (code && code.data) {
            onScan(code.data);
            return;
          }
        }
      }

      // Schedule next frame check every 70ms (~14 fps)
      timerId = setTimeout(() => {
        animId = requestAnimationFrame(scanFrame);
      }, 70);
    };

    // Request rear environment camera
    navigator.mediaDevices
      ?.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      .then((stream) => {
        if (!isActive) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(() => {
              scanFrame();
            }).catch(() => {});
          };
        }
      })
      .catch((err) => {
        console.warn("Camera access failed:", err);
        setError("Camera access was denied. Please allow camera permissions or enter the 6-digit PIN manually.");
      });

    return () => {
      isActive = false;
      if (timerId) clearTimeout(timerId);
      if (animId) cancelAnimationFrame(animId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, onScan]);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height, {
            inversionAttempts: "attemptBoth",
          });
          if (code && code.data) {
            onScan(code.data);
          } else {
            alert("No QR code detected in this photo. Please try another image or point your camera directly.");
          }
        }
      };
      if (typeof event.target?.result === "string") {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-card border border-border/70 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScanLine className="h-4 w-4 text-primary" />
            <span className="font-bold text-xs sm:text-sm text-foreground">Scan Receiver QR</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Viewfinder Video Frame */}
        <div className="relative aspect-square w-full bg-black overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />

          {/* Viewfinder Target Framing Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-56 h-56 border-2 border-primary/90 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
              {/* Pulsing Scan Beam */}
              <div className="absolute left-2 right-2 h-0.5 bg-primary shadow-[0_0_10px_#3b82f6] animate-[pulse_1.5s_ease-in-out_infinite]" />
              {/* Corner Focus Brackets */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-3 border-l-3 border-primary rounded-tl" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-3 border-r-3 border-primary rounded-tr" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-3 border-l-3 border-primary rounded-bl" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-3 border-r-3 border-primary rounded-br" />
            </div>
          </div>
        </div>

        {/* Footer & Actions */}
        <div className="p-3.5 space-y-2 text-center bg-card">
          {error ? (
            <div className="p-2 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl flex items-center justify-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Align the QR code on the receiver screen inside the frame.
            </p>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 text-xs h-8 rounded-xl font-medium"
            >
              <QrCode className="h-3 w-3 mr-1" /> Upload Image
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="text-xs h-8 px-4 rounded-xl font-medium"
            >
              Cancel
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageFile}
          />
        </div>
      </div>
    </div>
  );
}
