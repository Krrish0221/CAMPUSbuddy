import ModuleLayout from '@/components/ModuleLayout';

export default function MapPage() {
  return (
    <ModuleLayout 
      title="Mapping" 
      subtitle="Campus navigation & room finder" 
      color="#0F6E56"
    >
      <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Map loading...</h2>
        <p className="text-gray-500 max-w-sm">Wait a moment while we load the interactive campus floor plans.</p>
      </div>
    </ModuleLayout>
  );
}
