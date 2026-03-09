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
        {/* Gradient mesh behind sidebar — visible through glass */}
        <div
          className="fixed top-0 left-0 h-screen w-64 z-[35] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(79,70,229,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(20,184,166,0.10) 0%, transparent 60%), radial-gradient(ellipse at 20% 60%, rgba(245,158,11,0.08) 0%, transparent 70%)",
          }}
        />
        <Sidebar />
        <main className="w-full flex flex-col min-h-screen">
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pt-16 pb-8 lg:pl-[calc(16rem+3rem)] lg:pr-12 lg:pt-10 lg:pb-10">
            {children}
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
