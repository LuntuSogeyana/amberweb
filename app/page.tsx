"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Award, Truck, Sparkles, ArrowRight } from "lucide-react";
import { portfolioData as initialPortfolioData } from "../lib/mockData";

export default function Home() {
  const [data, setData] = useState(initialPortfolioData);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const nextSlide = () => {
    if (data.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const prevSlide = () => {
    if (data.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  const currentItem = data[currentIndex] || { image: "", title: "", category: "" };

  return (
    <div className="space-y-20 py-6">
      
      {/* Hero Section */}
      <div className="relative min-h-[75vh] flex flex-col lg:flex-row items-center justify-between gap-12 px-4 sm:px-6 overflow-hidden py-8">
        
        {/* Warm sunlight ambience backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-[#ffd6a5]/40 blur-3xl rounded-full" />
          <div className="absolute bottom-[-25%] right-[-10%] w-[500px] h-[500px] bg-[#ff8a5b]/25 blur-3xl rounded-full" />
        </div>

        {/* Left Column: Hero Copy */}
        <div className="relative z-10 max-w-xl space-y-8 text-center lg:text-left animate-in fade-in duration-1000 flex-1">
          
          {/* Studio Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold tracking-wide">
            <Sparkles size={14} />
            <span>Independent Fine Art Studio & Print Gallery</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-light tracking-tight leading-tight text-neutral-900 dark:text-white">
            A space for{" "}
            <span className="italic font-serif text-neutral-800 dark:text-neutral-200 block sm:inline lg:block">
              stories on paper
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
            Discover original sketch drawings, charcoal drawings, and museum-grade digital art made to bring warmth, character, and inspiration into your space.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
            <Link
              href="/portfolio"
              className="px-8 py-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold shadow-md hover:bg-neutral-800 dark:hover:bg-neutral-100 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 transition-all duration-200 text-center flex items-center justify-center gap-2"
            >
              <span>Explore Gallery</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/shop"
              className="px-8 py-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 bg-white/40 dark:bg-white/5 backdrop-blur-md hover:border-neutral-500 hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-200 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              Shop Archival Prints
            </Link>
          </div>

          {/* Personal Line / Guarantee */}
          <p className="text-xs text-neutral-500 dark:text-neutral-400 pt-2 tracking-wide font-medium">
            Hand-signed Certificate of Authenticity • Worldwide Shipping • Limited Editions
          </p>
        </div>

        {/* Right Column: Featured Artwork Carousel */}
        <div className="relative z-10 w-full lg:w-[45%] aspect-[4/5] sm:max-w-md lg:max-w-none flex flex-col justify-center items-center flex-1 group">
          <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl border border-white/30 dark:border-neutral-800 bg-neutral-900/5">
            
            {data.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={currentItem.image}
                  alt={currentItem.title}
                  initial={{ opacity: 0, scale: 1.02, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover rounded-3xl selection:bg-transparent"
                />
              </AnimatePresence>
            )}

            {/* Dynamic Image Overlay / Label */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 pt-14 flex flex-col justify-end text-left pointer-events-none">
              <span className="text-xs tracking-widest text-amber-300 uppercase font-semibold mb-1">
                Featured Artwork • {currentItem.category}
              </span>
              <h3 className="text-2xl font-medium text-white tracking-wide">
                {currentItem.title}
              </h3>
            </div>

            {/* Interactive Arrow Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all duration-300 shadow-md cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all duration-300 shadow-md cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex gap-2 mt-4">
            {data.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 cursor-pointer ${
                  index === currentIndex ? "w-7 bg-amber-500" : "w-2.5 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Art Studio Trust & Value Proposition Badges */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-6">
        <div className="p-6 rounded-2xl bg-white/40 dark:bg-neutral-900/40 backdrop-blur-lg border border-neutral-200/80 dark:border-neutral-800 flex items-start gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Award size={24} />
          </div>
          <div className="space-y-1 text-left">
            <h4 className="font-semibold text-neutral-900 dark:text-white text-base">Archival Fine Art Paper</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">Printed on 310gsm 100% cotton rag with museum-grade pigment inks designed to last over 100 years.</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/40 dark:bg-neutral-900/40 backdrop-blur-lg border border-neutral-200/80 dark:border-neutral-800 flex items-start gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Sparkles size={24} />
          </div>
          <div className="space-y-1 text-left">
            <h4 className="font-semibold text-neutral-900 dark:text-white text-base">Hand-Signed & Numbered</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">Every original piece and limited edition print includes a physical Certificate of Authenticity signed by the artist.</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/40 dark:bg-neutral-900/40 backdrop-blur-lg border border-neutral-200/80 dark:border-neutral-800 flex items-start gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Truck size={24} />
          </div>
          <div className="space-y-1 text-left">
            <h4 className="font-semibold text-neutral-900 dark:text-white text-base">Protective Express Shipping</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">Carefully flat-packed or shipped in heavy-duty protective rigid tubes. Free shipping on print orders over $75.</p>
          </div>
        </div>
      </section>

    </div>
  );
}