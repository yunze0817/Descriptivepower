import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import TargetImage from './components/ImageUploader';
import DescriptionInput from './components/ControlPanel';
import ComparisonResult from './components/ResultPanel';
import { ChallengeImage, EvaluationResult, GameStage } from './types';
import { generateImaginedImage, evaluateSimilarity } from './services/geminiService';

// Hardcoded high-quality unsplash images for the challenge
const CHALLENGES: ChallengeImage[] = [
  {
    id: 'c1',
    url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1000&auto=format&fit=crop',
    title: 'Curious Cat',
    difficulty: 'Easy'
  },
  {
    id: 'c2',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop',
    title: 'Misty Forest',
    difficulty: 'Medium'
  },
  {
    id: 'c3',
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
    title: 'Retro Camera',
    difficulty: 'Easy'
  },
  {
    id: 'c4',
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1000&auto=format&fit=crop',
    title: 'Tree in Desert',
    difficulty: 'Medium'
  },
  {
    id: 'c5',
    url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1000&auto=format&fit=crop',
    title: 'Mountain Lake',
    difficulty: 'Hard'
  }
];

// Helper to fetch image and convert to base64 for Gemini Analysis
const imageUrlToBase64 = async (url: string): Promise<{ base64: string, mimeType: string }> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const mimeType = blob.type || 'image/jpeg'; // Default to jpeg if unknown
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL header for API
      resolve({
        base64: base64String.split(',')[1],
        mimeType
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const App: React.FC = () => {
  const [stage, setStage] = useState<GameStage>('intro');
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeImage>(CHALLENGES[0]);
  const [userDescription, setUserDescription] = useState('');
  
  // Image Data State
  const [targetImageBase64, setTargetImageBase64] = useState<string>('');
  const [targetImageMimeType, setTargetImageMimeType] = useState<string>('image/jpeg');
  
  const [imaginedImageBase64, setImaginedImageBase64] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // Race condition guard
  const activeChallengeIdRef = useRef<string>('');

  // Initial Load
  useEffect(() => {
    loadChallenge(CHALLENGES[0]);
  }, []);

  const loadChallenge = async (challenge: ChallengeImage) => {
    const challengeId = challenge.id;
    activeChallengeIdRef.current = challengeId; // Track the active request

    setStage('playing');
    setCurrentChallenge(challenge);
    setUserDescription('');
    setImaginedImageBase64(null);
    setEvaluation(null);
    setTargetImageBase64(''); // Clear immediately to avoid stale data showing internally
    
    try {
      const { base64, mimeType } = await imageUrlToBase64(challenge.url);
      
      // CRITICAL FIX: Only update state if this request matches the currently active challenge.
      // This prevents "slow" requests from overwriting "fast" requests when switching quickly.
      if (activeChallengeIdRef.current === challengeId) {
        setTargetImageBase64(base64);
        setTargetImageMimeType(mimeType);
      }
    } catch (e) {
      console.error("Failed to load challenge image", e);
    }
  };

  const handleCustomUpload = (file: File) => {
     const challengeId = 'custom-' + Date.now();
     activeChallengeIdRef.current = challengeId;

     const reader = new FileReader();
     reader.onload = (e) => {
       const result = e.target?.result as string;
       if (activeChallengeIdRef.current === challengeId) {
         setCurrentChallenge({
           id: challengeId,
           url: result,
           title: 'Custom Image',
           difficulty: 'Medium'
         });
         setTargetImageBase64(result.split(',')[1]);
         setTargetImageMimeType(file.type || 'image/jpeg');
         setUserDescription('');
         setImaginedImageBase64(null);
         setEvaluation(null);
         setStage('playing');
       }
     };
     reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!userDescription.trim()) return;
    setStage('processing');

    try {
      // 1. Generate Imagined Image
      const imaginedB64 = await generateImaginedImage(userDescription);
      setImaginedImageBase64(imaginedB64);

      // 2. Evaluate (Pass correct mimeType)
      const evalResult = await evaluateSimilarity(
        targetImageBase64, 
        targetImageMimeType, 
        imaginedB64, 
        userDescription
      );
      setEvaluation(evalResult);

      setStage('result');
    } catch (error) {
      console.error(error);
      alert("处理过程中发生错误，请重试。");
      setStage('playing');
    }
  };

  const handleNextChallenge = () => {
    // Determine index based on ID, fallback to 0 if custom
    let currentIndex = CHALLENGES.findIndex(c => c.id === currentChallenge.id);
    if (currentIndex === -1) currentIndex = 0;
    
    const nextIndex = (currentIndex + 1) % CHALLENGES.length;
    loadChallenge(CHALLENGES[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans text-slate-800">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Progress Bar / Challenge Selector */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {CHALLENGES.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => loadChallenge(c)}
                disabled={stage === 'processing'}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentChallenge.id === c.id 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Level {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[650px]">
          
          {/* Left: Target Image */}
          <div className="lg:col-span-4 h-full">
            <TargetImage 
              image={currentChallenge} 
              onCustomUpload={handleCustomUpload}
              className="h-full"
            />
          </div>

          {/* Middle: Interaction Area */}
          <div className="lg:col-span-4 h-full">
             <DescriptionInput 
                description={userDescription}
                setDescription={setUserDescription}
                onSubmit={handleSubmit}
                isProcessing={stage === 'processing'}
                disabled={stage === 'result'}
             />
          </div>

          {/* Right: Result Area */}
          <div className="lg:col-span-4 h-full">
            {stage === 'result' && imaginedImageBase64 ? (
              <ComparisonResult 
                imaginedImageUrl={`data:image/png;base64,${imaginedImageBase64}`}
                evaluation={evaluation}
                onReset={handleNextChallenge}
              />
            ) : (
              <div className="h-full bg-slate-100/50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-slate-400">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                   <span className="text-2xl">?</span>
                </div>
                <p className="text-center">提交描述后<br/>AI 将在此生成想象画面</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;