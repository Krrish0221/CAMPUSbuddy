import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ThumbsUp, 
  MessageSquare, 
  ShieldAlert,
  ChevronRight,
  Maximize2,
  RefreshCcw,
  Star
} from 'lucide-react';
import { useProblemBox } from '@/context/ProblemBoxContext';

export default function StudentTicketTracker({ ticket }) {
  const { upvoteTicket, reopenTicket } = useProblemBox();

  if (!ticket) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
           <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">{ticket.title}</h3>
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <Clock size={14} className="text-blue-500" /> {ticket.location} • {ticket.id}
           </p>
         </div>
         <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
           ticket.priority === 'Critical' ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' :
           ticket.priority === 'High' ? 'bg-orange-500/10 border-orange-500 text-orange-500' :
           'bg-blue-500/10 border-blue-500 text-blue-500'
         }`}>
           {ticket.priority}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* TIMELINE SECTION */}
        <div className="lg:col-span-1 space-y-6">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2">Tracking History</h4>
           <div className="relative pl-8 space-y-10">
             {/* Vertical Line */}
             <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-white/5" />
             
             {ticket.timeline.map((step, idx) => (
               <div key={idx} className="relative">
                 <div className={`absolute -left-8 top-1 w-8 h-8 rounded-full flex items-center justify-center border-4 ${
                   step.completed 
                    ? 'bg-blue-600 border-white dark:border-slate-900 text-white shadow-lg shadow-blue-500/20' 
                    : step.active 
                    ? 'bg-white dark:bg-slate-900 border-blue-600 text-blue-600'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-300'
                 }`}>
                   {step.completed ? <CheckCircle2 size={16} /> : <Circle size={8} fill="currentColor" />}
                 </div>
                 <div className="space-y-0.5">
                   <p className={`text-xs font-black uppercase tracking-widest ${step.active ? 'text-blue-600' : 'text-slate-400'}`}>{step.step}</p>
                   <p className="text-[10px] font-bold text-slate-500">{step.time}</p>
                 </div>
               </div>
             ))}
           </div>

           {ticket.status === 'Assigned' && (
             <div className="mt-8 p-6 bg-blue-600 rounded-[30px] text-white shadow-2xl shadow-blue-600/20">
                <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Live ETA</p>
                <h4 className="text-3xl font-black italic uppercase tracking-tighter">{ticket.eta}</h4>
             </div>
           )}
        </div>

        {/* DETAILS SECTION */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[40px] border-l-8 border-blue-500 shadow-2xl space-y-4">
             <div className="flex items-center gap-3">
               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white ${ticket.officialResponse ? 'bg-amber-500' : 'bg-blue-500'}`}>
                 <MessageSquare size={20} />
               </div>
               <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic">
                 {ticket.officialResponse ? '📣 Official Response' : '🤖 UAssist Summary'}
               </h3>
             </div>
             <p className={`text-sm font-bold leading-relaxed italic ${ticket.officialResponse ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
               &quot;{ticket.officialResponse || ticket.aiSummary}&quot;
             </p>
           </div>

           {/* MEDIA SECTION */}
           <div className="space-y-4">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted Media</h4>
             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
               {ticket.media.length > 0 ? ticket.media.map((img, i) => (
                 <div key={i} className="flex-shrink-0 w-48 h-32 rounded-3xl overflow-hidden border-2 border-white/10 group cursor-pointer">
                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Evidence" />
                 </div>
               )) : (
                 <div className="w-full h-32 bg-slate-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 text-[10px] font-black uppercase tracking-widest">No Media Attached</div>
               )}
             </div>
           </div>

           {/* UPVOTE SECTION */}
           <div className="p-8 bg-slate-900 rounded-[40px] text-white flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-500">
                 <ThumbsUp size={24} fill="currentColor" />
               </div>
               <div>
                 <p className="text-2xl font-black tracking-tighter italic uppercase">{ticket.upvotes} students</p>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Have this issue too</p>
               </div>
             </div>
             <button 
                onClick={(e) => { e.stopPropagation(); upvoteTicket(ticket.id); }}
                disabled={ticket.hasUpvoted}
                className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  ticket.hasUpvoted 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
                  : 'bg-blue-600 text-white hover:bg-slate-800 hover:shadow-xl hover:shadow-blue-600/30'
                }`}
              >
                {ticket.hasUpvoted ? '✓ Upvoted' : '+ I have this too'}
              </button>
           </div>

           {/* RESOLUTION BOX */}
           {ticket.status === 'Resolved' && (
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-green-500/10 p-10 rounded-[50px] border-4 border-green-500/30 text-center space-y-6"
             >
               <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl shadow-green-500/50">
                 <CheckCircle2 size={40} />
               </div>
               <div className="space-y-2">
                 <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Fixed by {ticket.resolution?.solvedBy || 'HQ Team'}</h4>
                 <p className="text-sm font-bold text-slate-500 italic">&quot;{ticket.resolution?.desc || 'The issue has been resolved.'}&quot;</p>
                 <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Resolved in: {ticket.resolution?.duration || 'Unknown'}</p>
               </div>
               
               <div className="flex flex-col items-center gap-4 pt-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate this resolution</p>
                 <div className="flex gap-2 text-amber-500">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={24} fill="currentColor" />)}
                 </div>
               </div>

               <div className="pt-8 border-t border-green-500/20 flex gap-4">
                 <button 
                    onClick={(e) => { e.stopPropagation(); reopenTicket(ticket.id); }}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
                  >
                    <RefreshCcw size={14} /> Reopen Issue
                  </button>
               </div>
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}
