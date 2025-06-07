export type ChartType = 'std' | 'dx';
export const ChartTypeLabel: Record<ChartType, string> = {
  std: '标准',
  dx: 'DX',
};

export type ChartDifficulty = 'basic' | 'advanced' | 'expert' | 'master' | 'remaster';
export const ChartDifficultyLabel: Record<ChartDifficulty, string> = {
  basic: 'BASIC',
  advanced: 'ADVANCED',
  expert: 'EXPRET',
  master: 'MASTER',
  remaster: 'Re: MASTER',
};

export interface Chart {
  type: ChartType
  difficulty: ChartDifficulty
}

export interface Song {
  title: string
  version: string
  charts: Chart[]
  image: string
}
