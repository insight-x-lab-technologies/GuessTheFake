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
    teams: { title: 'Teams', description: 'Teams wechseln sich ab und punkten auf einer eigenen Tafel.' }
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
  }
};
