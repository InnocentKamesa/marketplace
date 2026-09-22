"use client";

import { ArrowLeft, Star } from "lucide-react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Section from "../components/section";

export default function ProductPage() {
    const [quantity, setQuantity] = useState(1);
    return (
        <div className="h-screen w-screen flex flex-col">
            {/**header */}
            <div className="p-6 flex flex-row sticky top-0 bg-white background-blur-md shadow-md w-full">
                <ArrowLeft className="w-6 h-6" />
            </div>

            {/**product details */}
            <div className="flex flex-col gap-3">
                <Image src="/headset preview.png" alt="product" width={90} height={50} className="w-full" />
                {/**description */}
                <div className="px-6 flex flex-col gap-3 mb-25">

                    <p className="text-lg font-semibold text-black/80">EarPods</p>
                    <p className="text-md text-black/80">Product description, this is the product description for earpods</p>

                    {/**ratings */}
                    <div className=" items-center flex flex-row gap-2 text-white bg-yellow-400 rounded-sm px-2 py-1 w-16">
                        <Star className="h-6 w-6 " />
                        <p className="text-lg">4.9</p>
                    </div>

                    {/**price */}
                    <p className="font-bold text-lg text-black/80">MK 350,000</p>

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
                    <Section />
                </div>
            </div>

            {/**actions */}
            <div className="p-6 fixed bottom-0 w-full bg-white flex flex-row justify-between shadow-sm">
                <button className="bg-white border-2 border-blue-600 text-blue-600 p-2 rounded-md w-full">Add to Cart</button>
                <button className="bg-blue-600 text-white p-2 rounded-md ml-4 w-full ">Buy Now</button>
            </div>
        </div>
    )
}
