export type Position = 'QB' | 'RB' | 'WR' | 'TE';

export interface Player {
  id: string;
  name: string;
  team: string;
  teamCode: string;
  position: Position;
  number: number;
  color: string;
  tint: string;
  imageId: string;
  sample: {
    games: number;
    snaps: number;
    workload: number;
    priorInjuries: number;
    restDays: number;
    probability: number;
  };
}

export interface Prediction {
  id: string;
  playerId: string;
  probability: number;
  risk: 'Lower' | 'Moderate' | 'Higher';
  timeframe: string;
  createdAt: string;
  source: 'demo';
  factors: { label: string; value: string; contribution: number; description: string }[];
}

export type View = 'explore' | 'profile' | 'analyzing' | 'result' | 'roster' | 'predictions';
