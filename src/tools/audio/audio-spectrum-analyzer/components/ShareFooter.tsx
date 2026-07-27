"use client";

import { Button } from "@/components/ui/button";
import { Share2, Copy, Download, MessageCircle, Send } from "lucide-react";
import { AudioAnalysisResult } from "../analyzer";

interface ShareFooterProps {
  result: AudioAnalysisResult;
  generateBrandedImageBlob: () => Promise<Blob | null>;
}

export function ShareFooter({ result, generateBrandedImageBlob }: ShareFooterProps) {
  const shareText = `🏆 TOOLVERSE AUDIO AUDIT REPORT 🏆\n\n🎵 Track: ${result.metadata?.title || result.fileName}\n👤 Artist: ${result.metadata?.artist || "Unknown"}\n⭐ Quality Grade: GRADE ${result.qualityGrade} (${result.qualityGradeLabel})\n\n📊 TECHNICAL FORENSICS:\n📈 Cutoff Ceiling: ${(result.cutoffFreq / 1000).toFixed(1)} kHz\n🔊 Dynamic Range: DR${result.dynamicRangeScore || 10} (${(result.rmsDbFS || 0).toFixed(1)} dBFS RMS)\n🛡️ Clipping Status: ${result.isClipped ? "⚠️ Clipped / Limited" : "Clean / Bit-Perfect"}\n⚙️ Rip / Encoder: ${result.metadata?.encoder || "Standard / Untagged"}\n\n💡 Engineering Verdict: ${result.assessmentReport?.summary || result.verdictText}\n\n🔍 Verify your music collection free & locally in browser (no uploads needed):\n👉 https://alltools.web.app/tools/audio/audio-spectrum-analyzer`;

  const handleShare = async () => {
    if (navigator.share) {
      const blob = await generateBrandedImageBlob();
      if (blob) {
        const file = new File([blob], `ToolVerse_Audit_${result.fileName.replace(/[^a-zA-Z0-9]/g, "_")}.png`, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `Audio Quality Audit: ${result.metadata?.title || result.fileName}`,
              text: shareText,
              files: [file],
            });
            return;
          } catch {
            // User cancelled or share drawer closed
          }
        }
      }
      try {
        await navigator.share({
          title: `Audio Quality Audit: ${result.metadata?.title || result.fileName}`,
          text: shareText,
          url: "https://alltools.web.app/tools/audio/audio-spectrum-analyzer",
        });
        return;
      } catch {
        // Fallback
      }
    }

    // Desktop fallback: copy text and trigger download
    navigator.clipboard.writeText(shareText);
    const blob = await generateBrandedImageBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `ToolVerse_Audit_${result.fileName.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
      link.href = url;
      link.click();
    }
    alert("Audit report text copied to clipboard & branded image downloaded!");
  };

  const handleDownloadImage = async () => {
    const blob = await generateBrandedImageBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `ToolVerse_Audit_${result.fileName.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
    link.href = url;
    link.click();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    alert("Full diagnostic report copied to clipboard!");
  };

  return (
    <div className="pt-5 border-t space-y-4 bg-gradient-to-b from-transparent to-muted/20 -mx-5 -mb-5 p-5 rounded-b-3xl min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-semibold text-foreground min-w-0">
        <span className="flex items-center gap-2 text-sm truncate font-heading font-bold text-foreground">
          <Share2 className="size-4 text-primary shrink-0" />
          <span>Export & Share Diagnostic Audit</span>
        </span>
        <span className="text-muted-foreground font-normal text-[11px] font-mono truncate">
          Includes high-res spectrogram image & forensic text report
        </span>
      </div>

      {/* Primary Export Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <Button
          size="sm"
          onClick={handleShare}
          className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:opacity-95 text-white gap-2 font-bold shadow-md h-10 text-xs sm:text-sm shrink-0 rounded-xl"
        >
          <Share2 className="size-4 shrink-0" />
          <span className="truncate">Share Report & Image</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleDownloadImage}
          className="w-full border-primary/40 hover:bg-primary/10 text-primary gap-2 font-bold h-10 text-xs sm:text-sm shrink-0 rounded-xl shadow-xs"
        >
          <Download className="size-4 shrink-0" />
          <span className="truncate">Download PNG Image</span>
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleCopyText}
          className="w-full gap-2 font-bold h-10 text-xs sm:text-sm shrink-0 rounded-xl hover:bg-secondary/80"
        >
          <Copy className="size-4 shrink-0" />
          <span className="truncate">Copy Report Text</span>
        </Button>
      </div>

      {/* Quick Social Broadcast Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/50 text-xs font-mono">
        <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
          Quick Social Broadcast:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="border-border/60 hover:border-[#1da1f2] hover:text-[#1da1f2] hover:bg-[#1da1f2]/5 gap-1.5 text-xs font-semibold h-7 px-2.5 rounded-lg shrink-0 transition-colors"
            onClick={() => {
              const text = `🏆 TOOLVERSE AUDIO QUALITY AUDIT 🏆\n🎵 Track: ${result.metadata?.title || result.fileName}\n⭐ Quality Grade: GRADE ${result.qualityGrade} (${result.qualityGradeLabel})\n📈 Cutoff: ${(result.cutoffFreq / 1000).toFixed(1)} kHz | Dynamics: DR${result.dynamicRangeScore || 10}\n\nVerify yours free in browser:\nhttps://alltools.web.app/tools/audio/audio-spectrum-analyzer`;
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
            }}
          >
            <svg className="size-3 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>𝕏 Twitter / X</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border-border/60 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-500/5 gap-1.5 text-xs font-semibold h-7 px-2.5 rounded-lg shrink-0 transition-colors"
            onClick={() => {
              const text = `🏆 TOOLVERSE AUDIO AUDIT 🏆\n🎵 Track: ${result.metadata?.title || result.fileName}\n⭐ Grade: GRADE ${result.qualityGrade} (${result.qualityGradeLabel})\n📈 Cutoff: ${(result.cutoffFreq / 1000).toFixed(1)} kHz | DR${result.dynamicRangeScore || 10}\n\nVerify free in browser: https://alltools.web.app/tools/audio/audio-spectrum-analyzer`;
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
            }}
          >
            <MessageCircle className="size-3 shrink-0" />
            <span>WhatsApp</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border-border/60 hover:border-[#0088cc] hover:text-[#0088cc] hover:bg-[#0088cc]/5 gap-1.5 text-xs font-semibold h-7 px-2.5 rounded-lg shrink-0 transition-colors"
            onClick={() => {
              const text = `🏆 AUDIO AUDIT: ${result.metadata?.title || result.fileName} -> GRADE ${result.qualityGrade} | DR${result.dynamicRangeScore || 10}. Check yours at https://alltools.web.app/tools/audio/audio-spectrum-analyzer`;
              window.open(`https://t.me/share/url?url=${encodeURIComponent("https://alltools.web.app/tools/audio/audio-spectrum-analyzer")}&text=${encodeURIComponent(text)}`, "_blank");
            }}
          >
            <Send className="size-3 shrink-0" />
            <span>Telegram</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border-border/60 hover:border-[#ff4500] hover:text-[#ff4500] hover:bg-[#ff4500]/5 gap-1.5 text-xs font-semibold h-7 px-2.5 rounded-lg shrink-0 transition-colors"
            onClick={() => {
              const title = `Audio Quality Audit Report: ${result.metadata?.title || result.fileName} -> Grade ${result.qualityGrade} (${result.qualityGradeLabel}) | DR${result.dynamicRangeScore || 10}`;
              window.open(`https://www.reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent("https://alltools.web.app/tools/audio/audio-spectrum-analyzer")}`, "_blank");
            }}
          >
            <span>Reddit</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
