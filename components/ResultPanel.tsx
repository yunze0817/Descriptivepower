import React from 'react';
import { EvaluationResult } from '../types';

interface ComparisonResultProps {
  imaginedImageUrl: string;
  evaluation: EvaluationResult | null;
  onReset: () => void;
}

const ComparisonResult: React.FC<ComparisonResultProps> = ({ 
  imaginedImageUrl, 
  evaluation, 
  onReset 
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-secondary/10 text-secondary w-8 h-8 rounded-full flex items-center justify-center text-sm">B</span>
          AI 想象的画面
        </h2>
        
        {evaluation && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">匹配度</span>
            <div className={`text-2xl font-black ${
              evaluation.score >= 80 ? 'text-green-500' :
              evaluation.score >= 60 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {evaluation.score}
            </div>
          </div>
        )}
      </div>

      {/* Imagined Image */}
      <div className="relative flex-1 min-h-[300px] bg-slate-900 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
         <img 
           src={imaginedImageUrl} 
           alt="AI Imagined" 
           className="w-full h-full object-contain absolute inset-0"
         />
         <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-center">
           <span className="text-white text-xs font-medium">视障人士"看到"的画面</span>
         </div>
      </div>

      {/* Evaluation Feedback */}
      {evaluation && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-700 italic">"{evaluation.feedback}"</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold text-green-600 uppercase mb-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                描述准确
              </h4>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                {evaluation.goodDetails.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-500 uppercase mb-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                遗漏/偏差
              </h4>
               <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                {evaluation.missingDetails.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>

          <button 
            onClick={onReset}
            className="w-full mt-4 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 transition"
          >
            挑战下一张
          </button>
        </div>
      )}
    </div>
  );
};

export default ComparisonResult;