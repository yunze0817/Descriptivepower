import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg transform -rotate-3">
            👁️
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">挑战描述力</h1>
            <p className="text-xs text-slate-500 font-medium">Vision Challenge</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-600">
            Powered by Gemini 2.5
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;