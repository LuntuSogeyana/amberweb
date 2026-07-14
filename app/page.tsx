"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="relative min-h-[85vh] flex flex-col lg:flex-row items-center justify-between gap-12 px-4 sm:px-6 overflow-hidden py-12">
      
      {/* Warm sunlight ambience backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-[#ffd6a5]/40 blur-3xl rounded-full" />
        <div className="absolute bottom-[-25%] right-[-10%] w-[500px] h-[500px] bg-[#ff8a5b]/25 blur-3xl rounded-full" />
      </div>

      {/* Left Column: Hero Copy */}
      <div className="relative z-10 max-w-xl space-y-8 text-center lg:text-left animate-in fade-in duration-1000 flex-1">
        {/* Title */}
        <h1 className="text-5xl md:text-6xl xl:text-7xl font-light tracking-tight leading-tight text-neutral-800">
          A space for{" "}
          <span className="italic text-neutral-700 block sm:inline lg:block">
            stories in colour
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-600 text-base md:text-lg leading-relaxed">
          A personal gallery of digital art, sketches, and creative experiments.
          Explore pieces, discover moods, or request something made just for you.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
          <Link
            href="/portfolio"
            className="px-8 py-4 rounded-xl bg-white/85 hover:bg-white text-black hover:text-black font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 transition-all duration-200 text-center"
          >
            fuck around and find out
          </Link>

          <Link
            href="/shop"
            className="px-8 py-4 rounded-xl border border-neutral-350 dark:border-neutral-700 text-neutral-800 dark:text-neutral-250 bg-white/10 dark:bg-white/5 backdrop-blur-sm hover:border-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-650 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
          >
            View Prints
          </Link>
        </div>

        {/* Personal line */}
        <p className="text-xs text-neutral-600 dark:text-neutral-450 pt-4 tracking-wide font-medium">
          curated with care • updated regularly • made to feel like home
        </p>
      </div>

      {/* Right Column: Premium Art Carousel */}
      <div className="relative z-10 w-full lg:w-[45%] aspect-[4/5] sm:max-w-md lg:max-w-none flex flex-col justify-center items-center flex-1 group">
        <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-xl border border-white/20 bg-neutral-900/5">
          
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
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 pt-12 flex flex-col justify-end text-left pointer-events-none">
            <span className="text-xs tracking-widest text-white/60 uppercase font-semibold mb-1">
              {currentItem.category}
            </span>
            <h3 className="text-xl font-medium text-white tracking-wide">
              {currentItem.title}
            </h3>
          </div>

          {/* Interactive Arrow Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/10 hover:bg-white/40 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-550 transition-all duration-300 shadow-md cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/10 hover:bg-white/40 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-550 transition-all duration-300 shadow-md cursor-pointer"
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
              className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-650 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 cursor-pointer ${
                index === currentIndex ? "w-7 bg-neutral-800 dark:bg-neutral-200" : "w-2.5 bg-neutral-350 dark:bg-neutral-600 hover:bg-neutral-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}