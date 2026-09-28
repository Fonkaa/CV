"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import ThemeSwitcher from "./ThemeSwitcher";
import { Lock, Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const { setIsAdminOpen, isAuthenticated } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Overview", href: "#hero" },
    { label: "Selected Works", href: "#projects" },
    { label: "Expertise", href: "#skills" },
    { label: "Connect", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl glass-panel">
        {/* Brand / Monogram */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-serif font-bold text-lg border border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-primary)] group-hover:shadow-[0_0_20px_var(--color-primary-glow)] transition-all">
            ✦
          </div>
          <span className="font-serif tracking-widest text-sm sm:text-base font-semibold text-[var(--color-text)] uppercase group-hover:text-[var(--color-primary)] transition-colors">
            Portfolio
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-widest font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Section: Theme Selector + Secret Admin Access */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeSwitcher />

          {/* Discreet Admin Lock Button */}
          <button
            onClick={() => setIsAdminOpen(true)}
            aria-label="Admin Portal"
            className={`p-2 rounded-xl border border-[var(--color-border)] transition-all duration-300 ${
              isAuthenticated
                ? "bg-[var(--color-primary)] text-[var(--color-bg)] shadow-[0_0_15px_var(--color-primary-glow)]"
                : "bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]"
            }`}
            title={isAuthenticated ? "Admin Active" : "Access Admin CMS"}
          >
            {isAuthenticated ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-5 rounded-2xl glass-panel flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium tracking-wide text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}