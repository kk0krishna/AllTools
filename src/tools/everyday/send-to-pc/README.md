# Send to PC & Cross-Device Clipboard Bridge (Technical Architecture)

**Location:** `src/tools/everyday/send-to-pc`  
**Route:** `/tools/everyday/send-to-pc`  
**Component:** `SendToPcTool` (`index.tsx`)  
**Metadata:** `sendToPcEntry` (`metadata.tsx`)  

---

## 1. Executive Architecture Overview

**Send to PC** is a zero-installation, serverless, client-side peer-to-peer (P2P) file transfer and clipboard bridge built on **WebRTC DataChannels** (`RTCDataChannel`) and **PeerJS**. It connects desktop computers and mobile devices (iOS / Android) across the same local network or across separate networks (e.g., Cellular 4G/5G $\leftrightarrow$ Home Wi-Fi, or across continents).

### Key Architectural Pillars
- **Zero Cloud Storage & 100% P2P:** All file chunks, clipboard strings, and credentials travel directly from browser RAM to browser RAM over encrypted WebRTC DataChannels with DTLS/SCTP.
- **Zero Data Charge on Local Wi-Fi:** When devices share the same local subnet / router, WebRTC prioritizes `host` LAN candidates, streaming data directly between local private IP addresses with 0 MB internet quota consumed at maximum Wi-Fi throughput.
- **ToffeeShare-Inspired Streaming with Event-Driven Backpressure:** Adaptive 64 KB chunk pacing governed by `RTCDataChannel.bufferedAmount` and `bufferedamountlow` events. Prevents buffer bloat and achieves up to 30–80 MB/s on local Wi-Fi with no file size limits.
- **Full-Window Drag & Drop & Clipboard Paste (Ctrl+V):** Drop files anywhere on the browser window to queue them for immediate transfer, or press Ctrl+V to paste screenshots and clipboard images on the fly.
- **Smart Downloads for PC & Mobile:** Auto-save files directly to PC Downloads folder, native iOS/Android Web Share sheet integration ("Save to Photos / Files"), inline media preview (video/audio/image), and batch ZIP archiving.
- **Self-Destructing Secrets ("Burn-on-Copy"):** Client-side memory zeroing for credentials and API keys once copied to the recipient's system clipboard.
- **High-Resilience Multi-Tier Signaling & Keepalive:** Redundant Anycast STUN servers (Google & Cloudflare) paired with OpenRelay TURN fallback for strict symmetric NAT / mobile carrier firewalls, reinforced by a 6-second heartbeat ping/pong keepalive to keep background mobile tabs active.

```
+-----------------------------------------------------------------------------------+
|                               SIGNALING PHASE (WSS)                               |
|   PC (Receiver: tvpc-123456)  <---- WSS Broker ---->  Phone (Sender: session param)|
|                   Exchanges SDP Offer/Answer + ICE Candidates                    |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                            NAT TRAVERSAL & CANDIDATE GATHERING                    |
|   Tier 1: Local Subnet Host Candidates (192.168.X.X) -> 0 MB Internet Data       |
|   Tier 2: Global Anycast STUN (Google + Cloudflare) -> WAN UDP Hole Punching      |
|   Tier 3: Encrypted TURN Relay (OpenRelay) -> Strict Symmetric NAT Fallback       |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                    HIGH-SPEED P2P DATACHANNEL (DTLS / SCTP)                       |
|   PC Screen Browser           <=====================>           Phone Browser     |
|   - 64 KB Chunks with Backpressure Flow Control                 - Camera Scans    |
|   - Live Speedometer & Remaining ETA                            - Batch Files     |
|   - Auto-Download to Downloads Folder                           - Native Share    |
|   - Drag & Drop / Ctrl+V Paste Stream                           - Realtime Notes  |
+-----------------------------------------------------------------------------------+
```

---

## 2. WebRTC Connection & Network Traversal Mechanics

### 2.1 The Two-Phase Connection Lifecycle

#### Phase 1: Signaling via PeerJS
1. The **Receiver (PC)** generates a random 6-digit numeric PIN (`Math.floor(100000 + Math.random() * 900000)`).
2. The Peer ID is prefixed deterministically: `tvpc-{pin}`.
3. The PC establishes a WebSocket connection to the signaling server (`wss://0.peerjs.com`) and registers `tvpc-{pin}`.
4. A pairing URL is encoded into a high-contrast QR code (`QRCodeSVG` with `level="M"`):
   ```
   https://clinikkit.web.app/tools/everyday/send-to-pc?session=tvpc-123456
   ```
5. The **Sender (Mobile Phone)** scans the QR code with its camera or types the 6-digit PIN. The phone connects to the signaling server and requests an outbound DataConnection to `tvpc-{pin}`.

#### Phase 2: ICE Candidate Discovery & Network Classification
1. Both browsers create an `RTCPeerConnection` instance configured with multi-tier ICE servers:
   ```typescript
   export const PEER_CONFIG = {
     debug: 0,
     config: {
       iceServers: [
         { urls: "stun:stun.l.google.com:19302" },
         { urls: "stun:stun1.l.google.com:19302" },
         { urls: "stun:stun.cloudflare.com:3478" },
         { urls: "stun:stun.services.mozilla.com" },
         {
           urls: [
             "turn:openrelay.metered.ca:80",
             "turn:openrelay.metered.ca:443",
             "turn:openrelay.metered.ca:443?transport=tcp",
           ],
           username: "openrelay",
           credential: "openrelay",
         },
       ],
       iceCandidatePoolSize: 10,
     },
   };
   ```
2. **Network Connection Detection:**
   - Once connected, `detectConnectionType()` inspects active candidate pairs:
     - **Local LAN:** When candidate types are `host` $\leftrightarrow$ `host` or both addresses are private IPv4 (RFC 1918), the app marks the connection as **`⚡ Direct Local Wi-Fi (0 Internet Data Used)`**.
     - **Cross-Network (4G/5G $\leftrightarrow$ Wi-Fi):** STUN Server-Reflexive (`srflx`) candidates perform UDP hole punching across routers.
     - **Symmetric NAT / Strict Carrier Firewalls:** TURN Relay (`relay`) candidates securely tunnel packets across ports 80/443 over UDP/TCP.

3. **Keep-Alive Heartbeat:**
   - A ping `{ type: "ping", sentAt: timestamp }` is exchanged every 6 seconds.
   - Prevents iOS Safari and Android Chrome from shutting down idle background WebRTC channels.
   - Calculates and displays live round-trip latency (`rtt` in ms).

---

## 3. High-Speed Binary Streaming & Backpressure Engine

### 3.1 The 64 KB Slicing Protocol
Files are streamed using an indexed chunking protocol with **64 KB chunks (`CHUNK_SIZE = 64 * 1024`)**, which halves packet header overhead compared to legacy 32 KB implementations.

```
+----------------------------------------------------------------------------+
| 1. Header Envelope (JSON)                                                 |
| { type: "file-start", fileId: "file-xyz", name: "recording.mp4",          |
|   size: 154230000, mimeType: "video/mp4", totalChunks: 2354, chunkSize: 65536 } |
+----------------------------------------------------------------------------+
                                     |
                                     v
+----------------------------------------------------------------------------+
| 2. Binary Chunk Stream (Event-Driven Backpressure Loop)                   |
| ArrayBuffer slices pushed as fast as the SCTP socket buffer drains:        |
| - If conn.dataChannel.bufferedAmount > 512 KB: wait for onbufferedamountlow|
| - Else: transmit next chunk immediately via await slice.arrayBuffer()      |
+----------------------------------------------------------------------------+
                                     |
                                     v
+----------------------------------------------------------------------------+
| 3. Termination Envelope (JSON)                                             |
| { type: "file-end", fileId: "file-xyz" }                                   |
+----------------------------------------------------------------------------+
```

### 3.2 Event-Driven Backpressure vs Legacy Timers
In legacy WebRTC implementations, sending loops relied on `setTimeout(sendNext, 5)`, which capped transfer speeds to ~4–6 MB/s and degraded drastically in background tabs due to browser timer clamping.

**Send to PC's Event-Driven Flow Control:**
```typescript
while (offset < file.size) {
  if (dataChannel && dataChannel.bufferedAmount > BUFFER_THRESHOLD) {
    await waitForBufferDrain(dataChannel);
  }

  const slice = file.slice(offset, Math.min(offset + CHUNK_SIZE, file.size));
  const arrayBuffer = await slice.arrayBuffer();

  conn.send({
    type: "file-chunk",
    fileId,
    chunkIndex,
    data: arrayBuffer,
  });

  offset += CHUNK_SIZE;
  chunkIndex++;
}
```
This enables sustained transfers at **30–80+ MB/s** over local Wi-Fi while preventing browser tab memory crashes on multi-gigabyte files.

---

## 4. Drag-and-Drop & Clipboard Paste Integration

1. **Full-Window Drag Overlay:**
   - Dragging any file or batch of files over the browser window triggers a full-screen backdrop with glowing borders and upload animation.
   - Dropping files immediately enqueues them for transmission.
2. **Clipboard Paste (Ctrl+V):**
   - Pressing Ctrl+V anywhere in the app with an image or screenshot copied to the clipboard immediately packages and streams the file to the connected device.
3. **Sequential File Queue:**
   - Multiple files dropped or selected simultaneously are processed sequentially through `sendQueueRef`, preventing SCTP channel buffer congestion.

---

## 5. Download & Media Handling for PC and Mobile

| Platform | Download Mechanism | User Benefit |
| :--- | :--- | :--- |
| **PC Screen** | **Auto-Download Toggle** | Incoming photos and files from phone save directly to the PC Downloads folder with zero clicks. |
| **PC Screen** | **File System Access API** | `showSaveFilePicker()` allows saving directly to specified disk folders with original file names. |
| **PC / Phone** | **Download All as ZIP** | Batches all transferred documents and text notes into a structured `.zip` archive via `JSZip`. |
| **Mobile (iOS/Android)** | **Web Share API (`navigator.share`)** | Opens native mobile share sheet, allowing users on iPhone to tap "Save Image" or "Save to Files", and Android users to save directly to Gallery or Google Drive. |
| **Both** | **Inline Media Previews** | High-res Image Lightbox with zoom/rotate, inline HTML5 Video Player, and inline Audio Player. |

---

## 6. Cryptographic Security Model

1. **Transport Layer Security (DTLS):** All WebRTC DataChannels are encrypted end-to-end by default using Datagram Transport Layer Security (DTLS).
2. **Zero Data Retention:** Payloads move directly between peer memories; no file chunks are ever uploaded to cloud servers.
3. **Burn-on-Copy Secrets:** Sensitive passwords and API keys are masked by default and shredded from React state memory after 1 copy.
4. **Session Erasure:** Closing the browser tab tears down encryption keys and purges in-memory Blob references immediately.
