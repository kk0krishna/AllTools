import React from "react";
import { ToolEntry } from "@/tools/registry";
import { SendToPcTool } from "./index";

export const sendToPcEntry: ToolEntry = {
  metadata: {
    name: "Send to PC: Blazing Fast Wireless Transfer & Clipboard Bridge",
    description: "Ultra-fast P2P file transfer and cross-device clipboard bridge. Zero data charge on local Wi-Fi, full drag & drop support, ToffeeShare-style streaming, and auto-download for phone and PC.",
    category: "everyday",
    slug: "send-to-pc",
    keywords: [
      "send to pc",
      "toffeeshare alternative",
      "phone to pc transfer",
      "wireless file transfer",
      "drag and drop file share",
      "cross device clipboard",
      "local wifi transfer no data charge",
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
          Blazing Fast Cross-Device Wireless Transfer
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          <strong>Send to PC</strong> creates a direct, peer-to-peer (P2P) data bridge between any sender and receiver devices (phone, PC, laptop, or tablet) using native browser WebRTC DataChannels. 
          Transfer high-resolution photos, multi-gigabyte videos, camera-scanned documents, sensitive passwords, clipboard text, and links immediately—with zero software installation, zero accounts, and zero cloud storage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
          <div className="text-primary font-bold text-base">1. Zero Data Charge Local Wi-Fi</div>
          <p className="text-xs text-muted-foreground">
            Transfers between devices on the same Wi-Fi router run 100% locally through your local network switch with 0 MB of internet quota consumed and maximum gigabit throughput.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
          <div className="text-primary font-bold text-base">2. Drag &amp; Drop &amp; Paste</div>
          <p className="text-xs text-muted-foreground">
            Drag and drop files anywhere on the screen, or press Ctrl+V to immediately send copied images, screenshots, or documents straight to your connected phone or PC.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
          <div className="text-primary font-bold text-base">3. ToffeeShare-Style Streaming</div>
          <p className="text-xs text-muted-foreground">
            Adaptive 64KB backpressure-controlled chunks stream directly between browser RAM buffers without file size limitations or server bottlenecks.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
          <div className="text-primary font-bold text-base">4. Smart Downloads &amp; Auto-Save</div>
          <p className="text-xs text-muted-foreground">
            Enable auto-save to PC Downloads folder, use native iOS/Android share sheets to save directly to Photos/Files, or download all files together in a structured ZIP.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold tracking-tight mb-2">Does It Work Across Different Networks or Far Away?</h3>
        <p className="text-muted-foreground leading-relaxed mb-3">
          <strong>Yes, absolutely.</strong> Send to PC is built with a resilient multi-tier ICE architecture:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground mb-3">
          <li><strong>Same Network (Home/Office Wi-Fi):</strong> Prioritizes direct LAN host sockets with 0 MB internet data used and maximum local speed.</li>
          <li><strong>Different Networks (Cellular 4G/5G ↔ Home Wi-Fi, or across cities):</strong> Traverses NAT firewalls using global Anycast Google and Cloudflare STUN endpoints.</li>
          <li><strong>Strict Enterprise / Carrier Symmetric NAT:</strong> Automatically falls back to high-resilience encrypted TURN relay tunnels so transfers never fail even behind rigid corporate firewalls.</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          Integrated 6-second heartbeat ping/pong keepalives ensure that mobile background tabs (iOS Safari and Android Chrome) stay actively connected without dropping the channel.
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
            <h4 className="font-semibold text-foreground text-sm">How does drag &amp; drop and clipboard pasting work?</h4>
            <p className="text-xs text-muted-foreground">
              You can drag any single file or batch of files from your computer or phone file manager and drop them anywhere onto the screen. Alternatively, copy any screenshot or image to your clipboard and hit Ctrl+V to send it instantly.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/60 bg-card/30 space-y-1">
            <h4 className="font-semibold text-foreground text-sm">What is the Auto-save to PC Downloads option?</h4>
            <p className="text-xs text-muted-foreground">
              When Auto-save is enabled on your receiving PC, incoming photos, documents, and videos from your phone are immediately saved into your computer&apos;s Downloads folder as soon as transfer finishes—no manual clicking required.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/60 bg-card/30 space-y-1">
            <h4 className="font-semibold text-foreground text-sm">Is there any file size limit?</h4>
            <p className="text-xs text-muted-foreground">
              There are no artificial file size limits. Files stream in continuous 64KB memory slices with event-driven backpressure, allowing you to transfer large videos, archives, and document bundles smoothly.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export default sendToPcEntry;
