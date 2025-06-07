import type { Song } from '../shared/schema';
import path from 'node:path';
import { z } from 'zod/v4';

// autocorrect: false
const VERSIONS = [
  'maimai',
  'maimai PLUS',
  'GreeN',
  'GreeN PLUS',
  'ORANGE',
  'ORANGE PLUS',
  'PiNK',
  'PiNK PLUS',
  'MURASAKi',
  'MURASAKi PLUS',
  'MiLK',
  'MiLK PLUS',
  'FiNALE',
  'maimaiでらっくす',
  'maimaiでらっくす PLUS',
  'Splash',
  'Splash PLUS',
  'UNiVERSE',
  'UNiVERSE PLUS',
  'FESTiVAL',
  'FESTiVAL PLUS',
  'BUDDiES',
  'BUDDiES PLUS',
  'PRiSM',
] as const;
// autocorrect: true
const FUTURE_VERSION = 'PRiSM PLUS'; // 国行版 +2，需要过滤掉

async function songs() {
  const SourceSchema = z.looseObject({
    songs: z.array(z.looseObject({
      songId: z.string(),
      title: z.string(),
      imageName: z.string(),
      sheets: z.array(z.union([
        z.looseObject({
          type: z.enum(['std', 'dx']),
          difficulty: z.enum(['basic', 'advanced', 'expert', 'master', 'remaster']),
          internalLevelValue: z.number(),
          version: z.enum([...VERSIONS, FUTURE_VERSION]),
        }),
        z.looseObject({
          type: z.enum(['utage', 'utage1p', 'utage2p']),
        }),
      ])),
    })),
  });

  const source = SourceSchema.parse(
    await (await fetch('https://raw.githubusercontent.com/gekichumai/dxrating/main/packages/dxdata/dxdata.json')).json(),
  );
  const output: Record<string, Song> = {};

  for (const song of source.songs) {
    output[song.songId] = {
      charts: [],
      image: song.imageName,
      title: song.title,
      version: '',
    };

    for (const sheet of song.sheets) {
      if (sheet.version === FUTURE_VERSION)
        continue;
      if (sheet.type !== 'std' && sheet.type !== 'dx')
        continue; // 过滤宴谱
      output[song.songId].charts.push({
        type: sheet.type,
        difficulty: sheet.difficulty,
      });
    }

    if (output[song.songId].charts.length === 0) {
      delete output[song.songId];
    } else {
      output[song.songId].version = VERSIONS.find(
        v => song.sheets.some(s => s.version === v),
      )!;
    }
  }

  await Bun.write(
    Bun.file(path.resolve(import.meta.dirname, '../src/assets/songs.json')),
    JSON.stringify(output, null, 2),
  );
}

async function maps() {
  const SourceSchema = z.array(z.object({
    id: z.string(),
    name: z.string(),
  }));

  const source = SourceSchema.parse(
    await (await fetch('https://dev.maimai.moe/api/maimai/areas?lang=ja&page=1&page_size=100')).json(),
  );
  const output: Record<string, string> = Object.fromEntries(source.map(m => [m.id, m.name]));

  await Bun.write(
    Bun.file(path.resolve(import.meta.dirname, '../src/assets/maps.json')),
    JSON.stringify(output, null, 2),
  );
}

await Promise.all([songs(), maps()]);
