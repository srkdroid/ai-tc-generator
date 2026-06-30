import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const MESSAGES = [
  "Analyzing process requirements...",
  "Generating test scenarios...",
  "Building edge cases...",
  "Validating expected results...",
  "Finalizing test pack..."
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse-glow"></div>
          <Loader2 size={48} className="text-blue-500 animate-spin relative z-10" />
        </div>
        <div className="h-6 overflow-hidden">
          <p 
            className="text-lg font-medium text-gray-700 dark:text-gray-300 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateY(-${messageIndex * 24}px)` }}
          >
            {MESSAGES.map((msg, i) => (
              <span key={i} className="block h-6 leading-6 text-center">{msg}</span>
            ))}
          </p>
        </div>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-6">
        {[1, 2, 3].map((item, index) => (
          <div key={item} className="card p-4 flex flex-col gap-4 overflow-hidden border-gray-100 dark:border-slate-800" style={{ opacity: 1 - (index * 0.25) }}>
            <div className="flex items-center gap-3">
              <div className="h-6 w-24 rounded-full animate-shimmer bg-gray-200 dark:bg-slate-700"></div>
              <div className="h-6 w-48 rounded animate-shimmer bg-gray-200 dark:bg-slate-700"></div>
            </div>
            
            <div className="space-y-2 mt-2">
              <div className="h-4 w-full rounded animate-shimmer bg-gray-100 dark:bg-slate-800/50"></div>
              <div className="h-4 w-5/6 rounded animate-shimmer bg-gray-100 dark:bg-slate-800/50"></div>
              <div className="h-4 w-4/6 rounded animate-shimmer bg-gray-100 dark:bg-slate-800/50"></div>
            </div>

            <div className="mt-4 border border-gray-100 dark:border-slate-800 rounded-md p-3 space-y-3">
              <div className="h-4 w-32 rounded animate-shimmer bg-gray-200 dark:bg-slate-700"></div>
              <div className="h-8 w-full rounded animate-shimmer bg-gray-100 dark:bg-slate-800/50"></div>
              <div className="h-8 w-full rounded animate-shimmer bg-gray-100 dark:bg-slate-800/50"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
