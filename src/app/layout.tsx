import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Professional Online Tools`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "online tools", "medical calculators", "developer tools", 
    siteConfig.name, "clinical calculators", "ABG analyzer", "BMI calculator", 
    "JSON formatter", "privacy first tools", "web tools"
  ],
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.github }],
  openGraph: {
    title: `${siteConfig.name} | Professional Online Tools`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.hero.subtitle}`,
      }
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: siteConfig.assets.favicon,
    apple: siteConfig.assets.favicon,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Professional Online Tools`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  manifest: "/manifest.json",
  verification: {
    google: "4IpyiZCA8UUzZEiR-TJvvfVHj-FhZKEnTeHfWHok_ZQ",
  },
};

import { AnalyticsProvider } from "@/components/AnalyticsProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AnalyticsProvider>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
