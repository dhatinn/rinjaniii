/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Menu, X, Landmark, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export default function Navbar({ onScrollToSection, onOpenBooking, onOpenAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'Syarat Pendakian', id: 'checklist' },
    { name: 'Paket Porter', id: 'calculator' },
    { name: 'Galeri', id: 'gallery' },
    { name: 'Map', id: 'map-section' },
  ];

  const handleItemClick = (id: string) => {
    onScrollToSection(id);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 rounded-2xl glass-panel px-6 py-4 flex items-center justify-between transition-all duration-300">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
          <Compass className="w-5 h-5" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-white bg-clip-text">
          Rinjani Explorer
        </span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="text-sm font-medium text-slate-200 hover:text-white transition-colors duration-200 cursor-pointer relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-400 hover:after:w-full after:transition-all after:duration-300"
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={onOpenAdmin}
          aria-label="Admin login"
          className="inline-flex items-center justify-center rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ShieldCheck className="w-5 h-5" />
        </button>
        <button
          onClick={onOpenBooking}
          className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-md shadow-emerald-950/20 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Daftar Sekarang
        </button>
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-20 left-0 right-0 p-4 rounded-2xl glass-panel-dark mx-1 flex flex-col gap-3 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="w-full py-2.5 px-4 text-left text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              {item.name}
            </button>
          ))}
          <button
            onClick={() => {
              onOpenBooking();
              setIsOpen(false);
            }}
            className="w-full mt-2 py-3 rounded-xl text-center text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-lg active:scale-95 transition-all duration-200"
          >
            Daftar Sekarang
          </button>
        </div>
      )}
    </nav>
  );
}
