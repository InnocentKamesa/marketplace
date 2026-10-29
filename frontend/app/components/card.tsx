import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, Star, Trash, Minus, Plus } from "lucide-react";
import { useRouter} from "next/navigation";
import type { ProductItem } from "../types/product";
import {useState} from "react";
import type {CartItem} from "../cart/page";


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
    <div className="p-4 bg-white border-1 border-gray-200 justify-between rounded-lg shadow-lg flex flex-row gap-4 min-w-[95%]">
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
    <div onClick={() => router.push(`/product?id=${product.id}`)} className="p-4 bg-white max-w-45 flex flex-col shadow-lg rounded-lg shrink-0 cursor-pointer border-gray-200 hover:shadow-md border-1">
      <Image alt={product.title} src="/headset preview.png" width={40} height={50} className="h-40 w-40 rounded-sm" />
      <div className="flex-1 flex flex-col gap-1 mt-2">
        <p className="text-md line-clamp-2">{product.title}</p>
        <p className="text-lg font-bold">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}

const API_URL =  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type CartItemProps = {
  product: ProductItem;
  quantity:number;
  onQuantityChange: (productId: number, quantity: number) => void;
    setCartItems: React.Dispatch<
        React.SetStateAction<CartItem[]>
    >;
};


export function CartItemCard({product, quantity, onQuantityChange, setCartItems}: CartItemProps){
  const router = useRouter();
  const handleDeleteProduct = async() => {
    const id = product.id;
    console.log("Submitting")
    try{
      if(!id){
      throw new Error("Cannot perfom the requested opertion")
      }
      const response = await fetch (`${API_URL}/api/cart/items/${product.id}`, {
        method:"DELETE", 
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        }
      });
      if(!response.ok){
        console.log("reached");
        const responseJson = await response.json();
        alert(responseJson.message)
        throw new Error("Failed to delete cart item")
      }
        setCartItems(prevItems =>
            prevItems.filter(item => item.id !== product.id) 
        );

    }
    catch (error){
      console.error("Error while removing cart item")
    }

  }
 

  return (
    <div className="w-full rounded-lg shadow-md flex flex-row gap-3 p-2 bg-white backdrop-blur-md">
        <Image src="/headset preview.png" alt="product image" width={50} height={50} className="w-25 h-25" />
        <div className="flex flex-col w-full justify-center gap-1 h-full">
          <p className="text-md line-clamp-3 text-semibold text-black/80">{product.title}</p>
          <p className="font-semibold text-md">MKW {product.price}</p>
          <div className="w-full flex flex-row justify-betwen px-2">
              <div className="w-full">

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 border-gray-400"
                                disabled={quantity <2}
                                onClick={ () => { onQuantityChange(product.id, quantity-1)}}
                                
                            >
                                <Minus className="h-4 w-4 text-zinc-600" />
                            </Button>

                            <span className="w-8 text-center font-medium">
                                {quantity}
                            </span>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-6 border-gray-400 w-6"
                                onClick={ () => {onQuantityChange(product.id, quantity+1)}}
                                
                            >
                                <Plus className="h-4 w-4 text-zinc-600" />
                            </Button>
                        </div>

              </div>
                    
              <button onClick={handleDeleteProduct}>
                <Trash className="text-gray-400 h-4 w-4"/>
              </button>
          </div>

        </div>
    </div>
  )
}
