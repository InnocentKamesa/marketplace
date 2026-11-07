"use client";

import React, { useState, useEffect } from 'react';
import {
  Check,
  Copy,
  ShoppingBag,
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  Smartphone,
  Plus,
  Edit3,
  Trash2,
  ChevronRight,
  Sparkles,
  Info,
  Eye,
  Code,
  CheckCircle2,
  Lock,
  Building2,
  User,
  Phone,
  ArrowRight,
  Zap,
  Globe
} from 'lucide-react';
import { AddressCard, DeliveryMethodsCard, PaymentMethodsCard, OrderSummaryCard } from "../components/card";
import { useRouter } from "next/navigation";
import type { Cart, CartItem, DeliveryOptionsProps } from "@/app/types/cart";
import { ButtonSpinner } from '../components/spinner';


const env = process.env.ENVIRONMENT || "development";
const API_URL = env === "development" ? "http://localhost:5000" : process.env.NEXT_PUBLIC_API_URL;


// Sample Mock Data
const INITIAL_ADDRESSES = [
  {
    id: 'addr-1',
    isDefault: true,
    label: 'Campus Residence',
    fullName: 'Alexander Banda',
    phone: '+265 99 123 4567',
    street: 'Hostel 4, Room B12',
    institution: 'MUHAS / Main Campus',
    city: 'Blantyre',
    note: 'Leave with hall porter if absent'
  },
  {
    id: 'addr-2',
    isDefault: false,
    label: 'Off-Campus Apartment',
    fullName: 'Alexander Banda',
    phone: '+265 88 987 6543',
    street: 'Plot 45, Area 47',
    institution: 'Near Gateway Mall',
    city: 'Lilongwe',
    note: 'Blue gate on the corner'
  }
];


const DELIVERY_OPTIONS = [
  {
    id: 'del-standard',
    name: 'Campus Express Delivery',
    time: 'Today (within 2-4 hours)',
    price: 1000,
    badge: 'CONVENIENT',
    icon: Truck,
    description: 'Direct delivery to your hostel or department building'
  },
  {
    id: 'del-pickup',
    name: 'Marketplace Pickup Hub',
    time: 'Ready in 30 mins',
    price: 0.00,
    badge: 'CONVENIENT',
    icon: Building2,
    description: 'Pick up at Student Union Building, Hub Desk #3'
  },
];

const ORDER_ITEMS = [
  {
    id: 'prod-1',
    title: 'Aura Pro Wireless ANC Headphones',
    variant: 'Space Gray · Bluetooth 5.3',
    seller: 'TechVerse Store',
    price: 189.00,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
  },
  {
    id: 'prod-2',
    title: 'Ergonomic Laptop Stand & Hub',
    variant: 'Aluminum · 6-in-1 Ports',
    seller: 'Campus Gear Co.',
    price: 45.00,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'
  }
];


export type CampusFormProps = {
  block: string;
  room: string;
  note: string;
}

export default function CheckoutPage() {
  const [activeSection, setActiveSection] = useState('full-checkout'); // 'full-checkout' | 'shipping' | 'payment' | 'summary'
  const [cardStyle, setCardStyle] = useState('clean'); // 'clean' | 'elevated' | 'bordered'
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'code'

  // Interactive Form States
  const [selectedDeliveryId, setSelectedDeliveryId] = useState('del-standard');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money'); // 'mobile_money' | 'card' | 'paychangu'
  const [mobileNumber, setMobileNumber] = useState('0991234567');
  const [mobileProvider, setMobileProvider] = useState('airtel'); // 'airtel' | 'tnm'
  const [campusForm, setCampusForm] = useState<CampusFormProps>({
    block: 'Block A',
    room: '',
    note: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);


  const getCartItems = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/cart/`, {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) {
        if (response.status === 401) {
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
      setLoading(false)
    }
    catch (error) {
      console.error("Error:", error);
      setCartItems([]);
    }
  }


  const handleCreateOrder = async (e: React.MouseEvent) => {
    setLoading(true);
    const { block, room, note } = campusForm;
    console.log(`${block}, ${room}`)
    if(!block || !room){
      alert("Block and room number are required")
      setLoading(false);
     throw new Error("Block and room number are required") 
    }
    const shippingAddress = `${block}, Room: ${room}`
    const payload = {
      shippingAddress,
      notes: note
    }
    try {
      const response = await fetch(
        `${API_URL}/api/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      const responseJson = await response.json();
      if (!response.ok) {
        alert(responseJson.message)
        if(response.status === 401){
          router.push("/auth/login")
        }
        console.log(response.status);
        setLoading(false);
        throw new Error("server did not return success", responseJson.message)
      }
      console.log("Order created successfully:", responseJson);
      const {id} = responseJson.order;
      if(!id){
        throw new Error("Order did not ewturn an ID")
      }
      setTimeout(() => {
        router.push(`checkout/success?id=${id}`);
      }, 200);
    }
    catch (error) {
      setLoading(false)
      console.error(error)
    }
    finally{
      setLoading(false)
    }
  };

  // Calculate Totals
  const subtotal = cartItems.reduce((sum: number, i:CartItem) => {
  return sum + Number(i.product.price) * Number(i.quantity);}, 0);
  const selectedDelivery = DELIVERY_OPTIONS.find(d => d.id === selectedDeliveryId);
  const shippingFee = selectedDelivery ? selectedDelivery.price : 0;
  const discount = 0; // Promo coupon
  const total = subtotal + shippingFee - discount;

  useEffect( () => {
        getCartItems();
    }, [])


  return (
    <div className="min-h-screen  text-slate-100 font-sans antialiased pb-24 bg-gray-50">


      {/* Main Preview Container */}
      <main className="max-w-7xl w-screen mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {viewMode === 'preview' ? (
          <div>
            {activeSection === 'full-checkout' && (
              <div className="space-y-6">
                {/* Checkout Header Breadcrumb */}
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Cart
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-white font-bold bg-indigo-600/20 text-indigo-400 px-2.5 py-1 rounded-md border border-indigo-500/30">
                      2. Shipping & Payment
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span>3. Confirmation</span>
                  </div>

                </div>

                {/* 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                  {/* Left Column: Form Steps (8 Cols) */}
                  <div className="lg:col-span-7 xl:col-span-8 space-y-6">

                    {/* SECTION 1: Shipping Address Selection */}
                    <AddressCard campusForm={campusForm} setCampusForm={setCampusForm} />

                    {/* SECTION 2: Delivery Speed Options */}
                    <DeliveryMethodsCard
                      options={DELIVERY_OPTIONS}
                      selectedDeliveryId={selectedDeliveryId}
                      setSelectedDeliveryId={setSelectedDeliveryId}
                    />

                    {/* SECTION 3: Payment Options (Mobile Money / PayChangu / Card) */}
                    <PaymentMethodsCard
                      paymentMethod="paychangu"
                      setPaymentMethod={setPaymentMethod}
                      mobileNumber={mobileNumber}
                      setMobileNumber={setMobileNumber}
                      mobileProvider={mobileProvider}
                      setMobileProvider={setMobileProvider}
                    />
                  </div>

                  {/* Right Column: Order Summary Card (4 Cols Sticky) */}
                  <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4">
                    <OrderSummaryCard
                      items={cartItems}
                      subtotal={subtotal}
                      shippingFee={shippingFee}
                      discount={discount}
                      total={total}
                      selectedDelivery={selectedDelivery}
                      loading={loading}
                      handleCreateOrder={handleCreateOrder}
                    />

                    {/* Trust Seals */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-3">
                      <div className="flex items-center gap-2 font-semibold text-slate-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Campus Marketplace Guarantee
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-400">
                        Funds are held safely in escrow until you inspect and accept your delivery. Instant refund guaranteed for non-deliveries.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* INDIVIDUAL SECTION PREVIEWS */}
            {activeSection === 'shipping' && (
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span className="font-semibold text-white">Shipping Address Component Studio</span>
                  <span>Interactive Selection & Add Address Modal</span>
                </div>



                <DeliveryMethodsCard
                  options={DELIVERY_OPTIONS}
                  selectedDeliveryId={selectedDeliveryId}
                  setSelectedDeliveryId={setSelectedDeliveryId}
                />
              </div>
            )}

            {activeSection === 'payment' && (
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span className="font-semibold text-white">Payment Gateways & Mobile Money Card</span>
                  <span>Includes Airtel Money, TNM Mpamba, & Cards</span>
                </div>

                <PaymentMethodsCard
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  mobileNumber={mobileNumber}
                  setMobileNumber={setMobileNumber}
                  mobileProvider={mobileProvider}
                  setMobileProvider={setMobileProvider}
                />
              </div>
            )}

            {activeSection === 'summary' && (
              <div className="max-w-md mx-auto space-y-8">
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 text-center">
                  <span className="font-semibold text-white">Order Summary Card View</span>
                </div>

                <OrderSummaryCard
                  items={cartItems}
                  subtotal={subtotal}
                  shippingFee={shippingFee}
                  discount={discount}
                  total={total}
                  selectedDelivery={selectedDelivery}
                  loading={loading}
                  handleCreateOrder={handleCreateOrder}
                />
              </div>
            )}

          </div>
        ) : (
          /* CODE SNIPPET VIEW */
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">

          </div>
        )}
      </main>
    </div>
  );
}

