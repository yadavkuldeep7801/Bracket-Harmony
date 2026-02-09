
import React from 'react';

interface StringViewProps {
  input: string;
  currentIndex: number;
}

const StringView: React.FC<StringViewProps> = ({ input, currentIndex }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center py-6">
      {input.split('').map((char, i) => (
        <div
          key={i}
          className={`
            w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl font-bold rounded-lg border-2 transition-all duration-300
            ${i === currentIndex 
              ? 'border-blue-500 bg-blue-50 scale-125 shadow-lg z-10' 
              : i < currentIndex 
                ? 'border-slate-200 bg-slate-100 text-slate-400' 
                : 'border-slate-300 bg-white text-slate-700'
            }
          `}
        >
          {char}
        </div>
      ))}
      {currentIndex === input.length && (
        <div className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 animate-pulse">
          EOF
        </div>
      )}
    </div>
  );
};

export default StringView;
