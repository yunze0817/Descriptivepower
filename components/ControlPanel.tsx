import React from 'react';

interface DescriptionInputProps {
  description: string;
  setDescription: (text: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
  disabled: boolean;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({ 
  description, 
  setDescription, 
  onSubmit, 
  isProcessing,
  disabled
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="mb-4">
         <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">✏️</span>
          你的描述
        </h2>
      </div>

      <div className="flex-1 relative">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="在这里输入口述影像稿... 
例如：画面中心坐着一只橘色的猫，阳光从左侧窗户洒进来，在木地板上投下长长的影子..."
          className="w-full h-full min-h-[200px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none text-slate-700 leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          disabled={disabled || isProcessing}
        />
        <div className="absolute bottom-4 right-4 text-xs text-slate-400 pointer-events-none">
          {description.length} 字
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={onSubmit}
          disabled={disabled || !description.trim() || isProcessing}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transform transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
            disabled || !description.trim() || isProcessing
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-xl hover:translate-y-[-2px]'
          }`}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>AI 正在想象画面...</span>
            </>
          ) : (
            <>
              <span>生成想象画面</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </>
          )}
        </button>
        <p className="text-center text-xs text-slate-400 mt-2">
          AI 将仅根据你的文字生成图片，并与原图对比
        </p>
      </div>
    </div>
  );
};

export default DescriptionInput;