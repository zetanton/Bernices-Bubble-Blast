export type BubbleColor = 'RED' | 'BLUE' | 'GREEN' | 'YELLOW';

export interface Bubble {
  color: BubbleColor;
  id: string;
  x: number;
  y: number;
  isFalling?: boolean;
  jiggle?: number;
}

export interface ShootingBubble extends Bubble {
  dx: number;
  dy: number;
}

export interface GridBubble extends Bubble {
  row: number;
  col: number;
}

export interface PopAnimation {
  x: number;
  y: number;
  color: BubbleColor;
  progress: number;
}