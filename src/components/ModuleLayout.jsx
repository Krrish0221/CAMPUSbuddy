import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';

export default function ModuleLayout({ title, subtitle, color, children }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Module Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.push('/home')}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition"
          >
            ← Back to Campus
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-center gap-6">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-sm shrink-0"
            style={{ backgroundColor: color }}
          >
            {title.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold font-syne text-gray-900 tracking-tight">
              {title}
            </h1>
            <p className="text-gray-500 font-medium">{subtitle}</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
          {children}
        </div>
      </main>
    </div>
  );
}
