export interface TransferItem {
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
  sender: "sender" | "receiver" | "phone" | "pc";
}

export interface TransferProgress {
  fileId: string;
  name: string;
  size?: number;
  progress: number;
  direction: "sending" | "receiving";
  speedBytesPerSec?: number;
  remainingSeconds?: number;
  transferredBytes?: number;
  totalChunks?: number;
  currentChunk?: number;
}

export type TabType = "files" | "text" | "password" | "link";

export type RoleType = "receiver" | "sender";

export type ConnectionStatus =
  | "initializing"
  | "ready"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface ConnectedPeerInfo {
  device?: string;
  localDevice?: string;
  connectedAt?: number;
  connectionType?: "local-lan" | "p2p-direct" | "relay";
  latencyMs?: number;
  localIp?: string;
  remoteIp?: string;
  candidateType?: string;
  remoteCandidateType?: string;
  protocol?: string;
  securityCipher?: string;
  iceState?: string;
}

export interface QueueItem {
  id: string;
  file: File;
  name: string;
  size: number;
  status: "queued" | "sending" | "completed" | "error";
  progress?: number;
}
