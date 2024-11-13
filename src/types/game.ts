export interface Bubble {
  x: number;
  y: number;
  color: string;
  id: string;
}

export interface ShootingBubble extends Bubble {
  dx: number;
  dy: number;
}

export interface PopAnimation {
  x: number;
  y: number;
  color: string;
  progress: number;
}