"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SectionCard } from "./card";
import type { ProductItem } from "../types/product";
import Image from "next/image";
import { ChevronRight, ShoppingCart } from "lucide-react";


type SectionProps = {
  title: string;
  products: ProductItem[];
};

export default function Section({ title, products }: SectionProps) {
  const visibleProducts = products.slice(0, 6);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between my-3">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm hover:underline">See all</p>
      </div>

      <ScrollArea>
        <div className="flex flex-row space-x-4 overflow-scroll-x py-1 bg-gray-50">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((product) => <SectionCard key={product.id} product={product} />)
          ) : (
            <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-500">
              No products available for this section yet.
            </div>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

interface Props {
  id: string;
  title: string;
  subtitle: string;
  products: ProductItem[];
  onQuickView: (p: ProductItem) => void;
  onAddToCart: (p: ProductItem) => void;
}

export  function VerticalProductGrid({
  id,
  title,
  subtitle,
  products,
  onQuickView,
  onAddToCart,
}: Props) {
  return (
    <section id={id} className="scroll-mt-32 p-2 my-5">

      <div className="flex items-end justify-between mb-4 border-b border-slate-100 dark:border-slate-900 pb-3">
        <div>
          <h2 className="text-lg font-light tracking-tight text-slate-900 dark:text-gray-900">
            {title}
          </h2>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        <span className="text-xs hover:underline text-slate-400 font-mono">
          See All
        </span>
      </div>

      <div className="flex flex-row gap-4 overflow-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white shrink-0 dark:bg-gray-100 border border-gray-50 dark:border-gray-50 rounded-2xl p-3 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            <div>
              <div
                onClick={() => onQuickView(product)}
                className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 cursor-pointer"
              >
                <Image
                  src="/headset preview.png"
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <h3
                onClick={() => onQuickView(product)}
                className="text-xs font-medium text-gray-900 dark:text-gray-900 line-clamp-2 mb-2 cursor-pointer hover:text-emerald-600 transition"
              >
                {product.title}
              </h3>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-xs font-semibold font-mono text-green-400 dark:text-green-400">
                MWK {product.price?.toLocaleString()}
              </span>
              <button
                onClick={() => onAddToCart(product)}
                className="px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[11px] font-medium rounded-lg hover:opacity-90 transition"
              >
                <ShoppingCart className="w-4 h-4"/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
