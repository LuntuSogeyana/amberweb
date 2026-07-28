"use client";
import { useState, useEffect } from 'react';
import { shopData as initialShopData } from '../../lib/mockData';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Check } from 'lucide-react';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group flex flex-col space-y-4 text-left">
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900 rounded-2xl border border-neutral-200/20 dark:border-neutral-800 shadow-md">
        <img 
          src={product.image} 
          alt={product.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
        />
        
        {/* Size & Material Badge */}
        <span className="absolute top-3 left-3 bg-white/80 dark:bg-black/70 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-neutral-800 dark:text-neutral-200 rounded-full tracking-wider uppercase border border-white/40 dark:border-white/10">
          {product.size} • 310gsm Paper
        </span>

        {/* Floating Add to Cart Button */}
        <button 
          onClick={handleAdd}
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 backdrop-blur-md px-6 py-3 text-xs font-semibold tracking-wider uppercase transition-all duration-300 rounded-xl w-[88%] shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
            added 
              ? "bg-emerald-600 text-white border border-emerald-500" 
              : "bg-neutral-900/90 dark:bg-white/90 text-white dark:text-black border border-white/10 dark:border-black/5 hover:bg-amber-500 dark:hover:bg-amber-400 hover:text-black dark:hover:text-black translate-y-0 opacity-100 md:translate-y-12 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          }`}
        >
          {added ? (
            <>
              <Check size={16} />
              <span>Added to Bag</span>
            </>
          ) : (
            <>
              <ShoppingBag size={15} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      <div className="flex justify-between items-start px-1">
        <div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">{product.title}</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Archival Fine Art Print • Signed</p>
        </div>
        <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100">${product.price.toFixed(2)}</p>
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

  const availableSizes = ["All", ...new Set(normalizedShopData.map(item => item.size))];

  const filteredProducts = selectedSize === "All" 
    ? normalizedShopData 
    : normalizedShopData.filter(product => product.size === selectedSize);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="text-left">
          <span className="text-xs uppercase tracking-widest font-semibold text-amber-600 dark:text-amber-400">
            Archival Fine Art Editions
          </span>
          <h1 className="text-4xl sm:text-5xl font-light text-neutral-900 dark:text-white tracking-tight mt-1">
            Prints & Originals
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-sm max-w-lg leading-relaxed">
            Museum-grade fine art prints produced on 310gsm cotton rag paper. Includes hand-signed Certificate of Authenticity and flat-pack shipping.
          </p>
        </div>

        {/* Size Filter Controls */}
        <div className="flex flex-wrap gap-2 bg-white/50 dark:bg-neutral-900/60 p-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 max-w-max self-start md:self-auto backdrop-blur-md">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-5 py-2 text-xs font-semibold tracking-wide rounded-full transition-all duration-200 cursor-pointer ${
                selectedSize === size
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-black shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              {size === "All" ? "All Print Sizes" : `${size} Size`}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-3">
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">No art prints found in this size category.</p>
          <button 
            onClick={() => setSelectedSize("All")} 
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 underline underline-offset-4 hover:text-black dark:hover:text-white cursor-pointer"
          >
            Show All Sizes
          </button>
        </div>
      )}

    </div>
  );
}