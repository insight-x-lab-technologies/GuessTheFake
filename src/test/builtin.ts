import { createBuiltinPack } from '../game/data/builtin';
import en from '../game/data/builtin/texts/en';

// Synchronous builtin pack for tests; the app loads it lazily per language.
export const builtinPackEn = createBuiltinPack('en', en);

export function getBuiltinRounds() {
  return builtinPackEn.content.rounds;
}
