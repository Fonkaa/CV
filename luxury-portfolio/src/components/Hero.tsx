"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { ArrowUpRight, FileDown, Sparkles } from "lucide-react";

export default function Hero() {
  const { data } = usePortfolio();
  const { hero } = data;

  return (
    <section id="hero" className="relative pt-36 pb-20 md:pt-48 md:pb-32 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Ambient Radial Glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full blur-[130px] opacity-25 pointer-events-none transition-colors duration-700"
        style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Headlines & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          {/* Live Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-[var(--color-border)] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-primary)]">
              {hero.badge || "Available for Select Contracts"}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text)] leading-[1.15]">
            {hero.headline}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl font-medium tracking-wide text-[var(--color-primary)]/90">
            {hero.subheadline}
          </p>

          {/* Bio Paragraph */}
          <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed max-w-xl">
            {hero.bio}
          </p>

          {/* CTA Button Group */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-xs sm:text-sm tracking-wider uppercase bg-[var(--color-primary)] text-[var(--color-bg)] hover:brightness-110 shadow-luxury-glow transition-all"
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href={hero.resumeUrl || "#"}
              download
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-xs sm:text-sm tracking-wider uppercase glass-panel text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
            >
              <FileDown className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Resume / Dossier</span>
            </a>
          </div>
        </div>

        {/* Right Column: Visual Portrait & Precision Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative group w-72 sm:w-80 md:w-96">
            {/* Outer Decorative Gradient Border */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[var(--color-primary)] to-transparent opacity-40 blur-sm group-hover:opacity-75 transition-opacity duration-500" />

            {/* Inner Image Frame */}
            <div className="relative rounded-3xl glass-panel p-3 border border-[var(--color-border)] overflow-hidden">
              <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[var(--color-surface)] relative">
                {/* Dynamic Image */}
                <img
                  src={hero.avatarUrl}
                  alt="Profile Portrait"
                  className="w-full h-full object-cover object-top grayscale-[15%] contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent opacity-70" />

                {/* Status Float Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl glass-panel border border-[var(--color-border)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text)]">
                      {hero.status || "Open to Engagements"}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--color-muted)] font-mono">2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}