"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Smartphone, 
  Monitor, 
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
  Laptop, 
  ScanLine, 
  Layers,
  FileText,
  File as FileIcon,
  Lock,
  Link2
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
  ConnectedPeerInfo 
} from "./types";
import { CHUNK_SIZE, PEER_CONFIG } from "./constants";
import { playChimeSound, triggerVibrate, parseQrSessionId } from "./utils";
import { QrScannerModal } from "./components/QrScannerModal";
import { ImageLightbox } from "./components/ImageLightbox";
import { SendConsole } from "./components/SendConsole";
import { TransferCard } from "./components/TransferCard";

export function SendToPcTool() {
  // Roles: "receiver" (PC Screen) or "sender" (Phone Sender)
  const [role, setRole] = useState<RoleType>("receiver");
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("initializing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Peer identification & PIN
  const [receiverPeerId, setReceiverPeerId] = useState<string>("");
  const [pinCode, setPinCode] = useState<string>("");
  const [targetPinInput, setTargetPinInput] = useState<string>("");
  const [connectedPeerInfo, setConnectedPeerInfo] = useState<ConnectedPeerInfo | null>(null);

  // Transfer items
  const [items, setItems] = useState<TransferItem[]>([]);
  const [activeTransfer, setActiveTransfer] = useState<TransferProgress | null>(null);

  // Masked passwords state
  const [revealedPasswords, setRevealedPasswords] = useState<{ [id: string]: boolean }>({});

  // Auto-copy state
  const [autoCopyEnabled, setAutoCopyEnabled] = useState<boolean>(false);
  const [autoCopyNotice, setAutoCopyNotice] = useState<string | null>(null);
  const [pendingCopyItem, setPendingCopyItem] = useState<{ text: string; label: string } | null>(null);

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    name: string;
    size?: number;
    rotation: number;
    zoom: number;
  } | null>(null);

  // UI action states
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedPin, setCopiedPin] = useState<boolean>(false);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);

  // Persistent Refs to maintain stable callbacks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const peerInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connectionRef = useRef<any>(null);
  const roleRef = useRef<RoleType>("receiver");
  const autoCopyRef = useRef<boolean>(false);
  const soundEnabledRef = useRef<boolean>(true);

  // Pending clipboard write queued for next user activation
  const pendingClipboardWriteRef = useRef<string | null>(null);

  // Incoming chunk accumulation buffer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const incomingFilesRef = useRef<{ [fileId: string]: any }>({});

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
        setAutoCopyNotice(`Auto-copied ${label} to Clipboard! Press Ctrl+V`);
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

  // Toggle Auto-copy button
  const handleToggleAutoCopy = () => {
    if (!autoCopyEnabled) {
      setAutoCopyEnabled(true);
      setAutoCopyNotice("Auto-copy ON: incoming notes copy automatically to clipboard");
      setTimeout(() => setAutoCopyNotice(null), 3000);
    } else {
      setAutoCopyEnabled(false);
      setPendingCopyItem(null);
      pendingClipboardWriteRef.current = null;
    }
  };

  // Construct pairing URL
  const getPairingUrl = useCallback((): string => {
    if (typeof window === "undefined" || !receiverPeerId) return "";
    const origin = window.location.origin;
    return `${origin}/tools/everyday/send-to-pc?session=${receiverPeerId}`;
  }, [receiverPeerId]);

  // Handle incoming data channel messages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleIncomingData = useCallback((data: any) => {
    if (!data || typeof data !== "object") return;

    if (data.type === "handshake") {
      setConnectedPeerInfo({
        device: data.device || "Mobile Device",
        connectedAt: data.timestamp || Date.now(),
      });
      setConnectionStatus("connected");
      setErrorMessage("");
      playSound();
      triggerVibrate();
      return;
    }

    // Text or Link
    if (data.type === "text" || data.type === "link") {
      const isLink = data.type === "link";
      const newItem: TransferItem = {
        id: data.id || Math.random().toString(36).substring(2, 9),
        type: isLink ? "link" : "text",
        text: data.text,
        timestamp: data.timestamp || Date.now(),
        sender: roleRef.current === "receiver" ? "phone" : "pc",
      };
      setItems((prev) => [newItem, ...prev]);
      playSound();
      triggerVibrate();

      if (autoCopyRef.current && data.text) {
        copyToClipboard(data.text, isLink ? "Link" : "Note");
      }
      return;
    }

    // Confidential Secret / Password
    if (data.type === "password") {
      const newItem: TransferItem = {
        id: data.id || Math.random().toString(36).substring(2, 9),
        type: "password",
        text: data.text,
        burnOnCopy: data.burnOnCopy ?? true,
        isBurned: false,
        timestamp: data.timestamp || Date.now(),
        sender: roleRef.current === "receiver" ? "phone" : "pc",
      };
      setItems((prev) => [newItem, ...prev]);
      playSound();
      triggerVibrate();
      return;
    }

    // File start
    if (data.type === "file-start") {
      incomingFilesRef.current[data.fileId] = {
        name: data.name,
        size: data.size,
        mimeType: data.mimeType,
        totalChunks: data.totalChunks,
        chunks: [],
      };
      setActiveTransfer({
        fileId: data.fileId,
        name: data.name,
        progress: 0,
        direction: "receiving",
      });
      return;
    }

    // File chunk
    if (data.type === "file-chunk") {
      const fileData = incomingFilesRef.current[data.fileId];
      if (fileData) {
        fileData.chunks[data.chunkIndex] = data.data;
        const received = fileData.chunks.filter(Boolean).length;
        const progress = Math.min(100, Math.round((received / fileData.totalChunks) * 100));
        setActiveTransfer((prev) =>
          prev && prev.fileId === data.fileId ? { ...prev, progress } : prev
        );
      }
      return;
    }

    // File end
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
          sender: roleRef.current === "receiver" ? "phone" : "pc",
        };
        setItems((prev) => [newItem, ...prev]);
        delete incomingFilesRef.current[data.fileId];
        setActiveTransfer(null);
        playSound();
        triggerVibrate();
      }
    }
  }, [playSound, copyToClipboard]);

  // Setup connection handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setupConnection = useCallback((conn: any) => {
    connectionRef.current = conn;

    conn.on("open", () => {
      setConnectionStatus("connected");
      setErrorMessage("");
      const isMobile = typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      conn.send({
        type: "handshake",
        device: isMobile ? "Phone" : "PC",
        timestamp: Date.now(),
      });
      playSound();
      triggerVibrate();
    });

    conn.on("data", (data: unknown) => {
      handleIncomingData(data);
    });

    conn.on("close", () => {
      setConnectionStatus("ready");
      setConnectedPeerInfo(null);
      connectionRef.current = null;
    });

    conn.on("error", (err: unknown) => {
      console.warn("DataConnection error:", err);
      setConnectionStatus("ready");
    });
  }, [handleIncomingData, playSound]);

  // Initialize Receiver (PC Mode)
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

  // Initialize Sender (Mobile Mode)
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
          setErrorMessage("PC screen with this PIN was not found. Please verify the PIN shown on your PC screen.");
        } else {
          setErrorMessage("Could not connect to PC screen. Verify PIN or QR code.");
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
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      if (isMobile) {
        setRole("sender");
        setConnectionStatus("ready");
      } else {
        setRole("receiver");
        initReceiver();
      }
    }

    return () => {
      if (peerInstanceRef.current) {
        try {
          peerInstanceRef.current.destroy();
        } catch {
          // Safe ignore
        }
      }
    };
  }, [initReceiver, initSender]);

  // Manual PIN connect
  const handleConnectByPin = () => {
    const cleanPin = targetPinInput.trim().replace(/\D/g, "");
    if (cleanPin.length !== 6) {
      setErrorMessage("Please enter the 6-digit PIN shown on your PC screen.");
      return;
    }
    const targetId = `tvpc-${cleanPin}`;
    initSender(targetId);
  };

  // Auto-connect on 6th digit
  const handlePinInputChange = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 6);
    setTargetPinInput(clean);
    if (clean.length === 6) {
      const targetId = `tvpc-${clean}`;
      initSender(targetId);
    }
  };

  // Send a file in 32KB chunks over WebRTC DataChannel
  const sendFile = async (file: File) => {
    if (!connectionRef.current || connectionStatus !== "connected") {
      alert("No device connected. Please pair your devices first.");
      return;
    }

    const fileId = "file-" + Math.random().toString(36).substring(2, 9);
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    setActiveTransfer({
      fileId,
      name: file.name,
      progress: 0,
      direction: "sending",
    });

    const conn = connectionRef.current;

    conn.send({
      type: "file-start",
      fileId,
      name: file.name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      totalChunks,
    });

    let offset = 0;
    let chunkIndex = 0;

    const readAndSendNextChunk = () => {
      if (offset >= file.size) {
        conn.send({ type: "file-end", fileId });
        setActiveTransfer(null);

        const blobUrl = URL.createObjectURL(file);
        setItems((prev) => [
          {
            id: fileId,
            type: "file",
            name: file.name,
            size: file.size,
            mimeType: file.type,
            blob: file,
            url: blobUrl,
            timestamp: Date.now(),
            sender: role === "receiver" ? "pc" : "phone",
          },
          ...prev,
        ]);
        playSound();
        triggerVibrate();
        return;
      }

      const slice = file.slice(offset, offset + CHUNK_SIZE);
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result && conn.open) {
          conn.send({
            type: "file-chunk",
            fileId,
            chunkIndex,
            data: e.target.result,
          });

          offset += CHUNK_SIZE;
          chunkIndex++;
          const prog = Math.min(100, Math.round((offset / file.size) * 100));
          setActiveTransfer((prev) =>
            prev && prev.fileId === fileId ? { ...prev, progress: prog } : prev
          );

          setTimeout(readAndSendNextChunk, 5);
        }
      };

      reader.readAsArrayBuffer(slice);
    };

    readAndSendNextChunk();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const fileList = Array.from(e.target.files);
    fileList.forEach((file) => {
      sendFile(file);
    });
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
        sender: role === "receiver" ? "pc" : "phone",
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
        sender: role === "receiver" ? "pc" : "phone",
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
        sender: role === "receiver" ? "pc" : "phone",
      },
      ...prev,
    ]);

    playSound();
    triggerVibrate();
  };

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

  const handleDownloadItem = (item: TransferItem) => {
    if (item.type === "file" && item.blob) {
      saveAs(item.blob, item.name || "downloaded-file");
    } else if (item.type === "text" && item.text) {
      const blob = new Blob([item.text], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `note-${item.id.substring(0, 6)}.txt`);
    }
  };

  const handleDownloadAllZip = async () => {
    const fileItems = items.filter((item) => item.type === "file" && item.blob);
    if (fileItems.length === 0) return;

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
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-5 animate-in fade-in duration-200">
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

      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/60 backdrop-blur-xl border border-border/60 p-3 sm:p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Laptop className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-base sm:text-lg text-foreground tracking-tight">
                Send to PC
              </h1>
              <Badge variant="outline" className="text-[10px] px-2 py-0 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                <ShieldCheck className="h-3 w-3 mr-1 inline" /> 100% P2P
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Direct wireless file and clipboard bridge between phone and computer
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
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                role === "receiver"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>PC Screen</span>
            </button>
            <button
              onClick={() => {
                setRole("sender");
                setErrorMessage("");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                role === "sender"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Phone Sender</span>
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute alert sounds" : "Unmute alert sounds"}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Floating Auto-Copy Notice Banner */}
      {autoCopyNotice && (
        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5" /> {autoCopyNotice}
          </span>
          <Check className="h-3.5 w-3.5" />
        </div>
      )}

      {/* Floating 1-Click Action Pill When Note Arrives from Phone */}
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
            Copy to Clipboard (Ctrl+V)
          </Button>
        </div>
      )}

      {/* Error alert with clean dismiss */}
      {errorMessage && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-300 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage("")}
            className="text-muted-foreground hover:text-foreground p-1 text-xs"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Active Transfer Progress */}
      {activeTransfer && (
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl animate-in fade-in">
          <div className="flex justify-between items-center text-xs font-medium mb-1">
            <span className="flex items-center gap-2 text-primary font-semibold">
              <RefreshCw className="h-3 w-3 animate-spin" />
              {activeTransfer.direction === "sending" ? "Sending" : "Receiving"} &ldquo;{activeTransfer.name}&rdquo;
            </span>
            <span className="text-primary font-mono">{activeTransfer.progress}%</span>
          </div>
          <div className="w-full bg-primary/20 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-150 rounded-full"
              style={{ width: `${activeTransfer.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ROLE 1: PC SCREEN (RECEIVER) */}
      {/* ======================================================== */}
      {role === "receiver" && (
        <div className="space-y-4">
          {connectionStatus !== "connected" ? (
            /* UNPAIRED STATE: Minimalist QR & PIN Hero (Fits comfortably above fold) */
            <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl p-5 sm:p-7 shadow-xs text-center space-y-4">
              <div className="space-y-1 max-w-md mx-auto">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  Scan QR with your Phone Camera
                </h2>
                <p className="text-xs text-muted-foreground">
                  Open your phone camera to pair instantly, or enter the 6-digit PIN below.
                </p>
              </div>

              {/* Crisp High-Contrast QR Code Container */}
              <div className="flex flex-col items-center justify-center">
                <div className="p-4 bg-white rounded-2xl shadow-md transition-all inline-block">
                  {connectionStatus === "initializing" ? (
                    <div className="w-52 h-52 flex flex-col items-center justify-center text-muted-foreground gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-xs">Preparing QR...</span>
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
                        <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" /> Copied
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
          ) : (
            /* PAIRED STATE: Live Console & Transfer Stream */
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Active Connection Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Wifi className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-foreground">
                      {connectedPeerInfo?.device || "Phone"} Connected
                    </div>
                    <div className="text-[10px] text-muted-foreground">Direct encrypted peer stream</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={handleToggleAutoCopy}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      autoCopyEnabled
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-background/80 text-muted-foreground hover:text-foreground border-border/60"
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5" /> Auto-copy {autoCopyEnabled ? "ON" : "OFF"}
                  </button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-xl text-xs text-muted-foreground hover:text-destructive h-7 px-2.5"
                    onClick={() => {
                      connectionRef.current?.close();
                      setConnectionStatus("ready");
                    }}
                  >
                    <WifiOff className="h-3.5 w-3.5 mr-1" /> Disconnect
                  </Button>
                </div>
              </div>

              {/* PC Send Console */}
              <SendConsole
                title="Send from PC to Phone"
                onCameraClick={() => cameraInputRef.current?.click()}
                onFileSelectClick={() => fileInputRef.current?.click()}
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
                      className="rounded-xl font-semibold text-xs h-7 shadow-xs"
                    >
                      <Archive className="h-3.5 w-3.5 mr-1" /> Download ZIP
                    </Button>
                  )}
                  {items.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setItems([])}
                      className="rounded-xl text-xs h-7 px-2 text-muted-foreground hover:text-destructive border-border/60"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Transferred Items Grid */}
              {items.length === 0 ? (
                <div className="p-7 border border-dashed border-border/80 rounded-2xl text-center space-y-1.5 bg-card/20">
                  <Layers className="h-7 w-7 text-muted-foreground/60 mx-auto" />
                  <p className="text-xs font-semibold text-foreground">Ready for transfers</p>
                  <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                    Snap a photo or send notes from your phone. Items will stream live directly to this screen.
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
                      onCopyContent={handleCopyContent}
                      isCopied={copiedItemId === item.id}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* ROLE 2: PHONE SENDER (MOBILE INTERFACE) */}
      {/* ======================================================== */}
      {role === "sender" && (
        <div className="space-y-4">
          {connectionStatus !== "connected" ? (
            /* Pair to PC Screen with Built-In Camera Scanner + PIN Fallback */
            <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl p-5 sm:p-7 space-y-4 text-center max-w-sm mx-auto shadow-xs">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
                <Smartphone className="h-5 w-5" />
              </div>

              <div className="space-y-1">
                <h2 className="font-bold text-base sm:text-lg text-foreground">
                  Connect to PC Screen
                </h2>
                <p className="text-xs text-muted-foreground">
                  Scan the QR code on your PC screen or enter the 6-digit PIN.
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
                        Connect via PIN <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Mobile Paired Console */
            <div className="max-w-md mx-auto space-y-3.5 animate-in fade-in">
              <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <div>
                    <h4 className="font-semibold text-xs text-foreground">Connected to PC</h4>
                    <p className="text-[10px] text-muted-foreground">Transfers stream directly to your screen</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-muted-foreground hover:text-destructive h-7 px-2"
                  onClick={() => {
                    connectionRef.current?.close();
                    setConnectionStatus("ready");
                  }}
                >
                  Disconnect
                </Button>
              </div>

              <SendConsole
                title="Send to PC"
                onCameraClick={() => cameraInputRef.current?.click()}
                onFileSelectClick={() => fileInputRef.current?.click()}
                onSendText={sendTextMessage}
                onSendPassword={sendPasswordMessage}
                onSendLink={sendLinkMessage}
              />

              {/* Sent items feed for phone */}
              {items.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h4 className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                    Recent Activity ({items.length})
                  </h4>
                  <div className="space-y-1.5">
                    {items.slice(0, 5).map((item) => (
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
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shrink-0">
                          Sent
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
