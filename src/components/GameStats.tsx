import React from 'react';
import { Trophy, Rocket, RefreshCw } from 'lucide-react';

interface GameStatsProps {
  score: number;
  level: number;
  onRestart: () => void;
}

export default function GameStats({ score, level, onRestart }: GameStatsProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <Trophy className="text-yellow-400 w-6 h-6" />
        <span className="text-white text-xl font-bold">Score: {score}</span>
      </div>
      <div className="flex items-center gap-4">
        <Rocket className="text-blue-400 w-6 h-6" />
        <span className="text-white text-xl font-bold">Level: {level}</span>
      </div>
      <button 
        onClick={onRestart}
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Restart
      </button>
    </div>
  );
}