import type { Song } from '#shared/utils/schema';
import path from 'node:path';
import { z } from 'zod';

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
  'PRiSM PLUS',
  'CiRCLE',
  'CiRCLE PLUS',
] as const;
// autocorrect: true

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
          version: z.enum(VERSIONS),
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
    Bun.file(path.resolve(import.meta.dirname, '../app/assets/songs.json')),
    JSON.stringify(output, null, 2),
  );
}

async function maps() {
  return;
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
