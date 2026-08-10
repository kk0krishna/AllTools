export const siteConfig = {
  name: "Clinikkit",
  nameShort: "Clinik",
  nameHighlight: "kit",
  description:
    "Clinikkit is a lightning-fast, privacy-first platform offering clinical medical calculators, advanced developer utilities, and everyday tools. Crafted by Krishna KK.",
  url: "https://clinikkit.web.app",
  ogImage: "/opengraph-image.png",
  author: {
    name: "Krishna KK",
    github: "https://github.com/kk0krishna",
  },
  links: {
    twitter: "https://twitter.com/kk0krishna",
    github: "https://github.com/kk0krishna",
  },
  hero: {
    titlePrefix: "Clinik",
    titleHighlight: "kit",
    subtitle: "Every Tool. One Place.",
  },
  about: {
    title: "Crafted by Krishna KK",
    description: "Clinikkit is the brainchild of Krishna KK, a developer obsessed with building high-performance, zero-latency applications. Frustrated by online tools riddled with ads, paywalls, and bloated server-side processing, Krishna built this platform as a love letter to clean engineering and clinical precision."
  },
  assets: {
    logo: "/logo.svg",
    favicon: "/icon.svg",
    heroBg: "/bghomered.webp",
  }
};

export type SiteConfig = typeof siteConfig;
