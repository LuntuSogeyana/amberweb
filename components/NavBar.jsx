"use client";
import Link from 'next/link';
import { ShoppingCart, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cartCount, theme, toggleTheme } = useCart();

  return (
    <div className="fixed top-4 left-0 right-0 w-full z-50 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 w-full">
        
        {/* Main Navigation Pill */}
        <nav className="
          flex-1
          bg-white/50 dark:bg-neutral-900/50 
          backdrop-blur-2xl 
          rounded-full 
          border border-black/5 dark:border-white/10 
          shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] 
          transition-all 
          duration-300
        ">
          <div className="px-6 sm:px-8 h-16 flex items-center justify-between">
            <Link 
              href="/" 
              className="text-lg font-bold tracking-wider text-neutral-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 rounded-md focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
            >
              AMBER<span className="text-indigo-500">.</span>
            </Link>
            
            <div className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm uppercase tracking-widest font-semibold text-neutral-700 dark:text-neutral-200">
              <Link 
                href="/portfolio" 
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 rounded-md"
              >
                Portfolio
              </Link>
              <Link 
                href="/shop" 
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 rounded-md"
              >
                Shop
              </Link>
              <Link 
                href="/about" 
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 rounded-md hidden sm:block"
              >
                About
              </Link>
              
              <div className="flex items-center border-l border-neutral-300 dark:border-neutral-700 pl-4 sm:pl-6">
                
                {/* Shopping Cart Link with WCAG friendly label */}
                <Link 
                  href="/cart" 
                  aria-label={`Shopping Cart, contains ${cartCount} items`}
                  className="relative flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 rounded-full p-1"
                >
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-indigo-600 dark:bg-indigo-500 text-white dark:text-neutral-900 text-[10px] font-extrabold rounded-full h-4.5 w-4.5 flex items-center justify-center border border-white dark:border-neutral-900 shadow-sm">
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
            bg-white/50 dark:bg-neutral-900/50 
            backdrop-blur-2xl 
            border border-black/5 dark:border-white/10 
            shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] 
            text-neutral-800 dark:text-neutral-200 
            hover:text-indigo-600 dark:hover:text-indigo-400 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900
            active:scale-95
            transition-all 
            duration-300
            shrink-0
            cursor-pointer
          "
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

      </div>
    </div>
  );
}