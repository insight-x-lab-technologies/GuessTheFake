import type { Language, TranslationTree } from '../../core/i18n/i18n';

const pt: TranslationTree = {
  game: {
    title: 'Guess the Fake',
    description: 'Encontre a frase falsa entre cinco afirmações',
    round: 'Rodada {current} de {total}',
    activePlayer: 'Vez de {name}',
    activeTeam: 'Vez do {name}',
    readyPlayer: '{name}, prepare-se',
    readyTeam: '{name}, preparem-se',
    prepareHint: 'A próxima rodada começa com preparação e timer.',
    preparation: 'Preparação',
    secondsLabel: 'segundos',
    chooseFake: 'Escolha a frase falsa',
    chooseFakeAll: '{name}, registre seu palpite sem revelar aos outros',
    statementOptionLabel: 'Frase {number}',
    statementKeyboardHint: 'Use Tab para entrar nos cards, setas para mover o foco e teclas de 1 a 5 para escolher uma frase.',
    revealedPrompt: 'Confira a resposta e a escolha marcada',
    timeLeft: '{seconds}s restantes',
    timeout: 'Tempo esgotado',
    correct: 'Acertou',
    wrong: 'Não foi dessa vez',
    allGuesses: 'Palpites da mesa',
    scoreBreakdown: '+{points} pts · bônus {bonus} · multiplicador x{multiplier}',
    teamScore: '{name}: {score} pts',
    fakeLabel: 'Falsa',
    selectedLabel: 'Sua escolha',
    pickedByLabel: '{names}',
    nextRound: 'Próxima rodada',
    finish: 'Ver resultado',
    playAgain: 'Nova partida',
    startTurn: 'Iniciar turno',
    revealBoard: 'Mostrar frases',
    recalibrateScores: 'Recalibrar pontuação',
    recalibrateConfirmTitle: 'Zerar pontuação?',
    recalibrateConfirmDescription: 'Jogadores e times voltam para 0 ponto. A rodada atual e os palpites continuam.',
    recalibrateConfirm: 'Zerar agora',
    recalibrateCancel: 'Cancelar',
    recalibrateDone: 'Pontuação zerada.',
    feedbackLabel: 'Feedback da rodada',
    feedbackGood: 'Boa',
    feedbackBad: 'Fraca',
    feedbackSkip: 'Não repetir'
  },
  modes: {
    classic: {
      title: 'Clássico',
      description: 'Uma pessoa por vez tenta identificar a frase falsa.'
    },
    allGuess: {
      title: 'Todos palpitam',
      description: 'Cada jogador registra um palpite antes da revelação.'
    },
    teams: {
      title: 'Times',
      description: 'Times alternam turnos e pontuam em um placar separado.'
    }
  },
  setup: {
    selected: 'Selecionado',
    title: 'Preparar partida',
    subtitle: 'Configure modo, pessoas, filtros e quantidade antes de abrir a mesa.',
    optionsTitle: 'Opções da partida',
    filtersTitle: 'Filtros e rodadas',
    summaryTitle: 'Resumo',
    contentStatusTitle: 'Status do conteúdo',
    previewTitle: 'Categorias disponíveis',
    playersHint: 'Separe os nomes por vírgula',
    summaryLine: '{players} jogadores · {rounds} rodadas selecionadas · {available} disponíveis',
    contentLow: 'Há menos rodadas disponíveis do que o solicitado; a partida usará o máximo possível.',
    mode: 'Modo',
    players: 'Jogadores',
    rounds: 'Rodadas',
    category: 'Categoria',
    difficulty: 'Dificuldade',
    allCategories: 'Todas as categorias',
    allDifficulties: 'Todas as dificuldades',
    easy: 'Fácil',
    medium: 'Média',
    hard: 'Difícil',
    availableRounds: '{available} rodadas disponíveis; serão usadas {selected}.',
    invalidRounds: 'Informe pelo menos 1 rodada.',
    notEnoughPlayers: 'Este modo precisa de pelo menos {count} jogadores.',
    noRounds: 'Nenhuma rodada disponível com os filtros atuais.',
    start: 'Começar'
  }
};

const en: TranslationTree = {
  game: {
    title: 'Guess the Fake',
    description: 'Find the fake statement among five claims',
    round: 'Round {current} of {total}',
    activePlayer: "{name}'s turn",
    activeTeam: "{name}'s turn",
    readyPlayer: '{name}, get ready',
    readyTeam: '{name}, get ready',
    prepareHint: 'The next round starts with preparation and timer.',
    preparation: 'Preparation',
    secondsLabel: 'seconds',
    chooseFake: 'Choose the fake statement',
    chooseFakeAll: '{name}, lock in your guess without revealing it to others',
    statementOptionLabel: 'Statement {number}',
    statementKeyboardHint: 'Use Tab to enter the cards, arrow keys to move focus, and keys 1 through 5 to choose a statement.',
    revealedPrompt: 'Review the answer and selected statement',
    timeLeft: '{seconds}s left',
    timeout: 'Time is up',
    correct: 'Correct',
    wrong: 'Not this time',
    allGuesses: 'Table guesses',
    scoreBreakdown: '+{points} pts · bonus {bonus} · multiplier x{multiplier}',
    teamScore: '{name}: {score} pts',
    fakeLabel: 'Fake',
    selectedLabel: 'Your pick',
    pickedByLabel: '{names}',
    nextRound: 'Next round',
    finish: 'See result',
    playAgain: 'New match',
    startTurn: 'Start turn',
    revealBoard: 'Show statements',
    recalibrateScores: 'Recalibrate scores',
    recalibrateConfirmTitle: 'Reset scores?',
    recalibrateConfirmDescription: 'Players and teams go back to 0 points. The current round and guesses stay in place.',
    recalibrateConfirm: 'Reset now',
    recalibrateCancel: 'Cancel',
    recalibrateDone: 'Scores reset.',
    feedbackLabel: 'Round feedback',
    feedbackGood: 'Good',
    feedbackBad: 'Weak',
    feedbackSkip: 'Do not repeat'
  },
  modes: {
    classic: {
      title: 'Classic',
      description: 'One player at a time tries to identify the fake statement.'
    },
    allGuess: {
      title: 'Everyone guesses',
      description: 'Each player locks a guess before the reveal.'
    },
    teams: {
      title: 'Teams',
      description: 'Teams alternate turns and score on a separate board.'
    }
  },
  setup: {
    selected: 'Selected',
    title: 'Prepare match',
    subtitle: 'Set mode, people, filters, and round count before opening the table.',
    optionsTitle: 'Match options',
    filtersTitle: 'Filters and rounds',
    summaryTitle: 'Summary',
    contentStatusTitle: 'Content status',
    previewTitle: 'Available categories',
    playersHint: 'Separate names with commas',
    summaryLine: '{players} players · {rounds} selected rounds · {available} available',
    contentLow: 'Fewer rounds are available than requested; the match will use as many as possible.',
    mode: 'Mode',
    players: 'Players',
    rounds: 'Rounds',
    category: 'Category',
    difficulty: 'Difficulty',
    allCategories: 'All categories',
    allDifficulties: 'All difficulties',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    availableRounds: '{available} rounds available; {selected} will be used.',
    invalidRounds: 'Enter at least 1 round.',
    notEnoughPlayers: 'This mode needs at least {count} players.',
    noRounds: 'No rounds are available with the current filters.',
    start: 'Start'
  }
};

export const guessTheFakeTranslations: Record<Language, TranslationTree> = {
  pt,
  en,
  es: en,
  fr: en,
  de: en,
  it: en
};
