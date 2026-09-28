"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PortfolioData, ThemeType, ContactMessage } from "@/types/portfolio";
import { initialData } from "@/data/initialData";

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (newData: Partial<PortfolioData>) => void;
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged: PortfolioData = {
          ...initialData,
          ...parsed,
          navbar: { ...initialData.navbar, ...(parsed.navbar || {}) },
          hero: { ...initialData.hero, ...(parsed.hero || {}) },
          projectsCopy: { ...initialData.projectsCopy, ...(parsed.projectsCopy || {}) },
          skillsCopy: { ...initialData.skillsCopy, ...(parsed.skillsCopy || {}) },
          githubCopy: { ...initialData.githubCopy, ...(parsed.githubCopy || {}) },
          contactCopy: { ...initialData.contactCopy, ...(parsed.contactCopy || {}) },
          contact: { ...initialData.contact, ...(parsed.contact || {}) },
          aiCopy: { ...initialData.aiCopy, ...(parsed.aiCopy || {}) },
          messages: parsed.messages || [],
        };
        setData(merged);
        applyTheme(merged.theme || "obsidian-gold");
      } else {
        applyTheme(initialData.theme || "obsidian-gold");
      }
    } catch {
      applyTheme("obsidian-gold");
    }
  }, []);

  const updateData = (newData: Partial<PortfolioData>) => {
    setData((prev) => {
      const updated = { ...prev, ...newData };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Storage write error", e);
      }
      return updated;
    });
  };

  const addMessage = (msg: Omit<ContactMessage, "id" | "createdAt">): ContactMessage => {
    const newMessage: ContactMessage = {
      ...msg,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setData((prev) => {
      const updated = {
        ...prev,
        messages: [newMessage, ...(prev.messages || [])],
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Storage write error", e);
      }
      return updated;
    });
    return newMessage;
  };

  const deleteMessage = (id: string) => {
    setData((prev) => {
      const updated = {
        ...prev,
        messages: (prev.messages || []).filter((m) => m.id !== id),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Storage write error", e);
      }
      return updated;
    });
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