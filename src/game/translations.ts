import type { Language, TranslationTree } from '../core/i18n/i18n';
import { de } from './locales/de';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { it } from './locales/it';

const pt: TranslationTree = {
  game: {
    scoreLoss: '-{loss} pts',
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
    solo: {
      title: 'Solo',
      description: 'Bata seu próprio recorde: uma pessoa, rodadas fixas.'
    },
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
    variationsTitle: 'Variações',
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
    contentLoading: 'Carregando as rodadas deste idioma...',
    contentEmpty: 'Ainda não há rodadas para este idioma com os filtros atuais. Troque o idioma em Configurações, ajuste os filtros ou importe um pack em Packs.',
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
  },
  app: {
    profiles: 'Família'
  },
  multiDevice: {
    phase: {
      discussing: 'momento de mesa'
    }
  },
  solo: {
    playSolo: 'Jogar sozinho',
    playerTitle: 'Jogador',
    nameLabel: 'Seu nome',
    namePlaceholder: 'Digite seu nome',
    summaryLine: 'Você · {rounds} rodadas · {available} disponíveis',
    recordLine: 'Seu recorde neste desafio: {points} pts ({correct}/{total})',
    firstTime: 'Primeira vez neste desafio',
    statsLabel: 'Sua partida',
    points: '{points} pts',
    correctOf: '{correct}/{total} acertos',
    streak: 'Sequência {streak}',
    yourGuess: 'Seu palpite',
    finalKicker: 'Desafio solo',
    finalPoints: '{points} pts',
    newRecord: 'Novo recorde!',
    recordCompare: 'Recorde: {points} pts · faltaram {difference} pts',
    bestStreak: 'Maior sequência: {streak}',
    playAgain: 'Jogar de novo',
    newChallenge: 'Novo desafio',
    shareText: 'Fiz {points} pts e acertei {correct}/{total} no Guess the Fake ({challenge}).',
    recordsTitle: 'Recordes solo',
    recordsClear: 'Limpar recordes',
    recordsEmpty: 'Ainda não há recordes solo. Jogue sozinho para marcar o primeiro.',
    recordRow: '{correct}/{total} acertos · {date}',
    challengeRounds: '{rounds} rodadas',
    challengePacks: '{count} packs extras'
  },
  moments: {
    toggle: 'Momentos de mesa',
    toggleHint: 'Antes da revelação: defenda sua escolha, vote ou mude de ideia. As rodadas ficam mais longas.',
    label: 'Momento de mesa',
    prompt: 'Conversem antes da revelação',
    reveal: 'Revelar resposta',
    defend: {
      title: 'Defenda sua escolha',
      description: 'Quem palpitou explica a escolha em voz alta antes de a resposta aparecer.'
    },
    vote: {
      title: 'Vote em quem blefou melhor',
      description: 'A mesa vota em quem argumentou melhor, certo ou errado. O voto vale +{bonus} pts.',
      result: '{name} venceu a votação da mesa (+{bonus} pts).'
    },
    'change-mind': {
      title: 'Chance de mudar de ideia',
      description: 'Cada palpite pode ser trocado uma vez. Quem troca perde o bônus de velocidade.',
      action: 'Trocar palpite de {name}',
      used: '{name} já trocou',
      pick: 'Escolha a nova frase no tabuleiro.',
      changed: ' · mudou de ideia'
    }
  },
  specials: {
    toggle: 'Rodadas especiais',
    toggleHint: 'A cada três rodadas uma tem uma reviravolta, e a última é morte súbita.',
    toggleHintSolo: 'A cada três rodadas uma tem uma reviravolta. Recordes com rodadas especiais contam como outro desafio.',
    short: 'rodadas especiais',
    'double-or-nothing': {
      title: 'Dobro ou nada',
      description: 'Acerto vale o dobro; erro tira pontos.',
      result: 'Dobro ou nada: acertos dobraram, erros perderam pontos.'
    },
    'sudden-death': {
      title: 'Morte súbita',
      description: 'Um erro corta seu placar pela metade.',
      result: 'Morte súbita: o erro cortou o placar pela metade.'
    },
    'gradual-clue': {
      title: 'Pista gradual',
      description: 'As frases aparecem aos poucos. Palpite cedo vale bônus.',
      result: 'Pista gradual: +2 pts por frase ainda escondida.',
      revealNext: 'Mostrar mais uma ({visible}/{total})',
      hiddenLabel: 'Frase {number}, ainda escondida'
    },
    lightning: {
      title: 'Rodada relâmpago',
      description: 'Um terço do tempo e bônus de velocidade dobrado.',
      result: 'Rodada relâmpago: bônus de velocidade dobrado.'
    },
    'category-challenge': {
      title: 'Desafio por categoria',
      description: 'Acerto vale 1,5x.',
      categoryLine: 'Categoria: {category}. Acerto vale 1,5x.',
      result: 'Desafio por categoria: acertos valeram 1,5x.'
    }
  },
  profiles: {
    title: 'Família',
    subtitle: 'Perfis locais com avatar, cor, apelido, estatísticas e troféus pessoais. Sem conta; entram na exportação de dados.',
    createTitle: 'Novo perfil',
    editTitle: 'Editar perfil',
    name: 'Nome',
    nickname: 'Apelido',
    avatar: 'Avatar',
    avatarOption: 'Avatar {avatar}',
    color: 'Cor',
    colors: {
      coral: 'Coral',
      amber: 'Âmbar',
      lime: 'Lima',
      teal: 'Verde-água',
      sky: 'Céu',
      violet: 'Violeta',
      rose: 'Rosa',
      slate: 'Ardósia'
    },
    create: 'Criar perfil',
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar',
    remove: 'Remover',
    created: 'Perfil criado.',
    saved: 'Perfil salvo.',
    removed: 'Perfil removido.',
    empty: 'Ainda não há perfis. Crie um para cada pessoa que joga sempre.',
    pickLabel: 'Perfis da família',
    trophies: 'Troféus pessoais: {unlocked}/{total}',
    error: {
      'name-required': 'Informe um nome.',
      'name-taken': 'Já existe um perfil com esse nome.',
      limit: 'Limite de perfis atingido.',
      'not-found': 'Perfil não encontrado.'
    },
    stats: {
      matches: 'Partidas',
      wins: 'Vitórias',
      points: 'Pontos',
      correct: 'Acertos',
      correctValue: '{correct} em {rounds} rodadas',
      solo: 'Recorde solo',
      soloValue: '{points} pts · {challenge} ({count} desafios)',
      soloEmpty: 'Nenhum ainda'
    }
  },
  tracks: {
    title: 'Trilhas de progresso',
    subtitle: 'Cada trilha tem três níveis. Solo e mesa contam juntos, exceto "Mesa".',
    nextObjective: 'Próximo objetivo',
    level: 'Nível {level}/{total}',
    complete: 'completa',
    tableOnly: 'Só partidas de mesa',
    group: {
      category: 'Categoria',
      difficulty: 'Dificuldade',
      style: 'Estilo de jogo',
      curation: 'Curadoria'
    },
    category: 'Especialista em {category}',
    difficulty: 'Nível {difficulty}',
    streak: 'Sequências',
    perfect: 'Partidas perfeitas',
    table: 'Mesa',
    solo: 'Solo',
    feedback: 'Curador de conteúdo',
    packs: 'Explorador de packs',
    objective: {
      category: 'Acerte mais {remaining} em {category} para chegar a {target}.',
      difficulty: 'Acerte mais {remaining} no nível {difficulty} para chegar a {target}.',
      streak: 'Faça uma sequência de {target} acertos seguidos.',
      perfect: 'Termine mais {remaining} partidas perfeitas.',
      table: 'Jogue mais {remaining} partidas de mesa.',
      solo: 'Termine mais {remaining} desafios solo.',
      feedback: 'Avalie mais {remaining} rodadas depois da revelação.',
      packs: 'Jogue com mais {remaining} packs diferentes (importe um em Packs).'
    }
  },
  suggest: {
    title: 'Sugestão',
    minutes: 'Tempo disponível',
    minutesOption: '{minutes} min',
    summary: '{mode} · {rounds} rodadas · {difficulty} · {category}',
    apply: 'Aplicar sugestão',
    applied: 'Sugestão aplicada. Você ainda pode mudar tudo.',
    reason: {
      modeSolo: 'Uma pessoa: desafio solo.',
      modeSmall: '{players} jogadores: todos palpitam a cada rodada.',
      modeBig: '{players} jogadores: times mantêm os turnos rápidos.',
      newTable: 'Sem histórico ainda: comece no fácil.',
      harder: '{percent}% de acertos neste nível: hora de subir.',
      easier: '{percent}% de acertos: um nível mais fácil deixa mais divertido.',
      keep: '{percent}% de acertos: este nível combina.',
      fresh: '{category} é a categoria menos jogada.',
      freshSkippingWeak: '{category} é a categoria menos jogada, sem as marcadas como fracas.',
      time: '{rounds} rodadas cabem em cerca de {minutes} min.',
      soloBeat: 'Seu recorde aqui é {points} pts: tente bater.',
      soloHarder: 'Seus recordes são perfeitos: tente um nível mais difícil.',
      soloFirst: 'Primeiro desafio: 5 rodadas fáceis.'
    }
  },
  presenter: {
    title: 'Modo apresentador',
    description: 'Visual de sala para TV ou projetor: placar, timer, frases e revelação em tamanho grande.',
    open: 'Modo apresentador',
    openWindow: 'Tela de exibição',
    close: 'Sair',
    windowOpened: 'Tela de exibição aberta em nova janela, ligada a esta sessão.',
    turn: 'Vez de {name}',
    finalTitle: 'Placar final',
    scoreboard: 'Placar'
  },
  packMeta: {
    license: {
      community: 'Comunidade',
      'premium-unverified': 'Premium · assinatura não verificada',
      'premium-unsigned': 'Premium · sem assinatura'
    },
    audience: {
      family: 'Família',
      kids: 'Crianças',
      teens: 'Adolescentes',
      adults: 'Adultos'
    },
    difficulty: {
      easy: 'Fácil',
      medium: 'Média',
      hard: 'Difícil',
      mixed: 'Dificuldade mista'
    },
    version: 'v{version}',
    author: 'Por {author}',
    changelog: 'Histórico de versões'
  }
};

const en: TranslationTree = {
  game: {
    scoreLoss: '-{loss} pts',
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
    solo: {
      title: 'Solo',
      description: 'Beat your own record: one player, fixed rounds.'
    },
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
    variationsTitle: 'Variations',
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
    contentLoading: 'Loading rounds for this language...',
    contentEmpty: 'There are no rounds for this language with the current filters yet. Change the language in Settings, adjust the filters, or import a pack in Packs.',
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
  },
  app: {
    profiles: 'Family'
  },
  multiDevice: {
    phase: {
      discussing: 'table moment'
    }
  },
  solo: {
    playSolo: 'Play solo',
    playerTitle: 'Player',
    nameLabel: 'Your name',
    namePlaceholder: 'Type your name',
    summaryLine: 'You · {rounds} rounds · {available} available',
    recordLine: 'Your record in this challenge: {points} pts ({correct}/{total})',
    firstTime: 'First time in this challenge',
    statsLabel: 'Your match',
    points: '{points} pts',
    correctOf: '{correct}/{total} correct',
    streak: 'Streak {streak}',
    yourGuess: 'Your guess',
    finalKicker: 'Solo challenge',
    finalPoints: '{points} pts',
    newRecord: 'New record!',
    recordCompare: 'Record: {points} pts · {difference} pts short',
    bestStreak: 'Best streak: {streak}',
    playAgain: 'Play again',
    newChallenge: 'New challenge',
    shareText: 'I scored {points} pts and got {correct}/{total} right in Guess the Fake ({challenge}).',
    recordsTitle: 'Solo records',
    recordsClear: 'Clear records',
    recordsEmpty: 'No solo records yet. Play solo to set one.',
    recordRow: '{correct}/{total} correct · {date}',
    challengeRounds: '{rounds} rounds',
    challengePacks: '{count} extra packs'
  },
  moments: {
    toggle: 'Table moments',
    toggleHint: 'Before the reveal: defend your pick, vote, or change your mind. Rounds take longer.',
    label: 'Table moment',
    prompt: 'Talk it over before the reveal',
    reveal: 'Reveal answer',
    defend: {
      title: 'Defend your choice',
      description: 'Everyone who guessed explains their pick out loud before the answer appears.'
    },
    vote: {
      title: 'Vote for the best bluff',
      description: 'The table votes for whoever argued best, right or wrong. The vote is worth +{bonus} pts.',
      result: '{name} won the table vote (+{bonus} pts).'
    },
    'change-mind': {
      title: 'Chance to change your mind',
      description: 'Each guess can be changed once. A changed guess loses the speed bonus.',
      action: 'Change {name}\'s guess',
      used: '{name} already changed',
      pick: 'Choose the new statement on the board.',
      changed: ' · changed mind'
    }
  },
  specials: {
    toggle: 'Special rounds',
    toggleHint: 'Every third round has a twist, and the last one is sudden death.',
    toggleHintSolo: 'Every third round has a twist. Records with special rounds count as a separate challenge.',
    short: 'special rounds',
    'double-or-nothing': {
      title: 'Double or nothing',
      description: 'A hit is worth double; a miss loses points.',
      result: 'Double or nothing: hits doubled, misses lost points.'
    },
    'sudden-death': {
      title: 'Sudden death',
      description: 'A miss cuts your score in half.',
      result: 'Sudden death: a miss halved the score.'
    },
    'gradual-clue': {
      title: 'Gradual clue',
      description: 'Statements appear one at a time. Guess early for a bonus.',
      result: 'Gradual clue: +2 pts for each statement still hidden.',
      revealNext: 'Show one more ({visible}/{total})',
      hiddenLabel: 'Statement {number}, still hidden'
    },
    lightning: {
      title: 'Lightning round',
      description: 'A third of the time and a double speed bonus.',
      result: 'Lightning round: speed bonus doubled.'
    },
    'category-challenge': {
      title: 'Category challenge',
      description: 'A hit is worth 1.5x.',
      categoryLine: 'Category: {category}. A hit is worth 1.5x.',
      result: 'Category challenge: hits worth 1.5x.'
    }
  },
  profiles: {
    title: 'Family',
    subtitle: 'Local profiles with avatar, color, nickname, stats, and personal trophies. No account; included in the data export.',
    createTitle: 'New profile',
    editTitle: 'Edit profile',
    name: 'Name',
    nickname: 'Nickname',
    avatar: 'Avatar',
    avatarOption: 'Avatar {avatar}',
    color: 'Color',
    colors: {
      coral: 'Coral',
      amber: 'Amber',
      lime: 'Lime',
      teal: 'Teal',
      sky: 'Sky',
      violet: 'Violet',
      rose: 'Rose',
      slate: 'Slate'
    },
    create: 'Create profile',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    remove: 'Remove',
    created: 'Profile created.',
    saved: 'Profile saved.',
    removed: 'Profile removed.',
    empty: 'No profiles yet. Create one for each person who plays often.',
    pickLabel: 'Family profiles',
    trophies: 'Personal trophies: {unlocked}/{total}',
    error: {
      'name-required': 'Enter a name.',
      'name-taken': 'There is already a profile with this name.',
      limit: 'Profile limit reached.',
      'not-found': 'Profile not found.'
    },
    stats: {
      matches: 'Matches',
      wins: 'Wins',
      points: 'Points',
      correct: 'Correct',
      correctValue: '{correct} in {rounds} rounds',
      solo: 'Solo record',
      soloValue: '{points} pts · {challenge} ({count} challenges)',
      soloEmpty: 'None yet'
    }
  },
  tracks: {
    title: 'Progress tracks',
    subtitle: 'Each track has three levels. Solo and table play both count, except "Table".',
    nextObjective: 'Next objective',
    level: 'Level {level}/{total}',
    complete: 'complete',
    tableOnly: 'Table matches only',
    group: {
      category: 'Category',
      difficulty: 'Difficulty',
      style: 'Play style',
      curation: 'Curation'
    },
    category: '{category} expert',
    difficulty: '{difficulty} level',
    streak: 'Streaks',
    perfect: 'Perfect matches',
    table: 'Table',
    solo: 'Solo',
    feedback: 'Content curator',
    packs: 'Pack explorer',
    objective: {
      category: 'Get {remaining} more right in {category} to reach {target}.',
      difficulty: 'Get {remaining} more right on {difficulty} to reach {target}.',
      streak: 'Reach a streak of {target} in a row.',
      perfect: 'Finish {remaining} more perfect matches.',
      table: 'Play {remaining} more table matches.',
      solo: 'Finish {remaining} more solo challenges.',
      feedback: 'Rate {remaining} more rounds after the reveal.',
      packs: 'Play with {remaining} more different packs (import one in Packs).'
    }
  },
  suggest: {
    title: 'Suggestion',
    minutes: 'Time available',
    minutesOption: '{minutes} min',
    summary: '{mode} · {rounds} rounds · {difficulty} · {category}',
    apply: 'Apply suggestion',
    applied: 'Suggestion applied. You can still change anything.',
    reason: {
      modeSolo: 'One player: solo challenge.',
      modeSmall: '{players} players: everyone guesses each round.',
      modeBig: '{players} players: teams keep the turns moving.',
      newTable: 'No history yet: start easy.',
      harder: '{percent}% correct at this level: time to go harder.',
      easier: '{percent}% correct: an easier level keeps it fun.',
      keep: '{percent}% correct: this level fits.',
      fresh: '{category} is the least played category.',
      freshSkippingWeak: '{category} is the least played category, skipping those rated weak.',
      time: '{rounds} rounds fit in about {minutes} min.',
      soloBeat: 'Your record here is {points} pts: try to beat it.',
      soloHarder: 'Your records are perfect: try a harder level.',
      soloFirst: 'First challenge: 5 easy rounds.'
    }
  },
  presenter: {
    title: 'Presenter mode',
    description: 'Big room view for a TV or projector: scores, timer, statements, and the reveal.',
    open: 'Presenter mode',
    openWindow: 'Display screen',
    close: 'Exit',
    windowOpened: 'Display screen opened in a new window, linked to this session.',
    turn: '{name}\'s turn',
    finalTitle: 'Final scores',
    scoreboard: 'Scoreboard'
  },
  packMeta: {
    license: {
      community: 'Community',
      'premium-unverified': 'Premium · signature not verified',
      'premium-unsigned': 'Premium · unsigned'
    },
    audience: {
      family: 'Family',
      kids: 'Kids',
      teens: 'Teens',
      adults: 'Adults'
    },
    difficulty: {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      mixed: 'Mixed difficulty'
    },
    version: 'v{version}',
    author: 'By {author}',
    changelog: 'Changelog'
  }
};

export const guessTheFakeTranslations: Record<Language, TranslationTree> = {
  pt,
  en,
  es,
  fr,
  de,
  it
};
