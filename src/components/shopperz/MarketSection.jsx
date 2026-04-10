import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, 
  Search, 
  MapPin, 
  Plus, 
  MessageSquare, 
  Clock, 
  ChevronRight,
  Filter,
  CheckCircle2,
  Image as ImageLucide,
  DollarSign,
  Box
} from 'lucide-react';
import { useShopperz } from '@/context/ShopperzContext';
import { MARKET_CATEGORIES } from '@/data/shopperzData';

function MarketItemCard({ item, idx, reserveItem }) {
  const [isReserving, setIsReserving] = useState(false);
  const [isReserved, setIsReserved] = useState(item.reservedBy);

  const handleReserve = () => {
    if (!isReserving && !isReserved) {
      setIsReserving(true);
      // Simulating a small delay before final confirmation/action
      setTimeout(() => {
        reserveItem(item.id, 'user-123');
        setIsReserved(true);
        setIsReserving(false);
      }, 800);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: idx * 0.1 }}
      className={`group bg-white dark:bg-slate-900 rounded-[40px] border p-6 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition-all ${
        isReserved ? 'border-orange-600/50 bg-orange-50/5 dark:bg-orange-600/5' : 'border-slate-100 dark:border-white/5'
      }`}
    >
      <div className="relative w-full md:w-32 aspect-square md:aspect-auto rounded-3xl overflow-hidden bg-slate-100 shrink-0">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
        {isReserved && (
          <div className="absolute inset-0 bg-orange-600/40 backdrop-blur-sm flex items-center justify-center">
            <Clock className="text-white animate-spin-slow" size={24} />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-syne font-black text-sm uppercase italic tracking-tighter leading-tight group-hover:text-orange-600 transition-colors">{item.title}</h4>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                  item.condition === 'Like New' ? 'bg-green-100 text-green-600 dark:bg-green-600/20' : 
                  item.condition === 'Good' ? 'bg-blue-100 text-blue-600 dark:bg-blue-600/20' : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.condition}
                </span>
                {item.negotiable && (
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest">Negotiable</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-syne font-black text-slate-900 dark:text-white">₹{item.price}</p>
              {item.originalPrice && <p className="text-[9px] font-bold text-slate-400 line-through">₹{item.originalPrice}</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-slate-50 dark:border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-slate-400" />
            <span>Posted by {item.seller}</span>
          </div>
          {item.semester && (
            <div className="flex items-center gap-2">
              <Tag size={12} className="text-slate-400" />
              <span>Sem {item.semester}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-auto">
          <button 
            onClick={handleReserve}
            disabled={isReserved || isReserving}
            className={`flex-1 py-3 rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 transition-all ${
              isReserved 
              ? 'bg-orange-600 text-white' 
              : isReserving
                ? 'bg-slate-200 dark:bg-white/10 text-slate-500 animate-pulse'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white active:scale-95'
            }`}
          >
            {isReserved ? (
              <><Clock size={12} /> Reserved</>
            ) : isReserving ? (
              <>Processing...</>
            ) : (
              <>I Want This <ChevronRight size={12} /></>
            )}
          </button>
          <button className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-orange-600 hover:bg-orange-600/10 transition-all">
            <MessageSquare size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function MarketSection({ searchQuery }) {
  const { marketListings, reserveItem } = useShopperz();
  const [activeCategory, setActiveCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [sortByPrice, setSortByPrice] = useState('none'); // 'none' | 'asc' | 'desc'

  const filteredListings = marketListings
    .filter(l => {
      const matchesSearch = l.title.toLowerCase().includes((searchQuery || '').toLowerCase());
      const matchesCategory = activeCategory === 'All' || l.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortByPrice === 'asc') return a.price - b.price;
      if (sortByPrice === 'desc') return b.price - a.price;
      return 0;
    });

  const toggleSort = () => {
    setSortByPrice(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-8 pb-20 relative">
      
      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none w-full md:w-auto">
            {MARKET_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
                  : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
         </div>
         <div className="flex items-center gap-3">
            <div 
              onClick={toggleSort}
              className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all border ${
                sortByPrice !== 'none' 
                ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-500/20' 
                : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 border-transparent'
              }`}
            >
               <Filter size={12} /> {sortByPrice === 'none' ? 'Filter' : sortByPrice === 'asc' ? 'Price ↑' : 'Price ↓'}
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-orange-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:bg-slate-900 transition-all"
            >
               <Plus size={14} /> Sell Something
            </button>
         </div>
      </div>

      {/* Listings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredListings.map((item, idx) => (
          <MarketItemCard 
            key={item.id} 
            item={item} 
            idx={idx} 
            reserveItem={reserveItem} 
          />
        ))}
      </div>

      {/* FLOAT SELL BUTTON - Mobile shortcut */}
      <motion.button 
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         onClick={() => setShowModal(true)}
         className="fixed bottom-10 right-10 md:hidden w-16 h-16 bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50"
      >
         <Plus size={28} />
      </motion.button>

      {/* LIST ITEM MODAL (Overlay) */}
      <AnimatePresence>
         {showModal && (
           <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setShowModal(false)}
                 className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div 
                 initial={{ y: 100, scale: 0.9, opacity: 0 }}
                 animate={{ y: 0, scale: 1, opacity: 1 }}
                 exit={{ y: 100, scale: 0.9, opacity: 0 }}
                 className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[50px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                  <div className="p-10 space-y-10">
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-600">
                             <Box size={20} />
                           </div>
                           <div>
                             <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">List an Item</h3>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Post your gear for the KU Market</p>
                           </div>
                        </div>
                        <button onClick={() => setShowModal(false)} className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400"><Plus className="rotate-45" size={20} /></button>
                     </div>

                     <div className="space-y-6">
                        {/* PHOTO UPLOAD SIM */}
                        <div className="aspect-video rounded-[35px] border-4 border-dashed border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex flex-col items-center justify-center text-center p-6 group cursor-pointer">
                           <ImageLucide size={32} className="text-slate-300 dark:text-slate-600 group-hover:text-orange-600 transition-colors" />
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-3">Upload Product Photos (Max 5)</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                              <input type="text" placeholder="e.g. 5th Sem Books" className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl font-bold text-sm outline-none focus:border-orange-600" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                              <div className="relative">
                                 <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                 <input type="number" placeholder="0.00" className="w-full p-4 pl-10 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl font-syne font-black text-sm outline-none focus:border-orange-600" />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Meetup Location</label>
                           <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                              <input type="text" placeholder="Suggest a campus spot" className="w-full p-4 pl-10 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl font-bold text-sm outline-none focus:border-orange-600" />
                           </div>
                        </div>

                        <button className="w-full py-5 bg-orange-600 text-white rounded-[25px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-orange-500/30 flex items-center justify-center gap-3 active:scale-95 transition-all">
                           <CheckCircle2 size={18} /> Post My Listing
                        </button>
                     </div>
                  </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>

    </div>
  );
}
