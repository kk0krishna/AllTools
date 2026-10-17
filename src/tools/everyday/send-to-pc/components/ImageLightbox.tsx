"use client";

import React from "react";
import { X, ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";
import { formatBytes } from "../utils";

interface ImageLightboxProps {
  image: {
    url: string;
    name: string;
    size?: number;
    rotation: number;
    zoom: number;
  } | null;
  onClose: () => void;
  onUpdateImage: React.Dispatch<
    React.SetStateAction<{
      url: string;
      name: string;
      size?: number;
      rotation: number;
      zoom: number;
    } | null>
  >;
}

export function ImageLightbox({ image, onClose, onUpdateImage }: ImageLightboxProps) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 text-white">
          <button
            onClick={() =>
              onUpdateImage((p) => (p ? { ...p, zoom: Math.min(3, p.zoom + 0.25) } : null))
            }
            title="Zoom In"
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() =>
              onUpdateImage((p) => (p ? { ...p, zoom: Math.max(0.5, p.zoom - 0.25) } : null))
            }
            title="Zoom Out"
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={() =>
              onUpdateImage((p) => (p ? { ...p, rotation: (p.rotation + 90) % 360 } : null))
            }
            title="Rotate"
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            title="Close"
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Container */}
        <div className="overflow-hidden rounded-2xl flex items-center justify-center max-h-[80vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt={image.name}
            style={{
              transform: `scale(${image.zoom}) rotate(${image.rotation}deg)`,
              transition: "transform 0.15s ease-out",
            }}
            className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
          />
        </div>

        <div className="mt-3 text-white/80 text-xs flex items-center gap-2.5">
          <span className="font-semibold">{image.name}</span>
          <span>•</span>
          <span className="font-mono">{formatBytes(image.size)}</span>
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = image.url;
              link.download = image.name;
              link.click();
            }}
            className="underline hover:text-white ml-2 flex items-center gap-1 font-semibold"
          >
            <Download className="h-3 w-3" /> Save to PC
          </button>
        </div>
      </div>
    </div>
  );
}
