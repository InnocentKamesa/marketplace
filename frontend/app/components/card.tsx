import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, Star, Trash, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ProductItem } from "../types/product";


const formatPrice = (value?: number | string) => {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue) || numericValue === 0) {
    return "MKW 0";
  }

  return `MKW ${numericValue.toLocaleString()}`;
};

export function MainCard({ product }: { product: ProductItem }) {
  const router = useRouter();

  return (
    <div className="p-4 justify-between rounded-md shadow-lg flex flex-row gap-4 min-w-[95%] bg-zinc-50">
      <div className="flex gap-4 max-w-[45%] flex-col">
        <p className="font-bold text-3xl">{product.title}</p>
        <p className="text-sm text-zinc-600 line-clamp-2">{product.description || "Fresh picks from your marketplace."}</p>
        <Button variant="outline" className="text-green-400" onClick={() => router.push("/products")}>
          <span>Shop now</span>
          <ArrowRight />
        </Button>
      </div>
      <div className="flex flex-col justify-between items-end">
        <p className="text-sm font-semibold text-emerald-600">{formatPrice(product.price)}</p>
        <Image src="/headset preview.png" alt={product.title} width={90} height={50} className="" />
      </div>
    </div>
  );
}

export function SectionCard({ product }: { product: ProductItem }) {
  const router = useRouter();

  return (
    <div onClick={() => router.push(`/product?id=${product.id}`)} className="p-4 bg-zinc-50 max-w-45 flex flex-col shadow-lg rounded-lg shrink-0 cursor-pointer">
      <Image alt={product.title} src="/headset preview.png" width={40} height={50} className="h-40 w-40 rounded-sm" />
      <div className="flex-1 flex flex-col gap-1 mt-2">
        <p className="text-md line-clamp-2">{product.title}</p>
        <p className="text-lg font-bold">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}

export function CartItemCard({product}: {product : ProductItem}){
  return (
    <div className="w-full rounded-lg shadow-sm flex flex-row gap-3 p-2 bg-gray-50 backdrop-blur-md">
        <Image src="/headset preview.png" alt="product image" width={50} height={50} className="w-25 h-25" />
        <div className="flex flex-col w-full justify-center gap-1 h-full">
          <p className="text-md line-clamp-3 text-semibold text-black/80">{product.title}</p>
          <p className="font-semibold text-md">{product.price}</p>
          <div className="w-full flex flex-row justify-betwen px-2">
              <div className="w-full">

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 border-gray-400"
                                
                            >
                                <Minus className="h-4 w-4 text-zinc-600" />
                            </Button>

                            <span className="w-8 text-center font-medium">
                                1
                            </span>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-6 border-gray-400 w-6"
                                
                            >
                                <Plus className="h-4 w-4 text-zinc-600" />
                            </Button>
                        </div>

              </div>
                    
              <button>
                <Trash className="text-gray-400 h-4 w-4"/>
              </button>
          </div>

        </div>
    </div>
  )
}
