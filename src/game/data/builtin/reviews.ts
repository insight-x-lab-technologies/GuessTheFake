import type { GuessTheFakeReview } from '../../types';

// Human review log of the builtin pack (ROADMAP W9-03). A round only leaves
// `draft` when a person checks it against docs/CONTENT_GUIDE.md in every
// language and adds it here, e.g.:
//   'history-easy-01': { status: 'reviewed', reviewedAt: '2026-10-01' },
// Use `notes` for the languages checked or a specific source.
// `npm run review:content` prints a sheet with these lines ready to paste.
export const BUILTIN_REVIEWS: Record<string, GuessTheFakeReview> = {};
