"use client";

import { ShoppingCart, Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Props {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90  backdrop-blur-md border-b border-zinc-50 dark:border-zinc-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="font-semibold tracking-tight text-sm sm:text-base">
          NRC <span className="text-green-400 font-light">Marketplace</span>
        </Link>

        {/* Search Input (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-sm relative">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search laptops, audio, accessories..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-slate-400 transition placeholder:text-slate-400"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCart}
            className="relative p-2 text-green-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition"
            aria-label="Open Cart"
          >
            <ShoppingCart className="w-4 h-4 stroke-[1.75] text-green-600" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-600 text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-green-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-black/90" /> : <Search className="w-5 h-5 text-green-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 border-t border-slate-100 dark:border-gray-50 bg-white dark:bg-white">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search items..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-100 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>
      )}
    </header>
  );
}