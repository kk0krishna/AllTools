import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alltools.web.app"),
  title: {
    default: "AllTools & OCS | Every Tool. One Place.",
    template: "%s | AllTools",
  },
  description: "AllTools provides a premium, free Obstetric Clinical Suite (OCS) alongside professional-grade online tools for developers, audiophiles, and everyday users. Built with clinical precision and state-of-the-art engineering.",
  keywords: ["online tools", "medical calculators", "obstetrics suite", "developer tools", "audio spectrum analyzer", "lossless audio checker", "free online utilities", "AllTools", "clinical calculators"],
  manifest: "/manifest.json",
  verification: {
    google: "4IpyiZCA8UUzZEiR-TJvvfVHj-FhZKEnTeHfWHok_ZQ",
  },
};

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
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
