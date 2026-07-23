import React from 'react';

interface FooterProps {
  onOpenMentor: () => void;
  currentStep: number;
}

export function Footer({ onOpenMentor, currentStep }: FooterProps) {
  return (
    <footer className="h-10 bg-white border-t border-slate-200 flex items-center px-6 md:px-8 justify-between flex-shrink-0 text-[10px] text-slate-400 font-bold uppercase tracking-widest shadow-2xs z-10">
      <div className="flex items-center gap-2 md:gap-4 overflow-x-auto scrollbar-none">
        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Open-Meteo API Online
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
        <span>Node.js Express Proxy</span>
        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
        <span>React 19 SPA</span>
      </div>

      <button
        onClick={onOpenMentor}
        className="text-indigo-600 hover:text-indigo-800 font-bold uppercase tracking-widest cursor-pointer hover:underline transition-all flex items-center gap-1"
      >
        <span>Mentor Step {currentStep} Guide →</span>
      </button>
    </footer>
  );
}
