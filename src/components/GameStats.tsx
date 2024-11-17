// import React from 'react';
import { Trophy, Star } from 'lucide-react';

interface GameStatsProps {
  score: number;
  level: number;
  shotsRemaining: number;
}

export default function GameStats({ score, level, shotsRemaining }: GameStatsProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <Trophy className="text-yellow-400 w-6 h-6" />
        <span className="text-white text-xl font-bold">Score: {score}</span>
      </div>
      <div className="flex items-center gap-4">
        <Star className="text-blue-400 w-6 h-6" />
        <span className="text-white text-xl font-bold">Stage: {level}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-white text-xl font-bold">Shots: {shotsRemaining}</span>
      </div>
    </div>
  );
}