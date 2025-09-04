"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Drawer from "./components/Drawer";
import DashboardLayout from "./components/DashboardLayout";
import SearchOverlay from "./components/SearchOverlay";

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  /**
   * 
   * @param e KeyboardEvent
   * Toggles the search overlay when Cmd+K or Ctrl+K is pressed
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setIsSearchOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />
      <Sidebar />
      <Drawer />
      <DashboardLayout />
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
