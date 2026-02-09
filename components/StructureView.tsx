
import React from 'react';
import { AlgorithmMode } from '../types';

interface StructureViewProps {
  items: string[];
  mode: AlgorithmMode;
}

const StructureView: React.FC<StructureViewProps> = ({ items, mode }) => {
  if (mode === 'stack') {
    return (
      <div className="flex flex-col-reverse items-center justify-start w-32 h-64 border-b-4 border-x-4 border-slate-300 rounded-b-xl bg-slate-50/50 relative overflow-hidden transition-all duration-500">
        <div className="absolute top-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stack (LIFO)</div>
        {items.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs italic pointer-events-none">
            Stack Empty
          </div>
        ) : (
          items.map((char, i) => (
            <div
              key={`${i}-${char}`}
              className={`
                w-24 h-12 flex items-center justify-center text-xl font-bold rounded-lg mb-1 shadow-sm transition-all duration-300 transform animate-bounce-in
                ${char === '(' ? 'bg-blue-100 text-blue-700 border border-blue-200' : ''}
                ${char === '{' ? 'bg-purple-100 text-purple-700 border border-purple-200' : ''}
                ${char === '[' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : ''}
              `}
            >
              {char}
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center justify-start w-full max-w-md h-32 border-y-4 border-slate-300 rounded-xl bg-slate-50/50 relative overflow-hidden transition-all duration-500">
      <div className="absolute top-2 left-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Queue (FIFO)</div>
      <div className="absolute left-0 h-full w-1 bg-rose-400/30 flex items-center justify-center">
        <span className="[writing-mode:vertical-lr] text-[8px] font-bold text-rose-500">FRONT</span>
      </div>
      <div className="absolute right-0 h-full w-1 bg-emerald-400/30 flex items-center justify-center">
        <span className="[writing-mode:vertical-lr] text-[8px] font-bold text-emerald-500">REAR</span>
      </div>
      
      <div className="flex flex-row gap-2 px-6 items-center">
        {items.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs italic pointer-events-none">
            Queue Empty
          </div>
        ) : (
          items.map((char, i) => (
            <div
              key={`${i}-${char}`}
              className={`
                w-12 h-20 flex items-center justify-center text-xl font-bold rounded-lg shadow-sm transition-all duration-300 transform animate-slide-in
                ${char === '(' ? 'bg-blue-100 text-blue-700 border border-blue-200' : ''}
                ${char === '{' ? 'bg-purple-100 text-purple-700 border border-purple-200' : ''}
                ${char === '[' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : ''}
              `}
            >
              {char}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StructureView;
