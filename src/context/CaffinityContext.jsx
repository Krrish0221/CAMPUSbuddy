import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ORDERS, MENU_ITEMS } from '@/data/caffinityData';

const CaffinityContext = createContext();

export const CaffinityProvider = ({ children }) => {
  const [selectedCanteen, setSelectedCanteen] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isCanteenSelecting, setIsCanteenSelecting] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCanteen = localStorage.getItem('selected_canteen');
    const savedOrders = localStorage.getItem('caffinity_orders');
    
    if (savedCanteen) {
      setSelectedCanteen(JSON.parse(savedCanteen));
      setIsCanteenSelecting(false);
    }
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('caffinity_orders', JSON.stringify(INITIAL_ORDERS));
    }
  }, []);

  // Sync orders to localStorage
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('caffinity_orders', JSON.stringify(orders));
    }
  }, [orders]);

  const selectCanteen = (canteen) => {
    setSelectedCanteen(canteen);
    localStorage.setItem('selected_canteen', JSON.stringify(canteen));
    setIsCanteenSelecting(false);
  };

  const resetCanteen = () => {
    setSelectedCanteen(null);
    localStorage.removeItem('selected_canteen');
    setIsCanteenSelecting(true);
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (scheduledTime, specialNote = '') => {
    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      studentName: 'Student User', // Should come from AuthContext in real app
      canteenId: selectedCanteen?.id,
      items: [...cart],
      total: cartTotal,
      status: 'Placed',
      timestamp: new Date().toISOString(),
      scheduledTime: scheduledTime || 'As soon as possible',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      specialNote: specialNote
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    clearCart();
    
    // Broadcast for vendor
    window.dispatchEvent(new Event('storage'));
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    window.dispatchEvent(new Event('storage'));
  };

  // Automated Status Advancement (Demo Simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => {
        let changed = false;
        const newOrders = prevOrders.map(order => {
          if (order.status === 'Done') return order;

          const elapsedMs = new Date() - new Date(order.timestamp);
          const elapsedSecs = Math.floor(elapsedMs / 1000);

          let nextStatus = order.status;
          if (elapsedSecs >= 45) nextStatus = 'Done';
          else if (elapsedSecs >= 25) nextStatus = 'Ready';
          else if (elapsedSecs >= 10) nextStatus = 'Preparing';

          if (nextStatus !== order.status) {
            changed = true;
            return { ...order, status: nextStatus };
          }
          return order;
        });

        if (changed) {
          window.dispatchEvent(new Event('storage'));
          return newOrders;
        }
        return prevOrders;
      });
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const value = {
    selectedCanteen,
    selectCanteen,
    resetCanteen,
    isCanteenSelecting,
    cart,
    addToCart,
    updateQuantity,
    clearCart,
    orders,
    placeOrder,
    updateOrderStatus
  };

  return (
    <CaffinityContext.Provider value={value}>
      {children}
    </CaffinityContext.Provider>
  );
};

export const useCaffinity = () => {
  const context = useContext(CaffinityContext);
  if (!context) {
    throw new Error('useCaffinity must be used within a CaffinityProvider');
  }
  return context;
};
