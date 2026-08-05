"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ModeSwitch } from "../experience/ModeSwitch";
import { Menu, X } from "lucide-react";
import { useXRay } from "../experience/XRayContext";

export const Header: React.FC = () => {
  const { lang, mode } = useXRay();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b backdrop-blur-md ${
        mode === "source"
          ? "bg-[#0B0D10]/90 border-blue-500/20 text-[#EDF1F7]"
          : "bg-[#F8F7F4]/90 border-neutral-200 text-[#121316]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between font-sans">
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-extrabold tracking-tighter text-lg font-mono flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span>VANSGAMEE</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider font-mono">
          <a href="#work" className="hover:text-blue-600 transition-colors">
            {lang === "ru" ? "ПРОЕКТЫ" : "WORK"}
          </a>
          <a href="#about" className="hover:text-blue-600 transition-colors">
            {lang === "ru" ? "ОБ АВТОРЕ" : "ABOUT"}
          </a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">
            {lang === "ru" ? "КОНТАКТЫ" : "CONTACT"}
          </a>
        </nav>

        {/* Mode Controls & Language */}
        <div className="hidden sm:flex items-center gap-4">
          <ModeSwitch />
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t px-6 py-6 space-y-6 bg-inherit">
          <nav className="flex flex-col gap-4 font-mono text-sm font-semibold uppercase">
            <a
              href="#work"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-600"
            >
              {lang === "ru" ? "ПРОЕКТЫ" : "WORK"}
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-600"
            >
              {lang === "ru" ? "ОБ АВТОРЕ" : "ABOUT"}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-600"
            >
              {lang === "ru" ? "КОНТАКТЫ" : "CONTACT"}
            </a>
          </nav>
          <div className="pt-2 border-t border-neutral-300 dark:border-neutral-800">
            <ModeSwitch />
          </div>
        </div>
      )}
    </header>
  );
};
