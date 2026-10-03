import type { TranslationTree } from '../../core/i18n/i18n';

export const es: TranslationTree = {
  game: {
    scoreLoss: '-{loss} pts',
    title: 'Guess the Fake',
    description: 'Encuentra la frase falsa entre cinco afirmaciones',
    round: 'Ronda {current} de {total}',
    activePlayer: 'Turno de {name}',
    activeTeam: 'Turno de {name}',
    readyPlayer: '{name}, prepárate',
    readyTeam: '{name}, prepárense',
    prepareHint: 'La próxima ronda empieza con preparación y temporizador.',
    preparation: 'Preparación',
    secondsLabel: 'segundos',
    chooseFake: 'Elige la frase falsa',
    chooseFakeAll: '{name}, registra tu respuesta sin mostrarla a los demás',
    statementOptionLabel: 'Frase {number}',
    statementKeyboardHint: 'Usa Tab para entrar en las tarjetas, las flechas para mover el foco y las teclas del 1 al 5 para elegir una frase.',
    revealedPrompt: 'Revisa la respuesta y la frase elegida',
    timeLeft: 'Quedan {seconds} s',
    timeout: 'Se acabó el tiempo',
    correct: '¡Correcto!',
    wrong: 'Esta vez no',
    allGuesses: 'Respuestas de la mesa',
    scoreBreakdown: '+{points} pts · bonus {bonus} · multiplicador x{multiplier}',
    teamScore: '{name}: {score} pts',
    fakeLabel: 'Falsa',
    selectedLabel: 'Tu elección',
    pickedByLabel: '{names}',
    nextRound: 'Siguiente ronda',
    finish: 'Ver resultado',
    playAgain: 'Nueva partida',
    startTurn: 'Empezar turno',
    revealBoard: 'Mostrar frases',
    recalibrateScores: 'Recalibrar puntuación',
    recalibrateConfirmTitle: '¿Poner la puntuación a cero?',
    recalibrateConfirmDescription: 'Jugadores y equipos vuelven a 0 puntos. La ronda actual y las respuestas se mantienen.',
    recalibrateConfirm: 'Poner a cero',
    recalibrateCancel: 'Cancelar',
    recalibrateDone: 'Puntuación a cero.',
    feedbackLabel: 'Opinión sobre la ronda',
    feedbackGood: 'Buena',
    feedbackBad: 'Floja',
    feedbackSkip: 'No repetir'
  },
  modes: {
    solo: {
      title: 'Solo',
      description: 'Supera tu propio récord: una persona, rondas fijas.'
    },
    classic: { title: 'Clásico', description: 'Un jugador por turno intenta encontrar la frase falsa.' },
    allGuess: { title: 'Todos responden', description: 'Cada jugador registra su respuesta antes de la revelación.' },
    teams: { title: 'Equipos', description: 'Los equipos alternan turnos y puntúan en un marcador aparte.' }
  },
  setup: {
    variationsTitle: 'Variaciones',
    selected: 'Seleccionado',
    title: 'Preparar partida',
    subtitle: 'Elige modo, personas, filtros y número de rondas antes de abrir la mesa.',
    optionsTitle: 'Opciones de la partida',
    filtersTitle: 'Filtros y rondas',
    summaryTitle: 'Resumen',
    contentStatusTitle: 'Estado del contenido',
    previewTitle: 'Categorías disponibles',
    playersHint: 'Separa los nombres con comas',
    summaryLine: '{players} jugadores · {rounds} rondas elegidas · {available} disponibles',
    contentLow: 'Hay menos rondas disponibles de las pedidas; la partida usará el máximo posible.',
    contentLoading: 'Cargando las rondas de este idioma...',
    contentEmpty: 'Todavía no hay rondas para este idioma con los filtros actuales. Cambia el idioma en Configuración, ajusta los filtros o importa un pack en Packs.',
    mode: 'Modo',
    players: 'Jugadores',
    rounds: 'Rondas',
    category: 'Categoría',
    difficulty: 'Dificultad',
    allCategories: 'Todas las categorías',
    allDifficulties: 'Todas las dificultades',
    easy: 'Fácil',
    medium: 'Media',
    hard: 'Difícil',
    availableRounds: '{available} rondas disponibles; se usarán {selected}.',
    invalidRounds: 'Indica al menos 1 ronda.',
    notEnoughPlayers: 'Este modo necesita al menos {count} jugadores.',
    noRounds: 'No hay rondas disponibles con los filtros actuales.',
    start: 'Empezar'
  },
  app: {
    profiles: 'Familia'
  },
  multiDevice: {
    phase: {
      discussing: 'momento de mesa'
    }
  },
  solo: {
    playSolo: 'Jugar solo',
    playerTitle: 'Jugador',
    nameLabel: 'Tu nombre',
    namePlaceholder: 'Escribe tu nombre',
    summaryLine: 'Tú · {rounds} rondas · {available} disponibles',
    recordLine: 'Tu récord en este desafío: {points} pts ({correct}/{total})',
    firstTime: 'Primera vez en este desafío',
    statsLabel: 'Tu partida',
    points: '{points} pts',
    correctOf: '{correct}/{total} aciertos',
    streak: 'Racha {streak}',
    yourGuess: 'Tu respuesta',
    finalKicker: 'Desafío solo',
    finalPoints: '{points} pts',
    newRecord: '¡Nuevo récord!',
    recordCompare: 'Récord: {points} pts · faltaron {difference} pts',
    bestStreak: 'Mejor racha: {streak}',
    playAgain: 'Jugar otra vez',
    newChallenge: 'Nuevo desafío',
    shareText: 'Hice {points} pts y acerté {correct}/{total} en Guess the Fake ({challenge}).',
    recordsTitle: 'Récords solo',
    recordsClear: 'Borrar récords',
    recordsEmpty: 'Aún no hay récords solo. Juega solo para marcar el primero.',
    recordRow: '{correct}/{total} aciertos · {date}',
    challengeRounds: '{rounds} rondas',
    challengePacks: '{count} packs extra'
  },
  moments: {
    toggle: 'Momentos de mesa',
    toggleHint: 'Antes de revelar: defiende tu elección, vota o cambia de idea. Las rondas duran más.',
    label: 'Momento de mesa',
    prompt: 'Coméntenlo antes de revelar',
    reveal: 'Revelar respuesta',
    defend: {
      title: 'Defiende tu elección',
      description: 'Quien respondió explica su elección en voz alta antes de que aparezca la respuesta.'
    },
    vote: {
      title: 'Vota por el mejor farol',
      description: 'La mesa vota por quien argumentó mejor, acierte o no. El voto vale +{bonus} pts.',
      result: '{name} ganó la votación de la mesa (+{bonus} pts).'
    },
    'change-mind': {
      title: 'Oportunidad de cambiar de idea',
      description: 'Cada respuesta puede cambiarse una vez. Quien cambia pierde el bonus de velocidad.',
      action: 'Cambiar respuesta de {name}',
      used: '{name} ya cambió',
      pick: 'Elige la nueva frase en el tablero.',
      changed: ' · cambió de idea'
    }
  },
  specials: {
    toggle: 'Rondas especiales',
    toggleHint: 'Cada tres rondas una trae un giro, y la última es muerte súbita.',
    toggleHintSolo: 'Cada tres rondas una trae un giro. Los récords con rondas especiales cuentan como otro desafío.',
    short: 'rondas especiales',
    'double-or-nothing': {
      title: 'Doble o nada',
      description: 'Acertar vale el doble; fallar quita puntos.',
      result: 'Doble o nada: los aciertos se duplicaron y los fallos restaron.'
    },
    'sudden-death': {
      title: 'Muerte súbita',
      description: 'Un fallo reduce tu marcador a la mitad.',
      result: 'Muerte súbita: el fallo redujo el marcador a la mitad.'
    },
    'gradual-clue': {
      title: 'Pista gradual',
      description: 'Las frases aparecen de una en una. Responder pronto da bonus.',
      result: 'Pista gradual: +2 pts por cada frase aún oculta.',
      revealNext: 'Mostrar una más ({visible}/{total})',
      hiddenLabel: 'Frase {number}, aún oculta'
    },
    lightning: {
      title: 'Ronda relámpago',
      description: 'Un tercio del tiempo y bonus de velocidad doble.',
      result: 'Ronda relámpago: bonus de velocidad doble.'
    },
    'category-challenge': {
      title: 'Desafío de categoría',
      description: 'Acertar vale 1,5x.',
      categoryLine: 'Categoría: {category}. Acertar vale 1,5x.',
      result: 'Desafío de categoría: los aciertos valieron 1,5x.'
    }
  },
  profiles: {
    title: 'Familia',
    subtitle: 'Perfiles locales con avatar, color, apodo, estadísticas y trofeos personales. Sin cuenta; entran en la exportación de datos.',
    createTitle: 'Nuevo perfil',
    editTitle: 'Editar perfil',
    name: 'Nombre',
    nickname: 'Apodo',
    avatar: 'Avatar',
    avatarOption: 'Avatar {avatar}',
    color: 'Color',
    colors: {
      coral: 'Coral',
      amber: 'Ámbar',
      lime: 'Lima',
      teal: 'Verde azulado',
      sky: 'Cielo',
      violet: 'Violeta',
      rose: 'Rosa',
      slate: 'Pizarra'
    },
    create: 'Crear perfil',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    remove: 'Eliminar',
    created: 'Perfil creado.',
    saved: 'Perfil guardado.',
    removed: 'Perfil eliminado.',
    empty: 'Aún no hay perfiles. Crea uno para cada persona que juega a menudo.',
    pickLabel: 'Perfiles de la familia',
    trophies: 'Trofeos personales: {unlocked}/{total}',
    error: {
      'name-required': 'Escribe un nombre.',
      'name-taken': 'Ya existe un perfil con ese nombre.',
      limit: 'Se alcanzó el límite de perfiles.',
      'not-found': 'Perfil no encontrado.'
    },
    stats: {
      matches: 'Partidas',
      wins: 'Victorias',
      points: 'Puntos',
      correct: 'Aciertos',
      correctValue: '{correct} en {rounds} rondas',
      solo: 'Récord solo',
      soloValue: '{points} pts · {challenge} ({count} desafíos)',
      soloEmpty: 'Ninguno todavía'
    }
  },
  tracks: {
    title: 'Rutas de progreso',
    subtitle: 'Cada ruta tiene tres niveles. Solo y mesa cuentan juntos, salvo "Mesa".',
    nextObjective: 'Próximo objetivo',
    level: 'Nivel {level}/{total}',
    complete: 'completa',
    tableOnly: 'Solo partidas de mesa',
    group: {
      category: 'Categoría',
      difficulty: 'Dificultad',
      style: 'Estilo de juego',
      curation: 'Curaduría'
    },
    category: 'Experto en {category}',
    difficulty: 'Nivel {difficulty}',
    streak: 'Rachas',
    perfect: 'Partidas perfectas',
    table: 'Mesa',
    solo: 'Solo',
    feedback: 'Curador de contenido',
    packs: 'Explorador de packs',
    objective: {
      category: 'Acierta {remaining} más en {category} para llegar a {target}.',
      difficulty: 'Acierta {remaining} más en nivel {difficulty} para llegar a {target}.',
      streak: 'Consigue una racha de {target} aciertos seguidos.',
      perfect: 'Termina {remaining} partidas perfectas más.',
      table: 'Juega {remaining} partidas de mesa más.',
      solo: 'Termina {remaining} desafíos solo más.',
      feedback: 'Valora {remaining} rondas más después de revelar.',
      packs: 'Juega con {remaining} packs distintos más (importa uno en Packs).'
    }
  },
  suggest: {
    title: 'Sugerencia',
    minutes: 'Tiempo disponible',
    minutesOption: '{minutes} min',
    summary: '{mode} · {rounds} rondas · {difficulty} · {category}',
    apply: 'Aplicar sugerencia',
    applied: 'Sugerencia aplicada. Aún puedes cambiarlo todo.',
    reason: {
      modeSolo: 'Una persona: desafío solo.',
      modeSmall: '{players} jugadores: todos responden cada ronda.',
      modeBig: '{players} jugadores: los equipos mantienen los turnos ágiles.',
      newTable: 'Sin historial todavía: empieza en fácil.',
      harder: '{percent}% de aciertos en este nivel: toca subir.',
      easier: '{percent}% de aciertos: un nivel más fácil lo hace más divertido.',
      keep: '{percent}% de aciertos: este nivel encaja.',
      fresh: '{category} es la categoría menos jugada.',
      freshSkippingWeak: '{category} es la categoría menos jugada, sin las valoradas como flojas.',
      time: '{rounds} rondas caben en unos {minutes} min.',
      soloBeat: 'Tu récord aquí es {points} pts: intenta superarlo.',
      soloHarder: 'Tus récords son perfectos: prueba un nivel más difícil.',
      soloFirst: 'Primer desafío: 5 rondas fáciles.'
    }
  },
  presenter: {
    title: 'Modo presentador',
    description: 'Vista de sala para TV o proyector: marcador, temporizador, frases y revelación en grande.',
    open: 'Modo presentador',
    openWindow: 'Pantalla de exhibición',
    close: 'Salir',
    windowOpened: 'Pantalla de exhibición abierta en una ventana nueva, vinculada a esta sesión.',
    turn: 'Turno de {name}',
    finalTitle: 'Marcador final',
    scoreboard: 'Marcador'
  },
  packMeta: {
    license: {
      community: 'Comunidad',
      'premium-unverified': 'Premium · firma no verificada',
      'premium-unsigned': 'Premium · sin firma'
    },
    audience: {
      family: 'Familia',
      kids: 'Niños',
      teens: 'Adolescentes',
      adults: 'Adultos'
    },
    difficulty: {
      easy: 'Fácil',
      medium: 'Media',
      hard: 'Difícil',
      mixed: 'Dificultad mixta'
    },
    version: 'v{version}',
    author: 'Por {author}',
    changelog: 'Historial de versiones'
  }
};
