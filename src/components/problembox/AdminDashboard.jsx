import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  Users, 
  ArrowRight,
  Filter,
  BarChart3,
  Search,
  CheckCircle2,
  AlertTriangle,
  Move
} from 'lucide-react';
import { useProblemBox } from '@/context/ProblemBoxContext';
import { DEPARTMENTS, ANALYTICS_DATA } from '@/data/problemData';

export default function AdminDashboard() {
  const { tickets, updateTicketStatus, hasNewCriticalAlert, dismissAlert } = useProblemBox();
  const [activePriorityFilter, setActivePriorityFilter] = useState('All');

  const COLUMNS = [
    { id: 'Raised', label: 'New Tickets', color: 'blue' },
    { id: 'Triaged', label: 'Triage Done', color: 'purple' },
    { id: 'InProgress', label: 'In Work', color: 'orange' },
    { id: 'Resolved', label: 'Closed', color: 'green' }
  ];

  const getTicketsByStatus = (status) => tickets.filter(t => t.status === status);

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      {/* CRITICAL ALERT BANNER */}
      <AnimatePresence>
        {hasNewCriticalAlert && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-600 overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.5)] cursor-pointer"
            onClick={dismissAlert}
          >
            <div className="p-4 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-6">
                <ShieldAlert className="text-white" size={32} />
                <div className="text-white">
                  <h4 className="font-black uppercase tracking-widest text-sm">⚠️ CRITICAL ALERT: AUTO-ESCALATED</h4>
                  <p className="text-[10px] font-black opacity-80 uppercase tracking-[0.2em]">New ticket mentions "core switch failure" / "flooding" — response required immediately.</p>
                </div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-xl text-white font-black text-[10px] uppercase tracking-widest">View Ticket →</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT PANEL: LIVE QUEUE STATS */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-white/5 space-y-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Live Queue</h3>
                <Filter size={18} className="text-slate-400" />
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Critical', count: tickets.filter(t => t.priority === 'Critical').length, color: 'bg-red-500' },
                  { label: 'High', count: tickets.filter(t => t.priority === 'High').length, color: 'bg-orange-500' },
                  { label: 'Medium', count: tickets.filter(t => t.priority === 'Medium').length, color: 'bg-blue-500' },
                  { label: 'Low', count: tickets.filter(t => t.priority === 'Low').length, color: 'bg-slate-500' }
                ].map(p => (
                  <button 
                    key={p.label}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl group hover:bg-slate-900 hover:text-white transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${p.color}`} />
                      <span className="text-xs font-black uppercase tracking-widest">{p.label}</span>
                    </div>
                    <span className="font-syne font-black text-lg">{p.count}</span>
                  </button>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-white/5 space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Progress</p>
                 <div className="flex items-center gap-3">
                   <div className="flex-1 h-3 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-600 rounded-full" style={{ width: '65%' }} />
                   </div>
                   <span className="text-xs font-black">65%</span>
                 </div>
              </div>
           </div>

           {/* ANALYTICS PREVIEW */}
           <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-6 shadow-2xl shadow-slate-900/40">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 italic">
                <BarChart3 size={14} /> Analytics Hub
              </h4>
              <div className="space-y-2">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">Avg. Resolution</p>
                <p className="text-3xl font-black italic tracking-tighter uppercase">{ANALYTICS_DATA.averageResolutionTime}</p>
              </div>
              <div className="pt-4 border-t border-white/5 space-y-4">
                 {ANALYTICS_DATA.departmentPerformance.map(d => (
                   <div key={d.name} className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-slate-400">{d.name}</span>
                     <span className="text-[10px] font-black text-blue-500">{d.score} / 5</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* MAIN KANBAN BOARD */}
        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {COLUMNS.map(col => (
              <div key={col.id} className="space-y-6">
                <div className="flex items-center justify-between px-4">
                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] text-[10px]">
                    {col.label} <span className="text-blue-600 ml-2">{getTicketsByStatus(col.id).length}</span>
                  </h4>
                  <div className={`w-2 h-2 rounded-full bg-${col.color}-500`} />
                </div>

                <div className="space-y-4 min-h-[500px] bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[45px] border-2 border-dashed border-slate-100 dark:border-white/5">
                  {getTicketsByStatus(col.id).map(ticket => (
                    <motion.div 
                      key={ticket.id}
                      layoutId={ticket.id}
                      className="bg-white dark:bg-slate-900 p-6 rounded-[35px] shadow-xl border-2 border-transparent hover:border-blue-600 cursor-pointer group space-y-4 transition-all"
                    >
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-black text-slate-400 tracking-widest">#{ticket.id}</span>
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                           ticket.priority === 'Critical' ? 'bg-red-500' : 
                           ticket.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'
                         }`}>
                           <ShieldAlert size={14} />
                         </div>
                      </div>

                      <div className="space-y-1">
                        <h5 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight italic leading-tight">{ticket.title}</h5>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{ticket.location}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-white/5">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-[8px] font-black">
                             {ticket.upvotes}
                           </div>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Upvotes</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {col.id !== 'Resolved' && (
                          <button 
                            onClick={() => {
                              const nextStatus = col.id === 'Raised' ? 'Triaged' : col.id === 'Triaged' ? 'InProgress' : 'Resolved';
                              updateTicketStatus(ticket.id, nextStatus);
                            }}
                            className="w-full py-3 bg-slate-900 text-white rounded-2xl text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1 hover:bg-blue-600 transition-all"
                          >
                             Next Step <ArrowRight size={10} />
                          </button>
                        )}
                        <button className="w-full py-3 bg-slate-50 dark:bg-white/10 text-slate-900 dark:text-white rounded-2xl text-[8px] font-black uppercase tracking-widest">View Full</button>
                      </div>
                    </motion.div>
                  ))}

                  {getTicketsByStatus(col.id).length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center py-20 text-slate-300 dark:text-white/10 opacity-50">
                      <CheckCircle2 size={48} strokeWidth={1} className="mb-2" />
                      <p className="text-[9px] font-black uppercase tracking-widest">All Clear</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
