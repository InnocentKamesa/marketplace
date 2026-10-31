"use client";


import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, Star, Smartphone, ShieldCheck, Check, Zap, CreditCard, Phone, Info, Trash, Minus, Plus, Edit3, Lock } from "lucide-react";
import { useRouter} from "next/navigation";
import type { ProductItem } from "../types/product";
import {useState} from "react";
import type {CartItem} from "../cart/page";


const formatPrice = (value?: number | string) => {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue) || numericValue === 0) {
    return "MKW 0";
  }

  return `MKW ${numericValue.toLocaleString()}`;
};

export function MainCard({ product }: { product: ProductItem }) {
  const router = useRouter();

  return (
    <div className="p-4 bg-white border-1 border-zinc-100 justify-between rounded-lg shadow-xl flex flex-row gap-6 min-w-[95%]">
      <div className="flex gap-4 max-w-[45%] flex-col">
        <p className="font-bold text-3xl">{product.title}</p>
        <p className="text-sm text-zinc-600 line-clamp-2">{product.description || "Fresh picks from your marketplace."}</p>
        <Button variant="outline" className="text-green-400" onClick={() => router.push(`/product?id=${product.id}`)}>
          <span>Shop now</span>
          <ArrowRight />
        </Button>
      </div>
      <div className="flex flex-col justify-between items-end gap-4">
        <p className="text-sm font-semibold text-emerald-600">{formatPrice(product.price)}</p>
        <Image src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60" alt={product.title} width={90} height={90} className=" rounded-md shadow-md w-full h-full" />
      </div>
    </div>
  );
}


export function SectionCard({ product, image }: { product: ProductItem, image:string }) {
  const router = useRouter();

  return (
    <div onClick={() => router.push(`/product?id=${product.id}`)} className="p-2 bg-white max-w-45 flex flex-col shadow-lg rounded-lg shrink-0 cursor-pointer border-gray-200 hover:shadow-md border-1">
      <Image alt={product.title} src={image} width={40} height={50} className="h-full w-40 h-40 rounded-sm" />
      <div className="flex-1 flex flex-col gap-1 mt-2 p-2">
        <p className="text-md line-clamp-2">{product.title}</p>
        <p className="text-lg font-bold">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}

const API_URL =  "http://localhost:5000"

type CartItemProps = {
  product: ProductItem;
  quantity:number;
  onQuantityChange: (productId: number, quantity: number) => void;
    setCartItems: React.Dispatch<
        React.SetStateAction<CartItem[]>
    >;
};


export function CartItemCard({product, quantity, onQuantityChange, setCartItems}: CartItemProps){
  const router = useRouter();
  const handleDeleteProduct = async() => {
    const id = product.id;
    console.log("Submitting")
    try{
      if(!id){
      throw new Error("Cannot perfom the requested opertion")
      }
      const response = await fetch (`${API_URL}/api/cart/items/${product.id}`, {
        method:"DELETE", 
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        }
      });
      if(!response.ok){
        console.log("reached");
        const responseJson = await response.json();
        alert(responseJson.message)
        throw new Error("Failed to delete cart item")
      }
        setCartItems(prevItems =>
            prevItems.filter(item => item.id !== product.id) 
        );

    }
    catch (error){
      console.error("Error while removing cart item")
    }

  }
 

  return (
    <div className="w-full rounded-lg shadow-md flex flex-row gap-3 p-2 bg-white backdrop-blur-md">
        <Image src="/headset preview.png" alt="product image" width={50} height={50} className="w-25 h-25" />
        <div className="flex flex-col w-full justify-center gap-1 h-full">
          <p className="text-md line-clamp-3 text-semibold text-black/80">{product.title}</p>
          <p className="font-semibold text-md">MKW {product.price}</p>
          <div className="w-full flex flex-row justify-betwen px-2">
              <div className="w-full">

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 border-gray-400"
                                disabled={quantity <2}
                                onClick={ () => { onQuantityChange(product.id, quantity-1)}}
                                
                            >
                                <Minus className="h-4 w-4 text-zinc-600" />
                            </Button>

                            <span className="w-8 text-center font-medium">
                                {quantity}
                            </span>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-6 border-gray-400 w-6"
                                onClick={ () => {onQuantityChange(product.id, quantity+1)}}
                                
                            >
                                <Plus className="h-4 w-4 text-zinc-600" />
                            </Button>
                        </div>

              </div>
                    
              <button onClick={handleDeleteProduct}>
                <Trash className="text-gray-400 h-4 w-4"/>
              </button>
          </div>

        </div>
    </div>
  )
}


export function AddressCard({}) {
  const [campusForm, setCampusForm] = useState({block:"", room:"", note:""})
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm text-gray-900 space-y-5">
      <div>
          <h3 className="font-bold text-gray-900 text-base leading-none">Shipping Address</h3>
          <p className="text-xs text-gray-500 mt-1">Provide details on dellivery point</p>
        </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-gray-200/80 space-y-3 pt-4">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
          <Edit3 className="w-3.5 h-3.5 text-emerald-600" /> Edit Block & Room Number
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Hostel / Location</label>
            <select
              value={campusForm.block}
              onChange={(e) => setCampusForm({ ...campusForm, block: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 text-gray-900"
            >
              <option value="Block A (Main Hall)">Block A</option>
              <option value="Block B (Chichiri Hostel)">Block B </option>
              <option value="Block C (New Hostel Wing)">Block C </option>
              <option value="Block A (Main Hall)">Block D</option>
              <option value="Block A (Main Hall)">Block E</option>
              <option value="Block A (Main Hall)">Block F</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">Room / Flat Number</label>
            <input
              type="text"
              value={campusForm.room}
              onChange={(e) => setCampusForm({ ...campusForm, room: e.target.value })}
              placeholder="e.g. Room 102B or Flat 4"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 text-gray-900 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            Delivery Instructions / Note
          </label>
          <textarea
            rows={2}
            value={campusForm.note}
            onChange={(e) => setCampusForm({ ...campusForm, note: e.target.value })}
            placeholder="e.g., Leave with hall porter, call when at security gate..."
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 text-gray-900 resize-none"
          />
        </div>
      </div>
    </div>
  );
}


export function DeliveryMethodsCard({ options, selectedDeliveryId, setSelectedDeliveryId }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-900 transition-all">
      <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
        
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-none">Delivery Option</h3>
          <p className="text-xs text-gray-500 mt-1">Choose how fast you want your items delivered</p>
        </div>
      </div>

      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selectedDeliveryId === opt.id;
          const IconComponent = opt.icon;
          return (
            <div
              key={opt.id}
              onClick={() => setSelectedDeliveryId(opt.id)}
              className={`cursor-pointer rounded-xl p-4 border transition-all flex items-center gap-4 ${
                isSelected
                  ? 'border-green-600 bg-indigo-50/20 ring-2 ring-indigo-600/20 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`p-2.5 rounded-xl text-emerald-600 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-indigo-50'}`}>
                <IconComponent className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900 text-xs">{opt.name}</h4>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {opt.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{opt.description}</p>
                <p className="text-[11px] font-medium text-gray-400 mt-1">Estimated: {opt.time}</p>
              </div>

              <div className="text-right">
                <span className="font-bold text-sm text-gray-900">
                  {opt.price === 0 ? 'FREE' : `MK${opt.price.toFixed(2)}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PaymentMethodsCard({ 
  paymentMethod, 
  setPaymentMethod, 
  mobileNumber, 
  setMobileNumber, 
  mobileProvider, 
  setMobileProvider 
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-900 transition-all">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-none">Payment Method</h3>
            <p className="text-xs text-gray-500 mt-1">Supported mobile wallets, PayChangu & Cards</p>
          </div>
        </div>
        <span className="text-[11px] text-emerald-600 bg-emerald-50 font-semibold px-2.5 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
          <Lock className="w-3 h-3" /> Encrypted
        </span>
      </div>

      {/* Payment Options Switcher */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        

        <button
          type="button"
          onClick={() => setPaymentMethod('paychangu')}
          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
            paymentMethod === 'paychangu'
              ? 'border-emerald-600 bg-indigo-50/40 ring-2 ring-emerald-600/20'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex justify-between items-center w-full">
            <Zap className="w-4 h-4 text-amber-500" />
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
              paymentMethod === 'paychangu' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300'
            }`}>
              {paymentMethod === 'paychangu' && <Check className="w-2.5 h-2.5" />}
            </div>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-900">PayChangu</p>
            <p className="text-[10px] text-gray-500">Local Gateway</p>
          </div>
        </button>
      </div>

      {paymentMethod === 'paychangu' && (
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <Zap className="w-4 h-4 text-amber-600" /> PayChangu Checkout Gateway
          </div>
          <p className="text-amber-800 leading-relaxed">
            Clicking "Complete Checkout" will redirect you safely to the PayChangu secure window where you can complete your local mobile money or bank transfer.
          </p>
        </div>
      )}

      {paymentMethod === 'card' && (
        <div className="bg-slate-50 p-4 rounded-xl border border-gray-200/80 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Cardholder Name</label>
            <input
              type="text"
              placeholder="e.g. Alexander Banda"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              placeholder="4000 1234 5678 9010"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM / YY"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">CVC / CVV</label>
              <input
                type="password"
                maxLength={4}
                placeholder="123"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



export function OrderSummaryCard({ items, subtotal, shippingFee, discount, total, selectedDelivery }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-gray-900 transition-all">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-base">Order Summary</h3>
        <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-semibold">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Item List */}
      <div className="divide-y divide-gray-100 my-4 max-h-60 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="py-3 flex gap-3">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-14 h-14 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-xs text-gray-900 truncate">{item.title}</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">{item.variant}</p>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] text-gray-400 font-medium">Qty: {item.quantity}</span>
                <span className="font-bold text-xs text-gray-900">MK{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calculation Breakdown */}
      <div className="space-y-2 border-t border-gray-100 pt-4 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Items Subtotal</span>
          <span className="font-semibold text-gray-900">MK{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery ({selectedDelivery?.name || 'Standard'})</span>
          <span className="font-semibold text-emerald-600">
            {shippingFee === 0 ? 'FREE' : `MK${shippingFee.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-black text-gray-900">
          <span>Total Payable</span>
          <span className="text-zinc-600">MK{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Main Action CTA */}
      <button className="w-full mt-6 bg-green-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-200 transition-all text-xs flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4" />
        <span>Pay ${total.toFixed(2)} Now</span>
      </button>

      <p className="text-[10px] text-center text-gray-400 mt-3 flex items-center justify-center gap-1">
        <Lock className="w-3 h-3 text-emerald-500" /> Buyer Protection Active · Free Instant Cancellation
      </p>
    </div>
  );
}
