"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, Code, FileJson, FileType, Captions } from "lucide-react";

interface DownloadMenuProps {
  onDownload: (format: "txt" | "md" | "json" | "csv" | "srt" | "vtt") => void;
}

export function DownloadMenu({ onDownload }: DownloadMenuProps) {
  return (
    <DropdownMenu>
      {/* @ts-expect-error: asChild is a valid Radix property but missing in the local types */}
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="min-w-[140px]">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onDownload("txt")} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>Plain Text (.txt)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload("md")} className="cursor-pointer">
          <FileType className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>Markdown (.md)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload("json")} className="cursor-pointer">
          <FileJson className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>JSON (.json)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload("csv")} className="cursor-pointer">
          <FileType className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>CSV (.csv)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload("srt")} className="cursor-pointer">
          <Captions className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>SubRip (.srt)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload("vtt")} className="cursor-pointer">
          <Captions className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>WebVTT (.vtt)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
