"use client";

import React, { useState } from "react";
import { 
  FileText, 
  File as FileIcon, 
  Check, 
  Copy, 
  ExternalLink, 
  Download, 
  Eye, 
  EyeOff, 
  Flame, 
  Link2, 
  KeyRound, 
  ZoomIn,
  Share2,
  Music,
  Video,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransferItem } from "../types";
import { formatBytes } from "../utils";

interface TransferCardProps {
  item: TransferItem;
  isPasswordRevealed: boolean;
  onToggleRevealPassword: (id: string) => void;
  onOpenImageModal: (item: TransferItem) => void;
  onDownloadItem: (item: TransferItem) => void;
  onShareNative?: (item: TransferItem) => void;
  onCopyContent: (item: TransferItem) => void;
  isCopied: boolean;
}

export function TransferCard({
  item,
  isPasswordRevealed,
  onToggleRevealPassword,
  onOpenImageModal,
  onDownloadItem,
  onShareNative,
  onCopyContent,
  isCopied,
}: TransferCardProps) {
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const isImage = item.type === "file" && item.mimeType?.startsWith("image/") && Boolean(item.url);
  const isAudio = item.type === "file" && item.mimeType?.startsWith("audio/") && Boolean(item.url);
  const isVideo = item.type === "file" && item.mimeType?.startsWith("video/") && Boolean(item.url);

  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const handleDownload = () => {
    onDownloadItem(item);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const handleShare = () => {
    if (onShareNative) {
      onShareNative(item);
    }
  };

  return (
    <div className="group bg-card/50 hover:bg-card border border-border/60 hover:border-border rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
      {/* Photo card */}
      {isImage ? (
        <div>
          <div
            onClick={() => onOpenImageModal(item)}
            className="relative h-40 w-full bg-muted/40 cursor-pointer overflow-hidden flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-[2px]">
              <ZoomIn className="h-4 w-4" /> Fullscreen Preview
            </div>
          </div>
          <div className="p-3 flex items-center justify-between text-xs">
            <span className="truncate font-semibold text-foreground text-xs" title={item.name}>
              {item.name}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono ml-2 shrink-0">
              {formatBytes(item.size)}
            </span>
          </div>
        </div>
      ) : isVideo ? (
        /* Video card with inline playback */
        <div className="p-3 space-y-2">
          <div className="rounded-xl overflow-hidden bg-black/80 max-h-48 flex items-center justify-center">
            <video
              src={item.url}
              controls
              className="w-full max-h-48 object-contain"
              preload="metadata"
            />
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Video className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate font-semibold text-foreground" title={item.name}>
                {item.name}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono shrink-0 ml-2">
              {formatBytes(item.size)}
            </span>
          </div>
        </div>
      ) : isAudio ? (
        /* Audio card with inline playback */
        <div className="p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Music className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-foreground truncate" title={item.name}>
                  {item.name}
                </p>
                <p className="text-[10px] font-mono text-muted-foreground">
                  {formatBytes(item.size)}
                </p>
              </div>
            </div>
          </div>
          <audio src={item.url} controls className="w-full h-8" preload="metadata" />
        </div>
      ) : item.type === "file" ? (
        /* Document / Generic File card */
        <div className="p-3.5 space-y-2">
          <div className="flex items-start gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileIcon className="h-4.5 w-4.5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-foreground truncate" title={item.name}>
                {item.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono text-muted-foreground">
                  {formatBytes(item.size)}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                  {item.mimeType?.split("/")[1] || "FILE"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : item.type === "password" ? (
        /* Secret / Password card */
        <div className="p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 uppercase tracking-wider">
              <KeyRound className="h-3 w-3" /> Secret
            </span>
            {item.burnOnCopy && !item.isBurned && (
              <Badge
                variant="outline"
                className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
              >
                <Flame className="h-2.5 w-2.5 mr-0.5 inline" /> Burn on copy
              </Badge>
            )}
          </div>

          {item.isBurned ? (
            <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" /> Shredded from memory
            </div>
          ) : (
            <div className="bg-muted/40 p-2.5 rounded-xl border border-border/60 flex items-center justify-between">
              <span className="font-mono text-xs tracking-wider truncate select-all">
                {isPasswordRevealed ? item.text : "••••••••••••••••"}
              </span>
              <button
                type="button"
                onClick={() => onToggleRevealPassword(item.id)}
                className="text-muted-foreground hover:text-foreground ml-2 p-1"
                title={isPasswordRevealed ? "Hide password" : "Show password"}
              >
                {isPasswordRevealed ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          )}
        </div>
      ) : item.type === "link" ? (
        /* Web Link card */
        <div className="p-3.5 space-y-2">
          <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
            <Link2 className="h-3 w-3" /> Link
          </span>
          <div className="bg-muted/40 p-2.5 rounded-xl border border-border/60 text-xs text-primary font-mono truncate underline">
            <a href={item.text} target="_blank" rel="noopener noreferrer">
              {item.text}
            </a>
          </div>
        </div>
      ) : (
        /* Text Note card */
        <div className="p-3.5 space-y-2">
          <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
            <FileText className="h-3 w-3" /> Note
          </span>
          <div className="bg-muted/40 p-2.5 rounded-xl border border-border/60 text-xs text-foreground font-mono whitespace-pre-wrap break-words max-h-28 overflow-y-auto select-all">
            {item.text}
          </div>
        </div>
      )}

      {/* Card Action footer */}
      <div className="p-3 pt-0 flex items-center gap-2">
        {item.type === "file" ? (
          <div className="flex items-center gap-1.5 w-full">
            <Button
              size="sm"
              variant={downloadSuccess ? "outline" : "secondary"}
              onClick={handleDownload}
              className={`flex-1 text-xs h-8 rounded-xl font-semibold transition-all ${
                downloadSuccess ? "text-emerald-500 border-emerald-500/30" : ""
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" /> Saved!
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 mr-1" /> Download
                </>
              )}
            </Button>

            {canNativeShare && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleShare}
                title="Save / Share to Device (iOS/Android Share Sheet)"
                className="text-xs h-8 px-2.5 rounded-xl border-border/60 text-foreground hover:text-primary"
              >
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            )}

            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in new tab"
                className="inline-flex items-center justify-center text-xs h-8 px-2.5 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        ) : item.type === "link" ? (
          <div className="flex items-center gap-1.5 w-full">
            <a
              href={item.text}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button
                size="sm"
                variant="secondary"
                className="w-full text-xs h-8 rounded-xl font-semibold"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open Link
              </Button>
            </a>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCopyContent(item)}
              className="text-xs h-8 rounded-xl px-3 border-border/60"
            >
              {isCopied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            disabled={item.isBurned}
            onClick={() => onCopyContent(item)}
            className={`w-full text-xs h-8 rounded-xl font-semibold ${
              item.type === "password" ? "hover:bg-amber-500/20" : ""
            }`}
          >
            {isCopied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" /> Copied to Clipboard
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1" />{" "}
                {item.type === "password" ? "Copy Secret" : "Copy Note"}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
export default TransferCard;
