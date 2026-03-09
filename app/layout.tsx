import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Source_Code_Pro } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import BrandMoment from "@/components/BrandMoment";
import SpotlightBackground from "@/components/SpotlightBackground";
import { BGPattern } from "@/components/BGPattern";
import { GlassFilter } from "@/components/GlassEffect";

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
  title: "Shetty's Desk",
  description: "Supply chain, one breakdown at a time.",
};

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
        <GlassFilter />
        <BrandMoment />
        <BGPattern
          variant="dots"
          mask="fade-center"
          size={24}
          fill="rgba(0,0,0,0.15)"
          className="fixed inset-0 -z-10"
        />
        <SpotlightBackground />
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col min-h-screen lg:ml-0">
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pt-16 pb-8 lg:px-12 lg:pt-10 lg:pb-10">
            {children}
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
