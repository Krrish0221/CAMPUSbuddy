import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useContext } from 'react';
import Navbar from '@/components/Navbar';
import { ThemeContext } from '@/pages/_app';

const modules = [
  {
    letter: 'C',
    name: 'Caffinity',
    color: '#1A56DB',
    tagBg: 'rgba(26, 86, 219, 0.1)',
    tagLabel: 'Food & ordering',
    description: 'Pre-order food from the canteen, pick a time slot, and skip the queue entirely. Live menu and crowd status included.',
    href: '/caffinity'
  },
  {
    letter: 'A',
    name: 'Arena',
    color: '#D97706',
    tagBg: 'rgba(217, 119, 6, 0.1)',
    tagLabel: 'Events & activities',
    description: 'All campus events in one feed — hackathons, fests, competitions. Register before the deadline, never miss out again.',
    href: '/arena'
  },
  {
    letter: 'M',
    name: 'Mapping',
    color: '#059669',
    tagBg: 'rgba(5, 150, 105, 0.1)',
    tagLabel: 'Navigation',
    description: 'Interactive campus map to find classrooms, labs, canteens and offices. Built for new students and daily navigation.',
    href: '/map'
  },
  {
    letter: 'P',
    name: 'ProblemBox',
    color: '#DC2626',
    tagBg: 'rgba(220, 38, 38, 0.1)',
    tagLabel: 'Issue reporting',
    description: 'Report campus issues with a photo, location, and priority. Upvote shared problems and track status from reported to resolved.',
    href: '/problembox'
  },
  {
    letter: 'U',
    name: 'UAssist',
    color: '#7C3AED',
    tagBg: 'rgba(124, 58, 237, 0.1)',
    tagLabel: 'AI assistant',
    description: 'Your AI campus assistant. Ask anything — it finds directions, orders food, opens ProblemBox, or answers campus FAQs.',
    href: '/uassist'
  },
  {
    letter: 'S',
    name: 'Shopperz',
    color: '#EA580C',
    tagBg: 'rgba(234, 88, 12, 0.1)',
    tagLabel: 'Campus resources',
    description: 'Find stationery, books, notes and printouts available on campus. Check availability before you walk across campus for nothing.',
    href: '/shopperz'
  }
];

export default function LandingPage() {
  const router = useRouter();
  const { isLoggedIn } = useContext(ThemeContext);
  const [displayText, setDisplayText] = useState('');
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const fullText = "Your campus. Simplified.";
  
  // 1. TYPEWRITER LOGIC
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        setIsTypewriterDone(true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // 2. SCROLL TRIGGER ANIMATIONS
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-x-0', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-x-12', '-translate-x-12', 'translate-y-12', 'scale-90');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((elem) => {
      observer.observe(elem);
    });

    // 3. SVG DRAW ON SCROLL
    const handleScroll = () => {
      const section = document.querySelector('.how-it-works-section');
      if (section) {
        const rect = section.getBoundingClientRect();
        const scrollPercent = Math.max(0, Math.min(100, (window.innerHeight - rect.top) / rect.height * 100));
        document.documentElement.style.setProperty('--scroll-draw', 100 - scrollPercent);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 4. AUTH INTERCEPTION
  const handleModuleClick = (href) => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${href}`);
    } else {
      router.push(href);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-[#020617]">
      <Navbar />

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px] animate-mesh-1" />
        <div className="particle w-3 h-3 left-1/4 top-1/3 animation-delay-0"></div>
        <div className="particle w-4 h-4 left-3/4 top-1/4 animation-delay-2000"></div>
        <div className="particle w-2 h-2 left-1/2 top-2/3 animation-delay-4000"></div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="w-full text-center pt-24 md:pt-40 pb-16 px-6 max-w-5xl mx-auto">
        <div className="transition-all duration-1000 ease-out transform">
           <h1 className="font-syne font-black text-5xl md:text-7xl leading-[0.9] mb-8 tracking-tighter text-slate-900 dark:text-white">
             <span className="typewriter-cursor">{displayText}</span>
           </h1>
        </div>
        
        <p className={`max-w-md mx-auto text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-12 transition-all duration-1000 delay-500 ${isTypewriterDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          One platform for food, events, navigation, issues, AI help, and campus resources.
        </p>
        
        <div className={`transition-all duration-1000 delay-300 ease-out transform ${isTypewriterDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
            6 Modules · 1 Platform · Built for Campus
          </p>
        </div>
      </section>

      {/* 3. SOCIAL PROOF MARQUEE */}
      <div className="w-full py-12 border-y border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="inline-flex items-center gap-12 px-12">
              <span className="text-sm font-black text-gray-400/80 dark:text-slate-500 tracking-widest uppercase">
                Built for 10,000+ students
              </span>
              <span className="text-2xl text-blue-500/30 font-black">·</span>
              <span className="text-sm font-black text-gray-400/80 dark:text-slate-500 tracking-widest uppercase">
                6 modules
              </span>
              <span className="text-2xl text-blue-500/30 font-black">·</span>
              <span className="text-sm font-black text-gray-400/80 dark:text-slate-500 tracking-widest uppercase">
                1 platform
              </span>
              <span className="text-2xl text-blue-500/30 font-black">·</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-32 mb-16 animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000 delay-200">
        <span className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-[0.25em] font-black">
          Everything inside one word
        </span>
      </div>

      {/* 4. GLASSMORPHISM MODULES */}
      <section className="w-full max-w-5xl mx-auto px-6 mb-32 space-y-24">
        {modules.map((mod, i) => (
          <div 
            key={mod.letter}
            onClick={() => handleModuleClick(mod.href)}
            className={`animate-on-scroll opacity-0 transition-all duration-1000 ease-out flex items-center group
              ${i % 2 === 0 ? '-translate-x-12' : 'translate-x-12'}
            `}
          >
            <div className={`glass-card w-full flex flex-col md:flex-row items-center p-8 md:p-12 rounded-[40px] cursor-pointer hover:shadow-2xl transition-all duration-500 border-l-[6px]`}
                 style={{ borderLeftColor: mod.color }}>
              
              {/* Massive Letter - HOVER BOUNCE */}
              <div 
                className="w-32 md:w-56 flex-shrink-0 text-center flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 active:scale-95"
              >
                <div 
                  className="font-syne font-black leading-none tracking-tighter select-none transition-all duration-500"
                  style={{ color: mod.color, fontSize: 'clamp(100px, 12vw, 120px)' }}
                >
                  {mod.letter}
                </div>
              </div>

              {/* Content Container */}
              <div className="flex-1 min-w-0 pr-6 mt-8 md:mt-0 md:pl-12">
                <h4 className="font-syne font-black text-3xl md:text-5xl mb-3 text-slate-900 dark:text-white tracking-tighter">
                  {mod.name}
                </h4>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mb-6 font-medium">
                  {mod.description}
                </p>

                <span 
                  className="inline-block text-[11px] font-black px-5 py-2 rounded-full tracking-wider uppercase transition-all duration-300 group-hover:shadow-[0_0_15px_-3px_rgba(0,0,0,0.1)] group-hover:brightness-110"
                  style={{ backgroundColor: mod.tagBg, color: mod.color }}
                >
                  {mod.tagLabel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section className="how-it-works-section w-full py-32 px-6 border-y border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/5 relative">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-syne font-black text-4xl mb-32 text-[#0F172A] dark:text-white tracking-tighter">
            How it works
          </h2>
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-16">
            
            {/* SVG Connecting Line */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4/5 hidden md:block">
              <svg className="w-full h-1" viewBox="0 0 100 1" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="0.5" strokeDasharray="100" strokeDashoffset="100"
                      className="text-blue-500/20 animate-on-scroll transition-all duration-[2000ms] delay-500"
                      style={{ strokeDashoffset: 'var(--scroll-draw, 100)' }} />
              </svg>
            </div>

            {/* Step 1 */}
            <div className="animate-on-scroll opacity-0 scale-90 transition-all duration-700 flex-1 text-center flex flex-col items-center group">
              <div className="w-[64px] h-[64px] rounded-full border-2 border-[#1A56DB] dark:border-blue-500 flex items-center justify-center text-2xl font-black text-[#1A56DB] dark:text-blue-500 bg-white dark:bg-slate-900 shadow-xl transition-transform group-hover:scale-110">
                1
              </div>
              <h4 className="font-black text-xl text-[#0F172A] dark:text-white mt-8 tracking-tighter">Sign in</h4>
              <p className="text-base text-gray-500 dark:text-gray-400 max-w-[200px] mt-2 font-semibold">
                Login with your account.
              </p>
            </div>

            {/* Step 2 */}
            <div className="animate-on-scroll opacity-0 scale-90 transition-all duration-700 delay-200 flex-1 text-center flex flex-col items-center group">
              <div className="w-[64px] h-[64px] rounded-full border-2 border-[#1A56DB] dark:border-blue-500 flex items-center justify-center text-2xl font-black text-[#1A56DB] dark:text-blue-500 bg-white dark:bg-slate-900 shadow-xl transition-transform group-hover:scale-110">
                2
              </div>
              <h4 className="font-black text-xl text-[#0F172A] dark:text-white mt-8 tracking-tighter">Pick any</h4>
              <p className="text-base text-gray-500 dark:text-gray-400 max-w-[200px] mt-2 font-semibold">
                Choose from C A M P U S based on your needs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="animate-on-scroll opacity-0 scale-90 transition-all duration-700 delay-400 flex-1 text-center flex flex-col items-center group">
              <div className="w-[64px] h-[64px] rounded-full border-2 border-[#1A56DB] dark:border-blue-500 flex items-center justify-center text-2xl font-black text-[#1A56DB] dark:text-blue-500 bg-white dark:bg-slate-900 shadow-xl transition-transform group-hover:scale-110">
                3
              </div>
              <h4 className="font-black text-xl text-[#0F172A] dark:text-white mt-8 tracking-tighter">Get done</h4>
              <p className="text-base text-gray-500 dark:text-gray-400 max-w-[200px] mt-2 font-semibold">
                Order, report, find — all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="w-full py-16 px-6 border-t border-gray-100 dark:border-white/5 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div 
            onClick={() => router.push('/')}
            className="font-syne font-black text-2xl tracking-tighter text-[#1A56DB] dark:text-blue-400 cursor-pointer"
          >
            CAMPUS<span className="text-gray-900 dark:text-white">buddy</span>
          </div>
          <p className="text-sm text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest text-center">
            Built at UITxKIIF Hackathon 2025 · TEAM PROCESS BUSTERS
          </p>
        </div>
      </footer>
    </div>
  );
}
