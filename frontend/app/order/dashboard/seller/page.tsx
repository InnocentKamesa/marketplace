"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
User,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  X,
  Check,
  RefreshCw,
  Printer,
  Copy,
  ExternalLink,
  ShieldCheck,
  Store,
  ArrowUpRight,
  Archive,
  Layers,
  Sparkles,
  ArchiveIcon,
  PrinterIcon,
  TruckIcon,
  ClockIcon,
  PackageIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from 'lucide-react';
import Image from 'next/image';
import type{  SellerOrderProps } from "@/app/types/order";

const env = process.env.NEXT_PUBLIC_ENVIRONMENT || "development";
const API_URL = env === "development"? "http://localhost:5000" : process.env.NEXT_PUBLIC_API_URL;


const INITIAL_SELLER_ORDERS = [
  {
    id: "ORD-2026-9420",
    date: "2026-11-09 06:45 AM",
    buyer: {
      name: "Elena Rostova",
      email: "elena.r@example.com",
      address: "742 Evergreen Terrace, Apt 4B, Portland, OR 97201"
    },
    paymentStatus: "Pending Payment",
    fulfillmentStatus: "Awaiting Payment",
    statusCategory: "pending_payment",
    stockReserved: true,
    expiresIn: "01 hr 45 min",
    totalAmount: 310.00,
    items: [
      {
        id: "item-p1",
        sku: "WNS-MED-01",
        name: "Hand-Carved Walnut Meditation Stool",
        variant: "Natural Dark Walnut",
        price: 210.00,
        quantity: 1,
        stockAvailable: 3,
        image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=300"
      },
      {
        id: "item-p2",
        sku: "BRS-INC-04",
        name: "Brass Incense Burner & Sandalwood Sticks",
        variant: "Brushed Vintage Brass",
        price: 100.00,
        quantity: 1,
        stockAvailable: 12,
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=300"
      }
    ]
  },
  {
    id: "ORD-2026-9418",
    date: "2026-11-09 04:15 AM",
    buyer: {
      name: "Marcus Vance",
      email: "m.vance@example.com",
      address: "128 W 4th Street, San Francisco, CA 94103"
    },
    paymentStatus: "Paid",
    fulfillmentStatus: "Needs Packing",
    statusCategory: "awaiting_fulfillment",
    stockReserved: true,
    totalAmount: 185.00,
    shippingCarrier: "EcoCourier Ground",
    items: [
      {
        id: "item-s1",
        sku: "LIN-THR-02",
        name: "Minimalist Unbleached Linen Throw",
        variant: "Oatmeal Beige / 140x200cm",
        price: 185.00,
        quantity: 1,
        stockAvailable: 7,
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=300"
      }
    ]
  },
  {
    id: "ORD-2026-9390",
    date: "2026-11-08 02:30 PM",
    buyer: {
      name: "Soren Kierk",
      email: "soren@example.com",
      address: "440 Birchwood Lane, Seattle, WA 98101"
    },
    paymentStatus: "Paid",
    fulfillmentStatus: "Dispatched",
    statusCategory: "dispatched",
    trackingNumber: "TRK-904821102",
    shippingCarrier: "Postal Express Air",
    totalAmount: 152.00,
    items: [
      {
        id: "item-s2",
        sku: "CER-TEA-01",
        name: "Handcrafted Ceramic Tea Set",
        variant: "Matte Slate / 4 Cups",
        price: 120.00,
        quantity: 1,
        stockAvailable: 5,
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=300"
      },
      {
        id: "item-s3",
        sku: "KYO-TEA-10",
        name: "Organic Kyoto Sencha Loose Leaf (100g)",
        variant: "First Harvest 2026",
        price: 32.00,
        quantity: 1,
        stockAvailable: 24,
        image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=300"
      }
    ]
  },
  {
    id: "ORD-2026-9210",
    date: "2026-11-07 11:10 AM",
    buyer: {
      name: "Amara Chen",
      email: "amara.c@example.com",
      address: "902 Pinecrest Ave, Austin, TX 78701"
    },
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    statusCategory: "completed",
    trackingNumber: "TRK-881204910",
    shippingCarrier: "EcoCourier Ground",
    totalAmount: 60.00,
    items: [
      {
        id: "item-s4",
        sku: "HNO-OIL-01",
        name: "Hinoki Wood Essential Oil Diffuser",
        variant: "Natural Cypress",
        price: 60.00,
        quantity: 1,
        stockAvailable: 15,
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=300"
      }
    ]
  }
];


export default function SellerOrderDashboardPage(){
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');    
    const [toastMessage, setToastMessage] = useState('');
    const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
    const [orders, setOrders] = useState<SellerOrderProps[]>();
    const [dispatchModalOrder, setDispatchModalOrder] = useState<SellerOrderProps | null>(null);


    const fetchOrders = async () => {
    
    
    
          try {
            const response = await fetch(`${API_URL}/api/orders/seller/my-orders/`, {
              method: "GET",
              credentials: "include",
            });


            const responseJson = await response.json();
            if (!response.ok) {
               console.log("Error fetching user orders:", responseJson.message); 
              throw new Error("Failed to fetch user orders");
            }
    
            console.log(responseJson);
            setOrders(responseJson?.orders);
          } catch (error) {
            console.error("User data fetch failed:", error);
          }
        }
    
        useEffect( () => {fetchOrders()}, [])



    // Filtered Orders Logic
  const filteredOrders = useMemo(() => {
    return orders?.filter(order => {
      const matchesTab = 
        activeTab === 'all' ? true :
        activeTab === 'ready' ? (order.fulfillmentStatus === 'processing') :
        activeTab === 'unpaid' ? (order.fulfillmentStatus === 'pending') :
        activeTab === 'delivered' ? (order.fulfillmentStatus === 'delivered') : true;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = query === '' ||
        String(order.order.orderNumber.toLowerCase()).includes(query)
      return matchesTab && matchesSearch;
    });
  }, [ orders, activeTab, searchQuery]);

  const triggerToast = (msg:string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };


  const toggleOrderDetails = (id:number) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

    const handleCancelPendingOrder = (orderId:number) => {
    setOrders(prev => prev?.filter(o => Number(o.id) !== orderId));
    triggerToast(`Order ${orderId} cancelled & reserved inventory returned to store.`);
  };


    return (
        <div className="min-h-screen bg-[#F9F8F6] text-[#2C302E] font-sans antialiased selection:bg-[#E2E8E4] selection:text-[#1F2421] w-screen">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Minimal Zen Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-[#E8E6E1] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#7A807C] mb-1">
              
              NRC<span className='text-green-400'>Marketplace</span>
            </div>
            <h1 className="text-3xl font-light tracking-tight text-[#1C201D]">Order Fulfillment Center</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C928E]" />
              <input
                type="text"
                placeholder="Search orders or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#E1DFD7] rounded-full pl-9 pr-4 py-2 text-sm text-[#2C302E] placeholder-[#8C928E] focus:outline-none focus:border-[#8FA89B] transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C928E] hover:text-[#2C302E]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-3 pl-2 border-l border-[#E8E6E1]">
              <div className="w-9 h-9 rounded-full bg-[#E8ECE9] border border-[#D5DDD8] flex items-center justify-center text-[#4A5D52] font-medium text-sm">
                <User className='w-4 h-4' />
              </div>
            </div>
          </div>
        </header>

        {/* Minimal Sub-Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#E5E3DC] mb-8 overflow-x-auto">

          <nav className="flex space-x-8" aria-label="Order status tabs">
            {[
              { id: 'all', label: 'All Store Orders' },
              { id: 'ready', label: 'Ready for Delivery' },
              { id: 'unpaid', label: 'Unpaid / Reserved' },
              { id: 'delivered', label: 'Delivered' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#5B7566] text-[#1F2421]'
                    : 'border-transparent text-[#7C827E] hover:text-[#2C302E] hover:border-[#D0CECB]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Orders List */}
        {
          !filteredOrders ? (<div>No items found</div>) : (
        <main className="space-y-6">

          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => {
              const isExpanded = !!expandedOrders[order.id];
              const isPendingPayment = order.fulfillmentStatus === 'pending';
              const needsFulfillment = order.fulfillmentStatus === 'paid';

              return (
                <article 
                  key={order.id} 
                  className={`bg-[#FAF9F6] border rounded-xl overflow-hidden transition-all shadow-xs ${
                    needsFulfillment 
                      ? 'border-[#C8DAD0] ring-1 ring-[#DDF0E5]' 
                      : isPendingPayment 
                      ? 'border-[#E8D9C5]' 
                      : 'border-[#E5E3DC]'
                  }`}
                >
                  {/* Unpaid Warning Banner */}
                  {isPendingPayment && (
                    <div className="bg-[#FAF4ED] px-5 py-2.5 border-b border-[#E8DCCB] flex items-center justify-between text-xs text-[#7A6446]">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-3.5 h-3.5 text-[#926727]" />
                        <span>Buyer has not completed payment yet. Inventory can only be reserved for: <strong>1 hr</strong></span>
                      </div>
                      <button 
                        onClick={() => handleCancelPendingOrder(Number(order.id))}
                        className="text-[11px] text-[#A84136] hover:underline"
                      >
                        Cancel & Release Stock
                      </button>
                    </div>
                  )}
                          {/* Card Header */}
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFECE6]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-medium text-[#525754] bg-[#EFECE6] px-2.5 py-1 rounded">
                          {order.order.orderNumber}
                        </span>
                        <span className="text-xs text-[#8C928E]">{order.createdAt}</span>
                      </div>
                      <p className="text-xs text-[#6B706D] pt-0.5">
                        Buyer: <span className="font-medium text-[#2C302E]">{order.order.buyerId}</span> • Total: <span className="font-medium text-[#1F2421]">MK {order.subtotal}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {isPendingPayment && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F7ECD8] text-[#855B29]">
                          <ClockIcon className="w-3.5 h-3.5" />
                          Awaiting Payment
                        </span>
                      )}
                      {needsFulfillment && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EBF0EC] text-[#3D5647]">
                          <PackageIcon className="w-3.5 h-3.5" />
                          Ready to Pack
                        </span>
                      )}
                      {order.fulfillmentStatus === 'processing' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#E8EFF5] text-[#2B4C6F]">
                          <TruckIcon className="w-3.5 h-3.5" />
                          Dispatched
                        </span>
                      )}
                      {order.fulfillmentStatus === 'delivered' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EBF0EC] text-[#3D5647]">
                          <CheckCircleIcon className="w-3.5 h-3.5" />
                          Delivered
                        </span>
                      )}

                      <button
                        onClick={() => toggleOrderDetails(Number(order.id))}
                        className="p-2 text-[#7C827E] hover:text-[#1F2421] hover:bg-[#EFECE6] rounded-lg transition-colors ml-2"
                      >
                        {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Summary Item Row */}
                  {!isExpanded && (
                    <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 overflow-x-auto w-full sm:w-auto">
                        

                          <div key={order.product.id} className="flex items-center gap-3 shrink-0">
                            <Image 
                              src="/headset preview.png" 
                              alt={order.product.title} 
                              
                              width={50}
                              height={50}
                              className="w-14 h-14 object-cover rounded-md bg-[#E8E6E1] border border-[#E0DDD5]" 
                            />
                            <div className="max-w-[200px]">
                              <p className="text-sm font-medium text-[#2C302E] truncate">{order.product.title}</p>
                              <p className="text-xs text-[#7C827E]"> • Qty: {order.quantity}</p>
                            </div>
                          </div>
                        
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EFECE6]">
                        {needsFulfillment && (
                          <button
                            onClick={() => setDispatchModalOrder(order)}
                            className="px-4 py-2 bg-[#5B7566] hover:bg-[#4A6254] text-white text-xs font-medium rounded-md transition-colors flex items-center gap-2"
                          >
                            <TruckIcon className="w-4 h-4" />
                            Dispatch Order
                          </button>
                        )}
                        <button
                          onClick={() => toggleOrderDetails(Number(order.id))}
                          className="px-3.5 py-1.5 border border-[#DCD9D0] text-xs font-medium rounded-md text-[#3A3E3C] hover:bg-white transition-colors"
                        >
                          View Pick List
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Expanded Full Order & Shipping Information */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 space-y-6 bg-[#F6F5F0]/50">
                      
                      {/* Pick List */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-[#7C827E] uppercase tracking-wider">
                          Fulfillment Pick List
                        </h3>
                        <div className="divide-y divide-[#EFECE6] border border-[#E5E3DC] rounded-lg bg-white overflow-hidden">
                          

                            <div key={order.product.id} className="p-4 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <Image 
                                  src={"/headset preview.png"} 
                                  alt={order.product.title} 
                                  width={50}
                                  height={50}
                                  className="w-14 h-14 object-cover rounded-md bg-[#E8E6E1]" 
                                />
                                <div>
                                  <h4 className="text-sm font-medium text-[#2C302E]">{order.product.title}</h4>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="px-3 py-1 bg-[#F4F3EE] rounded font-mono text-xs font-medium text-[#2C302E]">
                                  QTY: {order.quantity}
                                </span>
                              </div>
                            </div>
                          
                        </div>
                      </div>

                      {/* Shipping Address & Dispatch Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-[#E5E3DC] p-4 rounded-lg space-y-2 text-xs">
                          <h4 className="font-semibold text-[#7C827E] uppercase tracking-wider">Buyer Shipping Address</h4>
                          <p className="font-medium text-[#2C302E]">{order.order.buyerId}</p>
                          <p className="text-[#6B706D]">{order.order.shippingAddress}</p>
                        </div>

                        <div className="bg-white border border-[#E5E3DC] p-4 rounded-lg flex flex-col justify-between text-xs">
                          <div>
                            <h4 className="font-semibold text-[#7C827E] uppercase tracking-wider mb-2">Fulfillment Action</h4>
                          </div>

                          <div className="pt-4 mt-2 border-t border-[#EFECE6] flex items-center gap-2">
                            {needsFulfillment && (
                              <button
                                onClick={() => setDispatchModalOrder(order)}
                                className="w-full py-2 bg-[#5B7566] hover:bg-[#4A6254] text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2"
                              >
                                <TruckIcon className="w-3.5 h-3.5" />
                                Enter Tracking & Dispatch
                              </button>
                            )}
                            <button
                              onClick={() => triggerToast(`Packing slip for ${order.id} sent to printer.`)}
                              className="px-3 py-2 border border-[#DCD9D0] text-xs font-medium rounded text-[#2C302E] hover:bg-[#F6F5F0] transition-colors flex items-center gap-1.5"
                            >
                              <PrinterIcon className="w-3.5 h-3.5" />
                              Print Slip
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </article>
             );
            })
          ) : (
            <div className="text-center py-16 px-4 bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl">
              <div className="w-12 h-12 rounded-full bg-[#EBF0EC] text-[#5B7566] flex items-center justify-center mx-auto mb-4">
                <ArchiveIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-light text-[#1F2421] mb-1">No seller orders found</h3>
              <p className="text-xs text-[#7C827E] max-w-sm mx-auto mb-6">
                No store orders match your current fulfillment filter.
              </p>
            </div>
          )}
        </main>
        )}
          
        </div>
        </div>
    )

}