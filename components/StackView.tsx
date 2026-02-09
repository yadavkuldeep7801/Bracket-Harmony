
import React from 'react';

interface StackViewProps {
  stack: string[];
}

const StackView: React.FC<StackViewProps> = ({ stack }) => {
  return (
    <div className="flex flex-col-reverse items-center justify-start w-32 h-64 border-b-4 border-x-4 border-slate-300 rounded-b-xl bg-slate-50/50 relative overflow-hidden">
      {stack.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs italic pointer-events-none">
          Stack Empty
        </div>
      ) : (
        stack.map((char, i) => (
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
      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
    </div>
  );
};

export default StackView;
