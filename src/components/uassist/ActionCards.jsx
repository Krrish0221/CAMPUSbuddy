import React from 'react';
import { motion } from 'framer-motion';
import { 
  Coffee, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  Navigation2,
  ShieldAlert,
  Zap,
  ChevronRight,
  Printer,
  FileText,
  Utensils,
  BookOpen,
  ShoppingBag,
  Star
} from 'lucide-react';

export default function ActionCard({ card }) {
  if (!card) return null;

  const renderContent = () => {
    switch (card.type) {
      case 'ORDER':
        return (
          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl">
             <div className="bg-slate-50 dark:bg-white/5 p-4 flex items-center gap-3">
               <Coffee className="text-blue-500" size={20} />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Preview</span>
             </div>
             <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="text-lg font-black italic uppercase tracking-tighter">{card.title}</h5>
                  <span className="font-syne font-black text-blue-500">{card.price}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{card.subtitle}</p>
                <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-slate-900 transition-all">
                  {card.buttonText}
                </button>
             </div>
          </div>
        );

      case 'NAVIGATE':
        return (
          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl">
             <div className="bg-slate-50 dark:bg-white/5 p-4 flex items-center gap-3">
               <MapPin className="text-amber-500" size={20} />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Directions</span>
             </div>
             <div className="p-6 space-y-4">
                <div>
                   <h5 className="text-lg font-black italic uppercase tracking-tighter">{card.title}</h5>
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{card.subtitle}</p>
                </div>
                <div className="flex items-center gap-2 text-amber-500">
                   <div className="px-2 py-0.5 bg-amber-500/10 rounded-md text-[8px] font-black uppercase tracking-widest">{card.meta}</div>
                </div>
                <button className="w-full py-3 bg-amber-500 text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2">
                  <Navigation2 size={12} /> {card.buttonText}
                </button>
             </div>
          </div>
        );

      case 'REPORT':
        return (
          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl">
             <div className="bg-red-600 p-4 flex items-center justify-between text-white">
               <div className="flex items-center gap-3">
                 <ShieldAlert size={20} />
                 <span className="text-[10px] font-black uppercase tracking-widest">{card.priority} ISSUE</span>
               </div>
               <div className="w-2 h-2 bg-white rounded-full animate-ping" />
             </div>
             <div className="p-6 space-y-4">
                <div>
                   <h5 className="text-lg font-black italic uppercase tracking-tighter">{card.title}</h5>
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{card.subtitle}</p>
                </div>
                <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[9px]">
                  {card.buttonText}
                </button>
             </div>
          </div>
        );

      case 'RSVP':
        return (
          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl">
             <div className="bg-slate-900 p-4 flex items-center gap-3 text-white">
               <Zap className="text-blue-500" size={20} />
               <span className="text-[10px] font-black uppercase tracking-widest">RSVP Confirmation</span>
             </div>
             <div className="p-6 space-y-4">
                <div>
                   <h5 className="text-lg font-black italic uppercase tracking-tighter">{card.title}</h5>
                   <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">{card.subtitle}</p>
                </div>
                <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                  <CheckCircle2 size={12} /> {card.buttonText}
                </button>
             </div>
          </div>
        );

      case 'PRINT':
        return (
          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl">
             <div className="bg-orange-600 p-4 flex items-center gap-3 text-white">
               <Printer className="text-white" size={20} />
               <span className="text-[10px] font-black uppercase tracking-widest text-white">Print Preview</span>
             </div>
             <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-orange-600/10 rounded-xl flex items-center justify-center text-orange-600">
                      <FileText size={20} />
                   </div>
                   <div>
                      <h5 className="text-sm font-black italic uppercase tracking-tighter">{card.title}</h5>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{card.subtitle}</p>
                   </div>
                </div>
                <div className="flex justify-between items-center py-3 border-y border-slate-100 dark:border-white/5">
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Cost</span>
                   <span className="text-sm font-syne font-black text-orange-600">{card.meta}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <button className="py-3 bg-orange-600 text-white rounded-xl font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-2">
                     <CheckCircle2 size={10} /> Confirm
                   </button>
                   <button className="py-3 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-xl font-black uppercase tracking-widest text-[8px]">
                     Cancel
                   </button>
                </div>
             </div>
          </div>
        );

      case 'FOOD_CARDS':
        return (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x -mx-2 px-2">
            {card.data.map((item, i) => (
              <div key={i} className="min-w-[200px] snap-center bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl flex flex-col">
                <div className="h-28 bg-slate-100 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[9px] font-black text-slate-900 border border-slate-100 italic">
                    ₹{item.price}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h5 className="text-[11px] font-black italic uppercase tracking-tighter line-clamp-1">{item.name}</h5>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.canteen || 'Main Cafe'}</p>
                  </div>
                  <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-2">
                    <Plus size={10} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'STATIONERY_CARDS':
        return (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x -mx-2 px-2">
            {card.data.map((item, i) => (
              <div key={i} className="min-w-[200px] snap-center bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl flex flex-col">
                <div className="h-28 bg-slate-100 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-orange-600 text-white rounded-lg text-[8px] font-black uppercase tracking-[0.2em] italic">
                    ₹{item.price}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h5 className="text-[11px] font-black italic uppercase tracking-tighter line-clamp-2">{item.name}</h5>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star size={8} fill="#FF9500" className="text-orange-500" />
                        <span className="text-[8px] font-black">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-2 transition-colors hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white">
                    <ShoppingBag size={10} /> Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="my-4 mx-2"
    >
      {renderContent()}
    </motion.div>
  );
}
