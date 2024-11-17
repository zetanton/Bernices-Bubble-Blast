import { BubbleColor } from './game';

export interface Stage {
  id: number;
  pattern: string[][];
  maxShots: number;
  isLocked: boolean;
  isCompleted: boolean;
  availableColors: BubbleColor[];
  shotSequence?: BubbleColor[];
}

export const STAGE_COLORS: Record<string, BubbleColor> = {
  'R': 'RED',
  'B': 'BLUE',
  'G': 'GREEN',
  'Y': 'YELLOW'
};

export const STAGES: Record<number, Stage> = {
  1: {
    id: 1,
    pattern: [
      ['-', 'B', 'R'],
      ['B', 'R', 'B'],
      ['R', 'B', 'R']
    ],
    maxShots: 4,
    isLocked: false,
    isCompleted: false,
    availableColors: ['RED', 'BLUE'],
    shotSequence: ['BLUE', 'RED', 'BLUE', 'RED']
  },
  2: {
    id: 2,
    pattern: [
      ['G', 'Y', 'G', '-'],
      ['Y', 'G', 'Y', 'G'],
      ['G', 'Y', 'G', 'Y']
    ],
    maxShots: 5,
    isLocked: true,
    isCompleted: false,
    availableColors: ['GREEN', 'YELLOW'],
    shotSequence: ['YELLOW', 'GREEN', 'YELLOW', 'GREEN', 'YELLOW']
  },
  3: {
    id: 3,
    pattern: [
      ['-', 'R', 'B', 'G'],
      ['R', 'B', 'G', 'R'],
      ['B', 'G', 'R', 'B'],
      ['G', 'R', 'B', 'G']
    ],
    maxShots: 6,
    isLocked: true,
    isCompleted: false,
    availableColors: ['RED', 'BLUE', 'GREEN'],
    shotSequence: ['RED', 'BLUE', 'GREEN', 'RED', 'BLUE', 'GREEN']
  },
  4: {
    id: 4,
    pattern: [
      ['Y', 'R', 'G', 'B', '-'],
      ['Y', 'R', 'G', 'B', 'Y'],
      ['R', 'G', 'B', 'Y', 'R'],
      ['G', 'B', 'Y', 'R', 'G']
    ],
    maxShots: 8,
    isLocked: true,
    isCompleted: false,
    availableColors: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
    shotSequence: ['YELLOW', 'RED', 'GREEN', 'BLUE', 'YELLOW', 'RED', 'GREEN', 'BLUE']
  },
  5: {
    id: 5,
    pattern: [
      ['-', 'R', 'R', 'B'],
      ['B', 'B', 'R', 'B'],
      ['R', 'B', 'B', 'R'],
      ['B', 'R', 'R', 'B']
    ],
    maxShots: 6,
    isLocked: true,
    isCompleted: false,
    availableColors: ['RED', 'BLUE'],
    shotSequence: ['RED', 'BLUE', 'RED', 'BLUE', 'RED', 'BLUE']
  },
  6: {
    id: 6,
    pattern: [
      ['G', 'Y', 'G', '-', 'Y'],
      ['Y', 'G', 'Y', 'G', 'Y'],
      ['G', 'Y', 'G', 'Y', 'G'],
      ['Y', 'G', 'Y', 'G', 'Y']
    ],
    maxShots: 7,
    isLocked: true,
    isCompleted: false,
    availableColors: ['GREEN', 'YELLOW'],
    shotSequence: ['YELLOW', 'GREEN', 'YELLOW', 'GREEN', 'YELLOW', 'GREEN', 'YELLOW']
  },
  7: {
    id: 7,
    pattern: [
      ['R', 'B', '-', 'B', 'R'],
      ['B', 'R', 'B', 'R', 'B'], 
      ['R', 'B', 'R', 'B', 'R'],
      ['B', 'R', 'B', 'R', 'B']
    ],
    maxShots: 10,
    isLocked: true,
    isCompleted: false,
    availableColors: ['RED', 'BLUE'],
    shotSequence: ['BLUE', 'BLUE', 'RED', 'RED', 'BLUE', 'BLUE', 'RED', 'RED', 'BLUE', 'BLUE']
  },
  8: {
    id: 8,
    pattern: [
      ['Y', 'G', 'B', '-', 'B'],
      ['G', 'B', 'Y', 'B', 'Y'],
      ['B', 'Y', 'B', 'G', 'R'],
      ['R', 'B', 'G', 'Y', 'G']
    ],
    maxShots: 8,
    isLocked: true,
    isCompleted: false,
    availableColors: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
    shotSequence: ['BLUE', 'YELLOW', 'BLUE', 'GREEN', 'YELLOW', 'YELLOW', 'BLUE', 'YELLOW']
  }, 
  9: {
    id: 9,
    pattern: [
        ['R', 'R', 'G', 'Y', 'R'],
        ['R', 'G', 'Y', 'R', 'B'],
        ['G', 'Y', 'R', 'B', 'G'],
        ['Y', 'R', 'B', 'G', 'Y']
    ],
    maxShots: 8,
    isLocked: true,
    isCompleted: false,
    availableColors: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
    shotSequence: ['RED', 'GREEN', 'BLUE', 'YELLOW', 'RED', 'GREEN', 'BLUE', 'RED']
},
  10: {
    id: 10,
    pattern: [
      ['B', 'Y', 'B', 'Y', 'B'],
      ['Y', 'B', 'Y', 'B', 'Y'],
      ['B', 'Y', 'R', 'Y', 'B'],
      ['Y', 'B', 'Y', 'B', 'Y']
    ],
    maxShots: 8,
    isLocked: true,
    isCompleted: false,
    availableColors: ['BLUE', 'YELLOW'],
    shotSequence: ['BLUE', 'YELLOW', 'BLUE', 'YELLOW', 'BLUE', 'YELLOW', 'BLUE', 'YELLOW']
  },
  11: {
    id: 11,
    pattern: [
      ['B', 'B', 'G', 'B', 'B'],
      ['G', 'B', 'R', 'B', 'R'],
      ['B', 'R', 'Y', 'B', 'G'],
      ['R', 'G', 'B', 'R', 'B']
    ],
    maxShots: 9,
    isLocked: true,
    isCompleted: false,
    availableColors: ['RED', 'GREEN', 'BLUE'],
    shotSequence: ['RED', 'GREEN', 'BLUE', 'RED', 'GREEN', 'BLUE', 'RED', 'GREEN', 'GREEN']
  },
  12: {
    id: 12,
    pattern: [
      ['Y', 'G', '-', '-', 'Y'],
      ['G', 'Y', 'G', 'Y', 'G'], 
      ['Y', 'B', 'Y', 'B', 'Y'],
      ['G', 'Y', 'B', 'Y', 'G']
    ],
    maxShots: 10,
    isLocked: true,
    isCompleted: false,
    availableColors: ['YELLOW', 'GREEN', 'BLUE'],
    shotSequence: ['YELLOW', 'GREEN', 'BLUE', 'GREEN', 'YELLOW', 'BLUE', 'YELLOW', 'GREEN', 'YELLOW', 'YELLOW']
  },
  13: {
    id: 13,
    pattern: [
      ['R', '-', 'B', 'G', 'Y'],
      ['Y', 'R', '-', 'B', 'G'],
      ['G', 'Y', 'R', 'Y', 'B'],
      ['Y', 'G', 'Y', 'R', '-']
    ],
    maxShots: 12,
    isLocked: true,
    isCompleted: false,
    availableColors: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
    shotSequence: ['YELLOW', 'BLUE', 'GREEN', 'YELLOW', 'RED', 'BLUE', 'GREEN', 'YELLOW', 'RED', 'BLUE', 'GREEN', 'YELLOW']
  },
  14: {
    id: 14,
    pattern: [
      ['G', 'Y', 'B', 'R', '-'],
      ['Y', 'B', 'R', 'G', 'Y'],
      ['B', 'R', 'G', 'Y', 'B'],
      ['R', 'G', 'Y', 'B', 'R']
    ],
    maxShots: 12,
    isLocked: true,
    isCompleted: false,
    availableColors: ['RED', 'GREEN', 'BLUE', 'YELLOW'],
    shotSequence: ['RED', 'GREEN', 'BLUE', 'YELLOW', 'RED', 'GREEN', 'BLUE', 'YELLOW', 'RED', 'GREEN', 'BLUE', 'YELLOW']
  },
  15: {
    id: 15,
    pattern: [
      ['R', 'Y', 'G', 'G', 'R'],
      ['Y', 'R', 'R', 'R', 'Y'],
      ['R', 'Y', 'R', 'Y', 'R'],
      ['Y', 'R', 'Y', 'R', 'Y']
    ],
    maxShots: 4,
    isLocked: true,
    isCompleted: false,
    availableColors: ['RED', 'YELLOW', 'GREEN'],
    shotSequence: ['YELLOW', 'RED', 'YELLOW', 'GREEN']
  },
  16: {
    id: 16,
    pattern: [
      ['B', 'R', '-', 'R', 'B'],
      ['R', 'B', 'R', 'B', 'R'],
      ['B', 'R', 'B', 'R', 'B'],
      ['R', 'B', 'R', 'B', 'R']
    ],
    maxShots: 11,
    isLocked: true,
    isCompleted: false,
    availableColors: ['RED', 'BLUE', 'YELLOW'],
    shotSequence: ['YELLOW', 'RED', 'BLUE', 'RED', 'BLUE', 'RED', 'BLUE', 'RED', 'BLUE', 'RED', 'BLUE']
  },
  17: {
    id: 17,
    pattern: [
      ['R', 'B', 'G', '-', 'R'],
      ['B', 'G', 'Y', 'R', 'B'],
      ['G', 'Y', 'R', 'B', 'G'],
      ['Y', 'R', 'B', 'G', 'Y']
    ],
    maxShots: 11,
    isLocked: true,
    isCompleted: false,
    availableColors: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
    shotSequence: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'RED', 'BLUE', 'GREEN', 'RED', 'BLUE', 'GREEN', 'RED']
  },
  18: {
    id: 18,
    pattern: [
      ['Y', 'Y', '-', 'Y', 'Y'],
      ['R', 'B', 'R', 'B', 'R'],
      ['B', 'R', 'B', 'R', 'B'],
      ['R', 'B', 'R', 'B', 'R']
    ],
    maxShots: 12,
    isLocked: true,
    isCompleted: false,
    availableColors: ['RED', 'BLUE', 'YELLOW'],
    shotSequence: ['BLUE', 'RED', 'BLUE', 'RED', 'BLUE', 'RED', 'BLUE', 'RED', 'BLUE', 'RED', 'BLUE', 'YELLOW']
  }
  ,
  19: {
    id: 19,
    pattern: [
      ['G', 'B', 'G', '-', 'B', 'B'],
      ['B', 'G', 'Y', 'R', 'B', 'G'],
      ['G', 'Y', 'R', 'B', 'G', 'Y'],
      ['Y', 'R', 'B', 'G', 'Y', 'R'],
      ['R', 'G', 'G', 'Y', 'R', 'B']
    ],
    maxShots: 15,
    isLocked: true,
    isCompleted: false,
    availableColors: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
    shotSequence: ['GREEN', 'BLUE', 'RED', 'YELLOW', 'GREEN', 'RED', 'YELLOW', 'BLUE', 'GREEN', 'BLUE', 'YELLOW', 'BLUE', 'RED', 'YELLOW', 'GREEN']
  }



};



export const ALL_STAGES: Stage[] = Object.values(STAGES); 