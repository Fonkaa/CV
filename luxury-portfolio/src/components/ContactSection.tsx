"use client";

import React, { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { 
  Mail, Phone, Send, Copy, Check, ArrowUpRight, 
  MessageSquareCode, Sparkles, User, FileText, CheckCircle2, AlertCircle
} from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function ContactSection() {
  const { data, addMessage } = usePortfolio();
  const { contact, contactCopy } = data;

  const targetEmail = contact?.email || "fikiylkal@gmail.com";

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCopy = (text: string, type: "email" | "phone") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2200);
    }
  };

  const getCleanTelegramUrl = (tg: string) => {
    if (!tg) return "#";
    return tg.startsWith("http") ? tg : `https://t.me/${tg.replace("@", "")}`;
  };

  const getCleanInstagramUrl = (ig: string) => {
    if (!ig) return "#";
    return ig.startsWith("http") ? ig : `https://instagram.com/${ig.replace("@", "")}`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill out your name, email, and message.");
      return;
    }

    setSending(true);
    setErrorMsg("");

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || "Portfolio Project Inquiry",
          message: message.trim(),
          recipient: targetEmail,
        }),
      });

      addMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || "Portfolio Project Inquiry",
        message: message.trim(),
      });

      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setTimeout(() => setSuccess(false), 6000);
    } catch {
      addMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || "Portfolio Project Inquiry",
        message: message.trim(),
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setTimeout(() => setSuccess(false), 6000);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[var(--color-border)]/50">
      <div className="relative rounded-3xl glass-panel p-6 sm:p-12 lg:p-16 border border-[var(--color-border)] overflow-hidden shadow-2xl">
        <div 
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[140px] opacity-20 pointer-events-none"
          style={{ background: "var(--color-primary)" }}
        />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col gap-4 max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-[var(--color-border)] w-fit">
            <MessageSquareCode className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="text-[11px] uppercase tracking-widest font-mono text-[var(--color-primary)] font-semibold">
              {contactCopy?.badge || "Direct Communication Hub"}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--color-text)] leading-tight">
            {contactCopy?.heading || "Initiate Contact & Engineering Inquiries"}
          </h2>

          <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed font-sans">
            {contactCopy?.subheading || "Send an instant transmission directly to my primary dispatch inbox, or reach out through direct communication channels."}
          </p>
        </div>

        {/* Form and Channels */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Message Form */}
          <div className="lg:col-span-7 rounded-2xl glass-panel border border-[var(--color-border)] p-6 sm:p-8 flex flex-col gap-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--color-text)]">
                  {contactCopy?.formTitle || "Send Direct Transmission"}
                </h3>
                <p className="text-xs text-[var(--color-muted)] font-mono">
                  {contactCopy?.formSubtitle || `Dispatches directly to ${targetEmail} & Admin Codex`}
                </p>
              </div>
              <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
            </div>

            {success && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{contactCopy?.successMessage || `Message delivered! It has been dispatched to ${targetEmail} and recorded in the Admin Dashboard.`}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[var(--color-muted)] mb-1.5 flex items-center gap-1.5">
                    <User className="w-3 h-3 text-[var(--color-primary)]" /> Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Lovelace"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[var(--color-muted)] mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-[var(--color-primary)]" /> Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ada@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs font-mono text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[var(--color-muted)] mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-[var(--color-primary)]" /> Subject / Focus
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="System Architecture Contract / Collaboration"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] bg-transparent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[var(--color-muted)] mb-1.5 flex items-center gap-1.5">
                  <MessageSquareCode className="w-3 h-3 text-[var(--color-primary)]" /> Message Content *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your project, timeline, architecture requirements, or inquiry..."
                  className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] bg-transparent resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-bg)] font-bold text-xs uppercase tracking-wider shadow-luxury-glow hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sending ? "Transmitting..." : (contactCopy?.buttonText || "Dispatch Message")}</span>
              </button>
            </form>
          </div>

          {/* Direct Channels */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-4 rounded-2xl glass-panel border border-[var(--color-border)] hover:border-[var(--color-primary)]/60 transition-all flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[var(--color-surface)] text-[var(--color-primary)]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-xs uppercase font-mono tracking-wider font-semibold text-[var(--color-text)]">
                    Primary Email
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(targetEmail, "email")}
                  className="p-1.5 rounded-lg glass-panel hover:text-[var(--color-primary)] transition-colors text-[var(--color-muted)]"
                  title="Copy Email"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <a href={`mailto:${targetEmail}`} className="text-xs sm:text-sm font-mono text-[var(--color-primary)] hover:underline truncate">
                {targetEmail}
              </a>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-[var(--color-border)] hover:border-[var(--color-primary)]/60 transition-all flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[var(--color-surface)] text-[var(--color-primary)]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-xs uppercase font-mono tracking-wider font-semibold text-[var(--color-text)]">
                    Phone / Call
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(contact?.phone || "", "phone")}
                  className="p-1.5 rounded-lg glass-panel hover:text-[var(--color-primary)] transition-colors text-[var(--color-muted)]"
                  title="Copy Phone"
                >
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <a href={`tel:${contact?.phone}`} className="text-xs sm:text-sm font-mono text-[var(--color-primary)] hover:underline truncate">
                {contact?.phone || "+251 9..."}
              </a>
            </div>

            <a
              href={getCleanTelegramUrl(contact?.telegram || "")}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl glass-panel border border-[var(--color-border)] hover:border-[var(--color-primary)]/60 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[var(--color-surface)] text-[var(--color-primary)] group-hover:scale-105 transition-transform">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs uppercase font-mono tracking-wider font-semibold text-[var(--color-text)]">Telegram</p>
                  <p className="text-[11px] text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors">Direct Conversation</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

            <a
              href={getCleanInstagramUrl(contact?.instagram || "")}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl glass-panel border border-[var(--color-border)] hover:border-[var(--color-primary)]/60 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[var(--color-surface)] text-[var(--color-primary)] group-hover:scale-105 transition-transform">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs uppercase font-mono tracking-wider font-semibold text-[var(--color-text)]">Instagram</p>
                  <p className="text-[11px] text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors">Visual Archive</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>
        </div>

        {/* Dynamic Footer Bar */}
        <div className="mt-14 pt-8 border-t border-[var(--color-border)]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--color-muted)]">
          <p>{contactCopy?.footerCopyright || `© 2026 Portfolio Atelier. Direct routing to ${targetEmail}.`}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[var(--color-primary)]">
              <Sparkles className="w-3.5 h-3.5" /> {contactCopy?.footerStatus || "High Availability Online"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}