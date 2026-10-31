import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SectionCard } from "./card";
import type { ProductItem } from "../types/product";

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
            visibleProducts.map((product) => <SectionCard key={product.id} product={product} image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop" />)
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
