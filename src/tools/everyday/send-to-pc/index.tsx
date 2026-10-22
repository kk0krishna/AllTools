"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Download, 
  Upload, 
  Check, 
  Copy, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Archive, 
  ShieldCheck, 
  ArrowRight, 
  Share2, 
  X, 
  Zap, 
  ScanLine, 
  Layers,
  FileText,
  File as FileIcon,
  Lock,
  Link2,
  Activity,
  ArrowRightLeft,
  Globe,
  Radio,
  HardDrive
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { 
  TransferItem, 
  TransferProgress, 
  RoleType, 
  ConnectionStatus, 
  ConnectedPeerInfo,
  QueueItem
} from "./types";
import { CHUNK_SIZE, BUFFER_THRESHOLD, HEARTBEAT_INTERVAL_MS, PEER_CONFIG } from "./constants";
import { 
  playChimeSound, 
  triggerVibrate, 
  parseQrSessionId, 
  formatSpeed, 
  formatDuration, 
  downloadBlob, 
  shareFileNative, 
  detectConnectionType,
  detectDeviceName
} from "./utils";
import { QrScannerModal } from "./components/QrScannerModal";
import { ImageLightbox } from "./components/ImageLightbox";
import { SendConsole } from "./components/SendConsole";
import { TransferCard } from "./components/TransferCard";
import { ProtocolStatusCard } from "./components/ProtocolStatusCard";

export function SendToPcTool() {
  // Roles: "receiver" (Receive files / display QR) or "sender" (Send files / connect via PIN/QR)
  const [role, setRole] = useState<RoleType>("receiver");
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("initializing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Peer identification & PIN
  const [receiverPeerId, setReceiverPeerId] = useState<string>("");
  const [pinCode, setPinCode] = useState<string>("");
  const [targetPinInput, setTargetPinInput] = useState<string>("");
  const [connectedPeerInfo, setConnectedPeerInfo] = useState<ConnectedPeerInfo | null>(null);

  // Transfer items & active progress
  const [items, setItems] = useState<TransferItem[]>([]);
  const [activeTransfer, setActiveTransfer] = useState<TransferProgress | null>(null);
  const [queueCount, setQueueCount] = useState<number>(0);

  // Masked passwords state
  const [revealedPasswords, setRevealedPasswords] = useState<{ [id: string]: boolean }>({});

  // Auto-copy state (Notes/Clipboard)
  const [autoCopyEnabled, setAutoCopyEnabled] = useState<boolean>(false);
  const [autoCopyNotice, setAutoCopyNotice] = useState<string | null>(null);
  const [pendingCopyItem, setPendingCopyItem] = useState<{ text: string; label: string } | null>(null);

  // Auto-download state (Receiver Mode: auto-save incoming files to Downloads)
  const [autoDownloadEnabled, setAutoDownloadEnabled] = useState<boolean>(false);
  const [autoDownloadNotice, setAutoDownloadNotice] = useState<string | null>(null);

  // Drag and drop overlay state (full-window)
  const [isWindowDragging, setIsWindowDragging] = useState<boolean>(false);
  const dragCounterRef = useRef<number>(0);

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    name: string;
    size?: number;
    rotation: number;
    zoom: number;
  } | null>(null);

  // UI action feedback states
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedPin, setCopiedPin] = useState<boolean>(false);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  // Persistent Refs to maintain stable callbacks without tearing down Peer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const peerInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connectionRef = useRef<any>(null);
  const roleRef = useRef<RoleType>("receiver");
  const autoCopyRef = useRef<boolean>(false);
  const autoDownloadRef = useRef<boolean>(false);
  const soundEnabledRef = useRef<boolean>(true);

  // Pending clipboard write queued for next user activation
  const pendingClipboardWriteRef = useRef<string | null>(null);

  // Incoming chunk accumulation buffer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const incomingFilesRef = useRef<{ [fileId: string]: any }>({});

  // Queue of files pending sequential transmission
  const sendQueueRef = useRef<QueueItem[]>([]);
  const isTransmittingRef = useRef<boolean>(false);
  const cancelTransferRef = useRef<boolean>(false);

  // Heartbeat keepalive timer
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Hidden native file & camera inputs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state with refs
  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  useEffect(() => {
    autoCopyRef.current = autoCopyEnabled;
  }, [autoCopyEnabled]);

  useEffect(() => {
    autoDownloadRef.current = autoDownloadEnabled;
  }, [autoDownloadEnabled]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const playSound = useCallback(() => {
    playChimeSound(soundEnabledRef.current);
  }, []);

  // =========================================================================
  // TRIPLE-GUARANTEE CLIPBOARD ENGINE (Solves Browser Lack-of-User-Activation)
  // =========================================================================
  const copyToClipboard = useCallback((text: string, label: string = "Note") => {
    if (!text) return;

    // 1. Try immediate Async Clipboard API (succeeds if tab is currently focused)
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setAutoCopyNotice(`Auto-copied ${label} to Clipboard! Ready to paste`);
        setPendingCopyItem(null);
        pendingClipboardWriteRef.current = null;
        setTimeout(() => setAutoCopyNotice(null), 3000);
        return;
      }).catch(() => {
        // Fall through to user-activation hook
      });
    }

    // 2. Queue for the very next user activation (click anywhere / press any key / focus tab)
    pendingClipboardWriteRef.current = text;
    setPendingCopyItem({ text, label });

    const handleUserActivation = () => {
      if (pendingClipboardWriteRef.current) {
        const textToCopy = pendingClipboardWriteRef.current;
        navigator.clipboard?.writeText(textToCopy).then(() => {
          setAutoCopyNotice(`Copied ${label} to Clipboard! Ready to paste`);
          pendingClipboardWriteRef.current = null;
          setPendingCopyItem(null);
          setTimeout(() => setAutoCopyNotice(null), 3000);
        }).catch(() => {});
      }
      window.removeEventListener("pointerdown", handleUserActivation);
      window.removeEventListener("keydown", handleUserActivation);
      window.removeEventListener("focus", handleUserActivation);
    };

    window.addEventListener("pointerdown", handleUserActivation, { once: true });
    window.addEventListener("keydown", handleUserActivation, { once: true });
    window.addEventListener("focus", handleUserActivation, { once: true });
  }, []);

  // Construct pairing URL
  const getPairingUrl = useCallback((): string => {
    if (typeof window === "undefined" || !receiverPeerId) return "";
    const origin = window.location.origin;
    return `${origin}/tools/everyday/send-to-pc?session=${receiverPeerId}`;
  }, [receiverPeerId]);

  // Update connection type & stats (Local LAN vs P2P Direct vs Relay)
  const updateConnectionNetworkStats = useCallback(async () => {
    const conn = connectionRef.current;
    if (!conn || !conn.peerConnection) return;

    try {
      const netInfo = await detectConnectionType(conn.peerConnection);
      setConnectedPeerInfo((prev) => ({
        ...prev,
        localDevice: detectDeviceName(),
        connectionType: netInfo.type,
        localIp: netInfo.localIp,
        remoteIp: netInfo.remoteIp,
        candidateType: netInfo.candidateType,
        remoteCandidateType: netInfo.remoteCandidateType,
        protocol: netInfo.protocol,
        securityCipher: netInfo.securityCipher,
        iceState: netInfo.iceState,
      }));
    } catch {
      // Safe catch
    }
  }, []);

  // Start periodic heartbeat keepalive to prevent mobile/tab channel sleep & measure RTT
  const startHeartbeat = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
    }

    heartbeatTimerRef.current = setInterval(() => {
      const conn = connectionRef.current;
      if (conn && conn.open) {
        try {
          conn.send({
            type: "ping",
            sentAt: Date.now(),
          });
        } catch {
          // Safe catch
        }
      }
    }, HEARTBEAT_INTERVAL_MS);
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
  }, []);

  // Handle incoming data channel messages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleIncomingData = useCallback((data: any) => {
    if (!data) return;

    // 1. Raw Binary Chunk (Direct ArrayBuffer transmission for maximum throughput)
    if (data instanceof ArrayBuffer || (data.byteLength !== undefined && !(data.type))) {
      const activeFileId = Object.keys(incomingFilesRef.current)[0];
      if (activeFileId) {
        const fileData = incomingFilesRef.current[activeFileId];
        if (fileData) {
          fileData.chunks.push(data);
          fileData.receivedBytes += data.byteLength;

          const now = Date.now();
          const elapsed = (now - fileData.startTime) / 1000;
          const speedBytesPerSec = elapsed > 0 ? fileData.receivedBytes / elapsed : 0;
          const remainingBytes = Math.max(0, fileData.size - fileData.receivedBytes);
          const remainingSeconds = speedBytesPerSec > 0 ? remainingBytes / speedBytesPerSec : 0;
          const progress = Math.min(100, Math.round((fileData.receivedBytes / fileData.size) * 100));

          setActiveTransfer({
            fileId: activeFileId,
            name: fileData.name,
            size: fileData.size,
            progress,
            direction: "receiving",
            speedBytesPerSec,
            remainingSeconds,
            transferredBytes: fileData.receivedBytes,
          });
        }
      }
      return;
    }

    if (typeof data !== "object") return;

    // 2. Handshake
    if (data.type === "handshake") {
      setConnectedPeerInfo((prev) => ({
        ...prev,
        device: data.device || (roleRef.current === "receiver" ? "Remote Sender" : "Remote Receiver"),
        localDevice: detectDeviceName(),
        connectedAt: data.timestamp || Date.now(),
      }));
      setConnectionStatus("connected");
      setErrorMessage("");
      playSound();
      triggerVibrate();
      setTimeout(updateConnectionNetworkStats, 600);
      return;
    }

    // 3. Heartbeat Ping / Pong
    if (data.type === "ping") {
      const conn = connectionRef.current;
      if (conn && conn.open) {
        try {
          conn.send({
            type: "pong",
            sentAt: data.sentAt,
          });
        } catch {
          // Safe catch
        }
      }
      return;
    }

    if (data.type === "pong") {
      if (data.sentAt) {
        const rtt = Math.max(1, Date.now() - data.sentAt);
        setConnectedPeerInfo((prev) => (prev ? { ...prev, latencyMs: rtt } : prev));
      }
      return;
    }

    // 4. Text or Link
    if (data.type === "text" || data.type === "link") {
      const isLink = data.type === "link";
      const newItem: TransferItem = {
        id: data.id || Math.random().toString(36).substring(2, 9),
        type: isLink ? "link" : "text",
        text: data.text,
        timestamp: data.timestamp || Date.now(),
        sender: roleRef.current === "receiver" ? "sender" : "receiver",
      };
      setItems((prev) => [newItem, ...prev]);
      playSound();
      triggerVibrate();

      if (autoCopyRef.current && data.text) {
        copyToClipboard(data.text, isLink ? "Link" : "Note");
      }
      return;
    }

    // 5. Confidential Secret / Password
    if (data.type === "password") {
      const newItem: TransferItem = {
        id: data.id || Math.random().toString(36).substring(2, 9),
        type: "password",
        text: data.text,
        burnOnCopy: data.burnOnCopy ?? true,
        isBurned: false,
        timestamp: data.timestamp || Date.now(),
        sender: roleRef.current === "receiver" ? "sender" : "receiver",
      };
      setItems((prev) => [newItem, ...prev]);
      playSound();
      triggerVibrate();
      return;
    }

    // 6. File Start Envelope
    if (data.type === "file-start") {
      incomingFilesRef.current[data.fileId] = {
        name: data.name,
        size: data.size,
        mimeType: data.mimeType,
        totalChunks: data.totalChunks,
        chunkSize: data.chunkSize || CHUNK_SIZE,
        chunks: [],
        receivedBytes: 0,
        startTime: Date.now(),
      };

      setActiveTransfer({
        fileId: data.fileId,
        name: data.name,
        size: data.size,
        progress: 0,
        direction: "receiving",
        transferredBytes: 0,
      });
      return;
    }

    // 7. Structured File Chunk Envelope (Fallback compatibility)
    if (data.type === "file-chunk") {
      const fileData = incomingFilesRef.current[data.fileId];
      if (fileData) {
        fileData.chunks[data.chunkIndex] = data.data;
        const chunkSize = data.data?.byteLength || CHUNK_SIZE;
        fileData.receivedBytes += chunkSize;

        const now = Date.now();
        const elapsed = (now - fileData.startTime) / 1000;
        const speedBytesPerSec = elapsed > 0 ? fileData.receivedBytes / elapsed : 0;
        const remainingBytes = Math.max(0, fileData.size - fileData.receivedBytes);
        const remainingSeconds = speedBytesPerSec > 0 ? remainingBytes / speedBytesPerSec : 0;
        const progress = Math.min(100, Math.round((fileData.receivedBytes / fileData.size) * 100));

        setActiveTransfer({
          fileId: data.fileId,
          name: fileData.name,
          size: fileData.size,
          progress,
          direction: "receiving",
          speedBytesPerSec,
          remainingSeconds,
          transferredBytes: fileData.receivedBytes,
        });
      }
      return;
    }

    // 8. File End Envelope
    if (data.type === "file-end") {
      const fileData = incomingFilesRef.current[data.fileId];
      if (fileData) {
        const blob = new Blob(fileData.chunks, { type: fileData.mimeType });
        const url = URL.createObjectURL(blob);
        const newItem: TransferItem = {
          id: data.fileId,
          type: "file",
          name: fileData.name,
          size: fileData.size,
          mimeType: fileData.mimeType,
          blob,
          url,
          timestamp: Date.now(),
          sender: roleRef.current === "receiver" ? "sender" : "receiver",
        };

        setItems((prev) => [newItem, ...prev]);
        delete incomingFilesRef.current[data.fileId];
        setActiveTransfer(null);
        playSound();
        triggerVibrate();

        // Auto-download on receiver if enabled
        if (autoDownloadRef.current && roleRef.current === "receiver") {
          downloadBlob(blob, fileData.name).then((success) => {
            if (success) {
              setAutoDownloadNotice(`Saved "${fileData.name}" to Downloads`);
              setTimeout(() => setAutoDownloadNotice(null), 3500);
            }
          });
        }
      }
      return;
    }

    // 9. Transfer Cancel Envelope
    if (data.type === "file-cancel") {
      if (data.fileId && incomingFilesRef.current[data.fileId]) {
        delete incomingFilesRef.current[data.fileId];
      }
      setActiveTransfer(null);
    }
  }, [playSound, copyToClipboard, updateConnectionNetworkStats]);

  // Setup connection handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setupConnection = useCallback((conn: any) => {
    connectionRef.current = conn;

    conn.on("open", () => {
      setConnectionStatus("connected");
      setErrorMessage("");
      conn.send({
        type: "handshake",
        device: detectDeviceName(),
        role: roleRef.current,
        timestamp: Date.now(),
      });
      playSound();
      triggerVibrate();
      startHeartbeat();
      setTimeout(updateConnectionNetworkStats, 1000);
    });

    conn.on("data", (data: unknown) => {
      handleIncomingData(data);
    });

    conn.on("close", () => {
      setConnectionStatus("ready");
      setConnectedPeerInfo(null);
      connectionRef.current = null;
      stopHeartbeat();
    });

    conn.on("error", (err: unknown) => {
      console.warn("DataConnection error:", err);
      setConnectionStatus("ready");
      stopHeartbeat();
    });
  }, [handleIncomingData, playSound, startHeartbeat, stopHeartbeat, updateConnectionNetworkStats]);

  // Initialize Receiver
  const initReceiver = useCallback(async () => {
    setConnectionStatus("initializing");
    setErrorMessage("");
    try {
      const { Peer } = await import("peerjs");
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      const generatedId = `tvpc-${pin}`;
      setPinCode(pin);
      setReceiverPeerId(generatedId);

      if (peerInstanceRef.current) {
        try {
          peerInstanceRef.current.destroy();
        } catch {
          // Safe ignore
        }
      }

      const peer = new Peer(generatedId, PEER_CONFIG);

      peer.on("open", () => {
        setConnectionStatus("ready");
        setErrorMessage("");
      });

      peer.on("disconnected", () => {
        try {
          if (!peer.destroyed) peer.reconnect();
        } catch {
          // Safe catch
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      peer.on("connection", (conn: any) => {
        setupConnection(conn);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      peer.on("error", (err: any) => {
        console.warn("Peer receiver error:", err);
        if (err.type === "unavailable-id") {
          initReceiver();
        } else {
          setConnectionStatus("ready");
        }
      });

      peerInstanceRef.current = peer;
    } catch (err) {
      console.error("Peer initialization failed:", err);
      setConnectionStatus("error");
      setErrorMessage("Could not start wireless peer engine. Please refresh.");
    }
  }, [setupConnection]);

  // Initialize Sender
  const initSender = useCallback(async (targetPeerId: string) => {
    setConnectionStatus("connecting");
    setErrorMessage("");
    try {
      const { Peer } = await import("peerjs");

      if (peerInstanceRef.current) {
        try {
          peerInstanceRef.current.destroy();
        } catch {
          // Safe ignore
        }
      }

      const senderPeer = new Peer(PEER_CONFIG);

      senderPeer.on("open", () => {
        const conn = senderPeer.connect(targetPeerId, { reliable: true });
        setupConnection(conn);
      });

      senderPeer.on("disconnected", () => {
        try {
          if (!senderPeer.destroyed) senderPeer.reconnect();
        } catch {
          // Safe catch
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      senderPeer.on("error", (err: any) => {
        console.warn("Peer sender error:", err);
        setConnectionStatus("ready");
        if (err.type === "peer-unavailable") {
          setErrorMessage("Receiver with this PIN was not found. Please verify the PIN shown on the receiver screen.");
        } else {
          setErrorMessage("Could not connect to receiver. Verify PIN or QR code.");
        }
      });

      peerInstanceRef.current = senderPeer;
    } catch (err) {
      console.error("Sender initialization failed:", err);
      setConnectionStatus("error");
      setErrorMessage("Could not start sender engine. Please check network connection.");
    }
  }, [setupConnection]);

  // QR scan handler
  const handleQrDetected = useCallback((rawQrData: string) => {
    if (!rawQrData) return;
    const targetId = parseQrSessionId(rawQrData);

    if (targetId) {
      setIsScannerOpen(false);
      playSound();
      triggerVibrate();
      setRole("sender");
      initSender(targetId);
    }
  }, [playSound, initSender]);

  // Mount effect: detect session query param or default device role
  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const sessionParam = searchParams.get("session") || searchParams.get("peer");

    if (sessionParam) {
      setRole("sender");
      initSender(sessionParam);
    } else {
      setRole("receiver");
      initReceiver();
    }

    return () => {
      stopHeartbeat();
      if (peerInstanceRef.current) {
        try {
          peerInstanceRef.current.destroy();
        } catch {
          // Safe ignore
        }
      }
    };
  }, [initReceiver, initSender, stopHeartbeat]);

  // =========================================================================
  // HIGH-SPEED RESILIENT FILE TRANSMISSION ENGINE (Event-Driven Backpressure)
  // =========================================================================

  // Helper: Wait for RTCDataChannel buffer to drain below threshold
  const waitForBufferDrain = (dataChannel: RTCDataChannel): Promise<void> => {
    return new Promise((resolve) => {
      if (dataChannel.bufferedAmount <= BUFFER_THRESHOLD) {
        resolve();
        return;
      }

      dataChannel.bufferedAmountLowThreshold = BUFFER_THRESHOLD;
      const onLow = () => {
        dataChannel.removeEventListener("bufferedamountlow", onLow);
        resolve();
      };

      dataChannel.addEventListener("bufferedamountlow", onLow);
      // Failsafe timeout to prevent deadlocks
      setTimeout(onLow, 120);
    });
  };

  // Transmit a single file with adaptive chunking and real-time telemetry
  const transmitFile = async (file: File): Promise<boolean> => {
    const conn = connectionRef.current;
    if (!conn || !conn.open) return false;

    const fileId = "file-" + Math.random().toString(36).substring(2, 9);
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const dataChannel: RTCDataChannel | undefined = conn.dataChannel;

    cancelTransferRef.current = false;

    // Send header envelope
    conn.send({
      type: "file-start",
      fileId,
      name: file.name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      totalChunks,
      chunkSize: CHUNK_SIZE,
    });

    setActiveTransfer({
      fileId,
      name: file.name,
      size: file.size,
      progress: 0,
      direction: "sending",
      transferredBytes: 0,
      totalChunks,
      currentChunk: 0,
    });

    let offset = 0;
    let chunkIndex = 0;
    const startTime = Date.now();
    let lastProgressUpdate = 0;

    while (offset < file.size) {
      if (cancelTransferRef.current || !conn.open) {
        conn.send({ type: "file-cancel", fileId });
        setActiveTransfer(null);
        return false;
      }

      // Backpressure: if socket buffer is filled, wait for it to drain
      if (dataChannel && dataChannel.bufferedAmount > BUFFER_THRESHOLD) {
        await waitForBufferDrain(dataChannel);
      }

      const end = Math.min(offset + CHUNK_SIZE, file.size);
      const slice = file.slice(offset, end);
      const arrayBuffer = await slice.arrayBuffer();

      // Send chunk directly
      conn.send({
        type: "file-chunk",
        fileId,
        chunkIndex,
        data: arrayBuffer,
      });

      offset = end;
      chunkIndex++;

      // Real-time speed and ETA calculation (throttled to every 150ms to keep UI snappy)
      const now = Date.now();
      if (now - lastProgressUpdate > 150 || offset >= file.size) {
        lastProgressUpdate = now;
        const elapsedSec = (now - startTime) / 1000;
        const speedBytesPerSec = elapsedSec > 0 ? offset / elapsedSec : 0;
        const remainingBytes = file.size - offset;
        const remainingSeconds = speedBytesPerSec > 0 ? remainingBytes / speedBytesPerSec : 0;
        const progress = Math.min(100, Math.round((offset / file.size) * 100));

        setActiveTransfer({
          fileId,
          name: file.name,
          size: file.size,
          progress,
          direction: "sending",
          speedBytesPerSec,
          remainingSeconds,
          transferredBytes: offset,
          totalChunks,
          currentChunk: chunkIndex,
        });
      }
    }

    // Send termination envelope
    conn.send({ type: "file-end", fileId });
    setActiveTransfer(null);

    const blobUrl = URL.createObjectURL(file);
    setItems((prev) => [
      {
        id: fileId,
        type: "file",
        name: file.name,
        size: file.size,
        mimeType: file.type || "application/octet-stream",
        blob: file,
        url: blobUrl,
        timestamp: Date.now(),
        sender: roleRef.current === "receiver" ? "receiver" : "sender",
      },
      ...prev,
    ]);

    playSound();
    triggerVibrate();
    return true;
  };

  // Sequential Queue Processor: processes multiple files without buffer collisions
  const processSendQueue = useCallback(async () => {
    if (isTransmittingRef.current) return;
    if (sendQueueRef.current.length === 0) {
      setQueueCount(0);
      return;
    }

    isTransmittingRef.current = true;
    setQueueCount(sendQueueRef.current.length);

    while (sendQueueRef.current.length > 0) {
      const nextItem = sendQueueRef.current[0];
      const success = await transmitFile(nextItem.file);

      // Remove finished item from queue
      sendQueueRef.current.shift();
      setQueueCount(sendQueueRef.current.length);

      if (!success && cancelTransferRef.current) {
        // If cancelled, clear remainder of queue
        sendQueueRef.current = [];
        setQueueCount(0);
        break;
      }
    }

    isTransmittingRef.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Enqueue single or multiple files
  const enqueueFiles = useCallback((files: File[]) => {
    if (!connectionRef.current || connectionStatus !== "connected") {
      setErrorMessage("No device connected. Please pair sender and receiver first.");
      return;
    }

    if (files.length === 0) return;

    const newQueueItems: QueueItem[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      size: file.size,
      status: "queued",
    }));

    sendQueueRef.current.push(...newQueueItems);
    setQueueCount(sendQueueRef.current.length);
    processSendQueue();
  }, [connectionStatus, processSendQueue]);

  const handleCancelActiveTransfer = () => {
    cancelTransferRef.current = true;
    setActiveTransfer(null);
    sendQueueRef.current = [];
    setQueueCount(0);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const fileList = Array.from(e.target.files);
    enqueueFiles(fileList);
    e.target.value = "";
  };

  // Send text note
  const sendTextMessage = (text: string) => {
    if (!text.trim() || !connectionRef.current || connectionStatus !== "connected") return;

    const textId = "txt-" + Math.random().toString(36).substring(2, 9);
    connectionRef.current.send({
      type: "text",
      id: textId,
      text: text.trim(),
      timestamp: Date.now(),
    });

    setItems((prev) => [
      {
        id: textId,
        type: "text",
        text: text.trim(),
        timestamp: Date.now(),
        sender: role === "receiver" ? "receiver" : "sender",
      },
      ...prev,
    ]);

    playSound();
    triggerVibrate();
  };

  // Send confidential password
  const sendPasswordMessage = (password: string, burnOnCopy: boolean) => {
    if (!password.trim() || !connectionRef.current || connectionStatus !== "connected") return;

    const passId = "pass-" + Math.random().toString(36).substring(2, 9);
    connectionRef.current.send({
      type: "password",
      id: passId,
      text: password.trim(),
      burnOnCopy,
      timestamp: Date.now(),
    });

    setItems((prev) => [
      {
        id: passId,
        type: "password",
        text: password.trim(),
        burnOnCopy,
        isBurned: false,
        timestamp: Date.now(),
        sender: role === "receiver" ? "receiver" : "sender",
      },
      ...prev,
    ]);

    playSound();
    triggerVibrate();
  };

  // Send URL
  const sendLinkMessage = (url: string) => {
    if (!url.trim() || !connectionRef.current || connectionStatus !== "connected") return;

    const linkId = "link-" + Math.random().toString(36).substring(2, 9);
    connectionRef.current.send({
      type: "link",
      id: linkId,
      text: url.trim(),
      timestamp: Date.now(),
    });

    setItems((prev) => [
      {
        id: linkId,
        type: "link",
        text: url.trim(),
        timestamp: Date.now(),
        sender: role === "receiver" ? "receiver" : "sender",
      },
      ...prev,
    ]);

    playSound();
    triggerVibrate();
  };

  // =========================================================================
  // GLOBAL DRAG & DROP AND CLIPBOARD PASTE (CTRL+V)
  // =========================================================================
  useEffect(() => {
    const handleWindowDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current += 1;
      if (e.dataTransfer && e.dataTransfer.types.includes("Files")) {
        setIsWindowDragging(true);
      }
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current -= 1;
      if (dragCounterRef.current <= 0) {
        dragCounterRef.current = 0;
        setIsWindowDragging(false);
      }
    };

    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current = 0;
      setIsWindowDragging(false);

      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        enqueueFiles(droppedFiles);
      }
    };

    const handleWindowPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      if (e.clipboardData && e.clipboardData.files.length > 0) {
        e.preventDefault();
        const pastedFiles = Array.from(e.clipboardData.files);
        enqueueFiles(pastedFiles);
      }
    };

    window.addEventListener("dragenter", handleWindowDragEnter);
    window.addEventListener("dragleave", handleWindowDragLeave);
    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("drop", handleWindowDrop);
    window.addEventListener("paste", handleWindowPaste);

    return () => {
      window.removeEventListener("dragenter", handleWindowDragEnter);
      window.removeEventListener("dragleave", handleWindowDragLeave);
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("drop", handleWindowDrop);
      window.removeEventListener("paste", handleWindowPaste);
    };
  }, [enqueueFiles]);

  const handleCopyLink = () => {
    const url = getPairingUrl();
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPin = () => {
    if (!pinCode) return;
    navigator.clipboard.writeText(pinCode);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleConnectByPin = () => {
    const cleanPin = targetPinInput.trim().replace(/\D/g, "");
    if (cleanPin.length !== 6) {
      setErrorMessage("Please enter the 6-digit PIN shown on the receiver screen.");
      return;
    }
    const targetId = `tvpc-${cleanPin}`;
    initSender(targetId);
  };

  const handlePinInputChange = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 6);
    setTargetPinInput(clean);
    if (clean.length === 6) {
      const targetId = `tvpc-${clean}`;
      initSender(targetId);
    }
  };

  const handleCopyContent = (item: TransferItem) => {
    if (item.isBurned) return;
    const textToCopy = item.text || "";
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    setCopiedItemId(item.id);
    setTimeout(() => setCopiedItemId(null), 2000);

    // Burn-on-copy self-destruct
    if (item.type === "password" && item.burnOnCopy) {
      setTimeout(() => {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isBurned: true, text: "" } : i))
        );
      }, 400);
    }
  };

  const toggleRevealPassword = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownloadItem = async (item: TransferItem) => {
    if (item.type === "file" && item.blob) {
      await downloadBlob(item.blob, item.name || "downloaded-file");
    } else if (item.type === "text" && item.text) {
      const blob = new Blob([item.text], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `note-${item.id.substring(0, 6)}.txt`);
    }
  };

  const handleShareNative = async (item: TransferItem) => {
    if (item.type === "file" && item.blob) {
      const shared = await shareFileNative(item.blob, item.name || "shared-file");
      if (!shared) {
        handleDownloadItem(item);
      }
    }
  };

  const handleDownloadAllZip = async () => {
    const fileItems = items.filter((item) => item.type === "file" && item.blob);
    if (fileItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      fileItems.forEach((item) => {
        if (item.blob) {
          zip.file(item.name || `file-${item.id}`, item.blob);
        }
      });

      const textItems = items.filter((item) => item.type === "text" && item.text);
      if (textItems.length > 0) {
        const notesFolder = zip.folder("notes");
        textItems.forEach((item, index) => {
          notesFolder?.file(`note-${index + 1}.txt`, item.text || "");
        });
      }

      const content = await zip.generateAsync({ type: "blob" });
      const dateStr = new Date().toISOString().slice(0, 10);
      saveAs(content, `SendToPC_${dateStr}.zip`);
    } finally {
      setIsZipping(false);
    }
  };

  const openImageModal = (item: TransferItem) => {
    if (!item.url) return;
    setPreviewImage({
      url: item.url,
      name: item.name || "Image Preview",
      size: item.size,
      rotation: 0,
      zoom: 1,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-5 animate-in fade-in duration-200 relative">
      {/* Hidden File and Camera Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* FULL-WINDOW DRAG AND DROP OVERLAY */}
      {isWindowDragging && (
        <div className="fixed inset-0 z-50 bg-background/85 backdrop-blur-md flex flex-col items-center justify-center p-6 border-4 border-dashed border-primary animate-in fade-in zoom-in-95 pointer-events-none">
          <div className="h-20 w-20 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center shadow-2xl mb-4 animate-bounce">
            <Upload className="h-10 w-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Drop Files Anywhere to Send via OmniDrop
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md text-center">
            {connectionStatus === "connected"
              ? "Files will stream directly to your connected device with zero server storage."
              : "Connect sender and receiver to complete the wireless transfer."}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold px-3 py-1 text-xs flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-emerald-500" />
              <span>0 Internet Data Used on Local Wi-Fi</span>
            </Badge>
          </div>
        </div>
      )}

      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/60 backdrop-blur-xl border border-border/60 p-3 sm:p-4 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-base sm:text-lg text-foreground tracking-tight">
                OmniDrop
              </h1>
              <Badge variant="outline" className="text-[10px] px-2 py-0 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                <ShieldCheck className="h-3 w-3 mr-1 inline" /> 100% P2P Encrypted
              </Badge>

              {connectedPeerInfo?.connectionType === "local-lan" ? (
                <Badge variant="outline" className="text-[10px] px-2 py-0 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 flex items-center gap-1">
                  <Radio className="h-3 w-3" /> Local Wi-Fi (0 Data Used)
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] px-2 py-0 border-primary/30 text-primary bg-primary/10">
                  Universal Any-Device
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Universal wireless file &amp; clipboard bridge across any device (PC, Phone, Mac, Tablet)
            </p>
          </div>
        </div>

        {/* Mode Switcher & Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <div className="inline-flex items-center p-0.5 rounded-xl bg-muted/60 text-xs font-medium border border-border/40">
            <button
              onClick={() => {
                setRole("receiver");
                setErrorMessage("");
                if (!receiverPeerId) initReceiver();
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                role === "receiver"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Receiver</span>
            </button>
            <button
              onClick={() => {
                setRole("sender");
                setErrorMessage("");
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                role === "sender"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Sender</span>
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute alert sounds" : "Unmute alert sounds"}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Floating Auto-Copy Notice Banner */}
      {autoCopyNotice && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4" /> {autoCopyNotice}
          </span>
          <Check className="h-4 w-4" />
        </div>
      )}

      {/* Floating Auto-Download Notice Banner */}
      {autoDownloadNotice && (
        <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-2xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <Download className="h-4 w-4 animate-bounce" /> {autoDownloadNotice}
          </span>
          <Check className="h-4 w-4" />
        </div>
      )}

      {/* Floating 1-Click Action Pill When Note Arrives from Sender */}
      {pendingCopyItem && (
        <div className="p-3 bg-primary/10 border-2 border-primary/40 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in shadow-md">
          <div className="flex items-center gap-2 overflow-hidden text-xs">
            <Copy className="h-4 w-4 text-primary shrink-0 animate-bounce" />
            <span className="font-bold text-foreground">Click anywhere or button to copy:</span>
            <span className="font-mono text-muted-foreground truncate max-w-xs">&ldquo;{pendingCopyItem.text}&rdquo;</span>
          </div>
          <Button
            size="sm"
            onClick={() => copyToClipboard(pendingCopyItem.text, pendingCopyItem.label)}
            className="rounded-xl text-xs h-7.5 px-3.5 font-bold shrink-0 shadow-xs"
          >
            Copy Note (Ctrl+V)
          </Button>
        </div>
      )}

      {/* Error alert with clean dismiss */}
      {errorMessage && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-700 dark:text-amber-300 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage("")}
            className="text-muted-foreground hover:text-foreground p-1 text-xs"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ACTIVE TRANSFER PROGRESS (SPEEDOMETER & REALTIME TELEMETRY) */}
      {activeTransfer && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl space-y-2 animate-in fade-in shadow-sm">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="flex items-center gap-2 text-primary font-bold">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              {activeTransfer.direction === "sending" ? "Sending" : "Receiving"} &ldquo;{activeTransfer.name}&rdquo;
              {queueCount > 1 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                  Queue: {queueCount} left
                </Badge>
              )}
            </span>
            <div className="flex items-center gap-2 font-mono">
              {activeTransfer.speedBytesPerSec !== undefined && activeTransfer.speedBytesPerSec > 0 && (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3 text-primary inline" />
                  <span>{formatSpeed(activeTransfer.speedBytesPerSec)}</span>
                </span>
              )}
              {activeTransfer.remainingSeconds !== undefined && activeTransfer.remainingSeconds > 0 && (
                <span className="text-[11px] text-muted-foreground">
                  • {formatDuration(activeTransfer.remainingSeconds)} left
                </span>
              )}
              <span className="text-primary font-bold text-xs">{activeTransfer.progress}%</span>
            </div>
          </div>

          <div className="w-full bg-primary/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-150 rounded-full"
              style={{ width: `${activeTransfer.progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-0.5">
            <span>Direct in-memory peer stream</span>
            <button
              onClick={handleCancelActiveTransfer}
              className="text-destructive hover:underline font-semibold"
            >
              Cancel Transfer
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ROLE 1: RECEIVER */}
      {/* ======================================================== */}
      {role === "receiver" && (
        <div className="space-y-4">
          {connectionStatus !== "connected" ? (
            /* UNPAIRED STATE: Minimalist QR & PIN Hero */
            <>
              <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl p-5 sm:p-7 shadow-xs text-center space-y-4">
              <div className="space-y-1 max-w-md mx-auto">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  Scan QR with Sender Device
                </h2>
                <p className="text-xs text-muted-foreground">
                  Point the camera on your sender device at this QR code, or enter the 6-digit PIN on the sender.
                </p>
              </div>

              {/* Crisp High-Contrast QR Code Container */}
              <div className="flex flex-col items-center justify-center">
                <div className="p-4 bg-white rounded-2xl shadow-md transition-all inline-block">
                  {connectionStatus === "initializing" ? (
                    <div className="w-52 h-52 flex flex-col items-center justify-center text-muted-foreground gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-xs">Generating Pairing QR...</span>
                    </div>
                  ) : (
                    <QRCodeSVG
                      value={getPairingUrl() || "https://clinikkit.web.app"}
                      size={210}
                      level="M"
                      includeMargin={true}
                      marginSize={2}
                      className="rounded-md"
                    />
                  )}
                </div>

                {/* 6-Digit PIN Callout */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <div className="flex items-center gap-2 bg-muted/60 border border-border/60 px-3.5 py-1.5 rounded-xl">
                    <span className="text-xs text-muted-foreground font-medium">PIN:</span>
                    <span className="font-mono font-bold tracking-widest text-base text-primary">
                      {pinCode ? `${pinCode.slice(0, 3)} ${pinCode.slice(3)}` : "------"}
                    </span>
                    <button
                      onClick={handleCopyPin}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy PIN Code"
                    >
                      {copiedPin ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="rounded-xl border-border/60 text-xs h-8 font-medium"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" /> Copied Link
                      </>
                    ) : (
                      <>
                        <Share2 className="h-3.5 w-3.5 mr-1" /> Copy Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Protocol & Transfer Architecture Specifications */}
            <ProtocolStatusCard
              connectedPeerInfo={connectedPeerInfo}
              connectionStatus={connectionStatus}
              role={role}
              onRefreshStats={updateConnectionNetworkStats}
            />
          </>
          ) : (
            /* PAIRED STATE: Live Console & Transfer Stream */
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Active Connection Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Wifi className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-foreground">
                        {connectedPeerInfo?.device || "Sender"} Connected
                      </span>
                      {connectedPeerInfo?.latencyMs !== undefined && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                          <Activity className="h-2.5 w-2.5 mr-1 inline" /> {connectedPeerInfo.latencyMs}ms
                        </Badge>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                      {connectedPeerInfo?.connectionType === "local-lan" ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <Radio className="h-3 w-3" /> Direct Local Wi-Fi (0 Data Used • Unlimited Speed)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" /> Direct Encrypted P2P (Any Network)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                  {/* Auto-Copy Toggle */}
                  <button
                    onClick={() => {
                      const next = !autoCopyEnabled;
                      setAutoCopyEnabled(next);
                      if (next) {
                        setAutoCopyNotice("Auto-copy ON: incoming notes copy directly to clipboard");
                        setTimeout(() => setAutoCopyNotice(null), 3000);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      autoCopyEnabled
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-background/80 text-muted-foreground hover:text-foreground border-border/60"
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5" /> Auto-copy {autoCopyEnabled ? "ON" : "OFF"}
                  </button>

                  {/* Auto-Download Files Toggle */}
                  <button
                    onClick={() => {
                      const next = !autoDownloadEnabled;
                      setAutoDownloadEnabled(next);
                      if (next) {
                        setAutoDownloadNotice("Auto-download ON: incoming files save immediately to Downloads");
                        setTimeout(() => setAutoDownloadNotice(null), 3000);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      autoDownloadEnabled
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-background/80 text-muted-foreground hover:text-foreground border-border/60"
                    }`}
                  >
                    <Download className="h-3.5 w-3.5" /> Auto-save {autoDownloadEnabled ? "ON" : "OFF"}
                  </button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-xl text-xs text-muted-foreground hover:text-destructive h-8 px-2.5"
                    onClick={() => {
                      connectionRef.current?.close();
                      setConnectionStatus("ready");
                    }}
                  >
                    <WifiOff className="h-3.5 w-3.5 mr-1" /> Disconnect
                  </Button>
                </div>
              </div>

              {/* Receiver Send Console */}
              <SendConsole
                title="Send to Connected Device"
                onCameraClick={() => cameraInputRef.current?.click()}
                onFileSelectClick={() => fileInputRef.current?.click()}
                onFilesDrop={enqueueFiles}
                onSendText={sendTextMessage}
                onSendPassword={sendPasswordMessage}
                onSendLink={sendLinkMessage}
              />

              {/* Transferred Feed Header */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs sm:text-sm text-foreground">
                    Transferred Items
                  </h4>
                  <Badge variant="secondary" className="text-[10px] px-2 py-0">
                    {items.length}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  {items.some((i) => i.type === "file") && (
                    <Button
                      size="sm"
                      onClick={handleDownloadAllZip}
                      disabled={isZipping}
                      className="rounded-xl font-semibold text-xs h-7.5 shadow-xs"
                    >
                      {isZipping ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> Packaging ZIP...
                        </>
                      ) : (
                        <>
                          <Archive className="h-3.5 w-3.5 mr-1" /> Download All (ZIP)
                        </>
                      )}
                    </Button>
                  )}
                  {items.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setItems([])}
                      className="rounded-xl text-xs h-7.5 px-2.5 text-muted-foreground hover:text-destructive border-border/60"
                      title="Clear feed"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Transferred Items Grid */}
              {items.length === 0 ? (
                <div className="p-8 border border-dashed border-border/80 rounded-3xl text-center space-y-2 bg-card/20">
                  <Layers className="h-8 w-8 text-muted-foreground/60 mx-auto" />
                  <p className="text-xs font-semibold text-foreground">Ready for transfers</p>
                  <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                    Send files, photos, or notes from the sender device. Transfers stream live with zero cloud storage.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((item) => (
                    <TransferCard
                      key={item.id}
                      item={item}
                      isPasswordRevealed={Boolean(revealedPasswords[item.id])}
                      onToggleRevealPassword={toggleRevealPassword}
                      onOpenImageModal={openImageModal}
                      onDownloadItem={handleDownloadItem}
                      onShareNative={handleShareNative}
                      onCopyContent={handleCopyContent}
                      isCopied={copiedItemId === item.id}
                    />
                  ))}
                </div>
              )}

              {/* Protocol & Transfer Architecture Specifications (Discreetly below shared files history) */}
              <ProtocolStatusCard
                connectedPeerInfo={connectedPeerInfo}
                connectionStatus={connectionStatus}
                role={role}
                onRefreshStats={updateConnectionNetworkStats}
              />
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* ROLE 2: SENDER */}
      {/* ======================================================== */}
      {role === "sender" && (
        <div className="space-y-4">
          {connectionStatus !== "connected" ? (
            /* Pair to Receiver with Camera Scanner + PIN Fallback */
            <>
              <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl p-5 sm:p-7 space-y-4 text-center max-w-sm mx-auto shadow-xs">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
                <Upload className="h-5 w-5" />
              </div>

              <div className="space-y-1">
                <h2 className="font-bold text-base sm:text-lg text-foreground">
                  Connect to Receiver
                </h2>
                <p className="text-xs text-muted-foreground">
                  Scan the QR code shown on the receiver screen or enter the 6-digit PIN.
                </p>
              </div>

              {/* PRIMARY PROMINENT ACTION: IN-BROWSER SCANNER BUTTON */}
              <div className="space-y-2.5 pt-1">
                <Button
                  onClick={() => setIsScannerOpen(true)}
                  className="w-full h-12 rounded-2xl font-bold text-sm shadow-sm gap-2"
                >
                  <ScanLine className="h-4.5 w-4.5" /> Scan QR with Camera
                </Button>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                    <span className="bg-card px-2 text-muted-foreground font-semibold">Or enter 6-digit PIN</span>
                  </div>
                </div>

                {/* 6-DIGIT PIN INPUT WITH INSTANT AUTO-CONNECT */}
                <div className="space-y-2">
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="------"
                    value={targetPinInput}
                    onChange={(e) => handlePinInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleConnectByPin();
                    }}
                    className="text-center font-mono text-2xl tracking-widest font-bold h-12 rounded-2xl border-border/70 placeholder:tracking-widest"
                  />
                  <Button
                    onClick={handleConnectByPin}
                    disabled={connectionStatus === "connecting" || targetPinInput.trim().length !== 6}
                    variant="secondary"
                    className="w-full h-10 rounded-xl font-bold text-xs"
                  >
                    {connectionStatus === "connecting" ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Connecting...
                      </>
                    ) : (
                      <>
                        Connect to Receiver <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Protocol & Transfer Architecture Specifications */}
            <ProtocolStatusCard
              connectedPeerInfo={connectedPeerInfo}
              connectionStatus={connectionStatus}
              role={role}
              onRefreshStats={updateConnectionNetworkStats}
            />
          </>
          ) : (
            /* Sender Paired Console */
            <div className="max-w-2xl mx-auto space-y-3.5 animate-in fade-in">
              <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-foreground">
                      Connected to {connectedPeerInfo?.device || "Remote Receiver"}
                    </h4>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      {connectedPeerInfo?.connectionType === "local-lan" ? (
                        <>
                          <Radio className="h-3 w-3 text-emerald-500" />
                          <span>Local Wi-Fi (0 Internet Data Used)</span>
                        </>
                      ) : (
                        <>
                          <Globe className="h-3 w-3 text-primary" />
                          <span>Direct Encrypted P2P</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-muted-foreground hover:text-destructive h-7 px-2.5 rounded-xl"
                  onClick={() => {
                    connectionRef.current?.close();
                    setConnectionStatus("ready");
                  }}
                >
                  Disconnect
                </Button>
              </div>

              <SendConsole
                title="Send to Receiver"
                onCameraClick={() => cameraInputRef.current?.click()}
                onFileSelectClick={() => fileInputRef.current?.click()}
                onFilesDrop={enqueueFiles}
                onSendText={sendTextMessage}
                onSendPassword={sendPasswordMessage}
                onSendLink={sendLinkMessage}
              />

              {/* Sent items feed */}
              {items.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Recent Activity ({items.length})
                    </h4>
                    {items.some((i) => i.type === "file") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDownloadAllZip}
                        className="text-[11px] h-6 px-2 rounded-lg border-border/60"
                      >
                        <Archive className="h-3 w-3 mr-1" /> ZIP All
                      </Button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {items.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 bg-muted/30 border border-border/40 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {item.type === "file" ? (
                            <FileIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                          ) : item.type === "password" ? (
                            <Lock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          ) : item.type === "link" ? (
                            <Link2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          ) : (
                            <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                          )}
                          <span className="truncate font-medium">
                            {item.name || (item.type === "password" ? "••••••••••••" : item.text)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {item.type === "file" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownloadItem(item)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                              title="Download"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                            Sent
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Protocol & Transfer Architecture Specifications (Discreetly below shared files history) */}
              <ProtocolStatusCard
                connectedPeerInfo={connectedPeerInfo}
                connectionStatus={connectionStatus}
                role={role}
                onRefreshStats={updateConnectionNetworkStats}
              />
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* IN-BROWSER CAMERA QR SCANNER MODAL */}
      {/* ======================================================== */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleQrDetected}
      />

      {/* ======================================================== */}
      {/* FULLSCREEN ZOOMABLE IMAGE LIGHTBOX MODAL */}
      {/* ======================================================== */}
      <ImageLightbox
        image={previewImage}
        onClose={() => setPreviewImage(null)}
        onUpdateImage={setPreviewImage}
      />
    </div>
  );
}

export default SendToPcTool;
