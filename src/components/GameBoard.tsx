import React, { useEffect, useRef } from 'react';
import { type Bubble, type PopAnimation } from '../types/game';

interface GameBoardProps {
  bubbles: Bubble[];
  currentBubble: string;
  popAnimations: PopAnimation[];
  onShoot: (angle: number) => void;
}

export default function GameBoard({ bubbles, currentBubble, popAnimations, onShoot }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const BUBBLE_SIZE = 40;
  const CANVAS_WIDTH = BUBBLE_SIZE * 10;
  const CANVAS_HEIGHT = BUBBLE_SIZE * 15;

  const drawBubble = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number = BUBBLE_SIZE) => {
    const centerX = x + size/2;
    const centerY = y + size/2;
    const radius = size/2 - 2;

    // Main bubble
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Outer glow
    const glowGradient = ctx.createRadialGradient(
      centerX, centerY, radius - 2,
      centerX, centerY, radius
    );
    glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Glossy highlight
    const highlight = ctx.createRadialGradient(
      centerX - radius/3, centerY - radius/3, radius/10,
      centerX - radius/3, centerY - radius/3, radius/1.5
    );
    highlight.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = highlight;
    ctx.fill();

    // Small shine dot
    ctx.beginPath();
    ctx.arc(centerX - radius/3, centerY - radius/3, radius/6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();

    // Subtle outline
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid (optional, for debugging)
    ctx.strokeStyle = '#ffffff11';
    for (let x = 0; x <= CANVAS_WIDTH; x += BUBBLE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += BUBBLE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Draw existing bubbles
    bubbles.forEach(bubble => {
      drawBubble(ctx, bubble.x, bubble.y, bubble.color);
    });

    // Draw pop animations
    popAnimations.forEach(anim => {
      ctx.beginPath();
      const radius = (BUBBLE_SIZE/2 - 2) * (1 + anim.progress * 0.5);
      ctx.arc(
        anim.x + BUBBLE_SIZE/2, 
        anim.y + BUBBLE_SIZE/2, 
        radius,
        0, 
        Math.PI * 2
      );
      
      // Create explosion effect
      const gradient = ctx.createRadialGradient(
        anim.x + BUBBLE_SIZE/2,
        anim.y + BUBBLE_SIZE/2,
        0,
        anim.x + BUBBLE_SIZE/2,
        anim.y + BUBBLE_SIZE/2,
        radius
      );
      gradient.addColorStop(0, `${anim.color}ff`);
      gradient.addColorStop(0.7, `${anim.color}88`);
      gradient.addColorStop(1, `${anim.color}00`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add sparkles
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5 + anim.progress * Math.PI;
        const sparkleX = anim.x + BUBBLE_SIZE/2 + Math.cos(angle) * radius;
        const sparkleY = anim.y + BUBBLE_SIZE/2 + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 2 * (1 - anim.progress), 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
    });

    // Draw shooter
    drawBubble(ctx, canvas.width/2 - BUBBLE_SIZE/2, canvas.height - BUBBLE_SIZE, currentBubble);

    // Draw shooter guide line
    const rect = canvas.getBoundingClientRect();
    const mouseX = (window.mouseX || canvas.width/2) - rect.left;
    const mouseY = (window.mouseY || 0) - rect.top;
    const shooterX = canvas.width/2;
    const shooterY = canvas.height - BUBBLE_SIZE/2;
    const angle = Math.atan2(mouseY - shooterY, mouseX - shooterX);
    
    ctx.beginPath();
    ctx.moveTo(shooterX, shooterY);
    ctx.lineTo(
      shooterX + Math.cos(angle) * BUBBLE_SIZE * 2,
      shooterY + Math.sin(angle) * BUBBLE_SIZE * 2
    );
    ctx.strokeStyle = '#ffffff44';
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [bubbles, currentBubble, popAnimations]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    window.mouseX = e.clientX;
    window.mouseY = e.clientY;
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const shooterX = canvas.width / 2;
    const shooterY = canvas.height - BUBBLE_SIZE/2;
    const angle = Math.atan2(y - shooterY, x - shooterX);
    
    onShoot(angle);
  };

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      className="bg-black/20 rounded-lg cursor-crosshair"
    />
  );
}