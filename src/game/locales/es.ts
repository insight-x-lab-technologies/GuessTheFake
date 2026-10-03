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
    teams: { title: 'Equipos', description: 'Los equipos alternan turnos y puntúan en un marcador aparte.' },
    aboutUs: {
      title: 'Sobre nosotros',
      description: 'Cada uno escribe 4 verdades y 1 mentira sobre sí; la mesa adivina.'
    },
    bluffMaster: {
      title: 'Maestro del farol',
      description: 'Un jugador sabe cuál es la falsa y defiende las cinco; cada engañado suma.'
    }
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
  },
  art: {
    avatars: {
      fox: 'Zorro',
      panda: 'Panda',
      owl: 'Búho',
      octopus: 'Pulpo',
      lion: 'León',
      turtle: 'Tortuga',
      penguin: 'Pingüino',
      unicorn: 'Unicornio',
      bee: 'Abeja',
      whale: 'Ballena',
      cactus: 'Cactus',
      rocket: 'Cohete',
      cat: 'Gato',
      dog: 'Perro',
      frog: 'Rana',
      bear: 'Oso',
      rabbit: 'Conejo',
      koala: 'Koala',
      monkey: 'Mono',
      pig: 'Cerdito',
      chick: 'Pollito',
      robot: 'Robot',
      alien: 'Alienígena',
      ghost: 'Fantasmita'
    },
    defaultAvatar: 'Jugador sin perfil',
    medal: {
      bronze: 'Bronce',
      silver: 'Plata',
      gold: 'Oro',
      legendary: 'Legendaria',
      label: 'Medalla {rarity}',
      locked: 'Bloqueada',
      unlockedRarity: '{rarity} desbloqueada'
    },
    seasonal: {
      halloween: {
        title: 'Ambiente de Halloween',
        body: 'Murciélagos, calabazas y la música de otoño para la mesa.'
      },
      festive: {
        title: 'Ambiente de fiestas',
        body: 'Luces, nieve y brillo de fin de año para la mesa.'
      },
      apply: 'Usar tema',
      dismiss: 'Ahora no',
      settingsHint: 'Temas de temporada: aplícalos cuando quieras; en su época la app los sugiere en el inicio.'
    },
    tracks: {
      heading: 'Música',
      mapping: 'Este tema reproduce la pista {track}.',
      cosmic: 'Cósmica',
      spring: 'Primavera',
      autumn: 'Otoño'
    }
  },
  juice: {
    menu: {
      label: 'Más acciones de la ronda'
    },
    scoreboard: 'Marcador',
    stamp: 'FALSO',
    bonusFloat: '+{bonus} bonus',
    countdown: '{seconds} para empezar',
    pass: {
      title: 'Pásalo a {name}',
      hint: 'Sin espiar: la respuesta anterior queda oculta.',
      ready: 'Soy {name}, mostrar'
    },
    podium: {
      kicker: 'Podio',
      label: 'Podio de la partida',
      points: '{points} pts',
      place: '{place}.º puesto',
      restLine: '{place}.º {name} · {points} pts'
    },
    highlights: {
      label: 'Momentos de la partida',
      fastest: 'El más rápido',
      'longest-streak': 'Mejor racha',
      'best-bluff': 'Mejor engaño',
      fastestLine: '{name} acertó en {seconds} s de media',
      streakLine: '{name} acertó {streak} seguidas',
      bluffLine: '"{text}" engañó a {count}'
    },
    rematch: 'Revancha',
    solo: {
      you: 'Tú',
      record: 'Récord',
      previousRecord: 'Récord anterior'
    },
    settings: {
      passDevice: 'Pasar el dispositivo entre respuestas',
      passDeviceHint: 'En "todos responden" y equipos, muestra una pantalla de cambio que oculta la respuesta anterior.',
      vibration: 'Vibrar en los últimos segundos',
      vibrationUnsupported: 'Este dispositivo o navegador no vibra.'
    }
  },
  aboutUs: {
    category: 'Sobre nosotros',
    subtitle: 'Cada jugador escribe en su turno. Nada sale de este dispositivo.',
    progress: 'Jugador {current} de {total}',
    startWriting: 'Escribir mis frases',
    writeTitle: '{name}, escribe sobre ti',
    writeHint: 'Cuatro verdades y una mentira. Marca la mentira; las frases se barajan.',
    statementLabel: 'Frase {number}',
    lieLabel: 'Mentira',
    issue: {
      'empty-statement': 'Completa las cinco frases.',
      'too-long': 'Cada frase puede tener hasta 140 caracteres.',
      'duplicate-statement': 'Las frases deben ser distintas.',
      'no-lie': 'Marca qué frase es la mentira.'
    },
    cancel: 'Volver a la configuración',
    confirm: 'Listo, ocultar',
    doneTitle: '¡Todos han escrito!',
    doneHint: '{count} rondas listas, una por jugador. Quien escribió la ronda no adivina en ella.',
    missingEntries: 'Cada jugador debe escribir sus cinco frases antes de empezar.',
    saveAsPack: 'Guardar como pack local',
    packTitle: 'Sobre nosotros ({date})',
    packExplanation: 'Frase escrita por {name}.',
    saved: 'Pack guardado. Actívalo o edítalo en Packs.',
    setupTitle: 'Contenido de la mesa',
    setupNote: 'Sin packs ni filtros: cada jugador escribe una ronda sobre sí ({count} rondas). El autor puntúa por cada engañado.',
    summaryLine: '{players} jugadores · una ronda escrita por cada uno',
    startWritingAll: 'Escribir las rondas'
  },
  bluff: {
    result: '{name} engañó a {count} ({names}): +{points} puntos.',
    resultNone: '{name} no engañó a nadie esta vez.',
    masterBanner: 'Maestro del farol: {name}',
    masterBannerHint: '{name} defiende las cinco frases; vota cuando las escuches.',
    aboutUsBanner: 'Frases de {name}',
    aboutUsBannerHint: '{name} no adivina; puntúa por cada engañado.',
    aboutUsIntro: 'Ronda de {name}',
    aboutUsIntroHint: '{name}, lee tus cinco frases en voz alta. Los demás adivinan de uno en uno.',
    briefingTitle: 'Solo mira {name}',
    briefingHint: 'Los demás apartan la vista. El maestro ve cuál es la falsa.',
    briefingReveal: 'Ver la falsa',
    briefingDefend: 'Defiende las cinco como si todas fueran verdad.',
    briefingReady: 'Listo, ocultar',
    finalDefense: {
      title: 'Defensa final',
      description: 'El maestro hace su último alegato. Cada uno puede cambiar su voto una vez antes de revelar.'
    }
  },
  kids: {
    toggle: 'Kids (6-9 años)',
    toggleHint: 'Solo rondas fáciles con lenguaje sencillo, escritas para niños.',
    short: 'Kids'
  },
  editor: {
    title: 'Nuevo pack',
    editTitle: 'Editar pack',
    subtitle: 'Escribe rondas con 5 frases y una falsa. El borrador se guarda en este dispositivo.',
    back: 'Volver a los packs',
    packInfo: 'Pack',
    packTitle: 'Título',
    emoji: 'Portada (emoji)',
    language: 'Idioma',
    description: 'Descripción',
    newCategory: 'Nueva categoría',
    addCategory: 'Añadir categoría',
    categoryInvalid: 'Escribe un nombre de categoría que aún no exista.',
    roundTitle: 'Ronda {number}',
    removeRound: 'Quitar',
    statement: 'Frase {number}',
    fake: 'Falsa',
    explanation: 'Explicación (se ve al revelar)',
    addRound: 'Añadir ronda',
    summary: 'Resumen',
    summaryLine: '{rounds} rondas · {issues} pendientes',
    validate: 'Validar',
    save: 'Guardar en el dispositivo',
    export: 'Exportar JSON',
    discard: 'Descartar borrador',
    invalid: '{count} pendientes por corregir.',
    valid: 'Todo bien: el pack está listo.',
    saved: 'Pack guardado y activado.',
    exported: 'JSON exportado.',
    create: 'Crear pack',
    continueDraft: 'Seguir el borrador',
    edit: 'Editar',
    issue: {
      title: 'Ponle un título al pack.',
      noRounds: 'Añade al menos una ronda.',
      category: 'Ronda {round}: elige una categoría.',
      statement: 'Ronda {round}: completa la frase {statement}.',
      statementLong: 'Ronda {round}: la frase {statement} supera los 200 caracteres.',
      duplicate: 'Ronda {round}: la frase {statement} repite otra del pack.',
      fake: 'Ronda {round}: marca qué frase es la falsa.',
      explanation: 'Ronda {round}: escribe la explicación.'
    }
  },
  seasonalPacks: {
    title: 'Packs de temporada',
    subtitle: 'Packs pequeños y opcionales, descargados solo al activarlos.',
    inSeason: 'De temporada',
    loading: 'Cargando…',
    rounds: '{rounds} rondas'
  }
};
