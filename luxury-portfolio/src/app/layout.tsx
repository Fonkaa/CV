import type { Metadata } from "next";
import "./globals.css";
import { PortfolioProvider } from "@/context/PortfolioContext";
import Navbar from "@/components/Navbar";
import AdminModal from "@/components/AdminModal";
import AIAssistant from "@/components/AIAssistant";

export const metadata: Metadata = {
  title: "Bespoke Portfolio & Digital Atelier",
  description: "High-precision software engineering, system architecture, and AI platform portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="obsidian-gold" suppressHydrationWarning>
      <body 
        suppressHydrationWarning
        className="antialiased min-h-screen selection:bg-[var(--color-primary)] selection:text-[var(--color-bg)]"
      >
        <PortfolioProvider>
          <Navbar />
          <main>{children}</main>
          <AdminModal />
          <AIAssistant />
        </PortfolioProvider>
      </body>
    </html>
  );
}