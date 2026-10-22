"use client";

import React, { useState, useRef } from "react";
import { 
  Zap, 
  Image as ImageIcon, 
  FileText, 
  Lock, 
  Link2, 
  Camera, 
  Upload, 
  Send, 
  Eye, 
  EyeOff, 
  Flame,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TabType } from "../types";

interface SendConsoleProps {
  title: string;
  onCameraClick: () => void;
  onFileSelectClick: () => void;
  onFilesDrop?: (files: File[]) => void;
  onSendText: (text: string) => void;
  onSendPassword: (password: string, burnOnCopy: boolean) => void;
  onSendLink: (url: string) => void;
}

export function SendConsole({
  title,
  onCameraClick,
  onFileSelectClick,
  onFilesDrop,
  onSendText,
  onSendPassword,
  onSendLink,
}: SendConsoleProps) {
  const [activeTab, setActiveTab] = useState<TabType>("files");
  const [textMessage, setTextMessage] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [burnOnCopyOption, setBurnOnCopyOption] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [linkInput, setLinkInput] = useState<string>("");
  const [isConsoleDragOver, setIsConsoleDragOver] = useState<boolean>(false);

  const dragCounterRef = useRef<number>(0);

  const handleSendText = () => {
    if (!textMessage.trim()) return;
    onSendText(textMessage.trim());
    setTextMessage("");
  };

  const handleSendPassword = () => {
    if (!passwordInput.trim()) return;
    onSendPassword(passwordInput.trim(), burnOnCopyOption);
    setPasswordInput("");
  };

  const handleSendLink = () => {
    let cleanUrl = linkInput.trim();
    if (!cleanUrl) return;
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }
    onSendLink(cleanUrl);
    setLinkInput("");
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsConsoleDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsConsoleDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsConsoleDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (onFilesDrop) {
        onFilesDrop(droppedFiles);
      }
    }
  };

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-semibold text-xs sm:text-sm text-foreground">{title}</span>
        </div>

        {/* Segmented Pill Tabs */}
        <div className="inline-flex items-center p-0.5 rounded-xl bg-muted/60 text-xs font-medium border border-border/40">
          <button
            onClick={() => setActiveTab("files")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "files"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Files</span>
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "text"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Notes</span>
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "password"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Secret</span>
          </button>
          <button
            onClick={() => setActiveTab("link")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "link"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            <span>Link</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FILES & DRAG-AND-DROP */}
      {activeTab === "files" && (
        <div className="space-y-3">
          {/* Interactive Drag & Drop Area */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed transition-all p-5 sm:p-6 text-center cursor-pointer ${
              isConsoleDragOver
                ? "border-primary bg-primary/10 shadow-lg scale-[1.01]"
                : "border-border/70 hover:border-primary/50 bg-muted/15 hover:bg-muted/25"
            }`}
            onClick={onFileSelectClick}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-transform duration-200 ${
                  isConsoleDragOver
                    ? "bg-primary text-primary-foreground scale-110 shadow-md"
                    : "bg-primary/10 text-primary hover:scale-105"
                }`}
              >
                {isConsoleDragOver ? (
                  <Upload className="h-6 w-6 animate-bounce" />
                ) : (
                  <Upload className="h-6 w-6" />
                )}
              </div>

              <div>
                <p className="font-bold text-xs sm:text-sm text-foreground">
                  {isConsoleDragOver
                    ? "Drop files here to send instantly!"
                    : "Drag & drop files here, or click to browse"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Photos, videos, PDFs, documents • Unlimited size • End-to-end encrypted
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> 0 Data Used on Local Wi-Fi
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Ctrl+V to paste screenshot
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={onFileSelectClick}
              className="p-3 rounded-xl border border-border/60 bg-card/60 hover:bg-card flex items-center gap-3 transition-all active:scale-[0.99] group text-left shadow-xs"
            >
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Layers className="h-4.5 w-4.5" />
              </div>
              <div className="overflow-hidden">
                <div className="font-semibold text-xs text-foreground">Choose Photos or Files</div>
                <div className="text-[10px] text-muted-foreground truncate">Select single or multiple files</div>
              </div>
            </button>

            <button
              onClick={onCameraClick}
              className="p-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 flex items-center gap-3 transition-all active:scale-[0.99] group text-left shadow-xs"
            >
              <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Camera className="h-4.5 w-4.5" />
              </div>
              <div className="overflow-hidden">
                <div className="font-semibold text-xs text-foreground">Camera Scan</div>
                <div className="text-[10px] text-muted-foreground truncate">Snap photo / document directly</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: TEXT & NOTES */}
      {activeTab === "text" && (
        <div className="space-y-2.5">
          <Textarea
            placeholder="Type or paste notes, code snippets, or text to transfer..."
            rows={3}
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSendText();
              }
            }}
            className="rounded-2xl text-xs sm:text-sm font-mono border-border/60 focus-visible:ring-primary/20"
          />
          <div className="flex justify-between items-center text-[11px] text-muted-foreground">
            <span>Press Ctrl+Enter to send instantly</span>
            <Button
              onClick={handleSendText}
              disabled={!textMessage.trim()}
              size="sm"
              className="rounded-xl text-xs font-semibold h-8 px-4"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" /> Send Note
            </Button>
          </div>
        </div>
      )}

      {/* TAB 3: SENSITIVE PASSWORD / SECRET */}
      {activeTab === "password" && (
        <div className="space-y-2.5">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password, Wi-Fi key, or sensitive secret..."
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="rounded-2xl text-xs sm:text-sm font-mono pr-10 h-10 border-border/60"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground select-none">
              <input
                type="checkbox"
                checked={burnOnCopyOption}
                onChange={(e) => setBurnOnCopyOption(e.target.checked)}
                className="rounded border-border text-primary h-3.5 w-3.5"
              />
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Flame className="h-3.5 w-3.5 text-amber-500" /> Burn after 1 copy (Self-destruct)
              </span>
            </label>

            <Button
              onClick={handleSendPassword}
              disabled={!passwordInput.trim()}
              size="sm"
              className="rounded-xl text-xs font-semibold h-8 px-4 bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto"
            >
              <Lock className="h-3.5 w-3.5 mr-1.5" /> Send Secret
            </Button>
          </div>
        </div>
      )}

      {/* TAB 4: WEB LINK */}
      {activeTab === "link" && (
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Paste URL (e.g., https://example.com)..."
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendLink();
            }}
            className="rounded-2xl text-xs sm:text-sm font-mono h-10 border-border/60"
          />
          <Button
            onClick={handleSendLink}
            disabled={!linkInput.trim()}
            size="sm"
            className="rounded-xl text-xs font-semibold h-10 px-4 shrink-0"
          >
            <Link2 className="h-3.5 w-3.5 mr-1.5" /> Send Link
          </Button>
        </div>
      )}
    </div>
  );
}
export default SendConsole;
