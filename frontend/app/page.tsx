"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Link, Search, Sparkles, } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { MainCard, SectionCard, CategoryBar} from "./components/card";
import { useRouter } from "next/navigation";
import Section, { VerticalProductGrid } from "./components/section";
import type { ProductItem } from "./types/product";
import {LoadingSpinner} from "./components/spinner";
import TrendingCarousel from "./components/carousel";
import {Navbar, BottomNav} from "./components/navbar";
import type {CartItem} from "./types/cart";

const env = process.env.ENVIRONMENT || "development";
const API_URL = env === "development"? "http://localhost:5000" : process.env.NEXT_PUBLIC_API_URL;


export const PRODUCTS_DATA: ProductItem[] = [
  // --- Electronics ---
  {
    id: 101,
    title: "ThinkPad USB-C 65W Charger",
    description: "Original Lenovo 65W type-C fast charger. Works with ThinkPad, Dell, and HP laptops.",
    price: 35000,
    category: "Electronics",
    type: "Tech Accessory",
    status: "Available",
    location: "Block A - Room 12"
  },
  {
    id: 102,
    title: "Logitech Wireless Mouse M170",
    description: "Compact 2.4GHz wireless optical mouse with USB mini receiver. Includes fresh AA battery.",
    price: 12000,
    category: "Electronics",
    type: "Computer Hardware",
    status: "Available",
    location: "New Hostels - Block 3"
  },
  {
    id: 103,
    title: "1TB Transcend External Hard Drive",
    description: "Rugged shockproof USB 3.0 portable external hard drive. Pre-formatted and ready to use.",
    price: 45000,
    category: "Electronics",
    type: "Storage",
    status: "Reserved",
    location: "Library Quad"
  },

  // --- Fashion & Accessories ---
  {
    id: 201,
    title: "Canvas Laptop Backpack (15.6\")",
    description: "Water-resistant canvas backpack with dedicated padded laptop compartment and USB charging port.",
    price: 22000,
    category: "Fashion & Accessories",
    type: "Bags & Carriers",
    status: "Available",
    location: "Block C - Room 08"
  },
  {
    id: 202,
    title: "Unisex Oversized Hoodie (Black, L)",
    description: "Heavyweight fleece hoodies, super warm for late-night study sessions in the library.",
    price: 18000,
    category: "Fashion & Accessories",
    type: "Apparel",
    status: "Available",
    location: "Off-Campus / Chikanda"
  },
  {
    id: 203,
    title: "Casio Vintage Digital Watch",
    description: "Classic silver stainless steel water-resistant digital watch with backlight and daily alarm.",
    price: 15000,
    category: "Fashion & Accessories",
    type: "Accessories",
    status: "Available",
    location: "Block B - Room 24"
  },

  // --- Services ---
  {
    id: 301,
    title: "Ubuntu OS Installation & Dual Boot",
    description: "Complete Linux setup, driver configuration, VS Code installation, and environment debug service.",
    price: 8000,
    category: "Services",
    type: "Tech Support",
    status: "Available",
    location: "Campus Computer Lab / On-Site"
  },
  {
    id: 302,
    title: "Academic Paper Formatting & Typing",
    description: "APA/IEEE reference formatting, table of contents generation, and fast typing for proposals and reports.",
    price: 5000,
    category: "Services",
    type: "Freelance Academic",
    status: "Available",
    location: "Online / Email Delivery"
  },
  {
    id: 303,
    title: "Phone Screen & Port Repair",
    description: "Fast campus repair for Android/iPhone charging ports, battery replacements, and screen swaps.",
    price: "Varies",
    category: "Services",
    type: "Hardware Repair",
    status: "Available",
    location: "New Hostels - Room 104"
  },

  // --- Campus Essentials ---
  {
    id: 401,
    title: "Electric Kettle (1.8L Stainless Steel)",
    description: "Fast-boiling electric kettle for coffee, tea, and instant noodles. Clean and works perfectly.",
    price: 16000,
    category: "Campus Essentials",
    type: "Hostel Appliances",
    status: "Available",
    location: "Block D - Room 05"
  },
  {
    id: 402,
    title: "Adjustable LED Desk Lamp",
    description: "Rechargeable USB desk lamp with 3 brightness levels and flexible neck for night studying.",
    price: 9500,
    category: "Campus Essentials",
    type: "Room Accessories",
    status: "Available",
    location: "Block A - Room 19"
  },
  {
    id: 403,
    title: "Heavy-Duty 4-Way Extension Socket (3m)",
    description: "Surge-protected power strip with 3-meter cord and individual power switches.",
    price: 11000,
    category: "Campus Essentials",
    type: "Electrical",
    status: "Available",
    location: "Block B - Room 02"
  }
];

type UserProps = {
  id:string;
  first:string;
}


export default function HomePage() {
  const router = useRouter();
  const [status, setStatus] = useState<"logged" | "not-logged">("not-logged");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProps | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("home");


  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/all/`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch home data");
        }

        const result = await response.json();
        console.log(result)
        if (!isMounted) return;
      } catch (error) {
        console.error("Home page data fetch failed:", error);
      }
    };

     const fetchUserData = async () => {


      try {
        const response = await fetch(`${API_URL}/api/auth/me/`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const responseJson = await response.json();
        setUser(responseJson?.data ?? null);
        setStatus("logged");
        console.log("User data fetched:", responseJson);
      } catch (error) {
        console.error("User data fetch failed:", error);
      }
    }

    loadHomeData();
    fetchUserData();
    setLoading(false);

    return () => {
      isMounted = false;
    };
  },
   []);
   console.log(status)

  const addProductToCart = async(product:ProductItem) => {
    setLoading(true);

        if(!product){
            throw new Error("Please provide a valid product to add to cart!")
        }
        const payload = {
            productId:product.id,
            quantity: 1
        }
        try{
            console.log(payload);
            const response = await fetch(`${API_URL}/api/cart/items/`, {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials:"include",
                body:JSON.stringify(payload)
            }); 
            if(!response.ok){
                const responseJson = await response.json();
            alert(responseJson.message)
                setLoading(false);
                throw new Error("Failed to add Product")
            }
            const responseJson = await response.json();
            setLoading(false);

        }
        catch (error){
            console.error(error)
        }
    }

  

  const handleSearch = (query: string) => {
    router.push(`/search?query=${encodeURIComponent(query)}`);
  }

  return (
    <div className="flex font-sans antialiased w-full flex-col bg-gray-50 md:w-[60%]  mb-20 md:mx-auto text-sm text-black/80">
      {!PRODUCTS_DATA ? (
        <div className="flex flex-col items-center justify-center h-full">
                    <LoadingSpinner />
        </div>
      ) : (
        <div>
          {/**nav */}
          <Navbar
            cartCount={0}
            onOpenCart={() => setIsCartOpen(true)}
            status={status}
          />

          <main>
            {/**hero */}
            <section className="px-4 sm:px-6 py-6 sm:py-10 text-gray-900">
            <div className="bg-gray-100 dark:bg-slate-500/60 border border-gray-50 dark:border-gray-50 rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-xl space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-medium rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> Campus Direct Tech
              </span>
              <h1 className="text-2xl sm:text-4xl font-light tracking-tight text-slate-900 dark:text-white">
                Clean gadget marketplace for student developers.
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-800">
                Laptops, audio equipment, and peripherals with instant campus delivery.
              </p>
            </div>
            <Link
              href="#laptops"
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-900 dark:hover:bg-slate-200 dark:text-black text-black text-xs font-medium rounded-xl transition flex items-center gap-2 whitespace-nowrap shadow-xs"
            >
              Explore Products <ArrowRight className="w-3.5 h-3.5 text-green-800" />
            </Link>
          </div>
            </section>

            {/**categories */}
            <CategoryBar
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />

            {/**carousel*/}
            {/* Horizontal Scroll Section: Trending Deals */}
        {(activeCategory === "all" || activeCategory === "trending") && (
          <TrendingCarousel
            products={PRODUCTS_DATA}
            onQuickView={setSelectedProduct}
            loading={loading}
            onAddToCart={addProductToCart}
          />
        )}

          {/**product sections */}
        {(activeCategory === "all" || activeCategory === "electronics") && (
            <VerticalProductGrid
              id="accessories"
              title="Electronics"
              subtitle="Mice, chargers, USB hubs, and adapters"
              products={PRODUCTS_DATA.filter((p) => p.category === "Electronics")}
              onQuickView={setSelectedProduct}
              onAddToCart={addProductToCart}
            />
          )}

             {/**product sections */}
        {(activeCategory === "all" || activeCategory === "Fashion & Accessories") && (
            <VerticalProductGrid
              id="accessories"
              title="Fashion & Accessories"
              subtitle="clothes & cosmetics"
              products={PRODUCTS_DATA.filter((p) => p.category === "Fashion & Accessories")}
              onQuickView={setSelectedProduct}
              onAddToCart={addProductToCart}
            />
          )}

             {/**product sections */}
        {(activeCategory === "all" || activeCategory === "Services") && (
            <VerticalProductGrid
              id="services"
              title="Services"
              subtitle="student provided services"
              products={PRODUCTS_DATA.filter((p) => p.category === "Services")}
              onQuickView={setSelectedProduct}
              onAddToCart={addProductToCart}
            />
          )}

             {/**product sections */}
        {(activeCategory === "all" || activeCategory === "Campus Essentials") && (
            <VerticalProductGrid
              id="campus essentials"
              title="Campus Essentials"
              subtitle="essential products for campus living"
              products={PRODUCTS_DATA.filter((p) => p.category === "Campus Essentials")}
              onQuickView={setSelectedProduct}
              onAddToCart={addProductToCart}
            />
          )}

        <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={0}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCategories={() => {
          const el = document.getElementById("laptops");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
      />

          
          </main>

          <footer className="border-t border-gray-100 dark:border-gray-200 py-8 text-center text-xs text-slate-400 font-mono">
        NRC MARKETPLACE • LILONGWE
      </footer>

        </div>
      )}
      </div>
      
  );
}
