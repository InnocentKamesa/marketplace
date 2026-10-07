import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";

export type ProductItem = {
  id: number | string;
  title: string;
  description?: string;
  price?: number | string;
  category?: string;
  type?: string;
  status?: string;
  location?: string;
};

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
    <div onClick={() => router.push("/product")} className="p-4 bg-zinc-50 max-w-45 flex flex-col shadow-lg rounded-md shrink-0 cursor-pointer">
      <Image alt={product.title} src="/headset preview.png" width={40} height={50} className="h-40 w-40 rounded-sm" />
      <div className="flex-1 flex flex-col gap-1 mt-2">
        <p className="text-sm line-clamp-2">{product.title}</p>
        <div className="items-center flex flex-row gap-1">
          <Star className="h-4 w-4 text-yellow-400" />
          <p className="text-sm">4.9</p>
        </div>
        <p className="text-md font-bold">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}
