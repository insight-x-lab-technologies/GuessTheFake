import type { GuessTheFakeReview } from '../../types';

// Per-round human review log of the builtin pack (ROADMAP W9-03). The whole
// pack was accepted on 2026-10-03 (see catalog.ts); add a round here when it
// is edited and re-checked against docs/CONTENT_GUIDE.md, e.g.:
//   'history-easy-01': { status: 'reviewed', reviewedAt: '2026-11-01' },
// Use `notes` for the languages checked or a specific source.
// `REVIEW_ALL=1 npm run review:content` prints a sheet with these lines ready to paste.
export const BUILTIN_REVIEWS: Record<string, GuessTheFakeReview> = {};
