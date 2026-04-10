import React, { createContext, useContext, useState, useEffect } from 'react';
import { RETAIL_PRODUCTS, MARKET_LISTINGS } from '@/data/shopperzData';

const ShopperzContext = createContext();

export function ShopperzProvider({ children }) {
  const [activeSection, setActiveSection] = useState('store'); // 'store' | 'print' | 'market'
  const [products, setProducts] = useState(RETAIL_PRODUCTS.map(p => ({ ...p, isAvailable: p.stockCount > 0 })));
  const [cart, setCart] = useState([]);
  const [printJobs, setPrintJobs] = useState([]);
  const [marketListings, setMarketListings] = useState(MARKET_LISTINGS);
  const [isExamSeason, setIsExamSeason] = useState(true);

  // 0. RETAIL PRODUCT MANAGEMENT
  const addProduct = (product) => {
    const newProduct = {
      id: `rp-${Math.floor(Math.random() * 9000) + 1000}`,
      rating: 5.0,
      totalSold: 0,
      isAvailable: true,
      ...product
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // 1. CART LOGIC
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  // 2. PRINT LOGIC
  const addPrintJob = (job) => {
    const newJob = {
      id: `PRN-${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'Queued',
      uploadedAt: new Date(),
      ...job
    };
    setPrintJobs(prev => [newJob, ...prev]);
    
    // Simulate Status Updates
    setTimeout(() => updateJobStatus(newJob.id, 'Printing'), 5000);
    setTimeout(() => updateJobStatus(newJob.id, 'Ready'), 15000);
  };

  const updateJobStatus = (jobId, status) => {
    setPrintJobs(prev => prev.map(job => job.id === jobId ? { ...job, status } : job));
  };

  // 3. MARKETPLACE LOGIC
  const reserveItem = (itemId, studentId) => {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 2);
    
    setMarketListings(prev => prev.map(item => 
      item.id === itemId 
      ? { ...item, reservedBy: studentId, reservedUntil: expiry } 
      : item
    ));
  };

  // 4. CLEANUP (Auto-release P2P reservations)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setMarketListings(prev => prev.map(item => {
        if (item.reservedUntil && new Date(item.reservedUntil) < now) {
          return { ...item, reservedBy: null, reservedUntil: null };
        }
        return item;
      }));
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <ShopperzContext.Provider value={{
      activeSection, setActiveSection,
      products, addProduct, updateProduct, deleteProduct,
      cart, addToCart, removeFromCart,
      printJobs, addPrintJob,
      marketListings, reserveItem,
      isExamSeason
    }}>
      {children}
    </ShopperzContext.Provider>
  );
}

export function useShopperz() {
  return useContext(ShopperzContext);
}
