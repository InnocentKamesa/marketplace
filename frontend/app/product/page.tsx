"use client";

import { ArrowLeft, Star } from "lucide-react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import Section from "../components/section";
import { useRouter } from "next/navigation";
import {useSearchParams} from "next/navigation";
import type { ProductItem } from "../types/product";
import {LoadingSpinner} from "../components/spinner";
import { ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
}

const API_URL =  "http://localhost:5000"

function ProductPageContents() {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const searchParams = useSearchParams();
    const [product, setProduct] = useState<ProductItem | null>(null);

    const productId = searchParams.get("id");


    const fetchProduct = async() => {

        try{
        const response = await fetch(`${API_URL}/api/products/${productId}`, {
            method:"GET"
        });
        if(!response.ok){
            throw new Error("Failed to get product data")
        };

        const responseJson = await response.json();
        console.log("product data", responseJson.product)
        setProduct(responseJson.product)
    }
    catch(error){
        console.error("Error fetching product data:", error);
        alert('Error fetching product data: ' + error);
    }
    }

    useEffect(() => {

    fetchProduct();
    }, [productId]);


    return (
        <div className="h-screen w-screen flex flex-col">

            {/**header */}            
            <div className="flex w-full flex-row items-center justify-between p-4 bg-white px-4 py-6">
            

                <button className=""  onClick={() => router.back()} >
                    <ArrowLeft className="w-6 h-6 text-zinc-600"/>

                </button>

                <button>
                    <ShoppingCart  className="h-6 w-6 text-zinc-600"/>
                </button>
            </div>


                
            {/**product details */}
            { product ? (
            <div className="flex flex-col">
                {/**description */}
                <div className="px-6 flex flex-col gap-2 mt-8">
                    <div className="flex flex-col gap-2">
                        <p className="font-bold text-md text-green-600">MK {product.price?.toLocaleString()}</p>
                        <p className="text-2xl font-bold text-black/80">{product.title}</p>
                    </div>

                    {/**tab */}
                    <div role="tablist" className="tabs tabs-border">
                        <a role="tab" className="tab">Overview</a>
                        <a role="tab" className="tab tab-active">Description</a>
                    </div>

                    <Image src="/headset preview.png" className="w-full my-6" alt={product.title} width={90} height={50} />

                    

                    {/**quantity */}
                    <div className="flex flex-col gap-2">
                        <p className="text-md text-black/80">Select quantity</p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>

                            <span className="w-8 text-center font-medium">
                                {quantity}
                            </span>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => setQuantity((q) => q + 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                    </div>

                    {/**delivery options */}
                    <div className="flex flex-col gap-2">
                        <p className="text-md text-black/80">Delivery Options</p>
                        <div className="flex flex-row gap-2">
                            <button className="bg-gray-200 text-gray-800 p-2 rounded-md">Standard</button>
                            <button className="bg-gray-200 text-gray-800 p-2 rounded-md">Express</button>
                        </div>
                    </div>

                    {/**related products */}
                </div>
            </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <LoadingSpinner />
                </div>
            )
            }

            {/**actions */}
            <div className="p-6 fixed bottom-0 w-full bg-white flex flex-row justify-between shadow-sm">
                <button className="bg-white border-1 border-green-400 bg-white text-green-400 p-2 rounded-md w-full">Add to Cart</button>
                <button className="bg-green-400 text-zinc-600 p-2 rounded-md ml-4 w-full ">Buy Now</button>
            </div>
        </div>
    )
}

export default function ProductPage(){
    return (
        <Suspense>
            <ProductPageContents />
     
        </Suspense>
    )
}