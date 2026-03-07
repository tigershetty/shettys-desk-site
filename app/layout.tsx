import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen`}
      >
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-screen lg:ml-0">
          <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-12 lg:py-10">
            {children}
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
