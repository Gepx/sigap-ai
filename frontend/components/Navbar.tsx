"use client";

import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "MVP", href: "#mvp" },
  { label: "Features", href: "#features" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#1A2E26]/10 bg-[#F4F9F6]/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-[#00B074] text-white shadow-lg shadow-[#00B074]/25">
            <Sparkles className="size-5" />
          </span>
          <span className="text-xl font-black tracking-tight text-[#1A2E26]">
            Sigap.ai
          </span>
        </Link>

        <div className="hidden items-center rounded-full border border-[#1A2E26]/10 bg-white/70 px-2 py-2 shadow-sm md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-5 py-2 text-sm font-semibold text-[#1A2E26]/70 transition hover:bg-[#00B074]/10 hover:text-[#1A2E26]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-full px-5 py-2.5 text-sm font-bold text-[#1A2E26]/70 transition hover:text-[#00B074]"
          >
            Login
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-[#00B074] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#00B074]/25 transition hover:-translate-y-0.5 hover:bg-[#079968]"
          >
            Try dashboard
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setIsOpen((value) => !value)}
          className="flex size-10 items-center justify-center rounded-full border border-[#1A2E26]/10 bg-white text-[#1A2E26] md:hidden"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-[#1A2E26]/10 bg-[#F4F9F6] px-5 pb-5 md:hidden">
          <div className="grid gap-2 pt-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-bold text-[#1A2E26]/75 transition hover:bg-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-2xl bg-[#00B074] px-4 py-3 text-center text-sm font-bold text-white"
            >
              Try dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
