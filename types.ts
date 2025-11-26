export interface LottoSet {
  id: string;
  numbers: number[];
  timestamp: number;
  aiComment?: string;
}

export enum AppStep {
  INTRO = 'INTRO',
  EXCLUSION = 'EXCLUSION',
  GENERATION = 'GENERATION',
}

export type NumberStatus = 'available' | 'excluded' | 'selected';
