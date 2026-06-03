"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/**
 * Interface representing a navigation link structure.
 */
interface NavLinkItem {
  label: string;
  href: string;
}

/**
 * Shared navigation links list, kept in sync between Desktop and Mobile drawers.
 */
const NAV_LINKS: NavLinkItem[] = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
  { label: "About Us", href: "#about" },
];

/**
 * Responsive Navigation Bar component with blur backgrounds, logo, desktop links,
 * and an interactive mobile drawer menu.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /**
   * Helper utility to toggle the open/close state of the mobile menu drawer.
   */
  const toggleMobileMenu = () => setIsOpen((prev) => !prev);

  /**
   * Closes the mobile menu drawer. Called when clicking navigation anchors.
   */
  const closeMobileMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-accent bg-white/80 backdrop-blur-md">
      <div className="w-full max-w-none px-6 sm:px-12 lg:px-20 xl:px-32">
        <div className="flex h-20 justify-between items-center">
          
          {/* Logo Brand Brand Area */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/Logo_Sigap_With_Title.png"
                alt="Sigap.ai Brand Logo"
                width={165}
                height={50}
                priority
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-16">
            {NAV_LINKS.map((link, idx) => (
              <Link 
                key={idx}
                href={link.href} 
                className="text-base font-semibold text-slate-600 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action CTAs (Desktop Only) */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#"
              className="text-base font-semibold text-slate-700 hover:text-primary transition-colors px-3 py-2"
            >
              Login
            </Link>
            <Link
              href="#features"
              className="text-base font-semibold text-white bg-primary hover:bg-teal-700 active:scale-95 transition-all px-6 py-3 rounded-xl shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>
          </div>

          {/* Hamburger Mobile Menu Toggle Icon */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden border-b border-accent bg-white" id="mobile-menu">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {NAV_LINKS.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-slate-100" />
            
            {/* Action CTAs (Mobile Layout) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Link
                href="#"
                onClick={closeMobileMenu}
                className="flex items-center justify-center rounded-xl border border-slate-200 px-3 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href="#features"
                onClick={closeMobileMenu}
                className="flex items-center justify-center rounded-xl bg-primary px-3 py-3 text-base font-semibold text-white hover:bg-teal-700 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
