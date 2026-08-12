export const siteConfig = {
  name: "Clinikkit",
  nameShort: "Clinik",
  nameHighlight: "kit",
  description:
    "Clinikkit is a lightning-fast, privacy-first platform offering clinical medical calculators, advanced developer utilities, and everyday tools. Crafted by Krishna KK.",
  url: "https://clinikkit.web.app",
  ogImage: "/images/opengraph-image.png",
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
    description: "Clinikkit was developed by Krishna KK with a passion for delivering fast, high-performance applications. Designed as a reliable alternative to online tools that often feature intrusive ads, paywalls, or slow server-side processing, this platform reflects a commitment to clean engineering and clinical precision. I hope you find these tools both practical and a pleasure to use."
  },
  assets: {
    logo: "/logo.svg",
    favicon: "/icon.svg",
    heroBg: "/bghomered.webp",
  }
};

export type SiteConfig = typeof siteConfig;
