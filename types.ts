export interface EvaluationResult {
  score: number;
  feedback: string;
  missingDetails: string[];
  goodDetails: string[];
}

export type GameStage = 'intro' | 'playing' | 'processing' | 'result';

export interface ChallengeImage {
  id: string;
  url: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// Helper to handle base64 strings
export interface ImageData {
  base64: string;
  mimeType: string;
}