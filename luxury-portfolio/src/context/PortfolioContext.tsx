"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PortfolioData, ThemeType, ContactMessage } from "@/types/portfolio";
import { initialData } from "@/data/initialData";

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (newData: Partial<PortfolioData>) => Promise<boolean>;
  resetData: () => void;
  addMessage: (msg: Omit<ContactMessage, "id" | "createdAt">) => ContactMessage;
  deleteMessage: (id: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  activeTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);
const STORAGE_KEY = "luxury_portfolio_data_v1";

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const applyTheme = (theme: ThemeType) => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
  };

  // 1. Initial Load: Fetch from Cloud DB First, fallback to LocalStorage
  useEffect(() => {
    async function loadPortfolioData() {
      // First, read localStorage for instantaneous render with zero flicker
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setData((prev) => ({ ...prev, ...parsed }));
          applyTheme(parsed.theme || "obsidian-gold");
        } else {
          applyTheme("obsidian-gold");
        }
      } catch {
        applyTheme("obsidian-gold");
      }

      // Second, query the live remote Upstash database (Phone & PC sync)
      try {
        const res = await fetch(`/api/portfolio?t=${Date.now()}`, {
          cache: "no-store",
          headers: { Pragma: "no-cache" },
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const merged: PortfolioData = {
              ...initialData,
              ...json.data,
              navbar: { ...initialData.navbar, ...(json.data.navbar || {}) },
              hero: { ...initialData.hero, ...(json.data.hero || {}) },
              projectsCopy: { ...initialData.projectsCopy, ...(json.data.projectsCopy || {}) },
              skillsCopy: { ...initialData.skillsCopy, ...(json.data.skillsCopy || {}) },
              githubCopy: { ...initialData.githubCopy, ...(json.data.githubCopy || {}) },
              contactCopy: { ...initialData.contactCopy, ...(json.data.contactCopy || {}) },
              contact: { ...initialData.contact, ...(json.data.contact || {}) },
              aiCopy: { ...initialData.aiCopy, ...(json.data.aiCopy || {}) },
              messages: json.data.messages || [],
            };

            setData(merged);
            applyTheme(merged.theme || "obsidian-gold");
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch (e) {
              console.warn("Local storage cache write error:", e);
            }
          }
        }
      } catch (err) {
        console.warn("Could not synchronize with cloud DB, staying on local copy:", err);
      }
    }

    loadPortfolioData();
  }, []);

  // 2. Update Data: Save locally AND broadcast to Upstash Cloud Database
  const updateData = async (newData: Partial<PortfolioData>): Promise<boolean> => {
    let updatedPayload: PortfolioData = { ...data, ...newData };

    setData((prev) => {
      updatedPayload = { ...prev, ...newData };
      return updatedPayload;
    });

    applyTheme(updatedPayload.theme || "obsidian-gold");

    // Write to browser cache
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPayload));
    } catch (e) {
      console.warn("Local storage quota error:", e);
    }

    // Broadcast globally to Upstash Redis DB
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      const json = await res.json();
      return json.success === true;
    } catch (err) {
      console.error("Failed to sync to cloud database:", err);
      return false;
    }
  };

  const addMessage = (msg: Omit<ContactMessage, "id" | "createdAt">): ContactMessage => {
    const newMessage: ContactMessage = {
      ...msg,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    const updatedMessages = [newMessage, ...(data.messages || [])];
    updateData({ messages: updatedMessages });
    return newMessage;
  };

  const deleteMessage = (id: string) => {
    const updated = (data.messages || []).filter((m) => m.id !== id);
    updateData({ messages: updated });
  };

  const setTheme = (theme: ThemeType) => {
    applyTheme(theme);
    updateData({ theme });
  };

  const resetData = () => {
    setData(initialData);
    localStorage.removeItem(STORAGE_KEY);
    applyTheme(initialData.theme);
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateData,
        resetData,
        addMessage,
        deleteMessage,
        isAdminOpen,
        setIsAdminOpen,
        isAuthenticated,
        setIsAuthenticated,
        activeTheme: data.theme,
        setTheme,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}