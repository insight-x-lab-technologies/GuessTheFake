import type { TranslationTree } from '../../core/i18n/i18n';

export const de: TranslationTree = {
  game: {
    scoreLoss: '-{loss} Pkt.',
    title: 'Guess the Fake',
    description: 'Finde die falsche Aussage unter fünf Behauptungen',
    round: 'Runde {current} von {total}',
    activePlayer: '{name} ist dran',
    activeTeam: '{name} ist dran',
    readyPlayer: '{name}, mach dich bereit',
    readyTeam: '{name}, macht euch bereit',
    prepareHint: 'Die nächste Runde beginnt mit Vorbereitung und Timer.',
    preparation: 'Vorbereitung',
    secondsLabel: 'Sekunden',
    chooseFake: 'Wähle die falsche Aussage',
    chooseFakeAll: '{name}, gib deinen Tipp ab, ohne ihn den anderen zu zeigen',
    statementOptionLabel: 'Aussage {number}',
    statementKeyboardHint: 'Mit Tab zu den Karten, mit den Pfeiltasten den Fokus bewegen und mit den Tasten 1 bis 5 eine Aussage wählen.',
    revealedPrompt: 'Sieh dir die Lösung und die gewählte Aussage an',
    timeLeft: 'Noch {seconds} s',
    timeout: 'Zeit abgelaufen',
    correct: 'Richtig',
    wrong: 'Diesmal nicht',
    allGuesses: 'Tipps am Tisch',
    scoreBreakdown: '+{points} Pkt. · Bonus {bonus} · Multiplikator x{multiplier}',
    teamScore: '{name}: {score} Pkt.',
    fakeLabel: 'Falsch',
    selectedLabel: 'Deine Wahl',
    pickedByLabel: '{names}',
    nextRound: 'Nächste Runde',
    finish: 'Ergebnis ansehen',
    playAgain: 'Neues Spiel',
    startTurn: 'Zug starten',
    revealBoard: 'Aussagen zeigen',
    recalibrateScores: 'Punkte neu setzen',
    recalibrateConfirmTitle: 'Punkte zurücksetzen?',
    recalibrateConfirmDescription: 'Spieler und Teams starten wieder bei 0 Punkten. Die aktuelle Runde und die Tipps bleiben erhalten.',
    recalibrateConfirm: 'Jetzt zurücksetzen',
    recalibrateCancel: 'Abbrechen',
    recalibrateDone: 'Punkte zurückgesetzt.',
    feedbackLabel: 'Feedback zur Runde',
    feedbackGood: 'Gut',
    feedbackBad: 'Schwach',
    feedbackSkip: 'Nicht wiederholen'
  },
  modes: {
    solo: {
      title: 'Solo',
      description: 'Schlag deinen eigenen Rekord: eine Person, feste Runden.'
    },
    classic: { title: 'Klassisch', description: 'Reihum versucht jeweils ein Spieler, die falsche Aussage zu finden.' },
    allGuess: { title: 'Alle tippen', description: 'Alle geben vor der Auflösung einen Tipp ab.' },
    teams: { title: 'Teams', description: 'Teams wechseln sich ab und punkten auf einer eigenen Tafel.' },
    aboutUs: {
      title: 'Über uns',
      description: 'Alle schreiben 4 Wahrheiten und 1 Lüge über sich; der Tisch rät.'
    },
    bluffMaster: {
      title: 'Bluffmeister',
      description: 'Eine Person kennt die Fälschung und verteidigt alle fünf; jede getäuschte Person zählt.'
    }
  },
  setup: {
    variationsTitle: 'Varianten',
    selected: 'Ausgewählt',
    title: 'Spiel vorbereiten',
    subtitle: 'Modus, Personen, Filter und Rundenzahl festlegen, bevor es losgeht.',
    optionsTitle: 'Spieloptionen',
    filtersTitle: 'Filter und Runden',
    summaryTitle: 'Übersicht',
    contentStatusTitle: 'Inhaltsstatus',
    previewTitle: 'Verfügbare Kategorien',
    playersHint: 'Namen mit Kommas trennen',
    summaryLine: '{players} Spieler · {rounds} Runden gewählt · {available} verfügbar',
    contentLow: 'Es gibt weniger Runden als gewünscht; das Spiel nutzt so viele wie möglich.',
    contentLoading: 'Runden für diese Sprache werden geladen...',
    contentEmpty: 'Für diese Sprache gibt es mit den aktuellen Filtern noch keine Runden. Ändere die Sprache in den Einstellungen, passe die Filter an oder importiere ein Pack unter Packs.',
    mode: 'Modus',
    players: 'Spieler',
    rounds: 'Runden',
    category: 'Kategorie',
    difficulty: 'Schwierigkeit',
    allCategories: 'Alle Kategorien',
    allDifficulties: 'Alle Schwierigkeiten',
    easy: 'Leicht',
    medium: 'Mittel',
    hard: 'Schwer',
    availableRounds: '{available} Runden verfügbar; {selected} werden gespielt.',
    invalidRounds: 'Gib mindestens 1 Runde an.',
    notEnoughPlayers: 'Dieser Modus braucht mindestens {count} Spieler.',
    noRounds: 'Mit den aktuellen Filtern sind keine Runden verfügbar.',
    start: 'Starten'
  },
  app: {
    profiles: 'Familie'
  },
  multiDevice: {
    phase: {
      discussing: 'Tischmoment'
    }
  },
  solo: {
    playSolo: 'Allein spielen',
    playerTitle: 'Spieler',
    nameLabel: 'Dein Name',
    namePlaceholder: 'Namen eingeben',
    summaryLine: 'Du · {rounds} Runden · {available} verfügbar',
    recordLine: 'Dein Rekord in dieser Herausforderung: {points} Pkt. ({correct}/{total})',
    firstTime: 'Zum ersten Mal in dieser Herausforderung',
    statsLabel: 'Deine Partie',
    points: '{points} Pkt.',
    correctOf: '{correct}/{total} richtig',
    streak: 'Serie {streak}',
    yourGuess: 'Dein Tipp',
    finalKicker: 'Solo-Herausforderung',
    finalPoints: '{points} Pkt.',
    newRecord: 'Neuer Rekord!',
    recordCompare: 'Rekord: {points} Pkt. · {difference} Pkt. fehlten',
    bestStreak: 'Beste Serie: {streak}',
    playAgain: 'Nochmal spielen',
    newChallenge: 'Neue Herausforderung',
    shareText: 'Ich habe {points} Pkt. geholt und {correct}/{total} richtig in Guess the Fake ({challenge}).',
    recordsTitle: 'Solo-Rekorde',
    recordsClear: 'Rekorde löschen',
    recordsEmpty: 'Noch keine Solo-Rekorde. Spiel allein, um den ersten aufzustellen.',
    recordRow: '{correct}/{total} richtig · {date}',
    challengeRounds: '{rounds} Runden',
    challengePacks: '{count} zusätzliche Packs'
  },
  moments: {
    toggle: 'Tischmomente',
    toggleHint: 'Vor der Auflösung: Wahl verteidigen, abstimmen oder umentscheiden. Runden dauern länger.',
    label: 'Tischmoment',
    prompt: 'Besprecht es vor der Auflösung',
    reveal: 'Antwort auflösen',
    defend: {
      title: 'Verteidige deine Wahl',
      description: 'Wer getippt hat, erklärt die Wahl laut, bevor die Antwort erscheint.'
    },
    vote: {
      title: 'Stimmt für den besten Bluff',
      description: 'Der Tisch stimmt für die beste Begründung, ob richtig oder falsch. Die Stimme bringt +{bonus} Pkt.',
      result: '{name} gewinnt die Tischabstimmung (+{bonus} Pkt.).'
    },
    'change-mind': {
      title: 'Chance zum Umentscheiden',
      description: 'Jeder Tipp darf einmal geändert werden. Wer ändert, verliert den Tempobonus.',
      action: 'Tipp von {name} ändern',
      used: '{name} hat schon geändert',
      pick: 'Wähle die neue Aussage auf dem Spielfeld.',
      changed: ' · umentschieden'
    }
  },
  specials: {
    toggle: 'Spezialrunden',
    toggleHint: 'Jede dritte Runde hat einen Dreh, und die letzte ist Sudden Death.',
    toggleHintSolo: 'Jede dritte Runde hat einen Dreh. Rekorde mit Spezialrunden zählen als eigene Herausforderung.',
    short: 'Spezialrunden',
    'double-or-nothing': {
      title: 'Doppelt oder nichts',
      description: 'Ein Treffer zählt doppelt; ein Fehler kostet Punkte.',
      result: 'Doppelt oder nichts: Treffer verdoppelt, Fehler kosteten Punkte.'
    },
    'sudden-death': {
      title: 'Sudden Death',
      description: 'Ein Fehler halbiert deinen Punktestand.',
      result: 'Sudden Death: Der Fehler hat den Punktestand halbiert.'
    },
    'gradual-clue': {
      title: 'Schrittweiser Hinweis',
      description: 'Die Aussagen erscheinen nach und nach. Früh tippen bringt Bonus.',
      result: 'Schrittweiser Hinweis: +2 Pkt. pro noch verdeckter Aussage.',
      revealNext: 'Noch eine zeigen ({visible}/{total})',
      hiddenLabel: 'Aussage {number}, noch verdeckt'
    },
    lightning: {
      title: 'Blitzrunde',
      description: 'Ein Drittel der Zeit und doppelter Tempobonus.',
      result: 'Blitzrunde: Tempobonus verdoppelt.'
    },
    'category-challenge': {
      title: 'Kategorie-Herausforderung',
      description: 'Ein Treffer zählt 1,5-fach.',
      categoryLine: 'Kategorie: {category}. Ein Treffer zählt 1,5-fach.',
      result: 'Kategorie-Herausforderung: Treffer zählten 1,5-fach.'
    }
  },
  profiles: {
    title: 'Familie',
    subtitle: 'Lokale Profile mit Avatar, Farbe, Spitzname, Statistiken und persönlichen Trophäen. Kein Konto; im Datenexport enthalten.',
    createTitle: 'Neues Profil',
    editTitle: 'Profil bearbeiten',
    name: 'Name',
    nickname: 'Spitzname',
    avatar: 'Avatar',
    avatarOption: 'Avatar {avatar}',
    color: 'Farbe',
    colors: {
      coral: 'Koralle',
      amber: 'Bernstein',
      lime: 'Limette',
      teal: 'Petrol',
      sky: 'Himmel',
      violet: 'Violett',
      rose: 'Rosa',
      slate: 'Schiefer'
    },
    create: 'Profil anlegen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    edit: 'Bearbeiten',
    remove: 'Entfernen',
    created: 'Profil angelegt.',
    saved: 'Profil gespeichert.',
    removed: 'Profil entfernt.',
    empty: 'Noch keine Profile. Lege eins für jede Person an, die oft mitspielt.',
    pickLabel: 'Familienprofile',
    trophies: 'Persönliche Trophäen: {unlocked}/{total}',
    error: {
      'name-required': 'Gib einen Namen ein.',
      'name-taken': 'Es gibt schon ein Profil mit diesem Namen.',
      limit: 'Profilgrenze erreicht.',
      'not-found': 'Profil nicht gefunden.'
    },
    stats: {
      matches: 'Partien',
      wins: 'Siege',
      points: 'Punkte',
      correct: 'Richtig',
      correctValue: '{correct} in {rounds} Runden',
      solo: 'Solo-Rekord',
      soloValue: '{points} Pkt. · {challenge} ({count} Herausforderungen)',
      soloEmpty: 'Noch keiner'
    }
  },
  tracks: {
    title: 'Fortschrittspfade',
    subtitle: 'Jeder Pfad hat drei Stufen. Solo und Tisch zählen gemeinsam, außer „Tisch“.',
    nextObjective: 'Nächstes Ziel',
    level: 'Stufe {level}/{total}',
    complete: 'abgeschlossen',
    tableOnly: 'Nur Tischpartien',
    group: {
      category: 'Kategorie',
      difficulty: 'Schwierigkeit',
      style: 'Spielstil',
      curation: 'Kuratierung'
    },
    category: 'Profi für {category}',
    difficulty: 'Stufe {difficulty}',
    streak: 'Serien',
    perfect: 'Perfekte Partien',
    table: 'Tisch',
    solo: 'Solo',
    feedback: 'Inhaltskurator',
    packs: 'Pack-Entdecker',
    objective: {
      category: 'Noch {remaining} richtige Antworten in {category}, um {target} zu erreichen.',
      difficulty: 'Noch {remaining} richtige Antworten auf Stufe {difficulty}, um {target} zu erreichen.',
      streak: 'Schaffe eine Serie von {target} Treffern am Stück.',
      perfect: 'Beende noch {remaining} perfekte Partien.',
      table: 'Spiele noch {remaining} Tischpartien.',
      solo: 'Beende noch {remaining} Solo-Herausforderungen.',
      feedback: 'Bewerte noch {remaining} Runden nach der Auflösung.',
      packs: 'Spiele mit {remaining} weiteren Packs (importiere eins unter Packs).'
    }
  },
  suggest: {
    title: 'Vorschlag',
    minutes: 'Verfügbare Zeit',
    minutesOption: '{minutes} Min.',
    summary: '{mode} · {rounds} Runden · {difficulty} · {category}',
    apply: 'Vorschlag übernehmen',
    applied: 'Vorschlag übernommen. Du kannst weiterhin alles ändern.',
    reason: {
      modeSolo: 'Eine Person: Solo-Herausforderung.',
      modeSmall: '{players} Spieler: Alle tippen in jeder Runde.',
      modeBig: '{players} Spieler: Teams halten die Runden flott.',
      newTable: 'Noch kein Verlauf: Starte leicht.',
      harder: '{percent} % richtig auf dieser Stufe: Zeit für mehr.',
      easier: '{percent} % richtig: Eine leichtere Stufe macht mehr Spaß.',
      keep: '{percent} % richtig: Diese Stufe passt.',
      fresh: '{category} ist die am wenigsten gespielte Kategorie.',
      freshSkippingWeak: '{category} ist die am wenigsten gespielte Kategorie, ohne schwach bewertete.',
      time: '{rounds} Runden passen in etwa {minutes} Min.',
      soloBeat: 'Dein Rekord hier: {points} Pkt. Versuch ihn zu schlagen.',
      soloHarder: 'Deine Rekorde sind perfekt: Probier eine schwerere Stufe.',
      soloFirst: 'Erste Herausforderung: 5 leichte Runden.'
    }
  },
  presenter: {
    title: 'Präsentationsmodus',
    description: 'Raumansicht für TV oder Beamer: Punkte, Timer, Aussagen und Auflösung in groß.',
    open: 'Präsentationsmodus',
    openWindow: 'Anzeigebildschirm',
    close: 'Beenden',
    windowOpened: 'Anzeigebildschirm in neuem Fenster geöffnet und mit dieser Sitzung verbunden.',
    turn: '{name} ist dran',
    finalTitle: 'Endstand',
    scoreboard: 'Punktestand'
  },
  packMeta: {
    license: {
      community: 'Community',
      'premium-unverified': 'Premium · Signatur nicht geprüft',
      'premium-unsigned': 'Premium · unsigniert'
    },
    audience: {
      family: 'Familie',
      kids: 'Kinder',
      teens: 'Jugendliche',
      adults: 'Erwachsene'
    },
    difficulty: {
      easy: 'Leicht',
      medium: 'Mittel',
      hard: 'Schwer',
      mixed: 'Gemischte Schwierigkeit'
    },
    version: 'v{version}',
    author: 'Von {author}',
    changelog: 'Versionsverlauf'
  },
  art: {
    avatars: {
      fox: 'Fuchs',
      panda: 'Panda',
      owl: 'Eule',
      octopus: 'Krake',
      lion: 'Löwe',
      turtle: 'Schildkröte',
      penguin: 'Pinguin',
      unicorn: 'Einhorn',
      bee: 'Biene',
      whale: 'Wal',
      cactus: 'Kaktus',
      rocket: 'Rakete',
      cat: 'Katze',
      dog: 'Hund',
      frog: 'Frosch',
      bear: 'Bär',
      rabbit: 'Hase',
      koala: 'Koala',
      monkey: 'Affe',
      pig: 'Schweinchen',
      chick: 'Küken',
      robot: 'Roboter',
      alien: 'Alien',
      ghost: 'Gespenstchen'
    },
    defaultAvatar: 'Spieler ohne Profil',
    medal: {
      bronze: 'Bronze',
      silver: 'Silber',
      gold: 'Gold',
      legendary: 'Legendär',
      label: 'Medaille {rarity}',
      locked: 'Gesperrt',
      unlockedRarity: '{rarity} freigeschaltet'
    },
    seasonal: {
      halloween: {
        title: 'Halloween-Stimmung',
        body: 'Fledermäuse, Kürbisse und die Herbstmusik für den Tisch.'
      },
      festive: {
        title: 'Feststimmung',
        body: 'Lichter, Schnee und Glanz zum Jahresende für den Tisch.'
      },
      apply: 'Theme verwenden',
      dismiss: 'Nicht jetzt',
      settingsHint: 'Saisonale Themes: jederzeit anwendbar; zur passenden Zeit schlägt die App sie auf der Startseite vor.'
    },
    tracks: {
      heading: 'Musik',
      mapping: 'Dieses Theme spielt den Titel {track}.',
      cosmic: 'Kosmisch',
      spring: 'Frühling',
      autumn: 'Herbst'
    }
  },
  juice: {
    menu: {
      label: 'Weitere Rundenaktionen'
    },
    scoreboard: 'Punktestand',
    stamp: 'FAKE',
    bonusFloat: '+{bonus} Bonus',
    countdown: 'Start in {seconds}',
    pass: {
      title: 'Gib weiter an {name}',
      hint: 'Nicht spicken: Der vorige Tipp bleibt verdeckt.',
      ready: 'Ich bin {name}, zeigen'
    },
    podium: {
      kicker: 'Podium',
      label: 'Podium der Partie',
      points: '{points} Pkt.',
      place: 'Platz {place}',
      restLine: '{place}. {name} · {points} Pkt.'
    },
    highlights: {
      label: 'Highlights der Partie',
      fastest: 'Am schnellsten',
      'longest-streak': 'Längste Serie',
      'best-bluff': 'Bester Bluff',
      fastestLine: '{name} lag im Schnitt nach {seconds} s richtig',
      streakLine: '{name} lag {streak}-mal in Folge richtig',
      bluffLine: '„{text}“ hat {count} getäuscht'
    },
    rematch: 'Revanche',
    solo: {
      you: 'Du',
      record: 'Rekord',
      previousRecord: 'Bisheriger Rekord'
    },
    settings: {
      passDevice: 'Gerät zwischen den Tipps weitergeben',
      passDeviceHint: 'Bei „Alle raten“ und Teams erscheint ein Übergabebildschirm, der den vorigen Tipp verdeckt.',
      vibration: 'In den letzten Sekunden vibrieren',
      vibrationUnsupported: 'Dieses Gerät oder dieser Browser kann nicht vibrieren.'
    }
  },
  aboutUs: {
    category: 'Über uns',
    subtitle: 'Alle schreiben nacheinander. Nichts verlässt dieses Gerät.',
    progress: 'Spieler {current} von {total}',
    startWriting: 'Meine Sätze schreiben',
    writeTitle: '{name}, schreib über dich',
    writeHint: 'Vier Wahrheiten und eine Lüge. Markiere die Lüge; die Sätze werden gemischt.',
    statementLabel: 'Satz {number}',
    lieLabel: 'Lüge',
    issue: {
      'empty-statement': 'Füll alle fünf Sätze aus.',
      'too-long': 'Jeder Satz darf höchstens 140 Zeichen haben.',
      'duplicate-statement': 'Die Sätze müssen verschieden sein.',
      'no-lie': 'Markiere, welcher Satz die Lüge ist.'
    },
    cancel: 'Zurück zur Einrichtung',
    confirm: 'Fertig, verbergen',
    doneTitle: 'Alle haben geschrieben!',
    doneHint: '{count} Runden bereit, eine pro Person. Wer eine Runde geschrieben hat, rät dort nicht mit.',
    missingEntries: 'Alle müssen ihre fünf Sätze schreiben, bevor es losgeht.',
    saveAsPack: 'Als lokales Pack speichern',
    packTitle: 'Über uns ({date})',
    packExplanation: 'Geschrieben von {name}.',
    saved: 'Pack gespeichert. Unter Packs aktivieren oder bearbeiten.',
    setupTitle: 'Inhalt vom Tisch',
    setupNote: 'Keine Packs, keine Filter: Alle schreiben eine Runde über sich ({count} Runden). Wer schreibt, punktet für jede getäuschte Person.',
    summaryLine: '{players} Spieler · eine Runde von jeder Person',
    startWritingAll: 'Runden schreiben'
  },
  bluff: {
    result: '{name} hat {count} getäuscht ({names}): +{points} Punkte.',
    resultNone: '{name} hat diesmal niemanden getäuscht.',
    masterBanner: 'Bluffmeister: {name}',
    masterBannerHint: '{name} verteidigt alle fünf Sätze; stimmt ab, wenn ihr sie gehört habt.',
    aboutUsBanner: 'Sätze von {name}',
    aboutUsBannerHint: '{name} rät nicht mit und punktet für jede getäuschte Person.',
    aboutUsIntro: 'Runde von {name}',
    aboutUsIntroHint: '{name}, lies deine fünf Sätze laut vor. Die anderen raten nacheinander.',
    briefingTitle: 'Nur {name} schaut',
    briefingHint: 'Alle anderen schauen weg. Der Bluffmeister sieht die Fälschung.',
    briefingReveal: 'Fälschung zeigen',
    briefingDefend: 'Verteidige alle fünf, als wären sie alle wahr.',
    briefingReady: 'Bereit, verbergen',
    finalDefense: {
      title: 'Schlussplädoyer',
      description: 'Der Bluffmeister hält ein letztes Plädoyer. Alle dürfen ihre Stimme vor der Auflösung einmal ändern.'
    }
  },
  kids: {
    toggle: 'Kids (6-9 Jahre)',
    toggleHint: 'Nur leichte Runden in einfacher Sprache, für Kinder geschrieben.',
    short: 'Kids'
  },
  editor: {
    title: 'Neues Pack',
    editTitle: 'Pack bearbeiten',
    subtitle: 'Schreib Runden mit 5 Sätzen und einer Fälschung. Der Entwurf bleibt auf diesem Gerät.',
    back: 'Zurück zu den Packs',
    packInfo: 'Pack',
    packTitle: 'Titel',
    emoji: 'Cover (Emoji)',
    language: 'Sprache',
    description: 'Beschreibung',
    newCategory: 'Neue Kategorie',
    addCategory: 'Kategorie hinzufügen',
    categoryInvalid: 'Gib einen Kategorienamen ein, den es noch nicht gibt.',
    roundTitle: 'Runde {number}',
    removeRound: 'Entfernen',
    statement: 'Satz {number}',
    fake: 'Falsch',
    explanation: 'Erklärung (bei der Auflösung)',
    addRound: 'Runde hinzufügen',
    summary: 'Übersicht',
    summaryLine: '{rounds} Runden · {issues} offen',
    validate: 'Prüfen',
    save: 'Auf dem Gerät speichern',
    export: 'JSON exportieren',
    discard: 'Entwurf verwerfen',
    invalid: '{count} Punkte zu korrigieren.',
    valid: 'Alles gut: Das Pack ist fertig.',
    saved: 'Pack gespeichert und aktiviert.',
    exported: 'JSON exportiert.',
    create: 'Pack erstellen',
    continueDraft: 'Entwurf fortsetzen',
    edit: 'Bearbeiten',
    issue: {
      title: 'Gib dem Pack einen Titel.',
      noRounds: 'Füge mindestens eine Runde hinzu.',
      category: 'Runde {round}: Wähle eine Kategorie.',
      statement: 'Runde {round}: Füll Satz {statement} aus.',
      statementLong: 'Runde {round}: Satz {statement} hat mehr als 200 Zeichen.',
      duplicate: 'Runde {round}: Satz {statement} wiederholt einen anderen Satz im Pack.',
      fake: 'Runde {round}: Markiere den falschen Satz.',
      explanation: 'Runde {round}: Schreib die Erklärung.'
    }
  },
  seasonalPacks: {
    title: 'Saison-Packs',
    subtitle: 'Kleine optionale Packs, die erst beim Aktivieren geladen werden.',
    inSeason: 'Passt zur Saison',
    loading: 'Lädt…',
    rounds: '{rounds} Runden'
  }
};
