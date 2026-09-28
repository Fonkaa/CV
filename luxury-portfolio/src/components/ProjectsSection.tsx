"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { ArrowUpRight, Play, ExternalLink } from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export default function ProjectsSection() {
  const { data } = usePortfolio();
  const { projects } = data;

  return (
    <section id="projects" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-[var(--color-border)] pb-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-semibold">
            Curated Portfolio
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] mt-2">
            Engineered Systems & Products
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[var(--color-muted)] max-w-md font-sans">
          Production systems built for scale, resilience, and mathematical elegance. All items are dynamically maintained via the CMS.
        </p>
      </div>

      {/* Modern High-End Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group relative rounded-3xl glass-panel border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl"
          >
            {/* Visual Media Container (Photos or Videos) */}
            {project.mediaUrl && (
              <div className="relative w-full aspect-video sm:aspect-[16/9] overflow-hidden bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                {project.mediaType === "video" ? (
                  <video
                    src={project.mediaUrl}
                    controls
                    className="w-full h-full object-cover"
                    poster=""
                  />
                ) : (
                  <img
                    src={project.mediaUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-card)] via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>
            )}

            {/* Content Body */}
            <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-xs font-mono text-[var(--color-primary)] uppercase tracking-wider font-semibold">
                    {project.tagline}
                  </span>
                  
                  {/* Action Link Icons */}
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl glass-panel text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
                        title="View GitHub Repository"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl glass-panel text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
                        title="Open Live Host Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mb-3">
                  {project.title}
                </h3>

                <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-6 font-sans">
                  {project.description}
                </p>
              </div>

              {/* Bottom Footer: Tags & Live Host CTA */}
              <div className="pt-6 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono px-3 py-1 rounded-lg bg-[var(--color-surface)] text-[var(--color-muted)] border border-[var(--color-border)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline uppercase tracking-wider ml-auto"
                  >
                    <span>Launch App</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}