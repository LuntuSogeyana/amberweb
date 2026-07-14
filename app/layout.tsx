import './globals.css';
import React, { JSX } from 'react';
import Navbar from '../components/NavBar';
import { CartProvider } from '../context/CartContext';

export const metadata = {
  title: 'Artist Portfolio & Shop',
  description: 'Creative portfolio and ecommerce store',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" className="dark">
      <body className="bg-pink-900 text-neutral-50 min-h-screen font-sans antialiased selection:bg-indigo-500/30">
        <CartProvider>
          <Navbar />
          <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}