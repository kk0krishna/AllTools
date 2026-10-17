# Send to PC & Cross-Device Clipboard Bridge (Technical Architecture)

**Location:** `src/tools/everyday/send-to-pc`  
**Route:** `/tools/everyday/send-to-pc`  
**Component:** `SendToPcTool` (`index.tsx`)  
**Metadata:** `sendToPcEntry` (`metadata.tsx`)  

---

## 1. Executive Architecture Overview

**Send to PC** is a zero-installation, serverless, client-side peer-to-peer (P2P) file transfer and clipboard bridge built on **WebRTC DataChannels** (`RTCDataChannel`) and **PeerJS**. It connects desktop computers and mobile devices (iOS / Android) across the same local network or across separate networks (e.g., Cellular 4G/5G $\leftrightarrow$ Home Wi-Fi).

### Key Architectural Pillars
- **Zero Cloud Storage:** All file chunks, clipboard strings, and credentials travel directly from browser RAM to browser RAM over encrypted WebRTC DataChannels.
- **Stateless Signaling:** Ephemeral session pairing via an external WSS signaling broker (`0.peerjs.com`) used strictly for exchanging SDP offers and ICE candidates.
- **Symmetric Chunk Pacing:** Binary slicing at 32 KB chunk intervals to eliminate RTC buffer exhaustion and memory spikes on constrained mobile devices.
- **Self-Destructing Secrets ("Burn-on-Copy"):** Client-side memory zeroing for credentials and API keys once copied to the recipient's system clipboard.

```
+-----------------------------------------------------------------------------------+
|                               SIGNALING PHASE (WSS)                               |
|   PC (Receiver: tvpc-123456)  <---- WSS Broker ---->  Phone (Sender: session param)|
|                   Exchanges SDP Offer/Answer + ICE Candidates                    |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                            NAT TRAVERSAL (STUN / UDP)                            |
|             Google STUN Servers (stun.l.google.com:19302)                         |
|                 Discovers Public IP:Port via ICE Binding Requests                 |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                         DIRECT P2P DATACHANNEL (DTLS/SCTP)                        |
|   PC Screen Browser           <=====================>           Phone Browser     |
|   - File Chunks (32 KB ArrayBuffers)                            - Camera Scans    |
|   - Realtime Clipboard Notes                                    - Photos & Files  |
|   - Encrypted Secrets (Burn-on-Copy)                            - Direct URLs     |
+-----------------------------------------------------------------------------------+
```

---

## 2. WebRTC Connection & Network Traversal Mechanics

### 2.1 The Two-Phase Connection Lifecycle

#### Phase 1: Signaling via PeerJS
1. The **Receiver (PC)** generates a random 6-digit numeric PIN (`Math.floor(100000 + Math.random() * 900000)`).
2. The Peer ID is prefixed deterministically: `tvpc-{pin}`.
3. The PC establishes a WebSocket connection to the signaling server (`wss://0.peerjs.com`) and registers `tvpc-{pin}`.
4. A pairing URL is encoded into a high-error-correction QR code (`QRCodeSVG` with `level="H"`):
   ```
   https://clinikkit.web.app/tools/everyday/send-to-pc?session=tvpc-123456
   ```
5. The **Sender (Mobile Phone)** scans the QR code or types the 6-digit PIN. The phone connects to the signaling server and requests an outbound DataConnection to `tvpc-{pin}`.

#### Phase 2: ICE Candidate Discovery & STUN Traversal
1. Both browsers create an `RTCPeerConnection` instance configured with Google's public STUN servers:
   ```typescript
   const PEER_CONFIG = {
     debug: 0,
     config: {
       iceServers: [
         { urls: "stun:stun.l.google.com:19302" },
         { urls: "stun:stun1.l.google.com:19302" },
       ],
     },
   };
   ```
2. **Why exactly 2 STUN servers?**
   - WebRTC implementations (especially Firefox and Safari) log discovery latency warnings and waste candidate gathering time when 5+ STUN/TURN servers are specified. Two globally distributed Google STUN endpoints guarantee high availability without candidate bloat.
3. **Cross-Network Traversal (NAT Hole Punching):**
   - **Local Network:** ICE discovers `host` candidates (private LAN IPs, e.g., `192.168.1.X`), opening direct subnet sockets with zero external internet routing.
   - **Different Networks (Cellular 4G/5G $\leftrightarrow$ Wi-Fi):** ICE gathers `srflx` (Server Reflexive) candidates by querying STUN. The STUN server returns each device's public IP and translated NAT port. Devices execute UDP hole-punching to bridge across the WAN.

> [!NOTE]
> **NAT Compatibility Matrix:**  
> Direct WebRTC P2P succeeds across **Full Cone**, **Restricted Cone**, and **Port Restricted Cone** NAT topologies (~85–90% of residential and mobile connections). If *both* endpoints sit behind strict **Symmetric NAT** (common in military, banking, or enterprise corporate firewalls), STUN port prediction fails; a dedicated TURN relay would be required to tunnel traffic in those edge cases.

---

## 3. Binary File Transfer & Chunking Protocol

WebRTC DataChannels operating over SCTP have protocol limits on individual message packet sizes. Sending raw multi-megabyte `Blob` objects directly will crash or hang the underlying browser message buffer.

### 3.1 The Slicing Protocol
Files are streamed using an indexed chunking protocol with a **32 KB chunk size (`CHUNK_SIZE = 32 * 1024`)**:

```
+----------------------------------------------------------------------------+
| 1. Header Envelope (JSON)                                                 |
| { type: "file-start", fileId: "file-xyz", name: "scan.png",                |
|   size: 1542300, mimeType: "image/png", totalChunks: 48 }                 |
+----------------------------------------------------------------------------+
                                     |
                                     v
+----------------------------------------------------------------------------+
| 2. Binary Chunk Packets (SCTP Packet Stream)                              |
| { type: "file-chunk", fileId: "file-xyz", chunkIndex: 0, data: ArrayBuffer}|
| { type: "file-chunk", fileId: "file-xyz", chunkIndex: 1, data: ArrayBuffer}|
| ...                                                                        |
| { type: "file-chunk", fileId: "file-xyz", chunkIndex: 47, data: ArrayBuffer}|
+----------------------------------------------------------------------------+
                                     |
                                     v
+----------------------------------------------------------------------------+
| 3. Termination Envelope (JSON)                                             |
| { type: "file-end", fileId: "file-xyz" }                                   |
+----------------------------------------------------------------------------+
```

### 3.2 Transmission Logic & Backpressure
```typescript
const slice = file.slice(offset, offset + CHUNK_SIZE);
const reader = new FileReader();

reader.onload = (e) => {
  if (e.target?.result && conn.open) {
    conn.send({
      type: "file-chunk",
      fileId,
      chunkIndex,
      data: e.target.result, // ArrayBuffer
    });

    offset += CHUNK_SIZE;
    chunkIndex++;
    
    // Pacing interval (5ms) to prevent UI thread lockup and SCTP queue saturation
    setTimeout(readAndSendNextChunk, 5);
  }
};

reader.readAsArrayBuffer(slice);
```

### 3.3 Reassembly & Memory Management
The receiver buffers incoming chunks in an in-memory dictionary keyed by `fileId`:
```typescript
incomingFilesRef.current[data.fileId] = {
  name: data.name,
  size: data.size,
  mimeType: data.mimeType,
  totalChunks: data.totalChunks,
  chunks: [], // ArrayBuffer chunks indexed by chunkIndex
};
```
When `file-end` arrives:
1. `const blob = new Blob(fileData.chunks, { type: fileData.mimeType });`
2. An object URL is created: `URL.createObjectURL(blob)`.
3. The temporary buffer `delete incomingFilesRef.current[data.fileId]` is cleared to allow garbage collection.

---

## 4. Clipboard, Links & Sensitive Secrets Protocol

### 4.1 Message Specifications

| Type | Payload Structure | Purpose |
| :--- | :--- | :--- |
| `text` | `{ type: "text", id: string, text: string, timestamp: number }` | Cross-device clipboard notes and code snippets |
| `link` | `{ type: "link", id: string, text: string, timestamp: number }` | URLs (auto-prefixed with `https://`) with direct "Open" button |
| `password` | `{ type: "password", id: string, text: string, burnOnCopy: boolean, timestamp: number }` | Sensitive secrets, Wi-Fi keys, tokens |
| `handshake` | `{ type: "handshake", device: "Phone" \| "PC", timestamp: number }` | Initial connection confirmation and device naming |

### 4.2 "Burn-on-Copy" Memory Shredding
To prevent sensitive tokens, passwords, or credentials from remaining visible on the screen or in browser memory:
1. Secret items are rendered with masked characters (`••••••••••••`) by default with an eye-toggle for manual unmasking.
2. If `burnOnCopy: true`, clicking "Copy Secret" triggers:
   ```typescript
   navigator.clipboard.writeText(textToCopy);
   
   // Shred and wipe after 400ms delay (allowing UI animation)
   setTimeout(() => {
     setItems((prev) =>
       prev.map((i) => (i.id === item.id ? { ...i, isBurned: true, text: "" } : i))
     );
   }, 400);
   ```
3. Once burned, the raw string is cleared from React state (`text: ""`), and the card UI renders a permanent `🔥 Shredded from memory` badge.

### 4.3 Clipboard Auto-Copy Integration
When `autoCopyEnabled` is active on the receiving PC:
```typescript
if (autoCopyRef.current && data.text) {
  navigator.clipboard?.writeText(data.text).then(() => {
    setAutoCopyNotice(isLink ? "Copied Link to Clipboard" : "Copied Text to Clipboard");
    setTimeout(() => setAutoCopyNotice(null), 2500);
  }).catch(() => {
    // Requires document focus or user gesture on certain browsers
  });
}
```

---

## 5. React 19 State Architecture & Lifecycle Stability

### 5.1 Preventing WebSocket Disconnections
A frequent defect in React WebRTC integrations is callback recreation: if a peer callback references state (`role`, `autoCopyEnabled`, `soundEnabled`), updating that state triggers component re-renders, which recreates the callback, which in turn tears down and re-instantiates the `Peer` instance—dropping the active WebSocket signaling connection.

**Solution:** Persistent `useRef` mirroring:
```typescript
const roleRef = useRef<"receiver" | "sender">("receiver");
const autoCopyRef = useRef<boolean>(false);
const soundEnabledRef = useRef<boolean>(true);

useEffect(() => { roleRef.current = role; }, [role]);
useEffect(() => { autoCopyRef.current = autoCopyEnabled; }, [autoCopyEnabled]);
useEffect(() => { soundEnabledRef.current = soundEnabled; }, [soundEnabled]);
```
Callbacks (`handleIncomingData`, `setupConnection`, `initReceiver`, `initSender`) reference `roleRef.current` rather than state, keeping function references stable and preventing peer teardown.

### 5.2 Auto-Reconnection & Peer Error Handling
```typescript
peer.on("disconnected", () => {
  try {
    if (!peer.destroyed) peer.reconnect();
  } catch (err) {
    console.warn("Reconnect failed:", err);
  }
});

peer.on("error", (err: any) => {
  if (err.type === "unavailable-id") {
    // Generated PIN collision: re-generate and restart
    initReceiver();
  } else if (err.type === "peer-unavailable") {
    // Target PIN does not exist on signaling broker
    setErrorMessage("PC screen with this PIN was not found. Please verify the PIN shown on your PC.");
  }
});
```

---

## 6. Audio Synthesizer (Web Audio API)

To avoid downloading external audio assets (`.mp3` / `.wav`), notification sounds are generated on-the-fly using the browser's native `AudioContext` and an oscillator:

```typescript
const now = ctx.currentTime;
const osc = ctx.createOscillator();
const gain = ctx.createGain();

osc.type = "sine";
// Two-tone rising chime: D5 (587.33Hz) -> A5 (880Hz)
osc.frequency.setValueAtTime(587.33, now);
osc.frequency.setValueAtTime(880, now + 0.08);

// ADSR envelope
gain.gain.setValueAtTime(0, now);
gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

osc.connect(gain);
gain.connect(ctx.destination);
osc.start(now);
osc.stop(now + 0.3);
```

---

## 7. Media Capture & Batch Exporting

### 7.1 Native Camera Scanner
Mobile devices access native hardware cameras via an input configured with HTML5 media constraints:
```tsx
<input
  ref={cameraInputRef}
  type="file"
  accept="image/*"
  capture="environment"
  className="hidden"
  onChange={handleFileInputChange}
/>
```
- `capture="environment"` directly launches the device's rear document/photo camera without presenting a generic file picker dialog.

### 7.2 JSZip Multi-File Archive Packaging
When multiple files and notes have been transferred during a session, the receiver can download everything as a single structured `.zip` archive using `JSZip` and `file-saver`:
```typescript
const zip = new JSZip();
fileItems.forEach((item) => {
  if (item.blob) zip.file(item.name || `file-${item.id}`, item.blob);
});

if (textItems.length > 0) {
  const notesFolder = zip.folder("notes");
  textItems.forEach((item, index) => {
    notesFolder?.file(`note-${index + 1}.txt`, item.text || "");
  });
}

const content = await zip.generateAsync({ type: "blob" });
saveAs(content, `SendToPC_${new Date().toISOString().slice(0, 10)}.zip`);
```

---

## 8. Cryptographic Security Model

1. **Transport Layer Security (DTLS):** All WebRTC DataChannels are encrypted end-to-end by default using Datagram Transport Layer Security (DTLS). Eavesdroppers on public Wi-Fi or ISP routers cannot read, decrypt, or alter transferred data.
2. **SCTP Encapsulation:** Data packets run over SCTP encapsulated in DTLS, providing guaranteed in-order delivery without plaintext exposure.
3. **Zero Data Retention:** No payload data touches any application server. The signaling server (`0.peerjs.com`) only passes ephemeral connection metadata (SDP session descriptions and ICE network candidates) and never inspects or stores user transfers.
4. **Session Erasure:** Closing the browser tab destroys all ephemeral encryption keys and in-memory Blob references immediately.
