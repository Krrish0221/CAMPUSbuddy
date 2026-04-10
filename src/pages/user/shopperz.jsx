import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ModuleLayout from '@/components/ModuleLayout';
import { useShopperz } from '@/context/ShopperzContext';
import { 
  Store, 
  Printer, 
  Users, 
  Search, 
  ShoppingCart,
  Zap,
  Plus,
  Trash2
} from 'lucide-react';

import StoreSection from '@/components/shopperz/StoreSection';
import PrintSection from '@/components/shopperz/PrintSection';
import MarketSection from '@/components/shopperz/MarketSection';

export default function ShopperzPage() {
  const { activeSection, setActiveSection, cart, removeFromCart, isExamSeason } = useShopperz();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const sections = [
    { id: 'store', label: 'Campus Store', icon: <Store size={18} /> },
    { id: 'print', label: 'Cloud Print', icon: <Printer size={18} /> },
    { id: 'market', label: 'Student Market', icon: <Users size={18} /> },
  ];

  return (
    <ModuleLayout 
      title="Shopperz" 
      subtitle="Campus store, print & student market" 
      color="#EA580C"
    >
      <div className="space-y-8 min-h-[800px]">
        
        {/* EXAM SEASON BANNER */}
        {isExamSeason && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 text-white flex items-center justify-between shadow-xl shadow-orange-500/20"
          >
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
                  <Zap size={24} />
               </div>
               <div>
                  <h4 className="font-black italic uppercase tracking-tighter text-xl leading-none">Exam Season Specials</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Priority printing + Stationery bundles active</p>
               </div>
            </div>
            <button className="px-6 py-2 bg-white text-orange-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-all">
              Shop Bundles
            </button>
          </motion.div>
        )}

        {/* SEARCH & CART HEADER */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
           {/* Segmented Control */}
           <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-[30px] border border-slate-200 dark:border-white/10 w-full md:w-auto">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-[25px] transition-all relative font-black uppercase tracking-widest text-[9px] ${
                    activeSection === section.id 
                    ? 'text-white' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {activeSection === section.id && (
                    <motion.div 
                      layoutId="segment-pill"
                      className="absolute inset-0 bg-orange-600 rounded-[25px] shadow-lg shadow-orange-500/30"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10">{section.icon}</div>
                  <span className="relative z-10">{section.label}</span>
                </button>
              ))}
           </div>

           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative group flex-1 md:w-64">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                 <input 
                    type="text" 
                    placeholder={`Search ${activeSection}...`} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[30px] font-bold text-sm focus:border-orange-600 transition-all outline-none"
                 />
              </div>
               <button 
                onClick={() => setShowCart(true)}
                className="relative w-14 h-14 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-900 shadow-xl hover:scale-105 active:scale-95 transition-all"
               >
                  <ShoppingCart size={20} />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-4 border-white dark:border-slate-900 animate-in zoom-in duration-300">
                      {cart.length}
                    </span>
                  )}
               </button>
           </div>
        </div>

        {/* SECTION CONTENT WITH ANIMATED TRANSITIONS */}
        <div className="relative min-h-[600px]">
           <AnimatePresence mode="wait">
              {activeSection === 'store' && (
                <motion.div
                  key="store"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <StoreSection searchQuery={searchQuery} />
                </motion.div>
              )}
              {activeSection === 'print' && (
                <motion.div
                  key="print"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <PrintSection />
                </motion.div>
              )}
              {activeSection === 'market' && (
                <motion.div
                  key="market"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <MarketSection searchQuery={searchQuery} />
                </motion.div>
              )}
           </AnimatePresence>
        </div>

      </div>

      {/* REFINED CART MODAL */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[100] bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-2xl rounded-[50px] overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Header */}
              <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Your Bag</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{cart.length} Items Selected</p>
                </div>
                <button 
                  onClick={() => setShowCart(false)}
                  className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-4">
                {cart.length > 0 ? cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 group">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shrink-0 relative">
                      <Image src={item.image} fill className="object-cover" alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate text-sm">{item.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs font-black text-orange-600 dark:text-orange-500">₹{item.price}</p>
                        <span className="text-[10px] font-bold text-slate-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center py-10 text-slate-400">
                    <ShoppingCart size={48} strokeWidth={1} className="mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-center">Your bag is empty</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-8 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 space-y-6 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-500 uppercase tracking-widest">Grand Total</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter">₹{cartTotal}</span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  className="w-full py-5 bg-orange-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-[25px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Checkout Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModuleLayout>
  );
}
