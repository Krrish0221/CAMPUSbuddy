import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Bot, 
  MessageSquare, 
  BrainCircuit, 
  Megaphone, 
  Plus, 
  Trash2, 
  Send,
  Zap,
  Activity,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUAssist } from '@/context/UAssistContext';

const INITIAL_FAQS = [
  { id: 'kb-001', q: 'What are the library timings?', a: 'KU Library is open 24/7 during exam season and 8 AM - 10 PM on weekdays.', tags: 'library, timing' },
  { id: 'kb-002', q: 'Where do I register for sports?', a: 'KU Athletics membership is free. Registration happens at the Sports Pavilion.', tags: 'sports, membership' },
  { id: 'kb-003', q: 'How do I access the campus Wi-Fi?', a: 'Use your college ID and admission portal password to connect to "CAMPUS_SECURE".', tags: 'wifi, internet' },
];

export default function UAssistAdminPage() {
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [activeTab, setActiveTab] = useState('Brain Config');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  
  const { sendGlobalBroadcast, globalLogs } = useUAssist();

  const handleBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    sendGlobalBroadcast(broadcastMsg);
    setBroadcastMsg('');
  };

  const deleteFAQ = (id) => setFaqs(faqs.filter(f => f.id !== id));

  return (
    <AdminLayout 
      title="Intelligence Hub" 
      subtitle="UAssist AI Configuration"
    >
      <div className="space-y-10 pb-20">
        
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-xl space-y-2">
              <div className="flex items-center gap-3 text-purple-500 mb-2">
                 <Activity size={18} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Load Index</span>
              </div>
              <h4 className="text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white">94.2%</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time GPU Utilization</p>
           </div>
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-xl space-y-2">
              <div className="flex items-center gap-3 text-blue-500 mb-2">
                 <MessageSquare size={18} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Total Queries</span>
              </div>
              <h4 className="text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white">{globalLogs.length}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">This Session</p>
           </div>
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-xl space-y-2">
              <div className="flex items-center gap-3 text-green-500 mb-2">
                 <Zap size={18} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Accuracy</span>
              </div>
              <h4 className="text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white">98.5%</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intent Detection Rate</p>
           </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-2">
          {['Brain Config', 'Live Telemetry', 'Broadcast Engine'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-purple-600 dark:text-purple-500' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && <motion.div layoutId="uassist-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-t-full shadow-[0_0_10px_#a855f7]" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'Brain Config' && (
            <motion.div 
              key="brain"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                 <div>
                   <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
                     <BrainCircuit className="text-purple-500" size={28} /> Knowledge Base Editor
                   </h3>
                   <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Train UAssist with custom datasets</p>
                 </div>
                 <button className="px-6 py-4 bg-purple-500 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-purple-500/20 hover:scale-105 transition-all flex items-center gap-3">
                   <Plus size={18} /> Add Entry
                 </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {faqs.map(faq => (
                   <div key={faq.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[40px] p-8 shadow-sm dark:shadow-2xl space-y-4 group hover:border-purple-500/30 transition-colors">
                     <div className="flex items-start justify-between">
                       <h4 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{faq.q}</h4>
                       <button onClick={() => deleteFAQ(faq.id)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                         <Trash2 size={12} />
                       </button>
                     </div>
                     <p className="text-xs font-bold text-slate-700 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-white/5">{faq.a}</p>
                     <div className="pt-2">
                       <span className="text-[9px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-500/20">
                         Tags: {faq.tags}
                       </span>
                     </div>
                   </div>
                 ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Live Telemetry' && (
            <motion.div 
              key="logs"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[45px] p-10 shadow-xl dark:shadow-2xl space-y-8">
                 <div className="flex items-center justify-between">
                   <div>
                     <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
                       <MessageSquare className="text-blue-500" size={24} /> Chat Monitor
                     </h3>
                     <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Analyze student queries in real-time (Anonymized by default)</p>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                      <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Live Signal Active</span>
                   </div>
                 </div>
                 
                 <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950">
                    <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5">
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Time</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Student</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Raw Query</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Detected Intent</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                         {globalLogs.length > 0 ? globalLogs.map((log, i) => (
                            <tr key={i} className="hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                               <td className="p-4 text-xs font-bold text-slate-500">{log.time}</td>
                               <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{log.student}</td>
                               <td className="p-4 text-xs font-bold text-slate-700 dark:text-slate-300 italic">
                                  &quot;{log.query}&quot;
                                  <div className="mt-1 text-[8px] opacity-40 font-black italic">AI: {log.fullResponse}</div>
                               </td>
                               <td className="p-4">
                                  <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                                     {log.intent}
                                  </span>
                               </td>
                            </tr>
                         )) : (
                            <tr>
                              <td colSpan={4} className="p-20 text-center text-xs font-black text-slate-400 uppercase tracking-widest opacity-50">
                                Waiting for live signal...
                              </td>
                            </tr>
                         )}
                      </tbody>
                    </table>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Broadcast Engine' && (
            <motion.div 
              key="broadcast"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl"
            >
               <div className="bg-gradient-to-br from-purple-600 to-indigo-900 rounded-[45px] p-10 shadow-3xl text-white flex flex-col justify-between relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none" />
                 
                 <div className="relative z-10 space-y-6">
                   <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-xl mb-4">
                     <Megaphone size={28} />
                   </div>
                   <div>
                     <h3 className="text-4xl font-black italic uppercase tracking-tighter">AI Broadcast</h3>
                     <p className="text-white/80 font-bold text-sm leading-relaxed max-w-sm mt-2">Force UAssist to push an immediate notification card to all active student chat interfaces.</p>
                   </div>
                   
                   <div className="space-y-4 pt-4">
                     <textarea 
                       placeholder="Enter emergency or general broadcast message..."
                       className="w-full h-32 bg-slate-900/40 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-sm font-bold text-white placeholder:text-white/40 focus:outline-none focus:border-white resize-none shadow-inner"
                       value={broadcastMsg}
                       onChange={(e) => setBroadcastMsg(e.target.value)}
                       onKeyDown={(e) => {
                         if(e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault();
                           handleBroadcast();
                         }
                       }}
                     />
                     <button 
                       onClick={handleBroadcast}
                       className="px-8 py-5 bg-white text-purple-700 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                     >
                       <Send size={18} /> Push to network
                     </button>
                   </div>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
}
