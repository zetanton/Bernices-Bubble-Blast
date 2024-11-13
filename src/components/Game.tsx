import React, { useEffect, useState } from 'react';
import GameBoard from './GameBoard';
import GameStats from './GameStats';
import { type Bubble, type ShootingBubble, type PopAnimation } from '../types/game';

// Updated colors to be more distinct
const COLORS = [
  '#FF0000', // Bright Red
  '#00FF00', // Bright Green
  '#0088FF', // Bright Blue
  '#FFD700', // Gold
  '#FF1493', // Deep Pink
];

const BUBBLE_SIZE = 40;
const ROWS = 8;
const COLS = 10;
const SHOOT_SPEED = 15;

export default function Game() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [currentBubble, setCurrentBubble] = useState<string>(COLORS[0]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [shootingBubbles, setShootingBubbles] = useState<ShootingBubble[]>([]);
  const [popAnimations, setPopAnimations] = useState<PopAnimation[]>([]);

  useEffect(() => {
    initializeGame();
  }, [level]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      updateShootingBubbles();
      updatePopAnimations();
    }, 1000/60);

    return () => clearInterval(gameLoop);
  }, [shootingBubbles, bubbles, popAnimations]);

  const updatePopAnimations = () => {
    setPopAnimations(prev => {
      const updated = prev.map(anim => ({
        ...anim,
        progress: anim.progress + 0.1
      }));
      return updated.filter(anim => anim.progress < 1);
    });
  };

  const initializeGame = () => {
    const initialBubbles: Bubble[] = [];
    const rows = Math.min(ROWS, level + 2);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < COLS; col++) {
        // Calculate position with offset for odd rows
        const x = col * BUBBLE_SIZE + (row % 2 ? BUBBLE_SIZE/2 : 0);
        
        // Skip if the bubble would be partially off-screen
        if (x + BUBBLE_SIZE > COLS * BUBBLE_SIZE) continue;
        
        if (Math.random() > 0.3) {
          initialBubbles.push({
            x,
            y: row * BUBBLE_SIZE,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            id: `${row}-${col}`,
          });
        }
      }
    }
    setBubbles(initialBubbles);
    setShootingBubbles([]);
    setPopAnimations([]);
    setCurrentBubble(COLORS[Math.floor(Math.random() * COLORS.length)]);
  };

  const updateShootingBubbles = () => {
    setShootingBubbles(prev => {
      const updated = prev.map(bubble => {
        let { x, y, dx, dy } = bubble;
        x += dx;
        y += dy;

        // Wall bouncing
        if (x <= 0 || x >= COLS * BUBBLE_SIZE - BUBBLE_SIZE) {
          dx = -dx;
          x = Math.max(0, Math.min(x, COLS * BUBBLE_SIZE - BUBBLE_SIZE));
        }

        return { ...bubble, x, y, dx, dy };
      });

      const collided = updated.filter(bubble => 
        bubble.y <= 0 || checkCollision(bubble)
      );

      collided.forEach(bubble => {
        const snappedPosition = snapToGrid(bubble);
        
        // Only add the bubble if it's within bounds
        if (snappedPosition.x + BUBBLE_SIZE <= COLS * BUBBLE_SIZE) {
          const newBubble = {
            ...bubble,
            x: snappedPosition.x,
            y: snappedPosition.y,
          };
          setBubbles(prev => [...prev, newBubble]);
          checkMatches(newBubble);
        }
      });

      return updated.filter(bubble => !collided.includes(bubble));
    });
  };

  const checkCollision = (bubble: ShootingBubble): boolean => {
    return bubbles.some(existing => {
      const dx = (existing.x + BUBBLE_SIZE/2) - (bubble.x + BUBBLE_SIZE/2);
      const dy = (existing.y + BUBBLE_SIZE/2) - (bubble.y + BUBBLE_SIZE/2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < BUBBLE_SIZE;
    });
  };

  const snapToGrid = (bubble: ShootingBubble) => {
    const row = Math.round(bubble.y / BUBBLE_SIZE);
    let col = Math.round((bubble.x - (row % 2 ? BUBBLE_SIZE/2 : 0)) / BUBBLE_SIZE);
    
    // Ensure the column is within bounds
    const maxCol = row % 2 ? COLS - 2 : COLS - 1;
    col = Math.max(0, Math.min(col, maxCol));
    
    return {
      x: col * BUBBLE_SIZE + (row % 2 ? BUBBLE_SIZE/2 : 0),
      y: row * BUBBLE_SIZE,
    };
  };

  const handleShoot = (angle: number) => {
    if (gameOver || shootingBubbles.length > 0) return;

    const newBubble: ShootingBubble = {
      x: COLS * BUBBLE_SIZE / 2 - BUBBLE_SIZE/2,
      y: BUBBLE_SIZE * 15 - BUBBLE_SIZE * 1.5,
      color: currentBubble,
      id: Date.now().toString(),
      dx: Math.cos(angle) * SHOOT_SPEED,
      dy: Math.sin(angle) * SHOOT_SPEED,
    };

    setShootingBubbles(prev => [...prev, newBubble]);
    setCurrentBubble(COLORS[Math.floor(Math.random() * COLORS.length)]);
  };

  const checkMatches = (bubble: Bubble) => {
    const matches = findMatches(bubble);
    if (matches.length >= 3) {
      // Add pop animations for matched bubbles
      const newAnimations = matches.map(b => ({
        x: b.x,
        y: b.y,
        color: b.color,
        progress: 0
      }));
      setPopAnimations(prev => [...prev, ...newAnimations]);

      setBubbles(prev => prev.filter(b => !matches.includes(b)));
      setScore(prev => prev + matches.length * 50);
      
      if (bubbles.length === 0) {
        setLevel(prev => prev + 1);
      }
    }
  };

  const findMatches = (bubble: Bubble): Bubble[] => {
    const matches: Bubble[] = [bubble];
    const toCheck = [bubble];

    while (toCheck.length > 0) {
      const current = toCheck.pop()!;
      const neighbors = bubbles.filter(b => 
        b.color === current.color &&
        !matches.includes(b) &&
        Math.sqrt(
          Math.pow((b.x - current.x), 2) + 
          Math.pow((b.y - current.y), 2)
        ) < BUBBLE_SIZE * 1.5
      );

      matches.push(...neighbors);
      toCheck.push(...neighbors);
    }

    return matches;
  };

  const restartGame = () => {
    setScore(0);
    setLevel(1);
    setGameOver(false);
    initializeGame();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
        <GameStats score={score} level={level} onRestart={restartGame} />
        <GameBoard 
          bubbles={[...bubbles, ...shootingBubbles]} 
          currentBubble={currentBubble} 
          popAnimations={popAnimations}
          onShoot={handleShoot} 
        />
        <div className="mt-4 flex justify-center">
          <div 
            className="w-12 h-12 rounded-full shadow-lg"
            style={{ backgroundColor: currentBubble }}
          />
        </div>
      </div>
    </div>
  );
}