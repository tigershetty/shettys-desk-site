import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Source_Code_Pro } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import SpotlightBackground from "@/components/SpotlightBackground";
import { BGPattern } from "@/components/BGPattern";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.tigershetty.com"
  ),
  title: "Shetty's Desk",
  description: "Supply chain, one breakdown at a time.",
  icons: {
    icon: [
      {
        url: "/images/favicon-mark-32.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    shortcut: "/images/favicon-mark-32.png",
    apple: [
      {
        url: "/images/apple-touch-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#fffaf0",
};

// A fresh CSP nonce is generated for every page request in proxy.ts.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceCodePro.variable} antialiased flex min-h-screen overflow-x-hidden`}
      >
        <Preloader />
        <SmoothScroll />
        <BGPattern
          variant="dots"
          mask="fade-center"
          size={24}
          fill="rgba(0,0,0,0.15)"
          className="fixed inset-0 -z-10"
        />
        <SpotlightBackground />
        <Sidebar />
        <main className="w-full flex flex-col min-h-screen">
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pt-16 pb-8 lg:pl-[calc(16rem+2rem)] lg:pr-12 lg:pt-10 lg:pb-10">
            {children}
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
