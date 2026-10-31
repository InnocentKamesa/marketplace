"use client";

import React, { useState } from 'react';
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
import {AddressCard, DeliveryMethodsCard, PaymentMethodsCard, OrderSummaryCard} from "../components/card";

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

export default function CheckoutPage() {
  const [activeSection, setActiveSection] = useState('full-checkout'); // 'full-checkout' | 'shipping' | 'payment' | 'summary'
  const [cardStyle, setCardStyle] = useState('clean'); // 'clean' | 'elevated' | 'bordered'
  const [copiedCode, setCopiedCode] = useState(false);
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'code'

  // Interactive Form States
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [selectedAddrId, setSelectedAddrId] = useState('addr-1');
  const [selectedDeliveryId, setSelectedDeliveryId] = useState('del-standard');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money'); // 'mobile_money' | 'card' | 'paychangu'
  const [mobileNumber, setMobileNumber] = useState('0991234567');
  const [mobileProvider, setMobileProvider] = useState('airtel'); // 'airtel' | 'tnm'
  const [isAddingNewAddr, setIsAddingNewAddr] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    label: 'Home'
  });

  // Calculate Totals
  const subtotal = ORDER_ITEMS.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const selectedDelivery = DELIVERY_OPTIONS.find(d => d.id === selectedDeliveryId);
  const shippingFee = selectedDelivery ? selectedDelivery.price : 0;
  const discount = 20.00; // Promo coupon
  const total = subtotal + shippingFee - discount;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (!newAddrForm.fullName || !newAddrForm.street) return;
    const created = {
      id: `addr-${Date.now()}`,
      isDefault: false,
      label: newAddrForm.label || 'Custom Address',
      fullName: newAddrForm.fullName,
      phone: newAddrForm.phone || '+265 99 000 0000',
      street: newAddrForm.street,
      institution: 'Campus Area',
      city: newAddrForm.city || 'Blantyre',
      note: ''
    };
    setAddresses([...addresses, created]);
    setSelectedAddrId(created.id);
    setIsAddingNewAddr(false);
    setNewAddrForm({ fullName: '', phone: '', street: '', city: '', label: 'Home' });
  };

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
                    <AddressCard />

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
                      items={ORDER_ITEMS}
                      subtotal={subtotal}
                      shippingFee={shippingFee}
                      discount={discount}
                      total={total}
                      selectedDelivery={selectedDelivery}
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

                <ShippingAddressCard 
                  addresses={addresses} 
                  selectedAddrId={selectedAddrId} 
                  setSelectedAddrId={setSelectedAddrId}
                  isAddingNewAddr={isAddingNewAddr}
                  setIsAddingNewAddr={setIsAddingNewAddr}
                  newAddrForm={newAddrForm}
                  setNewAddrForm={setNewAddrForm}
                  handleAddNewAddress={handleAddNewAddress}
                />

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
                  items={ORDER_ITEMS}
                  subtotal={subtotal}
                  shippingFee={shippingFee}
                  discount={discount}
                  total={total}
                  selectedDelivery={selectedDelivery}
                />
              </div>
            )}

          </div>
        ) : (
          /* CODE SNIPPET VIEW */
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Tailwind CSS + React Component Code</h3>
                <p className="text-xs text-slate-400 mt-0.5">Copyable self-contained JSX structure</p>
              </div>
              <button
                onClick={() => handleCopy(getCheckoutCodeSnippet())}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedCode ? 'Copied Code!' : 'Copy React Component'}
              </button>
            </div>
            <pre className="p-6 text-xs font-mono text-slate-300 overflow-x-auto max-h-[600px] leading-relaxed">
              <code>{getCheckoutCodeSnippet()}</code>
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
