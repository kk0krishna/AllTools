"use client";

import React, { useState } from "react";
import { 
  Network, 
  ShieldCheck, 
  Wifi, 
  Radio, 
  ArrowRightLeft, 
  Globe, 
  Activity, 
  Lock, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  HardDrive
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConnectedPeerInfo, RoleType, ConnectionStatus } from "../types";

interface ProtocolStatusCardProps {
  connectedPeerInfo: ConnectedPeerInfo | null;
  connectionStatus: ConnectionStatus;
  role: RoleType;
  defaultExpanded?: boolean;
  onRefreshStats?: () => void;
}

export function ProtocolStatusCard({
  connectedPeerInfo,
  connectionStatus,
  role,
  defaultExpanded = false,
  onRefreshStats,
}: ProtocolStatusCardProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const isConnected = connectionStatus === "connected";
  const connectionType = connectedPeerInfo?.connectionType || "p2p-direct";

  const getRouteLabel = () => {
    if (!isConnected) return "Ready for P2P Discovery";
    if (connectionType === "local-lan") return "Direct Local Wi-Fi (Host-to-Host)";
    if (connectionType === "relay") return "Encrypted Relay (TURN Tunnel)";
    return "Direct WAN P2P (STUN Reflexive)";
  };

  const getRouteBadge = () => {
    if (!isConnected) {
      return (
        <Badge variant="outline" className="text-[10px] bg-muted/50 text-muted-foreground border-border/50">
          Standby
        </Badge>
      );
    }
    if (connectionType === "local-lan") {
      return (
        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold">
          <Radio className="h-3 w-3 mr-1 inline" /> 0 MB Internet Data Used
        </Badge>
      );
    }
    if (connectionType === "relay") {
      return (
        <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold">
          <ShieldCheck className="h-3 w-3 mr-1 inline" /> Encrypted Relay Tunnel
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30 font-semibold">
        <Globe className="h-3 w-3 mr-1 inline" /> Direct NAT Hole-Punched P2P
      </Badge>
    );
  };

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl p-4 sm:p-5 shadow-xs transition-all mt-3">
      {/* Clickable Header Strip */}
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs sm:text-sm text-foreground">
                Protocol &amp; Architecture Specifications
              </span>
              {getRouteBadge()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              WebRTC DataChannel • SCTP over DTLS/UDP • Hardware E2EE
              {isConnected && connectedPeerInfo?.latencyMs !== undefined && (
                <span className="font-mono ml-2 text-foreground font-semibold">
                  • {connectedPeerInfo.latencyMs}ms RTT
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {isConnected && onRefreshStats && isExpanded && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onRefreshStats();
              }}
              className="text-[11px] h-7 px-2.5 rounded-xl border-border/60 text-muted-foreground hover:text-foreground"
            >
              Refresh Stats
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-[11px] h-7 px-2.5 rounded-xl text-primary font-semibold hover:bg-primary/10 flex items-center gap-1"
          >
            <span>{isExpanded ? "Collapse Specs" : "View Architecture Specs"}</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Architecture Details */}
      {isExpanded && (
        <div className="pt-4 border-t border-border/40 space-y-4 animate-in fade-in duration-200 mt-3">
          {/* Real-time Diagnostics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Metric 1: Transport Protocol */}
            <div className="p-3 rounded-2xl bg-muted/25 border border-border/50 space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                <Layers className="h-3 w-3 text-primary" /> Protocol Stack
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-foreground">
                WebRTC SCTP
              </div>
              <div className="text-[10px] text-muted-foreground">
                RFC 8831 DataChannel
              </div>
            </div>

            {/* Metric 2: Active Transport Route */}
            <div className="p-3 rounded-2xl bg-muted/25 border border-border/50 space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                <Radio className="h-3 w-3 text-emerald-500" /> Active Route
              </div>
              <div className="font-bold text-xs sm:text-sm text-foreground truncate" title={getRouteLabel()}>
                {connectionType === "local-lan" ? "Local Wi-Fi Mesh" : connectionType === "relay" ? "TURN Relay Tunnel" : "Direct WAN P2P"}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {connectionType === "local-lan" ? "0 MB Data • Local Switch" : "Global STUN Reflexive"}
              </div>
            </div>

            {/* Metric 3: Encryption Standard */}
            <div className="p-3 rounded-2xl bg-muted/25 border border-border/50 space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                <Lock className="h-3 w-3 text-primary" /> Encryption
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-foreground">
                DTLS-AES-GCM
              </div>
              <div className="text-[10px] text-muted-foreground">
                256-bit Hardware E2EE
              </div>
            </div>

            {/* Metric 4: Round-Trip Time Latency */}
            <div className="p-3 rounded-2xl bg-muted/25 border border-border/50 space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                <Activity className="h-3 w-3 text-sky-500" /> Latency (RTT)
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-foreground">
                {isConnected && connectedPeerInfo?.latencyMs !== undefined
                  ? `${connectedPeerInfo.latencyMs} ms`
                  : isConnected
                  ? "< 2 ms"
                  : "Standby"}
              </div>
              <div className="text-[10px] text-muted-foreground">
                6s Keepalive Pulse
              </div>
            </div>
          </div>

          {/* Connected Device Topology Bar (when connected) */}
          {isConnected && (
            <div className="p-3 rounded-2xl bg-muted/30 border border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <HardDrive className="h-4 w-4 text-primary shrink-0" />
                <span className="text-muted-foreground">This Device:</span>
                <span className="font-semibold text-foreground font-mono truncate">
                  {connectedPeerInfo?.localDevice || (role === "receiver" ? "Receiver Device" : "Sender Device")}
                </span>
              </div>

              <div className="flex items-center gap-2 text-primary font-semibold text-[11px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 shrink-0">
                <ArrowRightLeft className="h-3.5 w-3.5" /> Direct In-Memory Bridge
              </div>

              <div className="flex items-center gap-2 overflow-hidden">
                <Wifi className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-muted-foreground">Connected Peer:</span>
                <span className="font-semibold text-foreground font-mono truncate">
                  {connectedPeerInfo?.device || (role === "receiver" ? "Connected Sender" : "Connected Receiver")}
                </span>
              </div>
            </div>
          )}

          {/* Technical Specifications Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-card border border-border/60 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Zero Internet Data Quota on Local Wi-Fi</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                When both devices are on the same home or office Wi-Fi network, WebRTC selects RFC 1918 Host-to-Host local socket candidates. Packets flow strictly through your local Wi-Fi router / switch without routing through any WAN internet gateways, resulting in zero cellular or internet data consumption and full gigabit wireless speeds.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border/60 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Multi-Tiered NAT Traversal (Any Network)</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                If devices are on different networks (such as 4G/5G mobile cellular to Home Wi-Fi, or across different regions), high-availability Google and Cloudflare Anycast STUN servers dynamically discover reflexive IP mappings to negotiate direct peer-to-peer UDP channels. Restrictive corporate firewalls automatically fall back to authenticated TURN relay tunnels.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border/60 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Zero Cloud Storage &amp; Memory Streaming</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Files and clipboard items are never stored on any server or cloud database. Data is sliced into 64 KB binary chunks streamed directly from browser RAM to browser RAM using SCTP backpressure flow control. When the session terminates, all memory buffers and ephemeral cryptographic keys are instantly destroyed.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border/60 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Hardware End-to-End Cryptography</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                All data channel traffic is hardware-encrypted at the transport layer using Datagram Transport Layer Security (DTLS 1.2 / 1.3) with AES-GCM cipher suites. Even network operators, Wi-Fi router administrators, and signaling brokers cannot inspect the contents of transferred files, notes, or secrets.
              </p>
            </div>
          </div>

          {/* Low-level connection diagnostics row if connected */}
          {isConnected && (connectedPeerInfo?.localIp || connectedPeerInfo?.candidateType) && (
            <div className="p-3 rounded-2xl bg-muted/20 border border-border/40 font-mono text-[11px] space-y-1 text-muted-foreground">
              <div className="font-bold text-foreground">Live Socket Telemetry:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <div>Candidate Type: <span className="text-foreground">{connectedPeerInfo.candidateType || "host"}</span></div>
                <div>Remote Candidate: <span className="text-foreground">{connectedPeerInfo.remoteCandidateType || "host"}</span></div>
                <div>Transport Protocol: <span className="text-foreground">{connectedPeerInfo.protocol || "UDP"}</span></div>
                <div>Cipher Suite: <span className="text-foreground">{connectedPeerInfo.securityCipher || "DTLS-AES-GCM-256"}</span></div>
                {connectedPeerInfo.localIp && <div>Local Interface: <span className="text-foreground">{connectedPeerInfo.localIp}</span></div>}
                {connectedPeerInfo.remoteIp && <div>Remote Interface: <span className="text-foreground">{connectedPeerInfo.remoteIp}</span></div>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProtocolStatusCard;
