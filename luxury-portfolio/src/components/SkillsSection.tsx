"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Terminal, Database, Cloud, Layers, ShieldCheck } from "lucide-react";

export default function SkillsSection() {
  const { data } = usePortfolio();
  const { skills } = data;

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("backend") || cat.includes("system")) {
      return <Terminal className="w-4 h-4 text-[var(--color-primary)]" />;
    }
    if (cat.includes("data") || cat.includes("storage") || cat.includes("sql")) {
      return <Database className="w-4 h-4 text-[var(--color-primary)]" />;
    }
    if (cat.includes("devops") || cat.includes("tool") || cat.includes("cloud")) {
      return <Cloud className="w-4 h-4 text-[var(--color-primary)]" />;
    }
    return <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />;
  };

  return (
    <section id="skills" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[var(--color-border)]/50">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4" /> Technical Competencies
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] mt-2">
            Architectural Disciplines & Stack
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[var(--color-muted)] max-w-md font-sans">
          Production capabilities across high-throughput backend services, relational systems, modern frontend architectures, and automated pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skills.map((skillGroup, idx) => (
          <div
            key={idx}
            className="rounded-3xl glass-panel p-6 sm:p-8 border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                  {getCategoryIcon(skillGroup.category)}
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--color-text)]">
                  {skillGroup.category}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {skillGroup.list.map((item, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3.5 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs font-mono text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all hover:scale-105"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--color-border)]/40 flex items-center justify-between text-[11px] font-mono text-[var(--color-muted)]">
              <span>Domain Verified</span>
              <span className="text-[var(--color-primary)]">Production Ready ✦</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}