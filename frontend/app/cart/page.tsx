"use client";

import {ArrowLeft, Trash, ArrowRight} from "lucide-react";
import {CartItemCard} from "../components/card";
import {useRouter} from "next/navigation";

export default function CartPage(){
    const router = useRouter();

    return (
        <div className="w-full flex flex-col min-h-screen gap-4 mb-20">
            {/**header */}
            <div className="flex flex-row justify-between p-6 sticky top-0 bg-white">

                <button onClick={ () => { router.back(); }}>
                    <ArrowLeft className="h-6 w-6 text-zinc-600"/>
                </button>
                <p className="font-bold text-lg">Shopping Cart</p>
                <button>
                    <Trash className="h-6 w-6 text-zinc-600"/>
                </button>
            </div>

            {/**body */}
            <div className="flex flex-col gap-3 px-2 w-full">
                <CartItemCard />
                <CartItemCard />
                <CartItemCard />
                <CartItemCard />
                <CartItemCard />
                <CartItemCard />
                
            </div>

            {/**options */}
            <div className="w-full px-2 py-6 items-center flex fixed bottom-0 bg-white">
                <button className="w-full p-3 bg-green-400 flex gap-1 justify-between rounded-md">
                    <p className="text-md text-white font-bold">Proceed to checkout</p>
                    <ArrowRight className="w-6 h-6 text-zinc-600" />
                </button>
    

            </div>
        </div>
    )
}