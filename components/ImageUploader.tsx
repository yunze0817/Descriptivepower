import React from 'react';
import { ChallengeImage } from '../types';

interface TargetImageProps {
  image: ChallengeImage | null;
  onCustomUpload: (file: File) => void;
  className?: string;
}

const TargetImage: React.FC<TargetImageProps> = ({ image, onCustomUpload, className = "" }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onCustomUpload(e.target.files[0]);
    }
  };

  return (
    <div className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center text-sm">A</span>
          目标图像
        </h2>
        <span className={`text-xs px-2 py-1 rounded font-medium ${
          image?.difficulty === 'Hard' ? 'bg-red-100 text-red-600' :
          image?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-green-100 text-green-700'
        }`}>
          {image?.difficulty || 'Custom'} 难度
        </span>
      </div>

      <div className="relative flex-1 min-h-[300px] bg-slate-50 rounded-xl overflow-hidden border border-slate-200 group">
        {image ? (
          <img 
            src={image.url} 
            alt="Target to describe" 
            className="w-full h-full object-contain absolute inset-0"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            No Image Selected
          </div>
        )}
        
        {/* Custom Upload Overlay */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <label className="cursor-pointer bg-white/90 hover:bg-white text-slate-700 text-xs px-3 py-2 rounded-lg shadow font-medium backdrop-blur-sm">
              上传自己的图片
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
           </label>
        </div>
      </div>
      
      <p className="mt-3 text-sm text-slate-500 leading-relaxed">
        请仔细观察这张图片。假设你的听众完全看不见，你需要用语言构建出这个画面。
      </p>
    </div>
  );
};

export default TargetImage;