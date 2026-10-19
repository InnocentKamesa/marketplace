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
import {LoadingSpinner, ButtonSpinner} from "../components/spinner";
import { ShoppingCart, User, Search } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
}

const productData = {
  latest: [
    { id: 1, title: "Original JBL Earphones", description: "Wireless sound for lectures, workouts and everyday commute.", price: 35000, category: "electronics", type: "product" },
    { id: 2, title: "Campus Study Desk", description: "Compact desk setup built for focused study sessions.", price: 29000, category: "campus-living", type: "product" },
    { id: 3, title: "Portable Power Bank", description: "Fast-charging backup for phones, tablets and earbuds.", price: 22000, category: "essentials", type: "product" },
  ],
};


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

function ProductPageContents() {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const searchParams = useSearchParams();
    const [product, setProduct] = useState<ProductItem | null>(null);
    const [loading, setLoading] = useState(false);

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

    const addProductToCart = async() => {
        
        setLoading(true);

        if(!quantity || quantity <= 0){
            throw new Error("Please provide a valid product quantity!")
        }
        if(!product){
            throw new Error("Please provide a valid product to add to cart!")
        }
        const payload = {
            productId:product.id,
            quantity: quantity
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
            alert(responseJson.message)
            setLoading(false);

        }
        catch (error){
            console.error(error)
        }
    }
    const handleAddToCart = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        addProductToCart()
    }

    useEffect(() => {

    fetchProduct();
    }, [productId]);


    return (
        <div className="h-screen w-screen flex flex-col">

            {/**header */}            
            <div className="flex w-full flex-row items-center justify-between bg-white px-4 py-6">



            

                <button className=""  onClick={() => router.back()} >
                    <ArrowLeft className="w-6 h-6 text-zinc-600"/>

                </button>
<div className="flex flex-row gap-4 items-center px-2">

                                <button onClick={() => router.push("/search")}>
                  <Search className="h-6 w-6 text-zinc-600" />
                </button>      

                <button  onClick={() => router.push("/cart")}>
                    <ShoppingCart  className="h-6 w-6 text-zinc-600"/>
                </button>
</div>
            </div>


                
            {/**product details */}
            { product ? (
            <div className="flex mb-20 flex-col min-h-screen w-full bg-white rounded-t-lg">
                {/**description */}
                <div className="px-6 flex flex-col gap-2 mt-2">
                    <div className="flex flex-col gap-2">
                        <p className="font-bold text-md text-green-600">MK {product.price?.toLocaleString()}</p>
                        <p className="text-2xl font-bold text-black/80">{product.title}</p>
                    </div>

                    {/**tab */}
                    <div role="tablist" className="tabs tabs-border">
                        <a role="tab" className="tab">Overview</a>
                        <a role="tab" className="tab tab-active">Description</a>
                    </div>

                    <Image src="/headset preview.png" className="w-full h-full my-6" alt={product.title} width={90} height={50} />

                    {/**quantity selector */}
                    {/**quantity */}
                    <div className="flex flex-col gap-2">
                        <p className="text-md text-black/80">Select quantity</p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9"
                                onClick={()=>{setQuantity(quantity -1)}}
                                
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
                                onClick={()=>{setQuantity(quantity +1)}}
                                
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                    </div>

                    {/**Reviews */}
                    <div className="flex flex-col gap-2">
                        <p className="font-semibold text-md">Reviews (3)</p>
                        <div className="flex flex-col gap-3">
                        <CommentCard />
                        <CommentCard />
                        <CommentCard />
                        </div>
                    </div>
                    


                    {/**related products */}
                    <Section title="Related products" products={productData.latest}/>
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
                <button onClick={handleAddToCart} className="bg-white border-1 border-green-400 bg-white text-green-400 p-2 rounded-md w-full">{loading ? <ButtonSpinner /> : "Add To Cart"}</button>
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

function CommentCard(){
    return (
        <div className="flex flex-row items-center gap-3">
            <button className="rounded-full p-2 bg-gray-200">
                <User  className="h-4 w-4 text-zinc-600"/>
            </button>
            <div className="flex flex-col gap-1">
            <p className="line-clamp-1 text-md font-semibold">Innocent Kamesa</p>
            <p className="text-md text-black/80">This is a beautiful product</p>
            </div>

        </div>
    )
}

function OPtionCard(){
    return (
        <div className="flex p-3 flex-col gap-3 mx-auto rounded-lg border border-gray-100 shadow-sm w-full">
                        <p className="font-semibold text-xl my-2">MKW </p>
                        <p className=" text-xl">Options</p>

                    {/**quantity */}
                    <div className="flex flex-col gap-2">
                        <p className="text-md text-black/80">Select quantity</p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9"
                                
                            >
                                <Minus className="h-4 w-4" />
                            </Button>

                            <span className="w-8 text-center font-medium">
                                
                            </span>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9"
                                
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                    </div>

                    <div className="flex flex-row gap-2">
                      <p className="text-black/80">Payment method:</p>
                      <p className="font-semibold">PayChangu</p>
                    </div>

                    {/**delivery options */}
                    <div className="flex flex-col gap-2">
                        <p className="text-md text-black/80">Delivery Options</p>
                    </div>

                    </div>
    )
}
