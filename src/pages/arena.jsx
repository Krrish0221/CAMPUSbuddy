import ModuleLayout from '@/components/ModuleLayout';

export default function ArenaPage() {
  return (
    <ModuleLayout 
      title="Arena" 
      subtitle="Campus events & activity booking" 
      color="#D97706"
    >
      <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">No upcoming events found</h2>
        <p className="text-gray-500 max-w-sm">Check back later for hackathons, sports tournaments, and college fests.</p>
      </div>
    </ModuleLayout>
  );
}
