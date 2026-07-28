"use client";
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, Loader2, Truck, UserCheck, Edit3 } from 'lucide-react';
import Link from 'next/link';

export default function Cart() {
  const { 
    cartItems, 
    updateQty, 
    cartTotal, 
    customer, 
    setIsCustomerModalOpen 
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const handleCheckout = async () => {
    setCheckoutError(null);

    // Require Customer Sign-In / Delivery Info before checkout
    if (!customer) {
      setIsCustomerModalOpen(true);
      return;
    }

    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cartItems.map(item => ({ id: item.id, qty: item.qty })),
          customerDetails: customer
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Could not start checkout');
      }
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err.message || 'Something went wrong. Please try again.');
      setIsCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center">
        <h2 className="text-2xl font-light text-neutral-500 dark:text-neutral-400">Your shopping bag is empty.</h2>
        <Link href="/shop" className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-sm">
          Browse Prints & Originals
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 text-left">
      
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-amber-600 dark:text-amber-400">
            Art Studio Order
          </span>
          <h1 className="text-3xl sm:text-4xl font-light text-neutral-900 dark:text-white tracking-tight mt-0.5">
            Your Shopping Bag
          </h1>
        </div>

        {/* Customer Delivery Banner */}
        {customer ? (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
              <UserCheck size={16} className="text-emerald-500 shrink-0" />
              <div>
                <p className="font-bold leading-none">{customer.name}</p>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5 truncate max-w-[260px]">
                  {customer.address}, {customer.city}, {customer.country}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsCustomerModalOpen(true)}
              className="text-amber-700 dark:text-amber-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Edit3 size={13} />
              <span>Edit Address</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsCustomerModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold text-xs flex items-center gap-2 hover:bg-amber-500/20 transition-all cursor-pointer"
          >
            <Truck size={15} />
            <span>Sign In & Add Delivery Details</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="space-y-6">
        {cartItems.map(item => (
          <div key={item.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center border-b border-neutral-200 dark:border-neutral-800 pb-6">
            <div className="flex gap-4 items-center w-full sm:w-auto">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-neutral-200 dark:border-neutral-800" 
              />
              <div className="flex-1 space-y-1">
                <h3 className="text-base sm:text-lg font-medium text-neutral-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Archival 310gsm Cotton Print</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">${item.price.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between w-full sm:w-auto sm:ml-auto gap-6">
              <div className="flex items-center gap-4 bg-neutral-100 dark:bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <button 
                  onClick={() => updateQty(item.id, -1)} 
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition text-neutral-500 cursor-pointer p-0.5"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm font-bold text-neutral-900 dark:text-white">{item.qty}</span>
                <button 
                  onClick={() => updateQty(item.id, 1)} 
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition text-neutral-500 cursor-pointer p-0.5"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="w-24 text-right font-bold text-neutral-900 dark:text-white">${(item.price * item.qty).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer / Subtotal & Checkout */}
      <div className="flex flex-col items-end space-y-4 pt-4">
        {checkoutError && (
          <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{checkoutError}</p>
        )}
        <div className="text-2xl font-light flex gap-8">
          <span className="text-neutral-500 dark:text-neutral-400">Subtotal</span>
          <span className="text-neutral-900 dark:text-white font-bold">${cartTotal.toFixed(2)}</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-10 py-4 font-extrabold text-xs uppercase tracking-wider hover:bg-amber-500 dark:hover:bg-amber-400 hover:text-black dark:hover:text-black transition-all rounded-2xl w-full sm:w-auto shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isCheckingOut ? <Loader2 size={18} className="animate-spin" /> : <Truck size={18} />}
          {isCheckingOut ? 'Redirecting to payment…' : (customer ? 'Proceed to Delivery Checkout' : 'Sign In & Proceed to Checkout')}
        </button>
      </div>

    </div>
  );
}