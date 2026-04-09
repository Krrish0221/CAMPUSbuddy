import ModuleLayout from '@/components/ModuleLayout';

export default function CaffinityPage() {
  return (
    <ModuleLayout 
      title="Caffinity" 
      subtitle="Food & canteen pre-ordering" 
      color="#1A56DB"
    >
      <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Canteen Menu Offline</h2>
        <p className="text-gray-500 max-w-sm">The digital menu is currently being updated. Check back during lunch hours.</p>
      </div>
    </ModuleLayout>
  );
}
