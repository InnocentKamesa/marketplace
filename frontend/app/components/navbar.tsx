"use client";


import { Home, Compass, PlusCircle, ShoppingBag, User } from "lucide-react";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
interface Props {
  cartCount: number;
  onOpenCart: () => void;
  status: "not-logged"  | "logged" ;
}

export function Navbar({ cartCount, onOpenCart, status }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

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
            {status === "logged" ?
            <ShoppingCart className="w-4 h-4 stroke-[1.75] text-green-600"  onClick={() => {setTimeout( () => { router.push("cart")}, 200)}}/>
            : (
              <p className="text-xs text-green-400 hover:underline" onClick={() => {router.push("/auth/login")}}>Sign In</p>
            )
            }
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

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenCategories: () => void;
}

export function BottomNav({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenCategories,
}: BottomNavProps) {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95  backdrop-blur-md border-t border-slate-100 dark:border-slate-900 px-2 py-2">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 p-1.5 transition ${
            activeTab === "home"
              ? "text-emerald-600 dark:text-emerald-600"
              : "text-gray-500 hover:text-gray-500"
          }`}
        >
          <Home className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] font-mono tracking-tight">Home</span>
        </button>

        {/* Categories Drawer Trigger */}
        <button
          onClick={() => {
            setActiveTab("categories");
            onOpenCategories();
          }}
          className={`flex flex-col items-center gap-1 p-1.5 transition ${
            activeTab === "categories"
              ? "text-emerald-600 dark:text-emerald-600"
              : "text-gray-500 hover:text-gray-500"
          }`}
        >
          <Compass className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] font-mono tracking-tight">Explore</span>
        </button>

        {/* Sell Button (Highlighted Action) */}
        <Link
          href="/sell"
          className="flex flex-col items-center gap-1 p-1.5 text-gray-500 dark:text-gray-400"
        >
          <PlusCircle className="w-6 h-6 stroke-[2]" />
          <span className="text-[10px] font-mono font-semibold tracking-tight">Sell</span>
        </Link>

        {/* Shopping Bag */}
        <button
          onClick={() => {
            setActiveTab("cart");
            onOpenCart();
          }}
          className={`relative flex flex-col items-center gap-1 p-1.5 transition ${
            activeTab === "cart"
              ? "text-emerald-600 dark:text-emerald-600"
              : "text-gray-500 hover:text-gray-500"
          }`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 stroke-[1.75]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-emerald-600 text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono tracking-tight">Cart</span>
        </button>

        {/* Account */}
        <button
          onClick={() => setActiveTab("account")}
          className={`flex flex-col items-center gap-1 p-1.5 transition ${
            activeTab === "account"
              ? "text-emerald-600 dark:text-emerald-600"
              : "text-gray-500 hover:text-gray-500"
          }`}
        >
          <User className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] font-mono tracking-tight">Account</span>
        </button>
      </div>
    </nav>
  );
}