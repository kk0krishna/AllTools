import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

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
    icon: "/logo/favicon.ico",
    shortcut: "/logo/favicon-32x32.png",
    apple: "/logo/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Professional Online Tools`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
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
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('clinikkit-theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <AnalyticsProvider>
              <Header />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <Footer />
            </AnalyticsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
