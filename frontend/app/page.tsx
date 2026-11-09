"use client";

import React, { useEffect, useMemo, useState } from "react";
import NavBar from "./components/navbar";
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
import Navbar from "./components/navbar";
import type {CartItem} from "./types/cart";

const env = process.env.ENVIRONMENT || "development";
const API_URL = env === "development"? "http://localhost:5000" : process.env.NEXT_PUBLIC_API_URL;

const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 1,
    title: "Logitech MX Master 3S Wireless Mouse",
    price: 45000,
    category: "accessories",
    description: "Quiet clicks, 8K DPI sensor, tracks on glass, ergonomic design for developers.",
  },
  {
    id: 2,
    title: "Sony WH-1000XM5 Noise Canceling Headphones",
    price: 185000,
    category: "audio",
    description: "Industry-leading noise canceling with two processors and 8 microphones.",
  },
  {
    id: 3,
    title: "ThinkPad L14 Gen 1 (Core i5, 16GB RAM)",
    price: 280000,
    category: "laptops",
    description: "Solid developer machine running Ubuntu Linux/Windows 11. 256GB NVMe SSD.",
  },
  {
    id: 4,
    title: "Anker PowerCore 20,000mAh Power Bank",
    price: 28000,
    category: "accessories",
    description: "Dual USB-A output ports with high-speed charging capabilities.",
  },
  {
    id: 5,
    title: "MacBook Air M1 (8GB RAM / 256GB SSD)",
    price: 520000,
    category: "laptops",
    description: "Silent fanless design, up to 18 hours battery life, crisp Retina display.",
  },
  {
    id: 6,
    title: "Sony WH-CH520 Wireless Headphones",
    price: 35000,
    category: "audio",
    description: "50-hour battery life, multipoint Bluetooth connection, lightweight frame.",
  },
];

type HomeSectionsData = {
  latest: ProductItem[];
  services: ProductItem[];
  essentials: ProductItem[];
  electronics: ProductItem[];
  campusLiving: ProductItem[];
};

const fallbackHomeData: HomeSectionsData = {
  latest: [
    { id: 1, title: "Original JBL Earphones", description: "Wireless sound for lectures, workouts and everyday commute.", price: 35000, category: "electronics", type: "product" },
    { id: 2, title: "Campus Study Desk", description: "Compact desk setup built for focused study sessions.", price: 29000, category: "campus-living", type: "product" },
    { id: 3, title: "Portable Power Bank", description: "Fast-charging backup for phones, tablets and earbuds.", price: 22000, category: "essentials", type: "product" },
  ],
  services: [
    { id: 101, title: "Academic Tutoring", description: "Weekly study support in STEM and business courses.", price: 8000, category: "services", type: "service" },
    { id: 102, title: "Phone Repair", description: "Screen and battery repair for everyday devices.", price: 12000, category: "services", type: "service" },
  ],
  essentials: [
    { id: 201, title: "Laundry Starter Pack", description: "Detergent, basket and supply bundle for student living.", price: 15000, category: "essentials", type: "product" },
    { id: 202, title: "Study Lamp", description: "Easy lighting for reading nooks and bedrooms.", price: 9000, category: "essentials", type: "product" },
  ],
  electronics: [
    { id: 301, title: "Bluetooth Speaker", description: "Compact speaker with clear sound for dorm rooms.", price: 27000, category: "electronics", type: "product" },
    { id: 302, title: "USB-C Hub", description: "Support for multiple devices in one portable hub.", price: 16000, category: "electronics", type: "product" },
  ],
  campusLiving: [
    { id: 401, title: "Mini Fridge", description: "Space-saving storage for snacks and drinks.", price: 32000, category: "campus-living", type: "product" },
    { id: 402, title: "Mattress Topper", description: "Extra comfort for compact student rooms.", price: 25000, category: "campus-living", type: "product" },
  ],
};

type CategoryCardProps = {
  text: string;
};

type UserProps = {
  id:string;
  first:string;
}


export default function HomePage() {
  const router = useRouter();
  const [status, setStatus] = useState<"logged" | "not-logged">("not-logged");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProps | null>(null);
  const [homeSections, setHomeSections] = useState<HomeSectionsData>(fallbackHomeData);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);


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

        if (isMounted) {
          setHomeSections(fallbackHomeData);
        }
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
    <div className="flex font-sans antialiased w-full flex-col bg-gray-50 md:w-[60%] md:mx-auto text-sm text-black/80">
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
        {(activeCategory === "all" || activeCategory === "accessories") && (
            <VerticalProductGrid
              id="accessories"
              title="Power & Peripherals"
              subtitle="Mice, chargers, USB hubs, and adapters"
              products={PRODUCTS_DATA.filter((p) => p.category === "accessories")}
              onQuickView={setSelectedProduct}
              onAddToCart={addProductToCart}
            />
          )}
          </main>

          <footer className="border-t border-gray-100 dark:border-gray-200 py-8 text-center text-xs text-slate-400 font-mono">
        NRC MARKETPLACE • LILONGWE
      </footer>

        </div>
      )}
      </div>
      
  );
}
