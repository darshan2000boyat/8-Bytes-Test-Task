"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX, FiSearch, FiBell } from "react-icons/fi";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const drawerCheckbox = document.getElementById(
      "my-drawer"
    ) as HTMLInputElement;

    const handleChange = () => {
      setIsDrawerOpen(drawerCheckbox.checked);
    };

    drawerCheckbox?.addEventListener("change", handleChange);

    return () => {
      drawerCheckbox?.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 z-40 navbar bg-white text-black shadow-sm">
      {/* Left - Menu */}
      <div className="navbar-start">
        <label
          htmlFor="my-drawer"
          aria-label="Open drawer"
          className="btn btn-ghost btn-circle"
        >
          {isDrawerOpen ? (
            <FiX className="text-xl" />
          ) : (
            <FiMenu className="text-xl" />
          )}
        </label>
      </div>

      {/* Center - Logo */}
      <div className="navbar-center">
        <Link href="/" className="text-xl">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="8Byte Logo"
              width={150}
              height={100}
              className="h-14 w-auto"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Right - Actions */}
      <div className="navbar-end space-x-2">
        <button aria-label="Search" className="btn btn-ghost btn-circle">
          <FiSearch className="text-xl" />
        </button>

        <button aria-label="Notifications" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <FiBell className="text-xl" />
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
