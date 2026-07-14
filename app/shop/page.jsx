"use client";
import { useState, useEffect } from 'react';
import { shopData as initialShopData } from '../../lib/mockData';
import { useCart } from '../../context/CartContext';
import Image from 'next/image';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <div className="group flex flex-col space-y-4">
      <div className="relative aspect-square overflow-hidden bg-neutral-900 rounded-2xl border border-neutral-200/10 shadow-sm">
        <img 
          src={product.image} 
          alt={product.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100"
        />
        {/* Size Badge Layered on Image */}
        <span className="absolute top-3 left-3 bg-white/80 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-neutral-800 rounded-md tracking-wider uppercase">
          {product.size} Size
        </span>

        {/* Responsive Button: Always visible on mobile, hover-animated on desktop (md:) */}
        <button 
          onClick={() => addToCart(product)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-black border border-white/10 dark:border-black/5 px-6 py-3 text-sm font-medium transition-all duration-300 rounded-xl w-[85%] shadow-lg hover:bg-black dark:hover:bg-white translate-y-0 opacity-100 md:translate-y-12 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 cursor-pointer"
        >
          Add to Cart
        </button>
      </div>
      <div className="flex justify-between items-start px-1">
        <div>
          <h3 className="text-lg font-medium text-neutral-850 dark:text-neutral-100">{product.title}</h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Premium Fine Art Print</p>
        </div>
        <p className="text-neutral-600 dark:text-neutral-350 font-medium">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default function Shop() {
  const [data, setData] = useState(initialShopData);
  const [selectedSize, setSelectedSize] = useState("All");

  useEffect(() => {
    fetch('/api/shop')
      .then(res => res.json())
      .then(items => {
        if (Array.isArray(items) && items.length > 0) {
          setData(items);
        }
      })
      .catch(err => console.error("Error fetching shop data:", err));
  }, []);

  // Ensure shop data fits structure with size fallbacks
  const normalizedShopData = data.map(product => ({
    ...product,
    size: product.size || (product.title.toLowerCase().includes("original") ? "A3" : "A4")
  }));

  // Dynamically pull all unique sizes present in the dataset to build buttons automatically
  const availableSizes = ["All", ...new Set(normalizedShopData.map(item => item.size))];

  // Filter logic
  const filteredProducts = selectedSize === "All" 
    ? normalizedShopData 
    : normalizedShopData.filter(product => product.size === selectedSize);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="border-b border-neutral-200 dark:border-neutral-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-light text-neutral-850 dark:text-neutral-105 tracking-tight">Available Works</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm">Original pieces and high-quality archival prints.</p>
        </div>

        {/* Premium Filter Controls with full dark mode colors */}
        <div className="flex flex-wrap gap-2 bg-neutral-100 dark:bg-neutral-900 p-1.5 rounded-full border border-neutral-200/60 dark:border-neutral-800 max-w-max self-start md:self-auto">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-5 py-2 text-xs font-medium tracking-wide rounded-full transition-all duration-200 cursor-pointer ${
                selectedSize === size
                  ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm"
                  : "text-neutral-500 dark:text-neutral-450 hover:text-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              {size === "All" ? "All Sizes" : size}
            </button>
          ))}
        </div>
      </header>

      {/* Dynamic Grid Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-2">
          <p className="text-neutral-400 dark:text-neutral-500 text-lg">No art pieces found in this size category.</p>
          <button 
            onClick={() => setSelectedSize("All")} 
            className="text-xs text-neutral-600 dark:text-neutral-400 underline underline-offset-4 hover:text-black dark:hover:text-white cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}