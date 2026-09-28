"use client";

import React, { useState, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Star, GitFork, ExternalLink, RefreshCw, Users, BookOpen, AlertCircle } from "lucide-react";

// Self-contained GitHub SVG Mark
function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

interface GitHubProfile {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  location?: string | null;
}

export default function GitHubProjects() {
  const { data, updateData } = usePortfolio();
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputUsername, setInputUsername] = useState(data.githubUsername || "");

  const syncGitHub = async (usernameToFetch: string) => {
    const cleanUser = usernameToFetch.trim();
    if (!cleanUser) {
      setErrorMessage("Please enter a GitHub username to sync.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/github?username=${encodeURIComponent(cleanUser)}`);
      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.error || `Error ${res.status}: Failed to sync.`);
        return;
      }

      setProfile(result.profile);
      setRepos(result.repos || []);
      // Persist the verified username in your portfolio context
      updateData({ githubUsername: cleanUser });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to contact GitHub service.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-sync on load if a username is already saved
  useEffect(() => {
    if (data.githubUsername && data.githubUsername.trim() !== "") {
      setInputUsername(data.githubUsername);
      syncGitHub(data.githubUsername);
    }
  }, [data.githubUsername]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      syncGitHub(inputUsername);
    }
  };

  return (
    <section id="github" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[var(--color-border)]/50">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-semibold flex items-center gap-2">
            <GithubIcon className="w-4 h-4 text-[var(--color-primary)]" /> Live GitHub Integration
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] mt-2">
            Open Source & Repositories
          </h2>
        </div>

        {/* Sync Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            placeholder="GitHub username..."
            className="px-3.5 py-2.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs font-mono text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] w-48 bg-transparent"
          />
          <button
            type="submit"
            disabled={loading || !inputUsername.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--color-bg)] font-bold text-xs uppercase tracking-wider shadow-luxury-glow hover:brightness-110 disabled:opacity-50 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Syncing..." : "Sync Repos"}</span>
          </button>
        </form>
      </div>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* GitHub Profile Overview Card */}
      {profile && (
        <div className="mb-10 p-6 sm:p-8 rounded-3xl glass-panel border border-[var(--color-border)] flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-xl animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {profile.avatar_url && (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-20 h-20 rounded-2xl border-2 border-[var(--color-primary)] shadow-luxury-glow object-cover flex-shrink-0"
              />
            )}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text)]">
                  {profile.name}
                </h3>
                <span className="text-xs font-mono text-[var(--color-primary)] font-semibold">@{profile.login}</span>
              </div>
              <p className="text-xs text-[var(--color-muted)] max-w-xl leading-relaxed mt-1 font-sans">
                {profile.bio}
              </p>
              {profile.location && (
                <span className="text-[11px] font-mono text-[var(--color-muted)] mt-1">
                  📍 {profile.location}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="flex items-center gap-4 text-xs font-mono text-[var(--color-muted)]">
              <span className="flex items-center gap-1.5" title="Public Repositories">
                <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
                <strong className="text-[var(--color-text)]">{profile.public_repos}</strong> repos
              </span>
              <span className="flex items-center gap-1.5" title="Followers">
                <Users className="w-4 h-4 text-[var(--color-primary)]" />
                <strong className="text-[var(--color-text)]">{profile.followers}</strong> followers
              </span>
            </div>

            <a
              href={profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl glass-panel border border-[var(--color-primary)] text-xs font-mono text-[var(--color-primary)] font-bold hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-all"
            >
              <span>View Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Repositories Grid */}
      {loading && repos.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-muted)] font-mono text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[var(--color-primary)]" />
          <span>Synchronizing with GitHub API...</span>
        </div>
      ) : repos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-3xl glass-panel border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <span className="font-serif font-bold text-base text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors truncate">
                    {repo.name}
                  </span>
                  <ExternalLink className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors flex-shrink-0" />
                </div>
                <p className="text-xs text-[var(--color-muted)] line-clamp-2 mb-6 font-sans leading-relaxed">
                  {repo.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]/50 text-xs font-mono text-[var(--color-muted)]">
                <span className="text-[var(--color-primary)] font-semibold">
                  {repo.language}
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1" title="Stars">
                    <Star className="w-3.5 h-3.5" /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1" title="Forks">
                    <GitFork className="w-3.5 h-3.5" /> {repo.forks_count}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-16 rounded-3xl glass-panel border border-[var(--color-border)] text-xs text-[var(--color-muted)] font-mono">
            Type your GitHub handle in the box above and click <strong>Sync Repos</strong> to load your profile and public repositories.
          </div>
        )
      )}
    </section>
  );
}