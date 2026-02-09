
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Pause, Info, Sparkles, CheckCircle2, XCircle, Layers, FastForward } from 'lucide-react';
import { validateParentheses } from './services/parenthesesEngine';
import { getExplanation } from './services/geminiService';
import StructureView from './components/StructureView';
import StringView from './components/StringView';
import { Step, ValidationResult, AlgorithmMode } from './types';

const PRESETS = ["()", "()[]{}", "(]", "([])", "([)]", "{[()]}", "((()))"];

const App: React.FC = () => {
  const [input, setInput] = useState("([])");
  const [mode, setMode] = useState<AlgorithmMode>('stack');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startValidation = useCallback((str: string, currentMode: AlgorithmMode) => {
    const res = validateParentheses(str, currentMode);
    setResult(res);
    setStepIndex(0);
    setIsPlaying(false);
    setAiExplanation(null);
  }, []);

  useEffect(() => {
    startValidation(input, mode);
  }, [input, mode, startValidation]);

  const handleNext = useCallback(() => {
    if (result && stepIndex < result.steps.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  }, [result, stepIndex]);

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(handleNext, 800);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, handleNext]);

  const handleAiExplain = async () => {
    if (!result) return;
    setIsExplaining(true);
    setAiExplanation(null);
    const explanation = await getExplanation(input, result.isValid, mode);
    setAiExplanation(explanation);
    setIsExplaining(false);
  };

  const currentStep = result?.steps[stepIndex] || {
    index: -1,
    structure: [],
    currentChar: null,
    action: 'start',
    message: "Waiting for input...",
    isValidSoFar: true,
  } as Step;

  const isFinalStep = result && stepIndex === result.steps.length - 1;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2 flex items-center justify-center gap-3">
            <span className="text-blue-600">Structure</span> Harmony
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Compare how Stack vs Queue behaves when solving the Valid Parentheses problem.
          </p>
        </header>

        {/* Control Panel */}
        <section className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-slate-200">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-600 mb-2">Input String</label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^()\[\]{}]/g, '');
                    setInput(val);
                  }}
                  className="w-full text-2xl font-mono px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  placeholder="e.g. ([])"
                />
              </div>

              <div className="flex-none">
                <label className="block text-sm font-semibold text-slate-600 mb-2">Algorithm Mode</label>
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setMode('stack')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${mode === 'stack' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Layers size={18} />
                    Stack
                  </button>
                  <button
                    onClick={() => setMode('queue')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${mode === 'queue' ? 'bg-white text-rose-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <FastForward size={18} />
                    Queue
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
               <span className="text-xs font-bold text-slate-400 uppercase mr-2">Presets:</span>
               {PRESETS.map(p => (
                 <button
                   key={p}
                   onClick={() => setInput(p)}
                   className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${input === p ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                 >
                   {p}
                 </button>
               ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all"
                  title="Reset"
                >
                  <RotateCcw size={20} />
                </button>
                <button
                  onClick={handlePrev}
                  disabled={stepIndex === 0}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg font-medium transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${isPlaying ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'}`}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  {isPlaying ? "Pause" : "Start"}
                </button>
                <button
                  onClick={handleNext}
                  disabled={isFinalStep}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg font-medium transition-all"
                >
                  Next
                </button>
              </div>
              
              <div className="text-sm font-bold text-slate-400">
                Step {stepIndex + 1} / {result?.steps.length}
              </div>
            </div>
          </div>
        </section>

        {/* Visualizer Area */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Visualizer */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 border border-slate-200 flex flex-col items-center min-h-[500px]">
            <StringView input={input} currentIndex={currentStep.index} />
            
            <div className="flex-1 flex flex-col items-center justify-center w-full gap-8 mt-4">
              <StructureView items={currentStep.structure} mode={mode} />
              
              {/* Status Message */}
              <div className={`
                w-full p-4 rounded-xl border-l-4 transition-all duration-300
                ${currentStep.action === 'push' ? 'bg-blue-50 border-blue-500 text-blue-800' : ''}
                ${currentStep.action === 'match' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : ''}
                ${currentStep.action === 'mismatch' || currentStep.action === 'empty-error' ? 'bg-rose-50 border-rose-500 text-rose-800' : ''}
                ${currentStep.action === 'final-check' ? (currentStep.isValidSoFar ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-rose-50 border-rose-500 text-rose-800') : ''}
                ${currentStep.action === 'start' ? 'bg-slate-50 border-slate-300 text-slate-600' : ''}
              `}>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    {currentStep.action === 'match' || (currentStep.action === 'final-check' && currentStep.isValidSoFar) ? (
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    ) : currentStep.action === 'mismatch' || currentStep.action === 'empty-error' || (currentStep.action === 'final-check' && !currentStep.isValidSoFar) ? (
                      <XCircle size={20} className="text-rose-500" />
                    ) : (
                      <Info size={20} className="text-blue-500" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs uppercase font-black opacity-40 block mb-1">
                      {currentStep.action} {mode}
                    </span>
                    <p className="font-medium text-lg leading-snug">{currentStep.message}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Side Panel */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className={`p-4 text-white flex items-center gap-2 transition-colors duration-500 ${mode === 'stack' ? 'bg-indigo-600' : 'bg-rose-600'}`}>
              <Sparkles size={20} />
              <h3 className="font-bold">AI Comparison</h3>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              {isExplaining ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
                  <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${mode === 'stack' ? 'border-indigo-600' : 'border-rose-600'}`}></div>
                  <p className="animate-pulse">Thinking about {mode}s...</p>
                </div>
              ) : aiExplanation ? (
                <div className="prose prose-sm text-slate-700">
                  <div className="whitespace-pre-line leading-relaxed italic border-l-2 border-slate-100 pl-4">
                    {aiExplanation}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className={`p-4 rounded-full mb-4 ${mode === 'stack' ? 'bg-indigo-50 text-indigo-400' : 'bg-rose-50 text-rose-400'}`}>
                    <Sparkles size={32} />
                  </div>
                  <h4 className="font-bold text-slate-700 mb-2">{mode.toUpperCase()} Analysis</h4>
                  <p className="text-sm text-slate-500 mb-6">Learn why a {mode} {mode === 'stack' ? 'succeeds' : 'usually fails'} at processing nested patterns like "([])".</p>
                  <button
                    onClick={handleAiExplain}
                    className={`w-full text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${mode === 'stack' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                  >
                    Explain Mode with Gemini
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-slate-800 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Info className="text-blue-400" />
            Comparison: Stack vs Queue
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 bg-slate-700/30 p-4 rounded-xl">
              <h3 className="font-bold text-blue-400">Stack (LIFO)</h3>
              <p className="text-slate-400 text-sm">
                <b>Last-In, First-Out.</b> The last bracket you opened is the first one you should close. This perfectly matches the "nested" nature of balanced parentheses.
              </p>
              <div className="text-[10px] text-emerald-400 font-bold">BEST FOR: Nesting, Undo/Redo, Recursion</div>
            </div>
            <div className="space-y-3 bg-slate-700/30 p-4 rounded-xl">
              <h3 className="font-bold text-rose-400">Queue (FIFO)</h3>
              <p className="text-slate-400 text-sm">
                <b>First-In, First-Out.</b> The first bracket opened is expected to be matched first. This fails for <code>([])</code> because it expects <code>[</code> to close before <code>(</code>.
              </p>
              <div className="text-[10px] text-blue-400 font-bold">BEST FOR: Task Scheduling, Breadth-First Search</div>
            </div>
          </div>
        </section>

        <footer className="mt-12 text-center text-slate-400 text-sm pb-12">
          &copy; 2024 Structure Harmony. Visualizing the difference between FIFO and LIFO.
        </footer>
      </div>
    </div>
  );
};

export default App;
