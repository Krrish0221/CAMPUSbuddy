import ModuleLayout from '@/components/ModuleLayout';

export default function UAssistPage() {
  return (
    <ModuleLayout 
      title="UAssist" 
      subtitle="AI campus assistant" 
      color="#7C3AED"
    >
      <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">UAssist AI is sleeping</h2>
        <p className="text-gray-500 max-w-sm">I am ready to help you with directions, food, and FAQs. Ask me anything about your campus.</p>
      </div>
    </ModuleLayout>
  );
}
