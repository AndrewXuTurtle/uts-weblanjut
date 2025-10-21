"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "Beranda", href: "/beranda" },
  { label: "Profil", href: "/profil" },
  { label: "Dosen", href: "/dosen" },
  { label: "Mahasiswa", href: "/mahasiswa" },
  { label: "Mata Kuliah", href: "/pengumuman" },
  { label: "Chat", href: "/chat", isChat: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (item: { label: string; href: string; isChat?: boolean }, e: React.MouseEvent) => {
    if (item.isChat) {
      e.preventDefault();
      // Dispatch custom event to open floating chat
      window.dispatchEvent(new CustomEvent('openFloatingChat'));
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg backdrop-blur-md bg-opacity-95 sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop & Mobile Header */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity duration-300"
          >
            Teknik Perangkat Lunak
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.isChat ? "#" : item.href}
                onClick={(e) => handleNavClick(item, e)}
                className="text-gray-300 hover:text-white relative group transition-colors duration-300 cursor-pointer"
              >
                {item.label}
                {/* Underline Animation */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-800 rounded-lg shadow-xl mt-2 overflow-hidden border border-gray-700">
            <div className="px-4 pt-3 pb-4 flex flex-col space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.isChat ? "#" : item.href}
                  onClick={(e) => handleNavClick(item, e)}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-all duration-300 transform hover:scale-105 hover:bg-gray-700"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}