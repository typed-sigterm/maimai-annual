import type { ChartDifficulty, ChartType, Song } from '~/shared/schema';

const extractFilename = (path: string) => path.match(/[^/\\]*(?=\.[^.]*$)|[^/\\]*$/)?.[0];

const RatingBg = Object.entries(
  import.meta.glob(
    '@/assets/rating/*.png',
    { eager: true, import: 'default' },
  ),
).map(
  ([k, v]) => [Number(extractFilename(k)!), v] as const,
).sort(
  ([a], [b]) => a - b,
) as Array<[number, string]>;

export function getRatingBg(rating: number) {
  let last = RatingBg[0][1];
  for (const [k, v] of RatingBg) {
    if (k > rating)
      return last;
    last = v;
  }
  return last;
}

export const NumberImage = Object.fromEntries(Object.entries(
  import.meta.glob(
    '@/assets/number/*.png',
    { eager: true, import: 'default' },
  ),
).map(
  ([k, v]) => [extractFilename(k)!, v] as const,
)) as Record<string, string>;

export const DifficultyImage = Object.fromEntries(Object.entries(
  import.meta.glob(
    '@/assets/difficulty/*.png',
    { eager: true, import: 'default' },
  ),
).map(
  ([k, v]) => [extractFilename(k)!, v] as const,
)) as Partial<Record<ChartDifficulty, string>>;

export const TypeImage = Object.fromEntries(Object.entries(
  import.meta.glob(
    '@/assets/type/*.svg',
    { eager: true, import: 'default' },
  ),
).map(
  ([k, v]) => [extractFilename(k)!, v] as const,
)) as Record<ChartType, string>;

const Songs = import('@/assets/songs.json');
export const getSongs = async () => (await Songs).default as Record<string, Song>;
