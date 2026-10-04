import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SectionCard, type ProductItem } from "./card";

type SectionProps = {
  title: string;
  products: ProductItem[];
};

export default function Section({ title, products }: SectionProps) {
  const visibleProducts = products.slice(0, 6);

  return (
    <div>
      <div className="flex flex-row justify-between my-3">
        <p className="text-lg">{title}</p>
        <p className="text-sm hover:underline">See all</p>
      </div>

      <ScrollArea>
        <div className="flex flex-row space-x-4 overflow-hidden">
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
