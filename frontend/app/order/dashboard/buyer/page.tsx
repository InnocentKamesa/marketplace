
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Receipt, 
  RefreshCw, 
  ExternalLink, 
  SlidersHorizontal,
  User,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  X,
  Copy,
  Check,
  CreditCard
} from 'lucide-react';
import Image from 'next/image';
import type { OrderProps } from '@/app/types/order';
import { useRouter } from 'next/navigation';


const env = process.env.ENVIRONMENT || "development";
const API_URL = env === "development"? "http://localhost:5000" : process.env.NEXT_PUBLIC_API_URL;


export default function BuyerOrderDashboardPage(){

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<OrderProps | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [orders, setOrders] = useState<OrderProps[]>();
  const router = useRouter();

  const fetchOrders = async () => {



      try {
        const response = await fetch(`${API_URL}/api/orders/my-orders/`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const responseJson = await response.json();
        console.log(responseJson);
        setOrders(responseJson?.orders);
      } catch (error) {
        console.error("User data fetch failed:", error);
      }
    }

    useEffect( () => {fetchOrders()}, [])

     // Toggle detail card expansion
  const toggleOrderDetails = (orderId:number) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const filteredOrders = useMemo(() => {
    
    return orders?.filter(order => {
      // Tab filter
      const matchesTab = 
        activeTab === 'all' ? true :
        activeTab === 'pending' ? order.status === 'pending' :
        activeTab === 'processing' ? order.status === 'processing' :
        activeTab === 'paid' ? order.status === 'paid' : true;

      // Search filter
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = query === '' || 
        order.id.toLowerCase().includes(query) ||
        order.items.some(item => item.title.toLowerCase().includes(query)) ||
        order.orderNumber.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  console.log(`filteredOrders: ${filteredOrders}`)

    return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2C302E] font-sans antialiased selection:bg-[#E2E8E4] selection:text-[#1F2421] w-screen">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Minimal Zen Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-[#E8E6E1] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#7A807C] mb-1">
              
              NRC<span className='text-green-400'>Marketplace</span>
            </div>
            <h1 className="text-3xl font-light tracking-tight text-[#1C201D]">My Orders & History</h1>
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
              { id: 'all', label: 'All Orders' },
              { id: 'pending', label: 'Pending' },
              { id: 'processing', label: 'Processing' },
              { id: 'paid', label: 'Paid' }
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

        {
          !filteredOrders ? (<div>No items found</div>) : (
            <main className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => {
              const isExpanded = !!expandedOrders[order.id];

              return (
                <article 
                  key={order.id} 
                  className="bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md hover:border-[#D8D5CC]"
                >
                  {/* Card Header Header */}
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFECE6]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-medium text-[#525754] bg-[#EFECE6] px-2.5 py-1 rounded">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-[#8C928E]">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B706D] pt-0.5">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • Total: <span className="font-medium text-[#1F2421]"> MK {order.totalAmount}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      {/* Status Badges */}
                      {order.status === 'delivered' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EBF0EC] text-[#3D5647] border border-[#D1E0D7]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Delivered
                        </span>
                      )}
                      {order.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FAF3E8] text-[#855B29] border border-[#F2E3CD]">
                          <Truck className="w-3.5 h-3.5" />
                          pending
                        </span>
                      )}
                      {order.status === 'processing' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FAF3E8] text-[#855B29] border border-[#F2E3CD]">
                          <Truck className="w-3.5 h-3.5" />
                          In Transit
                        </span>
                      )}
                      {order.status === 'refunded' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F2EEEC] text-[#6E6460] border border-[#E3DDD9]">
                          <RefreshCw className="w-3.5 h-3.5" />
                          Refunded
                        </span>
                      )}

                      {/* Expand / Collapse Button */}
                      <button
                        onClick={() => toggleOrderDetails(Number(order.id))}
                        className="p-2 text-[#7C827E] hover:text-[#1F2421] hover:bg-[#EFECE6] rounded-lg transition-colors ml-2"
                        aria-label={isExpanded ? "Collapse order details" : "Expand order details"}
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Summary Product Thumbnails Row (Visible when collapsed) */}
                  {!isExpanded && (
                    <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center gap-3 shrink-0">
                            <Image
                              src="/headset preview.png" 
                              alt="alt text"
                              className="w-14 h-14 object-cover rounded-md bg-[#E8E6E1] border border-[#E0DDD5]" 
                              width={50}
                              height={50}
                            />
                            <div className="max-w-[200px]">
                              <p className="text-sm font-medium text-[#2C302E] truncate">{item.title}</p>
                              <p className="text-xs text-[#7C827E]">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick Action Button Bar */}
                      {
                        order.status === "pending" ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EFECE6]">
                        <button 
                          onClick={ () => { router.push(`/checkout/success?id=${order.id}`) }}
                          className="px-4 py-2 bg-[#926727] hover:bg-[#7D571F] text-white text-xs font-medium rounded-md transition-colors flex items-center gap-2 shadow-xs"
                        >
                          <CreditCard className="w-4 h-4" />
                          Make Payment
                        </button>
                        </div> ) : (
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EFECE6]">
                        <button 
                          onClick={() => setSelectedReceiptOrder(order)}
                          className="px-3.5 py-1.5 border border-[#DCD9D0] hover:border-[#B5B2A8] text-xs font-medium rounded-md text-[#3A3E3C] transition-colors flex items-center gap-1.5 bg-white"
                        >
                          <Receipt className="w-3.5 h-3.5 text-[#6E7470]" />
                          Receipt
                        </button>
                        <button 
                          onClick={() => toggleOrderDetails(Number(order.id))}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-[#4A6254] text-white text-xs font-medium rounded-md transition-colors"
                        >
                          Manage Order
                        </button>
                      </div>
                        )
                      }
                    </div>
                  )}

                  {/* Expanded Detailed Breakdown */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 space-y-8 bg-[#F6F5F0]/50 animate-fade-in">
                      
                      {/* Timeline / Progress Stepper */}
                      <div className="bg-white border border-[#E5E3DC] p-5 rounded-lg">
                        <h3 className="text-xs font-semibold text-[#7C827E] uppercase tracking-wider mb-4">
                          Order Progress •
                        </h3>
                      </div>

                      {/* Items List */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-[#7C827E] uppercase tracking-wider">
                          Purchased Items
                        </h3>
                        <div className="divide-y divide-[#EFECE6] border border-[#E5E3DC] rounded-lg bg-white overflow-hidden">
                          {order.items.map(item => (
                            <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <Image
                                  src="/headset preview.png" 
                                  alt={item.title} 
                                  className="w-16 h-16 object-cover rounded-md bg-[#E8E6E1] border border-[#E0DDD5]" 
                                  width={50}
                                  height={50}
                                />
                                <div>
                                  <h4 className="text-sm font-medium text-[#2C302E]">{item.title}</h4>
                                  
                                  <p className="text-xs text-[#525754] mt-1 font-mono">Qty: {item.quantity} × ${item.unitPrice}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-[#1F2421]">
                                  MKW {(item.quantity * item.unitPrice).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Meta Information Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* Shipping Info */}
                        <div className="bg-white border border-[#E5E3DC] p-4 rounded-lg space-y-2">
                          <h4 className="text-xs font-semibold text-[#7C827E] uppercase tracking-wider">Shipping Details</h4>
                          <p className="text-xs font-medium text-[#2C302E]">{order.shippingAddress}</p>
                          <div className="pt-2 text-xs text-[#5B7566] font-medium flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </article>
              );
            })
          ) : (
            /* Serene Empty State */
            <div className="text-center py-16 px-4 bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl">
              <div className="w-12 h-12 rounded-full bg-[#EBF0EC] text-[#5B7566] flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-light text-[#1F2421] mb-1">No orders found</h3>
              <p className="text-xs text-[#7C827E] max-w-sm mx-auto mb-6">
                We couldn't find any orders matching your selected criteria or search term.
              </p>
              <button 
                onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                className="px-4 py-2 bg-[#5B7566] hover:bg-[#4A6254] text-white text-xs font-medium rounded-md transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>


          )
        }

        
        </div>

    </div>
    )
}