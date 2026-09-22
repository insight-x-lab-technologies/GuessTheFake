import type { Language } from '../core/i18n/i18n';
import { getLocalizedText } from './content-schema';
import type { GuessTheFakePackContent, GuessTheFakeReview, GuessTheFakeRound } from './types';

// Pure helpers for the human review of the builtin pack (ROADMAP W9-03).
// The sheet is Markdown meant to be read side by side with docs/CONTENT_GUIDE.md.

export type ReviewSheetOptions = {
  language: Language;
  compareLanguage?: Language;
  includeReviewed?: boolean;
  today: string;
};

const checklist = [
  'Verdadeiras verificaveis em fonte de referencia',
  'Falsa inequivoca, sem disputa',
  'Nenhuma verdadeira contradiz ou entrega a falsa',
  'Explicacao curta diz por que a falsa e falsa',
  'Tema familiar, sem violencia, politica, religiao ou doenca grave',
  'Nada depende de recorde ou evento que pode mudar',
  'Traducao preserva o fato; nomes na forma local',
  'ageRating 10+ quando exigir contexto escolar avancado'
];

const REVIEW_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function buildReviewSheet(
  packs: Partial<Record<Language, GuessTheFakePackContent>>,
  options: ReviewSheetOptions
) {
  const { language, compareLanguage, includeReviewed = false, today } = options;
  const content = packs[language];
  if (!content) return `# Revisao de conteudo - ${language}\n\nSem conteudo carregado para ${language}.\n`;

  const compare = compareLanguage && compareLanguage !== language ? packs[compareLanguage] : undefined;
  const compareRounds = new Map(compare?.rounds.map(round => [round.id, round]));
  const pending = content.rounds.filter(round => includeReviewed || round.review?.status !== 'reviewed');
  const reviewed = content.rounds.filter(round => round.review?.status === 'reviewed').length;

  const lines = [
    `# Revisao de conteudo - ${language}${compare ? ` (comparacao: ${compareLanguage})` : ''}`,
    '',
    `Gerado em ${today}. Revisadas: ${reviewed} de ${content.rounds.length}. Nesta folha: ${pending.length}.`,
    '',
    'Checklist de cada rodada (docs/CONTENT_GUIDE.md):',
    '',
    ...checklist.map((item, index) => `${index + 1}. ${item}`),
    '',
    'Quando a rodada passar, copie a linha "Registro" para src/game/data/builtin/reviews.ts.'
  ];

  let section = '';
  pending.forEach(round => {
    const heading = `${round.categoryId} / ${round.difficulty}`;
    if (heading !== section) {
      section = heading;
      lines.push('', `## ${heading}`);
    }
    lines.push('', ...formatRound(round, language, compareRounds.get(round.id), compareLanguage, today));
  });

  return `${lines.join('\n')}\n`;
}

function formatRound(
  round: GuessTheFakeRound,
  language: Language,
  compareRound: GuessTheFakeRound | undefined,
  compareLanguage: Language | undefined,
  today: string
) {
  const tags = [round.ageRating === '10+' ? '10+' : '', round.review?.status === 'reviewed' ? 'revisada' : ''].filter(Boolean);
  const lines = [`### ${round.id}${tags.length ? ` (${tags.join(', ')})` : ''}`, ''];

  round.statements.forEach((statement, index) => {
    const fake = statement.id === round.fakeStatementId;
    lines.push(`${index + 1}. ${fake ? '**[FALSA]** ' : ''}${getLocalizedText(statement.text, language)}`);
    const compareStatement = compareRound?.statements.find(item => item.id === statement.id);
    if (compareStatement && compareLanguage) {
      lines.push(`   > ${compareLanguage}: ${getLocalizedText(compareStatement.text, compareLanguage)}`);
    }
  });

  lines.push('', `Explicacao: ${getLocalizedText(round.explanation, language)}`);
  if (compareRound && compareLanguage) {
    lines.push(`> ${compareLanguage}: ${getLocalizedText(compareRound.explanation, compareLanguage)}`);
  }
  if (round.sources?.length) lines.push(`Fontes: ${round.sources.join(', ')}`);
  lines.push('', `- [ ] Checklist ok`, `Registro: \`'${round.id}': { status: 'reviewed', reviewedAt: '${today}' },\``);
  return lines;
}

// Problems in the human review log: unknown ids, wrong status or bad dates.
export function findInvalidReviews(reviews: Record<string, GuessTheFakeReview>, roundIds: string[]) {
  const known = new Set(roundIds);
  return Object.entries(reviews).flatMap(([id, review]) => {
    if (!known.has(id)) return [`${id}: unknown round id`];
    if (review.status !== 'reviewed') return [`${id}: status must be reviewed`];
    if (!review.reviewedAt || !REVIEW_DATE.test(review.reviewedAt)) return [`${id}: reviewedAt must be YYYY-MM-DD`];
    return [];
  });
}
