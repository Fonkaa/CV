"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { ThemeType } from "@/types/portfolio";

export default function ThemeSwitcher() {
  const { activeTheme, setTheme } = usePortfolio();

  const themes: Array<{
    id: ThemeType;
    label: string;
    previewBg: string;
    ringColor: string;
  }> = [
    {
      id: "obsidian-gold",
      label: "Obsidian & Gold",
      previewBg: "#09090b",
      ringColor: "ring-[#facc15]",
    },
    {
      id: "emerald-rose",
      label: "Emerald & Rose",
      previewBg: "#022019",
      ringColor: "ring-[#fb923c]",
    },
    {
      id: "sapphire-ice",
      label: "Sapphire & Ice",
      previewBg: "#081536",
      ringColor: "ring-[#38bdf8]",
    },
    {
      id: "minimal-alabaster",
      label: "70% Alabaster White & 30% Carbon Gold",
      previewBg: "#f8fafc",
      ringColor: "ring-[#d97706]",
    },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
      {themes.map((t) => {
        const isActive = activeTheme === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            title={t.label}
            aria-label={`Switch to ${t.label}`}
            style={{ backgroundColor: t.previewBg }}
            className={`w-5 h-5 rounded-full transition-all duration-300 border border-black/30 shadow-inner flex-shrink-0 ${
              isActive
                ? `ring-2 ${t.ringColor} ring-offset-2 ring-offset-[var(--color-surface)] scale-110`
                : "opacity-60 hover:opacity-100 hover:scale-105"
            }`}
          />
        );
      })}
    </div>
  );
}