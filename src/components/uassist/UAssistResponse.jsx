import React from 'react';
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
  Plus
} from 'lucide-react';

/**
 * 1. FoodCard Component (Horizontal)
 */
const FoodCard = ({ item }) => {
  if (!item) return null;

  return (
    <div className="w-full min-w-[300px] flex gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group shrink-0 snap-center">
      {/* Photo Section */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <Utensils className="text-slate-400" size={24} />
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-0.5">
          <div className="flex justify-between items-start">
            <h5 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{item.name}</h5>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-2">{item.canteen || 'Cafe'}</span>
          </div>
          <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[9px] font-medium">
            {item.category || 'General'}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-green-600 dark:text-green-500">₹{item.price}</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${item.is_available ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              {item.is_available ? 'Available' : 'Sold Out'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. EventCard Component (Vertical)
 */
const EventCard = ({ item }) => {
  if (!item) return null;

  const statusColors = {
    Upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Ongoing: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Completed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };

  const formattedDate = item.start_time 
    ? new Date(item.start_time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Date TBD';

  const deadlineDate = item.deadline 
    ? new Date(item.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })
    : null;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
      <div className="p-4 flex-1 space-y-4">
        {/* Status Badge */}
        <div className="flex justify-between items-start">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${statusColors[item.status] || statusColors.Upcoming}`}>
            {item.status}
          </span>
          {item.is_paid && (
            <span className="text-[10px] font-black text-amber-500 uppercase flex items-center gap-1">
              <Star size={10} fill="currentColor" /> Premium
            </span>
          )}
        </div>

        <div>
          <h5 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-tight">{item.title}</h5>
          <div className="flex items-center gap-1.5 mt-2 text-slate-500 dark:text-slate-400">
            <User size={12} />
            <span className="text-[10px] font-medium uppercase tracking-wide">{item.organizer}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-2 border-t border-slate-50 dark:border-slate-800 pt-3">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            {item.mode === 'Offline' ? <MapPin size={12} /> : <Globe size={12} />}
            <span className="text-[10px] font-medium">{item.mode}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Calendar size={12} />
            <span className="text-[10px] font-medium">{formattedDate}</span>
          </div>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[8px] font-bold uppercase tracking-tighter">
                #{tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-[8px] font-bold text-slate-400 ml-1">+{item.tags.length - 3} more</span>
            )}
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${item.is_paid ? 'text-amber-500' : 'text-green-600 dark:text-green-500'}`}>
              {item.is_paid ? `₹${item.fee}` : 'FREE'}
            </span>
            <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-0.5">
              <Users size={10} />
              <span>{item.max_team_size === 1 ? 'Solo' : `Up to ${item.max_team_size} members`}</span>
            </div>
          </div>
          <div className="text-right">
             <span className={`text-[10px] font-bold ${item.spots_remaining <= 10 ? 'text-amber-500' : 'text-green-600'}`}>
                {item.spots_remaining} spots left
             </span>
             {deadlineDate && (
               <p className="text-[8px] text-slate-400 mt-0.5 leading-none font-medium uppercase tracking-tighter">Closes {deadlineDate}</p>
             )}
          </div>
        </div>

        <button 
          disabled={!item.registration_open || item.spots_remaining === 0}
          className={`w-full py-2.5 rounded-xl font-bold uppercase tracking-widest text-[9px] shadow-sm transition-all flex items-center justify-center gap-2 ${
            !item.registration_open || item.spots_remaining === 0
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
          }`}
        >
          {item.spots_remaining === 0 ? 'Full' : !item.registration_open ? 'Closed' : 'Register Now'}
        </button>
      </div>
    </div>
  );
};

/**
 * 3. StationeryCard Component (Vertical/Compact)
 */
const StationeryCard = ({ item }) => {
  if (!item) return null;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col">
      {/* Cover Image */}
      <div className="h-[120px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative group">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <Package className="text-slate-400" size={32} />
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h5 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 leading-tight">{item.name}</h5>
            <span className="shrink-0 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[8px] font-black uppercase tracking-widest">
              {item.category}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed italic">{item.description}</p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800/50">
          <span className="text-sm font-bold text-green-600 dark:text-green-500">₹{item.price}</span>
          <span className={`text-[9px] font-black uppercase tracking-widest ${item.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {item.stock > 0 ? `In Stock (${item.stock})` : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * 4. Main Router Component
 */
export const UAssistMessage = ({ response }) => {
  if (!response) return null;

  const renderCards = () => {
    switch (response.type) {
      case 'food_cards':
        return (
          <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-none snap-x">
             {response.data?.map((item, idx) => (
                <FoodCard key={idx} item={item} />
             ))}
          </div>
        );
      case 'event_cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
             {response.data?.map((item, idx) => (
                <EventCard key={idx} item={item} />
             ))}
          </div>
        );
      case 'stationery_cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
             {response.data?.map((item, idx) => (
                <StationeryCard key={idx} item={item} />
             ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* BOT BUBBLE */}
      <div className="flex gap-3 mb-2">
         <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <Bot size={18} />
         </div>
         <div className="space-y-1">
            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest ml-1">UAssist Bot</p>
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-2xl rounded-tl-none shadow-sm">
               <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {response.message}
               </p>
            </div>
         </div>
      </div>

      {/* CARDS CONTAINER */}
      <div className="ml-11">
         {renderCards()}
      </div>
    </div>
  );
};

/**
 * 5. DEMO PREVIEW COMPONENT
 */
const UAssistPreview = () => {
  const mockFood = {
    type: "food_cards",
    message: "Here are some mouth-watering vegetarian options under ₹80:",
    data: [
      { name: "Masala Dosa", canteen: "Clockwise", category: "South Indian", price: 75, is_available: true, image_url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=600" },
      { name: "Veg Cheese Sandwich", canteen: "Main Cafe", category: "Snacks", price: 60, is_available: true, image_url: "https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&q=80&w=600" },
      { name: "Paneer Tikka Roll", canteen: "Food Court", category: "Fusion", price: 80, is_available: false, image_url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600" },
      { name: "Vada Pav (2pc)", canteen: "Tapri", category: "Street Food", price: 30, is_available: true, image_url: "https://images.unsplash.com/photo-1606491956689-2ea8c5119c85?auto=format&fit=crop&q=80&w=600" }
    ]
  };

  const mockEvents = {
    type: "event_cards",
    message: "I found 3 exciting events happening on campus this weekend:",
    data: [
      { 
        title: "AI Hackathon 2025: Generation Next", organizer: "Tech Club", mode: "Offline", status: "Upcoming", 
        start_time: "2025-08-10T10:00:00Z", deadline: "2025-08-05T23:59:00Z", is_paid: true, fee: 99.0, 
        max_team_size: 4, spots_remaining: 12, tags: ["hackathon", "AI", "coding"], registration_open: true 
      },
      { 
        title: "Cloud Masters: Professional Workshop", organizer: "AWS Student Chapter", mode: "Online", status: "Ongoing", 
        start_time: "2025-04-12T14:30:00Z", deadline: "2025-04-11T23:59:00Z", is_paid: false, 
        max_team_size: 1, spots_remaining: 5, tags: ["cloud", "devops"], registration_open: true 
      },
      { 
        title: "Campus Cultural Night", organizer: "Arts Council", mode: "Offline", status: "Upcoming", 
        start_time: "2025-09-15T18:00:00Z", deadline: "2025-09-10T23:59:00Z", is_paid: true, fee: 150.0, 
        max_team_size: 2, spots_remaining: 0, tags: ["cultural", "music", "dance"], registration_open: true 
      }
    ]
  };

  const mockStationery = {
    type: "stationery_cards",
    message: "The Campus Store has these essentials ready for pickup:",
    data: [
      { name: "Classmate Notebook", category: "Stationery", price: 45, description: "200 pages, ruled, A4 size with premium finish.", stock: 30, image_url: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=600" },
      { name: "Pilot G2 Blue (0.5mm)", category: "Writing", price: 120, description: "World-class smooth gel ink pen for fatigue-free writing.", stock: 15, image_url: "https://images.unsplash.com/photo-1511376916892-91f86807eb36?auto=format&fit=crop&q=80&w=600" },
      { name: "Graphing Calculator TI-84", category: "Electronics", price: 2450, description: "Advanced graphing for math and science students.", stock: 0, image_url: "https://images.unsplash.com/photo-1574605284833-e18e69acb3a1?auto=format&fit=crop&q=80&w=600" }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-24">
        
        {/* Render Sections */}
        <section className="space-y-4">
          <div className="px-4 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit mx-auto mb-10">Scenario 1: Food Discovery</div>
          <UAssistMessage response={mockFood} />
        </section>

        <section className="space-y-4">
          <div className="px-4 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit mx-auto mb-10">Scenario 2: Event Search</div>
          <UAssistMessage response={mockEvents} />
        </section>

        <section className="space-y-4">
          <div className="px-4 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit mx-auto mb-10">Scenario 3: Stationery Shop</div>
          <UAssistMessage response={mockStationery} />
        </section>

      </div>
    </div>
  );
};

export default UAssistPreview;
