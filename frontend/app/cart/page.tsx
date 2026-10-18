"use client";

import {ArrowLeft, Trash, ArrowRight} from "lucide-react";
import {CartItemCard} from "../components/card";
import {useRouter} from "next/navigation";
import {useState, useEffect} from "react";
import type {ProductItem} from "../types/product";



const API_URL = process.env.NEXT_PUBLIC_API_URL ||"http://localhost:5000"

export default function CartPage(){
    const router = useRouter();
    const [products, setProducts] = useState<ProductItem[]>([]);

    const getCartItems = async() => {
        try{
            const response = await fetch(`${API_URL}/api/cart/`, {
                method:"GET",
                credentials:"include"
            });
            if(!response.ok){
                console.error("Failed to retreive cart items")
            }
            const responseJson = await response.json();
            const cart = responseJson.data;
            if(!cart){
                alert("No cart items found");
                throw new Error("No cart items found")
            }
            console.log(cart.items.product);
            setProducts(cart.tems);
        }
        catch(error){
            console.error("Error:", error)
        }
    }
    useEffect( () => {
        getCartItems();
    }, [])

    return (
        <div className="w-full flex flex-col min-h-screen gap-4 mb-20">
            {/**header */}
            <div className="flex flex-row justify-between p-4 z-50 sticky top-0 bg-white">

                <button onClick={ () => { router.back(); }}>
                    <ArrowLeft className="h-6 w-6 text-zinc-600"/>
                </button>
                <p className="font-bold text-lg">Shopping Cart</p>
                <button>
                    <Trash className="h-6 w-6 text-zinc-600"/>
                </button>
            </div>

            {/**body */}
            { !products ?
            (
                <div className="w-full flex items-center h-screen">
                    <p>No items found</p>

                </div>
            ):(
                <div className="flex flex-col gap-3 px-2 w-full">
                {
                    products?.map( (product) => <CartItemCard product={product} key={product.id}/>)
                }
                </div>
            )}

            {/**options */}
            <div className="w-full px-2 py-4 items-center flex fixed bottom-0 bg-white">
                <button className="w-full p-3 bg-green-400 flex gap-1 justify-between rounded-md">
                    <p className="text-md text-white font-bold">Proceed to checkout</p>
                    <ArrowRight className="w-6 h-6 text-zinc-600" />
                </button>
    

            </div>
        </div>
    )
}