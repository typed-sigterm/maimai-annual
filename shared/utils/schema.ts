export type ChartType = 'std' | 'dx';
export type ChartDifficulty = 'basic' | 'advanced' | 'expert' | 'master' | 'remaster';

export const ChartTypeLabel: Record<ChartType, string> = {
  std: '标准',
  dx: 'DX',
};

export const ChartDifficultyLabel: Record<ChartDifficulty, string> = {
  basic: 'BASIC',
  advanced: 'ADVANCED',
  expert: 'EXPERT',
  master: 'MASTER',
  remaster: 'Re: MASTER',
};

export interface Song {
  title: string
  version: string
  image: string
  charts: {
    type: ChartType
    difficulty: ChartDifficulty
  }[]
}

export type ChartWithLevel = {
  id: string
  type: ChartType
  difficulty: ChartDifficulty
} | {
  id: string
};
