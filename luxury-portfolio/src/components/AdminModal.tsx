"use client";

import React, { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { ThemeType } from "@/types/portfolio";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Save, Plus, CheckCircle2, 
  Upload, KeyRound, Sparkles, Layers, Bot, BookOpen,
  ChevronLeft, ChevronRight, Trash2, Cpu, Palette,
  Inbox, Mail, Clock, MessageSquare, FileCheck, FileUp, Loader2
} from "lucide-react";

export default function AdminModal() {
  const { data, updateData, deleteMessage, isAdminOpen, setIsAdminOpen, isAuthenticated, setIsAuthenticated, setTheme, activeTheme } = usePortfolio();
  
  const [passcode, setPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [spread, setSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"forward" | "backward">("forward");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  const [formData, setFormData] = useState(data);

  // PDF Parsing & Telemetry States
  const [parsingPdf, setParsingPdf] = useState(false);
  const [pdfStats, setPdfStats] = useState<string | null>(null);

  React.useEffect(() => {
    setFormData(data);
    setNewPasscode(data.adminPasscode || "fiker4620");
    if (data.resumePdfText) {
      setPdfStats(`Indexed document (${data.resumePdfText.length} characters)`);
    }
  }, [data, isAdminOpen]);

  if (!isAdminOpen) return null;

  const currentPassword = data.adminPasscode || "fiker4620";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === currentPassword) {
      setIsAuthenticated(true);
      setError(false);
      setSpread(1);
    } else {
      setError(true);
    }
  };

const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (dataUrl: string, type: "image" | "video") => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video");

    if (isVideo) {
      alert("Videos cannot be stored in browser storage. Please provide an external video URL.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        // Create an offscreen canvas to scale and compress the image
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to WebP/JPEG at 75% quality (~80KB - 250KB)
        const compressedDataUrl = canvas.toDataURL("image/webp", 0.75);
        onComplete(compressedDataUrl, "image");
      };
    };
    reader.readAsDataURL(file);
  };

  // Server-Side PDF Ingestion with Safe Parsing
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setPdfStats("Please select a valid .pdf file.");
      return;
    }

    setParsingPdf(true);
    setPdfStats("Transmitting and indexing document...");

    try {
      const formPayload = new FormData();
      formPayload.append("file", file);

      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formPayload,
      });

      const rawResponse = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(rawResponse);
      } catch {
        throw new Error(`Server returned non-JSON response (${res.status}): ${rawResponse.slice(0, 100)}`);
      }

      if (!res.ok || json.success === false) {
        throw new Error(json.error || `Server error (HTTP ${res.status})`);
      }

      const cleanedText = (json.text || "").trim();

      setFormData((prev) => ({
        ...prev,
        resumePdfName: json.fileName || file.name,
        resumePdfText: cleanedText,
      }));

      setPdfStats(`Parsed ${json.numPages} page(s) (${cleanedText.length} characters indexed)`);
    } catch (err: any) {
      console.error("PDF Parsing Error:", err);
      setPdfStats(err.message || "Extraction failed. Ensure PDF is readable.");
    } finally {
      setParsingPdf(false);
    }
  };

  // Document Removal Handler
  const handleRemovePdf = () => {
    setFormData((prev) => ({
      ...prev,
      resumePdfName: "",
      resumePdfText: "",
    }));
    setPdfStats(null);
  };

  const flipForward = () => {
    if (spread >= 4 || isFlipping) return;
    setIsFlipping(true);
    setFlipDirection("forward");
    setTimeout(() => {
      setSpread((prev) => prev + 1);
      setIsFlipping(false);
    }, 550);
  };

  const flipBackward = () => {
    if (spread <= 1 || isFlipping) return;
    setIsFlipping(true);
    setFlipDirection("backward");
    setTimeout(() => {
      setSpread((prev) => prev - 1);
      setIsFlipping(false);
    }, 550);
  };

  const handleThemeChange = (selectedTheme: ThemeType) => {
    setFormData((prev) => ({ ...prev, theme: selectedTheme }));
    setTheme(selectedTheme);
  };

  const handleSave = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const payload = {
      ...formData,
      adminPasscode: newPasscode.trim() || currentPassword,
    };
    updateData(payload);
    setSuccessMessage("All System Copies & Knowledge Documents Bound!");
    setTimeout(() => setSuccessMessage(""), 3500);
  };

  const availableThemes: Array<{ id: ThemeType; label: string; previewBg: string; ringColor: string }> = [
    { id: "obsidian-gold", label: "Obsidian & Gold", previewBg: "#09090b", ringColor: "ring-[#facc15]" },
    { id: "emerald-rose", label: "Emerald & Rose", previewBg: "#022019", ringColor: "ring-[#fb923c]" },
    { id: "sapphire-ice", label: "Sapphire & Ice", previewBg: "#081536", ringColor: "ring-[#38bdf8]" },
    { id: "minimal-alabaster", label: "70% Alabaster & 30% Carbon", previewBg: "#f8fafc", ringColor: "ring-[#d97706]" },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 backdrop-blur-2xl transition-colors duration-500 overflow-hidden"
      style={{
        backgroundColor: activeTheme === "minimal-alabaster" ? "rgba(248, 250, 252, 0.88)" : "rgba(0, 0, 0, 0.88)"
      }}
    >
      {/* Top Floating Ribbon */}
      <div className="absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-[92%] sm:w-auto gap-4 sm:gap-6 px-5 py-2.5 rounded-full glass-panel border border-[var(--color-border)] shadow-2xl">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
          <span className="font-serif text-xs font-bold uppercase tracking-wider text-[var(--color-text)]">
            {spread === 0 ? "Volume Sealed" : `Folios ${(spread * 2) - 1} & ${spread * 2} of 8`}
          </span>
        </div>
        
        {successMessage && (
          <span className="text-emerald-500 text-xs font-mono flex items-center gap-1.5 animate-pulse font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> {successMessage}
          </span>
        )}

        <button
          onClick={() => {
            setIsAdminOpen(false);
            setSpread(0);
          }}
          className="p-1 rounded-full text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
          title="Close Atelier"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 3D Book Stage */}
      <div 
        className="relative w-full max-w-5xl h-[86dvh] max-h-[820px] flex items-center justify-center pt-10 sm:pt-0"
        style={{ perspective: 2800 }}
      >
        <AnimatePresence mode="wait">
          
          {/* SPREAD 0: HARDCOVER */}
          {spread === 0 && (
            <motion.div
              key="closed-book"
              initial={{ scale: 0.9, opacity: 0, rotateY: 15 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ 
                rotateY: -95, 
                x: -320, 
                opacity: 0,
                transition: { duration: 0.75, ease: [0.65, 0, 0.35, 1] } 
              }}
              style={{ 
                transformOrigin: "left center", 
                transformStyle: "preserve-3d",
                background: "linear-gradient(145deg, var(--color-surface) 0%, var(--color-bg) 100%)",
                borderColor: "var(--color-border)"
              }}
              className="relative w-full max-w-sm sm:max-w-md h-[520px] sm:h-[580px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-[0_30px_90px_rgba(0,0,0,0.45)] border-2 overflow-hidden transition-colors duration-500"
            >
              <div 
                className="absolute inset-y-0 left-0 w-8 pointer-events-none opacity-40"
                style={{ background: "linear-gradient(to right, var(--color-primary), transparent)" }}
              />

              <div className="relative z-10 flex flex-col items-center gap-3 pt-6">
                <div className="w-16 h-16 rounded-2xl glass-panel border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shadow-luxury-glow">
                  <KeyRound className="w-8 h-8" />
                </div>
                <span className="text-[11px] font-mono tracking-widest uppercase text-[var(--color-primary)] font-bold">
                  Personal Codex
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[var(--color-text)]">
                  The Master Atelier
                </h2>
                <p className="text-xs text-[var(--color-muted)] max-w-xs leading-relaxed">
                  Provide master passcode to open folios and edit all site copy and AI documents.
                </p>
              </div>

              <form onSubmit={handleLogin} className="relative z-10 w-full flex flex-col gap-3">
                <input
                  type="password"
                  placeholder="Master Passcode..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl glass-panel border border-[var(--color-border)] text-[var(--color-text)] text-center font-mono tracking-widest text-base sm:text-lg focus:outline-none focus:border-[var(--color-primary)] bg-transparent"
                  autoFocus
                />
                {error && <p className="text-xs text-red-500 font-medium">Authentication invalid.</p>}
                
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs bg-[var(--color-primary)] text-[var(--color-bg)] shadow-luxury-glow hover:brightness-110 transition-all"
                >
                  Turn & Open Book
                </button>
              </form>

              <div className="relative z-10 text-[10px] font-mono text-[var(--color-muted)]">
                Default: <span className="text-[var(--color-primary)] font-bold">fiker4620</span> • Click to open
              </div>
            </motion.div>
          )}

          {/* SPREADS 1 TO 4 */}
          {spread > 0 && (
            <motion.div
              key="book-desk"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full flex flex-col lg:flex-row rounded-3xl border shadow-2xl overflow-hidden transition-colors duration-500"
              style={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                transformStyle: "preserve-3d"
              }}
            >
              {/* DESKTOP SPINE */}
              <div 
                className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-10 -translate-x-1/2 z-40 pointer-events-none border-x opacity-20"
                style={{
                  background: "linear-gradient(to right, rgba(0,0,0,0.5), transparent, rgba(0,0,0,0.5))",
                  borderColor: "var(--color-border)"
                }}
              />

              {/* 3D TURNING LEAF */}
              {isFlipping && (
                <motion.div
                  initial={{ rotateY: flipDirection === "forward" ? 0 : -180 }}
                  animate={{ rotateY: flipDirection === "forward" ? -180 : 0 }}
                  transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
                  style={{
                    transformOrigin: flipDirection === "forward" ? "left center" : "right center",
                    left: "50%",
                    transformStyle: "preserve-3d",
                  }}
                  className="hidden lg:block absolute top-0 bottom-0 w-1/2 z-30 pointer-events-none rounded-r-3xl border border-[var(--color-border)] shadow-2xl overflow-hidden"
                >
                  <div 
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 border-l border-[var(--color-border)]"
                    style={{ backgroundColor: "var(--color-surface)", backfaceVisibility: "hidden" }}
                  >
                    <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-[var(--color-primary)] animate-pulse">✦</div>
                    <span className="font-serif text-sm tracking-widest text-[var(--color-primary)] mt-3">Turning Folio...</span>
                  </div>
                  <div 
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 border-r border-[var(--color-border)]"
                    style={{ backgroundColor: "var(--color-bg)", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-[var(--color-primary)] animate-pulse">✦</div>
                    <span className="font-serif text-sm tracking-widest text-[var(--color-primary)] mt-3">Opening Folio...</span>
                  </div>
                </motion.div>
              )}

              {/* -------------------- LEFT FOLIO -------------------- */}
              <div 
                className="w-full lg:w-1/2 h-1/2 lg:h-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--color-border)] relative overflow-hidden transition-colors duration-500"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                <div 
                  onClick={flipBackward}
                  className="flex items-center justify-between pb-2 sm:pb-3 border-b border-[var(--color-border)] flex-shrink-0 cursor-pointer group"
                >
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[var(--color-primary)] font-bold">
                    Folio {(spread * 2) - 1} / 8
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono text-[var(--color-muted)] flex items-center gap-1 group-hover:text-[var(--color-primary)] transition-colors">
                    {spread > 1 ? "◂ Turn Back" : "Book Spine Anchor"}
                  </span>
                </div>

                <div 
                  className="flex-1 py-3 overflow-y-auto book-scroll min-h-0 flex flex-col gap-4 text-[var(--color-text)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* SPREAD 1 LEFT: THEME & SECURITY */}
                  {spread === 1 && (
                    <div className="flex flex-col gap-4">
                      <div className="p-4 rounded-2xl glass-panel border border-[var(--color-border)] flex flex-col gap-2.5">
                        <div className="flex items-center gap-2 text-[var(--color-primary)]">
                          <Palette className="w-4 h-4" />
                          <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">Active Atmosphere</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {availableThemes.map((t) => {
                            const isSelected = formData.theme === t.id;
                            return (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => handleThemeChange(t.id)}
                                className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                                  isSelected 
                                    ? "bg-[var(--color-bg)] border-[var(--color-primary)] shadow-sm"
                                    : "glass-panel border-[var(--color-border)] opacity-70 hover:opacity-100"
                                }`}
                              >
                                <span 
                                  className={`w-4 h-4 rounded-full border border-black/30 flex-shrink-0 ${
                                    isSelected ? `ring-2 ${t.ringColor} ring-offset-1 ring-offset-[var(--color-surface)]` : ""
                                  }`} 
                                  style={{ backgroundColor: t.previewBg }} 
                                />
                                <span className="text-[11px] font-medium truncate text-[var(--color-text)]">{t.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl glass-panel border border-[var(--color-border)] flex flex-col gap-2.5">
                        <div className="flex items-center gap-2 text-[var(--color-primary)]">
                          <KeyRound className="w-4 h-4" />
                          <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">Change Master Passcode</h4>
                        </div>
                        <input
                          type="text"
                          value={newPasscode}
                          onChange={(e) => setNewPasscode(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl glass-panel border border-[var(--color-border)] text-sm font-mono text-[var(--color-primary)] font-bold tracking-widest bg-transparent"
                          placeholder="Cipher..."
                        />
                      </div>

                      <div className="p-4 rounded-2xl glass-panel border border-[var(--color-border)] flex flex-col gap-2.5">
                        <div className="flex items-center gap-2 text-[var(--color-primary)]">
                          <Sparkles className="w-4 h-4" />
                          <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">Hero Status & Badges</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-[var(--color-muted)] mb-1">Badge Text</label>
                            <input
                              type="text"
                              value={formData.hero.badge}
                              onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, badge: e.target.value } })}
                              className="w-full px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs text-[var(--color-text)] bg-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-[var(--color-muted)] mb-1">Availability Label</label>
                            <input
                              type="text"
                              value={formData.hero.status}
                              onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, status: e.target.value } })}
                              className="w-full px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs text-[var(--color-text)] bg-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SPREAD 2 LEFT: PROJECTS MANAGEMENT */}
                  {spread === 2 && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)] flex-shrink-0">
                        <span className="text-xs uppercase font-serif font-bold text-[var(--color-primary)]">
                          Curated Works ({formData.projects.length})
                        </span>
                        <button
                          onClick={() => {
                            const newP = {
                              id: Date.now().toString(),
                              title: "Engineered Architecture",
                              tagline: "High-Performance System",
                              description: "Mathematical modeling and scalable server architecture.",
                              tags: ["TypeScript", "Next.js"],
                              mediaType: "image" as const,
                              mediaUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                              liveUrl: "https://",
                              githubUrl: "https://github.com",
                              featured: true
                            };
                            setFormData({ ...formData, projects: [newP, ...formData.projects] });
                            setSelectedProjectIndex(0);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-xs font-bold flex items-center gap-1 hover:brightness-110"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Project
                        </button>
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0 book-scroll">
                        {formData.projects.map((p, idx) => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedProjectIndex(idx)}
                            className={`px-3 py-1.5 rounded-xl text-left whitespace-nowrap transition-all border text-xs ${
                              selectedProjectIndex === idx
                                ? "bg-[var(--color-primary)] text-[var(--color-bg)] font-bold border-[var(--color-primary)] shadow-sm"
                                : "glass-panel text-[var(--color-muted)] border-[var(--color-border)] hover:text-[var(--color-text)]"
                            }`}
                          >
                            <span className="truncate max-w-[120px] inline-block">{p.title}</span>
                          </button>
                        ))}
                      </div>

                      {formData.projects[selectedProjectIndex] && (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1">
                              <label className="block text-[10px] font-mono uppercase text-[var(--color-muted)] mb-1">Project Title</label>
                              <input
                                type="text"
                                value={formData.projects[selectedProjectIndex].title}
                                onChange={(e) => {
                                  const up = [...formData.projects];
                                  up[selectedProjectIndex].title = e.target.value;
                                  setFormData({ ...formData, projects: up });
                                }}
                                className="w-full px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs sm:text-sm font-bold text-[var(--color-text)] bg-transparent"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const up = formData.projects.filter((_, i) => i !== selectedProjectIndex);
                                setFormData({ ...formData, projects: up });
                                setSelectedProjectIndex(Math.max(0, selectedProjectIndex - 1));
                              }}
                              className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors self-end"
                              title="Delete project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-mono uppercase text-[var(--color-muted)] mb-1">Tagline</label>
                              <input
                                type="text"
                                value={formData.projects[selectedProjectIndex].tagline}
                                onChange={(e) => {
                                  const up = [...formData.projects];
                                  up[selectedProjectIndex].tagline = e.target.value;
                                  setFormData({ ...formData, projects: up });
                                }}
                                className="w-full px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs font-mono text-[var(--color-primary)] bg-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono uppercase text-[var(--color-muted)] mb-1">Tech Tags</label>
                              <input
                                type="text"
                                value={formData.projects[selectedProjectIndex].tags.join(", ")}
                                onChange={(e) => {
                                  const up = [...formData.projects];
                                  up[selectedProjectIndex].tags = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                                  setFormData({ ...formData, projects: up });
                                }}
                                className="w-full px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs font-mono text-[var(--color-muted)] bg-transparent"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-[var(--color-muted)] mb-1">Architecture Summary</label>
                            <textarea
                              rows={3}
                              value={formData.projects[selectedProjectIndex].description}
                              onChange={(e) => {
                                const up = [...formData.projects];
                                up[selectedProjectIndex].description = e.target.value;
                                setFormData({ ...formData, projects: up });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs text-[var(--color-text)] resize-none leading-relaxed bg-transparent"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SPREAD 3 LEFT: SKILLS CATEGORIES */}
                  {spread === 3 && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                        <div className="flex items-center gap-2 text-[var(--color-primary)]">
                          <Cpu className="w-4 h-4" />
                          <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">
                            Dynamic Skills Categories ({formData.skills?.length || 0})
                          </h4>
                        </div>
                        <button
                          onClick={() => {
                            const newCategory = {
                              category: "New Competency Domain",
                              list: ["Skill Alpha", "Skill Beta"]
                            };
                            setFormData({
                              ...formData,
                              skills: [...(formData.skills || []), newCategory]
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-xs font-bold flex items-center gap-1 hover:brightness-110"
                        >
                          <Plus className="w-3 h-3" /> Add Domain
                        </button>
                      </div>

                      <div className="flex flex-col gap-3">
                        {formData.skills?.map((catGroup, cIdx) => (
                          <div key={cIdx} className="p-3.5 rounded-2xl glass-panel border border-[var(--color-border)] flex flex-col gap-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={catGroup.category}
                                onChange={(e) => {
                                  const updated = [...formData.skills];
                                  updated[cIdx].category = e.target.value;
                                  setFormData({ ...formData, skills: updated });
                                }}
                                className="flex-1 px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs font-bold font-serif text-[var(--color-text)] bg-transparent"
                                placeholder="Category Title"
                              />
                              <button
                                onClick={() => {
                                  const updated = formData.skills.filter((_, i) => i !== cIdx);
                                  setFormData({ ...formData, skills: updated });
                                }}
                                className="p-1.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Remove Domain"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div>
                              <input
                                type="text"
                                value={catGroup.list.join(", ")}
                                onChange={(e) => {
                                  const updated = [...formData.skills];
                                  updated[cIdx].list = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                                  setFormData({ ...formData, skills: updated });
                                }}
                                className="w-full px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs font-mono text-[var(--color-primary)] bg-transparent"
                                placeholder="Node.js, PostgreSQL, Docker..."
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SPREAD 4 LEFT: LIVE INBOX & DESTINATION EMAIL (FOLIO 7) */}
                  {spread === 4 && (
                    <div className="flex flex-col gap-4">
                      <div className="p-3.5 rounded-2xl glass-panel border border-[var(--color-border)] flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[var(--color-primary)]">
                          <Mail className="w-4 h-4" />
                          <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">
                            Primary Destination Email
                          </h4>
                        </div>
                        <p className="text-[11px] text-[var(--color-muted)]">
                          All incoming visitor transmissions are routed to this verified inbox.
                        </p>
                        <input
                          type="email"
                          value={formData.contact.email}
                          onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
                          className="w-full px-3 py-2 rounded-xl glass-panel border border-[var(--color-border)] text-xs sm:text-sm font-mono text-[var(--color-primary)] font-bold bg-transparent"
                          placeholder="fikiylkal@gmail.com"
                        />
                      </div>

                      <div className="flex items-center justify-between pb-1 border-b border-[var(--color-border)]">
                        <div className="flex items-center gap-2 text-[var(--color-primary)]">
                          <Inbox className="w-4 h-4" />
                          <h4 className="font-serif text-xs font-bold uppercase tracking-wider">
                            Live Messages Inbox ({data.messages?.length || 0})
                          </h4>
                        </div>
                      </div>

                      {(!data.messages || data.messages.length === 0) ? (
                        <div className="text-center py-8 px-4 rounded-2xl glass-panel border border-[var(--color-border)] text-xs text-[var(--color-muted)] font-mono">
                          No transmissions received yet. Inquiries submitted through the Contact form will arrive here in real-time.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto book-scroll pr-1">
                          {data.messages.map((m) => (
                            <div key={m.id} className="p-3 rounded-2xl glass-panel border border-[var(--color-border)] flex flex-col gap-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="truncate">
                                  <span className="font-serif font-bold text-xs text-[var(--color-text)]">{m.name}</span>
                                  <span className="text-[10px] font-mono text-[var(--color-primary)] ml-1.5">({m.email})</span>
                                </div>
                                <button
                                  onClick={() => deleteMessage(m.id)}
                                  className="text-red-400 hover:text-red-500 p-1"
                                  title="Delete message"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              {m.subject && <p className="text-[11px] font-mono font-semibold text-[var(--color-text)]">{m.subject}</p>}
                              <p className="text-xs text-[var(--color-muted)] font-sans leading-relaxed whitespace-pre-line bg-[var(--color-bg)]/40 p-2 rounded-xl">
                                {m.message}
                              </p>
                              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-muted)] pt-0.5">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-[var(--color-primary)]" />
                                  {new Date(m.createdAt).toLocaleDateString()}
                                </span>
                                <a 
                                  href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "Portfolio Inquiry")}`}
                                  className="text-[var(--color-primary)] font-bold hover:underline"
                                >
                                  Reply via Email
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Left Page Turn Footer */}
                <div 
                  onClick={flipBackward}
                  className="pt-2 sm:pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] sm:text-xs font-mono text-[var(--color-muted)] cursor-pointer hover:text-[var(--color-primary)] flex-shrink-0"
                >
                  <span className="flex items-center gap-1"><ChevronLeft className="w-3.5 h-3.5" /> Turn Back</span>
                  <span>Folio {(spread * 2) - 1}</span>
                </div>
              </div>

              {/* -------------------- RIGHT FOLIO -------------------- */}
              <div 
                className="w-full lg:w-1/2 h-1/2 lg:h-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden transition-colors duration-500"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                <div 
                  onClick={flipForward}
                  className="flex items-center justify-between pb-2 sm:pb-3 border-b border-[var(--color-border)] flex-shrink-0 cursor-pointer group"
                >
                  <span className="text-[10px] sm:text-xs font-mono text-[var(--color-muted)] flex items-center gap-1 group-hover:text-[var(--color-primary)] transition-colors">
                    {spread < 4 ? "Turn Forward ▸" : "Final Leaf"}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[var(--color-primary)] font-bold">
                    Folio {spread * 2} / 8
                  </span>
                </div>

                <div 
                  className="flex-1 py-3 overflow-y-auto book-scroll min-h-0 flex flex-col gap-4 text-[var(--color-text)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* SPREAD 1 RIGHT: HERO COPY */}
                  {spread === 1 && (
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[var(--color-muted)] mb-1">Display Name</label>
                        <input
                          type="text"
                          value={formData.hero.name || ""}
                          onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, name: e.target.value } })}
                          className="w-full px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs sm:text-sm font-bold text-[var(--color-primary)] font-serif bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[var(--color-muted)] mb-1">Headline</label>
                        <input
                          type="text"
                          value={formData.hero.headline}
                          onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, headline: e.target.value } })}
                          className="w-full px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs sm:text-sm font-serif text-[var(--color-text)] font-bold bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[var(--color-muted)] mb-1">Subheadline</label>
                        <input
                          type="text"
                          value={formData.hero.subheadline}
                          onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, subheadline: e.target.value } })}
                          className="w-full px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs text-[var(--color-text)] bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[var(--color-muted)] mb-1">Biography</label>
                        <textarea
                          rows={3}
                          value={formData.hero.bio}
                          onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, bio: e.target.value } })}
                          className="w-full px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs text-[var(--color-text)] resize-none leading-relaxed bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[var(--color-muted)] mb-1">Portrait Media (URL or Upload)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formData.hero.avatarUrl}
                            onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, avatarUrl: e.target.value } })}
                            className="flex-1 px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs font-mono text-[var(--color-text)] bg-transparent"
                          />
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-primary)] text-xs text-[var(--color-primary)] font-bold hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, (dataUrl) => {
                                setFormData({ ...formData, hero: { ...formData.hero, avatarUrl: dataUrl } });
                              })}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SPREAD 2 RIGHT: MEDIA ASSETS & URLS */}
                  {spread === 2 && formData.projects[selectedProjectIndex] && (
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-[var(--color-muted)] mb-1">Live URL</label>
                          <input
                            type="text"
                            value={formData.projects[selectedProjectIndex].liveUrl || ""}
                            onChange={(e) => {
                              const up = [...formData.projects];
                              up[selectedProjectIndex].liveUrl = e.target.value;
                              setFormData({ ...formData, projects: up });
                            }}
                            className="w-full px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs font-mono text-[var(--color-text)] bg-transparent"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-[var(--color-muted)] mb-1">GitHub URL</label>
                          <input
                            type="text"
                            value={formData.projects[selectedProjectIndex].githubUrl || ""}
                            onChange={(e) => {
                              const up = [...formData.projects];
                              up[selectedProjectIndex].githubUrl = e.target.value;
                              setFormData({ ...formData, projects: up });
                            }}
                            className="w-full px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs font-mono text-[var(--color-text)] bg-transparent"
                            placeholder="https://github.com/..."
                          />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-primary)] font-bold">
                            Visual Media Asset
                          </span>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const up = [...formData.projects];
                                up[selectedProjectIndex].mediaType = "image";
                                setFormData({ ...formData, projects: up });
                              }}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                                formData.projects[selectedProjectIndex].mediaType !== "video"
                                  ? "bg-[var(--color-primary)] text-[var(--color-bg)]"
                                  : "text-[var(--color-muted)]"
                              }`}
                            >
                              Image
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const up = [...formData.projects];
                                up[selectedProjectIndex].mediaType = "video";
                                setFormData({ ...formData, projects: up });
                              }}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                                formData.projects[selectedProjectIndex].mediaType === "video"
                                  ? "bg-[var(--color-primary)] text-[var(--color-bg)]"
                                  : "text-[var(--color-muted)]"
                              }`}
                            >
                              Video
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formData.projects[selectedProjectIndex].mediaUrl || ""}
                            onChange={(e) => {
                              const up = [...formData.projects];
                              up[selectedProjectIndex].mediaUrl = e.target.value;
                              setFormData({ ...formData, projects: up });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs font-mono text-[var(--color-text)] bg-transparent"
                            placeholder="Media URL or upload..."
                          />
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-primary)] text-xs text-[var(--color-primary)] font-bold hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept={formData.projects[selectedProjectIndex].mediaType === "video" ? "video/*" : "image/*"}
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, (dataUrl, type) => {
                                const up = [...formData.projects];
                                up[selectedProjectIndex].mediaUrl = dataUrl;
                                up[selectedProjectIndex].mediaType = type;
                                setFormData({ ...formData, projects: up });
                              })}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SPREAD 3 RIGHT: GITHUB INTEGRATION */}
                  {spread === 3 && (
                    <div className="flex flex-col gap-4">
                      <div className="p-4 rounded-2xl glass-panel border border-[var(--color-border)] flex flex-col gap-2.5">
                        <div className="flex items-center gap-2 text-[var(--color-primary)]">
                          <Layers className="w-4 h-4" />
                          <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">GitHub Username Handle</h4>
                        </div>
                        <p className="text-xs text-[var(--color-muted)]">
                          Provide your GitHub username (e.g. Fonkaa) to sync profile and repositories.
                        </p>
                        <input
                          type="text"
                          value={formData.githubUsername}
                          onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs sm:text-sm font-mono text-[var(--color-text)] bg-transparent"
                          placeholder="GitHub Username"
                        />
                      </div>
                    </div>
                  )}

                  {/* SPREAD 4 RIGHT: KNOWLEDGE BASE DOCUMENT (PDF) & AI DIRECTIVES (FOLIO 8) */}
                  {spread === 4 && (
                    <div className="flex flex-col gap-3">
                      
                      {/* PDF KNOWLEDGE BASE INGESTION CARD */}
                      <div className="p-3.5 rounded-2xl glass-panel border border-[var(--color-border)] flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[var(--color-primary)]">
                            <FileCheck className="w-4 h-4" />
                            <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">
                              AI Knowledge Base Document (PDF)
                            </h4>
                          </div>
                          {formData.resumePdfName && (
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              Indexed
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                          Upload your resume, CV, or detailed background document. The AI Assistant will ingest every page and use it as ground truth to answer questions.
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--color-primary)] text-[var(--color-bg)] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-sm">
                            {parsingPdf ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Ingesting PDF...</span>
                              </>
                            ) : (
                              <>
                                <FileUp className="w-3.5 h-3.5" />
                                <span>{formData.resumePdfName ? "Replace PDF" : "Upload Background PDF"}</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="application/pdf"
                              disabled={parsingPdf}
                              className="hidden"
                              onChange={handlePdfUpload}
                            />
                          </label>

                          {formData.resumePdfName && (
                            <button
                              type="button"
                              onClick={handleRemovePdf}
                              className="px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-xs font-mono border border-red-500/20"
                              title="Remove Ingested Document"
                            >
                              Remove PDF
                            </button>
                          )}
                        </div>

                        {formData.resumePdfName && (
                          <div className="text-[11px] font-mono text-[var(--color-primary)] truncate mt-1">
                            📄 <strong>{formData.resumePdfName}</strong> {pdfStats && `• ${pdfStats}`}
                          </div>
                        )}
                        {!formData.resumePdfName && pdfStats && (
                          <div className="text-[11px] font-mono text-amber-400">{pdfStats}</div>
                        )}
                      </div>

                      {/* Contact Section Copy */}
                      <div className="p-3 rounded-2xl glass-panel border border-[var(--color-border)] flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[var(--color-primary)]">
                          <MessageSquare className="w-4 h-4" />
                          <h4 className="font-serif text-xs font-bold uppercase tracking-wider">Contact Form Copy</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-[var(--color-muted)] mb-1">Heading</label>
                            <input
                              type="text"
                              value={formData.contactCopy?.heading || ""}
                              onChange={(e) => setFormData({ ...formData, contactCopy: { ...formData.contactCopy, heading: e.target.value } })}
                              className="w-full px-2.5 py-1.5 rounded-lg glass-panel border border-[var(--color-border)] text-xs text-[var(--color-text)] bg-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-[var(--color-muted)] mb-1">Button Label</label>
                            <input
                              type="text"
                              value={formData.contactCopy?.buttonText || ""}
                              onChange={(e) => setFormData({ ...formData, contactCopy: { ...formData.contactCopy, buttonText: e.target.value } })}
                              className="w-full px-2.5 py-1.5 rounded-lg glass-panel border border-[var(--color-border)] text-xs text-[var(--color-text)] bg-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Gemini AI Persona Directives */}
                      <div className="p-3 rounded-2xl glass-panel border border-[var(--color-border)] flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[var(--color-primary)]">
                          <Bot className="w-4 h-4" />
                          <h4 className="font-serif text-xs font-bold uppercase tracking-wider">Gemini AI Persona Directives</h4>
                        </div>
                        <textarea
                          rows={3}
                          value={formData.aiInstructions}
                          onChange={(e) => setFormData({ ...formData, aiInstructions: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl glass-panel border border-[var(--color-border)] text-xs text-[var(--color-text)] resize-none leading-relaxed bg-transparent"
                        />
                      </div>

                      {/* Inscribe & Bind Action */}
                      <button
                        onClick={handleSave}
                        className="w-full py-3 rounded-2xl bg-[var(--color-primary)] text-[var(--color-bg)] font-bold text-xs uppercase tracking-widest shadow-luxury-glow hover:brightness-110 transition-all flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Inscribe & Bind Grimoire</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Page Turn Footer */}
                <div 
                  onClick={flipForward}
                  className="pt-2 sm:pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] sm:text-xs font-mono text-[var(--color-muted)] cursor-pointer hover:text-[var(--color-primary)] flex-shrink-0"
                >
                  <span className="flex items-center gap-1">
                    {spread < 4 ? "Turn Forward" : "✦ Complete Edition"}
                    {spread < 4 && <ChevronRight className="w-3.5 h-3.5" />}
                  </span>
                  <button
                    onClick={handleSave}
                    className="text-[var(--color-primary)] font-bold hover:underline flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}