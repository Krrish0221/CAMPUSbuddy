'use client';

import Link from 'next/link';

export default function ModuleCard({ letter, name, description, href, color }) {
  return (
    <Link href={href} className="group block h-full">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-6 transition-all duration-200 transform group-hover:-translate-y-1 group-hover:scale-[1.02] h-full flex flex-col items-center text-center">
        <div 
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-sm`}
          style={{ backgroundColor: color }}
        >
          {letter}
        </div>
        <h3 className="font-syne font-bold text-xl text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-500 text-sm flex-grow">{description}</p>
      </div>
    </Link>
  );
}
