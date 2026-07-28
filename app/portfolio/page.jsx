"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { portfolioData as initialPortfolioData } from '../../lib/mockData';
import { ShoppingBag, Eye, X } from 'lucide-react';

export default function PortfolioGallery() {
  const [data, setData] = useState(initialPortfolioData);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(items => {
        if (Array.isArray(items) && items.length > 0) {
          setData(items);
        }
      })
      .catch(err => console.error("Error fetching portfolio items:", err));
  }, []);

  const categories = ["All", ...new Set(data.map(item => item.category))];

  const filteredItems = selectedCategory === "All"
    ? data
    : data.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-amber-600 dark:text-amber-400">
            Art Gallery Collection
          </span>
          <h1 className="text-4xl sm:text-5xl font-light text-neutral-900 dark:text-white tracking-tight mt-1">
            Selected Works
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-sm max-w-xl leading-relaxed">
            Explore digital illustrations, raw charcoal studies, and fluid abstract experiments. Select any piece to view details or shop available prints.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 bg-white/50 dark:bg-neutral-900/60 p-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 self-start md:self-auto backdrop-blur-md">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 text-xs font-semibold tracking-wide rounded-full transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-black shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              {cat === "All" ? "All Works" : cat}
            </button>
          ))}
        </div>
      </header>

      {/* Art Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200/20 dark:border-neutral-800 shadow-md flex flex-col aspect-[4/5]"
          >
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity p-6 flex flex-col justify-end text-left">
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-300 mb-1">
                {item.category}
              </span>
              <h3 className="text-xl font-medium text-white tracking-wide">
                {item.title}
              </h3>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 pt-2 border-t border-white/20">
                <button 
                  onClick={() => setActiveItem(item)}
                  className="flex-1 py-2 px-3 rounded-lg bg-white/20 backdrop-blur-md text-white text-xs font-semibold hover:bg-white/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye size={14} />
                  <span>View Details</span>
                </button>
                
                <Link 
                  href="/shop"
                  className="flex-1 py-2 px-3 rounded-lg bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5 text-center"
                >
                  <ShoppingBag size={14} />
                  <span>Buy Print</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-neutral-900 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-950">
              <img src={activeItem.image} alt={activeItem.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3 text-left">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">{activeItem.category}</span>
              <h3 className="text-3xl font-light">{activeItem.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Created with passion in the studio. Printed on archival 310gsm cotton rag with museum-grade pigment inks guaranteed to maintain color brilliance for generations.
              </p>
            </div>

            <div className="flex gap-4 pt-4 border-t border-neutral-800">
              <Link 
                href="/shop"
                onClick={() => setActiveItem(null)}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-center transition-all"
              >
                Find in Art Shop
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
