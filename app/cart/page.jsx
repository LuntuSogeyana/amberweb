"use client";
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Cart() {
  const { cartItems, updateQty, cartTotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const handleCheckout = async () => {
    setCheckoutError(null);
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cartItems.map(item => ({ id: item.id, qty: item.qty })),
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-light text-neutral-400 dark:text-neutral-500">Your cart is empty.</h2>
        <Link href="/shop" className="text-indigo-550 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 underline underline-offset-4">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <h1 className="text-3xl font-light border-b border-neutral-200 dark:border-neutral-800 pb-6 text-neutral-800 dark:text-neutral-100">Shopping Cart</h1>
      <div className="space-y-8">
        {cartItems.map(item => (
          <div key={item.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center border-b border-neutral-200 dark:border-neutral-800 pb-8">
            {/* Product details & thumbnail (always horizontal row for thumbnail + metadata) */}
            <div className="flex gap-4 items-center w-full sm:w-auto">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl opacity-90 border border-neutral-200/10" 
              />
              <div className="flex-1 space-y-1">
                <h3 className="text-base sm:text-lg font-medium text-neutral-800 dark:text-neutral-100">{item.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">${item.price.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Quantity controls and item subtotal (takes full width on mobile, aligns right on desktop) */}
            <div className="flex items-center justify-between w-full sm:w-auto sm:ml-auto gap-6">
              <div className="flex items-center gap-4 bg-neutral-100 dark:bg-neutral-900 px-4 py-2.5 rounded-xl border border-neutral-200/40 dark:border-neutral-800">
                <button 
                  onClick={() => updateQty(item.id, -1)} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition text-neutral-500 dark:text-neutral-450 cursor-pointer p-0.5"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm font-semibold text-neutral-800 dark:text-neutral-100">{item.qty}</span>
                <button 
                  onClick={() => updateQty(item.id, 1)} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition text-neutral-500 dark:text-neutral-450 cursor-pointer p-0.5"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="w-24 text-right font-medium text-neutral-800 dark:text-neutral-100">${(item.price * item.qty).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer / Subtotal & Checkout */}
      <div className="flex flex-col items-end space-y-4 pt-6">
        {checkoutError && (
          <p className="text-sm text-red-600 dark:text-red-400">{checkoutError}</p>
        )}
        <div className="text-2xl font-light flex gap-8">
          <span className="text-neutral-400 dark:text-neutral-500">Subtotal</span>
          <span className="text-neutral-850 dark:text-neutral-100 font-medium">${cartTotal.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-12 py-4 font-semibold hover:bg-neutral-850 dark:hover:bg-neutral-100 transition-all rounded-2xl w-full sm:w-auto shadow-md hover:-translate-y-0.5 cursor-pointer disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          {isCheckingOut && <Loader2 size={18} className="animate-spin" />}
          {isCheckingOut ? 'Redirecting to payment…' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
}