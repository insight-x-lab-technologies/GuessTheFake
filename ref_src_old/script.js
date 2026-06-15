    const DEFAULT_LANGUAGE = 'pt';
    const SETTINGS_KEY = 'npr_settings_v1';
    const CONTENT_KEY = 'npr_content_v1';
    const LEADERBOARD_KEY = 'npr_leaderboard_v1';
    const JOKE_STATS_KEY = 'npr_joke_stats_v1';
    const NPR_ACHIEVEMENTS_KEY = 'npr_achievements_v1';
    const LEGACY_WORDS_KEY = 'npr_words_v1';
    const QUICK_GAME_KEY = 'npr_quick_game_v1';
    const USER_ID_KEY = 'npr_user_id_v1';
    const USER_ID_BACKUP_SCHEMA = 'naopoderir.user-id.v1';
    const MULTI_DEVICE_GUEST_RESUME_KEY = 'npr_multidevice_guest_resume_v1';
    const MULTI_DEVICE_GUEST_RESUME_TTL_MS = 1000 * 60 * 60 * 12;
    const MULTI_DEVICE_RECONNECT_MAX_DELAY_MS = 8000;
    const WAKE_LOCK_ACTIVE_SCREENS = ['multidevice', 'guest', 'setup', 'game', 'score', 'final'];
    const LAST_TEAMS_KEY = 'npr_last_teams';
    const LAST_FFA_KEY = 'npr_last_ffa';
    const APP_STORAGE_PREFIX = 'npr_';
    const AVAILABLE_THEMES = ['cosmic', 'liquid-glass', 'material3', 'light-mode', 'dark-mode', 'high-contrast'];
    const THEMES_WITH_MUSIC = ['cosmic', 'liquid-glass', 'material3'];
    const THEME_MUSIC_PREFIX = {
      cosmic: 'cosmic',
      'liquid-glass': 'autumn',
      material3: 'spring',
      'light-mode': 'light',
      'dark-mode': 'dark',
      'high-contrast': 'contrast'
    };
    const GAMEPLAY_MUSIC_SCREENS = ['game', 'score', 'final', 'guest'];
    const MUSIC_ASSET_BASE = './assets/songs';
    const SUPPORTED_LANGUAGES = ['pt', 'en', 'es', 'fr', 'de', 'it'];
    const LANGUAGE_HTML_MAP = { pt: 'pt-BR', en: 'en', es: 'es', fr: 'fr', de: 'de', it: 'it' };
    const LEADERBOARD_MODE_KEYS = ['mimeTeams', 'mimeFfa', 'drawingTeams', 'drawingFfa'];
    const LEADERBOARD_PAGE_SIZE = 10;
    const LEADERBOARD_DEFAULT_AVATAR = './assets/player-default.svg';
    const DIFFICULTY_KEYS = ['easy', 'normal', 'hard'];
    const LEGACY_WORD_CATEGORY_KEYS = ['objects', 'actions', 'animals', 'movies', 'professions', 'celebrities'];
    const CATEGORY_KEYS = ['trocadilhos', 'tiozao', 'cotidiano', 'familia', 'escola_trabalho', 'absurdo'];
    const CATEGORY_ICONS = {
      trocadilhos: '🤹',
      tiozao: '🧢',
      cotidiano: '🏠',
      familia: '💬',
      escola_trabalho: '📚',
      absurdo: '🤪'
    };
    const DEFAULT_CORRECT_POINTS = 10;
    const DEFAULT_WRONG_PENALTY_POINTS = 0;
    const JOKE_WEIGHT_HIGH = 6;
    const JOKE_WEIGHT_NORMAL = 3;
    const JOKE_WEIGHT_LOW = 1;
    const ACHIEVEMENT_NOTIFICATION_INTERVAL_MS = 2600;
    const CORE_PACK_ID = 'core-default';
    const WORD_PACK_SCHEMA = 'naopoderir.jokepack.v1';
    const PACK_SIGNATURE_ALGORITHM = 'ECDSA_P256_SHA256';
    const PACK_SIGNATURE_CONTEXT = 'naopoderir-joke-pack:v1';
    // The app validates purchased packs with a public key only. Keep the
    // matching private key outside this repository and use it only internally.
    const PACK_SIGNING_PUBLIC_KEY = {
      kty: 'EC',
      crv: 'P-256',
      x: 'FJe_7l8WYaFoxOoUr6pQcUkCJtq0yF10kDEqIyLHbqg',
      y: 'u9aaOBq0dS-14a_64f5LDo_NNIL9CwNYzSH9xlKkTX0',
      ext: true
    };
    const KO_FI_WIDGET_SCRIPT_URL = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
    const KO_FI_SLUG = 'insightxlabgamestudio';
    const APP_PUBLIC_URL = 'https://insight-x-lab-technologies.github.io/NaoPodeRir/';
    const SOCIAL_WEB_FALLBACKS = {
      instagram: 'https://www.instagram.com/',
      tiktok: 'https://www.tiktok.com/'
    };
    const DONATION_LINKS = {
      buyMeCoffee: 'https://buymeacoffee.com/insight.x.lab.game.studio',
      koFi: `https://ko-fi.com/${KO_FI_SLUG}`
    };
    let currentLanguage = DEFAULT_LANGUAGE;

    function clone(value) {
      return JSON.parse(JSON.stringify(value));
    }

    function generateUserId() {
      if (crypto?.randomUUID) return `npru_${crypto.randomUUID()}`;
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      return `npru_${Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')}`;
    }

    function getOrCreateUserId() {
      const saved = localStorage.getItem(USER_ID_KEY);
      if (saved) return saved;
      const nextUserId = generateUserId();
      localStorage.setItem(USER_ID_KEY, nextUserId);
      return nextUserId;
    }

    let appUserId = getOrCreateUserId();

    function getNestedValue(obj, path) {
      return path.split('.').reduce((acc, key) => acc && acc[key], obj);
    }

    const TRANSLATIONS = window.NPR_TRANSLATIONS || {};

    function t(key, params = {}, language = currentLanguage) {
      const value =
        getNestedValue(TRANSLATIONS[language], key)
        ?? getNestedValue(TRANSLATIONS[DEFAULT_LANGUAGE], key)
        ?? key;
      if (typeof value === 'function') return value(params);
      return String(value).replace(/\{(\w+)\}/g, (_, token) => params[token] ?? `{${token}}`);
    }

    function createEmptyJokeBank() {
      return CATEGORY_KEYS.reduce((acc, cat) => {
        acc[cat] = [];
        return acc;
      }, {});
    }

    function createEmptyWordBank() {
      return DIFFICULTY_KEYS.reduce((acc, diff) => {
        acc[diff] = CATEGORY_KEYS.reduce((catAcc, cat) => {
          catAcc[cat] = [];
          return catAcc;
        }, {});
        return acc;
      }, {});
    }

    function buildJokeIdFromText(text = '') {
      return String(text)
        .toLocaleLowerCase('pt-BR')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 72) || `joke-${Date.now()}`;
    }

    function getJokeText(entry) {
      if (typeof entry === 'string') return entry.trim();
      if (!entry || typeof entry !== 'object') return '';
      return String(entry.text || entry.joke || entry.value || '').trim();
    }

    function normalizeJokeEntry(entry, fallbackId = '') {
      const text = getJokeText(entry);
      if (!text) return null;
      return {
        id: String(entry?.id || fallbackId || buildJokeIdFromText(text)).trim() || buildJokeIdFromText(text),
        text,
        tone: String(entry?.tone || '').trim(),
        source: String(entry?.source || '').trim()
      };
    }

    function normalizeJokeList(list) {
      const seen = new Set();
      const normalized = [];
      (Array.isArray(list) ? list : []).forEach((entry, index) => {
        const joke = normalizeJokeEntry(entry, `joke-${index + 1}`);
        if (!joke) return;
        const dedupeKey = joke.text.toLocaleLowerCase('pt-BR');
        if (seen.has(dedupeKey)) return;
        seen.add(dedupeKey);
        normalized.push(joke);
      });
      return normalized;
    }

    function normalizeJokeBank(bank) {
      const normalized = createEmptyJokeBank();
      CATEGORY_KEYS.forEach(category => {
        normalized[category] = normalizeJokeList(bank?.[category] || []);
      });
      return normalized;
    }

    function createEmptyJokeStatsEntry(joke = {}) {
      return {
        id: String(joke?.id || '').trim(),
        text: String(joke?.word || joke?.text || '').trim(),
        category: String(joke?.cat || joke?.category || '').trim(),
        packId: String(joke?.packId || '').trim(),
        locale: String(joke?.locale || currentLanguage || DEFAULT_LANGUAGE).trim() || DEFAULT_LANGUAGE,
        timesPlayed: 0,
        laughs: 0,
        ratingSum: 0,
        ratingCount: 0,
        neverAgain: false,
        lastPlayedAt: '',
        lastRatedAt: ''
      };
    }

    function normalizeJokeStatsEntry(entry = {}, joke = {}) {
      const base = createEmptyJokeStatsEntry(joke);
      const timesPlayed = Number.parseInt(entry?.timesPlayed, 10) || 0;
      const laughs = Number.parseInt(entry?.laughs, 10) || 0;
      const ratingSum = Number(entry?.ratingSum) || 0;
      const ratingCount = Number.parseInt(entry?.ratingCount, 10) || 0;
      return {
        ...base,
        id: String(entry?.id || base.id).trim(),
        text: String(entry?.text || base.text).trim(),
        category: String(entry?.category || base.category).trim(),
        packId: String(entry?.packId || base.packId).trim(),
        locale: String(entry?.locale || base.locale).trim() || DEFAULT_LANGUAGE,
        timesPlayed: Math.max(0, timesPlayed),
        laughs: Math.max(0, Math.min(timesPlayed, laughs)),
        ratingSum: Math.max(0, ratingSum),
        ratingCount: Math.max(0, ratingCount),
        neverAgain: entry?.neverAgain === true,
        lastPlayedAt: String(entry?.lastPlayedAt || '').trim(),
        lastRatedAt: String(entry?.lastRatedAt || '').trim()
      };
    }

    function getJokeKey(joke) {
      const locale = String(joke?.locale || currentLanguage || DEFAULT_LANGUAGE).trim() || DEFAULT_LANGUAGE;
      const packId = String(joke?.packId || CORE_PACK_ID).trim() || CORE_PACK_ID;
      const category = String(joke?.cat || joke?.category || '').trim() || 'misc';
      const id = String(joke?.id || buildJokeIdFromText(getJokeText(joke) || joke?.word || '')).trim();
      return id ? [locale, packId, category, id].join('::') : '';
    }

    function loadJokeStats() {
      try {
        const saved = JSON.parse(localStorage.getItem(JOKE_STATS_KEY) || '{}');
        const source = saved?.jokes && typeof saved.jokes === 'object' && !Array.isArray(saved.jokes)
          ? saved.jokes
          : (saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {});
        return Object.entries(source).reduce((acc, [key, entry]) => {
          if (!key) return acc;
          acc[key] = normalizeJokeStatsEntry(entry);
          return acc;
        }, {});
      } catch (error) {
        return {};
      }
    }

    function saveJokeStats(stats) {
      try {
        localStorage.setItem(JOKE_STATS_KEY, JSON.stringify(stats && typeof stats === 'object' ? stats : {}));
      } catch (error) { }
    }

    function buildJokeRatingSummary(entry = {}) {
      const normalized = normalizeJokeStatsEntry(entry);
      const averageRating = normalized.ratingCount > 0 ? normalized.ratingSum / normalized.ratingCount : 0;
      const laughRate = normalized.timesPlayed > 0 ? normalized.laughs / normalized.timesPlayed : 0;
      return {
        averageRating,
        ratingCount: normalized.ratingCount,
        laughs: normalized.laughs,
        timesPlayed: normalized.timesPlayed,
        laughRate,
        neverAgain: normalized.neverAgain
      };
    }

    function recordJokeOutcome(outcome = {}) {
      const joke = outcome?.joke;
      const jokeKey = getJokeKey(joke);
      if (!jokeKey) return;

      const stats = loadJokeStats();
      const entry = normalizeJokeStatsEntry(stats[jokeKey], joke);
      entry.timesPlayed += 1;
      if (outcome?.laughed) entry.laughs += 1;
      entry.lastPlayedAt = new Date().toISOString();
      stats[jokeKey] = entry;
      saveJokeStats(stats);
    }

    function applyJokeFeedback(rating, neverAgain) {
      const joke = gameState.currentWord;
      const jokeKey = getJokeKey(joke);
      if (!joke || !jokeKey) return;

      const stats = loadJokeStats();
      const entry = normalizeJokeStatsEntry(stats[jokeKey], joke);
      const feedbackState = gameState.resultFeedback?.jokeKey === jokeKey
        ? { ...gameState.resultFeedback }
        : { jokeKey, rating: null, neverAgain: entry.neverAgain, countedTowardAchievements: false };

      const parsedRating = Number.parseInt(rating, 10);
      if (parsedRating >= 1 && parsedRating <= 5) {
        if (feedbackState.rating >= 1 && feedbackState.rating <= 5) {
          entry.ratingSum = Math.max(0, entry.ratingSum - feedbackState.rating);
          entry.ratingCount = Math.max(0, entry.ratingCount - 1);
        }
        entry.ratingSum += parsedRating;
        entry.ratingCount += 1;
        entry.lastRatedAt = new Date().toISOString();
        feedbackState.rating = parsedRating;
        if (!feedbackState.countedTowardAchievements && isAchievementTrackingEnabled()) {
          achievementState = loadAchievementState();
          achievementState.counters.totalJokesRated += 1;
          saveAchievementState(achievementState);
          checkAndUnlockAchievements();
          feedbackState.countedTowardAchievements = true;
        }
      }

      if (typeof neverAgain === 'boolean') {
        entry.neverAgain = neverAgain;
        feedbackState.neverAgain = neverAgain;
      }

      stats[jokeKey] = entry;
      saveJokeStats(stats);
      gameState.resultFeedback = feedbackState;
    }

    function getJokeRatingSummary(jokeKey) {
      const stats = loadJokeStats();
      return buildJokeRatingSummary(stats[jokeKey]);
    }

    function selectWeightedJoke(candidates = []) {
      if (!Array.isArray(candidates) || !candidates.length) return null;

      const stats = loadJokeStats();
      const enriched = candidates.map(joke => {
        const jokeKey = getJokeKey(joke);
        const summary = buildJokeRatingSummary(stats[jokeKey]);
        let weight = JOKE_WEIGHT_NORMAL;
        if (summary.ratingCount > 0 && summary.averageRating >= 4) {
          weight = JOKE_WEIGHT_HIGH;
        } else if (summary.ratingCount > 0 && summary.averageRating < 3) {
          weight = JOKE_WEIGHT_LOW;
        }
        return { joke, summary, weight };
      });

      const activePool = enriched.some(item => !item.summary.neverAgain)
        ? enriched.filter(item => !item.summary.neverAgain)
        : enriched;
      const totalWeight = activePool.reduce((sum, item) => sum + Math.max(0, item.weight), 0);
      if (totalWeight <= 0) {
        return activePool[Math.floor(Math.random() * activePool.length)]?.joke || candidates[0];
      }

      let threshold = Math.random() * totalWeight;
      for (const item of activePool) {
        threshold -= Math.max(0, item.weight);
        if (threshold <= 0) return item.joke;
      }
      return activePool[activePool.length - 1]?.joke || candidates[0];
    }

    function createLegacyWordBankFromJokeBank(bank = {}) {
      const normalizedJokes = normalizeJokeBank(bank);
      const legacyBank = createEmptyWordBank();
      DIFFICULTY_KEYS.forEach(diff => {
        CATEGORY_KEYS.forEach(category => {
          legacyBank[diff][category] = normalizedJokes[category].map(joke => joke.text);
        });
      });
      return legacyBank;
    }

    function getMigratedJokeCategoryFromLegacy(category = '') {
      const mapping = {
        objects: 'cotidiano',
        actions: 'cotidiano',
        animals: 'absurdo',
        movies: 'familia',
        professions: 'escola_trabalho',
        celebrities: 'tiozao'
      };
      return mapping[category] || 'cotidiano';
    }

    function convertLegacyWordBankToJokeBank(bank = {}) {
      const normalized = createEmptyJokeBank();
      LEGACY_WORD_CATEGORY_KEYS.forEach(category => {
        const targetCategory = getMigratedJokeCategoryFromLegacy(category);
        DIFFICULTY_KEYS.forEach(diff => {
          const words = Array.isArray(bank?.[diff]?.[category]) ? bank[diff][category] : [];
          words.forEach((word, index) => {
            const joke = normalizeJokeEntry(word, `${targetCategory}-${diff}-${index + 1}`);
            if (joke) normalized[targetCategory].push(joke);
          });
        });
      });
      return normalizeJokeBank(normalized);
    }

    function normalizeChallenges(list) {
      return Array.isArray(list)
        ? list.map(item => String(item).trim()).filter(Boolean)
        : [];
    }

    // ============================================================
    // DEFAULT JOKE BANK — core content pack
    const DEFAULT_JOKES = globalThis.NPR_JOKES_CONFIG;
    if (!DEFAULT_JOKES || typeof DEFAULT_JOKES !== 'object') {
      throw new Error('NPR_JOKES_CONFIG is missing. Load jokes-config.js before script.js.');
    }

    const READING_CHALLENGES_PT = [
  'Leia como se fosse um locutor de rádio dramático.', 'Leia segurando o riso a cada pausa.',
  'Leia como se estivesse contando um segredo importante.', 'Leia com voz de desenho animado.',
  'Leia como se estivesse muito cansado.', 'Leia em ritmo de notícia urgente.',
  'Leia como se estivesse em uma peça de teatro exagerada.', 'Leia com total seriedade.',
  'Leia como se estivesse apresentando um prêmio.', 'Leia como se fosse um professor bravo.',
  'Leia como um narrador de futebol empolgado.', 'Leia como um stand-up comedian ruim.',
  'Leia com sotaque caipira bem marcado.', 'Leia sussurrando como se houvesse um espião na sala.',
  'Leia gritando como se estivesse do outro lado da rua.', 'Leia como um robô sem emoção.',
  'Leia chorando de emoção.', 'Leia como um vilão de novela mexicana.',
  'Leia pulando em um pé só.', 'Leia como se estivesse explicando para uma criança de 5 anos.',
  'Leia com a língua presa.', 'Leia como se tivesse acabado de acordar.',
  'Leia imitando um animal de sua escolha.', 'Leia como um vendedor de carros usados.',
  'Leia com um ritmo extremamente lento.', 'Leia na velocidade de um rapper.',
  'Leia como se estivesse sob um interrogatório.', 'Leia fingindo que está com soluço.',
  'Leia com sotaque de Portugal bem carregado.', 'Leia como um pirata.',
  'Leia fazendo gestos exagerados com as mãos.', 'Leia como se estivesse cantando uma ópera.',
  'Leia de olhos fechados.', 'Leia como um apresentador de telejornal clássico.',
  'Leia como se estivesse em uma caverna ecoando.', 'Leia com a boca cheia (simulando).',
  'Leia como se fosse o Papai Noel.', 'Leia como um mestre de cerimônias.',
  'Leia sussurrando as palavras e gritando as pontuações.', 'Leia como um fantasma.',
  'Leia fazendo uma voz aguda e fina.', 'Leia fazendo uma voz muito grossa.',
  'Leia como se estivesse numa ligação ruim com interferência.', 'Leia como um alienígena tentando falar português.',
  'Leia como se estivesse com muito medo.', 'Leia como um filósofo pensativo.',
  'Leia como se estivesse dando uma bronca.', 'Leia como se fosse um mágico revelando um truque.',
  'Leia usando apenas uma vogal (ex: troque tudo por "a").', 'Leia como se estivesse num comercial de luxo.',
  'Leia pausando a cada palavra como se estivesse pensando.', 'Leia como uma criança mimada.',
  'Leia com o tom de voz de quem acabou de ganhar na loteria.', 'Leia como se fosse um cientista louco.',
  'Leia como se estivesse lendo um testamento.', 'Leia como um lutador de boxe antes da luta.',
  'Leia como se fosse uma fofoca de elevador.', 'Leia com um tom de deboche total.',
  'Leia como se estivesse na lua (falando devagar).', 'Leia como um mímico (sem som, só mexendo a boca).',
  'Leia como se fosse um avô/avó contando história.', 'Leia como um militar dando ordens.',
  'Leia como se estivesse num tribunal.', 'Leia como um turista perdido.',
  'Leia como se estivesse contando uma lenda urbana.', 'Leia como um guru espiritual.',
  'Leia trocando as sílabas das palavras.', 'Leia com muita raiva.',
  'Leia como se estivesse num momento de romance.', 'Leia como um zumbi.',
  'Leia como um cowboy de filme velho.', 'Leia como se fosse uma inteligência artificial.',
  'Leia com uma risada maníaca no final.', 'Leia como se estivesse no palco do Oscar.',
  'Leia como se estivesse sob efeito de hélio.'
];

const READING_CHALLENGES_EN = [
  'Read like a dramatic radio host.', 'Read while trying to hold back laughter.',
  'Read like you are sharing a state secret.', 'Read with a cartoonish voice.',
  'Read like you are extremely tired.', 'Read like a breaking news anchor.',
  'Read like an over-the-top theater actor.', 'Read with deadly seriousness.',
  'Read like you are presenting an award.', 'Read like a strict school teacher.',
  'Read like a high-energy sports commentator.', 'Read like a failing stand-up comedian.',
  'Read with a thick Southern drawl.', 'Read whispering as if a spy is listening.',
  'Read shouting as if across the street.', 'Read like an emotionless robot.',
  'Read like you are weeping with joy.', 'Read like a soap opera villain.',
  'Read while hopping on one foot.', 'Read like explaining to a 5-year-old.',
  'Read with a lisp.', 'Read as if you just woke up.',
  'Read imitating your favorite animal.', 'Read like a shady used car salesman.',
  'Read at an extremely slow pace.', 'Read at the speed of a rapper.',
  'Read like you are being interrogated.', 'Read pretending to have the hiccups.',
  'Read with a thick British royal accent.', 'Read like a pirate.',
  'Read using exaggerated hand gestures.', 'Read like an opera singer.',
  'Read with your eyes closed.', 'Read like a classic news anchor.',
  'Read like you are inside a canyon.', 'Read as if your mouth is full.',
  'Read like Santa Claus.', 'Read like a master of ceremonies.',
  'Read whispering words and shouting punctuation.', 'Read like a ghost.',
  'Read with a high-pitched voice.', 'Read with an extremely deep voice.',
  'Read like a bad phone connection.', 'Read like an alien learning English.',
  'Read like you are terrified.', 'Read like a deep philosopher.',
  'Read like you are giving someone a lecture.', 'Read like a magician revealing a trick.',
  'Read using only one vowel (e.g., replace everything with "ah").', 'Read like a luxury car commercial.',
  'Read pausing after every word.', 'Read like a spoiled child.',
  'Read like you just won the lottery.', 'Read like a mad scientist.',
  'Read like reading a last will.', 'Read like a boxer before a fight.',
  'Read like elevator gossip.', 'Read with total sarcasm.',
  'Read like you are on the moon.', 'Read like a mime (only mouth movements).',
  'Read like a grandparent telling a story.', 'Read like a drill sergeant.',
  'Read like you are in a courtroom.', 'Read like a lost tourist.',
  'Read like an urban legend teller.', 'Read like a spiritual guru.',
  'Read switching word syllables.', 'Read with intense anger.',
  'Read like a romantic confession.', 'Read like a zombie.',
  'Read like an old Western cowboy.', 'Read like an AI.',
  'Read with a maniacal laugh at the end.', 'Read like you are on the Oscar stage.',
  'Read as if you inhaled helium.'
];

const READING_CHALLENGES_ES = [
  'Léelo como un locutor de radio dramático.', 'Léelo aguantando la risa en cada pausa.',
  'Léelo como si contaras un secreto importante.', 'Léelo con voz de dibujo animado.',
  'Léelo como si estuvieras muy cansado.', 'Léelo al ritmo de una noticia urgente.',
  'Léelo como si estuvieras en una obra de teatro exagerada.', 'Léelo con total seriedad.',
  'Léelo como si presentaras un premio.', 'Léelo como un profesor enojado.',
  'Léelo como un narrador deportivo emocionado.', 'Léelo como un cómico de stand-up malo.',
  'Léelo con acento andaluz muy marcado.', 'Léelo susurrando como si hubiera un espía.',
  'Léelo gritando como si estuvieras lejos.', 'Léelo como un robot sin emociones.',
  'Léelo llorando de emoción.', 'Léelo como un villano de telenovela.',
  'Léelo saltando en un pie.', 'Léelo como si explicaras a un niño de 5 años.',
  'Léelo con ceceo marcado.', 'Léelo como si acabaras de despertar.',
  'Léelo imitando a un animal.', 'Léelo como un vendedor de coches usados.',
  'Léelo a un ritmo extremadamente lento.', 'Léelo a la velocidad de un rapero.',
  'Léelo como si estuvieras en un interrogatorio.', 'Léelo fingiendo tener hipo.',
  'Léelo con acento argentino muy marcado.', 'Léelo como un pirata.',
  'Léelo haciendo gestos exagerados.', 'Léelo como si cantaras ópera.',
  'Léelo con los ojos cerrados.', 'Léelo como un presentador de noticias clásico.',
  'Léelo como si estuvieras en una cueva con eco.', 'Léelo con la boca llena.',
  'Léelo como si fueras Papá Noel.', 'Léelo como un maestro de ceremonias.',
  'Léelo susurrando palabras y gritando la puntuación.', 'Léelo como un fantasma.',
  'Léelo con voz aguda y fina.', 'Léelo con voz muy grave.',
  'Léelo como si hubiera mala señal de teléfono.', 'Léelo como un alienígena.',
  'Léelo como si tuvieras mucho miedo.', 'Léelo como un filósofo pensativo.',
  'Léelo como si estuvieras regañando a alguien.', 'Léelo como un mago revelando un truco.',
  'Léelo usando solo una vocal (ej: cambia todo por "a").', 'Léelo como un comercial de lujo.',
  'Léelo haciendo pausas en cada palabra.', 'Léelo como un niño mimado.',
  'Léelo con tono de quien ganó la lotería.', 'Léelo como un científico loco.',
  'Léelo como si leyeras un testamento.', 'Léelo como un boxeador antes de pelear.',
  'Léelo como un cotilleo de ascensor.', 'Léelo con sarcasmo total.',
  'Léelo como si estuvieras en la luna.', 'Léelo como un mimo.',
  'Léelo como un abuelo contando historias.', 'Léelo como un sargento militar.',
  'Léelo como si estuvieras en un juicio.', 'Léelo como un turista perdido.',
  'Léelo como si contaras una leyenda urbana.', 'Léelo como un gurú espiritual.',
  'Léelo cambiando las sílabas de las palabras.', 'Léelo con mucha rabia.',
  'Léelo como si fuera un momento romántico.', 'Léelo como un zombi.',
  'Léelo como un vaquero de película vieja.', 'Léelo como una IA.',
  'Léelo con una risa maníaca al final.', 'Léelo como si estuvieras en los Oscar.',
  'Léelo como si hubieras aspirado helio.'
];

const READING_CHALLENGES_FR = [
  'Lisez comme un animateur radio dramatique.', 'Lisez en retenant votre rire à chaque pause.',
  'Lisez comme si vous racontiez un secret important.', 'Lisez avec une voix de dessin animé.',
  'Lisez comme si vous étiez épuisé.', 'Lisez comme pour un flash info urgent.',
  'Lisez comme dans une pièce de théâtre exagérée.', 'Lisez avec un sérieux total.',
  'Lisez comme si vous remettiez un prix.', 'Lisez comme un professeur en colère.',
  'Lisez comme un commentateur sportif enthousiaste.', 'Lisez comme un mauvais humoriste.',
  'Lisez avec un accent du sud très prononcé.', 'Lisez en chuchotant comme un espion.',
  'Lisez en criant comme si vous étiez loin.', 'Lisez comme un robot sans émotion.',
  'Lisez en pleurant d\'émotion.', 'Lisez comme le méchant d\'un film.',
  'Lisez en sautant sur un pied.', 'Lisez comme à un enfant de 5 ans.',
  'Lisez en zézayant.', 'Lisez comme si vous veniez de vous réveiller.',
  'Lisez en imitant un animal.', 'Lisez comme un vendeur de voitures d\'occasion.',
  'Lisez à un rythme extrêmement lent.', 'Lisez à la vitesse d\'un rappeur.',
  'Lisez comme si vous étiez interrogé.', 'Lisez en faisant semblant d\'avoir le hoquet.',
  'Lisez avec un accent québécois très marqué.', 'Lisez comme un pirate.',
  'Lisez en faisant des gestes exagérés.', 'Lisez comme si vous chantiez l\'opéra.',
  'Lisez les yeux fermés.', 'Lisez comme un présentateur du JT classique.',
  'Lisez comme si vous étiez dans une grotte.', 'Lisez la bouche pleine.',
  'Lisez comme si vous étiez le Père Noël.', 'Lisez comme un maître de cérémonie.',
  'Lisez en chuchotant les mots et en criant la ponctuation.', 'Lisez comme un fantôme.',
  'Lisez avec une voix aiguë.', 'Lisez avec une voix très grave.',
  'Lisez comme si vous aviez une mauvaise connexion téléphonique.', 'Lisez comme un extraterrestre.',
  'Lisez comme si vous aviez très peur.', 'Lisez comme un philosophe pensif.',
  'Lisez comme si vous faisiez la leçon.', 'Lisez comme un magicien.',
  'Lisez en utilisant qu\'une seule voyelle.', 'Lisez comme une pub de luxe.',
  'Lisez en faisant des pauses à chaque mot.', 'Lisez comme un enfant gâté.',
  'Lisez comme si vous aviez gagné au loto.', 'Lisez comme un savant fou.',
  'Lisez comme un testament.', 'Lisez comme un boxeur avant un combat.',
  'Lisez comme un potin d\'ascenseur.', 'Lisez avec un sarcasme total.',
  'Lisez comme si vous étiez sur la lune.', 'Lisez comme un mime.',
  'Lisez comme un grand-père racontant une histoire.', 'Lisez comme un sergent-chef.',
  'Lisez comme si vous étiez au tribunal.', 'Lisez comme un touriste perdu.',
  'Lisez comme une légende urbaine.', 'Lisez comme un gourou spirituel.',
  'Lisez en inversant les syllabes.', 'Lisez avec beaucoup de colère.',
  'Lisez comme un moment romantique.', 'Lisez comme un zombie.',
  'Lisez comme un cow-boy de vieux western.', 'Lisez comme une IA.',
  'Lisez avec un rire maniaque à la fin.', 'Lisez comme aux Oscars.',
  'Lisez comme si vous aviez inhalé de l\'hélium.'
];

const READING_CHALLENGES_DE = [
  'Lies wie ein dramatischer Radiomoderator.', 'Lies und versuche, bei jeder Pause nicht zu lachen.',
  'Lies, als würdest du ein Staatsgeheimnis verraten.', 'Lies mit einer Cartoon-Stimme.',
  'Lies, als wärst du extrem müde.', 'Lies wie ein Eilmeldungs-Sprecher.',
  'Lies wie in einem völlig übertriebenen Theaterstück.', 'Lies mit tödlicher Ernsthaftigkeit.',
  'Lies, als würdest du einen Preis verleihen.', 'Lies wie ein strenger Lehrer.',
  'Lies wie ein begeisterter Sportkommentator.', 'Lies wie ein schlechter Stand-up-Comedian.',
  'Lies mit einem extrem starken bayerischen Dialekt.', 'Lies flüsternd, als würde ein Spion zuhören.',
  'Lies schreiend, als wärst du auf der anderen Straßenseite.', 'Lies wie ein emotionsloser Roboter.',
  'Lies unter Tränen der Rührung.', 'Lies wie der Bösewicht einer Soap Opera.',
  'Lies während du auf einem Bein hüpfst.', 'Lies, als würdest du es einem 5-Jährigen erklären.',
  'Lies mit einem Lispeln.', 'Lies, als wärst du gerade erst aufgewacht.',
  'Lies, indem du ein Tier deiner Wahl imitierst.', 'Lies wie ein zwielichtiger Gebrauchtwagenhändler.',
  'Lies in extrem langsamem Tempo.', 'Lies im Tempo eines Rappers.',
  'Lies, als wärst du in einem Verhör.', 'Lies und tue so, als hättest du Schluckauf.',
  'Lies mit einem starken sächsischen Akzent.', 'Lies wie ein Pirat.',
  'Lies mit übertriebener Gestik.', 'Lies wie ein Opernsänger.',
  'Lies mit geschlossenen Augen.', 'Lies wie ein klassischer Nachrichtensprecher.',
  'Lies, als wärst du in einer Höhle mit Echo.', 'Lies, als hättest du den Mund voll.',
  'Lies wie der Weihnachtsmann.', 'Lies wie ein Zeremonienmeister.',
  'Lies die Wörter flüsternd und die Satzzeichen schreiend.', 'Lies wie ein Geist.',
  'Lies mit hoher, piepsiger Stimme.', 'Lies mit extrem tiefer Stimme.',
  'Lies wie bei einer schlechten Telefonverbindung.', 'Lies wie ein Alien, das Deutsch lernt.',
  'Lies, als hättest du schreckliche Angst.', 'Lies wie ein tiefsinniger Philosoph.',
  'Lies, als würdest du jemanden belehren.', 'Lies wie ein Zauberer bei einem Trick.',
  'Lies nur mit einem Vokal (z.B. alles mit "a").', 'Lies wie in einer Luxus-Werbung.',
  'Lies mit Pausen nach jedem Wort.', 'Lies wie ein verzogenes Kind.',
  'Lies, als hättest du gerade im Lotto gewonnen.', 'Lies wie ein verrückter Wissenschaftler.',
  'Lies wie beim Verlesen eines Testaments.', 'Lies wie ein Boxer vor dem Kampf.',
  'Lies wie beim Flüstern im Aufzug.', 'Lies mit totalem Sarkasmus.',
  'Lies, als wärst du auf dem Mond.', 'Lies wie ein Pantomime (nur Mundbewegungen).',
  'Lies wie ein Opa, der eine Geschichte erzählt.', 'Lies wie ein Drill-Sergeant.',
  'Lies, als wärst du vor Gericht.', 'Lies wie ein verirrter Tourist.',
  'Lies wie beim Erzählen einer urbanen Legende.', 'Lies wie ein spiritueller Guru.',
  'Lies, indem du die Silben der Wörter vertauschst.', 'Lies mit intensiver Wut.',
  'Lies wie in einer romantischen Szene.', 'Lies wie ein Zombie.',
  'Lies wie ein Cowboy aus einem alten Western.', 'Lies wie eine KI.',
  'Lies mit einem wahnsinnigen Lachen am Ende.', 'Lies, als stündest du auf der Oscar-Bühne.',
  'Lies, als hättest du Helium eingeatmet.'
];

const READING_CHALLENGES_IT = [
  'Leggi come un drammatico speaker radiofonico.', 'Leggi trattenendo le risate a ogni pausa.',
  'Leggi come se stessi raccontando un segreto di stato.', 'Leggi con una voce da cartone animato.',
  'Leggi come se fossi esausto.', 'Leggi al ritmo di un notiziario urgente.',
  'Leggi come in una recita teatrale esagerata.', 'Leggi con totale serietà.',
  'Leggi come se stessi premiando qualcuno.', 'Leggi come un professore severo.',
  'Leggi come un cronista sportivo entusiasta.', 'Leggi come un comico fallito.',
  'Leggi con un forte accento dialettale (es. napoletano).', 'Leggi bisbigliando come se ci fosse una spia.',
  'Leggi urlando come se fossi dall\'altra parte della strada.', 'Leggi come un robot senza emozioni.',
  'Leggi piangendo per l\'emozione.', 'Leggi come il cattivo di una soap opera.',
  'Leggi saltando su un piede solo.', 'Leggi come se spiegassi a un bambino di 5 anni.',
  'Leggi con la zeppola.', 'Leggi come se ti fossi appena svegliato.',
  'Leggi imitando un animale a scelta.', 'Leggi come un venditore di auto usate.',
  'Leggi a un ritmo estremamente lento.', 'Leggi alla velocità di un rapper.',
  'Leggi come se fossi sotto interrogatorio.', 'Leggi fingendo di avere il singhiozzo.',
  'Leggi con un forte accento milanese.', 'Leggi come un pirata.',
  'Leggi facendo gesti esagerati con le mani.', 'Leggi come se cantassi all\'opera.',
  'Leggi a occhi chiusi.', 'Leggi come un classico presentatore del TG.',
  'Leggi come se fossi in una grotta con l\'eco.', 'Leggi con la bocca piena.',
  'Leggi come se fossi Babbo Natale.', 'Leggi come un maestro di cerimonie.',
  'Leggi bisbigliando le parole e urlando la punteggiatura.', 'Leggi come un fantasma.',
  'Leggi con una voce acuta e sottile.', 'Leggi con una voce molto profonda.',
  'Leggi come se avessi una pessima ricezione telefonica.', 'Leggi come un alieno che impara l\'italiano.',
  'Leggi come se avessi molta paura.', 'Leggi come un filosofo pensieroso.',
  'Leggi come se stessi facendo una ramanzina.', 'Leggi come un mago che rivela un trucco.',
  'Leggi usando solo una vocale.', 'Leggi come una pubblicità di lusso.',
  'Leggi facendo pause dopo ogni parola.', 'Leggi come un bambino viziato.',
  'Leggi con il tono di chi ha appena vinto alla lotteria.', 'Leggi come uno scienziato pazzo.',
  'Leggi come se leggessi un testamento.', 'Leggi come un pugile prima del match.',
  'Leggi come un pettegolezzo in ascensore.', 'Leggi con sarcasmo totale.',
  'Leggi come se fossi sulla luna.', 'Leggi come un mimo (solo movimenti della bocca).',
  'Leggi come un nonno che racconta una storia.', 'Leggi come un sergente istruttore.',
  'Leggi come se fossi in tribunale.', 'Leggi come un turista smarrito.',
  'Leggi come se raccontassi una leggenda metropolitana.', 'Leggi come un guru spirituale.',
  'Leggi scambiando le sillabe delle parole.', 'Leggi con molta rabbia.',
  'Leggi come se fosse un momento romantico.', 'Leggi come uno zombie.',
  'Leggi come un cowboy di un vecchio film.', 'Leggi come un\'intelligenza artificiale.',
  'Leggi con una risata maniacale alla fine.', 'Leggi come se fossi sul palco degli Oscar.',
  'Leggi come se avessi aspirato elio.'
];


    // Content pack schema used by the app and by future downloadable packs:
    // {
    //   id,
    //   name,
    //   source: 'builtin' | 'custom' | 'downloaded',
    //   editable: boolean,
    //   enabled: boolean,
    //   jokes: { [locale]: { [category]: JokeEntry[] } },
    //   readingChallenges: { [locale]: string[] }
    // }
    function createCorePack() {
      return {
        id: CORE_PACK_ID,
        name: {
          pt: 'Pack Core de Piadas',
          en: 'Core Joke Pack'
        },
        source: 'builtin',
        editable: true,
        enabled: true,
        jokes: {
          pt: clone(DEFAULT_JOKES.pt),
          en: clone(DEFAULT_JOKES.en),
          es: clone(DEFAULT_JOKES.es),
          fr: clone(DEFAULT_JOKES.fr),
          de: clone(DEFAULT_JOKES.de),
          it: clone(DEFAULT_JOKES.it)
        },
        readingChallenges: {
          pt: clone(READING_CHALLENGES_PT),
          en: clone(READING_CHALLENGES_EN),
          es: clone(READING_CHALLENGES_ES),
          fr: clone(READING_CHALLENGES_FR),
          de: clone(READING_CHALLENGES_DE),
          it: clone(READING_CHALLENGES_IT)
        }
      };
    }

    function syncPackLocaleCompatibility(pack, locale) {
      pack.words = pack.words || {};
      pack.challenges = pack.challenges || {};
      pack.words[locale] = createLegacyWordBankFromJokeBank(pack.jokes?.[locale] || {});
      pack.challenges[locale] = normalizeChallenges(pack.readingChallenges?.[locale] || []);
    }

    function normalizePack(pack) {
      const normalizedJokes = {};
      const normalizedReadingChallenges = {};
      const locales = new Set([
        ...Object.keys(pack?.jokes || {}),
        ...Object.keys(pack?.words || {}),
        ...Object.keys(pack?.readingChallenges || {}),
        ...Object.keys(pack?.challenges || {})
      ]);
      locales.forEach(locale => {
        const rawJokes = pack?.jokes?.[locale];
        normalizedJokes[locale] = rawJokes && typeof rawJokes === 'object' && !Array.isArray(rawJokes)
          ? normalizeJokeBank(rawJokes)
          : convertLegacyWordBankToJokeBank(pack?.words?.[locale] || {});
        normalizedReadingChallenges[locale] = normalizeChallenges(
          pack?.readingChallenges?.[locale] || pack?.challenges?.[locale] || []
        );
      });

      const normalizedPack = {
        id: pack?.id || `pack-${Date.now()}`,
        name: pack?.name || 'Pack',
        description: pack?.description || '',
        version: pack?.version || '',
        author: pack?.author || '',
        source: pack?.source || 'local',
        editable: pack?.editable !== false,
        enabled: pack?.enabled !== false,
        installedAt: pack?.installedAt || '',
        license: pack?.license || null,
        challengeOverrides: (pack?.challengeOverrides && typeof pack.challengeOverrides === 'object') ? pack.challengeOverrides : {},
        jokes: normalizedJokes,
        readingChallenges: normalizedReadingChallenges,
        words: {},
        challenges: {}
      };
      Object.keys(normalizedJokes).forEach(locale => {
        syncPackLocaleCompatibility(normalizedPack, locale);
      });
      return normalizedPack;
    }

    function getLocalizedText(value, fallback = '') {
      if (!value) return fallback;
      if (typeof value === 'string') return value;
      return value[currentLanguage] || value[DEFAULT_LANGUAGE] || value.pt || Object.values(value)[0] || fallback;
    }

    function getPackDisplayName(pack) {
      return getLocalizedText(pack?.name, 'Pack');
    }

    function getPackWordCount(pack, locale = currentLanguage) {
      const bank = normalizeJokeBank(pack?.jokes?.[locale] || {});
      return CATEGORY_KEYS.reduce((count, category) => count + bank[category].length, 0);
    }

    function getPackTotalContentCount(pack) {
      const locales = new Set([
        ...Object.keys(pack?.words || {}),
        ...Object.keys(pack?.challenges || {})
      ]);
      let count = 0;
      locales.forEach(locale => {
        count += getPackWordCount(pack, locale);
        count += normalizeChallenges(pack?.challenges?.[locale] || []).length;
      });
      return count;
    }

    function canonicalize(value) {
      if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
      if (value && typeof value === 'object') {
        return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
      }
      return JSON.stringify(value);
    }

    function bytesToBase64Url(bytes) {
      const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
      return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    }

    function base64UrlToBytes(value) {
      const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
      const binary = atob(padded);
      return Uint8Array.from(binary, char => char.charCodeAt(0));
    }

    async function sha256Base64Url(value) {
      if (!crypto?.subtle) throw new Error(t('packErrors.cryptoUnavailable'));
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
      return bytesToBase64Url(new Uint8Array(digest));
    }

    function buildPackSignedPayload(userId, packId, contentHash) {
      return `${PACK_SIGNATURE_CONTEXT}\nuser_id=${userId}\npack_id=${packId}\ncontent_sha256=${contentHash}`;
    }

    async function verifyPackSignature(userId, packId, contentHash, signature) {
      if (!crypto?.subtle) throw new Error(t('packErrors.cryptoUnavailable'));
      const publicKey = await crypto.subtle.importKey(
        'jwk',
        PACK_SIGNING_PUBLIC_KEY,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['verify']
      );
      return crypto.subtle.verify(
        { name: 'ECDSA', hash: 'SHA-256' },
        publicKey,
        base64UrlToBytes(signature),
        new TextEncoder().encode(buildPackSignedPayload(userId, packId, contentHash))
      );
    }

    function mergeUniqueStrings(primary = [], secondary = []) {
      return [...new Set([...(primary || []), ...(secondary || [])].map(item => String(item).trim()).filter(Boolean))];
    }

    function mergeJokeBanks(baseBank = {}, savedBank = {}) {
      const normalizedBase = normalizeJokeBank(baseBank);
      const normalizedSaved = normalizeJokeBank(savedBank);
      const merged = createEmptyJokeBank();

      CATEGORY_KEYS.forEach(category => {
        merged[category] = normalizeJokeList([
          ...normalizedBase[category],
          ...normalizedSaved[category]
        ]);
      });

      return merged;
    }

    function mergeCorePack(savedPack = {}) {
      const defaultCore = normalizePack(createCorePack());
      const merged = {
        ...defaultCore,
        ...savedPack,
        id: CORE_PACK_ID,
        source: 'builtin',
        editable: savedPack?.editable !== false,
        enabled: savedPack?.enabled !== false,
        jokes: {},
        readingChallenges: {}
      };

      const locales = new Set([
        ...Object.keys(defaultCore.jokes || {}),
        ...Object.keys(savedPack.jokes || {}),
        ...Object.keys(savedPack.words || {}),
        ...Object.keys(defaultCore.readingChallenges || {}),
        ...Object.keys(savedPack.readingChallenges || {}),
        ...Object.keys(savedPack.challenges || {})
      ]);

      locales.forEach(locale => {
        const savedJokes = savedPack.jokes?.[locale] || convertLegacyWordBankToJokeBank(savedPack.words?.[locale] || {});
        merged.jokes[locale] = mergeJokeBanks(defaultCore.jokes?.[locale], savedJokes);
        merged.readingChallenges[locale] = savedPack.challengeOverrides?.[locale]
          ? normalizeChallenges(savedPack.readingChallenges?.[locale] || savedPack.challenges?.[locale] || [])
          : mergeUniqueStrings(
            defaultCore.readingChallenges?.[locale],
            savedPack.readingChallenges?.[locale] || savedPack.challenges?.[locale]
          );
      });

      return normalizePack(merged);
    }

    function createDefaultContentModel() {
      return {
        version: 1,
        packs: [normalizePack(createCorePack())]
      };
    }

    function loadContentModel() {
      try {
        const saved = JSON.parse(localStorage.getItem(CONTENT_KEY) || 'null');
        if (saved?.packs?.length) {
          const normalizedPacks = saved.packs.map(pack => (
            pack?.id === CORE_PACK_ID ? mergeCorePack(pack) : normalizePack(pack)
          ));
          if (!normalizedPacks.some(pack => pack.id === CORE_PACK_ID)) {
            normalizedPacks.unshift(normalizePack(createCorePack()));
          }
          return {
            version: 1,
            packs: normalizedPacks
          };
        }
      } catch (e) { }

      const model = createDefaultContentModel();
      try {
        const legacyWords = JSON.parse(localStorage.getItem(LEGACY_WORDS_KEY) || 'null');
        if (legacyWords) {
          model.packs[0].jokes.pt = convertLegacyWordBankToJokeBank(legacyWords);
          syncPackLocaleCompatibility(model.packs[0], 'pt');
        }
      } catch (e) { }
      return model;
    }

    let contentModel = loadContentModel();
    let achievementState = loadAchievementState();
    let achievementNotificationQueue = [];
    let achievementNotificationTimer = 0;

    function saveContentModel() {
      localStorage.setItem(CONTENT_KEY, JSON.stringify(contentModel));
    }

    function getEnabledPacks() {
      return (contentModel.packs || []).filter(pack => pack.enabled !== false);
    }

    function getCorePack() {
      return contentModel.packs.find(pack => pack.id === CORE_PACK_ID) || normalizePack(createCorePack());
    }

    function getPremiumPacks(options = {}) {
      const { enabledOnly = true } = options;
      return (contentModel.packs || []).filter(pack => (
        pack.source === 'downloaded' && (!enabledOnly || pack.enabled !== false)
      ));
    }

    function getPremiumCategoryToken(packId) {
      return `pack:${packId}`;
    }

    function getPackIdFromCategoryToken(token) {
      return String(token || '').startsWith('pack:') ? String(token).slice(5) : '';
    }

    function getPremiumPackByToken(token) {
      const packId = getPackIdFromCategoryToken(token);
      if (!packId) return null;
      return getPremiumPacks().find(pack => pack.id === packId) || null;
    }

    function isPremiumCategoryToken(token) {
      return Boolean(getPremiumPackByToken(token));
    }

    function isValidCategoryToken(token) {
      return CATEGORY_KEYS.includes(token) || isPremiumCategoryToken(token);
    }

    function ensureUniqueWords(words) {
      return [...new Set(words)];
    }

    function getLocalizedChallenges(locale = currentLanguage) {
      const corePack = getCorePack();
      let list = normalizeChallenges(corePack.readingChallenges?.[locale] || []);
      if (!list.length && !corePack.challengeOverrides?.[locale]) {
        list = normalizeChallenges(createCorePack().readingChallenges?.[locale] || []);
      }
      getPremiumPacks().forEach(pack => {
        list = ensureUniqueWords([...list, ...normalizeChallenges(pack.readingChallenges?.[locale] || [])]);
      });
      return list;
    }

    function getEditablePack() {
      let pack = contentModel.packs.find(item => item.editable !== false);
      if (!pack) {
        pack = normalizePack({
          id: `custom-${Date.now()}`,
          name: { pt: 'Pack Local Personalizado', en: 'Custom Local Pack' },
          source: 'custom',
          editable: true,
          enabled: true,
          jokes: {},
          readingChallenges: {}
        });
        contentModel.packs.push(pack);
      }
      return pack;
    }

    function ensurePackLocale(pack, locale = currentLanguage) {
      pack.jokes = pack.jokes || {};
      pack.readingChallenges = pack.readingChallenges || {};
      pack.words = pack.words || {};
      pack.challenges = pack.challenges || {};
      if (!pack.jokes[locale]) {
        pack.jokes[locale] = createEmptyJokeBank();
      } else {
        pack.jokes[locale] = normalizeJokeBank(pack.jokes[locale]);
      }
      if (!pack.readingChallenges[locale]) {
        pack.readingChallenges[locale] = [];
      } else {
        pack.readingChallenges[locale] = normalizeChallenges(pack.readingChallenges[locale]);
      }
      syncPackLocaleCompatibility(pack, locale);
    }

    async function buildInstalledPackFromEnvelope(envelope) {
      if (!envelope || typeof envelope !== 'object') throw new Error(t('packErrors.invalidJson'));
      if (envelope.schema !== WORD_PACK_SCHEMA) throw new Error(t('packErrors.invalidSchema'));
      if (envelope.user_id !== appUserId) throw new Error(t('packErrors.invalidUser'));
      if (!envelope.pack_id || typeof envelope.pack_id !== 'string') throw new Error(t('packErrors.invalidPackId'));
      if (envelope.pack_id === CORE_PACK_ID) throw new Error(t('packErrors.reservedPackId'));
      if (envelope.signature_algorithm !== PACK_SIGNATURE_ALGORITHM) throw new Error(t('packErrors.invalidAlgorithm'));
      if (!envelope.signature || typeof envelope.signature !== 'string') throw new Error(t('packErrors.invalidSignature'));

      const content = envelope.content || {};
      const contentHash = await sha256Base64Url(canonicalize(content));
      if (envelope.content_sha256 && envelope.content_sha256 !== contentHash) {
        throw new Error(t('packErrors.invalidContentHash'));
      }

      const isSignatureValid = await verifyPackSignature(envelope.user_id, envelope.pack_id, contentHash, envelope.signature);
      if (!isSignatureValid) throw new Error(t('packErrors.invalidSignature'));

      const normalizedEnvelopeChallenges = Array.isArray(content.readingChallenges || content.challenges)
        ? { [DEFAULT_LANGUAGE]: (content.readingChallenges || content.challenges || []) }
        : (content.readingChallenges || content.challenges || {});

      const pack = normalizePack({
        id: envelope.pack_id,
        name: content.name || envelope.pack_id,
        description: content.description || '',
        version: content.version || '',
        author: content.author || '',
        source: 'downloaded',
        editable: false,
        enabled: true,
        installedAt: new Date().toISOString(),
        license: {
          userId: envelope.user_id,
          signature: envelope.signature,
          algorithm: envelope.signature_algorithm,
          contentSha256: contentHash
        },
        jokes: content.jokes || convertLegacyWordBankToJokeBank(content.words || {}),
        readingChallenges: normalizedEnvelopeChallenges
      });

      if (getPackTotalContentCount(pack) === 0) throw new Error(t('packErrors.emptyPack'));
      return pack;
    }

    async function parsePackFile(file) {
      if (!file) throw new Error(t('packErrors.fileRequired'));
      try {
        return JSON.parse(await file.text());
      } catch (e) {
        throw new Error(t('packErrors.invalidJson'));
      }
    }

    function getCategoryLabel(category, options = {}) {
      const { singular = false, withIcon = false } = options;
      const premiumPack = getPremiumPackByToken(category);
      if (premiumPack) {
        const premiumLabel = getPackDisplayName(premiumPack);
        return withIcon ? `⭐ ${premiumLabel}` : premiumLabel;
      }
      const label = t(`category.${category}.${singular ? 'singular' : 'plural'}`);
      return withIcon ? `${CATEGORY_ICONS[category] || ''} ${label}`.trim() : label;
    }

    function createDefaultAchievementCounters() {
      return {
        totalMatchesFinished: 0,
        totalRoundsPlayed: 0,
        totalLaughs: 0,
        totalNoLaughs: 0,
        totalPerfectMatches: 0,
        totalMultiDeviceMatches: 0,
        totalJokesRated: 0,
        categoryRounds: CATEGORY_KEYS.reduce((acc, key) => {
          acc[key] = 0;
          return acc;
        }, {}),
        maxLaughStreak: 0,
        currentLaughStreak: 0
      };
    }

    function getDefaultAchievementState() {
      return {
        unlocked: {},
        counters: createDefaultAchievementCounters()
      };
    }

    function normalizeAchievementState(state = {}) {
      const defaults = getDefaultAchievementState();
      const sourceUnlocked = state?.unlocked && typeof state.unlocked === 'object' && !Array.isArray(state.unlocked)
        ? state.unlocked
        : {};
      const sourceCounters = state?.counters && typeof state.counters === 'object' && !Array.isArray(state.counters)
        ? state.counters
        : {};
      const normalizedCategoryRounds = { ...defaults.counters.categoryRounds };
      Object.keys(sourceCounters.categoryRounds || {}).forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(normalizedCategoryRounds, key)) return;
        normalizedCategoryRounds[key] = Math.max(0, Number.parseInt(sourceCounters.categoryRounds[key], 10) || 0);
      });

      return {
        unlocked: Object.entries(sourceUnlocked).reduce((acc, [id, entry]) => {
          const normalizedId = String(entry?.id || id).trim();
          if (!normalizedId) return acc;
          acc[normalizedId] = {
            id: normalizedId,
            unlockedAt: String(entry?.unlockedAt || '').trim() || new Date().toISOString()
          };
          return acc;
        }, {}),
        counters: {
          totalMatchesFinished: Math.max(0, Number.parseInt(sourceCounters.totalMatchesFinished, 10) || 0),
          totalRoundsPlayed: Math.max(0, Number.parseInt(sourceCounters.totalRoundsPlayed, 10) || 0),
          totalLaughs: Math.max(0, Number.parseInt(sourceCounters.totalLaughs, 10) || 0),
          totalNoLaughs: Math.max(0, Number.parseInt(sourceCounters.totalNoLaughs, 10) || 0),
          totalPerfectMatches: Math.max(0, Number.parseInt(sourceCounters.totalPerfectMatches, 10) || 0),
          totalMultiDeviceMatches: Math.max(0, Number.parseInt(sourceCounters.totalMultiDeviceMatches, 10) || 0),
          totalJokesRated: Math.max(0, Number.parseInt(sourceCounters.totalJokesRated, 10) || 0),
          categoryRounds: normalizedCategoryRounds,
          maxLaughStreak: Math.max(0, Number.parseInt(sourceCounters.maxLaughStreak, 10) || 0),
          currentLaughStreak: Math.max(0, Number.parseInt(sourceCounters.currentLaughStreak, 10) || 0)
        }
      };
    }

    function loadAchievementState() {
      try {
        const saved = localStorage.getItem(NPR_ACHIEVEMENTS_KEY);
        if (!saved) return getDefaultAchievementState();
        return normalizeAchievementState(JSON.parse(saved));
      } catch (error) {
        return getDefaultAchievementState();
      }
    }

    function saveAchievementState(state) {
      const normalized = normalizeAchievementState(state);
      achievementState = normalized;
      try {
        localStorage.setItem(NPR_ACHIEVEMENTS_KEY, JSON.stringify(normalized));
      } catch (error) { }
      return normalized;
    }

    function getPlayedCategoryCount(counters = {}) {
      return Object.values(counters.categoryRounds || {}).filter(value => (Number.parseInt(value, 10) || 0) > 0).length;
    }

    function createCountAchievement(options = {}) {
      const {
        id,
        icon,
        titleKey,
        descKey,
        count,
        valueGetter
      } = options;
      return {
        id,
        icon,
        titleKey,
        descKey,
        titleParams: { count },
        descParams: { count },
        target: count,
        getProgress: counters => valueGetter(counters),
        condition: counters => valueGetter(counters) >= count
      };
    }

    function getAchievementDefinitions() {
      const categoryAchievements = CATEGORY_KEYS.map(categoryKey => ({
        id: `category_round_${categoryKey}`,
        icon: CATEGORY_ICONS[categoryKey] || '🏷️',
        titleKey: 'achievements.templates.categoryRoundTitle',
        descKey: 'achievements.templates.categoryRoundDesc',
        titleParams: { categoryKey },
        descParams: { categoryKey },
        target: 1,
        getProgress: counters => Number.parseInt(counters.categoryRounds?.[categoryKey], 10) || 0,
        condition: counters => (Number.parseInt(counters.categoryRounds?.[categoryKey], 10) || 0) >= 1
      }));

      return [
        {
          id: 'first_laugh',
          icon: '😂',
          titleKey: 'achievements.items.firstLaugh.title',
          descKey: 'achievements.items.firstLaugh.desc',
          target: 1,
          getProgress: counters => counters.totalLaughs,
          condition: counters => counters.totalLaughs >= 1
        },
        {
          id: 'first_no_laugh',
          icon: '😐',
          titleKey: 'achievements.items.firstNoLaugh.title',
          descKey: 'achievements.items.firstNoLaugh.desc',
          target: 1,
          getProgress: counters => counters.totalNoLaughs,
          condition: counters => counters.totalNoLaughs >= 1
        },
        {
          id: 'humor_beginner',
          icon: '🎤',
          titleKey: 'achievements.items.humorBeginner.title',
          descKey: 'achievements.items.humorBeginner.desc',
          target: 10,
          getProgress: counters => counters.totalLaughs,
          condition: counters => counters.totalLaughs >= 10
        },
        {
          id: 'laughter_machine',
          icon: '🤣',
          titleKey: 'achievements.items.laughterMachine.title',
          descKey: 'achievements.items.laughterMachine.desc',
          target: 50,
          getProgress: counters => counters.totalLaughs,
          condition: counters => counters.totalLaughs >= 50
        },
        {
          id: 'joke_marathon',
          icon: '🏃',
          titleKey: 'achievements.items.jokeMarathon.title',
          descKey: 'achievements.items.jokeMarathon.desc',
          target: 100,
          getProgress: counters => counters.totalRoundsPlayed,
          condition: counters => counters.totalRoundsPlayed >= 100
        },
        {
          id: 'first_match',
          icon: '🎮',
          titleKey: 'achievements.items.firstMatch.title',
          descKey: 'achievements.items.firstMatch.desc',
          target: 1,
          getProgress: counters => counters.totalMatchesFinished,
          condition: counters => counters.totalMatchesFinished >= 1
        },
        {
          id: 'humor_veteran',
          icon: '🏅',
          titleKey: 'achievements.items.humorVeteran.title',
          descKey: 'achievements.items.humorVeteran.desc',
          target: 10,
          getProgress: counters => counters.totalMatchesFinished,
          condition: counters => counters.totalMatchesFinished >= 10
        },
        {
          id: 'funny_streak',
          icon: '🔥',
          titleKey: 'achievements.items.funnyStreak.title',
          descKey: 'achievements.items.funnyStreak.desc',
          target: 3,
          getProgress: counters => counters.maxLaughStreak,
          condition: counters => counters.maxLaughStreak >= 3
        },
        {
          id: 'unstoppable',
          icon: '🚀',
          titleKey: 'achievements.items.unstoppable.title',
          descKey: 'achievements.items.unstoppable.desc',
          target: 5,
          getProgress: counters => counters.maxLaughStreak,
          condition: counters => counters.maxLaughStreak >= 5
        },
        {
          id: 'category_explorer',
          icon: '🧭',
          titleKey: 'achievements.items.categoryExplorer.title',
          descKey: 'achievements.items.categoryExplorer.desc',
          target: 3,
          getProgress: counters => getPlayedCategoryCount(counters),
          condition: counters => getPlayedCategoryCount(counters) >= 3
        },
        {
          id: 'category_master',
          icon: '🗂️',
          titleKey: 'achievements.items.categoryMaster.title',
          descKey: 'achievements.items.categoryMaster.desc',
          target: CATEGORY_KEYS.length,
          getProgress: counters => getPlayedCategoryCount(counters),
          condition: counters => getPlayedCategoryCount(counters) >= CATEGORY_KEYS.length
        },
        {
          id: 'connected',
          icon: '📡',
          titleKey: 'achievements.items.connected.title',
          descKey: 'achievements.items.connected.desc',
          target: 1,
          getProgress: counters => counters.totalMultiDeviceMatches,
          condition: counters => counters.totalMultiDeviceMatches >= 1
        },
        {
          id: 'critic',
          icon: '⭐',
          titleKey: 'achievements.items.critic.title',
          descKey: 'achievements.items.critic.desc',
          target: 10,
          getProgress: counters => counters.totalJokesRated,
          condition: counters => counters.totalJokesRated >= 10
        },
        ...[25, 75, 150, 300].map(count => createCountAchievement({
          id: `laughs_${count}`,
          icon: '😂',
          titleKey: 'achievements.templates.laughsTitle',
          descKey: 'achievements.templates.laughsDesc',
          count,
          valueGetter: counters => counters.totalLaughs
        })),
        ...[10, 25, 50, 100, 200].map(count => createCountAchievement({
          id: `no_laughs_${count}`,
          icon: '🧊',
          titleKey: 'achievements.templates.noLaughsTitle',
          descKey: 'achievements.templates.noLaughsDesc',
          count,
          valueGetter: counters => counters.totalNoLaughs
        })),
        ...[10, 25, 50, 200, 500].map(count => createCountAchievement({
          id: `rounds_${count}`,
          icon: '🔁',
          titleKey: 'achievements.templates.roundsTitle',
          descKey: 'achievements.templates.roundsDesc',
          count,
          valueGetter: counters => counters.totalRoundsPlayed
        })),
        ...[3, 5, 20, 50].map(count => createCountAchievement({
          id: `matches_${count}`,
          icon: '🎮',
          titleKey: 'achievements.templates.matchesTitle',
          descKey: 'achievements.templates.matchesDesc',
          count,
          valueGetter: counters => counters.totalMatchesFinished
        })),
        ...[1, 3, 5, 10].map(count => createCountAchievement({
          id: `perfect_matches_${count}`,
          icon: '💯',
          titleKey: 'achievements.templates.perfectTitle',
          descKey: 'achievements.templates.perfectDesc',
          count,
          valueGetter: counters => counters.totalPerfectMatches
        })),
        ...[5, 10, 25].map(count => createCountAchievement({
          id: `multidevice_matches_${count}`,
          icon: '📶',
          titleKey: 'achievements.templates.multiDeviceTitle',
          descKey: 'achievements.templates.multiDeviceDesc',
          count,
          valueGetter: counters => counters.totalMultiDeviceMatches
        })),
        ...[1, 5, 25, 50].map(count => createCountAchievement({
          id: `ratings_${count}`,
          icon: '📝',
          titleKey: 'achievements.templates.ratingsTitle',
          descKey: 'achievements.templates.ratingsDesc',
          count,
          valueGetter: counters => counters.totalJokesRated
        })),
        ...[7, 10, 15].map(count => createCountAchievement({
          id: `streak_${count}`,
          icon: '⚡',
          titleKey: 'achievements.templates.streakTitle',
          descKey: 'achievements.templates.streakDesc',
          count,
          valueGetter: counters => counters.maxLaughStreak
        })),
        ...categoryAchievements
      ];
    }

    function getAchievementText(definition, field = 'title') {
      const key = field === 'title' ? definition.titleKey : definition.descKey;
      const rawParams = field === 'title' ? (definition.titleParams || {}) : (definition.descParams || {});
      const params = { ...rawParams };
      if (params.categoryKey) {
        params.category = getCategoryLabel(params.categoryKey, { withIcon: false });
      }
      return t(key, params);
    }

    function getAchievementProgress(definition, counters) {
      const current = Math.max(0, Number(definition.getProgress?.(counters) || 0));
      const target = Math.max(0, Number(definition.target || 0));
      return {
        current,
        target,
        completed: target > 0 ? current >= target : Boolean(definition.condition?.(counters))
      };
    }

    function getUnlockedAchievementCount() {
      achievementState = loadAchievementState();
      return Object.keys(achievementState.unlocked || {}).length;
    }

    function isAchievementTrackingEnabled() {
      return multiDeviceState.role !== 'guest';
    }

    function flushAchievementNotificationQueue() {
      if (!achievementNotificationQueue.length) {
        achievementNotificationTimer = 0;
        return;
      }
      showNotif(achievementNotificationQueue.shift());
      achievementNotificationTimer = window.setTimeout(flushAchievementNotificationQueue, ACHIEVEMENT_NOTIFICATION_INTERVAL_MS);
    }

    function queueAchievementNotifications(messages = []) {
      if (!messages.length) return;
      achievementNotificationQueue.push(...messages);
      if (!achievementNotificationTimer) flushAchievementNotificationQueue();
    }

    function unlockAchievement(id, state = achievementState) {
      const normalizedId = String(id || '').trim();
      if (!normalizedId || state.unlocked[normalizedId]) return null;
      const definition = getAchievementDefinitions().find(item => item.id === normalizedId);
      if (!definition) return null;
      state.unlocked[normalizedId] = {
        id: normalizedId,
        unlockedAt: new Date().toISOString()
      };
      return definition;
    }

    function checkAndUnlockAchievements(options = {}) {
      const { notify = true } = options;
      achievementState = loadAchievementState();
      const unlockedNow = [];
      const definitions = getAchievementDefinitions();
      definitions.forEach(definition => {
        if (achievementState.unlocked[definition.id]) return;
        if (!definition.condition?.(achievementState.counters)) return;
        const unlockedDefinition = unlockAchievement(definition.id, achievementState);
        if (unlockedDefinition) unlockedNow.push(unlockedDefinition);
      });
      if (unlockedNow.length) {
        saveAchievementState(achievementState);
        if (notify) {
          queueAchievementNotifications(unlockedNow.map(definition => t('notifications.achievementUnlocked', {
            title: getAchievementText(definition, 'title')
          })));
        }
      }
      if (document.getElementById('screen-achievements')?.classList.contains('active')) {
        renderAchievementsScreen();
      }
      return unlockedNow;
    }

    function recordAchievementRoundResult(outcome = {}, categoryKey = '') {
      if (!isAchievementTrackingEnabled()) return;
      achievementState = loadAchievementState();
      const counters = achievementState.counters;
      counters.totalRoundsPlayed += 1;
      if (outcome?.laughed) {
        counters.totalLaughs += 1;
        counters.currentLaughStreak += 1;
        counters.maxLaughStreak = Math.max(counters.maxLaughStreak, counters.currentLaughStreak);
      } else {
        counters.totalNoLaughs += 1;
        counters.currentLaughStreak = 0;
      }
      if (categoryKey && Object.prototype.hasOwnProperty.call(counters.categoryRounds, categoryKey)) {
        counters.categoryRounds[categoryKey] += 1;
      }
      saveAchievementState(achievementState);
      checkAndUnlockAchievements();
    }

    function recordAchievementMatchFinished(matchSummary = {}) {
      if (!isAchievementTrackingEnabled()) return;
      achievementState = loadAchievementState();
      const counters = achievementState.counters;
      counters.totalMatchesFinished += 1;
      if (matchSummary.perfect) counters.totalPerfectMatches += 1;
      if (matchSummary.usedMultiDevice) counters.totalMultiDeviceMatches += 1;
      saveAchievementState(achievementState);
      checkAndUnlockAchievements();
    }

    function formatAchievementDate(isoDate = '') {
      const locale = LANGUAGE_HTML_MAP[currentLanguage] || LANGUAGE_HTML_MAP[DEFAULT_LANGUAGE] || currentLanguage;
      const date = isoDate ? new Date(isoDate) : null;
      if (!date || Number.isNaN(date.getTime())) return '';
      return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date);
    }

    function renderAchievementsScreen() {
      const grid = document.getElementById('achievements-grid');
      if (!grid) return;

      achievementState = loadAchievementState();
      const definitions = getAchievementDefinitions();
      const total = definitions.length;
      const unlockedCount = getUnlockedAchievementCount();
      const counters = achievementState.counters;

      const unlockedSummary = document.getElementById('achievements-summary-unlocked');
      const matchesSummary = document.getElementById('achievements-summary-matches');
      const roundsSummary = document.getElementById('achievements-summary-rounds');
      const laughsSummary = document.getElementById('achievements-summary-laughs');
      const summaryNote = document.getElementById('achievements-summary-note');

      if (unlockedSummary) unlockedSummary.textContent = `${unlockedCount} / ${total}`;
      if (matchesSummary) matchesSummary.textContent = formatLeaderboardNumber(counters.totalMatchesFinished);
      if (roundsSummary) roundsSummary.textContent = formatLeaderboardNumber(counters.totalRoundsPlayed);
      if (laughsSummary) laughsSummary.textContent = formatLeaderboardNumber(counters.totalLaughs);
      if (summaryNote) {
        summaryNote.textContent = unlockedCount ? '' : t('achievements.noneUnlocked');
        summaryNote.classList.toggle('hidden', unlockedCount > 0);
      }

      grid.innerHTML = '';
      definitions.forEach(definition => {
        const unlocked = achievementState.unlocked[definition.id] || null;
        const progress = getAchievementProgress(definition, counters);
        const currentProgress = progress.target > 0
          ? Math.min(progress.current, progress.target)
          : (progress.completed ? 1 : 0);

        const card = document.createElement('article');
        card.className = `achievement-card ${unlocked ? 'unlocked' : 'locked'}`;

        const icon = document.createElement('div');
        icon.className = 'achievement-icon';
        icon.textContent = definition.icon || '🏆';

        const title = document.createElement('div');
        title.className = 'achievement-title';
        title.textContent = getAchievementText(definition, 'title');

        const desc = document.createElement('div');
        desc.className = 'achievement-desc';
        desc.textContent = getAchievementText(definition, 'desc');

        const meta = document.createElement('div');
        meta.className = 'achievement-meta';
        meta.textContent = unlocked
          ? t('achievements.unlockedAt', { date: formatAchievementDate(unlocked.unlockedAt) })
          : t('achievements.locked');

        const progressEl = document.createElement('div');
        progressEl.className = 'achievement-progress';
        progressEl.textContent = progress.target > 0
          ? `${t('achievements.progressLabel')}: ${formatLeaderboardNumber(currentProgress)} / ${formatLeaderboardNumber(progress.target)}`
          : '';

        card.append(icon, title, desc, meta);
        if (progressEl.textContent) card.appendChild(progressEl);
        grid.appendChild(card);
      });
    }

    function resetAchievementsForDebugOnly() {
      achievementState = getDefaultAchievementState();
      saveAchievementState(achievementState);
      if (document.getElementById('screen-achievements')?.classList.contains('active')) {
        renderAchievementsScreen();
      }
    }

    function getDefaultCoreChallenges(locale = currentLanguage) {
      return normalizeChallenges(createCorePack().readingChallenges?.[locale] || []);
    }

    function getCoreJokesForCategory(category, locale = currentLanguage) {
      const bank = normalizeJokeBank(getCorePack().jokes?.[locale] || {});
      return bank[category] || [];
    }

    function getPremiumJokesForPack(pack, locale = currentLanguage) {
      const bank = normalizeJokeBank(pack?.jokes?.[locale] || {});
      let jokes = [];
      CATEGORY_KEYS.forEach(category => {
        jokes = normalizeJokeList([...jokes, ...(bank[category] || [])]);
      });
      return jokes;
    }

    function countWordsForCategoryToken(category, diff = 'easy') {
      const premiumPack = getPremiumPackByToken(category);
      if (premiumPack) return getPremiumJokesForPack(premiumPack).length;
      if (CATEGORY_KEYS.includes(category)) return getCoreJokesForCategory(category).length;
      return 0;
    }

    function countWordsForSelectedCategories(categories, diff = 'easy') {
      return (categories || []).reduce((total, category) => total + countWordsForCategoryToken(category, diff), 0);
    }

    function normalizeSelectedCategories(categories = []) {
      const selected = ensureUniqueWords(categories.map(category => String(category))).filter(isValidCategoryToken);
      return selected.length ? selected : getDefaultSelectedCategories();
    }

    function getDefaultTeamName(team, language = currentLanguage) {
      return t(`teams.default${team}`, {}, language);
    }

    function getDefaultPlayerName(number, language = currentLanguage) {
      return t('players.defaultName', { number }, language);
    }

    function isDefaultTeamName(name, team) {
      return SUPPORTED_LANGUAGES.some(language => name === getDefaultTeamName(team, language));
    }

    function getDefaultSelectedCategories() {
      return ['trocadilhos', 'cotidiano', 'tiozao'];
    }

    function getDefaultCurrentMatchAchievementStats() {
      return {
        roundsPlayed: 0,
        allRoundsLaughed: true
      };
    }

    function formatCount(count, singularKey, pluralKey) {
      return `${count} ${t(count === 1 ? singularKey : pluralKey)}`;
    }

    function parsePointValue(value, fallback = 0) {
      const parsed = Number.parseInt(value, 10);
      return Number.isFinite(parsed) ? Math.max(0, Math.min(999, parsed)) : fallback;
    }

    function getConfiguredCorrectPoints() {
      return parsePointValue(document.getElementById('correct-points-input')?.value, DEFAULT_CORRECT_POINTS);
    }

    function getConfiguredWrongPenaltyPoints() {
      return parsePointValue(document.getElementById('wrong-points-input')?.value, DEFAULT_WRONG_PENALTY_POINTS);
    }

    function isFfaGuesserPointsEnabled() {
      return false;
    }

    function getConfiguredFfaGuesserPoints() {
      return 0;
    }

    function addScore(scoreKey, delta) {
      if (!scoreKey || !Number.isFinite(delta) || delta === 0) return;
      gameState.scores[scoreKey] = (gameState.scores[scoreKey] || 0) + delta;
    }

    function getQuickGamePlayerCount(config) {
      return config.mode === 'teams'
        ? (config.teams.A?.length || 0) + (config.teams.B?.length || 0)
        : (config.players?.length || 0);
    }

    function getQuickGameSummary(config) {
      const normalized = normalizeQuickGameConfig(config);
      const modeLabel = normalized.mode === 'teams' ? t('setup.modeTeamsName') : t('setup.modeFfaName');
      const playerCountLabel = formatCount(getQuickGamePlayerCount(normalized), 'common.playerSingular', 'common.playerPlural');
      const categoriesLabel = normalized.selectedCategories.map(category => getCategoryLabel(category)).join(', ');
      const roundsLabel = formatCount(normalized.rounds, 'common.roundSingular', 'common.roundPlural');
      const challengeLabel = normalized.randomChallenge ? t('setup.randomChallengeLabel') : '';
      return [modeLabel, playerCountLabel, categoriesLabel, roundsLabel, challengeLabel].filter(Boolean).join(' | ');
    }

    function getQuickGameCategoryIcon(category) {
      if (getPremiumPackByToken(category)) return '⭐';
      return CATEGORY_ICONS[category] || '🏷️';
    }

    function getQuickGameCompactSummary(config) {
      const normalized = normalizeQuickGameConfig(config);
      const modeIcon = normalized.mode === 'teams' ? '🤝' : '🏆';
      const playerIcon = `👥${getQuickGamePlayerCount(normalized)}`;
      const categoryIcons = normalized.selectedCategories.map(getQuickGameCategoryIcon).join(' ');
      const roundsIcon = `🔁${normalized.rounds}`;
      const challengeIcon = normalized.randomChallenge ? '🎯' : '🚫';
      return [modeIcon, playerIcon, categoryIcons, roundsIcon, challengeIcon].filter(Boolean).join(' | ');
    }

    function renderQuickGameSummary() {
      const summary = document.getElementById('quick-game-summary');
      if (!summary) return;
      const config = loadQuickGameConfig();
      const fullSummary = getQuickGameSummary(config);
      summary.textContent = getQuickGameCompactSummary(config);
      summary.title = fullSummary;
      summary.setAttribute('aria-label', fullSummary);
      const button = summary.closest('button');
      if (button) button.title = fullSummary;
    }

    function getMultiDeviceHomeConnectionCount() {
      if (isHostSessionOpen()) return multiDeviceState.connections.filter(conn => conn.open).slice(0, 1).length;
      if (isGuestSessionOpen()) return 1;
      return 0;
    }

    function renderMultiDeviceHomeSummary() {
      const summary = document.getElementById('multi-device-summary');
      if (!summary) return;
      const isOnline = isHostSessionOpen() || isGuestSessionOpen();
      const count = getMultiDeviceHomeConnectionCount();
      const status = t(isOnline ? 'home.multiDeviceOnline' : 'home.multiDeviceOffline');
      const text = t('home.multiDeviceSummary', { status, count });
      const dot = document.createElement('span');
      dot.className = `connection-status-dot ${isOnline ? 'is-online' : 'is-offline'}`;
      dot.setAttribute('aria-hidden', 'true');
      summary.replaceChildren(dot, document.createTextNode(text));
      summary.title = text;
      summary.setAttribute('aria-label', text);
      const button = summary.closest('button');
      if (button) button.title = `${t('home.multiDeviceGame')} | ${text}`;
    }

    function syncTeamNamesForLanguage(previousLanguage, nextLanguage) {
      ['A', 'B'].forEach(team => {
        const previousDefault = getDefaultTeamName(team, previousLanguage);
        const nextDefault = getDefaultTeamName(team, nextLanguage);
        if (!gameState.teamNames[team] || gameState.teamNames[team] === previousDefault || isDefaultTeamName(gameState.teamNames[team], team)) {
          gameState.teamNames[team] = nextDefault;
        }
      });
    }

    function normalizeRandomChallengeSetting(value) {
      return typeof value === 'boolean' ? value : true;
    }

    let gameState = {
      gameType: 'mime',
      mode: 'teams',
      difficulty: 'easy',
      teams: { A: [], B: [] },
      players: [],
      teamNames: { A: getDefaultTeamName('A'), B: getDefaultTeamName('B') },
      scores: {},
      currentPlayerIdx: 0,
      currentRound: 1,
      totalRounds: 3,
      currentWord: null,
      currentChallenge: null,
      usedWords: [],
      timerDur: 60,
      prepareDur: 3,
      timerInterval: null,
      memInterval: null,
      memorizeLeft: 3,
      timerLeft: 60,
      phase: 'preparing',
      totalTurns: 0,
      turnsDone: 0,
      leaderboardRecorded: false,
      resultFeedback: null,
      achievementMatch: getDefaultCurrentMatchAchievementStats(),
      randomChallenge: true,
      selectedCategories: getDefaultSelectedCategories()
    };

    const multiDeviceState = {
      role: 'single',
      peer: null,
      peerId: '',
      hostPeerId: '',
      hostConnection: null,
      guestConnectionStatus: 'disconnected',
      connections: [],
      assignment: '',
      sessionUrl: '',
      lastPayload: null,
      wakeLock: null,
      guestReconnectTimer: 0,
      guestReconnectAttempt: 0,
      hostRecoveryTimer: 0,
      hostRecoveryAttempt: 0
    };
    const musicState = {
      audio: null,
      currentSrc: '',
      currentKind: '',
      unlocked: false
    };

    let deferredPWAInstallPrompt = null;
    let wbCat = 'trocadilhos';
    let wbPreviewPackId = '';
    let leaderboardFilters = { mode: 'all' };

    // ============================================================
    // STARS
    // ============================================================
    (function () {
      const c = document.getElementById('stars');
      for (let i = 0; i < 60; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        const sz = Math.random() * 2.5 + 0.5;
        s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;--d:${(Math.random() * 4 + 2).toFixed(1)}s;--del:${(Math.random() * 4).toFixed(1)}s;--op:${(Math.random() * 0.5 + 0.3).toFixed(2)}`;
        c.appendChild(s);
      }
    })();

    // ============================================================
    // I18N
    // ============================================================
    function applyTranslations() {
      document.documentElement.lang = LANGUAGE_HTML_MAP[currentLanguage] || LANGUAGE_HTML_MAP[DEFAULT_LANGUAGE];
      document.title = t('meta.documentTitle');

      document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
      });

      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.title = t(el.dataset.i18nTitle);
      });

      document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
      });

      const languageSelect = document.getElementById('language-select');
      if (languageSelect) languageSelect.value = currentLanguage;
    }

    function refreshLocalizedUI() {
      applyTranslations();
      refreshGameTypeUI();
      renderQuickGameSummary();
      renderMultiDeviceHomeSummary();
      updateTeamLabels();
      renderCategorySelection();
      renderSetupPlayers();
      updateDiffWordCount();
      renderWordBankCategorySelection();
      renderWordBank();
      renderChallengeBank();
      renderInstalledPacks();
      renderPackPreview();
      renderJokeRanking();
      renderAchievementsScreen();
      renderUserId();
      refreshCurrentTurnCopy();
      renderResultFeedback();
      refreshScoreScreenCopy();
      refreshFinalScreenCopy();
      renderScoreMini();
      if (document.getElementById('screen-leaderboard')?.classList.contains('active')) renderLeaderboard();
      if (document.getElementById('screen-achievements')?.classList.contains('active')) renderAchievementsScreen();
      if (document.getElementById('screen-score-manager')?.classList.contains('active')) renderScoreManager();
      if (document.getElementById('screen-guest')?.classList.contains('active') && multiDeviceState.lastPayload) {
        renderGuestSessionState(multiDeviceState.lastPayload);
      }
      renderGuestConnectionStatus();
      updateScoreManagerButton();
      updateTimerLabel(document.getElementById('timer-slider').value);
      updateFullscreenButton();
    }

    function setLanguage(language, options = {}) {
      const { save = false } = options;
      const nextLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
      const previousLanguage = currentLanguage;
      currentLanguage = nextLanguage;
      syncTeamNamesForLanguage(previousLanguage, nextLanguage);
      refreshLocalizedUI();
      setUserIdImportStatus();
      if (save) saveSettings();
    }

    // ============================================================
    // NAVIGATION
    // ============================================================
    function resetViewportToTop(screenEl) {
      if (screenEl) screenEl.scrollTop = 0;
      const scrollingElement = document.scrollingElement || document.documentElement;
      if (scrollingElement) {
        scrollingElement.scrollTop = 0;
        scrollingElement.scrollLeft = 0;
      }
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        if (screenEl) screenEl.scrollTop = 0;
        if (scrollingElement) {
          scrollingElement.scrollTop = 0;
          scrollingElement.scrollLeft = 0;
        }
        window.scrollTo(0, 0);
      });
    }

    function goTo(screen) {
      const nextScreen = document.getElementById('screen-' + screen);
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      nextScreen.classList.add('active');
      document.body.dataset.activeScreen = screen;
      if (screen === 'wordbank') {
        wbCat = 'trocadilhos';
        renderWordBankCategorySelection();
        renderWordBank();
        renderChallengeBank();
        renderInstalledPacks();
        renderPackPreview();
        renderJokeRanking();
      }
      if (screen === 'setup') {
        refreshGameTypeUI();
        renderSetupPlayers();
        updateDiffWordCount();
        renderCategorySelection();
      }
      if (screen === 'multidevice') {
        restoreMultiDeviceScreenState();
      }
      if (screen === 'leaderboard') {
        renderLeaderboard();
      }
      if (screen === 'achievements') {
        renderAchievementsScreen();
      }
      updateBackgroundMusic();
      resetViewportToTop(nextScreen);
      syncWakeLock(`screen-${screen}`);
    }

    function getFullscreenElement() {
      return document.fullscreenElement || document.webkitFullscreenElement || null;
    }

    function isFullscreenSupported() {
      const root = document.documentElement;
      const canRequest = Boolean(root.requestFullscreen || root.webkitRequestFullscreen);
      const canExit = Boolean(document.exitFullscreen || document.webkitExitFullscreen);
      const isEnabled = document.fullscreenEnabled !== false && document.webkitFullscreenEnabled !== false;
      return Boolean(canRequest && canExit && isEnabled);
    }

    function updateFullscreenButton() {
      const button = document.getElementById('fullscreen-toggle');
      if (!button) return;
      button.hidden = !isFullscreenSupported();
      const labelKey = getFullscreenElement() ? 'home.exitFullscreen' : 'home.enterFullscreen';
      const label = t(labelKey);
      button.title = label;
      button.setAttribute('aria-label', label);
    }

    async function toggleFullscreen() {
      if (!isFullscreenSupported()) {
        showNotif(t('notifications.fullscreenUnavailable'), 'var(--accent2)', 'var(--text)');
        return;
      }

      try {
        if (getFullscreenElement()) {
          const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen;
          await exitFullscreen.call(document);
        } else {
          const root = document.documentElement;
          const requestFullscreen = root.requestFullscreen || root.webkitRequestFullscreen;
          await requestFullscreen.call(root);
        }
      } catch (error) {
        showNotif(t('notifications.fullscreenUnavailable'), 'var(--accent2)', 'var(--text)');
      } finally {
        updateFullscreenButton();
      }
    }

    function isPWAStandalone() {
      return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
    }

    function updatePWAInstallButton() {
      const button = document.getElementById('pwa-install-button');
      if (!button) return;
      button.classList.toggle('hidden', !deferredPWAInstallPrompt || isPWAStandalone());
    }

    async function installPWA() {
      if (!deferredPWAInstallPrompt || isPWAStandalone()) {
        updatePWAInstallButton();
        return;
      }
      const promptEvent = deferredPWAInstallPrompt;
      deferredPWAInstallPrompt = null;
      updatePWAInstallButton();
      try {
        await promptEvent.prompt();
        await promptEvent.userChoice;
      } catch (e) { }
    }

    // ============================================================
    // WAKE LOCK
    // ============================================================
    function shouldKeepScreenAwake() {
      const activeScreen = document.body.dataset.activeScreen || 'home';
      if (!WAKE_LOCK_ACTIVE_SCREENS.includes(activeScreen)) return false;
      if (activeScreen === 'guest') return true;
      if (activeScreen === 'multidevice') return multiDeviceState.role !== 'single';
      if (multiDeviceState.role === 'host') return true;
      return Boolean(gameState.players.length && gameState.totalTurns);
    }

    async function releaseWakeLock() {
      const sentinel = multiDeviceState.wakeLock;
      multiDeviceState.wakeLock = null;
      if (!sentinel) return;
      try {
        await sentinel.release();
      } catch (e) { }
    }

    async function requestWakeLock(reason = 'screen-change') {
      if (!('wakeLock' in navigator) || document.hidden || !shouldKeepScreenAwake()) return;
      if (multiDeviceState.wakeLock && multiDeviceState.wakeLock.released === false) return;

      try {
        const sentinel = await navigator.wakeLock.request('screen');
        multiDeviceState.wakeLock = sentinel;
        sentinel.addEventListener('release', () => {
          if (multiDeviceState.wakeLock === sentinel) multiDeviceState.wakeLock = null;
          if (!document.hidden && shouldKeepScreenAwake()) {
            requestAnimationFrame(() => requestWakeLock(`${reason}-released`));
          }
        });
      } catch (e) { }
    }

    function syncWakeLock(reason = 'screen-change') {
      if (document.hidden || !shouldKeepScreenAwake()) {
        releaseWakeLock();
        return;
      }
      requestWakeLock(reason);
    }

    // ============================================================
    // MULTI DEVICE
    // ============================================================
    function isPeerAvailable() {
      return typeof window.Peer === 'function';
    }

    function saveGuestReconnectTarget(hostId) {
      if (!hostId) return;
      try {
        localStorage.setItem(MULTI_DEVICE_GUEST_RESUME_KEY, JSON.stringify({
          hostId,
          savedAt: Date.now()
        }));
      } catch (e) { }
    }

    function loadGuestReconnectTarget() {
      try {
        const raw = localStorage.getItem(MULTI_DEVICE_GUEST_RESUME_KEY);
        if (!raw) return '';
        const parsed = JSON.parse(raw);
        const hostId = extractSessionCode(parsed?.hostId || '');
        const savedAt = Number(parsed?.savedAt) || 0;
        if (!hostId || !savedAt || (Date.now() - savedAt) > MULTI_DEVICE_GUEST_RESUME_TTL_MS) {
          localStorage.removeItem(MULTI_DEVICE_GUEST_RESUME_KEY);
          return '';
        }
        return hostId;
      } catch (e) {
        return '';
      }
    }

    function clearGuestReconnectTarget() {
      try {
        localStorage.removeItem(MULTI_DEVICE_GUEST_RESUME_KEY);
      } catch (e) { }
    }

    function clearGuestReconnectTimer() {
      if (!multiDeviceState.guestReconnectTimer) return;
      window.clearTimeout(multiDeviceState.guestReconnectTimer);
      multiDeviceState.guestReconnectTimer = 0;
    }

    function clearHostRecoveryTimer() {
      if (!multiDeviceState.hostRecoveryTimer) return;
      window.clearTimeout(multiDeviceState.hostRecoveryTimer);
      multiDeviceState.hostRecoveryTimer = 0;
    }

    function setJoinStatus(keyOrText) {
      const el = document.getElementById('multidevice-join-status');
      if (!el) return;
      el.textContent = keyOrText.includes('.') ? t(keyOrText) : keyOrText;
    }

    function setHostStatus(keyOrText) {
      const el = document.getElementById('multidevice-host-status');
      if (!el) return;
      el.textContent = keyOrText.includes('.') ? t(keyOrText) : keyOrText;
    }

    function renderGuestConnectionStatus() {
      const el = document.getElementById('guest-connection-status');
      if (!el) return;
      const statusKey = multiDeviceState.guestConnectionStatus === 'connected'
        ? 'multiDevice.online'
        : multiDeviceState.guestConnectionStatus === 'disconnected'
          ? 'multiDevice.offline'
          : 'multiDevice.connecting';
      el.textContent = t(statusKey);
      el.dataset.connectionStatus = multiDeviceState.guestConnectionStatus;
      const reconnectButton = document.getElementById('guest-reconnect-button');
      if (reconnectButton) {
        const shouldShowReconnect = multiDeviceState.role === 'guest'
          && multiDeviceState.guestConnectionStatus === 'disconnected'
          && Boolean(multiDeviceState.hostPeerId);
        reconnectButton.classList.toggle('hidden', !shouldShowReconnect);
      }
    }

    function setGuestConnectionStatus(status) {
      multiDeviceState.guestConnectionStatus = status;
      renderGuestConnectionStatus();
    }

    function getSessionUrl(peerId) {
      const url = new URL(window.location.href);
      url.search = '';
      url.hash = '';
      url.searchParams.set('join', peerId);
      return url.toString();
    }

    function extractSessionCode(value = '') {
      const raw = String(value).trim();
      if (!raw) return '';
      try {
        const url = new URL(raw, window.location.href);
        const join = url.searchParams.get('join');
        if (join) return join.trim();
      } catch (e) { }
      return raw.replace(/^#?join=/i, '').trim();
    }

    function renderSessionQRCode(url) {
      const host = document.getElementById('multidevice-qr');
      if (!host) return;
      host.innerHTML = '';
      if (typeof window.QRCode !== 'function') {
        host.textContent = t('multiDevice.qrUnavailable');
        return;
      }
      new window.QRCode(host, {
        text: url,
        width: 168,
        height: 168,
        colorDark: '#111827',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel?.M
      });
    }

    function updateHostGuestCount() {
      const count = multiDeviceState.connections.filter(conn => conn.open).slice(0, 1).length;
      const el = document.getElementById('multidevice-guest-count');
      if (el) el.textContent = t('multiDevice.guestsConnected', { count });
      renderMultiDeviceHomeSummary();
      renderCompanionAssignmentControl();
    }

    function closeCurrentPeer(options = {}) {
      const { nextRole = 'single', keepLastPayload = false } = options;
      const preservedLastPayload = keepLastPayload ? multiDeviceState.lastPayload : null;
      clearGuestReconnectTimer();
      clearHostRecoveryTimer();
      try {
        multiDeviceState.connections.forEach(conn => conn.close?.());
        multiDeviceState.hostConnection?.close?.();
        multiDeviceState.peer?.destroy?.();
      } catch (e) { }
      multiDeviceState.role = nextRole;
      multiDeviceState.peer = null;
      multiDeviceState.hostConnection = null;
      multiDeviceState.guestConnectionStatus = 'disconnected';
      multiDeviceState.connections = [];
      multiDeviceState.peerId = '';
      multiDeviceState.hostPeerId = '';
      multiDeviceState.sessionUrl = '';
      multiDeviceState.lastPayload = preservedLastPayload;
      renderMultiDeviceHomeSummary();
      renderGuestConnectionStatus();
      syncWakeLock('peer-closed');
    }

    function isCurrentPeerOpen() {
      const peer = multiDeviceState.peer;
      return Boolean(peer && !peer.destroyed && peer.disconnected !== true);
    }

    function isHostSessionOpen() {
      return multiDeviceState.role === 'host' && isCurrentPeerOpen() && Boolean(multiDeviceState.peerId && multiDeviceState.sessionUrl);
    }

    function isGuestSessionOpen() {
      return multiDeviceState.role === 'guest' && isCurrentPeerOpen() && Boolean(multiDeviceState.hostConnection?.open);
    }

    function resetMultiDeviceChoice() {
      document.getElementById('multidevice-choice-card')?.classList.remove('hidden');
      document.getElementById('multidevice-host-card')?.classList.add('hidden');
      document.getElementById('multidevice-host-panel')?.classList.add('hidden');
      document.getElementById('multidevice-join-card')?.classList.add('hidden');
    }

    function selectMultiDeviceMode(mode) {
      document.getElementById('multidevice-choice-card')?.classList.add('hidden');
      document.getElementById('multidevice-host-card')?.classList.toggle('hidden', mode !== 'host');
      document.getElementById('multidevice-host-panel')?.classList.add('hidden');
      document.getElementById('multidevice-join-card')?.classList.toggle('hidden', mode !== 'join');
      if (mode === 'join') {
        requestAnimationFrame(() => document.getElementById('multidevice-join-code')?.focus());
      }
    }

    function showExistingHostSession() {
      selectMultiDeviceMode('host');
      document.getElementById('multidevice-host-panel')?.classList.remove('hidden');
      document.getElementById('multidevice-session-code').textContent = multiDeviceState.peerId;
      document.getElementById('multidevice-link').value = multiDeviceState.sessionUrl;
      renderSessionQRCode(multiDeviceState.sessionUrl);
      setHostStatus(isHostSessionOpen() ? 'multiDevice.hostReady' : 'multiDevice.reconnecting');
      updateHostGuestCount();
    }

    function showExistingGuestSession() {
      selectMultiDeviceMode('join');
      const input = document.getElementById('multidevice-join-code');
      const hostCode = multiDeviceState.hostPeerId || multiDeviceState.hostConnection?.peer || '';
      if (input) input.value = hostCode;
      setJoinStatus(multiDeviceState.guestConnectionStatus === 'connected'
        ? 'multiDevice.connected'
        : 'multiDevice.reconnecting');
    }

    function restoreMultiDeviceScreenState() {
      if (isHostSessionOpen()) {
        showExistingHostSession();
        return;
      }
      if (multiDeviceState.role === 'host' && multiDeviceState.peerId) {
        showExistingHostSession();
        return;
      }
      if (isGuestSessionOpen()) {
        showExistingGuestSession();
        return;
      }
      if (multiDeviceState.role === 'guest' && multiDeviceState.hostPeerId) {
        showExistingGuestSession();
        return;
      }
      resetMultiDeviceChoice();
    }

    function disconnectGuestSession() {
      clearGuestReconnectTarget();
      multiDeviceState.guestReconnectAttempt = 0;
      closeCurrentPeer();
      setGuestConnectionStatus('disconnected');
      document.getElementById('guest-round-title').textContent = t('multiDevice.waitingTitle');
      document.getElementById('guest-current-player-label').textContent = t('multiDevice.guestWaiting');
      document.getElementById('guest-current-player-name').textContent = '--';
      document.getElementById('guest-joke-card')?.classList.add('hidden');
      document.getElementById('guest-timer-card')?.classList.remove('hidden');
      updateGuestTimerDisplay(NaN, 1);
      goTo('home');
    }

    function scheduleGuestReconnect(reason = 'connection-lost') {
      if (multiDeviceState.role !== 'guest' || !multiDeviceState.hostPeerId) return;
      clearGuestReconnectTimer();
      setJoinStatus('multiDevice.reconnecting');
      const delay = Math.min(1000 * (multiDeviceState.guestReconnectAttempt + 1), MULTI_DEVICE_RECONNECT_MAX_DELAY_MS);
      multiDeviceState.guestReconnectTimer = window.setTimeout(() => {
        connectToMultiDeviceHost(multiDeviceState.hostPeerId, { isAutoReconnect: true, reason });
      }, delay);
    }

    function scheduleHostRecovery(reason = 'connection-lost') {
      if (multiDeviceState.role !== 'host' || !multiDeviceState.peerId) return;
      clearHostRecoveryTimer();
      setHostStatus('multiDevice.reconnecting');
      const delay = Math.min(1000 * (multiDeviceState.hostRecoveryAttempt + 1), MULTI_DEVICE_RECONNECT_MAX_DELAY_MS);
      multiDeviceState.hostRecoveryTimer = window.setTimeout(() => {
        createMultiDeviceHost({
          preferredPeerId: multiDeviceState.peerId,
          isRecovery: true,
          reason
        });
      }, delay);
    }

    function sendToGuest(conn, message) {
      if (!conn?.open) return;
      try {
        conn.send(message);
      } catch (e) { }
    }

    function broadcastMultiDeviceMessage(message) {
      if (multiDeviceState.role !== 'host') return;
      multiDeviceState.connections = multiDeviceState.connections.filter(conn => conn.open);
      multiDeviceState.connections.forEach(conn => sendToGuest(conn, message));
      updateHostGuestCount();
    }

    function getCurrentPlayerForGuest() {
      const player = gameState.players[gameState.currentPlayerIdx];
      if (!player) return { name: '--', teamLabel: '' };
      return {
        name: player.name || player,
        teamLabel: player.team ? (gameState.teamNames[player.team] || getDefaultTeamName(player.team)) : ''
      };
    }

    function getGuestStatusKey(phase = 'waiting') {
      if (phase === 'preparing') return 'guestPreparing';
      if (phase === 'memorizing') return 'guestMemorizing';
      if (phase === 'playing') return 'guestPlaying';
      if (phase === 'score') return 'guestScore';
      if (phase === 'final') return 'guestFinal';
      return 'guestWaiting';
    }

    function buildHostGamePayload() {
      const hasStarted = Boolean(gameState.players.length && gameState.totalTurns);
      const phase = hasStarted ? gameState.phase : 'waiting';
      const currentPlayer = getCurrentPlayerForGuest();
      const isMemorizing = phase === 'memorizing';
      const isPlaying = phase === 'playing';
      const showJokeOnCompanion = shouldPresentJokeOnCompanion();
      const payload = {
        phase,
        gameType: gameState.gameType,
        timerLeft: isMemorizing
          ? gameState.memorizeLeft
          : (isPlaying ? gameState.timerLeft : gameState.timerDur),
        timerDur: isMemorizing ? gameState.prepareDur : gameState.timerDur,
        currentRound: hasStarted ? gameState.currentRound : 0,
        totalRounds: hasStarted ? gameState.totalRounds : 0,
        deviceMode: showJokeOnCompanion ? 'joke' : 'timer',
        statusKey: getGuestStatusKey(phase),
        currentPlayerName: currentPlayer.name,
        teamLabel: currentPlayer.teamLabel,
        jokeText: showJokeOnCompanion ? (gameState.currentWord?.word || '') : '',
        challengeText: showJokeOnCompanion ? (gameState.currentChallenge || '') : ''
      };
      return payload;
    }

    function broadcastHostGameState(options = {}) {
      if (multiDeviceState.role !== 'host') return;
      const payload = buildHostGamePayload(options);
      multiDeviceState.lastPayload = payload;
      broadcastMultiDeviceMessage({ type: 'session-state', payload });
    }

    function attachHostConnection(conn) {
      const existing = multiDeviceState.connections.find(item => item.open);
      if (existing && existing !== conn) {
        try {
          existing.close?.();
        } catch (e) { }
      }
      multiDeviceState.connections = [conn];
      const syncGuest = () => {
        updateHostGuestCount();
        refreshCurrentTurnCopy();
        sendToGuest(conn, { type: 'session-state', payload: buildHostGamePayload() });
      };
      conn.on('open', syncGuest);
      conn.on('close', () => {
        multiDeviceState.connections = multiDeviceState.connections.filter(item => item !== conn && item.open);
        updateHostGuestCount();
        refreshCurrentTurnCopy();
        broadcastHostGameState();
      });
      conn.on('error', () => {
        multiDeviceState.connections = multiDeviceState.connections.filter(item => item !== conn && item.open);
        updateHostGuestCount();
      });
      conn.on('data', data => {
        if (data?.type === 'guest-ready') syncGuest();
      });
      setTimeout(syncGuest, 200);
    }

    function createMultiDeviceHost(options = {}) {
      const { preferredPeerId = '', isRecovery = false } = options;
      if (!isPeerAvailable()) {
        showNotif(t('multiDevice.peerUnavailable'), 'var(--accent1)', 'var(--btn-danger-text)');
        return;
      }

      const previousPeerId = preferredPeerId || multiDeviceState.peerId;
      const previousSessionUrl = previousPeerId ? getSessionUrl(previousPeerId) : multiDeviceState.sessionUrl;
      closeCurrentPeer({ nextRole: 'host' });
      multiDeviceState.peerId = previousPeerId || '';
      multiDeviceState.sessionUrl = previousSessionUrl || '';
      document.getElementById('multidevice-host-panel')?.classList.remove('hidden');
      setHostStatus(isRecovery ? 'multiDevice.reconnecting' : 'multiDevice.hostCreating');
      updateHostGuestCount();
      syncWakeLock('host-session-start');

      const peer = previousPeerId ? new window.Peer(previousPeerId) : new window.Peer();
      multiDeviceState.peer = peer;
      peer.on('open', id => {
        if (multiDeviceState.peer !== peer) return;
        clearHostRecoveryTimer();
        multiDeviceState.hostRecoveryAttempt = 0;
        multiDeviceState.peerId = id;
        multiDeviceState.sessionUrl = getSessionUrl(id);
        document.getElementById('multidevice-session-code').textContent = id;
        document.getElementById('multidevice-link').value = multiDeviceState.sessionUrl;
        renderSessionQRCode(multiDeviceState.sessionUrl);
        setHostStatus('multiDevice.hostReady');
        renderMultiDeviceHomeSummary();
        broadcastHostGameState();
      });
      peer.on('connection', conn => {
        if (multiDeviceState.peer !== peer) {
          try {
            conn.close?.();
          } catch (e) { }
          return;
        }
        attachHostConnection(conn);
      });
      peer.on('disconnected', () => {
        if (multiDeviceState.peer !== peer || multiDeviceState.role !== 'host') return;
        multiDeviceState.hostRecoveryAttempt += 1;
        renderMultiDeviceHomeSummary();
        scheduleHostRecovery('peer-disconnected');
      });
      peer.on('close', () => {
        if (multiDeviceState.peer !== peer || multiDeviceState.role !== 'host') return;
        multiDeviceState.hostRecoveryAttempt += 1;
        renderMultiDeviceHomeSummary();
        scheduleHostRecovery('peer-closed');
      });
      peer.on('error', () => {
        if (multiDeviceState.peer !== peer || multiDeviceState.role !== 'host') return;
        multiDeviceState.hostRecoveryAttempt += 1;
        renderMultiDeviceHomeSummary();
        if (isRecovery) {
          scheduleHostRecovery('peer-error');
          return;
        }
        setHostStatus('multiDevice.hostError');
        showNotif(t('multiDevice.hostError'), 'var(--accent1)', 'var(--btn-danger-text)');
      });
    }

    function connectToMultiDeviceHost(rawCode, options = {}) {
      const { isAutoReconnect = false } = options;
      const hostId = extractSessionCode(rawCode);
      if (!hostId) {
        setJoinStatus('multiDevice.missingSession');
        return;
      }
      if (!isPeerAvailable()) {
        setJoinStatus('multiDevice.peerUnavailable');
        showNotif(t('multiDevice.peerUnavailable'), 'var(--accent1)', 'var(--btn-danger-text)');
        return;
      }

      if (multiDeviceState.role === 'guest' && multiDeviceState.hostPeerId === hostId && isGuestSessionOpen()) {
        sendToGuest(multiDeviceState.hostConnection, { type: 'guest-ready' });
        return;
      }

      closeCurrentPeer({ nextRole: 'guest', keepLastPayload: isAutoReconnect });
      multiDeviceState.hostPeerId = hostId;
      multiDeviceState.guestReconnectAttempt = isAutoReconnect ? multiDeviceState.guestReconnectAttempt : 0;
      saveGuestReconnectTarget(hostId);
      setJoinStatus(isAutoReconnect ? 'multiDevice.reconnecting' : 'multiDevice.connecting');
      setGuestConnectionStatus('connecting');
      syncWakeLock('guest-session-start');
      if (!document.getElementById('screen-guest')?.classList.contains('active')) goTo('guest');

      const peer = new window.Peer();
      multiDeviceState.peer = peer;
      peer.on('open', () => {
        if (multiDeviceState.peer !== peer) return;
        const conn = peer.connect(hostId, { reliable: true });
        multiDeviceState.hostConnection = conn;
        attachGuestConnection(conn);
      });
      peer.on('disconnected', () => {
        if (multiDeviceState.peer !== peer || multiDeviceState.role !== 'guest') return;
        setGuestConnectionStatus('disconnected');
        renderMultiDeviceHomeSummary();
        multiDeviceState.guestReconnectAttempt += 1;
        scheduleGuestReconnect('peer-disconnected');
      });
      peer.on('close', () => {
        if (multiDeviceState.peer !== peer || multiDeviceState.role !== 'guest') return;
        setGuestConnectionStatus('disconnected');
        renderMultiDeviceHomeSummary();
        multiDeviceState.guestReconnectAttempt += 1;
        scheduleGuestReconnect('peer-closed');
      });
      peer.on('error', () => {
        if (multiDeviceState.peer !== peer || multiDeviceState.role !== 'guest') return;
        setGuestConnectionStatus('disconnected');
        renderMultiDeviceHomeSummary();
        multiDeviceState.guestReconnectAttempt += 1;
        scheduleGuestReconnect('peer-error');
      });
    }

    function attachGuestConnection(conn) {
      conn.on('open', () => {
        if (multiDeviceState.hostConnection !== conn) return;
        clearGuestReconnectTimer();
        multiDeviceState.guestReconnectAttempt = 0;
        setGuestConnectionStatus('connected');
        setJoinStatus('multiDevice.connected');
        renderMultiDeviceHomeSummary();
        sendToGuest(conn, { type: 'guest-ready' });
      });
      conn.on('data', handleGuestMessage);
      conn.on('close', () => {
        if (multiDeviceState.hostConnection !== conn) return;
        multiDeviceState.hostConnection = null;
        setGuestConnectionStatus('disconnected');
        renderMultiDeviceHomeSummary();
        multiDeviceState.guestReconnectAttempt += 1;
        scheduleGuestReconnect('connection-closed');
      });
      conn.on('error', () => {
        if (multiDeviceState.hostConnection !== conn) return;
        multiDeviceState.hostConnection = null;
        setGuestConnectionStatus('disconnected');
        renderMultiDeviceHomeSummary();
        multiDeviceState.guestReconnectAttempt += 1;
        scheduleGuestReconnect('connection-error');
      });
    }

    function handleGuestMessage(message) {
      if (message?.type === 'session-state') {
        renderGuestSessionState(message.payload || {});
      }
    }

    function updateGuestTimerDisplay(left, total) {
      const num = document.getElementById('guest-timer-num');
      const circle = document.getElementById('guest-timer-circle');
      if (!num || !circle) return;
      const safeTotal = Math.max(1, Number(total) || 1);
      const safeLeft = Math.max(0, Number(left) || 0);
      num.textContent = Number.isFinite(Number(left)) ? safeLeft : '--';
      circle.style.strokeDashoffset = 427.3 - (safeLeft / safeTotal) * 427.3;
      circle.style.stroke = safeLeft > safeTotal * 0.5
        ? getThemeVar('--timer-color-safe')
        : safeLeft > safeTotal * 0.25
          ? getThemeVar('--timer-color-warning')
          : getThemeVar('--timer-color-danger');
    }

    function getGuestRoundText(payload = {}) {
      const current = Number.parseInt(payload.currentRound, 10);
      const total = Number.parseInt(payload.totalRounds, 10);
      if (payload.phase !== 'waiting' && current > 0 && total > 0) {
        return t('dynamic.roundDisplay', { current, total });
      }
      return t('multiDevice.waitingTitle');
    }

    function getGuestStatusText(payload = {}) {
      const statusKey = payload.statusKey || getGuestStatusKey(payload.phase);
      return t(`multiDevice.${statusKey}`);
    }

    function renderGuestSessionState(payload) {
      multiDeviceState.lastPayload = payload;
      if (!document.getElementById('screen-guest').classList.contains('active')) goTo('guest');
      document.getElementById('guest-round-title').textContent = getGuestRoundText(payload);
      const shouldShowJoke = payload.deviceMode === 'joke' && Boolean(payload.jokeText);
      document.getElementById('guest-current-player-label').textContent = shouldShowJoke
        ? t('multiDevice.guestJokeTurn')
        : getGuestStatusText(payload);
      document.getElementById('guest-current-player-name').textContent = payload.phase === 'waiting' ? '--' : (payload.currentPlayerName || '--');
      updateGuestTimerDisplay(payload.timerLeft, payload.timerDur);

      const timerCard = document.getElementById('guest-timer-card');
      const jokeCard = document.getElementById('guest-joke-card');
      const challengeEl = document.getElementById('guest-challenge-display');
      const challengeTextEl = document.getElementById('guest-challenge-text');
      timerCard?.classList.toggle('hidden', shouldShowJoke);
      jokeCard?.classList.toggle('hidden', !shouldShowJoke);
      if (shouldShowJoke) {
        document.getElementById('guest-word-display').textContent = payload.jokeText || '---';
        if (payload.challengeText) {
          if (challengeTextEl) challengeTextEl.textContent = payload.challengeText;
          challengeEl?.classList.remove('hidden');
        } else {
          challengeEl?.classList.add('hidden');
        }
      } else {
        challengeEl?.classList.add('hidden');
      }
      syncJokeTextSizing();
    }

    async function copyMultiDeviceLink() {
      if (!multiDeviceState.sessionUrl) return;
      try {
        await copyTextToClipboard(multiDeviceState.sessionUrl);
        showNotif(t('multiDevice.linkCopied'));
      } catch (e) {
        showNotif(t('notifications.shareCopyFailed'), 'var(--accent2)', 'var(--text)');
      }
    }

    function initializeMultiDeviceJoinFromUrl() {
      const urlCode = new URL(window.location.href).searchParams.get('join');
      const savedCode = loadGuestReconnectTarget();
      const code = urlCode || savedCode;
      if (!code) return;
      const input = document.getElementById('multidevice-join-code');
      if (input) input.value = code;
      selectMultiDeviceMode('join');
      connectToMultiDeviceHost(code, { isAutoReconnect: Boolean(savedCode && !urlCode) });
    }

    function refreshMultiDevicePresence(reason = 'resume') {
      if (multiDeviceState.role === 'guest') {
        if (isGuestSessionOpen()) {
          clearGuestReconnectTimer();
          sendToGuest(multiDeviceState.hostConnection, { type: 'guest-ready' });
          return;
        }
        if (multiDeviceState.hostPeerId) {
          connectToMultiDeviceHost(multiDeviceState.hostPeerId, { isAutoReconnect: true, reason });
        }
        return;
      }

      if (multiDeviceState.role === 'host') {
        if (isHostSessionOpen()) {
          clearHostRecoveryTimer();
          broadcastHostGameState();
          return;
        }
        if (multiDeviceState.peerId) {
          createMultiDeviceHost({
            preferredPeerId: multiDeviceState.peerId,
            isRecovery: true,
            reason
          });
        }
      }
    }

    function getThemeVar(name) {
      return getComputedStyle(document.body).getPropertyValue(name).trim();
    }

    // ============================================================
    // NOTIFICATIONS
    // ============================================================
    function showNotif(msg, color = 'var(--accent3)', textColor = 'var(--notif-text)') {
      const el = document.getElementById('notif');
      el.textContent = msg;
      el.style.background = color;
      el.style.color = textColor;
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), 2400);
    }

    function renderUserId() {
      const input = document.getElementById('user-id-display');
      if (input) input.value = appUserId;
    }

    function setUserIdImportStatus(message = '', type = '') {
      const el = document.getElementById('user-id-import-status');
      if (!el) return;
      el.textContent = message;
      el.classList.remove('success', 'error');
      if (type) el.classList.add(type);
    }

    function isValidImportedUserId(userId) {
      return typeof userId === 'string'
        && userId.length >= 8
        && userId.length <= 160
        && /^[A-Za-z0-9._:-]+$/.test(userId);
    }

    function createUserIdBackupEnvelope(userId = appUserId) {
      return {
        schema: USER_ID_BACKUP_SCHEMA,
        app: 'NaoPodeRir',
        version: 1,
        exported_at: new Date().toISOString(),
        user_id: userId
      };
    }

    function downloadJsonFile(filename, payload) {
      const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 0);
    }

    function exportUserId() {
      const dateToken = new Date().toISOString().slice(0, 10);
      downloadJsonFile(`nao-pode-rir-user-id-${dateToken}.json`, createUserIdBackupEnvelope());
      setUserIdImportStatus(t('notifications.userIdExported'), 'success');
      showNotif(t('notifications.userIdExported'));
    }

    function selectUserIdFile() {
      const input = document.getElementById('user-id-file-input');
      if (!input) return;
      input.value = '';
      input.click();
    }

    async function parseUserIdFile(file) {
      if (!file) throw new Error(t('userIdErrors.fileRequired'));
      let envelope;
      try {
        envelope = JSON.parse(await file.text());
      } catch (error) {
        throw new Error(t('userIdErrors.invalidJson'));
      }

      if (!envelope || typeof envelope !== 'object' || envelope.schema !== USER_ID_BACKUP_SCHEMA) {
        throw new Error(t('userIdErrors.invalidSchema'));
      }
      if (!isValidImportedUserId(envelope.user_id)) {
        throw new Error(t('userIdErrors.invalidUserId'));
      }
      return envelope;
    }

    async function importUserIdFile(file) {
      setUserIdImportStatus(t('notifications.packInstallReading'));
      const envelope = await parseUserIdFile(file);
      const importedUserId = envelope.user_id;

      if (importedUserId !== appUserId) {
        const shouldReplace = confirm(t('confirmations.replaceUserId', {
          currentUserId: appUserId,
          importedUserId
        }));
        if (!shouldReplace) {
          setUserIdImportStatus(t('notifications.userIdImportCancelled'));
          return null;
        }
      }

      appUserId = importedUserId;
      localStorage.setItem(USER_ID_KEY, appUserId);
      renderUserId();
      setUserIdImportStatus(t('notifications.userIdImported'), 'success');
      showNotif(t('notifications.userIdImported'));
      return appUserId;
    }

    async function handleUserIdFileSelection(file) {
      try {
        await importUserIdFile(file);
      } catch (error) {
        const message = error?.message || t('userIdErrors.invalidJson');
        setUserIdImportStatus(message, 'error');
        showNotif(message, 'var(--accent2)', 'var(--text)');
      }
    }

    async function copyUserId() {
      try {
        await navigator.clipboard.writeText(appUserId);
        showNotif(t('notifications.userIdCopied'));
      } catch (e) {
        const input = document.getElementById('user-id-display');
        input?.select();
        document.execCommand?.('copy');
        showNotif(t('notifications.userIdCopied'));
      }
    }

    function setPackInstallStatus(message = '', type = '') {
      const el = document.getElementById('pack-install-status');
      if (!el) return;
      el.textContent = message;
      el.classList.remove('success', 'error');
      if (type) el.classList.add(type);
    }

    function renderInstalledPacks() {
      const container = document.getElementById('installed-packs-list');
      if (!container) return;
      const installedPacks = (contentModel.packs || []).filter(pack => pack.source === 'downloaded');
      container.innerHTML = '';

      if (!installedPacks.length) {
        const empty = document.createElement('div');
        empty.className = 'installed-pack-empty';
        empty.textContent = t('wordbank.noInstalledPacks');
        container.appendChild(empty);
        return;
      }

      installedPacks.forEach(pack => {
        const row = document.createElement('div');
        row.className = 'installed-pack-row';
        if (pack.id === wbPreviewPackId) row.classList.add('selected');
        row.dataset.packPreviewId = pack.id;
        const name = getPackDisplayName(pack);
        const wordsCount = getPackWordCount(pack);
        const version = pack.version ? ` · ${t('dynamic.packVersion', { version: pack.version })}` : '';
        const info = document.createElement('div');
        const nameEl = document.createElement('div');
        nameEl.className = 'installed-pack-name';
        nameEl.textContent = name;
        const metaEl = document.createElement('div');
        metaEl.className = 'installed-pack-meta';
        metaEl.textContent = `${t('dynamic.packWordsSummary', { count: wordsCount })}${version}`;
        info.append(nameEl, metaEl);

        const actions = document.createElement('div');
        actions.className = 'installed-pack-actions';
        const toggleButton = document.createElement('button');
        toggleButton.className = 'btn btn-ghost btn-sm';
        toggleButton.dataset.action = 'toggle-installed-pack';
        toggleButton.dataset.packId = pack.id;
        toggleButton.textContent = pack.enabled === false ? t('wordbank.packDisabled') : t('wordbank.packEnabled');
        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-ghost btn-sm';
        removeButton.dataset.action = 'remove-installed-pack';
        removeButton.dataset.packId = pack.id;
        removeButton.textContent = t('wordbank.removePack');
        actions.append(toggleButton, removeButton);
        row.append(info, actions);
        container.appendChild(row);
      });
    }

    function getInstalledPackById(packId) {
      return (contentModel.packs || []).find(pack => pack.id === packId && pack.source === 'downloaded') || null;
    }

    function getPackPreviewWordEntries(pack, locale = currentLanguage) {
      const bank = normalizeJokeBank(pack?.jokes?.[locale] || {});
      const entries = [];
      CATEGORY_KEYS.forEach(category => {
        (bank[category] || []).forEach(joke => {
          const text = getJokeText(joke);
          if (text) entries.push({ word: text, category });
        });
      });
      return entries;
    }

    function renderPreviewItems(container, entries, emptyMessage, formatter, className = '') {
      if (!container) return;
      container.innerHTML = '';
      if (!entries.length) {
        const empty = document.createElement('div');
        empty.className = 'pack-preview-empty';
        empty.textContent = emptyMessage;
        container.appendChild(empty);
        return;
      }

      entries.forEach(entry => {
        const item = document.createElement('div');
        item.className = ['pack-preview-item', className].filter(Boolean).join(' ');
        item.textContent = formatter(entry);
        container.appendChild(item);
      });
    }

    function renderPackPreview() {
      const subtitle = document.getElementById('pack-preview-subtitle');
      const wordsContainer = document.getElementById('pack-preview-words');
      const challengesContainer = document.getElementById('pack-preview-challenges');
      if (!subtitle || !wordsContainer || !challengesContainer) return;

      const pack = getInstalledPackById(wbPreviewPackId);
      if (!pack) {
        subtitle.textContent = t('wordbank.packPreviewPrompt');
        renderPreviewItems(wordsContainer, [], t('wordbank.packPreviewNoWords'), item => item, 'pack-preview-item-joke');
        renderPreviewItems(challengesContainer, [], t('wordbank.packPreviewNoChallenges'), item => item, 'pack-preview-item-challenge');
        return;
      }

      subtitle.textContent = t('wordbank.packPreviewSelected', { name: getPackDisplayName(pack) });
      const wordEntries = getPackPreviewWordEntries(pack);
      const challenges = normalizeChallenges(pack.readingChallenges?.[currentLanguage] || []);
      renderPreviewItems(
        wordsContainer,
        wordEntries,
        t('wordbank.packPreviewNoWords'),
        entry => entry.word,
        'pack-preview-item-joke'
      );
      renderPreviewItems(
        challengesContainer,
        challenges,
        t('wordbank.packPreviewNoChallenges'),
        challenge => `🎯 ${challenge}`,
        'pack-preview-item-challenge'
      );
    }

    function selectPreviewPack(packId) {
      wbPreviewPackId = packId;
      renderInstalledPacks();
      renderPackPreview();
    }

    function getRenderableJokesMap(locale = currentLanguage) {
      const jokesMap = {};
      (contentModel.packs || []).forEach(pack => {
        const bank = normalizeJokeBank(pack?.jokes?.[locale] || {});
        CATEGORY_KEYS.forEach(category => {
          (bank[category] || []).forEach(joke => {
            const text = getJokeText(joke);
            if (!text) return;
            const jokeEntry = {
              id: joke.id,
              word: text,
              text,
              cat: category,
              category,
              packId: pack.id,
              locale
            };
            const jokeKey = getJokeKey(jokeEntry);
            if (jokeKey) jokesMap[jokeKey] = jokeEntry;
          });
        });
      });
      return jokesMap;
    }

    function renderJokeRanking() {
      const container = document.getElementById('joke-ranking-list');
      if (!container) return;

      const jokesMap = getRenderableJokesMap(currentLanguage);
      const rankedJokes = Object.entries(loadJokeStats())
        .map(([jokeKey, entry]) => {
          const joke = jokesMap[jokeKey];
          if (!joke) return null;
          const summary = buildJokeRatingSummary(entry);
          if (summary.ratingCount <= 0) return null;
          return {
            ...joke,
            ...summary
          };
        })
        .filter(Boolean)
        .sort((a, b) => (
          b.averageRating - a.averageRating
          || b.laughs - a.laughs
          || b.timesPlayed - a.timesPlayed
          || a.word.localeCompare(b.word, currentLanguage)
        ))
        .slice(0, 10);

      container.innerHTML = '';
      if (!rankedJokes.length) {
        const empty = document.createElement('div');
        empty.className = 'joke-ranking-empty';
        empty.textContent = t('wordbank.jokeRankingEmpty');
        container.appendChild(empty);
        return;
      }

      rankedJokes.forEach((joke, index) => {
        const item = document.createElement('div');
        item.className = 'joke-ranking-item';

        const order = document.createElement('div');
        order.className = 'joke-ranking-order';
        order.textContent = `${index + 1}.`;

        const copy = document.createElement('div');
        copy.className = 'joke-ranking-copy';

        const meta = document.createElement('div');
        meta.className = 'joke-ranking-meta';
        meta.textContent = `⭐ ${formatJokeRatingValue(joke.averageRating)} · 😂 ${formatJokeLaughRate(joke.laughRate)}% · ${joke.timesPlayed}x`;

        const text = document.createElement('div');
        text.className = 'joke-ranking-text';
        text.textContent = joke.word;

        copy.append(meta, text);
        item.append(order, copy);
        container.appendChild(item);
      });
    }

    function getDonationUrl(platform) {
      return DONATION_LINKS[platform] || '';
    }

    function isDonationUrlConfigured(url) {
      return Boolean(url) && !/your-page/i.test(url);
    }

    function openExternalUrl(url) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    function getShareUrl() {
      try {
        const url = new URL(window.location.href);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          if (['localhost', '127.0.0.1', '0.0.0.0'].includes(url.hostname)) return APP_PUBLIC_URL;
          url.hash = '';
          return url.href;
        }
      } catch (error) {
        console.warn('Could not read current URL for sharing.', error);
      }

      return APP_PUBLIC_URL;
    }

    function getShareData() {
      return {
        title: t('share.title'),
        text: t('share.text'),
        url: getShareUrl()
      };
    }

    function canUseNativeShare(shareData) {
      if (!navigator.share) return false;
      if (!navigator.canShare) return true;

      try {
        return navigator.canShare(shareData);
      } catch (error) {
        console.warn('Native share capability check failed.', error);
        return false;
      }
    }

    function createPlatformShareUrl(platform, shareData) {
      const encodedUrl = encodeURIComponent(shareData.url);
      const encodedText = encodeURIComponent(shareData.text);
      const encodedMessage = encodeURIComponent(`${shareData.text} ${shareData.url}`);

      if (platform === 'whatsapp') return `https://wa.me/?text=${encodedMessage}`;
      if (platform === 'facebook') return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      if (platform === 'x') return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;

      return '';
    }

    async function copyTextToClipboard(text) {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }

      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      document.body.appendChild(textarea);

      const activeElement = document.activeElement;
      textarea.focus();
      textarea.select();
      const copied = document.execCommand('copy');
      textarea.remove();
      if (activeElement?.focus) activeElement.focus();
      if (!copied) throw new Error('Clipboard fallback failed');
    }

    async function copyShareLink(notificationKey = 'notifications.shareCopied') {
      try {
        await copyTextToClipboard(getShareData().url);
        showNotif(t(notificationKey));
        return true;
      } catch (error) {
        console.warn('Share link could not be copied.', error);
        showNotif(t('notifications.shareCopyFailed'), 'var(--accent2)', 'var(--text)');
        return false;
      }
    }

    async function nativeShareApp(options = {}) {
      const { fallbackNotification = 'notifications.shareUnavailable' } = options;
      const shareData = getShareData();

      if (canUseNativeShare(shareData)) {
        try {
          await navigator.share(shareData);
          return true;
        } catch (error) {
          if (error?.name === 'AbortError') return false;
          console.warn('Native sharing failed; falling back to clipboard.', error);
        }
      }

      return copyShareLink(fallbackNotification);
    }

    async function shareToPlatform(platform) {
      const shareData = getShareData();
      const target = platform || '';

      if (target === 'copy') return copyShareLink();

      // Instagram and TikTok do not expose reliable public web share-intent URLs
      // for arbitrary app links. Use the native share sheet when supported;
      // otherwise copy the URL and open the platform so users can paste it.
      if (target === 'instagram' || target === 'tiktok') {
        const fallbackNotification = target === 'instagram'
          ? 'notifications.shareInstagramFallback'
          : 'notifications.shareTikTokFallback';
        const shared = await nativeShareApp({ fallbackNotification });
        if (!canUseNativeShare(shareData)) openExternalUrl(SOCIAL_WEB_FALLBACKS[target]);
        return shared;
      }

      const platformUrl = createPlatformShareUrl(target, shareData);
      if (platformUrl) {
        openExternalUrl(platformUrl);
        return true;
      }

      return nativeShareApp();
    }

    function loadExternalScript(src, scriptId) {
      return new Promise((resolve, reject) => {
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
          if (existingScript.dataset.loaded === 'true') {
            resolve();
            return;
          }
          existingScript.addEventListener('load', () => resolve(), { once: true });
          existingScript.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
          return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = src;
        script.async = true;
        script.onload = () => {
          script.dataset.loaded = 'true';
          resolve();
        };
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });
    }

    function openBuyMeACoffeeDonation() {
      const donationUrl = getDonationUrl('buyMeCoffee');
      if (isDonationUrlConfigured(donationUrl)) {
        openExternalUrl(donationUrl);
        return;
      }

      showNotif(t('notifications.donationLinkUnavailable'), 'var(--accent2)', 'var(--text)');
    }

    function wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getKoFiWidgetTrigger() {
      const selectors = [
        'div[class*="kofi"] button',
        'div[class*="kofi"] a',
        'button[aria-label*="Support me"]',
        'button[title*="Support me"]',
        'a[aria-label*="Ko-fi"]',
        'a[href*="ko-fi.com"]'
      ];

      for (const selector of selectors) {
        const candidate = document.querySelector(selector);
        if (candidate) return candidate;
      }

      return Array.from(document.querySelectorAll('button, a')).find(el => {
        const text = (el.textContent || '').trim();
        const href = (el.getAttribute('href') || '').trim();
        const className = typeof el.className === 'string' ? el.className : '';
        return /support me/i.test(text) || /ko-?fi/i.test(text) || /ko-?fi/i.test(href) || /kofi/i.test(className);
      }) || null;
    }

    async function ensureKoFiWidgetReady() {
      await loadExternalScript(KO_FI_WIDGET_SCRIPT_URL, 'kofi-widget-script');
      if (!window.kofiWidgetOverlay?.draw) throw new Error('Ko-fi widget API unavailable');

      if (!window.__mmKoFiWidgetInitialized) {
        window.kofiWidgetOverlay.draw(KO_FI_SLUG, {
          type: 'floating-chat',
          'floating-chat.donateButton.text': 'Support me',
          'floating-chat.donateButton.background-color': '#323842',
          'floating-chat.donateButton.text-color': '#fff'
        });
        window.__mmKoFiWidgetInitialized = true;
      }
    }

    async function triggerKoFiWidget() {
      for (let attempt = 0; attempt < 10; attempt += 1) {
        const trigger = getKoFiWidgetTrigger();
        if (trigger) {
          trigger.click();
          return true;
        }
        await wait(120);
      }
      return false;
    }

    async function openKoFiDonation() {
      try {
        await ensureKoFiWidgetReady();
        if (await triggerKoFiWidget()) return;
      } catch (error) {
        console.warn('Ko-fi widget could not be initialized.', error);
      }

      const fallbackUrl = getDonationUrl('koFi');
      if (isDonationUrlConfigured(fallbackUrl)) {
        openExternalUrl(fallbackUrl);
        return;
      }

      showNotif(t('notifications.donationLinkUnavailable'), 'var(--accent2)', 'var(--text)');
    }

    function openDonationLink(platform) {
      if (platform === 'buyMeCoffee') {
        openBuyMeACoffeeDonation();
        return;
      }
      if (platform === 'koFi') {
        openKoFiDonation();
        return;
      }

      const url = getDonationUrl(platform);
      if (!isDonationUrlConfigured(url)) {
        showNotif(t('notifications.donationLinkUnavailable'), 'var(--accent2)', 'var(--text)');
        return;
      }

      openExternalUrl(url);
    }

    function applyTheme(theme = 'cosmic') {
      const nextTheme = AVAILABLE_THEMES.includes(theme) ? theme : 'cosmic';
      document.body.classList.remove(...AVAILABLE_THEMES.map(item => `theme-${item}`));
      document.body.classList.add(`theme-${nextTheme}`);
      const select = document.getElementById('theme-select');
      if (select && select.value !== nextTheme) select.value = nextTheme;
      updateBackgroundMusic();
      return nextTheme;
    }

    function getCurrentTheme() {
      return AVAILABLE_THEMES.find(theme => document.body.classList.contains(`theme-${theme}`)) || 'cosmic';
    }

    function getMusicKindForScreen(screen = document.body.dataset.activeScreen || 'home') {
      return GAMEPLAY_MUSIC_SCREENS.includes(screen) ? 'gameplay' : 'gameroom';
    }

    function isGameroomMusicEnabled() {
      const toggle = document.getElementById('toggle-gameroom-music');
      return toggle ? toggle.checked : true;
    }

    function isGameplayMusicEnabled() {
      const toggle = document.getElementById('toggle-gameplay-music');
      return toggle ? toggle.checked : true;
    }

    function isMusicKindEnabled(kind) {
      return kind === 'gameplay' ? isGameplayMusicEnabled() : isGameroomMusicEnabled();
    }

    function getMusicSourceForCurrentTheme(kind) {
      const theme = getCurrentTheme();
      if (!THEMES_WITH_MUSIC.includes(theme)) return '';
      const prefix = THEME_MUSIC_PREFIX[theme];
      return prefix ? `${MUSIC_ASSET_BASE}/${prefix}_${kind}.mp3` : '';
    }

    function ensureBackgroundMusicAudio() {
      if (musicState.audio) return musicState.audio;
      const audio = new Audio();
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0.36;
      audio.addEventListener('ended', () => {
        if (!musicState.currentSrc || !musicState.unlocked || !isMusicKindEnabled(musicState.currentKind)) return;
        audio.currentTime = 0;
        audio.play().catch(() => { });
      });
      audio.addEventListener('error', () => {
        musicState.currentSrc = '';
        musicState.currentKind = '';
      });
      musicState.audio = audio;
      return audio;
    }

    function pauseBackgroundMusic({ clearTrack = false } = {}) {
      if (!musicState.audio) return;
      musicState.audio.pause();
      if (clearTrack) {
        musicState.audio.removeAttribute('src');
        musicState.audio.load();
        musicState.currentSrc = '';
        musicState.currentKind = '';
      }
    }

    function updateBackgroundMusic(options = {}) {
      const { unlock = false } = options;
      if (unlock) musicState.unlocked = true;

      const kind = getMusicKindForScreen();
      const src = getMusicSourceForCurrentTheme(kind);
      if (!src || !isMusicKindEnabled(kind)) {
        pauseBackgroundMusic({ clearTrack: !src });
        return;
      }

      const audio = ensureBackgroundMusicAudio();
      if (musicState.currentSrc !== src) {
        audio.pause();
        audio.src = src;
        audio.currentTime = 0;
        musicState.currentSrc = src;
        musicState.currentKind = kind;
      } else {
        musicState.currentKind = kind;
      }

      if (!musicState.unlocked || !audio.paused) return;
      audio.play().catch(() => { });
    }

    function unlockBackgroundMusic() {
      updateBackgroundMusic({ unlock: true });
    }

    function handleMusicSettingChange() {
      musicState.unlocked = true;
      saveSettings();
      updateBackgroundMusic();
    }

    function collectSettings() {
      return {
        timerDur: parseInt(document.getElementById('timer-slider').value, 10) || 60,
        prepareDur: parseInt(document.getElementById('prepare-timer-slider').value, 10) || 3,
        soundEnabled: document.getElementById('toggle-sound').checked,
        navigationSoundEnabled: document.getElementById('toggle-navigation-sound').checked,
        gameroomMusicEnabled: document.getElementById('toggle-gameroom-music').checked,
        gameplayMusicEnabled: document.getElementById('toggle-gameplay-music').checked,
        correctPoints: getConfiguredCorrectPoints(),
        wrongPenaltyPoints: getConfiguredWrongPenaltyPoints(),
        shuffleEnabled: document.getElementById('toggle-shuffle').checked,
        theme: document.getElementById('theme-select').value || 'cosmic',
        language: document.getElementById('language-select').value || DEFAULT_LANGUAGE
      };
    }

    function saveSettings() {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(collectSettings()));
    }

    function detectBrowserLanguage() {
      const browserLanguages = Array.isArray(navigator?.languages) && navigator.languages.length
        ? navigator.languages
        : [navigator?.language].filter(Boolean);
      for (const language of browserLanguages) {
        const normalized = String(language).toLowerCase().split('-')[0];
        if (SUPPORTED_LANGUAGES.includes(normalized)) return normalized;
      }
      return DEFAULT_LANGUAGE;
    }

    function initializeSettings() {
      const defaults = {
        timerDur: 60,
        prepareDur: 3,
        soundEnabled: true,
        navigationSoundEnabled: true,
        gameroomMusicEnabled: true,
        gameplayMusicEnabled: true,
        correctPoints: DEFAULT_CORRECT_POINTS,
        wrongPenaltyPoints: DEFAULT_WRONG_PENALTY_POINTS,
        shuffleEnabled: true,
        theme: 'cosmic',
        language: DEFAULT_LANGUAGE
      };

      let rawSaved = null;
      try {
        rawSaved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
      } catch (e) { }
      const shouldAutoDetectLanguage = !rawSaved || !SUPPORTED_LANGUAGES.includes(rawSaved.language);
      const resolvedLanguage = shouldAutoDetectLanguage ? detectBrowserLanguage() : rawSaved.language;
      const saved = { ...defaults, ...(rawSaved || {}), language: resolvedLanguage };

      document.getElementById('timer-slider').value = saved.timerDur;
      document.getElementById('prepare-timer-slider').value = saved.prepareDur;
      document.getElementById('toggle-sound').checked = Boolean(saved.soundEnabled);
      document.getElementById('toggle-navigation-sound').checked = Boolean(saved.navigationSoundEnabled);
      document.getElementById('toggle-gameroom-music').checked = Boolean(saved.gameroomMusicEnabled);
      document.getElementById('toggle-gameplay-music').checked = Boolean(saved.gameplayMusicEnabled);
      document.getElementById('correct-points-input').value = parsePointValue(saved.correctPoints, DEFAULT_CORRECT_POINTS);
      document.getElementById('wrong-points-input').value = parsePointValue(saved.wrongPenaltyPoints, DEFAULT_WRONG_PENALTY_POINTS);
      document.getElementById('toggle-shuffle').checked = Boolean(saved.shuffleEnabled);
      document.getElementById('theme-select').value = applyTheme(saved.theme);
      document.getElementById('language-select').value = SUPPORTED_LANGUAGES.includes(saved.language) ? saved.language : DEFAULT_LANGUAGE;
      updateTimerLabel(saved.timerDur);
      updatePrepareTimerLabel(saved.prepareDur);
      setLanguage(saved.language || DEFAULT_LANGUAGE);
      if (shouldAutoDetectLanguage) saveSettings();
    }

    // ============================================================
    // LOAD LAST PLAYERS
    // ============================================================
    function loadPlayersForMode(mode) {
      const key = mode === 'teams' ? LAST_TEAMS_KEY : LAST_FFA_KEY;
      const saved = localStorage.getItem(key);
      if (!saved) return;
      try {
        const data = JSON.parse(saved);
        if (mode === 'teams' && data.teams) {
          gameState.teams = clone(data.teams);
          if (data.teamNames) gameState.teamNames = { ...data.teamNames };
        } else if (mode === 'ffa' && data.players) {
          gameState.players = [...data.players].slice(0, 2);
        }
      } catch (e) { }
    }

    function updateTeamName(team, name) {
      gameState.teamNames[team] = name.trim() || getDefaultTeamName(team);
      updateTeamLabels();
    }

    function updateTeamLabels() {
      try {
        ['A', 'B'].forEach(team => {
          if (!gameState.teamNames[team] || isDefaultTeamName(gameState.teamNames[team], team)) {
            gameState.teamNames[team] = getDefaultTeamName(team);
          }
        });
        document.getElementById('team-label-a').innerHTML = `🔴 ${gameState.teamNames.A}`;
        document.getElementById('team-label-b').innerHTML = `🔵 ${gameState.teamNames.B}`;
        document.getElementById('team-name-a').value = gameState.teamNames.A;
        document.getElementById('team-name-b').value = gameState.teamNames.B;
      } catch (e) { }
    }

    // ============================================================
    // SETUP
    // ============================================================
    function refreshGameTypeUI() {
      const challengeToggle = document.getElementById('random-challenge-toggle');
      const challengeWrap = document.getElementById('random-challenge-wrap');
      const challengeSub = document.getElementById('random-challenge-sub');
      if (challengeToggle) challengeToggle.disabled = false;
      if (challengeToggle) challengeToggle.checked = Boolean(gameState.randomChallenge);
      if (challengeWrap) challengeWrap.classList.remove('is-disabled');
      if (challengeSub) challengeSub.textContent = t('setup.randomChallengeSub');

      const currentLabel = document.querySelector('#screen-game .current-player .cp-label');
      if (currentLabel) currentLabel.textContent = t('game.currentPlayerLabel');
      const readyEmoji = document.getElementById('game-ready-emoji');
      if (readyEmoji) readyEmoji.textContent = '🎭';
      const readyTitle = document.getElementById('game-ready-title');
      if (readyTitle) readyTitle.textContent = t('game.readyTitle');
      const readySub = document.getElementById('game-ready-sub');
      if (readySub) readySub.textContent = t('game.readySub');
    }

    function updateDiffWordCount() {
      const total = countWordsForSelectedCategories(gameState.selectedCategories);
      document.getElementById('diff-word-count').textContent = t('dynamic.diffCount', {
        count: total,
        difficulty: t('setup.categoriesLabel')
      });
    }

    function toggleRandomChallenge(enabled) {
      gameState.randomChallenge = Boolean(enabled);
    }

    function toggleCategory(category) {
      gameState.selectedCategories = normalizeSelectedCategories(gameState.selectedCategories);
      if (gameState.selectedCategories.includes(category)) {
        gameState.selectedCategories = gameState.selectedCategories.filter(c => c !== category);
      } else {
        gameState.selectedCategories.push(category);
      }
      gameState.selectedCategories = normalizeSelectedCategories(gameState.selectedCategories);
      renderCategorySelection();
    }

    function renderCategorySelection() {
      const container = document.getElementById('category-selection');
      gameState.selectedCategories = normalizeSelectedCategories(gameState.selectedCategories);
      const premiumPacks = getPremiumPacks();
      const coreMarkup = CATEGORY_KEYS.map(category => `
        <div class="category-card ${gameState.selectedCategories.includes(category) ? 'selected' : ''}" data-category="${category}">
          ${CATEGORY_ICONS[category]} ${getCategoryLabel(category)}
        </div>
      `).join('');
      const premiumMarkup = premiumPacks.map(pack => {
        const category = getPremiumCategoryToken(pack.id);
        return `
          <div class="category-card premium-category-card ${gameState.selectedCategories.includes(category) ? 'selected' : ''}" data-category="${category}">
            ⭐ ${getPackDisplayName(pack)}
          </div>
        `;
      }).join('');

      container.innerHTML = `
        <div class="category-section-title">${t('setup.coreCategoriesLabel')}</div>
        ${coreMarkup}
        ${premiumPacks.length ? `<div class="category-section-title">${t('setup.premiumCategoriesLabel')}</div>${premiumMarkup}` : ''}
      `;
    }

    function selectMode(mode, options = {}) {
      const { skipLoadPlayers = false } = options;
      gameState.mode = mode;
      document.getElementById('mode-teams').classList.toggle('selected', mode === 'teams');
      document.getElementById('mode-ffa').classList.toggle('selected', mode === 'ffa');
      document.getElementById('step-teams').classList.toggle('hidden', mode !== 'teams');
      document.getElementById('step-ffa').classList.toggle('hidden', mode !== 'ffa');
      if (!skipLoadPlayers) loadPlayersForMode(mode);
      updateTeamLabels();
      renderSetupPlayers();
    }

    function getCompanionAssignmentOptions() {
      if (gameState.mode === 'teams') {
        return [
          { value: 'team:A', label: `🔴 ${gameState.teamNames.A || getDefaultTeamName('A')}` },
          { value: 'team:B', label: `🔵 ${gameState.teamNames.B || getDefaultTeamName('B')}` }
        ];
      }

      return (gameState.players || [])
        .map(player => player.name || player)
        .filter(Boolean)
        .map(name => ({ value: `player:${name}`, label: `👤 ${name}` }));
    }

    function ensureValidCompanionAssignment() {
      const options = getCompanionAssignmentOptions();
      if (!options.length) {
        multiDeviceState.assignment = '';
        return;
      }
      if (!options.some(option => option.value === multiDeviceState.assignment)) {
        multiDeviceState.assignment = options[0].value;
      }
    }

    function isCurrentPlayerUsingCompanion() {
      const player = gameState.players[gameState.currentPlayerIdx];
      if (!player) return false;
      if (gameState.mode === 'teams') return multiDeviceState.assignment === `team:${player.team}`;
      const name = player.name || player;
      return multiDeviceState.assignment === `player:${name}`;
    }

    function hasActiveCompanionDevice() {
      return multiDeviceState.role === 'host' && multiDeviceState.connections.some(conn => conn.open);
    }

    function shouldPresentJokeOnCompanion() {
      return hasActiveCompanionDevice()
        && Boolean(gameState.currentWord)
        && gameState.phase === 'playing'
        && isCurrentPlayerUsingCompanion();
    }

    function renderCompanionAssignmentControl() {
      const card = document.getElementById('companion-assignment-card');
      const select = document.getElementById('companion-assignment-select');
      if (!card || !select) return;

      const shouldShow = multiDeviceState.role === 'host';
      card.classList.toggle('hidden', !shouldShow);
      if (!shouldShow) return;

      ensureValidCompanionAssignment();
      const options = getCompanionAssignmentOptions();
      select.innerHTML = '';
      options.forEach(option => {
        const item = document.createElement('option');
        item.value = option.value;
        item.textContent = option.label;
        select.appendChild(item);
      });
      select.value = options.some(option => option.value === multiDeviceState.assignment)
        ? multiDeviceState.assignment
        : (options[0]?.value || '');
      select.disabled = !options.length;
    }

    function setCompanionAssignment(value) {
      multiDeviceState.assignment = String(value || '');
      ensureValidCompanionAssignment();
      renderCompanionAssignmentControl();
      refreshCurrentTurnCopy();
      broadcastHostGameState();
    }

    // ============================================================
    // PLAYERS
    // ============================================================
    function renderSetupPlayers() {
      renderTeamPlayers();
      renderFFAPlayers();
      renderCompanionAssignmentControl();
    }

    function renderTeamPlayers() {
      ['A', 'B'].forEach(team => {
        const cont = document.getElementById('team-' + team.toLowerCase() + '-players');
        cont.innerHTML = '';
        (gameState.teams[team] || []).forEach((player, index) => {
          const color = team === 'A' ? 'var(--team1)' : 'var(--team2)';
          const el = document.createElement('div');
          el.className = 'player-row';
          el.innerHTML = `<div class="player-avatar" style="background:${color}22;color:${color}">${player[0].toUpperCase()}</div><div class="player-name">${player}</div><button class="btn btn-ghost btn-sm" data-action="remove-team-player" data-team="${team}" data-index="${index}">✕</button>`;
          cont.appendChild(el);
        });
      });
    }

    function addTeamPlayer(team) {
      const inp = document.getElementById('inp-team-' + team.toLowerCase());
      const name = inp.value.trim();
      if (!name) return;
      const total = (gameState.teams.A || []).length + (gameState.teams.B || []).length;
      if (total >= 6) {
        showNotif(t('notifications.maxPlayers'), 'var(--accent1)', 'var(--btn-danger-text)');
        return;
      }
      if ((gameState.teams[team] || []).length >= 3) {
        showNotif(t('notifications.maxTeamPlayers'), 'var(--accent1)', 'var(--btn-danger-text)');
        return;
      }
      if (!gameState.teams[team]) gameState.teams[team] = [];
      gameState.teams[team].push(name);
      inp.value = '';
      renderTeamPlayers();
      showNotif(t('dynamic.teamAdded', { name, teamName: gameState.teamNames[team] || getDefaultTeamName(team) }));
    }

    function removeTeamPlayer(team, idx) {
      gameState.teams[team].splice(idx, 1);
      renderTeamPlayers();
    }

    function renderFFAPlayers() {
      const cont = document.getElementById('ffa-players');
      cont.innerHTML = '';
      (gameState.players || []).forEach((player, index) => {
        const name = player.name || player;
        const el = document.createElement('div');
        el.className = 'player-row';
        el.innerHTML = `<div class="player-avatar" style="background:var(--player-avatar-bg);color:var(--player-avatar-text)">${name[0].toUpperCase()}</div><div class="player-name">${name}</div><button class="btn btn-ghost btn-sm" data-action="remove-ffa-player" data-index="${index}">✕</button>`;
        cont.appendChild(el);
      });
    }

    function addFFAPlayer() {
      const inp = document.getElementById('inp-ffa');
      const name = inp.value.trim();
      if (!name) return;
      if (!gameState.players) gameState.players = [];
      if (gameState.players.length >= 2) {
        showNotif(t('notifications.maxFfaPlayers'), 'var(--accent1)', 'var(--btn-danger-text)');
        return;
      }
      gameState.players.push(name);
      inp.value = '';
      renderFFAPlayers();
      showNotif(t('dynamic.playerAdded', { name }));
    }

    function removeFFAPlayer(idx) {
      gameState.players.splice(idx, 1);
      renderFFAPlayers();
    }

    function normalizeQuickGameConfig(config) {
      const gameType = 'mime';
      const mode = config?.mode === 'teams' ? 'teams' : 'ffa';
      const difficulty = 'easy';
      const rounds = Math.min(5, Math.max(1, parseInt(config?.rounds, 10) || 3));
      const selectedCategories = normalizeSelectedCategories(
        Array.isArray(config?.selectedCategories) ? config.selectedCategories : []
      );
      const teams = {
        A: Array.isArray(config?.teams?.A) ? config.teams.A.map(name => String(name).trim()).filter(Boolean).slice(0, 3) : [],
        B: Array.isArray(config?.teams?.B) ? config.teams.B.map(name => String(name).trim()).filter(Boolean).slice(0, 3) : []
      };
      const players = Array.isArray(config?.players)
        ? config.players.map(name => String(name).trim()).filter(Boolean).slice(0, 2)
        : [];
      return {
        gameType,
        mode,
        difficulty,
        rounds,
        randomChallenge: normalizeRandomChallengeSetting(config?.randomChallenge),
        selectedCategories,
        teams,
        players,
        teamNames: {
          A: String(config?.teamNames?.A || getDefaultTeamName('A')).trim() || getDefaultTeamName('A'),
          B: String(config?.teamNames?.B || getDefaultTeamName('B')).trim() || getDefaultTeamName('B')
        }
      };
    }

    function buildQuickGameConfig() {
      return normalizeQuickGameConfig({
        mode: gameState.mode,
        rounds: parseInt(document.getElementById('rounds-slider').value, 10) || gameState.totalRounds || 3,
        randomChallenge: gameState.randomChallenge,
        selectedCategories: [...gameState.selectedCategories],
        teams: clone(gameState.teams),
        players: (gameState.players || []).map(player => player.name || player),
        teamNames: { ...gameState.teamNames }
      });
    }

    function saveQuickGameConfig(config = buildQuickGameConfig()) {
      localStorage.setItem(QUICK_GAME_KEY, JSON.stringify(normalizeQuickGameConfig(config)));
      renderQuickGameSummary();
    }

    function getFirstAccessQuickGameConfig() {
      return normalizeQuickGameConfig({
        mode: 'ffa',
        rounds: 3,
        randomChallenge: true,
        selectedCategories: getDefaultSelectedCategories(),
        teams: { A: [], B: [] },
        players: [1, 2].map(number => getDefaultPlayerName(number)),
        teamNames: {
          A: getDefaultTeamName('A'),
          B: getDefaultTeamName('B')
        }
      });
    }

    function loadQuickGameConfig() {
      try {
        const saved = JSON.parse(localStorage.getItem(QUICK_GAME_KEY) || 'null');
        if (saved) return normalizeQuickGameConfig(saved);
      } catch (e) { }
      return getFirstAccessQuickGameConfig();
    }

    function applyQuickGameConfig(config) {
      const normalized = normalizeQuickGameConfig(config);
      selectMode(normalized.mode, { skipLoadPlayers: true });
      gameState.teams = clone(normalized.teams);
      gameState.players = normalized.mode === 'ffa' ? [...normalized.players] : [];
      gameState.teamNames = { ...normalized.teamNames };
      gameState.randomChallenge = normalized.randomChallenge;
      gameState.selectedCategories = [...normalized.selectedCategories];
      document.getElementById('random-challenge-toggle').checked = normalized.randomChallenge;
      document.getElementById('rounds-slider').value = String(normalized.rounds);
      document.getElementById('rounds-val').textContent = String(normalized.rounds);
      gameState.gameType = 'mime';
      gameState.difficulty = 'easy';
      updateTeamLabels();
      renderSetupPlayers();
      renderCategorySelection();
      refreshGameTypeUI();
    }

    function startQuickGame() {
      applyQuickGameConfig(loadQuickGameConfig());
      startGame();
    }

    // ============================================================
    // START GAME
    // ============================================================
    function startGame() {
      const rounds = parseInt(document.getElementById('rounds-slider').value, 10);
      gameState.totalRounds = rounds;
      gameState.timerDur = parseInt(document.getElementById('timer-slider').value, 10) || 60;
      gameState.prepareDur = parseInt(document.getElementById('prepare-timer-slider').value, 10) || 3;
      gameState.gameType = 'mime';
      gameState.difficulty = 'easy';
      refreshGameTypeUI();

      if (gameState.mode === 'teams') {
        const teamA = gameState.teams.A || [];
        const teamB = gameState.teams.B || [];
        if (teamA.length < 1 || teamB.length < 1) {
          showNotif(t('notifications.minTeamPlayers'), 'var(--accent1)', 'var(--btn-danger-text)');
          return;
        }
        gameState.players = [];
        const maxLen = Math.max(teamA.length, teamB.length);
        for (let i = 0; i < maxLen; i++) {
          if (i < teamA.length) gameState.players.push({ name: teamA[i], team: 'A' });
          if (i < teamB.length) gameState.players.push({ name: teamB[i], team: 'B' });
        }
        gameState.scores = { teamA: 0, teamB: 0 };
        teamA.forEach(player => { gameState.scores[player] = 0; });
        teamB.forEach(player => { gameState.scores[player] = 0; });
      } else {
        if (!gameState.players || gameState.players.length !== 2) {
          showNotif(t('notifications.minFfaPlayers'), 'var(--accent1)', 'var(--btn-danger-text)');
          return;
        }
        const players = [...gameState.players];
        gameState.players = players.map(player => ({ name: player.name || player, team: null }));
        gameState.scores = {};
        players.forEach(player => { gameState.scores[player.name || player] = 0; });
      }

      gameState.currentPlayerIdx = 0;
      gameState.currentRound = 1;
      gameState.usedWords = [];
      gameState.turnsDone = 0;
      gameState.totalTurns = gameState.players.length * rounds;
      gameState.leaderboardRecorded = false;
      gameState.achievementMatch = getDefaultCurrentMatchAchievementStats();
      ensureValidCompanionAssignment();
      saveQuickGameConfig();

      const key = gameState.mode === 'teams' ? LAST_TEAMS_KEY : LAST_FFA_KEY;
      const toSave = gameState.mode === 'teams'
        ? { teams: gameState.teams, teamNames: gameState.teamNames }
        : { players: gameState.players.map(player => player.name || player) };
      localStorage.setItem(key, JSON.stringify(toSave));

      initTurn();
      goTo('game');
    }

    // ============================================================
    // TURN
    // ============================================================
    function renderCurrentPlayerInfo() {
      const player = gameState.players[gameState.currentPlayerIdx];
      if (!player) return;
      document.getElementById('current-player-name').textContent = player.name || player;
      const badge = document.getElementById('current-team-badge');
      if (player.team) {
        const color = player.team === 'A' ? 'var(--team1)' : 'var(--team2)';
        const label = gameState.teamNames[player.team] || getDefaultTeamName(player.team);
        badge.innerHTML = `<span class="team-badge" style="background:${color}22;color:${color}">${label}</span>`;
      } else {
        badge.innerHTML = '';
      }
    }

    function updateScoreManagerButton() {
      const button = document.getElementById('score-manager-open-btn');
      if (!button) return;
      button.classList.toggle('hidden', !(gameState.players.length && gameState.phase === 'preparing'));
    }

    const JOKE_TEXT_SIZE_CLASSES = ['word-text-fit-lg', 'word-text-fit-md', 'word-text-fit-sm', 'word-text-fit-xs', 'word-text-fit-xxs'];

    function fitJokeTextIntoCard(element) {
      if (!element) return;
      const card = element.closest('.word-card');
      if (!card) return;

      JOKE_TEXT_SIZE_CLASSES.forEach(className => element.classList.remove(className));

      if (card.clientHeight <= 0 || card.clientWidth <= 0) return;

      const text = (element.textContent || '').trim();
      if (!text || text === '---') return;

      let classIndex = 0;
      while (card.scrollHeight > card.clientHeight + 1 && classIndex < JOKE_TEXT_SIZE_CLASSES.length) {
        element.classList.add(JOKE_TEXT_SIZE_CLASSES[classIndex]);
        classIndex += 1;
      }
    }

    function syncJokeTextSizing() {
      window.requestAnimationFrame(() => {
        fitJokeTextIntoCard(document.getElementById('word-display'));
        fitJokeTextIntoCard(document.getElementById('guest-word-display'));
      });
    }

    function refreshCurrentTurnCopy() {
      if (gameState.players.length) {
        document.getElementById('round-display').textContent = t('dynamic.roundDisplay', {
          current: gameState.currentRound,
          total: gameState.totalRounds
        });
        renderCurrentPlayerInfo();
      }
      if (gameState.currentWord) {
        document.getElementById('word-display').textContent = gameState.currentWord.word;
      }
      syncHostJokePresentation();
      syncJokeTextSizing();
      updateScoreManagerButton();
    }

    function syncHostJokePresentation() {
      const gameWord = document.getElementById('word-display');
      const gameChallengeEl = document.getElementById('game-challenge-display');
      const gameChallengeTextEl = document.getElementById('game-challenge-text');
      const onCompanion = shouldPresentJokeOnCompanion();

      if (!gameState.currentWord) {
        if (gameWord) gameWord.textContent = '---';
        gameChallengeEl?.classList.add('hidden');
        syncJokeTextSizing();
        return;
      }

      const displayText = onCompanion ? t('game.wordOnCompanion') : gameState.currentWord.word;
      if (gameWord) gameWord.textContent = displayText;

      const shouldShowChallenge = Boolean(gameState.currentChallenge) && !onCompanion;
      if (shouldShowChallenge) {
        if (gameChallengeTextEl) gameChallengeTextEl.textContent = gameState.currentChallenge;
        gameChallengeEl?.classList.remove('hidden');
      } else {
        gameChallengeEl?.classList.add('hidden');
      }

      syncJokeTextSizing();
    }

    function initTurn() {
      gameState.phase = 'preparing';
      gameState.currentWord = null;
      gameState.currentChallenge = null;
      gameState.resultFeedback = null;
      gameState.memorizeLeft = gameState.prepareDur;
      gameState.timerLeft = gameState.timerDur;
      updateTimerDisplay(gameState.timerDur, gameState.timerDur);
      document.getElementById('round-display').textContent = t('dynamic.roundDisplay', {
        current: gameState.currentRound,
        total: gameState.totalRounds
      });
      renderCurrentPlayerInfo();
      document.getElementById('preparing-state').classList.remove('hidden');
      document.getElementById('memorize-state').classList.add('hidden');
      document.getElementById('playing-state').classList.add('hidden');
      syncHostJokePresentation();
      renderResultFeedback();
      refreshGameTypeUI();
      renderScoreMini();
      updateScoreManagerButton();
      broadcastHostGameState();
    }

    // ============================================================
    // REVEAL + MEMORIZE
    // ============================================================
    function revealWord() {
      gameState.phase = 'memorizing';
      gameState.memorizeLeft = gameState.prepareDur;
      updateScoreManagerButton();
      gameState.currentWord = pickWord();
      syncHostJokePresentation();

      document.getElementById('preparing-state').classList.add('hidden');
      document.getElementById('memorize-state').classList.remove('hidden');
      document.getElementById('playing-state').classList.add('hidden');
      broadcastHostGameState();

      const mc = document.getElementById('memCircle');
      const mn = document.getElementById('mem-num');
      updateMemCircle(gameState.memorizeLeft, gameState.prepareDur, mc, mn, 213.6);
      playAlertBeep(600);
      clearInterval(gameState.memInterval);
      gameState.memInterval = setInterval(() => {
        gameState.memorizeLeft--;
        updateMemCircle(gameState.memorizeLeft, gameState.prepareDur, mc, mn, 213.6);
        if (gameState.memorizeLeft > 0) {
          broadcastHostGameState();
          playAlertBeep(gameState.memorizeLeft <= 2 ? 700 : 500);
        } else {
          clearInterval(gameState.memInterval);
          document.getElementById('memorize-state').classList.add('hidden');
          document.getElementById('playing-state').classList.remove('hidden');
          gameState.phase = 'playing';
          gameState.memorizeLeft = 0;
          updateScoreManagerButton();
          syncHostJokePresentation();
          broadcastHostGameState();
          playAlertBeep(880);
          startTimer();
        }
      }, 1000);
    }

    function updateMemCircle(left, total, circ, numEl, circumference) {
      const safeTotal = Math.max(1, Number(total) || 1);
      const safeLeft = Math.max(0, Number(left) || 0);
      numEl.textContent = safeLeft;
      circ.style.strokeDashoffset = circumference - (safeLeft / safeTotal) * circumference;
    }

    // ============================================================
    // PICK WORD / CHALLENGES
    // ============================================================
    function pickWord() {
      const shuffle = document.getElementById('toggle-shuffle').checked;
      const allWords = [];

      gameState.selectedCategories = normalizeSelectedCategories(gameState.selectedCategories);
      gameState.selectedCategories.forEach(category => {
        const premiumPack = getPremiumPackByToken(category);
        const jokes = premiumPack
          ? getPremiumJokesForPack(premiumPack)
          : getCoreJokesForCategory(category);
        jokes.forEach(joke => {
          const text = getJokeText(joke);
          if (!text) return;
          allWords.push({
            id: joke.id,
            word: text,
            text,
            cat: category,
            category,
            packId: premiumPack?.id || CORE_PACK_ID,
            locale: currentLanguage
          });
        });
      });

      let available = allWords.filter(item => !gameState.usedWords.includes(item.word));
      if (available.length === 0) {
        gameState.usedWords = [];
        available = allWords;
      }
      if (available.length === 0) return { word: '???', cat: 'trocadilhos' };

      const picked = shuffle
        ? selectWeightedJoke(available)
        : available[0];
      gameState.usedWords.push(picked.word);

      gameState.currentChallenge = null;
      if (gameState.gameType === 'mime' && gameState.randomChallenge) {
        const challenges = getLocalizedChallenges();
        if (challenges.length) {
          gameState.currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        }
      }

      return picked;
    }

    // ============================================================
    // TIMER / SOUND
    // ============================================================
    function startTimer() {
      const dur = gameState.timerDur;
      gameState.timerLeft = dur;
      updateTimerDisplay(dur, dur);
      clearInterval(gameState.timerInterval);
      gameState.timerInterval = setInterval(() => {
        gameState.timerLeft--;
        updateTimerDisplay(gameState.timerLeft, dur);
        if (gameState.timerLeft <= 10 && gameState.timerLeft > 0) {
          playAlertBeep(gameState.timerLeft <= 3 ? 880 : 440);
        }
        if (gameState.timerLeft <= 0) {
          clearInterval(gameState.timerInterval);
          markResult(false, true);
        }
      }, 1000);
    }

    function updateTimerDisplay(left, total) {
      const strokeOffset = 427.3 - (left / total) * 427.3;
      const strokeColor = left > total * 0.5
        ? getThemeVar('--timer-color-safe')
        : left > total * 0.25
          ? getThemeVar('--timer-color-warning')
          : getThemeVar('--timer-color-danger');
      document.querySelectorAll('[data-timer-num]').forEach(el => {
        el.textContent = left;
      });
      document.querySelectorAll('[data-timer-circle]').forEach(circ => {
        circ.style.strokeDashoffset = strokeOffset;
        circ.style.stroke = strokeColor;
      });
      if (multiDeviceState.role === 'host' && gameState.players.length) {
        broadcastHostGameState();
      }
    }

    function updateTimerLabel(val) {
      document.getElementById('timer-val').textContent = `${val}s`;
      gameState.timerDur = parseInt(val, 10);
    }

    function updatePrepareTimerLabel(val) {
      document.getElementById('prepare-timer-val').textContent = `${val}s`;
      gameState.prepareDur = parseInt(val, 10) || 3;
    }

    function isAlertSoundEnabled() {
      const toggle = document.getElementById('toggle-sound');
      return toggle ? toggle.checked : true;
    }

    function playBeep(freq = 440) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch (e) { }
    }

    function playAlertBeep(freq = 440) {
      if (!isAlertSoundEnabled()) return;
      playBeep(freq);
    }

    function isNavigationSoundEnabled() {
      const toggle = document.getElementById('toggle-navigation-sound');
      return toggle ? toggle.checked : true;
    }

    function playClickSound() {
      playBeep(800);
    }

    function playNavigationSound() {
      if (!isNavigationSoundEnabled()) return;
      playClickSound();
    }

    function playCorrectSound() {
      if (!isNavigationSoundEnabled()) return;
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch (e) { }
    }

    function playWrongSound() {
      if (!isNavigationSoundEnabled()) return;
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.setValueAtTime(300, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch (e) { }
    }

    function animateButtonClick(button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = '';
      }, 100);
    }

    function animateWrongButton(button) {
      button.style.transform = 'translateX(-5px)';
      setTimeout(() => { button.style.transform = 'translateX(5px)'; }, 50);
      setTimeout(() => { button.style.transform = 'translateX(-5px)'; }, 100);
      setTimeout(() => { button.style.transform = 'translateX(5px)'; }, 150);
      setTimeout(() => { button.style.transform = ''; }, 200);
    }

    // ============================================================
    // RESULT
    // ============================================================
    function resetResultGuesserPicker() {
      const nextButton = document.getElementById('result-next-turn-btn');
      if (nextButton) nextButton.disabled = false;
    }

    function formatJokeRatingValue(value) {
      return (Math.round((Number(value) || 0) * 10) / 10).toFixed(1);
    }

    function formatJokeLaughRate(value) {
      return Math.round((Number(value) || 0) * 100);
    }

    function renderResultFeedback() {
      const card = document.getElementById('result-feedback-card');
      const summary = document.getElementById('result-feedback-summary');
      const toggleButton = document.getElementById('result-never-again-btn');
      if (!card || !summary || !toggleButton) return;

      const joke = gameState.currentWord;
      const jokeKey = getJokeKey(joke);
      if (!joke || !jokeKey || multiDeviceState.role === 'guest') {
        card.classList.add('hidden');
        return;
      }

      card.classList.remove('hidden');
      const ratingSummary = getJokeRatingSummary(jokeKey);
      const currentFeedback = gameState.resultFeedback?.jokeKey === jokeKey ? gameState.resultFeedback : null;
      const neverAgainActive = currentFeedback?.neverAgain ?? ratingSummary.neverAgain;

      if (ratingSummary.ratingCount > 0 || ratingSummary.timesPlayed > 0) {
        const parts = [];
        if (ratingSummary.ratingCount > 0) parts.push(`⭐ ${formatJokeRatingValue(ratingSummary.averageRating)}`);
        if (ratingSummary.timesPlayed > 0) parts.push(`😂 ${formatJokeLaughRate(ratingSummary.laughRate)}%`);
        if (ratingSummary.timesPlayed > 0) parts.push(`${ratingSummary.timesPlayed}x`);
        summary.textContent = parts.join(' · ');
      } else {
        summary.textContent = t('result.feedbackSubtitle');
      }

      document.querySelectorAll('.result-feedback-btn[data-rating]').forEach(button => {
        const rating = Number.parseInt(button.dataset.rating, 10);
        button.classList.toggle('selected', currentFeedback?.rating === rating);
      });

      toggleButton.classList.toggle('selected', neverAgainActive);
      toggleButton.textContent = neverAgainActive ? t('result.allowAgain') : t('result.neverAgain');
    }

    function markResult(correct, timeUp = false) {
      clearInterval(gameState.timerInterval);
      clearInterval(gameState.memInterval);
      document.getElementById('memorize-state').classList.add('hidden');
      resetResultGuesserPicker();
      const player = gameState.players[gameState.currentPlayerIdx];
      const playerName = player.name || player;
      const emoji = document.getElementById('resultEmoji');
      const title = document.getElementById('resultTitle');
      const sub = document.getElementById('resultSub');
      const correctPoints = getConfiguredCorrectPoints();
      const wrongPenaltyPoints = getConfiguredWrongPenaltyPoints();
      recordJokeOutcome({
        joke: gameState.currentWord,
        laughed: Boolean(correct)
      });
      gameState.achievementMatch.roundsPlayed += 1;
      if (!correct) gameState.achievementMatch.allRoundsLaughed = false;
      recordAchievementRoundResult({
        laughed: Boolean(correct),
        timeUp: Boolean(timeUp)
      }, gameState.currentWord?.cat || gameState.currentWord?.category || '');

      if (correct) {
        if (gameState.mode === 'teams') {
          addScore('team' + player.team, correctPoints);
          addScore(playerName, correctPoints);
        } else {
          addScore(playerName, correctPoints);
        }

        emoji.textContent = '🎉';
        title.textContent = t('result.correctTitle');
        title.style.color = 'var(--accent3)';
        sub.textContent = gameState.mode === 'teams'
          ? t('dynamic.correctTeamPoints', { teamName: gameState.teamNames[player.team] || getDefaultTeamName(player.team), points: correctPoints })
          : t('dynamic.correctPlayerPoints', { playerName, points: correctPoints });
        launchConfetti();
      } else {
        if (wrongPenaltyPoints > 0) {
          if (gameState.mode === 'teams') {
            addScore('team' + player.team, -wrongPenaltyPoints);
            addScore(playerName, -wrongPenaltyPoints);
          } else {
            addScore(playerName, -wrongPenaltyPoints);
          }
          sub.textContent = timeUp
            ? t('dynamic.timeUpPenalty', { playerName, points: wrongPenaltyPoints })
            : t('dynamic.penaltyApplied', { playerName, points: wrongPenaltyPoints });
        } else {
          sub.textContent = timeUp ? t('dynamic.timeUpNoPoints') : t('dynamic.skippedNoPoints');
        }
        emoji.textContent = timeUp ? '⏰' : '😅';
        title.textContent = timeUp ? t('result.timeUpTitle') : t('result.wrongTitle');
        title.style.color = 'var(--accent1)';
      }

      gameState.phase = 'score';
      updateScoreManagerButton();
      renderScoreMini();
      renderResultFeedback();
      broadcastHostGameState();
      document.getElementById('resultOverlay').classList.add('show');
    }

    function nextTurn() {
      document.getElementById('resultOverlay').classList.remove('show');
      resetResultGuesserPicker();
      gameState.turnsDone++;
      if (gameState.turnsDone >= gameState.totalTurns) {
        showFinalScore();
        return;
      }
      gameState.currentPlayerIdx = (gameState.currentPlayerIdx + 1) % gameState.players.length;
      if (gameState.currentPlayerIdx === 0) {
        gameState.currentRound++;
        showMidScore();
      } else {
        initTurn();
      }
    }

    // ============================================================
    // SCOREBOARDS
    // ============================================================
    function renderScoreMini() {
      const cont = document.getElementById('score-mini');
      if (!cont) return;
      cont.innerHTML = '';
      if (!gameState.players.length) return;
      if (gameState.mode === 'teams') {
        ['A', 'B'].forEach(team => {
          const color = team === 'A' ? 'var(--team1)' : 'var(--team2)';
          const el = document.createElement('div');
          el.style.cssText = `background:${color}22;border:1px solid ${color}44;border-radius:12px;padding:8px 14px;display:flex;align-items:center;gap:8px;white-space:nowrap`;
          const label = gameState.teamNames[team] || getDefaultTeamName(team);
          el.innerHTML = `<span style="font-weight:800;color:${color}">${label}</span><span style="font-family:var(--font-display);font-size:1.2rem;color:${color}">${gameState.scores['team' + team] || 0}</span>`;
          cont.appendChild(el);
        });
      } else {
        gameState.players.forEach(player => {
          const name = player.name || player;
          const el = document.createElement('div');
          el.style.cssText = 'background:var(--surface-bg);border:1px solid var(--surface-border);border-radius:12px;padding:8px 14px;display:flex;align-items:center;gap:8px;white-space:nowrap';
          el.innerHTML = `<span style="font-weight:800;font-size:0.85rem">${name}</span><span style="font-family:var(--font-display);font-size:1.2rem;color:var(--accent2)">${gameState.scores[name] || 0}</span>`;
          cont.appendChild(el);
        });
      }
    }

    function renderFullScoreboard(isFinal = false) {
      const cont = document.getElementById(isFinal ? 'final-scoreboard' : 'scoreboard-list');
      cont.innerHTML = '';
      let entries = [];
      if (gameState.mode === 'teams') {
        entries = [
          { name: `🔴 ${gameState.teamNames.A || getDefaultTeamName('A')}`, pts: gameState.scores.teamA || 0, team: 'A' },
          { name: `🔵 ${gameState.teamNames.B || getDefaultTeamName('B')}`, pts: gameState.scores.teamB || 0, team: 'B' }
        ];
      } else {
        entries = gameState.players.map(player => ({
          name: player.name || player,
          pts: gameState.scores[player.name || player] || 0
        }));
      }
      entries.sort((a, b) => b.pts - a.pts);
      const ranks = ['🥇', '🥈', '🥉'];
      entries.forEach((entry, index) => {
        const div = document.createElement('div');
        div.className = 'score-row' + (index === 0 ? ' first' : index === 1 ? ' second' : index === 2 ? ' third' : '');
        const color = entry.team === 'A' ? 'var(--team1)' : entry.team === 'B' ? 'var(--team2)' : '';
        div.innerHTML = `<div class="rank-badge">${ranks[index] || (index + 1)}</div><div class="score-name" style="flex:1;${color ? 'color:' + color : ''}">${entry.name}</div><div class="score-pts">${entry.pts} <span style="font-size:0.8rem;color:var(--text3)">${t('common.pointsShort')}</span></div>`;
        cont.appendChild(div);
      });
    }

    function getLeaderboardPlayerKey(name) {
      const normalized = String(name || '').trim().toLocaleLowerCase();
      return normalized ? `player:${normalized}` : '';
    }

    function createEmptyLeaderboardModes() {
      return LEADERBOARD_MODE_KEYS.reduce((modes, key) => {
        modes[key] = { points: 0, matches: 0 };
        return modes;
      }, {});
    }

    function normalizeLeaderboardModes(modes = {}) {
      const normalized = createEmptyLeaderboardModes();
      LEADERBOARD_MODE_KEYS.forEach(key => {
        const mode = modes[key] || {};
        normalized[key] = {
          points: Number.parseInt(mode.points, 10) || 0,
          matches: Number.parseInt(mode.matches, 10) || 0
        };
      });
      return normalized;
    }

    function normalizeLeaderboardModel(model = {}) {
      const normalized = { version: 1, matches: 0, players: {} };
      const sourcePlayers = model && typeof model === 'object' ? (model.players || {}) : {};
      Object.keys(sourcePlayers).forEach(sourceKey => {
        const player = sourcePlayers[sourceKey] || {};
        const displayName = String(player.name || sourceKey.replace(/^player:/, '')).trim();
        const playerKey = getLeaderboardPlayerKey(displayName);
        if (!playerKey) return;
        normalized.players[playerKey] = {
          name: displayName,
          totalPoints: Number.parseInt(player.totalPoints, 10) || 0,
          matches: Number.parseInt(player.matches, 10) || 0,
          modes: normalizeLeaderboardModes(player.modes)
        };
      });
      const savedMatches = Number.parseInt(model?.matches, 10);
      normalized.matches = Number.isFinite(savedMatches)
        ? savedMatches
        : Object.values(normalized.players).reduce((max, player) => Math.max(max, player.matches), 0);
      return normalized;
    }

    function loadLeaderboard() {
      try {
        return normalizeLeaderboardModel(JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '{}'));
      } catch (e) {
        return normalizeLeaderboardModel();
      }
    }

    function saveLeaderboard(model) {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(normalizeLeaderboardModel(model)));
    }

    function getLeaderboardModeKey(gameType = gameState.gameType, mode = gameState.mode) {
      const typeKey = gameType === 'drawing' ? 'drawing' : 'mime';
      return `${typeKey}${mode === 'teams' ? 'Teams' : 'Ffa'}`;
    }

    function getOrCreateLeaderboardPlayer(model, name) {
      const playerKey = getLeaderboardPlayerKey(name);
      if (!playerKey) return null;
      if (!model.players[playerKey]) {
        model.players[playerKey] = {
          name: String(name || '').trim(),
          totalPoints: 0,
          matches: 0,
          modes: createEmptyLeaderboardModes()
        };
      }
      return model.players[playerKey];
    }

    function collectFinalLeaderboardEntries() {
      const entriesByName = new Map();
      const addEntry = (name, points) => {
        const playerKey = getLeaderboardPlayerKey(name);
        if (!playerKey) return;
        const entry = { name: String(name || '').trim(), points: Number.parseInt(points, 10) || 0 };
        const current = entriesByName.get(playerKey);
        if (!current || entry.points > current.points) entriesByName.set(playerKey, entry);
      };

      if (gameState.mode === 'teams') {
        gameState.players.forEach(player => {
          const team = player.team;
          if (!team) return;
          addEntry(player.name || player, gameState.scores['team' + team] || 0);
        });
      } else {
        gameState.players.forEach(player => {
          const name = player.name || player;
          addEntry(name, gameState.scores[name] || 0);
        });
      }

      return Array.from(entriesByName.values());
    }

    function recordLeaderboardFinalScore() {
      if (gameState.leaderboardRecorded) return;
      const modeKey = getLeaderboardModeKey();
      const leaderboard = loadLeaderboard();
      const entries = collectFinalLeaderboardEntries();
      if (entries.length) leaderboard.matches = (Number.parseInt(leaderboard.matches, 10) || 0) + 1;
      entries.forEach(entry => {
        const player = getOrCreateLeaderboardPlayer(leaderboard, entry.name);
        if (!player) return;
        player.totalPoints += entry.points;
        player.matches += 1;
        player.modes = normalizeLeaderboardModes(player.modes);
        player.modes[modeKey].points += entry.points;
        player.modes[modeKey].matches += 1;
      });
      saveLeaderboard(leaderboard);
      gameState.leaderboardRecorded = true;
    }

    function getLeaderboardModePlayStyle(modeKey) {
      return modeKey.endsWith('Teams') ? 'teams' : 'ffa';
    }

    function getLeaderboardScopedModeKeys(filters = leaderboardFilters) {
      return LEADERBOARD_MODE_KEYS.filter(modeKey => {
        const modeMatches = filters.mode === 'all' || getLeaderboardModePlayStyle(modeKey) === filters.mode;
        return modeMatches;
      });
    }

    function getLeaderboardScopedStats(player, filters = leaderboardFilters) {
      if (filters.mode === 'all') {
        return {
          points: Number.parseInt(player.totalPoints, 10) || 0,
          matches: Number.parseInt(player.matches, 10) || 0
        };
      }

      return getLeaderboardScopedModeKeys(filters).reduce((acc, modeKey) => {
        const mode = player.modes?.[modeKey] || {};
        acc.points += Number.parseInt(mode.points, 10) || 0;
        acc.matches += Number.parseInt(mode.matches, 10) || 0;
        return acc;
      }, { points: 0, matches: 0 });
    }

    function formatLeaderboardNumber(value) {
      const locale = LANGUAGE_HTML_MAP[currentLanguage] || LANGUAGE_HTML_MAP[DEFAULT_LANGUAGE] || currentLanguage;
      return new Intl.NumberFormat(locale).format(Number.parseInt(value, 10) || 0);
    }

    function getLeaderboardBestModeKey(player, filters = leaderboardFilters) {
      const bestMode = getLeaderboardScopedModeKeys(filters)
        .map(modeKey => ({ modeKey, points: player.modes?.[modeKey]?.points || 0, matches: player.modes?.[modeKey]?.matches || 0 }))
        .sort((a, b) => (b.points - a.points) || (b.matches - a.matches))[0];
      return bestMode && (bestMode.points > 0 || bestMode.matches > 0) ? bestMode.modeKey : null;
    }

    function getLeaderboardPlayerTitle(player, filters = leaderboardFilters) {
      const bestModeKey = getLeaderboardBestModeKey(player, filters);
      if (bestModeKey) {
        return getLeaderboardModePlayStyle(bestModeKey) === 'teams'
          ? t('setup.modeTeamsName')
          : t('setup.modeFfaName');
      }
      return t('leaderboard.playerFallbackTitle');
    }

    function compareLeaderboardPlayers() {
      return (a, b) => {
        const byName = () => a.name.localeCompare(b.name, currentLanguage, { sensitivity: 'base' });
        return (b.scoped.points - a.scoped.points) || (b.scoped.matches - a.scoped.matches) || byName();
      };
    }

    function syncLeaderboardFilterUI() {
      document.querySelectorAll('[data-leaderboard-filter]').forEach(button => {
        const selected = leaderboardFilters[button.dataset.leaderboardFilter] === button.dataset.leaderboardValue;
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
    }

    function renderLeaderboard() {
      const container = document.getElementById('leaderboard-list');
      if (!container) return;
      const leaderboard = loadLeaderboard();
      const allPlayers = Object.values(leaderboard.players)
        .map(player => {
          const normalizedPlayer = { ...player, modes: normalizeLeaderboardModes(player.modes) };
          return { ...normalizedPlayer, scoped: getLeaderboardScopedStats(normalizedPlayer) };
        });
      const isOverallScope = leaderboardFilters.mode === 'all';
      const players = allPlayers
        .filter(player => isOverallScope || player.scoped.points > 0 || player.scoped.matches > 0)
        .sort(compareLeaderboardPlayers());
      const visiblePlayers = players.slice(0, LEADERBOARD_PAGE_SIZE);
      const totalMatches = Number.parseInt(leaderboard.matches, 10) || 0;
      const summary = document.getElementById('leaderboard-summary');
      if (summary) {
        summary.textContent = t('dynamic.leaderboardSummary', { players: players.length, matches: totalMatches });
      }
      syncLeaderboardFilterUI();

      container.innerHTML = '';
      if (!players.length) {
        const empty = document.createElement('div');
        empty.className = 'leaderboard-empty';
        empty.textContent = t('leaderboard.emptyState');
        container.appendChild(empty);
        const footer = document.getElementById('leaderboard-footer');
        if (footer) footer.textContent = '';
        return;
      }

      visiblePlayers.forEach((player, index) => {
        const row = document.createElement('div');
        const podiumClass = index === 0 ? ' rank-first' : index === 1 ? ' rank-second' : index === 2 ? ' rank-third' : '';
        row.className = `leaderboard-row${index < 3 ? ' is-podium' : ''}${podiumClass}`;

        const rank = document.createElement('div');
        rank.className = 'leaderboard-rank';
        const rankNumber = document.createElement('span');
        rankNumber.textContent = String(index + 1);
        rank.appendChild(rankNumber);

        const avatarFrame = document.createElement('div');
        avatarFrame.className = 'leaderboard-avatar-frame';
        const avatar = document.createElement('img');
        avatar.className = 'leaderboard-avatar';
        avatar.src = LEADERBOARD_DEFAULT_AVATAR;
        avatar.alt = '';
        avatar.loading = 'lazy';
        avatarFrame.appendChild(avatar);

        const identity = document.createElement('div');
        identity.className = 'leaderboard-identity';
        const name = document.createElement('div');
        name.className = 'leaderboard-player-name';
        name.textContent = player.name;
        const title = document.createElement('div');
        title.className = 'leaderboard-player-title';
        title.textContent = getLeaderboardPlayerTitle(player);
        const matches = document.createElement('div');
        matches.className = 'leaderboard-player-meta';
        matches.textContent = `${formatLeaderboardNumber(player.scoped.matches)} ${t('leaderboard.matchesLabel')}`;
        identity.append(name, title, matches);

        const score = document.createElement('div');
        score.className = 'leaderboard-score';
        const scoreStar = document.createElement('span');
        scoreStar.className = 'leaderboard-score-star';
        scoreStar.textContent = '★';
        const scoreCopy = document.createElement('span');
        const points = document.createElement('span');
        points.className = 'leaderboard-score-value';
        points.textContent = formatLeaderboardNumber(player.scoped.points);
        const pointsLabel = document.createElement('span');
        pointsLabel.className = 'leaderboard-score-label';
        pointsLabel.textContent = ` ${t('leaderboard.pointsLabel')}`;
        scoreCopy.append(points, pointsLabel);
        score.append(scoreStar, scoreCopy);

        row.append(rank, avatarFrame, identity, score);
        container.appendChild(row);
      });

      const footer = document.getElementById('leaderboard-footer');
      if (footer) {
        footer.textContent = t('dynamic.leaderboardFooter', {
          shown: visiblePlayers.length,
          total: players.length
        });
      }
    }

    function resetLeaderboard() {
      if (!confirm(t('confirmations.resetLeaderboard'))) return;
      localStorage.removeItem(LEADERBOARD_KEY);
      renderLeaderboard();
      showNotif(t('notifications.leaderboardReset'));
    }

    function clearJokeStats() {
      if (!confirm(t('confirmations.clearJokeStats'))) return;
      localStorage.removeItem(JOKE_STATS_KEY);
      renderJokeRanking();
      renderResultFeedback();
      showNotif(t('notifications.jokeStatsCleared'));
    }

    function getScoreManagerEntries() {
      if (gameState.mode === 'teams') {
        return [
          { key: 'teamA', name: `🔴 ${gameState.teamNames.A || getDefaultTeamName('A')}`, team: 'A' },
          { key: 'teamB', name: `🔵 ${gameState.teamNames.B || getDefaultTeamName('B')}`, team: 'B' }
        ];
      }
      return gameState.players.map(player => {
        const name = player.name || player;
        return { key: name, name };
      });
    }

    function renderScoreManager() {
      const container = document.getElementById('score-manager-list');
      if (!container) return;
      container.innerHTML = '';
      const currentPlayer = gameState.players[gameState.currentPlayerIdx];
      const currentName = currentPlayer ? (currentPlayer.name || currentPlayer) : '--';
      const context = document.getElementById('score-manager-context');
      if (context) {
        context.textContent = t('dynamic.scoreManagerContext', {
          round: gameState.currentRound,
          total: gameState.totalRounds,
          playerName: currentName
        });
      }

      getScoreManagerEntries().forEach(entry => {
        const row = document.createElement('div');
        row.className = 'score-row score-row-edit';
        const color = entry.team === 'A' ? 'var(--team1)' : entry.team === 'B' ? 'var(--team2)' : '';
        const name = document.createElement('div');
        name.className = 'score-name';
        name.textContent = entry.name;
        if (color) name.style.color = color;
        const controls = document.createElement('div');
        controls.className = 'score-manager-controls';
        const decrement = document.createElement('button');
        decrement.className = 'btn btn-ghost btn-sm';
        decrement.dataset.action = 'adjust-score-manager';
        decrement.dataset.scoreKey = entry.key;
        decrement.dataset.scoreDelta = '-1';
        decrement.textContent = '−';
        const input = document.createElement('input');
        input.className = 'inp score-manager-input';
        input.type = 'number';
        input.step = '1';
        input.value = String(gameState.scores[entry.key] || 0);
        input.dataset.scoreManagerInput = entry.key;
        const increment = document.createElement('button');
        increment.className = 'btn btn-ghost btn-sm';
        increment.dataset.action = 'adjust-score-manager';
        increment.dataset.scoreKey = entry.key;
        increment.dataset.scoreDelta = '1';
        increment.textContent = '+';
        controls.append(decrement, input, increment);
        row.append(name, controls);
        container.appendChild(row);
      });
    }

    function openScoreManager() {
      if (gameState.phase !== 'preparing' || !gameState.players.length) return;
      renderScoreManager();
      goTo('score-manager');
    }

    function closeScoreManager() {
      goTo('game');
      updateScoreManagerButton();
    }

    function resetScoreManagerInputs() {
      renderScoreManager();
    }

    function adjustScoreManagerInput(scoreKey, delta) {
      const input = Array.from(document.querySelectorAll('[data-score-manager-input]'))
        .find(item => item.dataset.scoreManagerInput === scoreKey);
      if (!input) return;
      input.value = String((Number.parseInt(input.value, 10) || 0) + delta);
    }

    function saveScoreManager() {
      document.querySelectorAll('[data-score-manager-input]').forEach(input => {
        const key = input.dataset.scoreManagerInput;
        gameState.scores[key] = Number.parseInt(input.value, 10) || 0;
      });
      renderScoreMini();
      broadcastHostGameState();
      closeScoreManager();
    }

    function refreshScoreScreenCopy() {
      if (!gameState.players.length || !document.getElementById('screen-score').classList.contains('active')) return;
      const roundDone = gameState.currentRound - 1;
      const remaining = gameState.totalRounds - roundDone;
      document.getElementById('score-subtitle').textContent = t('dynamic.roundSummary', { roundDone, remaining });
      document.getElementById('next-round-info').textContent = t('dynamic.roundDisplay', {
        current: gameState.currentRound,
        total: gameState.totalRounds
      });
      renderFullScoreboard(false);
    }

    function showMidScore() {
      gameState.phase = 'score';
      broadcastHostGameState();
      goTo('score');
      renderFullScoreboard(false);
      refreshScoreScreenCopy();
    }

    function continueGame() {
      goTo('game');
      initTurn();
    }

    function getFinalWinnerData() {
      if (gameState.mode === 'teams') {
        const a = gameState.scores.teamA || 0;
        const b = gameState.scores.teamB || 0;
        if (a > b) return { winner: `🔴 ${gameState.teamNames.A || getDefaultTeamName('A')}`, tie: false };
        if (b > a) return { winner: `🔵 ${gameState.teamNames.B || getDefaultTeamName('B')}`, tie: false };
        return { winner: t('final.tie'), tie: true };
      }
      const sorted = gameState.players
        .map(player => ({ name: player.name || player, pts: gameState.scores[player.name || player] || 0 }))
        .sort((a, b) => b.pts - a.pts);
      if (!sorted.length) return { winner: '--', tie: false };
      const isTie = sorted.length > 1 && sorted[0].pts === sorted[1].pts;
      return { winner: isTie ? t('final.tie') : sorted[0].name, tie: isTie };
    }

    function refreshFinalScreenCopy() {
      if (!gameState.players.length || !document.getElementById('screen-final').classList.contains('active')) return;
      const { winner, tie } = getFinalWinnerData();
      document.getElementById('final-trophy').textContent = tie ? '🤝' : '🏆';
      document.getElementById('final-winner').textContent = winner;
      renderFullScoreboard(true);
    }

    function showFinalScore() {
      gameState.phase = 'final';
      recordLeaderboardFinalScore();
      recordAchievementMatchFinished({
        perfect: Boolean(gameState.achievementMatch.roundsPlayed > 0 && gameState.achievementMatch.allRoundsLaughed),
        usedMultiDevice: Boolean(multiDeviceState.role === 'host' && multiDeviceState.peerId)
      });
      broadcastHostGameState();
      goTo('final');
      renderFullScoreboard(true);
      refreshFinalScreenCopy();
      launchConfetti(80);
    }

    // ============================================================
    // WORD BANK
    // ============================================================
    function selectPackFile() {
      const input = document.getElementById('pack-file-input');
      if (!input) return;
      input.value = '';
      input.click();
    }

    async function installWordPackFile(file) {
      setPackInstallStatus(t('notifications.packInstallReading'));
      const envelope = await parsePackFile(file);
      const pack = await buildInstalledPackFromEnvelope(envelope);
      const existingIndex = contentModel.packs.findIndex(item => item.id === pack.id);

      if (existingIndex >= 0) {
        const existingPack = contentModel.packs[existingIndex];
        if (existingPack.id === CORE_PACK_ID) throw new Error(t('packErrors.reservedPackId'));
        const shouldReplace = confirm(t('confirmations.replacePack', { packName: getPackDisplayName(existingPack) }));
        if (!shouldReplace) {
          setPackInstallStatus(t('notifications.packInstallCancelled'));
          return null;
        }
        contentModel.packs[existingIndex] = pack;
      } else {
        contentModel.packs.push(pack);
      }

      saveContentModel();
      wbPreviewPackId = pack.id;
      gameState.selectedCategories = normalizeSelectedCategories(gameState.selectedCategories);
      renderInstalledPacks();
      renderWordBank();
      renderPackPreview();
      renderCategorySelection();
      updateDiffWordCount();
      setPackInstallStatus(t('notifications.packInstallSuccess'), 'success');
      showNotif(t('dynamic.packInstalled', { name: getPackDisplayName(pack) }));
      return pack;
    }

    async function handlePackFileSelection(file) {
      try {
        await installWordPackFile(file);
      } catch (error) {
        const message = error?.message || t('packErrors.invalidJson');
        setPackInstallStatus(message, 'error');
        showNotif(message, 'var(--accent2)', 'var(--text)');
      }
    }

    function toggleInstalledPack(packId) {
      const pack = contentModel.packs.find(item => item.id === packId && item.source === 'downloaded');
      if (!pack) return;
      pack.enabled = pack.enabled === false;
      saveContentModel();
      gameState.selectedCategories = normalizeSelectedCategories(gameState.selectedCategories);
      renderInstalledPacks();
      renderWordBank();
      renderPackPreview();
      renderCategorySelection();
      updateDiffWordCount();
      showNotif(t('notifications.packToggled'));
    }

    function removeInstalledPack(packId) {
      const pack = contentModel.packs.find(item => item.id === packId && item.source === 'downloaded');
      if (!pack) return;
      if (!confirm(t('confirmations.removePack', { packName: getPackDisplayName(pack) }))) return;
      contentModel.packs = contentModel.packs.filter(item => item.id !== packId);
      if (wbPreviewPackId === packId) wbPreviewPackId = '';
      saveContentModel();
      gameState.selectedCategories = normalizeSelectedCategories(gameState.selectedCategories);
      renderInstalledPacks();
      renderWordBank();
      renderPackPreview();
      renderCategorySelection();
      updateDiffWordCount();
      showNotif(t('notifications.packRemoved'));
    }

    function renderWordBankCategorySelection() {
      const container = document.getElementById('wordbank-category-selection');
      if (!container) return;
      container.innerHTML = CATEGORY_KEYS.map(category => `
        <div class="category-card wordbank-category-card ${category === wbCat ? 'selected' : ''}" data-wb-category="${category}">
          ${getCategoryLabel(category, { withIcon: true })}
        </div>
      `).join('');
    }

    function switchWordTab(tab) {
      if (!CATEGORY_KEYS.includes(tab)) return;
      wbCat = tab;
      const categorySelect = document.getElementById('inp-word-cat');
      if (categorySelect) categorySelect.value = tab;
      renderWordBankCategorySelection();
      renderWordBank();
    }

    function getWordEntriesForWordBank(locale = currentLanguage, category = wbCat) {
      const entries = [];
      const pack = getCorePack();
      const localizedBank = normalizeJokeBank(pack.jokes?.[locale] || {});
      (localizedBank[category] || []).forEach((joke, index) => {
        const word = getJokeText(joke);
        if (!word) return;
        entries.push({
          packId: pack.id,
          word,
          index,
          category,
          editable: pack.editable !== false
        });
      });
      return entries;
    }

    function renderWordBank() {
      const cont = document.getElementById('words-list');
      const summary = document.getElementById('wordbank-category-summary');
      const categorySelect = document.getElementById('inp-word-cat');
      if (categorySelect) categorySelect.value = wbCat;
      renderWordBankCategorySelection();
      cont.innerHTML = '';
      const entries = getWordEntriesForWordBank(currentLanguage, wbCat);
      if (summary) {
        summary.textContent = `${getCategoryLabel(wbCat, { withIcon: true })} · ${t('dynamic.packWordsSummary', { count: entries.length })}`;
      }
      entries.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'joke-entry-card';

        const text = document.createElement('div');
        text.className = 'joke-entry-text';
        text.textContent = entry.word;

        card.append(text);
        if (entry.editable) {
          const removeButton = document.createElement('button');
          removeButton.className = 'btn btn-ghost btn-sm joke-entry-remove';
          removeButton.dataset.action = 'remove-word';
          removeButton.dataset.wordCategory = entry.category;
          removeButton.dataset.wordPack = entry.packId;
          removeButton.dataset.index = String(entry.index);
          removeButton.textContent = '✕';
          card.appendChild(removeButton);
        }
        cont.appendChild(card);
      });
      document.getElementById('word-count').textContent = entries.length;
      renderJokeRanking();
    }

    function getCoreChallengeList(locale = currentLanguage) {
      const pack = getCorePack();
      ensurePackLocale(pack, locale);
      const list = normalizeChallenges(pack.readingChallenges?.[locale] || []);
      return list.length || pack.challengeOverrides?.[locale] ? list : getDefaultCoreChallenges(locale);
    }

    function setCoreChallengeList(list, locale = currentLanguage) {
      const pack = getCorePack();
      ensurePackLocale(pack, locale);
      pack.readingChallenges[locale] = ensureUniqueWords(normalizeChallenges(list));
      pack.challengeOverrides = pack.challengeOverrides || {};
      pack.challengeOverrides[locale] = true;
      syncPackLocaleCompatibility(pack, locale);
      saveContentModel();
    }

    function renderChallengeBank() {
      const cont = document.getElementById('challenges-list');
      const countEl = document.getElementById('challenge-count');
      if (!cont || !countEl) return;
      const challenges = getCoreChallengeList();
      cont.innerHTML = '';
      challenges.forEach((challenge, index) => {
        const tag = document.createElement('span');
        tag.className = 'word-tag';
        const text = document.createTextNode(`🎯 ${challenge} `);
        const removeBtn = document.createElement('span');
        removeBtn.className = 'del-btn';
        removeBtn.dataset.action = 'remove-challenge';
        removeBtn.dataset.index = String(index);
        removeBtn.textContent = '✕';
        tag.append(text, removeBtn);
        cont.appendChild(tag);
      });
      countEl.textContent = challenges.length;
    }

    function addWord() {
      const inp = document.getElementById('inp-new-word');
      const category = document.getElementById('inp-word-cat').value;
      const word = inp.value.trim();
      if (!word) return;
      const currentBank = normalizeJokeBank(getCorePack().jokes?.[currentLanguage] || {});
      const alreadyExists = (currentBank[category] || []).some(joke => getJokeText(joke) === word);
      if (alreadyExists) {
        showNotif(t('notifications.duplicateWord'), 'var(--accent2)', 'var(--text)');
        return;
      }

      const editablePack = getEditablePack();
      ensurePackLocale(editablePack, currentLanguage);
      editablePack.jokes[currentLanguage][category].push({
        id: buildJokeIdFromText(word),
        text: word
      });
      editablePack.jokes[currentLanguage][category] = normalizeJokeList(editablePack.jokes[currentLanguage][category]);
      syncPackLocaleCompatibility(editablePack, currentLanguage);
      saveContentModel();
      inp.value = '';
      renderWordBank();
      updateDiffWordCount();
      const categoryLabel = getCategoryLabel(category, { singular: true, withIcon: true });
      showNotif(t('dynamic.wordAdded', { word, category: categoryLabel, difficulty: categoryLabel }));
    }

    function addChallenge() {
      const inp = document.getElementById('inp-new-challenge');
      const challenge = inp.value.trim();
      if (!challenge) return;
      const challenges = getCoreChallengeList();
      if (challenges.includes(challenge)) {
        showNotif(t('notifications.duplicateChallenge'), 'var(--accent2)', 'var(--text)');
        return;
      }

      setCoreChallengeList([...challenges, challenge]);
      inp.value = '';
      renderChallengeBank();
      showNotif(t('dynamic.challengeAdded', { challenge }));
    }

    function removeWord(category, diff, packId, idx) {
      const pack = contentModel.packs.find(item => item.id === packId);
      if (!pack || pack.editable === false) return;
      ensurePackLocale(pack, currentLanguage);
      pack.jokes[currentLanguage][category].splice(idx, 1);
      syncPackLocaleCompatibility(pack, currentLanguage);
      saveContentModel();
      renderWordBank();
      updateDiffWordCount();
    }

    function removeChallenge(idx) {
      const challenges = getCoreChallengeList();
      if (idx < 0 || idx >= challenges.length) return;
      challenges.splice(idx, 1);
      setCoreChallengeList(challenges);
      renderChallengeBank();
      showNotif(t('notifications.challengeRemoved'));
    }

    function resetChallenges() {
      if (confirm(t('confirmations.resetChallenges'))) {
        const pack = getCorePack();
        ensurePackLocale(pack, currentLanguage);
        pack.readingChallenges[currentLanguage] = getDefaultCoreChallenges();
        pack.challengeOverrides = pack.challengeOverrides || {};
        delete pack.challengeOverrides[currentLanguage];
        syncPackLocaleCompatibility(pack, currentLanguage);
        saveContentModel();
        renderChallengeBank();
        showNotif(t('notifications.challengesRestored'));
      }
    }

    function resetWords() {
      if (confirm(t('confirmations.resetWords'))) {
        const defaultCore = normalizePack(createCorePack());
        const extraPacks = contentModel.packs.filter(pack => pack.id !== CORE_PACK_ID && pack.source !== 'builtin');
        contentModel = {
          version: 1,
          packs: [defaultCore, ...extraPacks.map(normalizePack)]
        };
        saveContentModel();
        renderWordBank();
        renderChallengeBank();
        updateDiffWordCount();
        showNotif(t('notifications.bankRestored'));
      }
    }

    function clearAppStorage(storage) {
      if (!storage) return;
      const keys = [];
      for (let i = 0; i < storage.length; i += 1) {
        const key = storage.key(i);
        if (key?.startsWith(APP_STORAGE_PREFIX)) keys.push(key);
      }
      keys.forEach(key => storage.removeItem(key));
    }

    function resetAppDefaults() {
      if (!confirm(t('confirmations.resetAppDefaults'))) return;
      clearAppStorage(localStorage);
      clearAppStorage(sessionStorage);
      window.location.reload();
    }

    // ============================================================
    // CONFETTI
    // ============================================================
    function launchConfetti(count = 40) {
      const colors = [
        getThemeVar('--accent1'),
        getThemeVar('--accent2'),
        getThemeVar('--accent3'),
        getThemeVar('--accent4'),
        getThemeVar('--accent5'),
        getThemeVar('--timer-color-warning')
      ];
      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        el.style.cssText = `left:${Math.random() * 100}vw;top:-10px;background:${colors[Math.floor(Math.random() * colors.length)]};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};--dur:${(Math.random() * 1.5 + 1.5).toFixed(1)}s;--del2:${(Math.random() * 1).toFixed(2)}s;`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
      }
    }

    // ============================================================
    // RESTART
    // ============================================================
    function confirmRestart() {
      if (confirm(t('confirmations.restartGame'))) {
        clearInterval(gameState.timerInterval);
        clearInterval(gameState.memInterval);
        document.getElementById('resultOverlay').classList.remove('show');
        resetResultGuesserPicker();
        gameState = {
          gameType: 'mime',
          mode: 'teams',
          difficulty: 'easy',
          teams: { A: [], B: [] },
          players: [],
          teamNames: { A: getDefaultTeamName('A'), B: getDefaultTeamName('B') },
          scores: {},
          currentPlayerIdx: 0,
          currentRound: 1,
          totalRounds: 3,
          currentWord: null,
          currentChallenge: null,
          usedWords: [],
          timerDur: parseInt(document.getElementById('timer-slider').value, 10) || 60,
          prepareDur: parseInt(document.getElementById('prepare-timer-slider').value, 10) || 3,
          timerInterval: null,
          memInterval: null,
          memorizeLeft: parseInt(document.getElementById('prepare-timer-slider').value, 10) || 3,
          timerLeft: 60,
          phase: 'preparing',
          totalTurns: 0,
          turnsDone: 0,
          leaderboardRecorded: false,
          resultFeedback: null,
          achievementMatch: getDefaultCurrentMatchAchievementStats(),
          randomChallenge: true,
          selectedCategories: getDefaultSelectedCategories()
        };
        selectMode('teams');
        goTo('setup');
        renderSetupPlayers();
      }
    }

    function handleNavigation(button) {
      animateButtonClick(button);
      playNavigationSound();
      goTo(button.dataset.nav);
    }

    function handleEnterSubmit(key) {
      if (key === 'team-A') addTeamPlayer('A');
      if (key === 'team-B') addTeamPlayer('B');
      if (key === 'ffa') addFFAPlayer();
      if (key === 'add-word') addWord();
      if (key === 'add-challenge') addChallenge();
    }

    function shouldPlayNavigationSoundForAction(action) {
      return action !== 'mark-correct' && action !== 'mark-wrong';
    }

    function handleAction(button) {
      const { action, team, index, wordCategory, wordDiff, wordPack, platform, packId, scoreKey, scoreDelta } = button.dataset;

      if (shouldPlayNavigationSoundForAction(action)) {
        playNavigationSound();
      }

      if (action === 'next-turn') return nextTurn();
      if (action === 'rate-joke') {
        animateButtonClick(button);
        applyJokeFeedback(Number(button.dataset.rating), undefined);
        renderResultFeedback();
        if (document.getElementById('screen-wordbank')?.classList.contains('active')) renderJokeRanking();
        return;
      }
      if (action === 'toggle-never-again') {
        animateButtonClick(button);
        const jokeKey = getJokeKey(gameState.currentWord);
        const currentSummary = getJokeRatingSummary(jokeKey);
        const currentFeedback = gameState.resultFeedback?.jokeKey === jokeKey ? gameState.resultFeedback : null;
        const nextValue = !(currentFeedback?.neverAgain ?? currentSummary.neverAgain);
        applyJokeFeedback(undefined, nextValue);
        renderResultFeedback();
        if (document.getElementById('screen-wordbank')?.classList.contains('active')) renderJokeRanking();
        return;
      }
      if (action === 'share-platform') {
        animateButtonClick(button);
        return shareToPlatform(platform);
      }
      if (action === 'quick-game') {
        animateButtonClick(button);
        return startQuickGame();
      }
      if (action === 'toggle-fullscreen') {
        animateButtonClick(button);
        return toggleFullscreen();
      }
      if (action === 'install-pwa') {
        animateButtonClick(button);
        return installPWA();
      }
      if (action === 'select-multidevice-host') {
        animateButtonClick(button);
        return selectMultiDeviceMode('host');
      }
      if (action === 'select-multidevice-join') {
        animateButtonClick(button);
        return selectMultiDeviceMode('join');
      }
      if (action === 'reset-multidevice-choice') {
        animateButtonClick(button);
        return resetMultiDeviceChoice();
      }
      if (action === 'create-multidevice-host') {
        animateButtonClick(button);
        return createMultiDeviceHost();
      }
      if (action === 'join-multidevice-session') {
        animateButtonClick(button);
        return connectToMultiDeviceHost(document.getElementById('multidevice-join-code')?.value || '');
      }
      if (action === 'continue-multidevice-setup') {
        animateButtonClick(button);
        return goTo('setup');
      }
      if (action === 'copy-multidevice-link') {
        animateButtonClick(button);
        return copyMultiDeviceLink();
      }
      if (action === 'disconnect-multidevice-guest') {
        animateButtonClick(button);
        return disconnectGuestSession();
      }
      if (action === 'reconnect-multidevice-guest') {
        animateButtonClick(button);
        return connectToMultiDeviceHost(multiDeviceState.hostPeerId || document.getElementById('multidevice-join-code')?.value || '', { isAutoReconnect: true });
      }
      if (action === 'donate-bmc') {
        animateButtonClick(button);
        return openDonationLink('buyMeCoffee');
      }
      if (action === 'donate-kofi') {
        animateButtonClick(button);
        return openDonationLink('koFi');
      }
      if (action === 'add-team-player') return addTeamPlayer(team);
      if (action === 'add-ffa-player') return addFFAPlayer();
      if (action === 'start-game') {
        animateButtonClick(button);
        return startGame();
      }
      if (action === 'confirm-restart') return confirmRestart();
      if (action === 'reset-leaderboard') return resetLeaderboard();
      if (action === 'open-score-manager') {
        animateButtonClick(button);
        return openScoreManager();
      }
      if (action === 'close-score-manager') return closeScoreManager();
      if (action === 'reset-score-manager-inputs') return resetScoreManagerInputs();
      if (action === 'adjust-score-manager') return adjustScoreManagerInput(scoreKey, Number(scoreDelta) || 0);
      if (action === 'save-score-manager') return saveScoreManager();
      if (action === 'reveal-word') return revealWord();
      if (action === 'mark-correct') {
        animateButtonClick(button);
        playCorrectSound();
        return markResult(true);
      }
      if (action === 'mark-wrong') {
        animateWrongButton(button);
        playWrongSound();
        return markResult(false);
      }
      if (action === 'continue-game') return continueGame();
      if (action === 'add-word') return addWord();
      if (action === 'add-challenge') return addChallenge();
      if (action === 'reset-words') return resetWords();
      if (action === 'reset-challenges') return resetChallenges();
      if (action === 'clear-joke-stats') return clearJokeStats();
      if (action === 'reset-app-defaults') return resetAppDefaults();
      if (action === 'select-pack-file') return selectPackFile();
      if (action === 'toggle-installed-pack') return toggleInstalledPack(packId);
      if (action === 'remove-installed-pack') return removeInstalledPack(packId);
      if (action === 'copy-user-id') return copyUserId();
      if (action === 'export-user-id') return exportUserId();
      if (action === 'select-user-id-file') return selectUserIdFile();
      if (action === 'remove-word') return removeWord(wordCategory, wordDiff, wordPack, Number(index));
      if (action === 'remove-challenge') return removeChallenge(Number(index));
      if (action === 'remove-team-player') return removeTeamPlayer(team, Number(index));
      if (action === 'remove-ffa-player') return removeFFAPlayer(Number(index));
    }

    function registerEventListeners() {
      document.addEventListener('click', event => {
        unlockBackgroundMusic();

        const navButton = event.target.closest('[data-nav]');
        if (navButton) {
          handleNavigation(navButton);
          return;
        }

        const modeCard = event.target.closest('[data-mode]');
        if (modeCard) {
          selectMode(modeCard.dataset.mode);
          return;
        }

        const categoryCard = event.target.closest('.category-card[data-category]');
        if (categoryCard) {
          toggleCategory(categoryCard.dataset.category);
          return;
        }

        const wbCategoryCard = event.target.closest('.wordbank-category-card[data-wb-category]');
        if (wbCategoryCard) {
          playNavigationSound();
          switchWordTab(wbCategoryCard.dataset.wbCategory);
          return;
        }

        const wbTabButton = event.target.closest('[data-wb-tab]');
        if (wbTabButton) {
          playNavigationSound();
          switchWordTab(wbTabButton.dataset.wbTab);
          return;
        }

        const packPreviewRow = event.target.closest('[data-pack-preview-id]');
        if (packPreviewRow && !event.target.closest('[data-action]')) {
          playNavigationSound();
          selectPreviewPack(packPreviewRow.dataset.packPreviewId);
          return;
        }

        const leaderboardFilter = event.target.closest('[data-leaderboard-filter]');
        if (leaderboardFilter) {
          const filter = leaderboardFilter.dataset.leaderboardFilter;
          const value = leaderboardFilter.dataset.leaderboardValue;
          if (filter === 'type' || filter === 'mode') {
            leaderboardFilters = { ...leaderboardFilters, [filter]: value };
            playNavigationSound();
            renderLeaderboard();
          }
          return;
        }

        const actionButton = event.target.closest('[data-action]');
        if (actionButton) {
          handleAction(actionButton);
        }
      });

      document.querySelectorAll('[data-team-name]').forEach(input => {
        input.addEventListener('change', () => updateTeamName(input.dataset.teamName, input.value));
      });

      document.querySelectorAll('[data-enter-submit]').forEach(input => {
        input.addEventListener('keydown', event => {
          if (event.key === 'Enter') handleEnterSubmit(input.dataset.enterSubmit);
        });
      });

      document.getElementById('multidevice-join-code')?.addEventListener('keydown', event => {
        if (event.key === 'Enter') connectToMultiDeviceHost(event.target.value);
      });

      document.getElementById('rounds-slider').addEventListener('input', event => {
        document.getElementById('rounds-val').textContent = event.target.value;
      });

      document.getElementById('timer-slider').addEventListener('input', event => {
        updateTimerLabel(event.target.value);
        saveSettings();
      });

      document.getElementById('prepare-timer-slider').addEventListener('input', event => {
        updatePrepareTimerLabel(event.target.value);
        saveSettings();
      });

      ['correct-points-input', 'wrong-points-input'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', event => {
          const fallback = id === 'correct-points-input'
            ? DEFAULT_CORRECT_POINTS
            : DEFAULT_WRONG_PENALTY_POINTS;
          event.target.value = parsePointValue(event.target.value, fallback);
          saveSettings();
        });
      });

      document.getElementById('random-challenge-toggle').addEventListener('change', event => {
        toggleRandomChallenge(event.target.checked);
      });

      document.getElementById('companion-assignment-select')?.addEventListener('change', event => {
        setCompanionAssignment(event.target.value);
      });

      document.getElementById('toggle-sound').addEventListener('change', saveSettings);
      document.getElementById('toggle-navigation-sound').addEventListener('change', saveSettings);
      document.getElementById('toggle-gameroom-music').addEventListener('change', handleMusicSettingChange);
      document.getElementById('toggle-gameplay-music').addEventListener('change', handleMusicSettingChange);
      document.getElementById('toggle-shuffle').addEventListener('change', saveSettings);
      document.getElementById('language-select').addEventListener('change', event => {
        setLanguage(event.target.value, { save: true });
      });
      document.getElementById('theme-select').addEventListener('change', event => {
        applyTheme(event.target.value);
        saveSettings();
      });
      document.addEventListener('fullscreenchange', updateFullscreenButton);
      document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
      document.addEventListener('visibilitychange', () => {
        syncWakeLock('visibilitychange');
        if (!document.hidden) refreshMultiDevicePresence('visibilitychange');
      });
      window.addEventListener('pageshow', () => {
        syncWakeLock('pageshow');
        refreshMultiDevicePresence('pageshow');
      });
      window.addEventListener('online', () => {
        syncWakeLock('online');
        refreshMultiDevicePresence('online');
      });
      window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();
        deferredPWAInstallPrompt = event;
        updatePWAInstallButton();
      });
      window.addEventListener('appinstalled', () => {
        deferredPWAInstallPrompt = null;
        updatePWAInstallButton();
      });

      const packFileInput = document.getElementById('pack-file-input');
      if (packFileInput) {
        packFileInput.addEventListener('change', event => {
          const file = event.target.files?.[0];
          handlePackFileSelection(file);
          event.target.value = '';
        });
      }

      const userIdFileInput = document.getElementById('user-id-file-input');
      if (userIdFileInput) {
        userIdFileInput.addEventListener('change', event => {
          const file = event.target.files?.[0];
          handleUserIdFileSelection(file);
          event.target.value = '';
        });
      }

    }

    // ============================================================
    // INIT
    // ============================================================
    saveAchievementState(achievementState);
    initializeSettings();
    checkAndUnlockAchievements({ notify: false });
    registerEventListeners();
    selectMode('teams');
    initializeMultiDeviceJoinFromUrl();
