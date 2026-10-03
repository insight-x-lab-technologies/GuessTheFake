import type { TranslationTree } from '../../core/i18n/i18n';

export const it: TranslationTree = {
  game: {
    scoreLoss: '-{loss} pt',
    title: 'Guess the Fake',
    description: 'Trova la frase falsa tra cinque affermazioni',
    round: 'Turno {current} di {total}',
    activePlayer: 'Tocca a {name}',
    activeTeam: 'Tocca a {name}',
    readyPlayer: '{name}, preparati',
    readyTeam: '{name}, preparatevi',
    prepareHint: 'Il prossimo turno inizia con preparazione e timer.',
    preparation: 'Preparazione',
    secondsLabel: 'secondi',
    chooseFake: 'Scegli la frase falsa',
    chooseFakeAll: '{name}, registra la tua risposta senza mostrarla agli altri',
    statementOptionLabel: 'Frase {number}',
    statementKeyboardHint: 'Usa Tab per entrare nelle carte, le frecce per spostare il focus e i tasti da 1 a 5 per scegliere una frase.',
    revealedPrompt: 'Guarda la risposta e la frase scelta',
    timeLeft: '{seconds} s rimasti',
    timeout: 'Tempo scaduto',
    correct: 'Esatto',
    wrong: 'Non questa volta',
    allGuesses: 'Risposte del tavolo',
    scoreBreakdown: '+{points} pt · bonus {bonus} · moltiplicatore x{multiplier}',
    teamScore: '{name}: {score} pt',
    fakeLabel: 'Falsa',
    selectedLabel: 'La tua scelta',
    pickedByLabel: '{names}',
    nextRound: 'Turno successivo',
    finish: 'Vedi risultato',
    playAgain: 'Nuova partita',
    startTurn: 'Inizia turno',
    revealBoard: 'Mostra le frasi',
    recalibrateScores: 'Ricalibra punteggi',
    recalibrateConfirmTitle: 'Azzerare i punteggi?',
    recalibrateConfirmDescription: 'Giocatori e squadre tornano a 0 punti. Il turno attuale e le risposte restano.',
    recalibrateConfirm: 'Azzera ora',
    recalibrateCancel: 'Annulla',
    recalibrateDone: 'Punteggi azzerati.',
    feedbackLabel: 'Giudizio sul turno',
    feedbackGood: 'Bello',
    feedbackBad: 'Debole',
    feedbackSkip: 'Non ripetere'
  },
  modes: {
    solo: {
      title: 'Solo',
      description: 'Batti il tuo record: una persona, round fissi.'
    },
    classic: { title: 'Classica', description: 'Un giocatore alla volta cerca la frase falsa.' },
    allGuess: { title: 'Rispondono tutti', description: 'Ogni giocatore registra una risposta prima della rivelazione.' },
    teams: { title: 'Squadre', description: 'Le squadre si alternano e fanno punti su un tabellone separato.' }
  },
  setup: {
    variationsTitle: 'Varianti',
    selected: 'Selezionato',
    title: 'Prepara la partita',
    subtitle: 'Scegli modalità, persone, filtri e numero di turni prima di aprire il tavolo.',
    optionsTitle: 'Opzioni della partita',
    filtersTitle: 'Filtri e turni',
    summaryTitle: 'Riepilogo',
    contentStatusTitle: 'Stato dei contenuti',
    previewTitle: 'Categorie disponibili',
    playersHint: 'Separa i nomi con una virgola',
    summaryLine: '{players} giocatori · {rounds} turni scelti · {available} disponibili',
    contentLow: 'Ci sono meno turni disponibili di quelli richiesti; la partita ne userà il più possibile.',
    contentLoading: 'Caricamento dei turni in questa lingua...',
    contentEmpty: 'Non ci sono ancora turni in questa lingua con i filtri attuali. Cambia lingua in Impostazioni, modifica i filtri o importa un pack in Pack.',
    mode: 'Modalità',
    players: 'Giocatori',
    rounds: 'Turni',
    category: 'Categoria',
    difficulty: 'Difficoltà',
    allCategories: 'Tutte le categorie',
    allDifficulties: 'Tutte le difficoltà',
    easy: 'Facile',
    medium: 'Media',
    hard: 'Difficile',
    availableRounds: '{available} turni disponibili; ne verranno usati {selected}.',
    invalidRounds: 'Inserisci almeno 1 turno.',
    notEnoughPlayers: 'Questa modalità richiede almeno {count} giocatori.',
    noRounds: 'Nessun turno disponibile con i filtri attuali.',
    start: 'Inizia'
  },
  app: {
    profiles: 'Famiglia'
  },
  multiDevice: {
    phase: {
      discussing: 'momento al tavolo'
    }
  },
  solo: {
    playSolo: 'Gioca da solo',
    playerTitle: 'Giocatore',
    nameLabel: 'Il tuo nome',
    namePlaceholder: 'Scrivi il tuo nome',
    summaryLine: 'Tu · {rounds} round · {available} disponibili',
    recordLine: 'Il tuo record in questa sfida: {points} pt ({correct}/{total})',
    firstTime: 'Prima volta in questa sfida',
    statsLabel: 'La tua partita',
    points: '{points} pt',
    correctOf: '{correct}/{total} corrette',
    streak: 'Serie {streak}',
    yourGuess: 'La tua risposta',
    finalKicker: 'Sfida solo',
    finalPoints: '{points} pt',
    newRecord: 'Nuovo record!',
    recordCompare: 'Record: {points} pt · mancavano {difference} pt',
    bestStreak: 'Serie migliore: {streak}',
    playAgain: 'Gioca ancora',
    newChallenge: 'Nuova sfida',
    shareText: 'Ho fatto {points} pt e indovinato {correct}/{total} a Guess the Fake ({challenge}).',
    recordsTitle: 'Record solo',
    recordsClear: 'Cancella record',
    recordsEmpty: 'Ancora nessun record solo. Gioca da solo per stabilire il primo.',
    recordRow: '{correct}/{total} corrette · {date}',
    challengeRounds: '{rounds} round',
    challengePacks: '{count} pack extra'
  },
  moments: {
    toggle: 'Momenti al tavolo',
    toggleHint: 'Prima della rivelazione: difendi la scelta, vota o cambia idea. I round durano di più.',
    label: 'Momento al tavolo',
    prompt: 'Parlatene prima della rivelazione',
    reveal: 'Rivela la risposta',
    defend: {
      title: 'Difendi la tua scelta',
      description: 'Chi ha risposto spiega la scelta ad alta voce prima che appaia la risposta.'
    },
    vote: {
      title: 'Vota il bluff migliore',
      description: 'Il tavolo vota chi ha argomentato meglio, giusto o sbagliato. Il voto vale +{bonus} pt.',
      result: '{name} vince il voto del tavolo (+{bonus} pt).'
    },
    'change-mind': {
      title: 'Occasione per cambiare idea',
      description: 'Ogni risposta si può cambiare una volta. Chi cambia perde il bonus velocità.',
      action: 'Cambia la risposta di {name}',
      used: '{name} ha già cambiato',
      pick: 'Scegli la nuova frase sul tabellone.',
      changed: ' · ha cambiato idea'
    }
  },
  specials: {
    toggle: 'Round speciali',
    toggleHint: 'Un round ogni tre ha una sorpresa, e l’ultimo è morte improvvisa.',
    toggleHintSolo: 'Un round ogni tre ha una sorpresa. I record con round speciali contano come un’altra sfida.',
    short: 'round speciali',
    'double-or-nothing': {
      title: 'Raddoppia o niente',
      description: 'Indovinare vale il doppio; sbagliare toglie punti.',
      result: 'Raddoppia o niente: risposte giuste raddoppiate, errori penalizzati.'
    },
    'sudden-death': {
      title: 'Morte improvvisa',
      description: 'Un errore dimezza il tuo punteggio.',
      result: 'Morte improvvisa: l’errore ha dimezzato il punteggio.'
    },
    'gradual-clue': {
      title: 'Indizio graduale',
      description: 'Le frasi appaiono una alla volta. Rispondere presto dà un bonus.',
      result: 'Indizio graduale: +2 pt per ogni frase ancora nascosta.',
      revealNext: 'Mostrane un’altra ({visible}/{total})',
      hiddenLabel: 'Frase {number}, ancora nascosta'
    },
    lightning: {
      title: 'Round lampo',
      description: 'Un terzo del tempo e bonus velocità doppio.',
      result: 'Round lampo: bonus velocità raddoppiato.'
    },
    'category-challenge': {
      title: 'Sfida di categoria',
      description: 'Indovinare vale 1,5x.',
      categoryLine: 'Categoria: {category}. Indovinare vale 1,5x.',
      result: 'Sfida di categoria: risposte giuste a 1,5x.'
    }
  },
  profiles: {
    title: 'Famiglia',
    subtitle: 'Profili locali con avatar, colore, soprannome, statistiche e trofei personali. Nessun account; inclusi nell’esportazione dei dati.',
    createTitle: 'Nuovo profilo',
    editTitle: 'Modifica profilo',
    name: 'Nome',
    nickname: 'Soprannome',
    avatar: 'Avatar',
    avatarOption: 'Avatar {avatar}',
    color: 'Colore',
    colors: {
      coral: 'Corallo',
      amber: 'Ambra',
      lime: 'Lime',
      teal: 'Verde acqua',
      sky: 'Cielo',
      violet: 'Viola',
      rose: 'Rosa',
      slate: 'Ardesia'
    },
    create: 'Crea profilo',
    save: 'Salva',
    cancel: 'Annulla',
    edit: 'Modifica',
    remove: 'Rimuovi',
    created: 'Profilo creato.',
    saved: 'Profilo salvato.',
    removed: 'Profilo rimosso.',
    empty: 'Ancora nessun profilo. Creane uno per ogni persona che gioca spesso.',
    pickLabel: 'Profili della famiglia',
    trophies: 'Trofei personali: {unlocked}/{total}',
    error: {
      'name-required': 'Inserisci un nome.',
      'name-taken': 'Esiste già un profilo con questo nome.',
      limit: 'Limite di profili raggiunto.',
      'not-found': 'Profilo non trovato.'
    },
    stats: {
      matches: 'Partite',
      wins: 'Vittorie',
      points: 'Punti',
      correct: 'Corrette',
      correctValue: '{correct} in {rounds} round',
      solo: 'Record solo',
      soloValue: '{points} pt · {challenge} ({count} sfide)',
      soloEmpty: 'Nessuno per ora'
    }
  },
  tracks: {
    title: 'Percorsi di progresso',
    subtitle: 'Ogni percorso ha tre livelli. Solo e tavolo contano insieme, tranne «Tavolo».',
    nextObjective: 'Prossimo obiettivo',
    level: 'Livello {level}/{total}',
    complete: 'completato',
    tableOnly: 'Solo partite al tavolo',
    group: {
      category: 'Categoria',
      difficulty: 'Difficoltà',
      style: 'Stile di gioco',
      curation: 'Cura dei contenuti'
    },
    category: 'Esperto di {category}',
    difficulty: 'Livello {difficulty}',
    streak: 'Serie',
    perfect: 'Partite perfette',
    table: 'Tavolo',
    solo: 'Solo',
    feedback: 'Curatore di contenuti',
    packs: 'Esploratore di pack',
    objective: {
      category: 'Indovina altre {remaining} in {category} per arrivare a {target}.',
      difficulty: 'Indovina altre {remaining} al livello {difficulty} per arrivare a {target}.',
      streak: 'Fai una serie di {target} risposte giuste di fila.',
      perfect: 'Completa altre {remaining} partite perfette.',
      table: 'Gioca altre {remaining} partite al tavolo.',
      solo: 'Completa altre {remaining} sfide solo.',
      feedback: 'Valuta altri {remaining} round dopo la rivelazione.',
      packs: 'Gioca con altri {remaining} pack diversi (importane uno in Pack).'
    }
  },
  suggest: {
    title: 'Suggerimento',
    minutes: 'Tempo disponibile',
    minutesOption: '{minutes} min',
    summary: '{mode} · {rounds} round · {difficulty} · {category}',
    apply: 'Applica suggerimento',
    applied: 'Suggerimento applicato. Puoi ancora cambiare tutto.',
    reason: {
      modeSolo: 'Una persona: sfida solo.',
      modeSmall: '{players} giocatori: tutti rispondono a ogni round.',
      modeBig: '{players} giocatori: le squadre tengono i turni veloci.',
      newTable: 'Ancora nessuno storico: inizia facile.',
      harder: '{percent}% di risposte giuste a questo livello: è ora di salire.',
      easier: '{percent}% di risposte giuste: un livello più facile è più divertente.',
      keep: '{percent}% di risposte giuste: questo livello va bene.',
      fresh: '{category} è la categoria meno giocata.',
      freshSkippingWeak: '{category} è la categoria meno giocata, escluse quelle valutate deboli.',
      time: '{rounds} round stanno in circa {minutes} min.',
      soloBeat: 'Il tuo record qui è {points} pt: prova a batterlo.',
      soloHarder: 'I tuoi record sono perfetti: prova un livello più difficile.',
      soloFirst: 'Prima sfida: 5 round facili.'
    }
  },
  presenter: {
    title: 'Modalità presentatore',
    description: 'Vista da sala per TV o proiettore: punteggi, timer, frasi e rivelazione in grande.',
    open: 'Modalità presentatore',
    openWindow: 'Schermo di visualizzazione',
    close: 'Esci',
    windowOpened: 'Schermo di visualizzazione aperto in una nuova finestra, collegato a questa sessione.',
    turn: 'Tocca a {name}',
    finalTitle: 'Punteggio finale',
    scoreboard: 'Punteggi'
  },
  packMeta: {
    license: {
      community: 'Community',
      'premium-unverified': 'Premium · firma non verificata',
      'premium-unsigned': 'Premium · senza firma'
    },
    audience: {
      family: 'Famiglia',
      kids: 'Bambini',
      teens: 'Ragazzi',
      adults: 'Adulti'
    },
    difficulty: {
      easy: 'Facile',
      medium: 'Media',
      hard: 'Difficile',
      mixed: 'Difficoltà mista'
    },
    version: 'v{version}',
    author: 'Di {author}',
    changelog: 'Cronologia versioni'
  }
};
