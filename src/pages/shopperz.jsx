import ModuleLayout from '@/components/ModuleLayout';

export default function ShopperzPage() {
  return (
    <ModuleLayout 
      title="Shopperz" 
      subtitle="Campus resources & stationery" 
      color="#EA580C"
    >
      <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Store is closed</h2>
        <p className="text-gray-500 max-w-sm">Inventory is currently being updated. Stationaries and books will be available shortly.</p>
      </div>
    </ModuleLayout>
  );
}
