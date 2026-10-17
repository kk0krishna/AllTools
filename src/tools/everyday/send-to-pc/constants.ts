// 32 KB chunk size guarantees smooth transmission across all mobile & desktop browsers
export const CHUNK_SIZE = 32 * 1024;

// 2 primary Google STUN servers for reliable cross-network NAT traversal without candidate bloat
export const PEER_CONFIG = {
  debug: 0,
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  },
};
