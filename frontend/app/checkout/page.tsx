"use client";

import {ArrowLeft} from "lucide-react";
import Image from "next/image";
import {useRouter} from "next/navigation";


const env = process.env.ENVIRONMENT || "development";
const API_URL = env === "development"? "http://localhost:5000" : process.env.NEXT_PUBLIC_API_URL;


export default function CheckoutPage(){

    const router = useRouter();
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 gap-4 w-full">
            {/**header */}
            <div className="flex flex-row gap-4 w-full  p-4 z-50 sticky top-0 bg-white">

                <button onClick={ () => { router.back(); }}>
                    <ArrowLeft className="h-6 w-6 text-zinc-600 relative "/>
                </button>
                <p className="font-bold text-lg mx-auto">Checkout</p>
                
            </div>


            {/***main */}
            <div className="px-4 flex flex-col gap-6 mb-20 bg-gray-50">
            {/**summary */}
            <div className="flex flex-col gap-3">
                <p className="text-md font-semibold">Order Summary</p>
                <div className="w-[95%] rounded-lg mx-auto  min-h-30 shadow-md bg-white">
                 

                </div>
            </div>

            {/**shipping address */}
            <div className="flex flex-col gap-3">

                <p className="text-md font-semibold">Shipping Address</p>
                <div className="w-[95%] rounded-lg mx-auto  min-h-30 shadow-md bg-white flex flex-col gap-2 p-3">

                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend ">Residence</legend>
                        <select defaultValue="Pick a browser" className="select select-primary bg-gray-50">
                        <option disabled={true}>Pick area</option>
                        <option>Hostels (boys)</option>
                        <option>Hostels (girls)</option>
                        <option>Other</option>
                        </select>
                    </fieldset>

                    <fieldset className="fieldset">
                        <label className="label" htmlFor="name">Room</label>
                        <input type="text" id="room" className="input bg-gray-200 w-full rounded-md" placeholder="Room number ..." />
                    </fieldset>

                    <fieldset className="fieldset">
                        <label className="label" htmlFor="name">Additional Information</label>
                        <input type="text" id="room" className="input bg-gray-200 w-full rounded-md" placeholder="Seller info ..." />
                        <p className="label">Optional</p>
                    </fieldset>


                 

                </div>




            </div>

            {/**payment */}
            <div className="flex flex-col gap-2">

                <p className="text-md font-semibold">Payment</p>
                    <div className=" rounded-lg bg-white my-2 shadow-md p-4 flex items-center flex-col gap-3 w-40">
                        <Image src="/paychangu_logo.png"  width={30} className="w-full h-10" height={30} alt="paychangu logo"/>
                        <p className="text-sm text-black/80 text-semibold">PayChangu</p>
                    </div>
                 

            </div>

            {/**shipping address */}
            <div>

                <p className="text-md font-semibold">Delivery options</p>
                <div className="w-[95%] rounded-lg mx-auto  min-h-30 shadow-md bg-white">
                 

                </div>

            </div>

            </div>


            {/**actions */}
            <div className="w-full px-2 py-4 items-center flex gap-1 flex-col  border-1 border-gray-100 shadow-md fixed bottom-0 bg-white">
                <div className="flex flex-row justify-between w-full px-2">
                    <p className="text-md text-black/80">Order:</p>
                    <p className="text-md text-black font-semibold">MK 500, 0000</p>
                </div>

                <div className="flex flex-row justify-between w-full px-2">
                    <p className="text-md text-black/80">Delivery Fee:</p>
                    <p className="text-md text-black font-semibold">MK 0</p>
                </div>

                <div className="flex flex-row justify-between w-full px-2">
                    <p className="text-md text-black/80">Total:</p>
                    <p className="text-md text-black font-semibold">MK 500, 0000</p>
                </div>
                <button className="w-full p-3 my-2 bg-green-400  rounded-md">
                    <p className="text-md text-white font-semibold">Submit Order</p>
                </button>
    

            </div>

        </div>
    )
}