"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Truck, X, User, Mail, Phone, MapPin, Sparkles, Check } from 'lucide-react';

export default function CustomerAuthModal() {
  const { 
    customer, 
    saveCustomerProfile, 
    isCustomerModalOpen, 
    setIsCustomerModalOpen 
  } = useCart();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');

  // Pre-fill existing customer info when opening
  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setEmail(customer.email || '');
      setPhone(customer.phone || '');
      setAddress(customer.address || '');
      setCity(customer.city || '');
      setPostalCode(customer.postalCode || '');
      setCountry(customer.country || 'United States');
    }
  }, [customer, isCustomerModalOpen]);

  if (!isCustomerModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !address || !city) return;

    saveCustomerProfile({
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      country
    });
  };

  // Quick Demo Prefill for testing convenience
  const handleQuickPrefill = () => {
    setName('Alex Rivera');
    setEmail('alex.rivera@example.com');
    setPhone('+1 (555) 234-5678');
    setAddress('742 Evergreen Terrace');
    setCity('Springfield');
    setPostalCode('97477');
    setCountry('United States');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-6 my-8 text-left"
        >
          {/* Close Button */}
          <button 
            onClick={() => setIsCustomerModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white transition-all cursor-pointer"
            aria-label="Close delivery sign in modal"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="space-y-2 pr-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Truck size={14} />
              Customer Delivery Sign-In
            </span>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-neutral-900 dark:text-white">
              {customer ? "Update Delivery Details" : "Sign In & Delivery Info"}
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Since artwork and prints are physically shipped to your door, please enter your contact and delivery address to add items to your bag.
            </p>
          </div>

          {/* Quick Demo Fill Button */}
          <button
            type="button"
            onClick={handleQuickPrefill}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-all cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Fill Sample Delivery Details for Testing</span>
          </button>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                  <User size={12} />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text" required placeholder="e.g. Jane Doe"
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 outline-none text-neutral-900 dark:text-white text-xs focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                  <Mail size={12} />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email" required placeholder="jane@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 outline-none text-neutral-900 dark:text-white text-xs focus:border-amber-500"
                />
              </div>
            </div>

            {/* Phone & Street Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                  <Phone size={12} />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel" required placeholder="+1 (555) 000-0000"
                  value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 outline-none text-neutral-900 dark:text-white text-xs focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                  <MapPin size={12} />
                  <span>Street Address *</span>
                </label>
                <input
                  type="text" required placeholder="123 Gallery Way, Apt 4"
                  value={address} onChange={e => setAddress(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 outline-none text-neutral-900 dark:text-white text-xs focus:border-amber-500"
                />
              </div>
            </div>

            {/* City, Postal Code, Country */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-neutral-700 dark:text-neutral-300">City *</label>
                <input
                  type="text" required placeholder="New York"
                  value={city} onChange={e => setCity(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3 py-2.5 outline-none text-neutral-900 dark:text-white text-xs focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700 dark:text-neutral-300">Zip/Postal *</label>
                <input
                  type="text" required placeholder="10001"
                  value={postalCode} onChange={e => setPostalCode(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3 py-2.5 outline-none text-neutral-900 dark:text-white text-xs focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700 dark:text-neutral-300">Country *</label>
                <input
                  type="text" required placeholder="United States"
                  value={country} onChange={e => setCountry(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3 py-2.5 outline-none text-neutral-900 dark:text-white text-xs focus:border-amber-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <button 
                type="button"
                onClick={() => setIsCustomerModalOpen(false)}
                className="w-1/3 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="w-2/3 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check size={16} />
                <span>Save & Continue</span>
              </button>
            </div>

          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
