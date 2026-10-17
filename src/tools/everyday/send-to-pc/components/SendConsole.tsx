"use client";

import React, { useState } from "react";
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
  Flame 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TabType } from "../types";

interface SendConsoleProps {
  title: string;
  onCameraClick: () => void;
  onFileSelectClick: () => void;
  onSendText: (text: string) => void;
  onSendPassword: (password: string, burnOnCopy: boolean) => void;
  onSendLink: (url: string) => void;
}

export function SendConsole({
  title,
  onCameraClick,
  onFileSelectClick,
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

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
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

      {/* TAB 1: FILES & CAMERA */}
      {activeTab === "files" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onCameraClick}
            className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 flex items-center gap-3 transition-all active:scale-[0.99] group text-left"
          >
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Camera className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="font-semibold text-xs text-foreground">Camera Scan</div>
              <div className="text-[11px] text-muted-foreground">Direct document snapshot</div>
            </div>
          </button>

          <button
            onClick={onFileSelectClick}
            className="p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 flex items-center gap-3 transition-all active:scale-[0.99] group text-left"
          >
            <div className="h-9 w-9 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Upload className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="font-semibold text-xs text-foreground">Select Photos or Files</div>
              <div className="text-[11px] text-muted-foreground">Any format • Batch upload</div>
            </div>
          </button>
        </div>
      )}

      {/* TAB 2: TEXT & NOTES */}
      {activeTab === "text" && (
        <div className="space-y-2.5">
          <Textarea
            placeholder="Type or paste notes, snippets, or text to transfer..."
            rows={3}
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSendText();
              }
            }}
            className="rounded-xl text-xs sm:text-sm font-mono border-border/60 focus-visible:ring-primary/20"
          />
          <div className="flex justify-between items-center text-[11px] text-muted-foreground">
            <span>Press Ctrl+Enter to send</span>
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
              className="rounded-xl text-xs sm:text-sm font-mono pr-10 h-10 border-border/60"
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
            className="rounded-xl text-xs sm:text-sm font-mono h-10 border-border/60"
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
