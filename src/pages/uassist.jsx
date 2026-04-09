import React from 'react';
import { motion } from 'framer-motion';
import ModuleLayout from '@/components/ModuleLayout';
import { 
  Zap, 
  Search, 
  MapPin, 
  Coffee, 
  AlertTriangle, 
  ChevronRight, 
  Clock,
  LayoutGrid,
  TrendingUp,
  History,
  ShieldCheck,
  Compass,
  Utensils
} from 'lucide-react';
import { useUAssist } from '@/context/UAssistContext';
import { useRouter } from 'next/router';

export default function UAssistPage() {
  const { 
    setIsOpen, 
    setPrefillText, 
    queryCount, 
    queryLimit, 
    isPremium 
  } = useUAssist();
  const router = useRouter();

  const handleSuggest = (text) => {
    setPrefillText(text);
    setIsOpen(true);
  };

  return (
    <ModuleLayout 
      title="UAssist" 
      subtitle="AI campus assistant" 
      color="#4f46e5"
      hideHeader={true}
      isDark={true}
    >
      <div className="bg-[#0f0f12] p-8 md:p-12 min-h-screen rounded-[40px] flex flex-col items-center space-y-16 overflow-hidden relative shadow-2xl border border-white/5">
        
        {/* ANIMATED BACKGROUND GLOWS */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />

        {/* 1. ANIMATED UA ICON WITH RADIAL GLOW */}
        <div className="flex flex-col items-center text-center space-y-8 pt-16 relative z-10 w-full">
          {/* Radial Glow Layer */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-indigo-600/20 via-transparent to-transparent blur-[100px] pointer-events-none" />
          
          <div className="relative group">
            {/* Rotating Glow Ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 border-2 border-dashed border-indigo-500/20 rounded-full"
            />
            
            {/* Breathing Icon Container */}
            <motion.div 
              animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 30px rgba(79, 70, 229, 0.3)", "0 0 60px rgba(79, 70, 229, 0.6)", "0 0 30px rgba(79, 70, 229, 0.3)"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-28 h-28 bg-indigo-600 rounded-[40px] flex items-center justify-center text-white shadow-2xl relative z-10"
            >
              <span className="text-4xl font-black italic">UA</span>
            </motion.div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">UAssist is ready</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[11px]">Your campus copilot is online</p>
          </div>
        </div>

        {/* 2. LIVE CAMPUS SNAPSHOT STRIP */}
        <div className="w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-3 space-y-1 shadow-2xl">
          <SnapshotRow 
            icon={<Coffee size={16} className="text-green-500" />} 
            label="Cafeteria" 
            status="🟢 Low Queue" 
            onClick={() => router.push('/caffinity')}
          />
          <SnapshotRow 
            icon={<Zap size={16} className="text-amber-500" />} 
            label="CodePulse" 
            status="Starts in 2h" 
            onClick={() => router.push('/arena')}
          />
          <SnapshotRow 
            icon={<AlertTriangle size={16} className="text-red-500" />} 
            label="Active Issues" 
            status="🔴 1 unresolved" 
            onClick={() => router.push('/problembox')}
          />
        </div>

        {/* 3. SUGGESTED QUESTIONS SECTION */}
        <div className="w-full max-w-4xl space-y-8">
           <div className="flex items-center gap-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Try Asking</p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SuggestCard 
                text="Where is the AI Lab?" 
                trigger="Where is the AI Lab?" 
                onSelect={handleSuggest} 
              />
              <SuggestCard 
                text="Is the cafeteria busy?" 
                trigger="Is the cafeteria busy now?" 
                onSelect={handleSuggest} 
              />
              <SuggestCard 
                text="Any hackathons this weekend?" 
                trigger="Are there any hackathons this weekend?" 
                onSelect={handleSuggest} 
              />
              <SuggestCard 
                text="Report AC issue in Lab 4" 
                trigger="Report AC issue in Lab 4" 
                onSelect={handleSuggest} 
              />
           </div>
        </div>

        {/* 4. QUERY COUNTER */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-500/60">Free Plan</span>
            <span className="text-indigo-400">{queryCount}/{queryLimit} queries used today</span>
            <button className="text-amber-500 hover:text-white transition-colors">✦ Upgrade to Prime</button>
          </div>
          <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${(queryCount/queryLimit)*100}%` }}
               className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
             />
          </div>
        </div>

        {/* 5. RECENT ACTIVITY SECTION (Improved Visibility) */}
        <div className="w-full max-w-2xl space-y-6">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Recent Activity</p>
           
           <div className="space-y-4">
              <ActivityItem 
                icon={<Compass size={14} className="text-blue-500" />} 
                title="AI Lab Discovery" 
                time="2h ago" 
              />
              <ActivityItem 
                icon={<Utensils size={14} className="text-green-500" />} 
                title="Ordered Cold Brew" 
                time="Yesterday" 
              />
              <ActivityItem 
                icon={<ShieldCheck size={14} className="text-red-500" />} 
                title="Reported AC Failure" 
                time="2 days ago" 
              />
           </div>
        </div>

        {/* 6. BRANDED FOOTER */}
        <div className="pt-20 pb-4 text-center space-y-2 opacity-30">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Powered by Campus Buddy AI</p>
           <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">© 2026 KU Smart Ecosystem v1.0.4</p>
        </div>
      </div>
    </ModuleLayout>
  );
}

function SnapshotRow({ icon, label, status, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-5 hover:bg-white/5 rounded-3xl cursor-pointer transition-all group"
    >
      <div className="flex items-center gap-5">
        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-all">
          {icon}
        </div>
        <p className="text-sm font-black text-slate-200 uppercase tracking-wider">{label}</p>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-[11px] font-bold text-slate-400 group-hover:text-white transition-colors">{status}</p>
        <ChevronRight size={16} className="text-slate-700 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, time }) {
  return (
    <div className="flex justify-between items-center px-8 py-2 rounded-2xl hover:bg-white/[0.02] transition-colors">
       <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
             {icon}
          </div>
          <p className="text-xs font-bold text-slate-300">{title}</p>
       </div>
       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{time}</p>
    </div>
  );
}

function SuggestCard({ text, trigger, onSelect }) {
  return (
    <button 
      onClick={() => onSelect(trigger)}
      className="text-left p-6 bg-white/[0.03] border border-white/5 rounded-[30px] hover:bg-white/[0.08] hover:border-white/20 transition-all group relative overflow-hidden"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
          <Search size={16} />
        </div>
        <p className="text-xs font-bold text-slate-200 transition-colors group-hover:text-white">{text}</p>
      </div>
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
         <Zap size={16} className="text-indigo-500" />
      </div>
    </button>
  );
}
