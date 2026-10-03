// W16-01: mascot moods and which one each moment of the match shows. Pure,
// so the choice is testable without rendering the SVG.

export type MascotMood = 'thinking' | 'suspicious' | 'laughing' | 'shocked' | 'celebrating';

export const MASCOT_MOODS: MascotMood[] = ['thinking', 'suspicious', 'laughing', 'shocked', 'celebrating'];

// Reveal: someone found the fake, or the fake fooled the whole table.
export function getRevealMood(anyCorrect: boolean): MascotMood {
  return anyCorrect ? 'laughing' : 'shocked';
}

// Final: a table match always ends in a celebration; solo reacts to the run.
export function getFinalMood(options: {
  solo: boolean;
  isNewRecord: boolean;
  correct: number;
  totalRounds: number;
}): MascotMood {
  if (!options.solo || options.isNewRecord) return 'celebrating';
  if (options.correct === 0) return 'shocked';
  return options.correct * 2 >= options.totalRounds ? 'laughing' : 'suspicious';
}
