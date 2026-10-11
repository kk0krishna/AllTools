"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  QrCode, 
  Smartphone, 
  Monitor, 
  Upload, 
  Download, 
  Image as ImageIcon, 
  FileText, 
  File as FileIcon, 
  Check, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Archive, 
  Camera, 
  Send, 
  ShieldCheck, 
  ArrowRight, 
  Share2, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  X,
  Sparkles,
  Laptop,
  Lock,
  Eye,
  EyeOff,
  Flame,
  Link2,
  Zap,
  KeyRound
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Chunk size for WebRTC DataChannel (32 KB is optimal and safe across all browsers)
const CHUNK_SIZE = 32 * 1024;

interface TransferItem {
  id: string;
  type: "file" | "text" | "password" | "link";
  name?: string;
  size?: number;
  mimeType?: string;
  blob?: Blob;
  url?: string;
  text?: string;
  burnOnCopy?: boolean;
  isBurned?: boolean;
  timestamp: number;
  sender: "phone" | "pc";
}

interface TransferProgress {
  fileId: string;
  name: string;
  progress: number;
  direction: "sending" | "receiving";
}

type TabType = "files" | "text" | "password" | "link";

export function SendToPcTool() {
  // Modes: "receiver" (PC) or "sender" (Mobile)
  const [role, setRole] = useState<"receiver" | "sender">("receiver");
  const [connectionStatus, setConnectionStatus] = useState<
    "initializing" | "ready" | "connecting" | "connected" | "disconnected" | "error"
  >("initializing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Peer IDs and PIN
  const [receiverPeerId, setReceiverPeerId] = useState<string>("");
  const [pinCode, setPinCode] = useState<string>("");
  const [targetPinInput, setTargetPinInput] = useState<string>("");
  const [connectedPeerInfo, setConnectedPeerInfo] = useState<{
    device?: string;
    connectedAt?: number;
  } | null>(null);

  // Transfer Items & Progress
  const [items, setItems] = useState<TransferItem[]>([]);
  const [activeTransfer, setActiveTransfer] = useState<TransferProgress | null>(null);

  // CopyPaste.me Inspired Features: Send Tabs, Passwords & Links
  const [activeSendTab, setActiveSendTab] = useState<TabType>("files");
  const [textMessage, setTextMessage] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [burnOnCopyOption, setBurnOnCopyOption] = useState<boolean>(true);
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(false);
  const [linkInput, setLinkInput] = useState<string>("");

  // Revealed passwords map: { [itemId: string]: boolean }
  const [revealedPasswords, setRevealedPasswords] = useState<{ [id: string]: boolean }>({});

  // Auto-copy received text to clipboard toggle
  const [autoCopyEnabled, setAutoCopyEnabled] = useState<boolean>(false);
  const [autoCopyNotice, setAutoCopyNotice] = useState<string | null>(null);

  // Settings & Helpers
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedPin, setCopiedPin] = useState<boolean>(false);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);

  // Lightbox Preview for Images
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    name: string;
    size?: number;
    rotation: number;
    zoom: number;
  } | null>(null);

  // WebRTC & PeerJS References
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const peerInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connectionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Incoming chunk buffers: { [fileId: string]: { name, size, mimeType, chunks, receivedCount, totalChunks } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const incomingFilesRef = useRef<{ [fileId: string]: any }>({});

  // Hidden File Inputs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Play pleasant chime
  const playSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // Two-tone bright notification: 587.33Hz (D5) -> 880Hz (A5)
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // AudioContext may be blocked before interaction, ignore safely
    }
  }, [soundEnabled]);

  // Haptic feedback for mobile
  const triggerVibrate = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch {
        // Safe catch
      }
    }
  }, []);

  // Format bytes to human readable size
  const formatBytes = (bytes?: number): string => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Generate pairing URL
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
      playSound();
      triggerVibrate();
      return;
    }

    // Text or Link message
    if (data.type === "text" || data.type === "link") {
      const isLink = data.type === "link";
      const newItem: TransferItem = {
        id: data.id || Math.random().toString(36).substring(2, 9),
        type: isLink ? "link" : "text",
        text: data.text,
        timestamp: data.timestamp || Date.now(),
        sender: role === "receiver" ? "phone" : "pc",
      };
      setItems((prev) => [newItem, ...prev]);
      playSound();
      triggerVibrate();

      // Auto-copy to clipboard if enabled
      if (autoCopyEnabled && data.text) {
        navigator.clipboard?.writeText(data.text).then(() => {
          setAutoCopyNotice(isLink ? "Auto-copied Link to Clipboard!" : "Auto-copied Text to Clipboard!");
          setTimeout(() => setAutoCopyNotice(null), 3000);
        }).catch(() => {});
      }
      return;
    }

    // Password / Sensitive Secret message
    if (data.type === "password") {
      const newItem: TransferItem = {
        id: data.id || Math.random().toString(36).substring(2, 9),
        type: "password",
        text: data.text,
        burnOnCopy: Boolean(data.burnOnCopy),
        isBurned: false,
        timestamp: data.timestamp || Date.now(),
        sender: role === "receiver" ? "phone" : "pc",
      };
      setItems((prev) => [newItem, ...prev]);
      playSound();
      triggerVibrate();

      if (autoCopyEnabled && data.text) {
        navigator.clipboard?.writeText(data.text).then(() => {
          setAutoCopyNotice("Auto-copied Password to Clipboard!");
          setTimeout(() => setAutoCopyNotice(null), 3000);
          if (newItem.burnOnCopy) {
            setItems((prev) =>
              prev.map((i) => (i.id === newItem.id ? { ...i, isBurned: true, text: "" } : i))
            );
          }
        }).catch(() => {});
      }
      return;
    }

    if (data.type === "file-start") {
      incomingFilesRef.current[data.fileId] = {
        name: data.name,
        size: data.size,
        mimeType: data.mimeType || "application/octet-stream",
        totalChunks: data.totalChunks,
        receivedCount: 0,
        chunks: new Array(data.totalChunks),
      };
      setActiveTransfer({
        fileId: data.fileId,
        name: data.name,
        progress: 0,
        direction: "receiving",
      });
      return;
    }

    if (data.type === "file-chunk") {
      const tracker = incomingFilesRef.current[data.fileId];
      if (tracker) {
        tracker.chunks[data.chunkIndex] = data.data;
        tracker.receivedCount++;
        const prog = Math.round((tracker.receivedCount / tracker.totalChunks) * 100);
        setActiveTransfer((prev) =>
          prev && prev.fileId === data.fileId ? { ...prev, progress: prog } : prev
        );
      }
      return;
    }

    if (data.type === "file-end") {
      const tracker = incomingFilesRef.current[data.fileId];
      if (tracker) {
        const blob = new Blob(tracker.chunks, { type: tracker.mimeType });
        const url = URL.createObjectURL(blob);
        const newItem: TransferItem = {
          id: data.fileId,
          type: "file",
          name: tracker.name,
          size: tracker.size,
          mimeType: tracker.mimeType,
          blob,
          url,
          timestamp: Date.now(),
          sender: role === "receiver" ? "phone" : "pc",
        };
        setItems((prev) => [newItem, ...prev]);
        delete incomingFilesRef.current[data.fileId];
        setActiveTransfer(null);
        playSound();
        triggerVibrate();
      }
    }
  }, [playSound, triggerVibrate, role, autoCopyEnabled]);

  // Wire up a PeerJS DataConnection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setupConnection = useCallback((conn: any) => {
    connectionRef.current = conn;

    conn.on("open", () => {
      setConnectionStatus("connected");
      // Send handshake
      conn.send({
        type: "handshake",
        device: typeof navigator !== "undefined" ? (navigator.userAgent.includes("Mobile") ? "Phone Browser" : "Desktop PC") : "Web Device",
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
      console.error("Connection error:", err);
      setConnectionStatus("error");
      setErrorMessage("Connection encountered an issue. Reconnecting...");
    });
  }, [handleIncomingData, playSound, triggerVibrate]);

  // Initialize Receiver (PC Mode)
  const initReceiver = useCallback(async () => {
    setConnectionStatus("initializing");
    setErrorMessage("");
    try {
      const { Peer } = await import("peerjs");

      // Generate a short 6-digit numeric PIN
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      const generatedId = `tvpc-${pin}`;
      setPinCode(pin);
      setReceiverPeerId(generatedId);

      if (peerInstanceRef.current) {
        try {
          peerInstanceRef.current.destroy();
        } catch {
          // Ignore destroy errors
        }
      }

      const peer = new Peer(generatedId, {
        debug: 1,
      });

      peer.on("open", () => {
        setConnectionStatus("ready");
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      peer.on("connection", (conn: any) => {
        setupConnection(conn);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      peer.on("error", (err: any) => {
        console.warn("Peer error:", err);
        if (err.type === "unavailable-id") {
          initReceiver();
        } else {
          setConnectionStatus("error");
          setErrorMessage(err.message || "Failed to initialize wireless peer.");
        }
      });

      peerInstanceRef.current = peer;
    } catch (err) {
      console.error("Failed to load peerjs:", err);
      setConnectionStatus("error");
      setErrorMessage("Failed to start peer engine. Please refresh and check your internet connection.");
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
          // Ignore
        }
      }

      const senderPeer = new Peer({
        debug: 1,
      });

      senderPeer.on("open", () => {
        const conn = senderPeer.connect(targetPeerId, { reliable: true });
        setupConnection(conn);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      senderPeer.on("error", (err: any) => {
        console.error("Sender peer error:", err);
        setConnectionStatus("error");
        setErrorMessage("Could not connect to PC. Ensure your PC screen is open on this tool and try again.");
      });

      peerInstanceRef.current = senderPeer;
    } catch (err) {
      console.error("Sender init error:", err);
      setConnectionStatus("error");
      setErrorMessage("Could not initialize sender. Please check your browser connection.");
    }
  }, [setupConnection]);

  // Detect URL parameter on mount (e.g. ?session=tvpc-123456)
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
      if (peerInstanceRef.current) {
        try {
          peerInstanceRef.current.destroy();
        } catch {
          // Ignore
        }
      }
    };
  }, [initReceiver, initSender]);

  // Connect manually via PIN
  const handleConnectByPin = () => {
    const cleanPin = targetPinInput.trim().replace(/\D/g, "");
    if (cleanPin.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit PIN code.");
      return;
    }
    const targetId = `tvpc-${cleanPin}`;
    initSender(targetId);
  };

  // Send a File over WebRTC DataChannel in chunks
  const sendFile = async (file: File) => {
    if (!connectionRef.current || connectionStatus !== "connected") {
      alert("No active device connection. Connect a device first!");
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

    // Send file start header
    conn.send({
      type: "file-start",
      fileId,
      name: file.name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      totalChunks,
    });

    // Send chunks sequentially
    let offset = 0;
    let chunkIndex = 0;

    const readAndSendNextChunk = () => {
      if (offset >= file.size) {
        conn.send({ type: "file-end", fileId });
        setActiveTransfer(null);

        // Also add to local history for preview
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

          setTimeout(readAndSendNextChunk, 8);
        }
      };

      reader.readAsArrayBuffer(slice);
    };

    readAndSendNextChunk();
  };

  // Handle file input changes
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const fileList = Array.from(e.target.files);
    fileList.forEach((file) => {
      sendFile(file);
    });
    e.target.value = "";
  };

  // Send Text Note
  const sendTextMessage = () => {
    if (!textMessage.trim()) return;
    if (!connectionRef.current || connectionStatus !== "connected") {
      alert("No active device connection.");
      return;
    }

    const textId = "txt-" + Math.random().toString(36).substring(2, 9);
    const payload = {
      type: "text",
      id: textId,
      text: textMessage.trim(),
      timestamp: Date.now(),
    };

    connectionRef.current.send(payload);

    setItems((prev) => [
      {
        id: textId,
        type: "text",
        text: textMessage.trim(),
        timestamp: Date.now(),
        sender: role === "receiver" ? "pc" : "phone",
      },
      ...prev,
    ]);

    setTextMessage("");
    playSound();
    triggerVibrate();
  };

  // Send Password / Secret (CopyPaste.me inspired)
  const sendPasswordMessage = () => {
    if (!passwordInput.trim()) return;
    if (!connectionRef.current || connectionStatus !== "connected") {
      alert("No active device connection.");
      return;
    }

    const passId = "pass-" + Math.random().toString(36).substring(2, 9);
    const payload = {
      type: "password",
      id: passId,
      text: passwordInput.trim(),
      burnOnCopy: burnOnCopyOption,
      timestamp: Date.now(),
    };

    connectionRef.current.send(payload);

    setItems((prev) => [
      {
        id: passId,
        type: "password",
        text: passwordInput.trim(),
        burnOnCopy: burnOnCopyOption,
        isBurned: false,
        timestamp: Date.now(),
        sender: role === "receiver" ? "pc" : "phone",
      },
      ...prev,
    ]);

    setPasswordInput("");
    playSound();
    triggerVibrate();
  };

  // Send Link / URL
  const sendLinkMessage = () => {
    let cleanUrl = linkInput.trim();
    if (!cleanUrl) return;
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }

    if (!connectionRef.current || connectionStatus !== "connected") {
      alert("No active device connection.");
      return;
    }

    const linkId = "link-" + Math.random().toString(36).substring(2, 9);
    const payload = {
      type: "link",
      id: linkId,
      text: cleanUrl,
      timestamp: Date.now(),
    };

    connectionRef.current.send(payload);

    setItems((prev) => [
      {
        id: linkId,
        type: "link",
        text: cleanUrl,
        timestamp: Date.now(),
        sender: role === "receiver" ? "pc" : "phone",
      },
      ...prev,
    ]);

    setLinkInput("");
    playSound();
    triggerVibrate();
  };

  // Copy connect link to clipboard
  const handleCopyLink = () => {
    const url = getPairingUrl();
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Copy PIN code to clipboard
  const handleCopyPin = () => {
    if (!pinCode) return;
    navigator.clipboard.writeText(pinCode);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  // Copy text, password or link with burn-on-copy logic
  const handleCopyContent = (item: TransferItem) => {
    if (item.isBurned) return;
    const textToCopy = item.text || "";
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    setCopiedItemId(item.id);
    setTimeout(() => setCopiedItemId(null), 2000);

    // If burn on copy is enabled for passwords
    if (item.type === "password" && item.burnOnCopy) {
      setTimeout(() => {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isBurned: true, text: "" } : i))
        );
      }, 500);
    }
  };

  // Toggle reveal password
  const toggleRevealPassword = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Download single item
  const handleDownloadItem = (item: TransferItem) => {
    if (item.type === "file" && item.blob) {
      saveAs(item.blob, item.name || "downloaded-file");
    } else if (item.type === "text" && item.text) {
      const blob = new Blob([item.text], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `note-${item.id.substring(0, 6)}.txt`);
    }
  };

  // Download all files as ZIP
  const handleDownloadAllZip = async () => {
    const fileItems = items.filter((item) => item.type === "file" && item.blob);
    if (fileItems.length === 0) {
      alert("No files to package into a ZIP yet.");
      return;
    }

    const zip = new JSZip();
    fileItems.forEach((item) => {
      if (item.blob) {
        zip.file(item.name || `file-${item.id}`, item.blob);
      }
    });

    // Also include any notes as text files
    const textItems = items.filter((item) => item.type === "text" && item.text);
    if (textItems.length > 0) {
      const notesFolder = zip.folder("notes");
      textItems.forEach((item, index) => {
        notesFolder?.file(`note-${index + 1}.txt`, item.text || "");
      });
    }

    const content = await zip.generateAsync({ type: "blob" });
    const dateStr = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    saveAs(content, `SendToPC_Transfer_${dateStr}.zip`);
  };

  // Open Image Lightbox
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

  // Simulate demo transfer for testing or demonstration
  const handleDemoSimulation = () => {
    setConnectedPeerInfo({
      device: "iPhone (Demo Simulation)",
      connectedAt: Date.now(),
    });
    setConnectionStatus("connected");

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 600, 400);
      grad.addColorStop(0, "#0066CC");
      grad.addColorStop(1, "#8B5CF6");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 400);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText("Sample Document Scan", 50, 180);
      ctx.font = "18px sans-serif";
      ctx.fillText("Transferred live between devices", 50, 220);
      ctx.fillText(new Date().toLocaleTimeString(), 50, 260);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const fakeUrl = URL.createObjectURL(blob);
        const newItem: TransferItem = {
          id: "demo-" + Math.random().toString(36).substring(2, 8),
          type: "file",
          name: `Scan_${new Date().toLocaleTimeString().replace(/:/g, "")}.png`,
          size: blob.size,
          mimeType: "image/png",
          blob,
          url: fakeUrl,
          timestamp: Date.now(),
          sender: "phone",
        };
        setItems((prev) => [newItem, ...prev]);
        playSound();
      }, "image/png");
    }
  };

  // Multi-tab sender component (Used in both PC view and Mobile view)
  const renderSendConsole = (title: string) => (
    <div className="bg-card/70 backdrop-blur-md border border-border/80 rounded-3xl p-5 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
        <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> {title}
        </h4>

        {/* Console Category Tabs */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setActiveSendTab("files")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              activeSendTab === "files" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" /> Files
          </button>
          <button
            onClick={() => setActiveSendTab("text")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              activeSendTab === "text" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-3.5 w-3.5" /> Text
          </button>
          <button
            onClick={() => setActiveSendTab("password")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              activeSendTab === "password" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lock className="h-3.5 w-3.5" /> Password
          </button>
          <button
            onClick={() => setActiveSendTab("link")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              activeSendTab === "link" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Link2 className="h-3.5 w-3.5" /> Link
          </button>
        </div>
      </div>

      {/* TAB 1: FILES & CAMERA */}
      {activeSendTab === "files" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="p-4 bg-primary/5 hover:bg-primary/10 border-2 border-dashed border-primary/30 hover:border-primary rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-98 group"
            >
              <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Camera className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-foreground">Camera Scan</div>
                <div className="text-[10px] text-muted-foreground">Direct document snap</div>
              </div>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-4 bg-muted/30 hover:bg-muted/60 border-2 border-dashed border-border/80 hover:border-primary/50 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-98 group"
            >
              <div className="h-10 w-10 rounded-xl bg-secondary text-foreground flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Upload className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-foreground">Select Photos / Files</div>
                <div className="text-[10px] text-muted-foreground">Any size • Multiple files</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: TEXT & NOTES */}
      {activeSendTab === "text" && (
        <div className="space-y-3">
          <Textarea
            placeholder="Type or paste notes, code, addresses, or snippets to transfer..."
            rows={3}
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            className="rounded-2xl text-xs font-mono"
          />
          <div className="flex justify-end">
            <Button
              onClick={sendTextMessage}
              disabled={!textMessage.trim()}
              size="sm"
              className="rounded-xl text-xs font-semibold h-9 px-4"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" /> Send Text
            </Button>
          </div>
        </div>
      )}

      {/* TAB 3: PASSWORD & SENSITIVE SECRETS (CopyPaste.me feature) */}
      {activeSendTab === "password" && (
        <div className="space-y-3">
          <div className="relative">
            <Input
              type={showPasswordInput ? "text" : "password"}
              placeholder="Enter password, secret token, or sensitive pin..."
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="rounded-xl text-xs font-mono pr-10 h-10"
            />
            <button
              type="button"
              onClick={() => setShowPasswordInput(!showPasswordInput)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPasswordInput ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground select-none">
              <input
                type="checkbox"
                checked={burnOnCopyOption}
                onChange={(e) => setBurnOnCopyOption(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/20 h-3.5 w-3.5"
              />
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Flame className="h-3.5 w-3.5 text-amber-500" /> Burn after 1 copy (Self-destruct)
              </span>
            </label>

            <Button
              onClick={sendPasswordMessage}
              disabled={!passwordInput.trim()}
              size="sm"
              className="rounded-xl text-xs font-semibold h-9 px-4 bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto"
            >
              <Lock className="h-3.5 w-3.5 mr-1.5" /> Send Secret
            </Button>
          </div>
        </div>
      )}

      {/* TAB 4: WEB LINK / URL */}
      {activeSendTab === "link" && (
        <div className="space-y-3">
          <Input
            type="url"
            placeholder="Paste URL (e.g. https://example.com/article)..."
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            className="rounded-xl text-xs h-10 font-mono"
          />
          <div className="flex justify-end">
            <Button
              onClick={sendLinkMessage}
              disabled={!linkInput.trim()}
              size="sm"
              className="rounded-xl text-xs font-semibold h-9 px-4"
            >
              <Link2 className="h-3.5 w-3.5 mr-1.5" /> Send Link
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-inner">
            <Laptop className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-lg text-foreground">Send to PC</h2>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
                <ShieldCheck className="h-3 w-3 mr-1 inline" /> 100% P2P Encrypted
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Transfer photos, documents, clipboard notes, and passwords securely between devices.
            </p>
          </div>
        </div>

        {/* Mode Selector & Quick Controls */}
        <div className="flex items-center gap-2 bg-muted/80 p-1 rounded-xl border border-border/50 text-xs font-medium">
          <button
            onClick={() => {
              setRole("receiver");
              if (!receiverPeerId) initReceiver();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              role === "receiver"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            PC Screen
          </button>
          <button
            onClick={() => setRole("sender")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              role === "sender"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            Mobile Sender
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute notification sounds" : "Unmute notification sounds"}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/50 transition-colors"
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* FLOATING AUTO-COPY NOTIFICATION BANNER */}
      {autoCopyNotice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-1">
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-500" /> {autoCopyNotice}
          </span>
          <Check className="h-4 w-4 text-emerald-500" />
        </div>
      )}

      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <Button
            size="sm"
            variant="outline"
            className="border-destructive/30 text-xs"
            onClick={() => (role === "receiver" ? initReceiver() : initSender(receiverPeerId))}
          >
            <RefreshCw className="h-3 w-3 mr-1.5" /> Retry
          </Button>
        </div>
      )}

      {/* ACTIVE TRANSFER PROGRESS BAR */}
      {activeTransfer && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="flex items-center gap-2 text-primary">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              {activeTransfer.direction === "sending" ? "Sending" : "Receiving"} &ldquo;{activeTransfer.name}&rdquo;
            </span>
            <span className="text-primary font-mono">{activeTransfer.progress}%</span>
          </div>
          <div className="w-full bg-primary/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-150 rounded-full"
              style={{ width: `${activeTransfer.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ROLE: RECEIVER (PC MODE) */}
      {/* ======================================================== */}
      {role === "receiver" && (
        <div className="space-y-6">
          {/* STATE 1: WAITING FOR MOBILE TO CONNECT */}
          {connectionStatus !== "connected" ? (
            <div className="relative overflow-hidden bg-card/50 backdrop-blur-xl border border-border/70 rounded-3xl p-6 sm:p-10 shadow-xl text-center space-y-8">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              {/* Title & Badge */}
              <div className="space-y-2 max-w-lg mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Ready to Connect
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Scan QR with your Phone Camera
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Open your iPhone or Android camera, point at the QR code, and tap the link to pair instantly.
                </p>
              </div>

              {/* Centerpiece QR Code Box */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative group p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-primary/20 shadow-2xl transition-all duration-300 hover:border-primary/40">
                  <div className="absolute inset-0 rounded-3xl border border-primary/20 animate-pulse pointer-events-none" />

                  {connectionStatus === "initializing" ? (
                    <div className="w-52 h-52 sm:w-60 sm:h-60 flex flex-col items-center justify-center text-muted-foreground gap-3">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                      <span className="text-xs">Generating Pairing QR...</span>
                    </div>
                  ) : (
                    <QRCodeSVG
                      value={getPairingUrl() || "https://clinikkit.web.app"}
                      size={240}
                      level="H"
                      includeMargin={false}
                      className="rounded-lg shadow-sm"
                    />
                  )}
                </div>

                {/* 6-Digit PIN Code Callout */}
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex items-center gap-2 bg-muted/60 border border-border/80 px-4 py-2 rounded-xl">
                    <span className="text-xs text-muted-foreground font-medium">Or enter PIN:</span>
                    <span className="font-mono font-bold tracking-widest text-lg text-primary">
                      {pinCode ? `${pinCode.slice(0, 3)} ${pinCode.slice(3)}` : "------"}
                    </span>
                    <button
                      onClick={handleCopyPin}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy PIN Code"
                    >
                      {copiedPin ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="rounded-xl border-border/80 text-xs font-semibold"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-500" /> Copied Link!
                      </>
                    ) : (
                      <>
                        <Share2 className="h-3.5 w-3.5 mr-1.5" /> Copy Direct Link
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Quick Actions & Demo Helper */}
              <div className="pt-4 border-t border-border/60 max-w-xl mx-auto flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
                <span>Want to test right now?</span>
                <a
                  href={getPairingUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary font-semibold hover:underline"
                >
                  Open Mobile Sender in New Tab <ExternalLink className="h-3 w-3 ml-1" />
                </a>
                <span className="text-border">•</span>
                <button
                  onClick={handleDemoSimulation}
                  className="inline-flex items-center text-primary/80 font-semibold hover:text-primary hover:underline"
                >
                  <Sparkles className="h-3 w-3 mr-1" /> Simulate Demo Transfer
                </button>
              </div>
            </div>
          ) : (
            /* STATE 2: PHONE CONNECTED - LIVE TRANSFER HUB */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Connected Device Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Wifi className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">
                        {connectedPeerInfo?.device || "Mobile Phone"} Connected
                      </span>
                      <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 text-[10px] px-2 py-0.5">
                        Live P2P Stream
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Transfer photos, passwords, notes, and links seamlessly between devices.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Auto Copy Toggle (CopyPaste.me inspired) */}
                  <button
                    onClick={() => setAutoCopyEnabled(!autoCopyEnabled)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      autoCopyEnabled
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground border-border/80"
                    }`}
                    title="Automatically copy incoming text and passwords to clipboard"
                  >
                    <Zap className="h-3.5 w-3.5" /> Auto-copy {autoCopyEnabled ? "ON" : "OFF"}
                  </button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-xl text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      connectionRef.current?.close();
                      setConnectionStatus("ready");
                    }}
                  >
                    <WifiOff className="h-3.5 w-3.5 mr-1" /> Disconnect
                  </Button>
                </div>
              </div>

              {/* BIDIRECTIONAL SEND CONSOLE (Send from PC to Mobile) */}
              {renderSendConsole("Send to Connected Device")}

              {/* Feed Controls (Download All / Clear) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground">
                    Transferred Stream ({items.length})
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Live clipboard, photos, and files transferred directly across devices.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDemoSimulation}
                    className="rounded-xl text-xs font-medium"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" /> Add Test Scan
                  </Button>
                  {items.some((i) => i.type === "file") && (
                    <Button
                      size="sm"
                      onClick={handleDownloadAllZip}
                      className="rounded-xl font-semibold text-xs shadow-sm"
                    >
                      <Archive className="h-3.5 w-3.5 mr-1.5" /> Download All (ZIP)
                    </Button>
                  )}
                  {items.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setItems([])}
                      className="rounded-xl text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Feed Content */}
              {items.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-border/80 rounded-3xl text-center space-y-3 bg-card/20">
                  <div className="h-14 w-14 rounded-2xl bg-muted mx-auto flex items-center justify-center text-muted-foreground">
                    <Smartphone className="h-7 w-7 animate-bounce" />
                  </div>
                  <h4 className="font-bold text-foreground">Waiting for content from your phone</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                    Snap photos, send passwords, choose documents, or write notes. You can also send files from this PC to your phone using the console above.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-card/70 hover:bg-card border border-border/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                    >
                      {/* 1. Image Card */}
                      {item.type === "file" && item.mimeType?.startsWith("image/") && item.url ? (
                        <div>
                          <div
                            onClick={() => openImageModal(item)}
                            className="relative h-44 w-full bg-muted/50 cursor-pointer overflow-hidden flex items-center justify-center"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                              <ZoomIn className="h-4 w-4" /> View Fullscreen
                            </div>
                          </div>
                          <div className="p-3.5 space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold text-foreground truncate">
                              <span className="truncate" title={item.name}>
                                {item.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono ml-2 shrink-0">
                                {formatBytes(item.size)}
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ) : item.type === "file" ? (
                        /* 2. Document / File Card */
                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                              <FileIcon className="h-5 w-5" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-foreground truncate" title={item.name}>
                                {item.name}
                              </p>
                              <p className="text-[10px] font-mono text-muted-foreground">
                                {formatBytes(item.size)} • {item.mimeType?.split("/")[1]?.toUpperCase() || "FILE"}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {new Date(item.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : item.type === "password" ? (
                        /* 3. Password / Secret Card (CopyPaste.me inspired) */
                        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 uppercase tracking-wider">
                                <KeyRound className="h-3 w-3" /> Sensitive Secret
                              </span>
                              {item.burnOnCopy && (
                                <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
                                  <Flame className="h-2.5 w-2.5 mr-0.5 inline" /> Burn on copy
                                </Badge>
                              )}
                            </div>

                            {item.isBurned ? (
                              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-600 dark:text-red-400 text-xs font-semibold space-y-0.5">
                                <div>🔥 Shredded &amp; Burned</div>
                                <div className="text-[10px] opacity-80">Erased from memory for security</div>
                              </div>
                            ) : (
                              <div className="bg-muted/40 p-2.5 rounded-xl border border-border/60 flex items-center justify-between">
                                <span className="font-mono text-xs tracking-wider truncate">
                                  {revealedPasswords[item.id] ? item.text : "••••••••••••••••"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleRevealPassword(item.id)}
                                  className="text-muted-foreground hover:text-foreground ml-2 p-1"
                                >
                                  {revealedPasswords[item.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : item.type === "link" ? (
                        /* 4. Web Link Card */
                        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
                                <Link2 className="h-3 w-3" /> Web Link
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(item.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="bg-muted/40 p-2.5 rounded-xl border border-border/60 text-xs text-primary font-mono truncate underline">
                              <a href={item.text} target="_blank" rel="noopener noreferrer">
                                {item.text}
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* 5. Plain Text Note Card */
                        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
                                <FileText className="h-3 w-3" /> Clipboard / Note
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(item.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="bg-muted/40 p-2.5 rounded-xl border border-border/60 text-xs text-foreground font-mono whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                              {item.text}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Card Bottom Actions */}
                      <div className="px-3.5 pb-3.5 pt-1 border-t border-border/40 flex items-center justify-between gap-2">
                        {item.type === "file" ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDownloadItem(item)}
                            className="w-full text-xs h-8 rounded-xl font-medium"
                          >
                            <Download className="h-3.5 w-3.5 mr-1.5" /> Download
                          </Button>
                        ) : item.type === "link" ? (
                          <div className="flex items-center gap-1.5 w-full">
                            <a
                              href={item.text}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1"
                            >
                              <Button
                                size="sm"
                                variant="secondary"
                                className="w-full text-xs h-8 rounded-xl font-medium"
                              >
                                <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open
                              </Button>
                            </a>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopyContent(item)}
                              className="text-xs h-8 rounded-xl font-medium"
                            >
                              {copiedItemId === item.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={item.isBurned}
                            onClick={() => handleCopyContent(item)}
                            className={`w-full text-xs h-8 rounded-xl font-medium ${
                              item.type === "password" ? "hover:bg-amber-500/20" : ""
                            }`}
                          >
                            {copiedItemId === item.id ? (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-500" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5 mr-1.5" /> {item.type === "password" ? "Copy Secret" : "Copy Text"}
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* ROLE: SENDER (MOBILE PHONE SENDER INTERFACE) */}
      {/* ======================================================== */}
      {role === "sender" && (
        <div className="space-y-6">
          {connectionStatus !== "connected" ? (
            /* Pair with PC Screen */
            <div className="bg-card/60 backdrop-blur-md border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 text-center max-w-md mx-auto">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center">
                <Smartphone className="h-7 w-7" />
              </div>

              <div className="space-y-1">
                <h3 className="font-heading font-extrabold text-xl text-foreground">
                  Connect to your PC
                </h3>
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit PIN shown on your PC screen to connect.
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 489214"
                  value={targetPinInput}
                  onChange={(e) => setTargetPinInput(e.target.value)}
                  className="text-center font-mono text-2xl tracking-widest font-bold h-14 rounded-2xl"
                />
                <Button
                  onClick={handleConnectByPin}
                  disabled={connectionStatus === "connecting" || targetPinInput.trim().length !== 6}
                  className="w-full h-12 rounded-2xl font-bold text-sm shadow-md"
                >
                  {connectionStatus === "connecting" ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Connecting to PC...
                    </>
                  ) : (
                    <>
                      Connect to PC <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              <div className="pt-4 border-t border-border/60">
                <p className="text-xs text-muted-foreground">
                  Or simply scan the QR code displayed on your PC screen with your camera app.
                </p>
              </div>
            </div>
          ) : (
            /* MOBILE CONNECTED DASHBOARD */
            <div className="max-w-lg mx-auto space-y-6 animate-in fade-in">
              {/* Connected Banner */}
              <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                  <div>
                    <h4 className="font-bold text-xs text-foreground">Connected to PC</h4>
                    <p className="text-[10px] text-muted-foreground">Anything you send will appear on your PC instantly</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-muted-foreground hover:text-destructive h-8 px-2"
                  onClick={() => {
                    connectionRef.current?.close();
                    setConnectionStatus("ready");
                  }}
                >
                  Disconnect
                </Button>
              </div>

              {/* MOBILE MULTI-TAB SENDER CONSOLE */}
              {renderSendConsole("Send to PC")}

              {/* Sent items summary */}
              {items.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">
                    Transferred this session ({items.length})
                  </h4>
                  <div className="space-y-2">
                    {items.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-muted/40 border border-border/60 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {item.type === "file" ? (
                            <FileIcon className="h-4 w-4 text-primary shrink-0" />
                          ) : item.type === "password" ? (
                            <Lock className="h-4 w-4 text-amber-500 shrink-0" />
                          ) : item.type === "link" ? (
                            <Link2 className="h-4 w-4 text-primary shrink-0" />
                          ) : (
                            <FileText className="h-4 w-4 text-primary shrink-0" />
                          )}
                          <span className="truncate font-medium">
                            {item.name || (item.type === "password" ? "••••••••••••" : item.text)}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shrink-0">
                          Sent <Check className="h-2.5 w-2.5 ml-1 inline" />
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

      {/* Hidden File Inputs */}
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

      {/* LIGHTBOX PREVIEW MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="absolute top-2 right-2 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-xl border border-white/10 text-white">
              <button
                onClick={() =>
                  setPreviewImage((p) => (p ? { ...p, zoom: Math.min(3, p.zoom + 0.25) } : null))
                }
                title="Zoom In"
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  setPreviewImage((p) => (p ? { ...p, zoom: Math.max(0.5, p.zoom - 0.25) } : null))
                }
                title="Zoom Out"
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  setPreviewImage((p) => (p ? { ...p, rotation: (p.rotation + 90) % 360 } : null))
                }
                title="Rotate Clockwise"
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewImage(null)}
                title="Close"
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors ml-1 text-white/80 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Image Preview Container */}
            <div className="overflow-hidden rounded-2xl flex items-center justify-center max-h-[80vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage.url}
                alt={previewImage.name}
                style={{
                  transform: `scale(${previewImage.zoom}) rotate(${previewImage.rotation}deg)`,
                  transition: "transform 0.2s ease-out",
                }}
                className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Bottom Caption */}
            <div className="mt-3 text-white/80 text-xs flex items-center gap-3">
              <span className="font-semibold">{previewImage.name}</span>
              <span>•</span>
              <span className="font-mono">{formatBytes(previewImage.size)}</span>
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = previewImage.url;
                  link.download = previewImage.name;
                  link.click();
                }}
                className="underline hover:text-white ml-2 flex items-center gap-1 font-semibold"
              >
                <Download className="h-3 w-3" /> Save to PC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
