// 64 KB chunk size: Optimal balance of WebRTC SCTP throughput, low framing overhead, and universal browser compatibility
export const CHUNK_SIZE = 64 * 1024;

// 512 KB backpressure threshold: Keeps RTCDataChannel hardware buffers populated without memory spikes
export const BUFFER_THRESHOLD = 512 * 1024;

// 6-second heartbeat: Keeps mobile Safari / Android background WebRTC channels awake and measures RTT latency
export const HEARTBEAT_INTERVAL_MS = 6000;

// High-resilience multi-tiered ICE configuration:
// 1. Google & Cloudflare Anycast STUN servers for instantaneous WAN hole punching
// 2. OpenRelay TURN servers for symmetric NAT / restrictive enterprise / 4G/5G mobile carrier fallback
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
