// import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Lock, Trophy, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { type Stage } from '../types/stages';
import { playSound, stopBackgroundMusic } from '../utils/sound';

interface StageSelectProps {
  stages: Stage[];
  onStageSelect: (stageId: number) => void;
  onBack: () => void;
}

const STAGES_PER_PAGE = 9;

export default function StageSelect({ stages, onStageSelect, onBack }: StageSelectProps) {
  const selectMusicRef = useRef<HTMLAudioElement | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(stages.length / STAGES_PER_PAGE);
  const paginatedStages = stages.slice(
    currentPage * STAGES_PER_PAGE,
    (currentPage + 1) * STAGES_PER_PAGE
  );

  useEffect(() => {
    stopBackgroundMusic();
    selectMusicRef.current = playSound('select', true);

    return () => {
      if (selectMusicRef.current) {
        selectMusicRef.current.pause();
        selectMusicRef.current = null;
      }
    };
  }, []);

  const handlePageChange = (direction: 'prev' | 'next') => {
    const newPage = direction === 'next' 
      ? Math.min(currentPage + 1, totalPages - 1)
      : Math.max(currentPage - 1, 0);

    // Check if the new page has any unlocked stages
    const newPageStages = stages.slice(
      newPage * STAGES_PER_PAGE,
      (newPage + 1) * STAGES_PER_PAGE
    );
    
    if (newPageStages.some(stage => !stage.isLocked)) {
      playSound('shot');
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl w-full max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Level {currentPage + 1}</h2>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl 
                   shadow-lg transition-all hover:scale-105 border-2 border-purple-400"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {paginatedStages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => !stage.isLocked && onStageSelect(stage.id)}
            disabled={stage.isLocked}
            className={`
              relative aspect-square rounded-2xl p-4 
              flex flex-col items-center justify-evenly
              transition-all transform hover:scale-105
              ${stage.isLocked 
                ? 'bg-gray-700/50 cursor-not-allowed' 
                : 'bg-gradient-to-br from-blue-500/50 to-purple-500/50 cursor-pointer'}
              border-2 ${stage.isCompleted ? 'border-yellow-400' : 'border-white/20'}
              shadow-xl
            `}
          >
            <span className="text-4xl font-bold text-white">
              {stage.id}
            </span>
            
            <div>
              {stage.isLocked ? (
                <Lock className="w-8 h-8 text-gray-400" />
              ) : stage.isCompleted ? (
                <Trophy className="w-8 h-8 text-yellow-400" />
              ) : (
                <Star className="w-8 h-8 text-white/70" />
              )}
            </div>

            {!stage.isLocked ? (
              <div className="text-sm text-white/80">
                {stage.maxShots} shots
              </div>
            ) : (
              <div className="text-sm text-white/80">&nbsp;</div>
            )}
          </button>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 0}
            className={`p-2 rounded-lg transition-all ${
              currentPage === 0
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          {/* <span className="text-white font-medium">
            Page {currentPage + 1} of {totalPages}
          </span> */}
          
          <button
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages - 1}
            className={`p-2 rounded-lg transition-all ${
              currentPage === totalPages - 1
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
} 