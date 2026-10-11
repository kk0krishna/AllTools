import React from "react";
import { ToolEntry } from "@/tools/registry";
import { SendToPcTool } from "./index";

export const sendToPcEntry: ToolEntry = {
  metadata: {
    name: "Send to PC: Wireless Phone-to-PC Transfer & Clipboard Bridge",
    description: "Instantly send photos, camera scans, documents, passwords, and clipboard notes between your phone and PC. Encrypted P2P with self-destruct secrets.",
    category: "everyday",
    slug: "send-to-pc",
    keywords: [
      "send to pc",
      "copypaste me alternative",
      "vflat send to pc",
      "cross device clipboard",
      "phone to pc transfer",
      "wireless file transfer",
      "send password securely",
      "photo to pc",
      "scan to pc",
      "snapdrop alternative",
      "burn after reading password",
      "airdrop windows",
      "qr code transfer"
    ],
    hideHeader: false,
  },
  component: SendToPcTool,
  content: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-3">
          How &ldquo;Send to PC&rdquo; Works
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Inspired by <strong>vFlat&apos;s</strong> document camera-to-PC scan workflow and <strong>CopyPaste.me&apos;s</strong> frictionless, 
          encrypted cross-device clipboard bridge, <strong>Send to PC</strong> creates a direct, peer-to-peer (P2P) 
          connection between your phone and computer using WebRTC. 
          Transfer high-resolution scans, multi-page PDFs, Wi-Fi passwords, two-factor tokens, notes, and links without installing any apps or emailing yourself.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
          <div className="text-primary font-bold text-base">1. Instant QR Pairing</div>
          <p className="text-xs text-muted-foreground">
            Point your iPhone or Android camera at the QR code (or enter the 6-digit PIN) to pair in seconds.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
          <div className="text-primary font-bold text-base">2. Camera &amp; Files</div>
          <p className="text-xs text-muted-foreground">
            Snap paper, books, or receipts directly with your camera, or pick high-res photos and documents from your storage.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
          <div className="text-primary font-bold text-base">3. Burn Secrets</div>
          <p className="text-xs text-muted-foreground">
            Send passwords and private codes with &ldquo;Burn after 1 copy&rdquo; self-destruct for maximum privacy.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
          <div className="text-primary font-bold text-base">4. Auto-Copy &amp; ZIP</div>
          <p className="text-xs text-muted-foreground">
            Enable Auto-copy to paste immediately on PC, or download all received scans as a packaged ZIP.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold tracking-tight mb-2">Zero Cloud Storage • 100% P2P Privacy</h3>
        <p className="text-muted-foreground leading-relaxed">
          Your data travels directly between your devices through browser-native WebRTC DataChannels. 
          No accounts, logins, or server storage. Once you close your browser tab or disconnect, 
          the session is shredded and nothing remains anywhere.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold tracking-tight mb-3">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-border/60 bg-card/30 space-y-1">
            <h4 className="font-semibold text-foreground text-sm">How does the Password / Secret &ldquo;Burn&rdquo; feature work?</h4>
            <p className="text-xs text-muted-foreground">
              Just like CopyPaste.me, when you check &ldquo;Burn after 1 copy&rdquo;, the sensitive text is masked. Once the receiving computer copies it to the clipboard, the item is immediately shredded and wiped from memory.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/60 bg-card/30 space-y-1">
            <h4 className="font-semibold text-foreground text-sm">What does &ldquo;Auto-copy&rdquo; do?</h4>
            <p className="text-xs text-muted-foreground">
              When toggled ON, any text or link sent from your phone is instantly written to your PC&apos;s system clipboard the moment it arrives, ready for you to press Ctrl+V / Cmd+V in any application.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/60 bg-card/30 space-y-1">
            <h4 className="font-semibold text-foreground text-sm">Can I send files both ways?</h4>
            <p className="text-xs text-muted-foreground">
              Yes, the connection is fully bidirectional. You can send files, text, passwords, and links from PC to phone, or from phone to PC.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
