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
  sender: "phone" | "pc";
}

export interface TransferProgress {
  fileId: string;
  name: string;
  progress: number;
  direction: "sending" | "receiving";
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
  connectedAt?: number;
}
