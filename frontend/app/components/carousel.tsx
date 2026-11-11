"use client";

import { useRef } from "react";
import Image from "next/image";
import type{ ProductItem } from "@/app/types/product";
import { ChevronLeft, ChevronRight, Eye, ShoppingCart } from "lucide-react";
import { ButtonSpinner } from "./spinner";

interface Props {
  products: ProductItem[];
  onQuickView: (p: ProductItem) => void;
  onAddToCart: (p: ProductItem) => void;
  cartLoading:number | null;
}

export default function TrendingCarousel({ products, onQuickView, onAddToCart, cartLoading }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="px-4 sm:px-6 pt-8 pb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Trending Deals</h2>
          <p className="text-xs text-slate-400">Swipe horizontally for featured campus deals</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 bg-gray-100 dark:bg-gray-100 rounded-lg hover:bg-slate-200 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 bg-gray-100 dark:bg-gray-100 rounded-lg hover:bg-slate-200 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
      >
        {products.map((product) => {
          const isLoading = cartLoading === product.id;
          return(
          <div

            key={product.id}
            className="w-60 sm:w-64 shrink-0 bg-gray-100 dark:bg-gray-100 border border-gray-50 dark:border-gray-50 rounded-2xl p-3 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            <div>
              <div className="relative w-full h-40 rounded-xl overflow-hidden  mb-3 group">
                <Image
                  src="/headset preview.png"
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                <button
                  onClick={() => onQuickView(product)}
                  className="absolute bottom-2 right-2 p-2 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
              <h3 className="text-xs font-medium text-gray-900 dark:text-gray-900 line-clamp-2 mb-1">
                {product.title}
              </h3>
              <span className="text-[10px] text-gray-500 font-mono block mb-2">
                NEW
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-xs font-semibold font-mono text-emerald-600 dark:text-emerald-400">
                MWK {product.price?.toLocaleString()}
              </span>
              <button
                onClick={() => onAddToCart(product)}
                className="px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[11px] font-medium rounded-lg hover:opacity-90 transition"
              >
                {isLoading ? <ButtonSpinner /> : <ShoppingCart className="w-4 h-4"/>}
              </button>
            </div>
          </div>
          )
})}
      </div>
    </section>
  );
}