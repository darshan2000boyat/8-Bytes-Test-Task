"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Drawer from "../components/Drawer";
import SearchOverlay from "../components/SearchOverlay";

type UIContextType = {
  isSearchOpen: boolean;
  toggleSearch: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => setIsSearchOpen((prev) => !prev);

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      toggleSearch();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <UIContext.Provider value={{ isSearchOpen, toggleSearch }}>
      <Navbar onSearchClick={toggleSearch} />
      <Drawer />
      <main className="min-h-screen">{children}</main>
      <SearchOverlay isOpen={isSearchOpen} onClose={toggleSearch} />
    </UIContext.Provider>
  );
}

// Helper hook
export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used inside UIProvider");
  return context;
}
