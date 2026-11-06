"use client";
import {useState, useEffect, Suspense} from "react";
import {useSearchParams} from "next/navigation";
import { CheckCircle2, ArrowLeft, Check, Package } from "lucide-react";
import type { OrderProps } from "@/app/types/order";
import Image from "next/image";
import Script from "next/script";

const env = process.env.ENVIRONMENT || "development";
const API_URL = env === "development"? "http://localhost:5000" : process.env.NEXT_PUBLIC_API_URL;

console.log(process.env.NEXT_PUBLIC_PAYCHANGU_PUBLIC_TEST)


function OrderSuccessPageContents() {
    const searchParams = useSearchParams();
    const [order, setOrder] = useState<OrderProps | null>(null);

  const getOrder = async() => {
        const orderId = searchParams.get("id");
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include"
      });
      if(!response.ok){
        throw new Error("Failed to retreive order")
      };
      const responseJson = await response.json();
      setOrder(responseJson.order);
    }
    catch(error){
      console.error(error)
    }
  }

  useEffect(()=>{
    getOrder();
  }, []);


  const makePayment = async(amount:number, email:string, first:string, last:string, tx_ref:string, orderNumber:string) => {
    console.log(`${amount}, ${email}, ${first}, ${last}, ${tx_ref}, ${orderNumber}`)
  
      window.PaychanguCheckout({
          "public_key": process.env.NEXT_PUBLIC_PAYCHANGU_PUBLIC_TEST,
          "tx_ref": `${tx_ref}-3`,
          "amount": Number(amount),
          "currency": "MWK",
          "callback_url": "https://example.com/callbackurl",
          "return_url": `${API_URL}/api/checkout/success?id=${order?.id}`,
          "customer":{
            "email": email,
            "first_name": first,
            "last_name": last,
          },
          "customization": {
            "title": orderNumber,
            "description": "Payment Description",
          },
          "meta": {
            "uuid": "uuid",
            "response": "Response"
          }
        });
      }

  const handleOnClickPay = async() => {
    try{
      const response = await fetch(`${API_URL}/api/orders/${order?.id}/pay`,{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        }
      });
      if(!response.ok){
        throw new Error("Failed to initialize payment")
      }
      const responseJson = await response.json();
      const {paymentReference} = responseJson;
      if(!order){
        return;
      }
      await makePayment(order.subtotal, "innocentkamesa05@gmail.com", "innocent", "kamesa", paymentReference, order?.orderNumber);
      
    }
    catch(error){
      console.error(error)
    }
  }
return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {
        order === null ? (
        <div className="flex items-center justify-center h-screen">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <span className="ml-4 text-lg font-medium">Loading order details...</span>
        </div>
      ) : (
      <main className="max-w-5xl mx-auto p-4 sm:p-8">
        <Script src="https://code.jquery.com/jquery-3.7.1.min.js" strategy="beforeInteractive"/>
        <Script src="https://in.paychangu.com/js/popup.js" strategy="afterInteractive" onLoad={()=>{console.log("Paychangu script loaded")}}/>
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-slate-800">
      {/* Success Banner */}
      <div className="bg-emerald-500/10 p-8 text-center border-b border-emerald-500/20">
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
          <Check className="w-10 h-10 stroke-[3]" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Thank you for your order!</h1>
        <p className="text-sm text-slate-600 mt-1">
          We’ve received your order and await your fulfillment by completing payment.
          
        </p>
        <span className="inline-block mt-3 px-3 py-1 bg-emerald-100 text-emerald-800 font-mono text-xs font-bold rounded-full">
          Order # {order.orderNumber}
        </span>
      </div>

      {/* Items Breakdown */}
      <div className="p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Order Summary</h3>
        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex items-center gap-4">
              <Image src="/headset preview.png" alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-slate-100 border" width={50} height={50}/>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-sm text-slate-900">
                MKW {(Number(item.product.price) * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Totals Calculation */}
        <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>MKW {order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery Fee</span>
            <span>MKW 0</span>
          </div>
          <div className="flex justify-between font-bold text-slate-900 pt-2 border-t text-base">
            <span>Total </span>
            <span className="text-emerald-600">MKW {order.subtotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Customer Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-slate-400 block font-medium mb-1">Shipping Address</span>
            <p className="text-slate-600">{order.shippingAddress}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-slate-400 block font-medium mb-1">Payment Method</span>
            <p className="font-semibold text-slate-800">{order.paymentMethod}</p>
            <p className="text-slate-600">Created on {order.createdAt}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col  gap-3 pt-4 border-t border-slate-100">
          <div id="wrapper" className="w-full">
          <button
          onClick={handleOnClickPay}
            className="flex-1 inline-flex items-center w-full justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition shadow-md"
          >
           Pay Now
          </button>
          </div>
          <button
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
           Continue shopping
          </button>
          
        </div>
      </div>
        </div>
      </main>
      )}
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading Page ...</div>}>
      <OrderSuccessPageContents />
    </Suspense>
  )
}
