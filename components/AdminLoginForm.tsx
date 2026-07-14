'use client';

import { useActionState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, AlertCircle } from 'lucide-react';
import { loginAction } from '../app/actions/admin';

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#ffd6a5]/30 blur-3xl rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#ff8a5b]/25 blur-3xl rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-black/5 dark:border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl font-light tracking-tight text-neutral-800 dark:text-neutral-100">
            Welcome Back, <span className="italic text-indigo-500 font-normal">Artist</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-350 text-sm">
            Enter your credentials to access the gallery vault.
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          {state?.error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium"
            >
              <AlertCircle size={18} className="shrink-0" />
              <span>{state.error}</span>
            </motion.div>
          )}

          <div className="space-y-2">
            <label 
              htmlFor="username" 
              className="text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 pl-1"
            >
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-neutral-500 dark:text-neutral-400">
                <User size={18} />
              </span>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Username"
                className="w-full bg-white/50 dark:bg-neutral-900/50 border border-neutral-350 dark:border-neutral-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus-visible:border-indigo-600 dark:focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-600/20 dark:focus-visible:ring-indigo-400/20 text-neutral-900 dark:text-neutral-100 transition-all placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="password" 
              className="text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 pl-1"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-neutral-500 dark:text-neutral-400">
                <Lock size={18} />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-white/50 dark:bg-neutral-900/50 border border-neutral-350 dark:border-neutral-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus-visible:border-indigo-600 dark:focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-600/20 dark:focus-visible:ring-indigo-400/20 text-neutral-900 dark:text-neutral-100 transition-all placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-4 px-6 rounded-2xl font-semibold text-sm transition-all hover:bg-neutral-800 dark:hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            {pending ? (
              <>
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Unlocking...</span>
              </>
            ) : (
              <span>Unlock Admin Panel</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
