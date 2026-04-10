import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Users, 
  Coffee, 
  Ticket, 
  AlertTriangle,
  TrendingUp,
  Megaphone,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useProblemBox } from '@/context/ProblemBoxContext';
import { useCaffinity } from '@/context/CaffinityContext';
import { useArena } from '@/context/ArenaContext';
import { useUAssist } from '@/context/UAssistContext';

export default function AdminDashboardPage() {
  const [announcement, setAnnouncement] = useState('');
  
  const { tickets } = useProblemBox();
  const { orders } = useCaffinity();
  const { registrations } = useArena();
  const { sendGlobalBroadcast } = useUAssist();

  const handleBroadcast = () => {
    if (!announcement.trim()) return;
    sendGlobalBroadcast(announcement);
    setAnnouncement('');
  };
  
  const STATS = [
    { label: 'Active Issues', value: tickets.filter(t => t.status !== 'Resolved').length, increase: '+2', icon: AlertTriangle, color: 'text-red-600 dark:text-red-500', hover: 'hover:border-red-500/50', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-100 dark:border-red-500/20' },
    { label: 'Canteen Orders', value: orders.length, increase: '+45', icon: Coffee, color: 'text-amber-600 dark:text-amber-500', hover: 'hover:border-amber-500/50', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-100 dark:border-amber-500/20' },
    { label: 'Event Registrations', value: registrations.length, increase: '+120', icon: Ticket, color: 'text-pink-600 dark:text-pink-500', hover: 'hover:border-pink-500/50', bg: 'bg-pink-50 dark:bg-pink-500/10', border: 'border-pink-100 dark:border-pink-500/20' },
    { label: 'Total Students', value: '10.4k', increase: '+12', icon: Users, color: 'text-indigo-600 dark:text-indigo-500', hover: 'hover:border-indigo-500/50', bg: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-100 dark:border-indigo-500/20' },
  ];

  const RECENT_ACTIVITY = [
    { id: 1, type: 'Issue', text: 'Critical Ticket #3092 raised in Lab 4', time: '2 mins ago', color: 'text-red-600 dark:text-red-500' },
    { id: 2, type: 'Order', text: 'Surge pricing triggered at Main Cafe', time: '15 mins ago', color: 'text-amber-600 dark:text-amber-500' },
    { id: 3, type: 'Event', text: 'Hackathon reached 90% capacity', time: '1 hour ago', color: 'text-pink-600 dark:text-pink-500' },
    { id: 4, type: 'User', text: '50 new student accounts provisioned', time: '3 hours ago', color: 'text-indigo-600 dark:text-indigo-500' },
  ];

  return (
    <AdminLayout 
      title="HQ Dashboard" 
      subtitle="System Overview & Intelligence"
    >
      <div className="space-y-10 pb-20">
        
        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label} 
              className={`p-8 bg-white dark:bg-slate-900 rounded-[35px] border border-slate-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl flex flex-col justify-between h-48 relative overflow-hidden group hover:scale-[1.02] transition-all`}
            >
               <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 group-hover:scale-110 transition-transform duration-500">
                 <stat.icon size={80} className={stat.color} />
               </div>
               <div className="relative z-10 flex items-center justify-between">
                 <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>
                    <stat.icon size={24} />
                 </div>
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-full text-[10px] font-black text-green-600 dark:text-green-400 border border-slate-100 dark:border-transparent">
                    <TrendingUp size={12} /> {stat.increase}
                 </div>
               </div>
               <div className="relative z-10 space-y-1">
                 <h4 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter drop-shadow-sm">{stat.value}</h4>
                 <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
               </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* PUSH NOTIFICATIONS (2/3 width) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[45px] p-10 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[60px]" />
             
             <div className="space-y-4 mb-8 relative z-10">
               <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white shadow-lg">
                 <Megaphone size={24} />
               </div>
               <div>
                 <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Global Broadcast</h3>
                 <p className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] mt-1">Push notices to all 10.4k active students</p>
               </div>
             </div>

             <div className="space-y-4 relative z-10">
               <textarea 
                 value={announcement}
                 onChange={(e) => setAnnouncement(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleBroadcast();
                   }
                 }}
                 placeholder="Type an urgent campus announcement..." 
                 className="w-full px-8 py-6 bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 focus:border-white/50 rounded-[30px] font-bold text-white placeholder:text-white/60 focus:outline-none transition-all resize-none shadow-inner"
                 rows={3}
               />
               <button 
                 onClick={handleBroadcast}
                 className="px-8 py-4 bg-white text-indigo-900 rounded-full font-black uppercase text-sm tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/20 flex items-center gap-3"
               >
                 Send Broadcast <ArrowRight size={18} />
               </button>
             </div>
          </div>

          {/* PULSE FEED (1/3 width) */}
          <div className="bg-white dark:bg-slate-900 rounded-[45px] p-8 border border-slate-100 dark:border-white/5 shadow-xl dark:shadow-2xl flex flex-col">
             <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/5 mb-6 shrink-0">
               <h3 className="text-xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Pulse Feed</h3>
               <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse" />
             </div>
             <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
               {RECENT_ACTIVITY.map(act => (
                 <div key={act.id} className="flex gap-4 group">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ring-2 ${act.color.replace('text-', 'ring-')} z-10 bg-slate-100 dark:bg-slate-800`} />
                      <div className="w-0.5 h-full bg-slate-100 dark:bg-white/5 absolute top-3 group-last:hidden" />
                    </div>
                    <div className="flex-1 pb-6 space-y-1">
                      <p className={`text-[9px] font-black uppercase tracking-widest ${act.color}`}>{act.type}</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white/90 leading-snug">{act.text}</p>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">{act.time}</p>
                    </div>
                 </div>
               ))}
             </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
