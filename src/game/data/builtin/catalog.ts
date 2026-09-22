import type { GuessTheFakeAgeRating, GuessTheFakeDifficulty, GuessTheFakePackContent, GuessTheFakeReview } from '../../types';
import { BUILTIN_REVIEWS } from './reviews';

// Language-neutral structure of the builtin pack. Texts live in ./texts/<lang>.ts,
// keyed by round id, so each language ships as its own lazy chunk.

export const BUILTIN_PACK_ID = 'core-family-facts';

export const BUILTIN_PACK_TITLE: Record<string, string> = {
  pt: 'Fatos de Família',
  en: 'Family Facts',
  es: 'Datos en familia',
  fr: 'Faits en famille',
  de: 'Familienfakten',
  it: 'Fatti in famiglia'
};

export type BuiltinCategoryId = 'history' | 'geography' | 'science' | 'animals' | 'pop-culture' | 'sports' | 'weird-facts';

export const BUILTIN_CATEGORIES: GuessTheFakePackContent['categories'] = [
  { id: 'history', title: { pt: 'História', en: 'History', es: 'Historia', fr: 'Histoire', de: 'Geschichte', it: 'Storia' } },
  { id: 'geography', title: { pt: 'Geografia', en: 'Geography', es: 'Geografía', fr: 'Géographie', de: 'Geografie', it: 'Geografia' } },
  { id: 'science', title: { pt: 'Ciência', en: 'Science', es: 'Ciencia', fr: 'Science', de: 'Wissenschaft', it: 'Scienza' } },
  { id: 'animals', title: { pt: 'Animais', en: 'Animals', es: 'Animales', fr: 'Animaux', de: 'Tiere', it: 'Animali' } },
  { id: 'pop-culture', title: { pt: 'Cultura pop', en: 'Pop culture', es: 'Cultura pop', fr: 'Culture pop', de: 'Popkultur', it: 'Cultura pop' } },
  { id: 'sports', title: { pt: 'Esportes', en: 'Sports', es: 'Deportes', fr: 'Sports', de: 'Sport', it: 'Sport' } },
  { id: 'weird-facts', title: { pt: 'Fatos bizarros', en: 'Weird facts', es: 'Datos curiosos', fr: 'Faits insolites', de: 'Kuriose Fakten', it: 'Fatti curiosi' } }
];

export type BuiltinRoundEntry = {
  id: string;
  categoryId: BuiltinCategoryId;
  difficulty: GuessTheFakeDifficulty;
  fakeIndex: number;
  ageRating: GuessTheFakeAgeRating;
  sources: string[];
  review: GuessTheFakeReview;
};

// Reference works used to check each category. AI-drafted content stays
// `draft` until a human runs the checklist in docs/CONTENT_GUIDE.md and logs
// the round in ./reviews.ts.
const categorySources: Record<BuiltinCategoryId, string[]> = {
  history: ['Encyclopaedia Britannica'],
  geography: ['Encyclopaedia Britannica', 'CIA World Factbook'],
  science: ['NASA', 'Encyclopaedia Britannica'],
  animals: ['National Geographic', 'Smithsonian'],
  'pop-culture': ['Encyclopaedia Britannica', 'official publisher sites'],
  sports: ['olympics.com', 'Encyclopaedia Britannica'],
  'weird-facts': ['Smithsonian Magazine', 'Encyclopaedia Britannica']
};

// Fake statement position (0-4) of each round, by category and difficulty.
const fakeIndexes: Record<BuiltinCategoryId, Record<GuessTheFakeDifficulty, number[]>> = {
  history: { easy: [2, 4, 0, 3, 4, 0, 0, 2, 4, 1, 3, 3, 1, 1, 2], medium: [1, 3, 0, 2, 2, 4, 1, 3, 2, 3, 4, 0, 4, 0, 1], hard: [4, 1, 3, 0, 2, 1, 2, 3, 4, 4, 0, 1, 2, 0, 3] },
  geography: { easy: [1, 3, 0, 4, 1, 1, 3, 0, 0, 2, 2, 2, 4, 4, 3], medium: [2, 0, 4, 3, 3, 0, 2, 4, 0, 1, 2, 4, 3, 1, 1], hard: [1, 3, 0, 2, 2, 3, 0, 3, 0, 4, 4, 1, 2, 4, 1] },
  science: { easy: [0, 2, 4, 1, 3, 0, 3, 4, 4, 0, 1, 1, 2, 2, 3], medium: [3, 0, 4, 1, 3, 2, 0, 2, 4, 1, 1, 0, 3, 4, 2], hard: [2, 0, 3, 4, 1, 1, 4, 3, 0, 3, 2, 4, 1, 0, 2] },
  animals: { easy: [2, 0, 4, 1, 0, 1, 3, 3, 4, 2, 3, 0, 2, 1, 4], medium: [3, 0, 2, 4, 2, 0, 4, 1, 3, 3, 0, 4, 2, 1, 1], hard: [1, 3, 0, 2, 0, 1, 2, 2, 1, 4, 0, 3, 4, 4, 3] },
  'pop-culture': { easy: [3, 0, 4, 1, 0, 2, 2, 0, 3, 1, 1, 4, 2, 3, 4], medium: [2, 4, 0, 3, 3, 1, 1, 2, 2, 0, 1, 4, 0, 3, 4], hard: [1, 4, 2, 0, 3, 1, 4, 0, 4, 2, 3, 2, 0, 1, 3] },
  sports: { easy: [1, 3, 0, 4, 3, 2, 4, 2, 0, 3, 0, 2, 1, 1, 4], medium: [2, 0, 4, 1, 3, 1, 0, 4, 2, 1, 0, 3, 2, 4, 3], hard: [3, 0, 2, 4, 0, 2, 1, 4, 4, 1, 3, 1, 3, 0, 2] },
  'weird-facts': { easy: [0, 2, 4, 1, 3, 2, 4, 4, 3, 1, 2, 3, 0, 1, 0], medium: [3, 1, 4, 0, 2, 2, 4, 0, 1, 3, 3, 2, 0, 4, 1], hard: [2, 4, 1, 3, 4, 2, 2, 3, 1, 3, 1, 0, 0, 0, 4] }
};

// Rounds that need more advanced school context (checklist item 8).
const tenPlusRounds = new Set(['science-hard-05', 'science-hard-07', 'science-hard-13']);

// Every round was AI-drafted and AI self-checked; only BUILTIN_REVIEWS marks human review.
const draftReview: GuessTheFakeReview = { status: 'draft', notes: 'AI-drafted; AI self-check 2026-09-22' };

export const BUILTIN_ROUNDS: BuiltinRoundEntry[] = BUILTIN_CATEGORIES.flatMap(category => {
  const categoryId = category.id as BuiltinCategoryId;
  return (['easy', 'medium', 'hard'] as GuessTheFakeDifficulty[]).flatMap(difficulty =>
    fakeIndexes[categoryId][difficulty].map((fakeIndex, index) => {
      const id = `${categoryId}-${difficulty}-${String(index + 1).padStart(2, '0')}`;
      return {
        id,
        categoryId,
        difficulty,
        fakeIndex,
        ageRating: tenPlusRounds.has(id) ? '10+' as const : 'all' as const,
        sources: categorySources[categoryId],
        review: BUILTIN_REVIEWS[id] ?? draftReview
      };
    })
  );
});
