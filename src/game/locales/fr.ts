import type { TranslationTree } from '../../core/i18n/i18n';

export const fr: TranslationTree = {
  game: {
    scoreLoss: '-{loss} pts',
    title: 'Guess the Fake',
    description: 'Trouvez l\'affirmation fausse parmi cinq',
    round: 'Manche {current} sur {total}',
    activePlayer: 'Au tour de {name}',
    activeTeam: 'Au tour de {name}',
    readyPlayer: '{name}, prépare-toi',
    readyTeam: '{name}, préparez-vous',
    prepareHint: 'La prochaine manche commence par une préparation et un minuteur.',
    preparation: 'Préparation',
    secondsLabel: 'secondes',
    chooseFake: 'Choisissez l\'affirmation fausse',
    chooseFakeAll: '{name}, valide ta réponse sans la montrer aux autres',
    statementOptionLabel: 'Affirmation {number}',
    statementKeyboardHint: 'Utilisez Tab pour entrer dans les cartes, les flèches pour déplacer le focus et les touches 1 à 5 pour choisir une affirmation.',
    revealedPrompt: 'Découvrez la réponse et l\'affirmation choisie',
    timeLeft: '{seconds} s restantes',
    timeout: 'Temps écoulé',
    correct: 'Bravo',
    wrong: 'Pas cette fois',
    allGuesses: 'Réponses de la table',
    scoreBreakdown: '+{points} pts · bonus {bonus} · multiplicateur x{multiplier}',
    teamScore: '{name} : {score} pts',
    fakeLabel: 'Fausse',
    selectedLabel: 'Votre choix',
    pickedByLabel: '{names}',
    nextRound: 'Manche suivante',
    finish: 'Voir le résultat',
    playAgain: 'Nouvelle partie',
    startTurn: 'Commencer le tour',
    revealBoard: 'Afficher les affirmations',
    recalibrateScores: 'Réinitialiser les scores',
    recalibrateConfirmTitle: 'Remettre les scores à zéro ?',
    recalibrateConfirmDescription: 'Joueurs et équipes repartent à 0 point. La manche en cours et les réponses sont conservées.',
    recalibrateConfirm: 'Remettre à zéro',
    recalibrateCancel: 'Annuler',
    recalibrateDone: 'Scores remis à zéro.',
    feedbackLabel: 'Avis sur la manche',
    feedbackGood: 'Bonne',
    feedbackBad: 'Faible',
    feedbackSkip: 'Ne plus proposer'
  },
  modes: {
    solo: {
      title: 'Solo',
      description: 'Battez votre propre record : une personne, manches fixes.'
    },
    classic: { title: 'Classique', description: 'Un joueur à la fois essaie de trouver l\'affirmation fausse.' },
    allGuess: { title: 'Tout le monde répond', description: 'Chaque joueur valide sa réponse avant la révélation.' },
    teams: { title: 'Équipes', description: 'Les équipes jouent à tour de rôle et marquent sur un tableau séparé.' }
  },
  setup: {
    variationsTitle: 'Variantes',
    selected: 'Sélectionné',
    title: 'Préparer la partie',
    subtitle: 'Choisissez le mode, les joueurs, les filtres et le nombre de manches avant d\'ouvrir la table.',
    optionsTitle: 'Options de la partie',
    filtersTitle: 'Filtres et manches',
    summaryTitle: 'Résumé',
    contentStatusTitle: 'État du contenu',
    previewTitle: 'Catégories disponibles',
    playersHint: 'Séparez les noms par des virgules',
    summaryLine: '{players} joueurs · {rounds} manches choisies · {available} disponibles',
    contentLow: 'Il y a moins de manches disponibles que demandé ; la partie en utilisera le plus possible.',
    contentLoading: 'Chargement des manches de cette langue...',
    contentEmpty: 'Aucune manche n\'est encore disponible dans cette langue avec les filtres actuels. Changez de langue dans Paramètres, ajustez les filtres ou importez un pack dans Packs.',
    mode: 'Mode',
    players: 'Joueurs',
    rounds: 'Manches',
    category: 'Catégorie',
    difficulty: 'Difficulté',
    allCategories: 'Toutes les catégories',
    allDifficulties: 'Toutes les difficultés',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    availableRounds: '{available} manches disponibles ; {selected} seront utilisées.',
    invalidRounds: 'Indiquez au moins 1 manche.',
    notEnoughPlayers: 'Ce mode demande au moins {count} joueurs.',
    noRounds: 'Aucune manche disponible avec les filtres actuels.',
    start: 'Commencer'
  },
  app: {
    profiles: 'Famille'
  },
  multiDevice: {
    phase: {
      discussing: 'moment de table'
    }
  },
  solo: {
    playSolo: 'Jouer seul',
    playerTitle: 'Joueur',
    nameLabel: 'Votre nom',
    namePlaceholder: 'Saisissez votre nom',
    summaryLine: 'Vous · {rounds} manches · {available} disponibles',
    recordLine: 'Votre record pour ce défi : {points} pts ({correct}/{total})',
    firstTime: 'Première fois pour ce défi',
    statsLabel: 'Votre partie',
    points: '{points} pts',
    correctOf: '{correct}/{total} bonnes réponses',
    streak: 'Série {streak}',
    yourGuess: 'Votre réponse',
    finalKicker: 'Défi solo',
    finalPoints: '{points} pts',
    newRecord: 'Nouveau record !',
    recordCompare: 'Record : {points} pts · il manquait {difference} pts',
    bestStreak: 'Meilleure série : {streak}',
    playAgain: 'Rejouer',
    newChallenge: 'Nouveau défi',
    shareText: 'J\'ai fait {points} pts et trouvé {correct}/{total} à Guess the Fake ({challenge}).',
    recordsTitle: 'Records solo',
    recordsClear: 'Effacer les records',
    recordsEmpty: 'Aucun record solo pour le moment. Jouez seul pour établir le premier.',
    recordRow: '{correct}/{total} bonnes réponses · {date}',
    challengeRounds: '{rounds} manches',
    challengePacks: '{count} packs en plus'
  },
  moments: {
    toggle: 'Moments de table',
    toggleHint: 'Avant la révélation : défendez votre choix, votez ou changez d’avis. Les manches durent plus longtemps.',
    label: 'Moment de table',
    prompt: 'Discutez avant la révélation',
    reveal: 'Révéler la réponse',
    defend: {
      title: 'Défendez votre choix',
      description: 'Chaque personne qui a répondu explique son choix à voix haute avant la réponse.'
    },
    vote: {
      title: 'Votez pour le meilleur bluff',
      description: 'La table vote pour qui a le mieux argumenté, juste ou non. Le vote vaut +{bonus} pts.',
      result: '{name} remporte le vote de la table (+{bonus} pts).'
    },
    'change-mind': {
      title: 'Possibilité de changer d’avis',
      description: 'Chaque réponse peut être changée une fois. Changer fait perdre le bonus de vitesse.',
      action: 'Changer la réponse de {name}',
      used: '{name} a déjà changé',
      pick: 'Choisissez la nouvelle affirmation sur le plateau.',
      changed: ' · a changé d’avis'
    }
  },
  specials: {
    toggle: 'Manches spéciales',
    toggleHint: 'Une manche sur trois réserve une surprise, et la dernière est en mort subite.',
    toggleHintSolo: 'Une manche sur trois réserve une surprise. Les records avec manches spéciales comptent comme un autre défi.',
    short: 'manches spéciales',
    'double-or-nothing': {
      title: 'Quitte ou double',
      description: 'Une bonne réponse vaut double ; une erreur fait perdre des points.',
      result: 'Quitte ou double : bonnes réponses doublées, erreurs pénalisées.'
    },
    'sudden-death': {
      title: 'Mort subite',
      description: 'Une erreur divise votre score par deux.',
      result: 'Mort subite : l’erreur a divisé le score par deux.'
    },
    'gradual-clue': {
      title: 'Indice progressif',
      description: 'Les affirmations apparaissent une à une. Répondre tôt rapporte un bonus.',
      result: 'Indice progressif : +2 pts par affirmation encore cachée.',
      revealNext: 'En montrer une de plus ({visible}/{total})',
      hiddenLabel: 'Affirmation {number}, encore cachée'
    },
    lightning: {
      title: 'Manche éclair',
      description: 'Un tiers du temps et bonus de vitesse doublé.',
      result: 'Manche éclair : bonus de vitesse doublé.'
    },
    'category-challenge': {
      title: 'Défi de catégorie',
      description: 'Une bonne réponse vaut 1,5x.',
      categoryLine: 'Catégorie : {category}. Une bonne réponse vaut 1,5x.',
      result: 'Défi de catégorie : bonnes réponses à 1,5x.'
    }
  },
  profiles: {
    title: 'Famille',
    subtitle: 'Profils locaux avec avatar, couleur, surnom, statistiques et trophées personnels. Sans compte ; inclus dans l’export des données.',
    createTitle: 'Nouveau profil',
    editTitle: 'Modifier le profil',
    name: 'Nom',
    nickname: 'Surnom',
    avatar: 'Avatar',
    avatarOption: 'Avatar {avatar}',
    color: 'Couleur',
    colors: {
      coral: 'Corail',
      amber: 'Ambre',
      lime: 'Citron vert',
      teal: 'Bleu-vert',
      sky: 'Ciel',
      violet: 'Violet',
      rose: 'Rose',
      slate: 'Ardoise'
    },
    create: 'Créer le profil',
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    remove: 'Supprimer',
    created: 'Profil créé.',
    saved: 'Profil enregistré.',
    removed: 'Profil supprimé.',
    empty: 'Aucun profil pour le moment. Créez-en un par personne qui joue souvent.',
    pickLabel: 'Profils de la famille',
    trophies: 'Trophées personnels : {unlocked}/{total}',
    error: {
      'name-required': 'Saisissez un nom.',
      'name-taken': 'Un profil porte déjà ce nom.',
      limit: 'Limite de profils atteinte.',
      'not-found': 'Profil introuvable.'
    },
    stats: {
      matches: 'Parties',
      wins: 'Victoires',
      points: 'Points',
      correct: 'Bonnes réponses',
      correctValue: '{correct} en {rounds} manches',
      solo: 'Record solo',
      soloValue: '{points} pts · {challenge} ({count} défis)',
      soloEmpty: 'Aucun pour le moment'
    }
  },
  tracks: {
    title: 'Parcours de progression',
    subtitle: 'Chaque parcours a trois niveaux. Le solo et la table comptent ensemble, sauf « Table ».',
    nextObjective: 'Prochain objectif',
    level: 'Niveau {level}/{total}',
    complete: 'terminé',
    tableOnly: 'Parties de table uniquement',
    group: {
      category: 'Catégorie',
      difficulty: 'Difficulté',
      style: 'Style de jeu',
      curation: 'Curation'
    },
    category: 'Expert en {category}',
    difficulty: 'Niveau {difficulty}',
    streak: 'Séries',
    perfect: 'Parties parfaites',
    table: 'Table',
    solo: 'Solo',
    feedback: 'Curateur de contenu',
    packs: 'Explorateur de packs',
    objective: {
      category: 'Trouvez encore {remaining} bonnes réponses en {category} pour atteindre {target}.',
      difficulty: 'Trouvez encore {remaining} bonnes réponses en niveau {difficulty} pour atteindre {target}.',
      streak: 'Enchaînez {target} bonnes réponses d’affilée.',
      perfect: 'Terminez encore {remaining} parties parfaites.',
      table: 'Jouez encore {remaining} parties de table.',
      solo: 'Terminez encore {remaining} défis solo.',
      feedback: 'Évaluez encore {remaining} manches après la révélation.',
      packs: 'Jouez avec {remaining} packs différents de plus (importez-en un dans Packs).'
    }
  },
  suggest: {
    title: 'Suggestion',
    minutes: 'Temps disponible',
    minutesOption: '{minutes} min',
    summary: '{mode} · {rounds} manches · {difficulty} · {category}',
    apply: 'Appliquer la suggestion',
    applied: 'Suggestion appliquée. Vous pouvez encore tout modifier.',
    reason: {
      modeSolo: 'Une personne : défi solo.',
      modeSmall: '{players} joueurs : tout le monde répond à chaque manche.',
      modeBig: '{players} joueurs : les équipes gardent un bon rythme.',
      newTable: 'Pas encore d’historique : commencez en facile.',
      harder: '{percent} % de bonnes réponses à ce niveau : passez au-dessus.',
      easier: '{percent} % de bonnes réponses : un niveau plus facile sera plus amusant.',
      keep: '{percent} % de bonnes réponses : ce niveau convient.',
      fresh: '{category} est la catégorie la moins jouée.',
      freshSkippingWeak: '{category} est la catégorie la moins jouée, hors catégories jugées faibles.',
      time: '{rounds} manches tiennent en environ {minutes} min.',
      soloBeat: 'Votre record ici est de {points} pts : essayez de le battre.',
      soloHarder: 'Vos records sont parfaits : essayez un niveau plus difficile.',
      soloFirst: 'Premier défi : 5 manches faciles.'
    }
  },
  presenter: {
    title: 'Mode présentateur',
    description: 'Vue de salle pour TV ou projecteur : scores, minuteur, affirmations et révélation en grand.',
    open: 'Mode présentateur',
    openWindow: 'Écran d’affichage',
    close: 'Quitter',
    windowOpened: 'Écran d’affichage ouvert dans une nouvelle fenêtre, lié à cette session.',
    turn: 'Au tour de {name}',
    finalTitle: 'Scores finaux',
    scoreboard: 'Tableau des scores'
  },
  packMeta: {
    license: {
      community: 'Communauté',
      'premium-unverified': 'Premium · signature non vérifiée',
      'premium-unsigned': 'Premium · non signé'
    },
    audience: {
      family: 'Famille',
      kids: 'Enfants',
      teens: 'Ados',
      adults: 'Adultes'
    },
    difficulty: {
      easy: 'Facile',
      medium: 'Moyenne',
      hard: 'Difficile',
      mixed: 'Difficulté mixte'
    },
    version: 'v{version}',
    author: 'Par {author}',
    changelog: 'Historique des versions'
  }
};
