"use client";

import {ArrowLeft, Trash, ArrowRight} from "lucide-react";
import {CartItemCard} from "../components/card";
import {useRouter} from "next/navigation";
import {useState, useEffect, useMemo} from "react";
import type {ProductItem} from "../types/product";
import {ButtonSpinner} from "../components/spinner";


export type CartItem = {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  createdAt: string; // ISO date string from API
  updatedAt: string; // ISO date string from API
  product: ProductItem;
};

export type Cart = {
    id:string;
  items: CartItem[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function CartPage(){
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cart,setCart] = useState<Cart | null>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);



    const getCartItems = async() => {

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
                return;
            }
            const responseJson = await response.json();
            const cartData = responseJson?.data as Cart | null;
            const items = cartData?.items ?? [];
            console.log(cartData)
            setCartItems(items);
            setCart(cartData);
            
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


    const handleProceedToCheckout = async (): Promise<void> => {
        console.log("0. Clicked! cartItems length:", cartItems.length, "isCheckingOut:", isCheckingOut);
        if (cartItems.length === 0 || isCheckingOut) {
            return;
        }

    setIsCheckingOut(true);
    console.log("reached")

    try {
        console.log("reached")
        const response = await fetch(
            
            `${API_URL}/api/cart/items/sync`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },  
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                }),
            }
        );

        const result = await response.json();
        console.log("reached")

        if (!response.ok || result.success === false) {
            throw new Error(
                result.message ?? "Failed to synchronize cart"
            );
        }

        // Navigate only after the backend sync succeeds.
        alert("products synced")
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
        <div className="w-full flex flex-col min-h-screen bg-gray-50 gap-4 mb-20">
            {/**header */}
            <div className="flex flex-row justify-between p-4 z-50 sticky top-0 bg-white">

                <button onClick={ () => { router.back(); }}>
                    <ArrowLeft className="h-6 w-6 text-zinc-600"/>
                </button>
                <p className="font-bold text-lg">Shopping Cart</p>
                <button onClick={handleClearcart}>
                    <Trash className="h-6 w-6 text-zinc-600"/>
                </button>
            </div>

            {/**body */}
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

            {/**options */}
            <div className="w-full px-2 py-4 items-center flex gap-2 flex-col fixed bottom-0 bg-white">
                <div className="flex flex-row justify-between w-full px-2">
                    <p className="text-md text-black/80">Total</p>
                    <p className="text-md text-black font-bold">MK {total?.toFixed(2)}</p>
                </div>
                <button onClick={handleProceedToCheckout} className="w-full p-3 bg-green-400 flex gap-1 justify-between rounded-md">
                    <p className="text-md text-white font-bold">Proceed to checkout</p>
                    {
                        isCheckingOut ? (<ButtonSpinner />) :
                        (<ArrowRight className="w-6 h-6 text-zinc-600" />)
                    }
                </button>
    

            </div>
        </div>
    )
}