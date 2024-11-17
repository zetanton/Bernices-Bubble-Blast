import { useEffect, useState } from 'react';
import GameBoard from './GameBoard';
import GameStats from './GameStats';
import { type Bubble, type ShootingBubble, type PopAnimation, type BubbleColor } from '../types/game';
import StartScreen from './StartScreen';
import { ALL_STAGES, STAGE_COLORS, type Stage, STAGES } from '../types/stages';
import StageSelect from './StageSelect';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { playSound, stopBackgroundMusic } from '../utils/sound';

const BUBBLE_SIZE = 35;
const ROWS = 7;
const COLS = 8;
const SHOOT_SPEED = 15;
const CANVAS_HEIGHT = ROWS * BUBBLE_SIZE * 2; // Height is double the playable area

export function Game() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentBubble, setCurrentBubble] = useState<BubbleColor>('RED');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [shootingBubbles, setShootingBubbles] = useState<ShootingBubble[]>([]);
  const [popAnimations, setPopAnimations] = useState<PopAnimation[]>([]);
  const [gameState, setGameState] = useState<'start' | 'stage-select' | 'playing'>('start');
  const [stages, setStages] = useState(() => 
    Object.values(STAGES).map(stage => ({
      ...stage,
      isLocked: stage.id !== 1
    }))
  );
  const [currentStage, setCurrentStage] = useState<Stage | null>(null);
  const [shotsRemaining, setShotsRemaining] = useState(0);
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [isCompletingLevel, setIsCompletingLevel] = useState(false);

  useEffect(() => {
    const defaultPattern = ALL_STAGES[0].pattern;
    initializeGame(defaultPattern);
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      updateShootingBubbles();
      updatePopAnimations();
      
      setBubbles(prev => prev.map(b => {
        if (b.isFalling) {
          const fallSpeed = 5;
          const newY = b.y + fallSpeed;
          
          if (newY > CANVAS_HEIGHT) {
            setScore(s => s + 30);
            return null as unknown as Bubble;
          }
          
          return { ...b, y: newY };
        }
        if (b.jiggle && b.jiggle > 0) {
          return { ...b, jiggle: b.jiggle - 0.1 };
        }
        return b;
      }).filter(Boolean));
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

  const initializeGame = (pattern: string[][], stage?: Stage) => {
    const initialBubbles: Bubble[] = [];
    
    pattern.forEach((row, rowIndex) => {
      row.forEach((color, colIndex) => {
        if (color !== '-') {
          const x = colIndex * BUBBLE_SIZE + (rowIndex % 2 ? BUBBLE_SIZE/2 : 0);
          initialBubbles.push({
            x,
            y: rowIndex * BUBBLE_SIZE,
            color: STAGE_COLORS[color as keyof typeof STAGE_COLORS],
            id: `${rowIndex}-${colIndex}`,
          });
        }
      });
    });

    setBubbles(initialBubbles);
    setShootingBubbles([]);
    setPopAnimations([]);
    setScore(0);
    setGameOver(false);
    
    // Use the passed stage instead of currentStage
    if (stage) {
      setShotsRemaining(stage.maxShots);
      setCurrentShotIndex(0);
      
      if (stage.shotSequence && stage.shotSequence.length > 0) {
        setCurrentBubble(stage.shotSequence[0]);
      } else {
        setCurrentBubble(stage.availableColors[0]);
      }
    }
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

      if (collided.length > 0) {
        collided.forEach(bubble => {
          const snappedPosition = snapToGrid(bubble);
          const newBubble = {
            ...bubble,
            x: snappedPosition.x,
            y: snappedPosition.y,
          };
          setBubbles(prev => [...prev, newBubble]);
          checkMatches(newBubble);
        });
      }

      return updated.filter(bubble => !collided.includes(bubble));
    });
  };

  const checkCollision = (bubble: ShootingBubble): boolean => {
    return bubbles.some(existing => {
      // Skip collision check for falling bubbles
      if (existing.isFalling) {
        return false;
      }
      
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
    if (gameOver || shootingBubbles.length > 0) {
      return;
    }

    if (shotsRemaining <= 0) {
      playSound('nobubbles');
      return;
    }

    playSound('shot');
    setShotsRemaining(prev => prev - 1);
    
    const newBubble: ShootingBubble = {
      x: COLS * BUBBLE_SIZE / 2 - BUBBLE_SIZE/2,
      y: CANVAS_HEIGHT - BUBBLE_SIZE * 1.2,
      color: currentBubble as BubbleColor,
      id: Date.now().toString(),
      dx: Math.cos(angle) * SHOOT_SPEED,
      dy: Math.sin(angle) * SHOOT_SPEED,
    };

    setShootingBubbles(prev => [...prev, newBubble]);
    
    // Update to next bubble in sequence
    const nextShotIndex = currentShotIndex + 1;
    setCurrentShotIndex(nextShotIndex);
    
    if (currentStage?.shotSequence && nextShotIndex < currentStage.shotSequence.length) {
      setCurrentBubble(currentStage.shotSequence[nextShotIndex]);
    } else {
      setCurrentBubble(currentStage?.availableColors[
        Math.floor(Math.random() * currentStage.availableColors.length)
      ] ?? 'RED');
    }
  };

  const checkMatches = (bubble: Bubble) => {
    const matches = findMatches(bubble);
    
    if (matches.length >= 3) {
      playSound('pop');
      
      // Add pop animations
      const newAnimations = matches.map(b => ({
        x: b.x,
        y: b.y,
        color: b.color,
        progress: 0
      }));
      setPopAnimations(prev => [...prev, ...newAnimations]);

      // Update bubbles
      setBubbles(prev => {
        const remaining = prev.filter(b => !matches.some(m => m.id === b.id));
        const connected = findConnectedBubbles(remaining);
        return remaining.map(b => 
          connected.includes(b) ? b : { ...b, isFalling: true }
        );
      });

      setScore(prev => prev + matches.length * 50);
    }
  };

  const findMatches = (bubble: Bubble): Bubble[] => {
    const matches = new Set<Bubble>([bubble]);
    const toCheck = [bubble];

    while (toCheck.length > 0) {
      const current = toCheck.pop()!;
      const neighbors = bubbles.filter(b => 
        b.color === current.color &&
        !matches.has(b) &&
        Math.sqrt(
          Math.pow((b.x - current.x), 2) + 
          Math.pow((b.y - current.y), 2)
        ) < BUBBLE_SIZE * 1.2
      );

      neighbors.forEach(n => {
        if (!matches.has(n)) {
          matches.add(n);
          toCheck.push(n);
        }
      });
    }

    return Array.from(matches);
  };

  const findConnectedBubbles = (bubbles: Bubble[]): Bubble[] => {
    const connected = new Set<Bubble>();
    const toCheck = bubbles.filter(b => b.y <= BUBBLE_SIZE/2); // Start with top row

    while (toCheck.length > 0) {
      const current = toCheck.pop()!;
      if (!connected.has(current)) {
        connected.add(current);
        
        // Find neighbors within 1.2 bubble diameter
        const neighbors = bubbles.filter(b => 
          !connected.has(b) &&
          !toCheck.includes(b) &&
          Math.sqrt(
            Math.pow(b.x - current.x, 2) + 
            Math.pow(b.y - current.y, 2)
          ) < BUBBLE_SIZE * 1.2
        );
        
        toCheck.push(...neighbors);
      }
    }

    return Array.from(connected);
  };

  const restartGame = () => {
    setScore(0);
    setGameOver(false);
    if (currentStage) {
      initializeGame(currentStage.pattern, currentStage);
    }
    setCurrentShotIndex(0);
    setShotsRemaining(currentStage?.maxShots ?? 0);
  };


  const handleStageSelect = (stageId: number) => {
    stopBackgroundMusic();
    playSound('select', true);
    const freshStage = STAGES[stageId];
    
    setCurrentStage(freshStage);
    setGameState('playing');
    setShotsRemaining(freshStage.maxShots);
    setCurrentShotIndex(0);
    
    // Start game background music
    playSound('background', true);
    
    if (freshStage.shotSequence && freshStage.shotSequence.length > 0) {
      setCurrentBubble(freshStage.shotSequence[0]);
    } else {
      setCurrentBubble(freshStage.availableColors[0]);
    }
    
    initializeGame(freshStage.pattern, freshStage);
  };

  const handleBackToStageSelect = () => {
    stopBackgroundMusic();
    playSound('select', true);
    setGameState('stage-select');
    setCurrentStage(null);
  };

  useEffect(() => {
    if (!isCompletingLevel && currentStage && gameState === 'playing') {
      const nonFallingBubbles = bubbles.filter(b => !b.isFalling);
      
      if (nonFallingBubbles.length === 0) {
        setIsCompletingLevel(true);
        stopBackgroundMusic();
        playSound('stagecomplete');
        
        setBubbles(prev => 
          prev.map(b => ({ ...b, isFalling: true, fadeOut: true }))
        );
        
        setTimeout(() => {
          setGameState('stage-select');
          setStages((prev: Stage[]) => prev.map((stage: Stage) => {
            if (stage.id === currentStage.id) {
              return { ...stage, isCompleted: true };
            }
            if (stage.id === currentStage.id + 1) {
              return { ...stage, isLocked: false };
            }
            return stage;
          }));
          setIsCompletingLevel(false);
        }, 1000);
      }
    }
  }, [bubbles, currentStage, isCompletingLevel, gameState]);

  const unlockAllStages = () => {
    setStages(prev => 
      prev.map(stage => ({
        ...stage,
        isLocked: false
      }))
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-lg mx-auto">
      {gameState === 'start' && (
        <StartScreen onStart={() => setGameState('stage-select')} />
      )}
      {gameState === 'stage-select' && (
        <>
          <StageSelect 
            stages={stages} 
            onStageSelect={handleStageSelect}
            onBack={() => setGameState('start')}
          />
          <button
            onClick={unlockAllStages}
            className="fixed bottom-4 right-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 
                       text-white rounded-lg shadow-lg transition-all hover:scale-105 
                       border-2 border-purple-400"
          >
            Unlock All Stages
          </button>
        </>
      )}
      {gameState === 'playing' && currentStage && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-2xl w-full">
          <GameStats 
            score={score} 
            level={currentStage.id} 
            shotsRemaining={shotsRemaining}
          />
          <div className="flex justify-center">
            <GameBoard 
              bubbles={[...bubbles, ...shootingBubbles]} 
              currentBubble={currentBubble} 
              popAnimations={popAnimations}
              onShoot={handleShoot} 
            />
          </div>
          <div className="mt-4 flex justify-center items-center gap-4">
            <div 
              className="w-10 h-10 rounded-full shadow-lg"
              style={{ backgroundColor: currentBubble }}
            />
            <div className="flex gap-2">
              <button
                onClick={restartGame}
                className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl 
                         shadow-lg transition-all hover:scale-105 border-2 border-purple-400"
                title="Restart Stage"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleBackToStageSelect}
                className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl 
                         shadow-lg transition-all hover:scale-105 border-2 border-purple-400"
                title="Exit Stage"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}