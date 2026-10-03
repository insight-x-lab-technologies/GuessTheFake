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
    },
    aboutUs: {
      title: 'Sobre nós',
      description: 'Cada um escreve 4 verdades e 1 mentira sobre si; a mesa adivinha.'
    },
    bluffMaster: {
      title: 'Mestre do blefe',
      description: 'Um jogador sabe a falsa e defende as cinco; quem ele enganar vale ponto.'
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
  },
  art: {
    avatars: {
      fox: 'Raposa',
      panda: 'Panda',
      owl: 'Coruja',
      octopus: 'Polvo',
      lion: 'Leão',
      turtle: 'Tartaruga',
      penguin: 'Pinguim',
      unicorn: 'Unicórnio',
      bee: 'Abelha',
      whale: 'Baleia',
      cactus: 'Cacto',
      rocket: 'Foguete',
      cat: 'Gato',
      dog: 'Cachorro',
      frog: 'Sapo',
      bear: 'Urso',
      rabbit: 'Coelho',
      koala: 'Coala',
      monkey: 'Macaco',
      pig: 'Porquinho',
      chick: 'Pintinho',
      robot: 'Robô',
      alien: 'Alienígena',
      ghost: 'Fantasminha'
    },
    defaultAvatar: 'Jogador sem perfil',
    medal: {
      bronze: 'Bronze',
      silver: 'Prata',
      gold: 'Ouro',
      legendary: 'Lendária',
      label: 'Medalha {rarity}',
      locked: 'Bloqueada',
      unlockedRarity: '{rarity} desbloqueada'
    },
    seasonal: {
      halloween: {
        title: 'Clima de Halloween',
        body: 'Morcegos, abóboras e trilha de outono para a mesa.'
      },
      festive: {
        title: 'Clima de festas',
        body: 'Luzes, neve e brilho de fim de ano para a mesa.'
      },
      apply: 'Usar tema',
      dismiss: 'Agora não',
      settingsHint: 'Temas sazonais: aplique quando quiser; na época certa o app sugere na home.'
    },
    tracks: {
      heading: 'Trilha de música',
      mapping: 'Este tema toca a trilha {track}.',
      cosmic: 'Cósmica',
      spring: 'Primavera',
      autumn: 'Outono'
    }
  },
  juice: {
    menu: {
      label: 'Mais ações da rodada'
    },
    scoreboard: 'Placar',
    stamp: 'FAKE',
    bonusFloat: '+{bonus} bônus',
    countdown: '{seconds} para começar',
    pass: {
      title: 'Passe para {name}',
      hint: 'Sem espiar: o palpite anterior fica escondido.',
      ready: 'Sou {name}, mostrar'
    },
    podium: {
      kicker: 'Pódio',
      label: 'Pódio da partida',
      points: '{points} pts',
      place: '{place}º lugar',
      restLine: '{place}º {name} · {points} pts'
    },
    highlights: {
      label: 'Destaques da partida',
      fastest: 'Mais rápido',
      'longest-streak': 'Maior sequência',
      'best-bluff': 'Melhor blefe',
      fastestLine: '{name} acertou em {seconds}s, em média',
      streakLine: '{name} acertou {streak} seguidas',
      bluffLine: '"{text}" enganou {count}'
    },
    rematch: 'Revanche',
    solo: {
      you: 'Você',
      record: 'Recorde',
      previousRecord: 'Recorde anterior'
    },
    settings: {
      passDevice: 'Passe o aparelho entre palpites',
      passDeviceHint: 'Em "todos palpitam" e times, mostra uma tela de troca que esconde o palpite anterior.',
      vibration: 'Vibrar nos últimos segundos',
      vibrationUnsupported: 'Este aparelho ou navegador não vibra.'
    }
  },
  aboutUs: {
    category: 'Sobre nós',
    subtitle: 'Cada jogador escreve no seu turno. Nada sai deste aparelho.',
    progress: 'Jogador {current} de {total}',
    startWriting: 'Escrever minhas frases',
    writeTitle: '{name}, escreva sobre você',
    writeHint: 'Quatro verdades e uma mentira. Marque a mentira; as frases aparecem embaralhadas.',
    statementLabel: 'Frase {number}',
    lieLabel: 'Mentira',
    issue: {
      'empty-statement': 'Preencha as cinco frases.',
      'too-long': 'Cada frase pode ter até 140 caracteres.',
      'duplicate-statement': 'As frases precisam ser diferentes.',
      'no-lie': 'Marque qual frase é a mentira.'
    },
    cancel: 'Voltar ao setup',
    confirm: 'Pronto, esconder',
    doneTitle: 'Todos escreveram!',
    doneHint: '{count} rodadas prontas, uma de cada jogador. Quem escreveu a rodada não palpita nela.',
    missingEntries: 'Cada jogador precisa escrever suas cinco frases antes de começar.',
    saveAsPack: 'Salvar como pack local',
    packTitle: 'Sobre nós ({date})',
    packExplanation: 'Frase escrita por {name}.',
    saved: 'Pack salvo. Ative ou edite na tela Packs.',
    setupTitle: 'Conteúdo da mesa',
    setupNote: 'Sem packs nem filtros: cada jogador escreve uma rodada sobre si ({count} rodadas). O autor pontua por quem enganar.',
    summaryLine: '{players} jogadores · uma rodada escrita por cada um',
    startWritingAll: 'Escrever as rodadas'
  },
  bluff: {
    result: '{name} enganou {count} ({names}): +{points} pontos.',
    resultNone: '{name} não enganou ninguém desta vez.',
    masterBanner: 'Mestre do blefe: {name}',
    masterBannerHint: '{name} defende as cinco frases; vote quando ouvir.',
    aboutUsBanner: 'Frases de {name}',
    aboutUsBannerHint: '{name} não palpita; ganha pontos por quem enganar.',
    aboutUsIntro: 'Rodada de {name}',
    aboutUsIntroHint: '{name}, leia suas cinco frases em voz alta. Os outros palpitam um de cada vez.',
    briefingTitle: 'Só {name} olha',
    briefingHint: 'Os outros desviam o olhar. O mestre vê qual é a falsa.',
    briefingReveal: 'Ver a frase falsa',
    briefingDefend: 'Defenda as cinco como se fossem todas verdadeiras.',
    briefingReady: 'Pronto, esconder',
    finalDefense: {
      title: 'Defesa final',
      description: 'O mestre faz o último apelo. Cada um pode trocar o voto uma vez antes da revelação.'
    }
  },
  kids: {
    toggle: 'Kids (6-9 anos)',
    toggleHint: 'Só rodadas fáceis com linguagem simples, escritas para crianças.',
    short: 'Kids'
  },
  editor: {
    title: 'Novo pack',
    editTitle: 'Editar pack',
    subtitle: 'Escreva rodadas com 5 frases e uma falsa. O rascunho fica salvo neste aparelho.',
    back: 'Voltar aos packs',
    packInfo: 'Pack',
    packTitle: 'Título',
    emoji: 'Capa (emoji)',
    language: 'Idioma',
    description: 'Descrição',
    newCategory: 'Nova categoria',
    addCategory: 'Adicionar categoria',
    categoryInvalid: 'Digite um nome de categoria que ainda não exista.',
    roundTitle: 'Rodada {number}',
    removeRound: 'Remover',
    statement: 'Frase {number}',
    fake: 'Falsa',
    explanation: 'Explicação (aparece na revelação)',
    addRound: 'Adicionar rodada',
    summary: 'Resumo',
    summaryLine: '{rounds} rodadas · {issues} pendências',
    validate: 'Validar',
    save: 'Salvar no aparelho',
    export: 'Exportar JSON',
    discard: 'Descartar rascunho',
    invalid: '{count} pendências para corrigir.',
    valid: 'Tudo certo: o pack está pronto.',
    saved: 'Pack salvo e ativado.',
    exported: 'JSON exportado.',
    create: 'Criar pack',
    continueDraft: 'Continuar rascunho',
    edit: 'Editar',
    issue: {
      title: 'Dê um título ao pack.',
      noRounds: 'Adicione pelo menos uma rodada.',
      category: 'Rodada {round}: escolha uma categoria.',
      statement: 'Rodada {round}: preencha a frase {statement}.',
      statementLong: 'Rodada {round}: a frase {statement} passou de 200 caracteres.',
      duplicate: 'Rodada {round}: a frase {statement} repete outra do pack.',
      fake: 'Rodada {round}: marque qual frase é a falsa.',
      explanation: 'Rodada {round}: escreva a explicação.'
    }
  },
  seasonalPacks: {
    title: 'Packs sazonais',
    subtitle: 'Packs pequenos e opcionais, baixados só quando ativados.',
    inSeason: 'Da temporada',
    loading: 'Carregando…',
    rounds: '{rounds} rodadas'
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
    },
    aboutUs: {
      title: 'About us',
      description: 'Everyone writes 4 truths and 1 lie about themselves; the table guesses.'
    },
    bluffMaster: {
      title: 'Bluff master',
      description: 'One player knows the fake and defends all five; everyone fooled is a point.'
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
  },
  art: {
    avatars: {
      fox: 'Fox',
      panda: 'Panda',
      owl: 'Owl',
      octopus: 'Octopus',
      lion: 'Lion',
      turtle: 'Turtle',
      penguin: 'Penguin',
      unicorn: 'Unicorn',
      bee: 'Bee',
      whale: 'Whale',
      cactus: 'Cactus',
      rocket: 'Rocket',
      cat: 'Cat',
      dog: 'Dog',
      frog: 'Frog',
      bear: 'Bear',
      rabbit: 'Rabbit',
      koala: 'Koala',
      monkey: 'Monkey',
      pig: 'Piggy',
      chick: 'Chick',
      robot: 'Robot',
      alien: 'Alien',
      ghost: 'Little ghost'
    },
    defaultAvatar: 'Player without profile',
    medal: {
      bronze: 'Bronze',
      silver: 'Silver',
      gold: 'Gold',
      legendary: 'Legendary',
      label: '{rarity} medal',
      locked: 'Locked',
      unlockedRarity: '{rarity} unlocked'
    },
    seasonal: {
      halloween: {
        title: 'Halloween vibes',
        body: 'Bats, pumpkins, and the autumn soundtrack for the table.'
      },
      festive: {
        title: 'Holiday vibes',
        body: 'Lights, snow, and end-of-year sparkle for the table.'
      },
      apply: 'Use theme',
      dismiss: 'Not now',
      settingsHint: 'Seasonal themes: apply them anytime; in season the app suggests them on the home screen.'
    },
    tracks: {
      heading: 'Music track',
      mapping: 'This theme plays the {track} track.',
      cosmic: 'Cosmic',
      spring: 'Spring',
      autumn: 'Autumn'
    }
  },
  juice: {
    menu: {
      label: 'More round actions'
    },
    scoreboard: 'Scoreboard',
    stamp: 'FAKE',
    bonusFloat: '+{bonus} bonus',
    countdown: '{seconds} to go',
    pass: {
      title: 'Pass to {name}',
      hint: 'No peeking: the previous guess stays hidden.',
      ready: 'I\'m {name}, show me'
    },
    podium: {
      kicker: 'Podium',
      label: 'Match podium',
      points: '{points} pts',
      place: 'Place {place}',
      restLine: '#{place} {name} · {points} pts'
    },
    highlights: {
      label: 'Match highlights',
      fastest: 'Fastest',
      'longest-streak': 'Longest streak',
      'best-bluff': 'Best bluff',
      fastestLine: '{name} got it in {seconds}s on average',
      streakLine: '{name} got {streak} in a row',
      bluffLine: '"{text}" fooled {count}'
    },
    rematch: 'Rematch',
    solo: {
      you: 'You',
      record: 'Record',
      previousRecord: 'Previous record'
    },
    settings: {
      passDevice: 'Pass the device between guesses',
      passDeviceHint: 'In "everyone guesses" and teams, shows a hand-off screen that hides the previous guess.',
      vibration: 'Vibrate on the last seconds',
      vibrationUnsupported: 'This device or browser cannot vibrate.'
    }
  },
  aboutUs: {
    category: 'About us',
    subtitle: 'Each player writes on their own turn. Nothing leaves this device.',
    progress: 'Player {current} of {total}',
    startWriting: 'Write my statements',
    writeTitle: '{name}, write about yourself',
    writeHint: 'Four truths and one lie. Mark the lie; the statements are shuffled.',
    statementLabel: 'Statement {number}',
    lieLabel: 'Lie',
    issue: {
      'empty-statement': 'Fill in all five statements.',
      'too-long': 'Each statement can have up to 140 characters.',
      'duplicate-statement': 'The statements must be different.',
      'no-lie': 'Mark which statement is the lie.'
    },
    cancel: 'Back to setup',
    confirm: 'Done, hide it',
    doneTitle: 'Everyone has written!',
    doneHint: '{count} rounds ready, one per player. The author of a round does not guess on it.',
    missingEntries: 'Every player must write their five statements before starting.',
    saveAsPack: 'Save as local pack',
    packTitle: 'About us ({date})',
    packExplanation: 'Written by {name}.',
    saved: 'Pack saved. Turn it on or edit it in Packs.',
    setupTitle: 'Table content',
    setupNote: 'No packs or filters: each player writes one round about themselves ({count} rounds). The author scores for everyone fooled.',
    summaryLine: '{players} players · one round written by each',
    startWritingAll: 'Write the rounds'
  },
  bluff: {
    result: '{name} fooled {count} ({names}): +{points} points.',
    resultNone: '{name} fooled nobody this time.',
    masterBanner: 'Bluff master: {name}',
    masterBannerHint: '{name} defends all five statements; vote once you have heard them.',
    aboutUsBanner: '{name}\'s statements',
    aboutUsBannerHint: '{name} does not guess; they score for everyone fooled.',
    aboutUsIntro: '{name}\'s round',
    aboutUsIntroHint: '{name}, read your five statements out loud. The others guess one at a time.',
    briefingTitle: 'Only {name} looks',
    briefingHint: 'Everyone else looks away. The master sees which one is fake.',
    briefingReveal: 'Show the fake',
    briefingDefend: 'Defend all five as if they were all true.',
    briefingReady: 'Ready, hide it',
    finalDefense: {
      title: 'Final defense',
      description: 'The master makes a last plea. Everyone may change their vote once before the reveal.'
    }
  },
  kids: {
    toggle: 'Kids (ages 6-9)',
    toggleHint: 'Only easy rounds in simple language, written for children.',
    short: 'Kids'
  },
  editor: {
    title: 'New pack',
    editTitle: 'Edit pack',
    subtitle: 'Write rounds with 5 statements and one fake. The draft is saved on this device.',
    back: 'Back to packs',
    packInfo: 'Pack',
    packTitle: 'Title',
    emoji: 'Cover (emoji)',
    language: 'Language',
    description: 'Description',
    newCategory: 'New category',
    addCategory: 'Add category',
    categoryInvalid: 'Type a category name that does not exist yet.',
    roundTitle: 'Round {number}',
    removeRound: 'Remove',
    statement: 'Statement {number}',
    fake: 'Fake',
    explanation: 'Explanation (shown on reveal)',
    addRound: 'Add round',
    summary: 'Summary',
    summaryLine: '{rounds} rounds · {issues} to fix',
    validate: 'Validate',
    save: 'Save on this device',
    export: 'Export JSON',
    discard: 'Discard draft',
    invalid: '{count} things to fix.',
    valid: 'All good: the pack is ready.',
    saved: 'Pack saved and turned on.',
    exported: 'JSON exported.',
    create: 'Create pack',
    continueDraft: 'Continue draft',
    edit: 'Edit',
    issue: {
      title: 'Give the pack a title.',
      noRounds: 'Add at least one round.',
      category: 'Round {round}: pick a category.',
      statement: 'Round {round}: fill in statement {statement}.',
      statementLong: 'Round {round}: statement {statement} is over 200 characters.',
      duplicate: 'Round {round}: statement {statement} repeats another one in the pack.',
      fake: 'Round {round}: mark which statement is fake.',
      explanation: 'Round {round}: write the explanation.'
    }
  },
  seasonalPacks: {
    title: 'Seasonal packs',
    subtitle: 'Small optional packs, downloaded only when turned on.',
    inSeason: 'In season',
    loading: 'Loading…',
    rounds: '{rounds} rounds'
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
