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
  Trash2,
  Image as ImageIcon,
  MessageSquare,
  X
} from 'lucide-react';
import { useProblemBox } from '@/context/ProblemBoxContext';
import { DEPARTMENTS, ANALYTICS_DATA } from '@/data/problemData';

export default function AdminDashboard() {
  const { tickets, updateTicketStatus, addAdminResponse, hasNewCriticalAlert, dismissAlert } = useProblemBox();
  const [activePriorityFilter, setActivePriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Urgent'); // 'Urgent', 'Newest', 'Upvotes'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolvingTicketId, setResolvingTicketId] = useState(null);

  const COLUMNS = [
    { id: 'Raised', label: 'New Tickets', color: 'blue' },
    { id: 'Triaged', label: 'Triage Done', color: 'purple' },
    { id: 'InProgress', label: 'In Work', color: 'orange' },
    { id: 'Resolved', label: 'Closed', color: 'green' }
  ];

  const getTicketsByStatus = (status) => {
    let filtered = tickets.filter(t => t.status === status);
    
    if (activePriorityFilter !== 'All') {
      filtered = filtered.filter(t => t.priority === activePriorityFilter);
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'Urgent') {
        const pOrder = { 'Critical': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
        return pOrder[b.priority] - pOrder[a.priority];
      }
      if (sortBy === 'Upvotes') return b.upvotes - a.upvotes;
      return 0; // Maintain insertion order for 'Newest' mockup
    });
  };

  const handleSaveNote = () => {
    if (adminNote.trim() && selectedTicket) {
      addAdminResponse(selectedTicket.id, adminNote);
    }
    setSelectedTicket(null);
    setAdminNote('');
  };

  const handleAdvance = (ticket, nextStatus) => {
    if (nextStatus === 'Resolved') {
      setResolvingTicketId(ticket.id);
      setShowResolveModal(true);
    } else {
      updateTicketStatus(ticket.id, nextStatus);
    }
  };

  const submitResolution = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const resolutionData = {
      resolution: {
        solvedBy: formData.get('solvedBy'),
        desc: formData.get('desc'),
        duration: formData.get('duration')
      }
    };
    updateTicketStatus(resolvingTicketId, 'Resolved', resolutionData);
    setShowResolveModal(false);
    setResolvingTicketId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 relative">
      {/* CRITICAL ALERT BANNER */}
      <AnimatePresence>
        {hasNewCriticalAlert && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-600 overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.5)] cursor-pointer rounded-[30px] mb-8"
            onClick={dismissAlert}
          >
            <div className="p-6 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-6">
                <ShieldAlert className="text-white" size={32} />
                <div className="text-white">
                  <h4 className="font-black uppercase tracking-widest text-sm">⚠️ CRITICAL ALERT: AUTO-ESCALATED</h4>
                  <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mt-1">Immediate response required across core systems.</p>
                </div>
              </div>
              <div className="bg-white/20 px-6 py-3 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest">Acknowledge</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* LEFT PANEL: LIVE QUEUE STATS */}
        <div className="w-full xl:w-80 shrink-0 space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-[45px] p-8 border border-slate-100 dark:border-white/5 space-y-8 shadow-xl dark:shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Filter Config</h3>
                <Filter size={18} className="text-slate-400" />
              </div>
              
              <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Priority Sort</p>
                 <select 
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value)}
                   className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest outline-none focus:border-blue-500 appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-white/20 transition-colors"
                 >
                   <option value="Urgent">Most Urgent</option>
                   <option value="Newest">Newest First</option>
                   <option value="Upvotes">Most Upvoted</option>
                 </select>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Issue Level</p>
                {['All', 'Critical', 'High', 'Medium', 'Low'].map(p => {
                  const colors = { 'All': 'bg-slate-900 dark:bg-white', 'Critical': 'bg-red-500', 'High': 'bg-orange-500', 'Medium': 'bg-blue-500', 'Low': 'bg-slate-500' };
                  return (
                  <button 
                    key={p}
                    onClick={() => setActivePriorityFilter(p)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                      activePriorityFilter === p ? 'bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-inner border border-slate-200 dark:border-white/10' : 'bg-transparent hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${colors[p]}`} />
                      <span className={`text-[11px] font-black uppercase tracking-widest ${activePriorityFilter === p ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{p}</span>
                    </div>
                  </button>
                )})}
              </div>
           </div>
        </div>

        {/* MAIN KANBAN BOARD */}
        <div className="flex-1 min-w-0 flex gap-6 overflow-x-auto pb-8 custom-scrollbar">
            {COLUMNS.map(col => (
              <div key={col.id} className="w-[320px] shrink-0 space-y-6">
                <div className="flex items-center justify-between px-4">
                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] text-[10px]">
                    {col.label} <span className="text-slate-500 ml-2">{getTicketsByStatus(col.id).length}</span>
                  </h4>
                  <div className={`w-2 h-2 rounded-full bg-${col.color}-500`} />
                </div>

                <div className="space-y-4 min-h-[600px] bg-slate-100/50 dark:bg-slate-900/50 p-3 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-white/5">
                  {getTicketsByStatus(col.id).map(ticket => (
                    <motion.div 
                      key={ticket.id}
                      layoutId={ticket.id}
                      className="bg-white dark:bg-slate-900 p-6 rounded-[30px] shadow-sm dark:shadow-2xl border border-slate-100 dark:border-white/5 hover:border-blue-500/50 cursor-pointer group space-y-4 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                         <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5">#{ticket.id}</span>
                         <div className="flex items-center gap-2">
                           <button 
                             onClick={(e) => { e.stopPropagation(); if(window.confirm('Delete this ticket?')) console.log('Deleting', ticket.id); }}
                             className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500 hover:text-red-500 dark:hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                           >
                              <Trash2 size={12} />
                           </button>
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-xl ${
                             ticket.priority === 'Critical' ? 'bg-red-500' : 
                             ticket.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'
                           }`}>
                             <ShieldAlert size={14} />
                           </div>
                         </div>
                      </div>

                      <div className="space-y-1 my-2">
                        <h5 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight italic leading-tight truncate">{ticket.title}</h5>
                        <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate">{ticket.location}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-[9px] font-black text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                             {ticket.upvotes}
                           </div>
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Upvotes</span>
                        </div>
                        {ticket.media && ticket.media.length > 0 && (
                          <ImageIcon size={14} className="text-slate-400 dark:text-slate-500" />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {col.id !== 'Resolved' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextStatus = col.id === 'Raised' ? 'Triaged' : col.id === 'Triaged' ? 'InProgress' : 'Resolved';
                              handleAdvance(ticket, nextStatus);
                            }}
                            className="w-full py-3.5 bg-blue-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-95 transition-all"
                          >
                             Advance <ArrowRight size={10} />
                          </button>
                        )}
                        <button 
                           onClick={() => setSelectedTicket(ticket)}
                           className={`w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${col.id === 'Resolved' ? 'col-span-2' : ''}`}
                        >
                           Examine
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {getTicketsByStatus(col.id).length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center py-32 text-slate-400 dark:text-slate-600 opacity-50">
                      <CheckCircle2 size={48} strokeWidth={1} className="mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">All Clear</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* TICKET INSPECTION MODAL */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[100] bg-white/90 dark:bg-[#020617]/90 backdrop-blur-xl flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
               className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[50px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
             >
                <div className={`h-2 ${
                  selectedTicket.priority === 'Critical' ? 'bg-red-500' : 
                  selectedTicket.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />
                
                <div className="p-8 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
                   <div className="space-y-1">
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-full">#{selectedTicket.id}</span>
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Reported by: {selectedTicket.reporter.name}</span>
                     </div>
                     <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mt-2">{selectedTicket.title}</h3>
                   </div>
                   <button onClick={() => setSelectedTicket(null)} className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                     <X size={24} />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 flex flex-col lg:flex-row gap-8 custom-scrollbar">
                   <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Issue Description</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-white/90 leading-relaxed bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-white/5">
                          {selectedTicket.description}
                        </p>
                      </div>
                      
                      {selectedTicket.media && selectedTicket.media.length > 0 && (
                        <div className="space-y-2">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Evidence</p>
                           <div className="w-full h-48 rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-inner">
                              <img src={selectedTicket.media[0]} className="w-full h-full object-cover" />
                           </div>
                        </div>
                      )}
                   </div>

                   <div className="w-full lg:w-80 flex flex-col space-y-6">
                      <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4 flex-1">
                         <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 pb-4 border-b border-slate-200 dark:border-white/5">
                           <MessageSquare size={16} />
                           <h4 className="text-[10px] font-black uppercase tracking-widest">Admin Response Log</h4>
                         </div>
                         <textarea 
                           placeholder="Type official response or internal note..." 
                           className="w-full h-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-amber-500 dark:focus:border-amber-500 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                           value={adminNote}
                           onChange={(e) => setAdminNote(e.target.value)}
                         />
                         <button onClick={handleSaveNote} className="w-full py-3 bg-amber-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95">
                           Attach Note
                         </button>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESOLUTION MODAL */}
      <AnimatePresence>
        {showResolveModal && (
          <div className="fixed inset-0 z-[120] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[50px] p-10 shadow-3xl space-y-8"
            >
              <div className="space-y-1">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">Final Resolution</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Complete the triage cycle</p>
              </div>

              <form onSubmit={submitResolution} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Solved By</label>
                  <input name="solvedBy" required defaultValue="Campus Maintenance Team" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-green-500/30 rounded-3xl text-sm font-bold text-slate-900 dark:text-white outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Technical Details</label>
                  <textarea name="desc" required rows={3} placeholder="Describe the fix..." className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-green-500/30 rounded-[35px] text-sm font-bold text-slate-900 dark:text-white outline-none resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Total Duration</label>
                  <input name="duration" required placeholder="e.g. 2 Hours 15 Mins" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-green-500/30 rounded-3xl text-sm font-bold text-slate-900 dark:text-white outline-none" />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowResolveModal(false)} className="flex-1 py-5 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-3xl font-black uppercase tracking-widest text-xs">Cancel</button>
                  <button type="submit" className="flex-[2] py-5 bg-green-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-green-500/20">Close Ticket</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
