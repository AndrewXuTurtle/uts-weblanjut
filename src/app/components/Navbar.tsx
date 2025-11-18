"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const navItems = [
  { label: "Beranda", href: "/beranda" },
  { label: "Profil", href: "/profil" },
  { label: "Dosen", href: "/dosen" },
  { label: "Mahasiswa", href: "/mahasiswa" },
  { label: "Mata Kuliah", href: "/matakuliah" },
  { 
    label: "Riset & PKM", 
    href: "#", 
    submenu: [
      { label: "Penelitian", href: "/penelitian" },
      { label: "PKM", href: "/pkm" }
    ]
  },
  {
    label: "Informasi",
    href: "#",
    submenu: [
      { label: "Pengumuman", href: "/pengumuman" },
      { label: "Berita", href: "/berita" },
      { label: "Agenda", href: "/agenda" },
      { label: "Peraturan", href: "/peraturan" }
    ]
  },
  {
    label: "Alumni",
    href: "#",
    submenu: [
      { label: "Kisah Sukses", href: "/kisah-sukses" },
      { label: "Tracer Study", href: "/tracer-study" }
    ]
  },
  { label: "Chat", href: "/chat", isChat: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(null);
    }, 300); // 300ms delay before closing
  };

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setDropdownOpen(label);
  };

  const handleNavClick = (item: { label: string; href: string; isChat?: boolean }, e: React.MouseEvent) => {
    if (item.isChat) {
      e.preventDefault();
      // Dispatch custom event to open floating chat
      window.dispatchEvent(new CustomEvent('openFloatingChat'));
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop & Mobile Header */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold text-white hover:opacity-90 transition-opacity duration-300"
          >
            Teknik Perangkat Lunak
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 relative">
            {navItems.map((item) => (
              <div 
                key={item.label} 
                className="relative"
                onMouseEnter={() => item.submenu && handleMouseEnter(item.label)}
                onMouseLeave={() => item.submenu && handleMouseLeave()}
              >
                <a
                  href={item.isChat ? "#" : item.href}
                  onClick={(e) => handleNavClick(item, e)}
                  className="text-blue-50 hover:text-white relative group transition-colors duration-300 cursor-pointer flex items-center"
                >
                  {item.label}
                  {item.submenu && (
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  {/* Underline Animation */}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </a>
                {item.submenu && dropdownOpen === item.label && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                        onClick={() => setDropdownOpen(null)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-blue-50 hover:text-white focus:outline-none transition-colors duration-200"
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
          <div className="md:hidden bg-white rounded-lg shadow-xl mt-2 overflow-hidden border border-gray-200">
            <div className="px-4 pt-3 pb-4 flex flex-col space-y-3">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === item.label ? null : item.label)}
                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-all duration-300 transform hover:scale-105 hover:bg-blue-50 w-full text-left flex items-center justify-between"
                      >
                        {item.label}
                        <svg className={`w-4 h-4 transition-transform ${mobileSubmenuOpen === item.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {mobileSubmenuOpen === item.label && (
                        <div className="ml-4 mt-2 space-y-2">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm transition-colors duration-200"
                              onClick={() => { setIsOpen(false); setMobileSubmenuOpen(null); }}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.isChat ? "#" : item.href}
                      onClick={(e) => handleNavClick(item, e)}
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-all duration-300 transform hover:scale-105 hover:bg-blue-50 block"
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}