"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [theme, setTheme] = useState('light');
  
  // Customer Authentication & Delivery State
  const [customer, setCustomer] = useState(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);

  // Sync theme with document class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Load saved customer profile & cart from localStorage
  useEffect(() => {
    try {
      const savedCustomer = localStorage.getItem('amber_customer_profile');
      if (savedCustomer) {
        setCustomer(JSON.parse(savedCustomer));
      }
      const savedCart = localStorage.getItem('amber_cart_items');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error("Failed to load local customer storage:", err);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('amber_cart_items', JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  }, [cartItems]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Sign In / Save Customer Delivery Details
  const saveCustomerProfile = (details) => {
    setCustomer(details);
    try {
      localStorage.setItem('amber_customer_profile', JSON.stringify(details));
    } catch (err) {
      console.error("Failed to save customer profile:", err);
    }
    setIsCustomerModalOpen(false);

    // If customer was trying to add an item, add it now
    if (pendingProduct) {
      addItemToCart(pendingProduct);
      setPendingProduct(null);
    }
  };

  const signOutCustomer = () => {
    setCustomer(null);
    try {
      localStorage.removeItem('amber_customer_profile');
    } catch (err) {
      console.error("Failed to clear customer profile:", err);
    }
  };

  // Internal helper to add product to cart
  const addItemToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Main Add to Cart - Enforces Customer Sign In / Delivery Details
  const addToCart = (product) => {
    if (!customer) {
      setPendingProduct(product);
      setIsCustomerModalOpen(true);
      return false; // Indicates sign-in modal opened
    }
    addItemToCart(product);
    return true; // Added successfully
  };

  const updateQty = (id, amount) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + amount;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, updateQty, clearCart, cartTotal, cartCount, 
      theme, toggleTheme,
      customer, saveCustomerProfile, signOutCustomer,
      isCustomerModalOpen, setIsCustomerModalOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);