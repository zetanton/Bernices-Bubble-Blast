// Remove React import
// import React from 'react';
import { Play } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { playSound, preloadSounds } from '../utils/sound';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const themeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload sounds immediately
    preloadSounds();

    // Play sounds after 2 second delay
    const timer = setTimeout(() => {
      playSound('welcome');
      themeAudioRef.current = playSound('theme', true);
    }, 800);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (themeAudioRef.current) {
        themeAudioRef.current.pause();
        themeAudioRef.current = null;
      }
    };
  }, []);

  const handleStart = () => {
    if (themeAudioRef.current) {
      themeAudioRef.current.pause();
      themeAudioRef.current = null;
    }
    playSound('start');
    onStart();
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl text-center max-w-md w-full">
      <h1 className="text-4xl font-bubblegum text-white mb-6">
        Bernice's Bubble Blast
      </h1>
      <div className="relative mb-8 aspect-square w-full max-w-[300px] mx-auto">
        <div className="absolute inset-0 animate-rainbow-border rounded-2xl" />
        <img 
          src="/images/game-logo.png" 
          alt="Bubble Blast Logo" 
          className="relative rounded-2xl w-full h-full object-cover"
        />
      </div>

      <div className="text-left text-white/90 space-y-4 mb-8 font-bubblegum text-xl">
        <p className="flex items-center gap-2">
          <span className="w-8 h-8 bg-yellow-400 rounded-full flex-shrink-0"></span>
          <span>Tap or click to shoot bubbles</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-400 rounded-full flex-shrink-0"></span>
          <span>Match 3 or more of the same color</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="w-8 h-8 bg-green-400 rounded-full flex-shrink-0"></span>
          <span>Clear the board to advance levels</span>
        </p>
      </div>

      <button
        onClick={handleStart}
        className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bubblegum px-8 py-4 rounded-full shadow-lg transition-colors flex items-center justify-center gap-3 w-full"
      >
        <Play className="w-6 h-6" />
        Start Game
      </button>
    </div>
  );
} 