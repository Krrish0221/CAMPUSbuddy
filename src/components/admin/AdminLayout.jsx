import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Coffee, 
  AlertTriangle, 
  CalendarDays, 
  Bot,
  LogOut,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import { useContext } from 'react';
import { ThemeContext } from '@/pages/_app';

const ADMIN_NAVIGATION = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
  { name: 'Global Users', href: '/admin/users', icon: Users, color: 'text-indigo-500' },
  { name: 'Caffinity', href: '/vendor/caffinity', icon: Coffee, color: 'text-amber-500' },
  { name: 'Arena Events', href: '/admin/arena', icon: CalendarDays, color: 'text-pink-500' },
  { name: 'ProblemBox', href: '/admin/problembox', icon: AlertTriangle, color: 'text-red-500' },
  { name: 'Shopperz', href: '/admin/shopperz', icon: Store, color: 'text-orange-500' },
  { name: 'UAssist AI', href: '/admin/uassist', icon: Bot, color: 'text-purple-500' },
];

export default function AdminLayout({ children, title, subtitle, extraHeader }) {
  const router = useRouter();
  const { userProfile, logout, isDarkMode, toggleTheme } = useContext(ThemeContext);

  const isActive = (href) => router.pathname === href;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-white flex overflow-hidden font-sans transition-colors duration-500">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-white dark:bg-[#060b19] border-r border-slate-200/60 dark:border-white/5 flex flex-col hidden md:flex shrink-0 transition-colors duration-500 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-start justify-between gap-2">
          <div 
            onClick={() => router.push('/')}
            className="font-syne cursor-pointer group leading-none min-w-0"
          >
            <div className="font-black text-[22px] tracking-tighter text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors truncate">
              CAMPUS<span className="text-blue-500">buddy</span>
            </div>
            <div className="font-bold text-xs tracking-[0.2em] text-slate-400 dark:text-white/40 uppercase mt-1.5 ml-0.5">
              Admin HQ
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-500 flex items-center justify-center text-[10px] font-black uppercase shadow-sm shrink-0">
            HQ
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2 custom-scrollbar">
          <p className="px-4 text-[10px] font-black uppercase text-slate-400 dark:text-white/40 tracking-[0.2em] mb-4">Command Modules</p>
          {ADMIN_NAVIGATION.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all group ${
                  active 
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-xl border border-slate-100 dark:border-white/10 scale-[1.02]' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border border-transparent hover:scale-[1.01]'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-blue-50 dark:bg-white/10 shadow-inner' : 'bg-slate-50 dark:bg-slate-800 group-hover:scale-110 shadow-sm dark:shadow-none'}`}>
                  <Icon size={16} className={`${active ? item.color : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors'}`} />
                </div>
                <span className="text-sm tracking-wide">{item.name}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse" />}
              </button>
            );
          })}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-white/5 space-y-4 bg-slate-50/50 dark:bg-transparent">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                {userProfile?.avatar ? (
                  <img src={userProfile.avatar} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-slate-500 dark:text-white">{userProfile?.name?.charAt(0) || 'A'}</span>
                )}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-black text-slate-900 dark:text-white truncate">{userProfile?.name || 'Administrator'}</p>
               <p className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest mt-0.5">Command Access</p>
             </div>
          </div>
          <button 
            onClick={() => { logout(); router.push('/'); }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-500 dark:hover:text-white transition-colors border border-red-100 dark:border-transparent shadow-sm dark:shadow-none"
          >
            <LogOut size={14} /> Exit Portal
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden transition-colors duration-500">
         {/* Background Effects */}
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
         
         {/* Top Header */}
         <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#020617]/80 backdrop-blur-2xl border-b border-slate-200/60 dark:border-white/5 px-8 md:px-12 py-6 flex items-center justify-between transition-colors duration-500 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
           <div className="space-y-1">
             <h1 className="text-3xl font-black font-syne italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none drop-shadow-sm">{title}</h1>
             {subtitle && <p className="text-[10px] font-black text-slate-500 dark:text-white/50 uppercase tracking-[0.2em]">{subtitle}</p>}
           </div>
           <div className="flex items-center gap-4">
             {extraHeader}
             <button 
                onClick={toggleTheme}
                className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-white dark:hover:text-slate-900 transition-colors shadow-sm"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-white dark:hover:text-slate-900 transition-colors relative shadow-sm">
               <Bell size={20} />
               <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-[#020617] shadow-sm" />
             </button>
           </div>
         </header>

         {/* Content Wrapper */}
         <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
           <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
             {children}
           </div>
         </div>
      </main>
    </div>
  );
}
