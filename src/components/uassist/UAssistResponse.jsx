import React, { useState } from 'react';
import { 
  Utensils, 
  MapPin, 
  Calendar, 
  User, 
  Package, 
  Bot, 
  CheckCircle2, 
  Clock, 
  Users, 
  Star,
  Globe,
  Plus,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ActionCard from './ActionCards';

/**
 * ImageWithLoader Component
 * Ensures we don't have layout shifts or broken images while DB URLs are resolving
 */
const ImageWithLoader = ({ src, alt, className, icon: Icon }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${className}`}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 z-10">
          <Loader2 className="text-slate-300 dark:text-slate-600 animate-spin" size={20} />
        </div>
      )}
      {error ? (
        <Icon className="text-slate-300 dark:text-slate-600" size={24} />
      ) : (
        <img 
          src={src} 
          alt={alt} 
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};

/**
 * 1. FoodCard Component
 */
const FoodCard = ({ item }) => {
  if (!item) return null;
  return (
    <div className="w-full min-w-[280px] flex gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-sm hover:shadow-md transition-all group shrink-0 snap-center">
      <ImageWithLoader 
        src={item.image_url} 
        alt={item.name} 
        className="w-20 h-20 rounded-lg shrink-0" 
        icon={Utensils} 
      />
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-0.5">
          <div className="flex justify-between items-start">
            <h5 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h5>
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-black text-green-600">₹{item.price}</span>
          <button className="p-1 px-3 bg-indigo-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all">Add</button>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. EventCard Component
 */
const EventCard = ({ item }) => {
  if (!item) return null;
  const statusColors = {
    Upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Ongoing: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden">
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${statusColors[item.status] || 'bg-slate-100'}`}>
              {item.status}
            </span>
            <span className="text-green-600 font-bold text-[10px]">₹{item.fee || 'FREE'}</span>
          </div>
          <h5 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{item.title}</h5>
          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <MapPin size={10} /> {item.mode}
          </div>
          <button className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-black text-[9px] uppercase tracking-widest">View Details</button>
        </div>
    </div>
  );
};

/**
 * 3. StationeryCard / ProductCard Component
 */
const ProductCard = ({ item }) => {
  if (!item) return null;
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      <ImageWithLoader 
        src={item.image_url || item.image || item.image_url_db} 
        alt={item.name || item.title} 
        className="h-28" 
        icon={Package} 
      />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
           <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.name || item.title}</h5>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">₹{item.price}</p>
        </div>
        <button className="mt-3 w-full py-2 bg-indigo-600 text-white rounded-lg font-black uppercase tracking-widest text-[8px]">Action</button>
      </div>
    </div>
  );
};

/**
 * Main Router Component
 */
export const UAssistMessage = ({ message: msgObj }) => {
  if (!msgObj) return null;

  const renderCards = () => {
    const { type, data } = msgObj;
    if (!data || data.length === 0) return null;

    switch (type) {
      case 'food_cards':
        return (
          <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-none snap-x">
             {data.map((item, idx) => (
                <FoodCard key={idx} item={item} />
             ))}
          </div>
        );
      case 'event_cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
             {data.map((item, idx) => (
                <EventCard key={idx} item={item} />
             ))}
          </div>
        );
      case 'stationery_cards':
      case 'product_cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
             {data.map((item, idx) => (
                <ProductCard key={idx} item={item} />
             ))}
          </div>
        );
      case 'REPORT':
      case 'NAVIGATE':
        // These use the ActionCard primitive which expects a flat object per card, 
        // but the AI returns a list of items for consistency. We render the first one or a grid.
        return (
          <div className="space-y-4 pt-4">
            {data.map((item, idx) => (
              <ActionCard key={idx} card={{ ...item, type: response.type }} />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex gap-3 mb-2">
         <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <Bot size={18} />
         </div>
         <div className="space-y-1">
            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest ml-1">UAssist Bot</p>
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-2xl rounded-tl-none shadow-sm">
               <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {msgObj.content}
               </p>
            </div>
         </div>
      </div>
      <div className="ml-11">
         {renderCards()}
      </div>
    </div>
  );
};

export default UAssistMessage;
