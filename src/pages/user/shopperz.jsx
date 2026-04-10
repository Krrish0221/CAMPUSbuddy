import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModuleLayout from '@/components/ModuleLayout';
import { useShopperz } from '@/context/ShopperzContext';
import { 
  Store, 
  Printer, 
  Users, 
  Search, 
  ShoppingCart,
  Zap
} from 'lucide-react';

import StoreSection from '@/components/shopperz/StoreSection';
import PrintSection from '@/components/shopperz/PrintSection';
import MarketSection from '@/components/shopperz/MarketSection';

export default function ShopperzPage() {
  const { activeSection, setActiveSection, cart, isExamSeason } = useShopperz();
  const [searchQuery, setSearchQuery] = useState('');

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
              <button className="relative w-14 h-14 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-900 shadow-xl">
                 <ShoppingCart size={20} />
                 {cart.length > 0 && (
                   <span className="absolute -top-2 -right-2 bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-4 border-white dark:border-slate-900">
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
    </ModuleLayout>
  );
}
