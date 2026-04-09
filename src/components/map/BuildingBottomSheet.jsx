import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Users, 
  Zap, 
  AlertTriangle, 
  Wifi, 
  CheckCircle2,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { ROOMS } from '@/data/mapData';

export default function BuildingBottomSheet({ building, onClose }) {
  const [selectedFloor, setSelectedFloor] = useState(building.floors[0]);
  const buildingRooms = ROOMS[building.id] || [];
  const filteredRooms = buildingRooms.filter(r => r.floor === selectedFloor);

  if (!building) return null;

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-x-0 bottom-0 z-[100] h-[80vh] bg-white dark:bg-slate-900 rounded-t-[50px] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
    >
      {/* DRAG HANDLE */}
      <div className="h-1 w-12 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto my-4 shrink-0" />

      {/* HEADER SECTION (ZONE 1) */}
      <div className="relative h-64 shrink-0 overflow-hidden">
        <img src={building.image} className="w-full h-full object-cover" alt={building.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent p-10 flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-amber-500 font-black text-[10px] uppercase tracking-[0.3em]">{building.shortCode} • {building.accessLevel}</p>
            <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none">{building.name}</h2>
            <div className="flex items-center gap-6 mt-2">
              <span className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-widest"><Users size={14} className="text-blue-500" /> {building.occupancy} Occupied</span>
              <span className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-widest"><MapPin size={14} className="text-green-500" /> {building.floors.length} Floors</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white transition-all hover:text-slate-900"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* CONTENT REGION (ZONE 2 & 3) */}
      <div className="flex-1 flex overflow-hidden">
        {/* FLOOR SELECTOR (ZONE 2) */}
        <div className="w-20 md:w-24 border-r border-slate-100 dark:border-white/5 flex flex-col items-center py-8 gap-4 overflow-y-auto scrollbar-none">
          {building.floors.map(floor => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
                selectedFloor === floor 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 scale-110' 
                  : 'bg-slate-100 dark:bg-white/5 text-slate-400'
              }`}
            >
              {floor}
            </button>
          ))}
        </div>

        {/* ROOM GRID (ZONE 3) */}
        <div className="flex-1 p-8 md:p-10 overflow-y-auto custom-scrollbar">
          <div className="mb-10 flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Rooms on {selectedFloor}</h3>
            <div className="flex gap-2">
               {building.facilities.map(f => (
                 <span key={f} className="px-3 py-1 bg-blue-50 dark:bg-blue-600/10 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{f}</span>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="wait">
              {filteredRooms.map((room, idx) => (
                <motion.div 
                  key={room.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-slate-50 dark:bg-white/5 rounded-[35px] p-6 border-2 border-transparent hover:border-blue-600 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-xs font-black text-slate-900 dark:text-white">{room.id}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      room.status === 'Available' ? 'bg-green-100 text-green-600' : 
                      room.status === 'Occupied' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {room.status}
                    </div>
                  </div>

                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">{room.name}</h4>
                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                    <span className="flex items-center gap-1.5"><Users size={12} /> {room.capacity} seats</span>
                    {room.amenities.includes('WiFi') && <span className="flex items-center gap-1.5"><Wifi size={12} /> High Speed</span>}
                  </div>

                  <div className="space-y-3">
                    {room.bookedBy && (
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Happening Now</p>
                        <p className="font-bold text-slate-900 dark:text-white italic">{room.bookedBy}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                       <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all">
                         <Maximize2 size={12} /> View Details
                       </button>
                       <button className="px-4 py-3 bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white rounded-xl hover:bg-red-500 hover:text-white transition-all">
                         <AlertTriangle size={14} />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
