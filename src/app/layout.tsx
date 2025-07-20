import type { Metadata } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers"; // ✅ import Providers
import Footer from "@/components/Footer";

import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Whispr PDF – Chat with Your PDFs Instantly",
  description:
    "Whispr PDF is an AI-powered tool that lets you upload and chat with PDF documents. Ask questions, get instant answers, and explore files smarter than ever.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${fontSans.variable} font-sans antialiased h-full`}>
        <Toaster richColors position="top-right" />
        <Providers>
          {" "}
          {/* ✅ tRPC/React Query context wrapper */}
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
