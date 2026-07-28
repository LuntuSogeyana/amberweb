"use client";
import Link from 'next/link';
import { ShoppingCart, Sun, Moon, Palette, User, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { 
    cartCount, 
    theme, 
    toggleTheme, 
    customer, 
    setIsCustomerModalOpen 
  } = useCart();

  return (
    <div className="fixed top-4 left-0 right-0 w-full z-50 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 w-full">
        
        {/* Main Navigation Pill */}
        <nav className="
          flex-1
          bg-white/70 dark:bg-neutral-900/70 
          backdrop-blur-2xl 
          rounded-full 
          border border-neutral-200/80 dark:border-neutral-800 
          shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] 
          transition-all 
          duration-300
        ">
          <div className="px-4 sm:px-8 h-16 flex items-center justify-between">
            {/* Brand Logo & Art Studio Badge */}
            <Link 
              href="/" 
              className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 rounded-md"
            >
              <div className="p-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Palette size={18} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-base sm:text-lg font-bold tracking-wider text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-none">
                  AMBER<span className="text-amber-500">.</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Hand drawn portraits & illustrations
                </span>
              </div>
            </Link>
            
            {/* Navigation Links */}
            <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm uppercase tracking-widest font-semibold text-neutral-700 dark:text-neutral-200">
              <Link 
                href="/portfolio" 
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 rounded-md"
              >
                Gallery
              </Link>
              <Link 
                href="/shop" 
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 rounded-md"
              >
                sketches & Original drawings
              </Link>
              <Link 
                href="/about" 
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 rounded-md hidden md:block"
              >
                About me
              </Link>
              
              <div className="flex items-center gap-2 sm:gap-3 border-l border-neutral-300 dark:border-neutral-700 pl-3 sm:pl-5">
                
                {/* Customer Delivery Sign-In / Account Button */}
                <button
                  onClick={() => setIsCustomerModalOpen(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    customer 
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20" 
                      : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 shadow-sm"
                  }`}
                  aria-label={customer ? `Delivery Details for ${customer.name}` : "Customer Delivery Sign In"}
                >
                  {customer ? (
                    <>
                      <CheckCircle size={14} className="text-emerald-500" />
                      <span className="max-w-[100px] truncate hidden sm:inline">{customer.name.split(' ')[0]}</span>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 dark:text-amber-400">Delivery</span>
                    </>
                  ) : (
                    <>
                      <User size={14} />
                      <span>Sign In</span>
                    </>
                  )}
                </button>

                {/* Shopping Cart Link */}
                <Link 
                  href="/cart" 
                  aria-label={`Shopping Cart, contains ${cartCount} items`}
                  className="relative flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 rounded-full p-1"
                >
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-amber-500 dark:bg-amber-400 text-black text-[10px] font-extrabold rounded-full h-4.5 w-4.5 flex items-center justify-center border border-white dark:border-neutral-900 shadow-sm animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Independent Floating Circle Theme Button */}
        <button 
          onClick={toggleTheme} 
          className="
            h-16 w-16
            flex items-center justify-center
            rounded-full 
            bg-white/70 dark:bg-neutral-900/70 
            backdrop-blur-2xl 
            border border-neutral-200/80 dark:border-neutral-800 
            shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] 
            text-neutral-800 dark:text-neutral-200 
            hover:text-amber-500 dark:hover:text-amber-400 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900
            active:scale-95
            transition-all 
            duration-300
            shrink-0
            cursor-pointer
          "
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
        </button>

      </div>
    </div>
  );
}