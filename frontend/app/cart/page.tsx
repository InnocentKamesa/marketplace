"use client";

import {ArrowLeft, Trash, ArrowRight} from "lucide-react";
import {CartItemCard} from "../components/card";
import {useRouter} from "next/navigation";
import {useState, useEffect, useMemo} from "react";
import type {ProductItem} from "../types/product";
import {ButtonSpinner, LoadingSpinner} from "../components/spinner";
import type {Cart, CartItem} from "@/app/types/cart";


const env = process.env.NEXT_PUBLIC_ENVIRONMENT || "development";
const API_URL = env === "development"? "http://localhost:5000" : process.env.NEXT_PUBLIC_API_URL;


export default function CartPage(){
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cart,setCart] = useState<Cart | null>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [loading, setLoading] = useState(true);



    const getCartItems = async() => {
        setLoading(true);

        try{
            const response = await fetch(`${API_URL}/api/cart/`, {
                method:"GET",
                credentials:"include"
            });
            if(!response.ok){
                if(response.status === 401){
                    alert("Session expired, Login");
                    router.push("/auth/login")
                }

                console.error("Failed to retreive cart items");
            
                setCartItems([]);
                setLoading(false);
                return;
            }
            const responseJson = await response.json();
            const cartData = responseJson?.data as Cart | null;
            const items = cartData?.items ?? [];
            console.log(cartData)
            setCartItems(items);
            setCart(cartData);
            setLoading(false)
            
        }
        catch(error){
            console.error("Error:", error);
            setCartItems([]);
        }
    }
    useEffect( () => {
        getCartItems();
    }, [])

    const handleClearcart = async () => {
        const cartId = cart?.id;
        if(!cartId){
            console.error("cart id is required")
            return
        }
        try{
            const response = await fetch (`${API_URL}/api/cart/`, {
                method:"DELETE",
                credentials:"include",
            });
            if(!response.ok){
                const {message} = await response.json();
                console.log(message)
                throw new Error("Failed to clear cart")
            };
            alert("Cart cleared")
            router.refresh()
        }
        catch (error){
            console.error(error)
        }
            
    }

    const handleQuantityChange = async(itemId:number, quantity:number) => {

        console.log("updating quantity")
        setCartItems(prevItems =>
        prevItems.map(item =>
            item.productId === Number(itemId)
                ? { ...item, quantity: quantity }
                : item
        )           
    )
    }

    const total:number = useMemo(() => {
        return cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
    );
}, [cartItems]);


    const handleProceedToCheckout = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();
        console.log("0. Clicked! cartItems length:", cartItems.length, "isCheckingOut:", isCheckingOut);
        if (cartItems.length === 0 || isCheckingOut) {
            return;
        }

    setIsCheckingOut(true);
    console.log("reached")

    try {
        console.log("reached")
        const payload = {
                    items: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    }))}
        console.log(payload)

        const response = await fetch(
            
            `${API_URL}/api/cart/items/sync`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },  
                body: JSON.stringify(payload),
                });

        const result = await response.json();
        console.log("reached")

        if (!response.ok || result.success === false) {
            setIsCheckingOut(false);
            throw new Error(
                result.message ?? "Failed to synchronize cart"
            );
        }

        // Navigate only after the backend sync succeeds.
        setTimeout(() => {router.push("/checkout")}, 200)
        setIsCheckingOut(false)
    } catch (error) {
        console.error("Checkout preparation failed:", error);

        alert(
            error instanceof Error
                ? error.message
                : "Could not update your cart. Please try again."
        );
    }
};

    return (
        <div className="w-screen flex flex-col min-h-screen bg-gray-50 gap-4 mb-20">
             <div className="md:w-[75%] w-full flex flex-col gap-4 mx-auto px-2 sm:px-6 lg:px-8 min-h-screen py-4 sm:py-12">

            {/**header */}
            <header className="z-50 bg-white backdrop-blur-lg flex flex-row  justify-between sticky top-3 py-4 md:flex-row md:items-center md:justify-between gap-6 border-b border-[#E8E6E1] ">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#7A807C] mb-1">
              
              NRC<span className='text-green-400'>Marketplace</span>
            </div>
            <h1 className="text-3xl font-light tracking-tight text-[#1C201D]">Shopping Cart</h1>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleClearcart}>
                    <Trash className="h-6 w-6 text-zinc-600"/>
                </button>
            
          </div>
        </header>
            

            {/**body */}
            {loading ? 
            (<div className="flex flex-col items-center justify-center h-full">
                    <LoadingSpinner />
            </div>
            ): (
                <div>
                    { cartItems.length == 0  ?
            (
                <div className="w-full flex flex-col gap-3 font-semibold  items-center justify-center h-screen">
                    <p>No items found</p>
                    <button className="p-3 rounded-md bg-green-400 text-zinc-600" onClick={() => router.push("/")}>Browse</button>

                </div>
            ):(
                <div className="flex flex-col gap-3 px-2 w-full">
                {
                    cartItems?.map( (cartItem) => <CartItemCard product={cartItem.product} key={cartItem.product.id} quantity={cartItem.quantity} setCartItems={setCartItems} onQuantityChange={handleQuantityChange}/>)
                }
                </div>
            )}

                </div>
            )}
            
            {/**options */}
            <div className=" px-4 py-4 items-center w-full flex gap-2 flex-col fixed md:max-w-[75%]  bottom-0 bg-white">
                <div className="flex flex-row justify-between w-full px-">
                    <p className="text-md text-black/80">Total</p>
                    <p className="text-md text-black font-bold">MK {total?.toFixed(2)}</p>
                </div>
                <button onClick={handleProceedToCheckout} className="w-full p-3 bg-green-600 shadow-lg text-white shadow-indigo-200 text-sm flex gap-1 justify-between rounded-md">
                    <p className="text-md text-white font-bold">Proceed to checkout</p>
                    {
                        isCheckingOut ? (<ButtonSpinner />) :
                        (<ArrowRight className="w-6 h-6 text-zinc-600" />)
                    }
                </button>
    

            </div>
            </div>
        </div>
    )
}