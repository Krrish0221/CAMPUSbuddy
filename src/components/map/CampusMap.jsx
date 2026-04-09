import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  Zap, 
  Coffee, 
  AlertTriangle,
  Move
} from 'lucide-react';

const PIN_ICONS = {
  cafeteria: <Coffee size={16} />,
  event: <Zap size={16} />,
  shop: <Coffee size={16} />,
  problem: <AlertTriangle size={16} />,
  building: <MapPin size={16} />
};

const PULSE_COLORS = {
  red: 'bg-red-500 shadow-red-500/50',
  orange: 'bg-orange-500 shadow-orange-500/50',
  blue: 'bg-blue-500 shadow-blue-500/50',
  green: 'bg-green-500 shadow-green-500/50'
};

export default function CampusMap({ 
  buildings, 
  markers, 
  friends, 
  onBuildingClick,
  activeLayer = 'all' 
}) {
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 1000, h: 2000 });
  const [hoveredBuilding, setHoveredBuilding] = useState(null);

  // Simple 3D Extrusion Logic
  // We draw the bottom footprint slightly offset from the top
  const renderBuilding = (b) => {
    const isActive = hoveredBuilding === b.id;
    // Helper to shift path for 3D effect
    const shiftPath = (path, dx, dy) => {
      // Very crude path shifter - in a real app we'd use SVG transformation
      return path; 
    };

    return (
      <g 
        key={b.id} 
        className="cursor-pointer"
        onMouseEnter={() => setHoveredBuilding(b.id)}
        onMouseLeave={() => setHoveredBuilding(null)}
        onClick={() => onBuildingClick(b)}
      >
        {/* Footprint (Bottom) - Darker */}
        <path 
          d={b.shape} 
          fill="#1e293b" 
          stroke="#334155" 
          strokeWidth="2"
          transform="translate(10, 10)" 
        />
        {/* Connecting Walls (Shadow) */}
        <path 
          d={b.shape} 
          fill="#0f172a" 
          opacity="0.5" 
          transform="translate(5, 5)"
        />
        {/* Top Surface - Neon Blue Outline */}
        <motion.path 
          d={b.shape} 
          fill={isActive ? '#334155' : '#1e293b'}
          stroke={isActive ? '#3b82f6' : '#1e40af'}
          strokeWidth="3"
          className="transition-colors duration-300"
          animate={{
            filter: isActive ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' : 'none'
          }}
        />
        {/* Short Code Label */}
        <text
          x={b.coordinates.x}
          y={b.coordinates.y}
          textAnchor="middle"
          className="text-[12px] font-black fill-slate-500 pointer-events-none uppercase tracking-tighter"
        >
          {b.shortCode}
        </text>
      </g>
    );
  };

  return (
    <div className="relative w-full h-full bg-[#020617] overflow-hidden rounded-[40px] border border-white/5 shadow-2xl">
      {/* MAP SVG */}
      <svg 
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className="w-full h-full"
      >
        {/* Grid Background */}
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Roads Layer */}
        <g opacity="0.1">
          <path d="M 800 0 V 2000" stroke="white" strokeWidth="60" fill="none" />
          <path d="M 0 600 H 1000" stroke="white" strokeWidth="40" fill="none" />
          <path d="M 0 1100 H 1000" stroke="white" strokeWidth="50" fill="none" />
        </g>

        {/* Campus Labels */}
        <text x="50" y="50" className="text-2xl font-black fill-white/10 italic">MAIN CAMPUS</text>
        <text x="50" y="1150" className="text-2xl font-black fill-white/10 italic">EXTENDED CAMPUS</text>

        {/* Buildings Layer */}
        {buildings.map(renderBuilding)}

        {/* Markers Layer (HTML Overlay for Pins) */}
      </svg>

      {/* PINS OVERLAY (Absolute positioned divs for 3D pulses) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          transform: `translate(${-viewBox.x}px, ${-viewBox.y}px)`,
          width: '1000px',
          height: '2000px'
        }}
      >
        {markers.map(m => (
          <div 
            key={m.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
            style={{ left: m.coordinates.x, top: m.coordinates.y }}
          >
            {/* Pulse */}
            <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${PULSE_COLORS[m.pulseColor]}`} />
            
            {/* Pin Body */}
            <motion.div 
              whileHover={{ scale: 1.2 }}
              className={`relative h-8 w-8 rounded-xl flex items-center justify-center text-white border-2 border-white/20 shadow-2xl ${PULSE_COLORS[m.pulseColor]}`}
            >
              {PIN_ICONS[m.type]}
            </motion.div>

            {/* Label */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-900 border border-white/10 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <p className="text-[10px] font-black text-white uppercase tracking-widest">{m.name}</p>
            </div>
          </div>
        ))}

        {/* Friends Layer */}
        {activeLayer === 'friends' && friends.map(f => (
          <div 
            key={f.studentId}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
            style={{ left: f.coordinates.x, top: f.coordinates.y }}
          >
            <motion.div 
              whileHover={{ scale: 1.2 }}
              className="relative group"
            >
              {/* Avatar Circle */}
              <div className="h-10 w-10 rounded-full border-4 border-[#020617] overflow-hidden shadow-2xl ring-2 ring-purple-500">
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                  <span className="text-white text-xs font-black">{f.name[0]}</span>
                </div>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-indigo-600 text-white px-3 py-1 rounded-full whitespace-nowrap opacity-100 flex items-center gap-2 shadow-xl">
                 <p className="text-[9px] font-black uppercase tracking-widest">{f.name}</p>
                 <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* SCALE/ZOOM CONTROLS */}
      <div className="absolute bottom-10 left-10 flex flex-col gap-2">
        <button className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-all"><Move size={20} /></button>
      </div>

      {/* WATERMARK */}
      <div className="absolute bottom-6 right-10 pointer-events-none">
        <p className="text-[10px] font-black text-white/5 uppercase tracking-[0.5em] italic">KARNAVATI CAMPUS MAP ENGINE v1.0</p>
      </div>
    </div>
  );
}
