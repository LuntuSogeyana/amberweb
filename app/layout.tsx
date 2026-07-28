import './globals.css';
import React, { JSX } from 'react';
import Navbar from '../components/NavBar';
import CustomerAuthModal from '../components/CustomerAuthModal';
import { CartProvider } from '../context/CartContext';

export const metadata = {
  title: 'AMBER Art Studio & Print Gallery',
  description: 'Original artwork, digital illustrations, and museum-grade fine art prints',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" className="dark">
      <body className="bg-pink-900 text-neutral-50 min-h-screen font-sans antialiased selection:bg-indigo-500/30">
        <CartProvider>
          <Navbar />
          <CustomerAuthModal />
          <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}