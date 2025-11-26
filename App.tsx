import React, { useState, useCallback } from 'react';
import { Send, Shuffle, RefreshCcw, Sparkles, CheckCircle2, ArrowRight, Ban, Share2 } from 'lucide-react';
import { LottoBall } from './components/LottoBall';
import { NumberSelector } from './components/NumberSelector';
import { generateLuckyMessage } from './services/geminiService';
import { AppStep, LottoSet } from './types';

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.INTRO);
  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);
  const [generatedResults, setGeneratedResults] = useState<LottoSet[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const toggleExcludedNumber = (num: number) => {
    setExcludedNumbers(prev => 
      prev.includes(num) 
        ? prev.filter(n => n !== num) 
        : [...prev, num]
    );
  };

  const generateNumbers = useCallback(async () => {
    setIsGenerating(true);
    setAiLoading(true);

    // Simulation delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    const pool = Array.from({ length: 45 }, (_, i) => i + 1)
      .filter(n => !excludedNumbers.includes(n));

    if (pool.length < 6) {
      alert("제외할 숫자가 너무 많습니다! 최소 6개의 숫자는 남겨주세요.");
      setIsGenerating(false);
      setAiLoading(false);
      return;
    }

    // Generate 5 sets
    const newSets: LottoSet[] = [];
    for (let i = 0; i < 5; i++) {
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 6).sort((a, b) => a - b);
      
      newSets.push({
        id: crypto.randomUUID(),
        numbers: selected,
        timestamp: Date.now(),
        aiComment: undefined
      });
    }

    setGeneratedResults(newSets);
    setIsGenerating(false);
    setStep(AppStep.GENERATION);

    // AI Message for the first set (Bonus feature)
    try {
      const comment = await generateLuckyMessage(excludedNumbers, newSets[0].numbers);
      setGeneratedResults(prev => [
        { ...prev[0], aiComment: comment },
        ...prev.slice(1)
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  }, [excludedNumbers]);

  const shareRequestMessage = () => {
    const text = "이번 주 로또, 네가 생각하는 '절대 안 나올 것 같은 숫자' 하나만 알려줘! HappyFamily 앱에서 그 숫자 빼고 돌려볼게!";
    if (navigator.share) {
      navigator.share({
        title: 'HappyFamily 숫자 요청',
        text: text,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('메시지가 복사되었습니다! 친구에게 보내보세요.');
    }
  };

  const resetApp = () => {
    setExcludedNumbers([]);
    setGeneratedResults([]);
    setStep(AppStep.INTRO);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-slate-800 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={resetApp}>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer">
              HF
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 cursor-pointer">
              HappyFamily
            </h1>
          </div>
          {step !== AppStep.INTRO && (
             <button onClick={resetApp} className="p-2 text-slate-500 hover:text-slate-800 transition-colors">
               <RefreshCcw size={20} />
             </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        
        {/* Step 1: Intro */}
        {step === AppStep.INTRO && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4 mt-10">
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                함께 만드는 행운
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                우리 가족의 직감을 믿습니다^^<br />
                <span className="text-indigo-600">행운은 빈틈에 있습니다</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
                가족이나 친구들에게 "절대 안 나올 것 같은 숫자"를 물어보세요.<br/>
                그 숫자를 제외하고, 남은 확률 중에서<br/>최고의 번호를 찾아드립니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={shareRequestMessage}
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 hover:border-indigo-300 text-slate-700 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <Share2 size={20} className="group-hover:scale-110 transition-transform"/>
                친구에게 숫자 물어보기
              </button>
              <button 
                onClick={() => setStep(AppStep.EXCLUSION)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                바로 시작하기
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { icon: Send, title: "1. 질문하기", desc: "친구들에게 제외할 번호를 물어보세요." },
                { icon: Ban, title: "2. 제외하기", desc: "받은 번호를 쏙 빼버리세요." },
                { icon: Sparkles, title: "3. 당첨기원", desc: "남은 번호로 행운을 잡으세요." },
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Exclusion */}
        {step === AppStep.EXCLUSION && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">제외할 숫자를 선택해주세요</h2>
              <p className="text-slate-600">
                선택된 숫자는 <span className="font-bold text-red-500">생성에서 제외</span>됩니다. ({excludedNumbers.length}개 선택됨)
              </p>
            </div>

            <NumberSelector 
              excludedNumbers={excludedNumbers} 
              toggleNumber={toggleExcludedNumber} 
            />

            <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-40">
              <button 
                onClick={generateNumbers}
                disabled={isGenerating}
                className="w-full max-w-md bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-300 flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:scale-95"
              >
                {isGenerating ? (
                  <>
                    <RefreshCcw className="animate-spin" />
                    번호 추출 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="text-yellow-400 fill-yellow-400" />
                    HappyFamily 번호 생성
                  </>
                )}
              </button>
            </div>
            {/* Spacer for fixed button */}
            <div className="h-20" />
          </div>
        )}

        {/* Step 3: Generation Results */}
        {step === AppStep.GENERATION && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">오늘의 추천 번호</h2>
              <p className="text-slate-500 text-sm">
                 제외된 숫자 {excludedNumbers.length}개를 피해서 생성되었습니다.
              </p>
            </div>

            <div className="space-y-4">
              {generatedResults.map((set, idx) => (
                <div 
                  key={set.id} 
                  className={`
                    relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all
                    ${idx === 0 ? 'ring-2 ring-indigo-500 shadow-indigo-100' : ''}
                  `}
                >
                  {idx === 0 && (
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Sparkles size={12} fill="white" />
                      AI 추천 (Best)
                    </div>
                  )}

                  <div className="flex flex-wrap justify-center gap-3 mb-4">
                    {set.numbers.map(num => (
                      <LottoBall key={num} number={num} size={idx === 0 ? 'lg' : 'md'} />
                    ))}
                  </div>

                  {idx === 0 && (
                    <div className="mt-4 bg-indigo-50 rounded-xl p-4 flex gap-3 items-start">
                       <div className="min-w-[24px] pt-1 text-indigo-600">
                          <CheckCircle2 size={24} />
                       </div>
                       <div>
                         <h4 className="font-bold text-indigo-900 text-sm mb-1">AI의 행운 코멘트</h4>
                         <p className="text-indigo-800 text-sm leading-relaxed">
                           {aiLoading && !set.aiComment ? (
                             <span className="animate-pulse">행운의 메시지를 분석하고 있습니다...</span>
                           ) : (
                             set.aiComment
                           )}
                         </p>
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                  onClick={generateNumbers}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                >
                  <Shuffle size={20} />
                  다른 번호 다시 뽑기
              </button>
              
              <button 
                onClick={() => setStep(AppStep.EXCLUSION)}
                className="w-full bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                제외 번호 수정하기
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}