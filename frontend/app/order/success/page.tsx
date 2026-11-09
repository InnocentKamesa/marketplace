"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, ArrowRight, Loader2, Download, Package } from "lucide-react";
import type { OrderProps } from "@/app/types/order";
import Image from "next/image";
import Link from "next/link";


const env = process.env.ENVIRONMENT || "development";
const API_URL = env === "development"? "http://localhost:5000" : process.env.NEXT_PUBLIC_API_URL;


function OrderPaymentSuccessPageContents() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        setLoading(false);
        throw new Error("Failed to retreive order")
      };
      const responseJson = await response.json();
      console.log(responseJson.order)
      setOrder(responseJson.order);
    }
    catch(error){
      console.error(error)
    }
    finally{
        setLoading(false);
    }
  }

  useEffect(() => {
    getOrder();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-white text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        <span className="mt-4 text-xs font-mono tracking-widest text-slate-400 uppercase">
          Verifying payment...
        </span>
      </div>
    );
  }

  // Fallback State
  if (!order) {
    return (
      <div className="min-h-screen bg-white dark:bg-white text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
          Notice
        </p>
        <h2 className="text-2xl font-light tracking-tight mb-2">Order Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-6">
          We couldn't retrieve the details for this order session.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-medium hover:bg-slate-800 transition"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-slate-100">
      
      {/* Minimal Navbar Header */}
      <header className="w-full max-w-3xl mx-auto px-6 py-8 flex items-center justify-between">
        <span className="font-semibold tracking-tight text-sm">NRC Marketplace</span>
        <span className="text-xs text-slate-400 font-mono">PAYMENT VERIFIED</span>
      </header>

      {/* Main Success Container */}
      <main className="w-full max-w-xl mx-auto px-6 py-8 flex flex-col items-center text-center">
        
        {/* Animated Minimal Success Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-950/40 rounded-full animate-ping opacity-25" />
          <div className="relative w-16 h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center shadow-md">
            <Check className="w-7 h-7 stroke-[2.5]" />
          </div>
        </div>

        {/* Confirmation Heading */}
        <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-600 dark:text-emerald-400 mb-2">
          Payment Successful
        </span>
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 dark:text-white mb-3">
          Thank you for your purchase
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
          We’ve processed your payment and sent confirmation details to your registered email address.
        </p>

        {/* Minimal Order Item Preview */}
        <div className="w-full bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-6 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800 text-xs font-mono">
            <span className="text-slate-400">ORDER NO.</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              #{order.orderNumber}
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 my-2">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                    <Image
                      src={"/headset preview.png"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100 font-mono">
                  MWK {(Number(item.product?.price || 0) * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Payment Method</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Delivery</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Included</span>
            </div>
            <div className="flex justify-between items-center pt-2 font-semibold text-slate-900 dark:text-white text-sm">
              <span>Total Paid</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                {order.currency || "MWK"} {order.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Minimal Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3.5 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 text-white text-xs font-medium rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
          >
            Return to Storefront <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => window.print()}
            className="py-3.5 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl transition flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" /> Print Receipt
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-3xl mx-auto px-6 py-8 text-center text-[11px] text-slate-400 font-mono">
        NRC MARKETPLACE • LILONGWE
      </footer>
    </div>
  );
}

export default function OrderPaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-white text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        <span className="mt-4 text-xs font-mono tracking-widest text-slate-400 uppercase">
          Verifying payment...
        </span>
      </div>
    }>
      <OrderPaymentSuccessPageContents />
    </Suspense>
  );
} 