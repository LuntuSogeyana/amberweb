"use client";
import Link from 'next/link';
import { Palette, Sparkles, Heart, Mail, ShieldCheck } from 'lucide-react';

export default function AboutStudio() {
  return (
    <div className="space-y-16 animate-in fade-in duration-700 py-4 max-w-4xl mx-auto text-left">
      
      {/* Header */}
      <header className="space-y-4 border-b border-neutral-200 dark:border-neutral-800 pb-8">
        <span className="text-xs uppercase tracking-widest font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
          <Palette size={16} />
          About The Studio & Artist
        </span>
        <h1 className="text-4xl sm:text-6xl font-light text-neutral-900 dark:text-white tracking-tight leading-tight">
          Crafting art that feels like <span className="font-serif italic text-neutral-800 dark:text-neutral-200">home</span>.
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed max-w-2xl">
          AMBER Studio is an independent creative sanctuary dedicated to exploring emotion, light, and atmosphere through fine digital paintings, charcoal studies, and museum-grade archival prints.
        </p>
      </header>

      {/* Main Story & Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
          <h2 className="text-2xl font-light text-neutral-900 dark:text-white">Studio Philosophy</h2>
          <p>
            Every artwork begins with a feeling — a mood captured during quiet sunrise hours or late-night studio sessions. Whether it's the raw texture of charcoal on heavy paper or fluid digital brushstrokes, each piece tells a personal story.
          </p>
          <p>
            I believe art should not only decorate a room, but elevate the atmosphere of your daily life. That's why every print is treated as a piece of history — crafted using museum-grade archival cotton rag paper and lightfast pigment inks.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-amber-500/10 dark:bg-neutral-900/60 border border-amber-500/20 dark:border-neutral-800 space-y-6 shadow-sm">
          <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="text-amber-500" />
            <span>The Print Standard</span>
          </h3>

          <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-300">
            <li className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
              <span><strong>310gsm Cotton Rag:</strong> Ultra-heavyweight textured fine art paper.</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
              <span><strong>100+ Year Color Life:</strong> Pigment inks resist fading and yellowing.</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
              <span><strong>Hand-Signed Certificate:</strong> Includes a physical Certificate of Authenticity.</span>
            </li>
          </ul>

          <Link 
            href="/shop" 
            className="block w-full py-3 text-center rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold text-xs transition-all hover:bg-neutral-800"
          >
            Explore Available Prints
          </Link>
        </div>
      </div>

      {/* Custom Commission Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 text-neutral-900 dark:text-white space-y-4">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs uppercase tracking-widest">
          <Sparkles size={16} />
          <span>Custom Commissions</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-light">Looking for something made just for you?</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed">
          I collaborate with art collectors, interior designers, and individuals for bespoke original paintings and custom print sizes.
        </p>
        
        <div className="pt-2 flex flex-col sm:flex-row gap-4">
          <a 
            href="mailto:studio@amberart.com" 
            className="px-6 py-3.5 rounded-xl bg-amber-500 text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-sm"
          >
            <Mail size={16} />
            <span>Request a Custom Piece</span>
          </a>
        </div>
      </div>

    </div>
  );
}
