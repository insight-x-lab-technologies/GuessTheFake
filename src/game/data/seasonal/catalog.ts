import type { ContentPackMeta } from '../../../core/content-packs/content-packs';
import type { GuessTheFakeDifficulty, GuessTheFakeReview } from '../../types';

// W17-06: small optional packs (30 rounds: 10 per difficulty), off by
// default. Texts of all three live in ./texts/<lang>.ts, one lazy chunk per
// language fetched only when a seasonal pack is on.

export type SeasonalPackId = 'seasonal-christmas' | 'seasonal-halloween' | 'seasonal-sports';

export type SeasonalPackEntry = {
  id: SeasonalPackId;
  categoryId: string;
  title: Record<string, string>;
  categoryTitle: Record<string, string>;
  // Same ids as core/themes SEASONS; null = no date window.
  season: 'halloween' | 'festive' | null;
  meta: ContentPackMeta;
  fakeIndexes: Record<GuessTheFakeDifficulty, number[]>;
};

export type SeasonalRoundEntry = {
  id: string;
  packId: SeasonalPackId;
  categoryId: string;
  difficulty: GuessTheFakeDifficulty;
  fakeIndex: number;
};

export const SEASONAL_REVIEW: GuessTheFakeReview = { status: 'reviewed', reviewedAt: '2026-10-03', notes: 'AI-drafted (W17-06); approved as final by the maintainer 2026-10-03' };

const changelog = (notes: Record<string, string>) => [{ version: '1.0.0', date: '2026-10-03', notes }];
const firstRelease = {
  pt: '30 rodadas em seis idiomas.',
  en: '30 rounds in six languages.',
  es: '30 rondas en seis idiomas.',
  fr: '30 manches en six langues.',
  de: '30 Runden in sechs Sprachen.',
  it: '30 round in sei lingue.'
};

export const SEASONAL_PACKS: SeasonalPackEntry[] = [
  {
    id: 'seasonal-christmas',
    categoryId: 'christmas',
    title: { pt: 'Natal', en: 'Christmas', es: 'Navidad', fr: 'Noël', de: 'Weihnachten', it: 'Natale' },
    categoryTitle: { pt: 'Natal', en: 'Christmas', es: 'Navidad', fr: 'Noël', de: 'Weihnachten', it: 'Natale' },
    season: 'festive',
    meta: {
      cover: { emoji: '🎄', color: '#15803d' },
      description: {
        pt: 'Tradições, origens e curiosidades das festas de fim de ano pelo mundo.',
        en: 'Traditions, origins and trivia of the year-end holidays around the world.',
        es: 'Tradiciones, orígenes y curiosidades de las fiestas de fin de año en el mundo.',
        fr: 'Traditions, origines et anecdotes des fêtes de fin d’année dans le monde.',
        de: 'Bräuche, Ursprünge und Kuriositäten der Feiertage zum Jahresende weltweit.',
        it: 'Tradizioni, origini e curiosità delle feste di fine anno nel mondo.'
      },
      audience: 'family',
      difficulty: 'mixed',
      version: '1.0.0',
      author: 'Guess the Fake',
      changelog: changelog(firstRelease),
      license: { kind: 'community' }
    },
    fakeIndexes: { easy: [3, 4, 1, 3, 0, 2, 1, 0, 4, 2], medium: [1, 2, 1, 2, 0, 3, 4, 0, 4, 3], hard: [2, 1, 0, 4, 0, 4, 2, 3, 1, 3] }
  },
  {
    id: 'seasonal-halloween',
    categoryId: 'halloween',
    title: { pt: 'Halloween', en: 'Halloween', es: 'Halloween', fr: 'Halloween', de: 'Halloween', it: 'Halloween' },
    categoryTitle: { pt: 'Halloween', en: 'Halloween', es: 'Halloween', fr: 'Halloween', de: 'Halloween', it: 'Halloween' },
    season: 'halloween',
    meta: {
      cover: { emoji: '🎃', color: '#c2410c' },
      description: {
        pt: 'Abóboras, monstros clássicos e as origens da noite mais assustadora do ano.',
        en: 'Pumpkins, classic monsters and the origins of the spookiest night of the year.',
        es: 'Calabazas, monstruos clásicos y los orígenes de la noche más terrorífica del año.',
        fr: 'Citrouilles, monstres classiques et origines de la nuit la plus effrayante de l’année.',
        de: 'Kürbisse, klassische Monster und die Ursprünge der gruseligsten Nacht des Jahres.',
        it: 'Zucche, mostri classici e le origini della notte più spaventosa dell’anno.'
      },
      audience: 'family',
      difficulty: 'mixed',
      version: '1.0.0',
      author: 'Guess the Fake',
      changelog: changelog(firstRelease),
      license: { kind: 'community' }
    },
    fakeIndexes: { easy: [1, 0, 3, 0, 3, 2, 1, 4, 2, 4], medium: [1, 4, 3, 0, 3, 4, 0, 2, 1, 2], hard: [4, 0, 1, 0, 3, 1, 4, 2, 3, 2] }
  },
  {
    id: 'seasonal-sports',
    categoryId: 'sports-events',
    title: { pt: 'Copa e Olimpíadas', en: 'World Cup and Olympics', es: 'Mundial y Juegos Olímpicos', fr: 'Coupe du monde et JO', de: 'WM und Olympia', it: 'Mondiali e Olimpiadi' },
    categoryTitle: { pt: 'Grandes torneios', en: 'Big tournaments', es: 'Grandes torneos', fr: 'Grands tournois', de: 'Große Turniere', it: 'Grandi tornei' },
    season: null,
    meta: {
      cover: { emoji: '🏆', color: '#1d4ed8' },
      description: {
        pt: 'Histórias e recordes da Copa do Mundo e dos Jogos Olímpicos.',
        en: 'Stories and records from the FIFA World Cup and the Olympic Games.',
        es: 'Historias y récords de la Copa del Mundo y los Juegos Olímpicos.',
        fr: 'Histoires et records de la Coupe du monde et des Jeux olympiques.',
        de: 'Geschichten und Rekorde von Fußball-WM und Olympischen Spielen.',
        it: 'Storie e record dei Mondiali di calcio e dei Giochi olimpici.'
      },
      audience: 'family',
      difficulty: 'mixed',
      version: '1.0.0',
      author: 'Guess the Fake',
      changelog: changelog(firstRelease),
      license: { kind: 'community' }
    },
    fakeIndexes: { easy: [2, 4, 1, 2, 0, 4, 3, 0, 3, 1], medium: [1, 2, 0, 3, 4, 1, 3, 0, 2, 4], hard: [3, 1, 4, 0, 1, 3, 0, 2, 4, 2] }
  }
];

export const SEASONAL_PACK_IDS = SEASONAL_PACKS.map(pack => pack.id);

export function isSeasonalPackId(id: string): id is SeasonalPackId {
  return (SEASONAL_PACK_IDS as string[]).includes(id);
}

export const SEASONAL_ROUNDS: SeasonalRoundEntry[] = SEASONAL_PACKS.flatMap(pack =>
  (['easy', 'medium', 'hard'] as GuessTheFakeDifficulty[]).flatMap(difficulty =>
    pack.fakeIndexes[difficulty].map((fakeIndex, index) => ({
      id: `${pack.categoryId}-${difficulty}-${String(index + 1).padStart(2, '0')}`,
      packId: pack.id,
      categoryId: pack.categoryId,
      difficulty,
      fakeIndex
    }))
  )
);
