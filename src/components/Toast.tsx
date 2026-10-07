import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in no-print">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1C1917] text-white rounded-lg shadow-xl border border-[#38332E]">
        <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0" />
        <span className="text-xs font-medium text-[#FAF8F5]">
          {toastMessage}
        </span>
      </div>
    </div>
  );
};
