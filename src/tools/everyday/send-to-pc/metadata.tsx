import React from "react";
import { ToolEntry } from "@/tools/registry";
import { SendToPcTool } from "./index";

export const sendToPcEntry: ToolEntry = {
  metadata: {
    name: "Send to PC: Wireless Transfer & Clipboard Bridge",
    description: "Instantly send photos, camera scans, documents, passwords, and clipboard notes between your phone and PC. Direct encrypted P2P with self-destruct secrets.",
    category: "everyday",
    slug: "send-to-pc",
    keywords: [
      "send to pc",
      "phone to pc transfer",
      "wireless file transfer",
      "cross device clipboard",
      "send password securely",
      "camera scan to pc",
      "airdrop for windows",
      "photo to computer",
      "qr code file transfer",
      "browser p2p file share",
      "burn on copy password",
      "webrtc data transfer",
      "snapdrop alternative"
    ],
    hideHeader: true,
  },
  component: SendToPcTool,
  content: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-3">
          Instant Phone-to-PC Wireless Transfer
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          <strong>Send to PC</strong> creates a direct, peer-to-peer (P2P) data bridge between your smartphone and computer using native browser WebRTC DataChannels. 
          Transfer high-resolution photos, camera-scanned documents, sensitive passwords, clipboard text, and links immediately—with zero software installation, zero accounts, and zero cloud storage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
          <div className="text-primary font-bold text-base">1. Instant QR Pairing</div>
          <p className="text-xs text-muted-foreground">
            Point your iPhone or Android camera at the QR code on your PC screen (or enter the 6-digit PIN) to pair in seconds.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
          <div className="text-primary font-bold text-base">2. Camera &amp; Files</div>
          <p className="text-xs text-muted-foreground">
            Snap documents directly with your phone camera, or select multi-file batches and high-res media from device storage.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
          <div className="text-primary font-bold text-base">3. Burn Secrets</div>
          <p className="text-xs text-muted-foreground">
            Send sensitive passwords, API keys, and 2FA codes with &ldquo;Burn after 1 copy&rdquo; automatic memory shredding.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
          <div className="text-primary font-bold text-base">4. Auto-Copy &amp; ZIP</div>
          <p className="text-xs text-muted-foreground">
            Auto-copy received clipboard snippets straight to your PC clipboard, or export all received files into a structured ZIP archive.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold tracking-tight mb-2">Does It Work If Devices Are on Different Networks?</h3>
        <p className="text-muted-foreground leading-relaxed mb-3">
          <strong>Yes.</strong> Send to PC establishes connections across different networks using WebRTC ICE and global STUN (Session Traversal Utilities for NAT) servers. 
          Your phone can be connected via <strong>cellular mobile data (4G/5G)</strong> while your computer is connected to a <strong>home or office Wi-Fi network</strong>, or two completely different routers.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The initial handshake exchanges encrypted session descriptors through a signaling channel. Once discovered, the devices negotiate the most direct communication path possible. In the vast majority of consumer and mobile network topologies, direct peer-to-peer data channels open seamlessly without requiring devices to share the same local Wi-Fi.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold tracking-tight mb-2">Zero Cloud Storage • 100% Client-Side Privacy</h3>
        <p className="text-muted-foreground leading-relaxed">
          Unlike traditional cloud drives or messaging tools, your transferred files and credentials are never stored on any server or cloud database. 
          Data moves directly from browser memory to browser memory across an encrypted channel. As soon as you close your browser tab or disconnect, the cryptographic session keys and memory buffers are erased permanently.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold tracking-tight mb-3">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-border/60 bg-card/30 space-y-1">
            <h4 className="font-semibold text-foreground text-sm">How does the &ldquo;Burn after 1 copy&rdquo; feature protect passwords?</h4>
            <p className="text-xs text-muted-foreground">
              When sending passwords or sensitive tokens with &ldquo;Burn after 1 copy&rdquo; enabled, the text remains masked on the receiving screen. The moment the recipient clicks to copy it to their system clipboard, the item is immediately shredded from browser memory and replaced with a burned confirmation indicator.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/60 bg-card/30 space-y-1">
            <h4 className="font-semibold text-foreground text-sm">Do I need to install an app on my phone or computer?</h4>
            <p className="text-xs text-muted-foreground">
              No installation is required. Send to PC runs entirely in modern web browsers (Chrome, Safari, Firefox, Edge) on iOS, Android, Windows, macOS, and Linux.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/60 bg-card/30 space-y-1">
            <h4 className="font-semibold text-foreground text-sm">What is the Auto-copy clipboard option?</h4>
            <p className="text-xs text-muted-foreground">
              When Auto-copy is enabled on your receiving device, incoming clipboard notes and URLs are automatically written to your operating system clipboard upon arrival, letting you press Ctrl+V (or Cmd+V) instantly without manual clicking.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/60 bg-card/30 space-y-1">
            <h4 className="font-semibold text-foreground text-sm">Can I transfer files bidirectionally?</h4>
            <p className="text-xs text-muted-foreground">
              Yes, the connection is fully bidirectional. You can send files, text, credentials, and links from mobile to PC, or from PC to mobile.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
