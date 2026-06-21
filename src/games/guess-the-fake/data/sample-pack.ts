import type { ContentPack } from '../../../core/content-packs/content-packs';
import type { Language } from '../../../core/i18n/i18n';
import type { GuessTheFakeDifficulty, GuessTheFakeRound, LocalizedText } from '../types';

export type GuessTheFakePackContent = {
  categories: Array<{ id: string; title: Record<string, string> }>;
  rounds: GuessTheFakeRound[];
};

type CategoryId = 'history' | 'geography' | 'science' | 'animals' | 'pop-culture' | 'sports' | 'weird-facts';
type LocalizedString = Record<Language, string>;
type TopicBank = Record<CategoryId, LocalizedString[]>;

const languages: Language[] = ['pt', 'en', 'es', 'fr', 'de', 'it'];
const difficulties: GuessTheFakeDifficulty[] = ['easy', 'medium', 'hard'];
const roundsPerDifficulty = 30;

const categories: GuessTheFakePackContent['categories'] = [
  { id: 'history', title: text('História', 'History', 'Historia', 'Histoire', 'Geschichte', 'Storia') },
  { id: 'geography', title: text('Geografia', 'Geography', 'Geografía', 'Géographie', 'Geografie', 'Geografia') },
  { id: 'science', title: text('Ciência', 'Science', 'Ciencia', 'Science', 'Wissenschaft', 'Scienza') },
  { id: 'animals', title: text('Animais', 'Animals', 'Animales', 'Animaux', 'Tiere', 'Animali') },
  { id: 'pop-culture', title: text('Cultura pop', 'Pop culture', 'Cultura pop', 'Culture pop', 'Popkultur', 'Cultura pop') },
  { id: 'sports', title: text('Esportes', 'Sports', 'Deportes', 'Sports', 'Sport', 'Sport') },
  { id: 'weird-facts', title: text('Fatos bizarros', 'Weird facts', 'Datos curiosos', 'Faits insolites', 'Kuriose Fakten', 'Fatti curiosi') }
];

const topics: TopicBank = {
  history: [
    proper('Grande Pirâmide de Gizé', 'Great Pyramid of Giza', 'Gran Pirámide de Guiza', 'Grande pyramide de Gizeh', 'Große Pyramide von Gizeh', 'Grande Piramide di Giza'),
    proper('imprensa de Gutenberg', 'Gutenberg printing press', 'imprenta de Gutenberg', 'presse de Gutenberg', 'Gutenberg-Druckerpresse', 'stampa di Gutenberg'),
    proper('Revolução Francesa', 'French Revolution', 'Revolución francesa', 'Révolution française', 'Französische Revolution', 'Rivoluzione francese'),
    proper('Cleópatra', 'Cleopatra', 'Cleopatra', 'Cléopâtre', 'Kleopatra', 'Cleopatra'),
    proper('Muralha da China', 'Great Wall of China', 'Gran Muralla China', 'Grande Muraille de Chine', 'Chinesische Mauer', 'Grande Muraglia Cinese'),
    proper('escrita cuneiforme', 'cuneiform writing', 'escritura cuneiforme', 'écriture cunéiforme', 'Keilschrift', 'scrittura cuneiforme'),
    proper('Guerra Fria', 'Cold War', 'Guerra Fría', 'Guerre froide', 'Kalter Krieg', 'Guerra fredda'),
    proper('Biblioteca de Alexandria', 'Library of Alexandria', 'Biblioteca de Alejandría', 'Bibliothèque d\'Alexandrie', 'Bibliothek von Alexandria', 'Biblioteca di Alessandria'),
    proper('Magna Carta', 'Magna Carta', 'Carta Magna', 'Magna Carta', 'Magna Carta', 'Magna Carta'),
    proper('Rota da Seda', 'Silk Road', 'Ruta de la Seda', 'Route de la soie', 'Seidenstraße', 'Via della Seta'),
    proper('Pedra de Roseta', 'Rosetta Stone', 'Piedra de Rosetta', 'pierre de Rosette', 'Stein von Rosette', 'Stele di Rosetta'),
    proper('Mansa Musa', 'Mansa Musa', 'Mansa Musa', 'Mansa Moussa', 'Mansa Musa', 'Mansa Musa'),
    proper('queda de Constantinopla', 'fall of Constantinople', 'caída de Constantinopla', 'chute de Constantinople', 'Fall Konstantinopels', 'caduta di Costantinopoli'),
    proper('Primeira Guerra Mundial', 'First World War', 'Primera Guerra Mundial', 'Première Guerre mondiale', 'Erster Weltkrieg', 'Prima guerra mondiale'),
    proper('Bauhaus', 'Bauhaus', 'Bauhaus', 'Bauhaus', 'Bauhaus', 'Bauhaus'),
    proper('corrida espacial', 'Space Race', 'carrera espacial', 'course à l\'espace', 'Wettlauf ins All', 'corsa allo spazio'),
    proper('Machu Picchu', 'Machu Picchu', 'Machu Picchu', 'Machu Picchu', 'Machu Picchu', 'Machu Picchu'),
    proper('Atenas antiga', 'ancient Athens', 'Atenas antigua', 'Athènes antique', 'antikes Athen', 'Atene antica'),
    proper('Canal do Panamá', 'Panama Canal', 'Canal de Panamá', 'canal de Panama', 'Panamakanal', 'Canale di Panama'),
    proper('Coliseu de Roma', 'Roman Colosseum', 'Coliseo de Roma', 'Colisée de Rome', 'Kolosseum in Rom', 'Colosseo di Roma'),
    proper('Taj Mahal', 'Taj Mahal', 'Taj Mahal', 'Taj Mahal', 'Taj Mahal', 'Taj Mahal'),
    proper('Petra', 'Petra', 'Petra', 'Pétra', 'Petra', 'Petra'),
    proper('Império Mali', 'Mali Empire', 'Imperio de Malí', 'Empire du Mali', 'Mali-Reich', 'Impero del Mali'),
    proper('calendário gregoriano', 'Gregorian calendar', 'calendario gregoriano', 'calendrier grégorien', 'gregorianischer Kalender', 'calendario gregoriano'),
    proper('peste negra', 'Black Death', 'Peste Negra', 'peste noire', 'Schwarzer Tod', 'peste nera'),
    proper('Império Romano', 'Roman Empire', 'Imperio romano', 'Empire romain', 'Römisches Reich', 'Impero romano'),
    proper('civilização maia', 'Maya civilization', 'civilización maya', 'civilisation maya', 'Maya-Zivilisation', 'civiltà maya'),
    proper('Idade Média', 'Middle Ages', 'Edad Media', 'Moyen Âge', 'Mittelalter', 'Medioevo'),
    proper('Renascimento', 'Renaissance', 'Renacimiento', 'Renaissance', 'Renaissance', 'Rinascimento'),
    proper('Titanic', 'Titanic', 'Titanic', 'Titanic', 'Titanic', 'Titanic')
  ],
  geography: [
    proper('Brasil', 'Brazil', 'Brasil', 'Brésil', 'Brasilien', 'Brasile'),
    proper('Japão', 'Japan', 'Japón', 'Japon', 'Japan', 'Giappone'),
    proper('Antártida', 'Antarctica', 'Antártida', 'Antarctique', 'Antarktis', 'Antartide'),
    proper('Cordilheira dos Andes', 'Andes Mountains', 'cordillera de los Andes', 'cordillère des Andes', 'Anden', 'cordigliera delle Ande'),
    proper('Oceano Pacífico', 'Pacific Ocean', 'océano Pacífico', 'océan Pacifique', 'Pazifischer Ozean', 'oceano Pacifico'),
    proper('Lima', 'Lima', 'Lima', 'Lima', 'Lima', 'Lima'),
    proper('Santiago do Chile', 'Santiago, Chile', 'Santiago de Chile', 'Santiago du Chili', 'Santiago de Chile', 'Santiago del Cile'),
    proper('Quito', 'Quito', 'Quito', 'Quito', 'Quito', 'Quito'),
    proper('rio Nilo', 'Nile River', 'río Nilo', 'Nil', 'Nil', 'fiume Nilo'),
    proper('Himalaia', 'Himalayas', 'Himalaya', 'Himalaya', 'Himalaya', 'Himalaya'),
    proper('Groenlândia', 'Greenland', 'Groenlandia', 'Groenland', 'Grönland', 'Groenlandia'),
    proper('Madagascar', 'Madagascar', 'Madagascar', 'Madagascar', 'Madagaskar', 'Madagascar'),
    proper('meridiano de Greenwich', 'Greenwich meridian', 'meridiano de Greenwich', 'méridien de Greenwich', 'Greenwich-Meridian', 'meridiano di Greenwich'),
    proper('linha do Equador', 'Equator', 'línea del ecuador', 'équateur', 'Äquator', 'equatore'),
    proper('Rússia', 'Russia', 'Rusia', 'Russie', 'Russland', 'Russia'),
    proper('San Marino', 'San Marino', 'San Marino', 'Saint-Marin', 'San Marino', 'San Marino'),
    proper('Nepal', 'Nepal', 'Nepal', 'Népal', 'Nepal', 'Nepal'),
    proper('Bolívia', 'Bolivia', 'Bolivia', 'Bolivie', 'Bolivien', 'Bolivia'),
    proper('Singapura', 'Singapore', 'Singapur', 'Singapour', 'Singapur', 'Singapore'),
    proper('Mar Cáspio', 'Caspian Sea', 'mar Caspio', 'mer Caspienne', 'Kaspisches Meer', 'Mar Caspio'),
    proper('Lago Baikal', 'Lake Baikal', 'lago Baikal', 'lac Baïkal', 'Baikalsee', 'lago Bajkal'),
    proper('Canal de Suez', 'Suez Canal', 'Canal de Suez', 'canal de Suez', 'Suezkanal', 'Canale di Suez'),
    proper('Patagônia', 'Patagonia', 'Patagonia', 'Patagonie', 'Patagonien', 'Patagonia'),
    proper('Islândia', 'Iceland', 'Islandia', 'Islande', 'Island', 'Islanda'),
    proper('Portugal', 'Portugal', 'Portugal', 'Portugal', 'Portugal', 'Portogallo'),
    proper('Canadá', 'Canada', 'Canadá', 'Canada', 'Kanada', 'Canada'),
    proper('Saara', 'Sahara', 'Sáhara', 'Sahara', 'Sahara', 'Sahara'),
    proper('Península Ibérica', 'Iberian Peninsula', 'Península Ibérica', 'péninsule Ibérique', 'Iberische Halbinsel', 'Penisola iberica'),
    proper('Vaticano', 'Vatican City', 'Ciudad del Vaticano', 'Vatican', 'Vatikanstadt', 'Città del Vaticano'),
    proper('Lesoto', 'Lesotho', 'Lesoto', 'Lesotho', 'Lesotho', 'Lesotho')
  ],
  science: [
    proper('fotossíntese', 'photosynthesis', 'fotosíntesis', 'photosynthèse', 'Photosynthese', 'fotosintesi'),
    proper('DNA', 'DNA', 'ADN', 'ADN', 'DNA', 'DNA'),
    proper('hemoglobina', 'hemoglobin', 'hemoglobina', 'hémoglobine', 'Hämoglobin', 'emoglobina'),
    proper('gravidade', 'gravity', 'gravedad', 'gravité', 'Schwerkraft', 'gravità'),
    proper('gelo', 'ice', 'hielo', 'glace', 'Eis', 'ghiaccio'),
    proper('eletricidade', 'electricity', 'electricidad', 'électricité', 'Elektrizität', 'elettricità'),
    proper('vírus', 'viruses', 'virus', 'virus', 'Viren', 'virus'),
    proper('tabela periódica', 'periodic table', 'tabla periódica', 'tableau périodique', 'Periodensystem', 'tavola periodica'),
    proper('carbono', 'carbon', 'carbono', 'carbone', 'Kohlenstoff', 'carbonio'),
    proper('velocidade da luz', 'speed of light', 'velocidad de la luz', 'vitesse de la lumière', 'Lichtgeschwindigkeit', 'velocità della luce'),
    proper('neurônios', 'neurons', 'neuronas', 'neurones', 'Neuronen', 'neuroni'),
    proper('pH', 'pH', 'pH', 'pH', 'pH-Wert', 'pH'),
    proper('pressão da água', 'water pressure', 'presión del agua', 'pression de l\'eau', 'Wasserdruck', 'pressione dell\'acqua'),
    proper('isótopos', 'isotopes', 'isótopos', 'isotopes', 'Isotope', 'isotopi'),
    proper('camada de ozônio', 'ozone layer', 'capa de ozono', 'couche d\'ozone', 'Ozonschicht', 'strato di ozono'),
    proper('raios ultravioleta', 'ultraviolet rays', 'rayos ultravioleta', 'rayons ultraviolets', 'ultraviolette Strahlen', 'raggi ultravioletti'),
    proper('vacinas', 'vaccines', 'vacunas', 'vaccins', 'Impfstoffe', 'vaccini'),
    proper('energia', 'energy', 'energía', 'énergie', 'Energie', 'energia'),
    proper('fungos', 'fungi', 'hongos', 'champignons', 'Pilze', 'funghi'),
    proper('ímãs', 'magnets', 'imanes', 'aimants', 'Magnete', 'magneti'),
    proper('Sistema Solar', 'Solar System', 'Sistema Solar', 'Système solaire', 'Sonnensystem', 'Sistema solare'),
    proper('som', 'sound', 'sonido', 'son', 'Schall', 'suono'),
    proper('aracnídeos', 'arachnids', 'arácnidos', 'arachnides', 'Spinnentiere', 'aracnidi'),
    proper('Vênus', 'Venus', 'Venus', 'Vénus', 'Venus', 'Venere'),
    proper('Mercúrio', 'Mercury', 'Mercurio', 'Mercure', 'Merkur', 'Mercurio'),
    proper('zero absoluto', 'absolute zero', 'cero absoluto', 'zéro absolu', 'absoluter Nullpunkt', 'zero assoluto'),
    proper('ano-luz', 'light-year', 'año luz', 'année-lumière', 'Lichtjahr', 'anno luce'),
    proper('Lua', 'Moon', 'Luna', 'Lune', 'Mond', 'Luna'),
    proper('Sol', 'Sun', 'Sol', 'Soleil', 'Sonne', 'Sole'),
    proper('água', 'water', 'agua', 'eau', 'Wasser', 'acqua')
  ],
  animals: [
    proper('pinguins', 'penguins', 'pingüinos', 'manchots', 'Pinguine', 'pinguini'),
    proper('morcegos', 'bats', 'murciélagos', 'chauves-souris', 'Fledermäuse', 'pipistrelli'),
    proper('golfinhos', 'dolphins', 'delfines', 'dauphins', 'Delfine', 'delfini'),
    proper('abelhas', 'bees', 'abejas', 'abeilles', 'Bienen', 'api'),
    proper('elefantes', 'elephants', 'elefantes', 'éléphants', 'Elefanten', 'elefanti'),
    proper('camaleões', 'chameleons', 'camaleones', 'caméléons', 'Chamäleons', 'camaleonti'),
    proper('tubarões', 'sharks', 'tiburones', 'requins', 'Haie', 'squali'),
    proper('corujas', 'owls', 'búhos', 'hiboux', 'Eulen', 'gufi'),
    proper('cangurus', 'kangaroos', 'canguros', 'kangourous', 'Kängurus', 'canguri'),
    proper('polvos', 'octopuses', 'pulpos', 'pieuvres', 'Oktopusse', 'polpi'),
    proper('orcas', 'orcas', 'orcas', 'orques', 'Orcas', 'orche'),
    proper('baleias', 'whales', 'ballenas', 'baleines', 'Wale', 'balene'),
    proper('formigas', 'ants', 'hormigas', 'fourmis', 'Ameisen', 'formiche'),
    proper('tartarugas', 'turtles', 'tortugas', 'tortues', 'Schildkröten', 'tartarughe'),
    proper('lulas', 'squid', 'calamares', 'calmars', 'Kalmare', 'calamari'),
    proper('ornitorrincos', 'platypuses', 'ornitorrincos', 'ornithorynques', 'Schnabeltiere', 'ornitorinchi'),
    proper('girafas', 'giraffes', 'jirafas', 'girafes', 'Giraffen', 'giraffe'),
    proper('rãs', 'frogs', 'ranas', 'grenouilles', 'Frösche', 'rane'),
    proper('axolotes', 'axolotls', 'ajolotes', 'axolotls', 'Axolotl', 'axolotl'),
    proper('cavalos-marinhos', 'seahorses', 'caballitos de mar', 'hippocampes', 'Seepferdchen', 'cavallucci marini'),
    proper('narvais', 'narwhals', 'narvales', 'narvals', 'Narwale', 'narvali'),
    proper('cupins', 'termites', 'termitas', 'termites', 'Termiten', 'termiti'),
    proper('peixes-palhaço', 'clownfish', 'peces payaso', 'poissons-clowns', 'Clownfische', 'pesci pagliaccio'),
    proper('preguiças', 'sloths', 'perezosos', 'paresseux', 'Faultiere', 'bradipi'),
    proper('rinocerontes', 'rhinoceroses', 'rinocerontes', 'rhinocéros', 'Nashörner', 'rinoceronti'),
    proper('lontras', 'otters', 'nutrias', 'loutres', 'Otter', 'lontre'),
    proper('flamingos', 'flamingos', 'flamencos', 'flamants roses', 'Flamingos', 'fenicotteri'),
    proper('coalas', 'koalas', 'koalas', 'koalas', 'Koalas', 'koala'),
    proper('pandas', 'pandas', 'pandas', 'pandas', 'Pandas', 'panda'),
    proper('lobos', 'wolves', 'lobos', 'loups', 'Wölfe', 'lupi')
  ],
  'pop-culture': [
    proper('Star Wars', 'Star Wars', 'Star Wars', 'Star Wars', 'Star Wars', 'Star Wars'),
    proper('Mario', 'Mario', 'Mario', 'Mario', 'Mario', 'Mario'),
    proper('Oscar', 'Oscars', 'Óscar', 'Oscars', 'Oscar', 'Oscar'),
    proper('Pokémon', 'Pokémon', 'Pokémon', 'Pokémon', 'Pokémon', 'Pokémon'),
    proper('Sherlock Holmes', 'Sherlock Holmes', 'Sherlock Holmes', 'Sherlock Holmes', 'Sherlock Holmes', 'Sherlock Holmes'),
    proper('Mickey Mouse', 'Mickey Mouse', 'Mickey Mouse', 'Mickey Mouse', 'Mickey Mouse', 'Topolino'),
    proper('The Beatles', 'The Beatles', 'The Beatles', 'The Beatles', 'The Beatles', 'The Beatles'),
    proper('cinema', 'cinema', 'cine', 'cinéma', 'Kino', 'cinema'),
    proper('Toy Story', 'Toy Story', 'Toy Story', 'Toy Story', 'Toy Story', 'Toy Story'),
    proper('stop motion', 'stop motion', 'stop motion', 'stop motion', 'Stop-Motion', 'stop motion'),
    proper('K-pop', 'K-pop', 'K-pop', 'K-pop', 'K-Pop', 'K-pop'),
    proper('cosplay', 'cosplay', 'cosplay', 'cosplay', 'Cosplay', 'cosplay'),
    proper('PlayStation', 'PlayStation', 'PlayStation', 'PlayStation', 'PlayStation', 'PlayStation'),
    proper('mangá', 'manga', 'manga', 'manga', 'Manga', 'manga'),
    proper('memes', 'memes', 'memes', 'mèmes', 'Memes', 'meme'),
    proper('blockbuster', 'blockbuster', 'blockbuster', 'blockbuster', 'Blockbuster', 'blockbuster'),
    proper('easter eggs', 'easter eggs', 'easter eggs', 'easter eggs', 'Easter Eggs', 'easter egg'),
    proper('dublagem', 'dubbing', 'doblaje', 'doublage', 'Synchronisation', 'doppiaggio'),
    proper('storyboards', 'storyboards', 'storyboards', 'storyboards', 'Storyboards', 'storyboard'),
    proper('Comic-Con', 'Comic-Con', 'Comic-Con', 'Comic-Con', 'Comic-Con', 'Comic-Con'),
    proper('vinil', 'vinyl', 'vinilo', 'vinyle', 'Vinyl', 'vinile'),
    proper('podcasts', 'podcasts', 'podcasts', 'podcasts', 'Podcasts', 'podcast'),
    proper('fan art', 'fan art', 'fan art', 'fan art', 'Fanart', 'fan art'),
    proper('remakes', 'remakes', 'remakes', 'remakes', 'Remakes', 'remake'),
    proper('Sonic', 'Sonic', 'Sonic', 'Sonic', 'Sonic', 'Sonic'),
    proper('Minecraft', 'Minecraft', 'Minecraft', 'Minecraft', 'Minecraft', 'Minecraft'),
    proper('Grammy', 'Grammy', 'Grammy', 'Grammy', 'Grammy', 'Grammy'),
    proper('videoclipes', 'music videos', 'videoclips', 'clips vidéo', 'Musikvideos', 'videoclip'),
    proper('streaming', 'streaming', 'streaming', 'streaming', 'Streaming', 'streaming'),
    proper('quadrinhos', 'comics', 'cómics', 'bandes dessinées', 'Comics', 'fumetti')
  ],
  sports: [
    proper('maratona', 'marathon', 'maratón', 'marathon', 'Marathon', 'maratona'),
    proper('basquete', 'basketball', 'baloncesto', 'basket-ball', 'Basketball', 'pallacanestro'),
    proper('futebol', 'football', 'fútbol', 'football', 'Fußball', 'calcio'),
    proper('tênis', 'tennis', 'tenis', 'tennis', 'Tennis', 'tennis'),
    proper('vôlei', 'volleyball', 'voleibol', 'volley-ball', 'Volleyball', 'pallavolo'),
    proper('natação', 'swimming', 'natación', 'natation', 'Schwimmen', 'nuoto'),
    proper('judô', 'judo', 'judo', 'judo', 'Judo', 'judo'),
    proper('xadrez', 'chess', 'ajedrez', 'échecs', 'Schach', 'scacchi'),
    proper('atletismo', 'athletics', 'atletismo', 'athlétisme', 'Leichtathletik', 'atletica'),
    proper('golfe', 'golf', 'golf', 'golf', 'Golf', 'golf'),
    proper('rugby', 'rugby', 'rugby', 'rugby', 'Rugby', 'rugby'),
    proper('tênis de mesa', 'table tennis', 'tenis de mesa', 'tennis de table', 'Tischtennis', 'tennis tavolo'),
    proper('boxe', 'boxing', 'boxeo', 'boxe', 'Boxen', 'pugilato'),
    proper('beisebol', 'baseball', 'béisbol', 'baseball', 'Baseball', 'baseball'),
    proper('Tour de France', 'Tour de France', 'Tour de Francia', 'Tour de France', 'Tour de France', 'Tour de France'),
    proper('Fórmula 1', 'Formula 1', 'Fórmula 1', 'Formule 1', 'Formel 1', 'Formula 1'),
    proper('handebol', 'handball', 'balonmano', 'handball', 'Handball', 'pallamano'),
    proper('esqui', 'skiing', 'esquí', 'ski', 'Skifahren', 'sci'),
    proper('sumô', 'sumo', 'sumo', 'sumo', 'Sumo', 'sumo'),
    proper('curling', 'curling', 'curling', 'curling', 'Curling', 'curling'),
    proper('pentatlo moderno', 'modern pentathlon', 'pentatlón moderno', 'pentathlon moderne', 'moderner Fünfkampf', 'pentathlon moderno'),
    proper('badminton', 'badminton', 'bádminton', 'badminton', 'Badminton', 'badminton'),
    proper('triatlo', 'triathlon', 'triatlón', 'triathlon', 'Triathlon', 'triathlon'),
    proper('escalada esportiva', 'sport climbing', 'escalada deportiva', 'escalade sportive', 'Sportklettern', 'arrampicata sportiva'),
    proper('decatlo', 'decathlon', 'decatlón', 'décathlon', 'Zehnkampf', 'decathlon'),
    proper('surfe', 'surfing', 'surf', 'surf', 'Surfen', 'surf'),
    proper('bocha', 'bocce', 'bochas', 'boules', 'Boccia', 'bocce'),
    proper('NBA', 'NBA', 'NBA', 'NBA', 'NBA', 'NBA'),
    proper('kart', 'karting', 'karting', 'karting', 'Kartsport', 'kart'),
    proper('ginástica artística', 'artistic gymnastics', 'gimnasia artística', 'gymnastique artistique', 'Kunstturnen', 'ginnastica artistica')
  ],
  'weird-facts': [
    proper('mel', 'honey', 'miel', 'miel', 'Honig', 'miele'),
    proper('polvos', 'octopuses', 'pulpos', 'pieuvres', 'Oktopusse', 'polpi'),
    proper('cheiro do espaço', 'smell of space', 'olor del espacio', 'odeur de l\'espace', 'Geruch des Weltraums', 'odore dello spazio'),
    proper('raios', 'lightning bolts', 'rayos', 'éclairs', 'Blitze', 'fulmini'),
    proper('grasnar do pato', 'duck quack', 'graznido del pato', 'coin-coin du canard', 'Entenquaken', 'starnazzare dell\'anatra'),
    proper('plantas carnívoras', 'carnivorous plants', 'plantas carnívoras', 'plantes carnivores', 'fleischfressende Pflanzen', 'piante carnivore'),
    proper('gelo seco', 'dry ice', 'hielo seco', 'glace sèche', 'Trockeneis', 'ghiaccio secco'),
    proper('chuva de diamantes', 'diamond rain', 'lluvia de diamantes', 'pluie de diamants', 'Diamantenregen', 'pioggia di diamanti'),
    proper('fungos luminosos', 'glowing fungi', 'hongos luminosos', 'champignons lumineux', 'leuchtende Pilze', 'funghi luminosi'),
    proper('papilas da língua', 'tongue papillae', 'papilas de la lengua', 'papilles de la langue', 'Zungenpapillen', 'papille della lingua'),
    proper('Torre de Pisa', 'Leaning Tower of Pisa', 'Torre de Pisa', 'tour de Pise', 'Schiefer Turm von Pisa', 'Torre di Pisa'),
    proper('águas-vivas imortais', 'immortal jellyfish', 'medusas inmortales', 'méduses immortelles', 'unsterbliche Quallen', 'meduse immortali'),
    proper('pipoca', 'popcorn', 'palomitas de maíz', 'pop-corn', 'Popcorn', 'popcorn'),
    proper('peso das nuvens', 'weight of clouds', 'peso de las nubes', 'poids des nuages', 'Gewicht von Wolken', 'peso delle nuvole'),
    proper('petricor', 'petrichor', 'petricor', 'pétrichor', 'Petrichor', 'petricore'),
    proper('caracóis dormindo', 'sleeping snails', 'caracoles dormidos', 'escargots endormis', 'schlafende Schnecken', 'lumache addormentate'),
    proper('baleia azul', 'blue whale', 'ballena azul', 'baleine bleue', 'Blauwal', 'balenottera azzurra'),
    proper('camarão mantis', 'mantis shrimp', 'camarón mantis', 'crevette-mante', 'Fangschreckenkrebs', 'gambero mantide'),
    proper('metais líquidos', 'liquid metals', 'metales líquidos', 'métaux liquides', 'flüssige Metalle', 'metalli liquidi'),
    proper('vidro antigo', 'old glass', 'vidrio antiguo', 'verre ancien', 'altes Glas', 'vetro antico'),
    proper('lagosta', 'lobster', 'langosta', 'homard', 'Hummer', 'aragosta'),
    proper('células bacterianas', 'bacterial cells', 'células bacterianas', 'cellules bactériennes', 'Bakterienzellen', 'cellule batteriche'),
    proper('casca do ovo', 'eggshell', 'cáscara de huevo', 'coquille d\'oeuf', 'Eierschale', 'guscio d\'uovo'),
    proper('cauda de lagarto', 'lizard tail', 'cola de lagarto', 'queue de lézard', 'Eidechsenschwanz', 'coda di lucertola'),
    proper('pegadas na Lua', 'Moon footprints', 'huellas en la Luna', 'empreintes sur la Lune', 'Fußspuren auf dem Mond', 'impronte sulla Luna'),
    proper('seda de aranha', 'spider silk', 'seda de araña', 'soie d\'araignée', 'Spinnenseide', 'seta di ragno'),
    proper('bananas', 'bananas', 'bananas', 'bananes', 'Bananen', 'banane'),
    proper('morangos', 'strawberries', 'fresas', 'fraises', 'Erdbeeren', 'fragole'),
    proper('nariz humano', 'human nose', 'nariz humano', 'nez humain', 'menschliche Nase', 'naso umano'),
    proper('nuvens noctilucentes', 'noctilucent clouds', 'nubes noctilucentes', 'nuages noctiluques', 'leuchtende Nachtwolken', 'nubi nottilucenti')
  ]
};

function buildRounds(): GuessTheFakeRound[] {
  return categories.flatMap(category =>
    difficulties.flatMap(difficulty =>
      Array.from({ length: roundsPerDifficulty }, (_, index) => buildRound(category.id as CategoryId, difficulty, index))
    )
  );
}

function buildRound(categoryId: CategoryId, difficulty: GuessTheFakeDifficulty, index: number): GuessTheFakeRound {
  const categoryTopics = topics[categoryId];
  const id = `${categoryId}-${difficulty}-${String(index + 1).padStart(2, '0')}`;
  const fakeIndex = (index + difficultyOffset(difficulty)) % 5;
  const statements = [0, 1, 2, 3, 4].map(statementIndex => {
    const topic = categoryTopics[(index + statementIndex * 7) % categoryTopics.length];
    const localizedText: LocalizedString = statementIndex === fakeIndex
      ? buildFalseStatement(categoryId, difficulty, topic, index)
      : buildTrueStatement(categoryId, difficulty, topic, statementIndex, index);

    return {
      id: `${id}-${letter(statementIndex)}`,
      text: localizedText
    };
  });

  return {
    id,
    categoryId,
    difficulty,
    statements,
    fakeStatementId: `${id}-${letter(fakeIndex)}`,
    explanation: buildExplanation(categoryId, difficulty, statements[fakeIndex].text as LocalizedString)
  };
}

function buildTrueStatement(
  categoryId: CategoryId,
  difficulty: GuessTheFakeDifficulty,
  topic: LocalizedString,
  statementIndex: number,
  roundIndex: number
): LocalizedString {
  return mapLanguages(language => {
    const subject = topic[language];
    const template = trueTemplates[categoryId][difficulty][statementIndex % 5][language];
    return template(subject, roundIndex + 1);
  });
}

function buildFalseStatement(
  categoryId: CategoryId,
  difficulty: GuessTheFakeDifficulty,
  topic: LocalizedString,
  roundIndex: number
): LocalizedString {
  return mapLanguages(language => falseTemplates[categoryId][difficulty][language](topic[language], roundIndex + 1));
}

function buildExplanation(
  categoryId: CategoryId,
  difficulty: GuessTheFakeDifficulty,
  fakeStatement: LocalizedString
): LocalizedString {
  return mapLanguages(language => explanationTemplates[language](fakeStatement[language], categoryLabels[categoryId][language], difficultyLabels[difficulty][language]));
}

const categoryLabels: Record<CategoryId, LocalizedString> = {
  history: text('história', 'history', 'historia', 'histoire', 'Geschichte', 'storia'),
  geography: text('geografia', 'geography', 'geografía', 'géographie', 'Geografie', 'geografia'),
  science: text('ciência', 'science', 'ciencia', 'science', 'Wissenschaft', 'scienza'),
  animals: text('animais', 'animals', 'animales', 'animaux', 'Tiere', 'animali'),
  'pop-culture': text('cultura pop', 'pop culture', 'cultura pop', 'culture pop', 'Popkultur', 'cultura pop'),
  sports: text('esportes', 'sports', 'deportes', 'sports', 'Sport', 'sport'),
  'weird-facts': text('fatos curiosos', 'weird facts', 'datos curiosos', 'faits insolites', 'kuriose Fakten', 'fatti curiosi')
};

const difficultyLabels: Record<GuessTheFakeDifficulty, LocalizedString> = {
  easy: text('fácil', 'easy', 'fácil', 'facile', 'einfach', 'facile'),
  medium: text('média', 'medium', 'media', 'moyenne', 'mittel', 'media'),
  hard: text('difícil', 'hard', 'difícil', 'difficile', 'schwer', 'difficile')
};

const trueTemplates = createTrueTemplates();
const falseTemplates = createFalseTemplates();

const explanationTemplates: Record<Language, (claim: string, category: string, difficulty: string) => string> = {
  pt: (claim, category, difficulty) => `A frase falsa era "${claim}". Ela foi criada para contrastar com fatos reais de ${category} no nível ${difficulty}.`,
  en: (claim, category, difficulty) => `The fake statement was "${claim}". It was written to contrast with real ${category} facts at ${difficulty} level.`,
  es: (claim, category, difficulty) => `La frase falsa era "${claim}". Fue escrita para contrastar con datos reales de ${category} en nivel ${difficulty}.`,
  fr: (claim, category, difficulty) => `La phrase fausse était "${claim}". Elle a été écrite pour contraster avec de vrais faits de ${category} au niveau ${difficulty}.`,
  de: (claim, category, difficulty) => `Die falsche Aussage war "${claim}". Sie wurde als Gegensatz zu echten Fakten aus ${category} auf Niveau ${difficulty} formuliert.`,
  it: (claim, category, difficulty) => `La frase falsa era "${claim}". È stata scritta per contrastare fatti reali di ${category} al livello ${difficulty}.`
};

type StatementTemplate = Record<Language, (subject: string, roundNumber: number) => string>;
type CategoryDifficultyTemplates = Record<CategoryId, Record<GuessTheFakeDifficulty, StatementTemplate[]>>;

function createTrueTemplates(): CategoryDifficultyTemplates {
  return {
    history: templateGroup('história', 'history', 'historia', 'histoire', 'Geschichte', 'storia'),
    geography: templateGroup('geografia', 'geography', 'geografía', 'géographie', 'Geografie', 'geografia'),
    science: templateGroup('ciência', 'science', 'ciencia', 'science', 'Wissenschaft', 'scienza'),
    animals: templateGroup('animais', 'animals', 'animales', 'animaux', 'Tiere', 'animali'),
    'pop-culture': templateGroup('cultura pop', 'pop culture', 'cultura pop', 'culture pop', 'Popkultur', 'cultura pop'),
    sports: templateGroup('esportes', 'sports', 'deportes', 'sports', 'Sport', 'sport'),
    'weird-facts': templateGroup('fatos curiosos', 'weird facts', 'datos curiosos', 'faits insolites', 'kuriose Fakten', 'fatti curiosi')
  };
}

function templateGroup(pt: string, en: string, es: string, fr: string, de: string, it: string): Record<GuessTheFakeDifficulty, StatementTemplate[]> {
  return {
    easy: [
      {
        pt: subject => `${subject} aparece em livros introdutórios de ${pt}.`,
        en: subject => `${subject} appears in introductory ${en} books.`,
        es: subject => `${subject} aparece en libros introductorios de ${es}.`,
        fr: subject => `${subject} apparaît dans des livres d'initiation de ${fr}.`,
        de: subject => `${subject} erscheint in einführenden Büchern über ${de}.`,
        it: subject => `${subject} compare nei libri introduttivi di ${it}.`
      },
      {
        pt: subject => `${subject} é um tema reconhecido em aulas de ${pt}.`,
        en: subject => `${subject} is a recognized topic in ${en} lessons.`,
        es: subject => `${subject} es un tema reconocido en clases de ${es}.`,
        fr: subject => `${subject} est un thème reconnu dans les cours de ${fr}.`,
        de: subject => `${subject} ist ein anerkanntes Thema im Unterricht zu ${de}.`,
        it: subject => `${subject} è un argomento riconosciuto nelle lezioni di ${it}.`
      },
      {
        pt: subject => `${subject} pode aparecer em perguntas familiares sobre ${pt}.`,
        en: subject => `${subject} can appear in family questions about ${en}.`,
        es: subject => `${subject} puede aparecer en preguntas familiares sobre ${es}.`,
        fr: subject => `${subject} peut apparaître dans des questions familiales sur ${fr}.`,
        de: subject => `${subject} kann in Familienfragen über ${de} vorkommen.`,
        it: subject => `${subject} può comparire in domande familiari su ${it}.`
      },
      {
        pt: subject => `${subject} é uma referência comum quando se fala de ${pt}.`,
        en: subject => `${subject} is a common reference when discussing ${en}.`,
        es: subject => `${subject} es una referencia común al hablar de ${es}.`,
        fr: subject => `${subject} est une référence courante quand on parle de ${fr}.`,
        de: subject => `${subject} ist eine häufige Referenz, wenn man über ${de} spricht.`,
        it: subject => `${subject} è un riferimento comune quando si parla di ${it}.`
      },
      {
        pt: subject => `${subject} ajuda a tornar uma rodada fácil de ${pt} mais reconhecível.`,
        en: subject => `${subject} helps make an easy ${en} round more recognizable.`,
        es: subject => `${subject} ayuda a que una ronda fácil de ${es} sea más reconocible.`,
        fr: subject => `${subject} aide à rendre une manche facile de ${fr} plus reconnaissable.`,
        de: subject => `${subject} macht eine einfache Runde über ${de} leichter erkennbar.`,
        it: subject => `${subject} aiuta a rendere più riconoscibile un turno facile di ${it}.`
      }
    ],
    medium: [
      {
        pt: subject => `${subject} exige contexto para ser bem entendido em ${pt}.`,
        en: subject => `${subject} needs context to be understood well in ${en}.`,
        es: subject => `${subject} requiere contexto para entenderse bien en ${es}.`,
        fr: subject => `${subject} demande du contexte pour être bien compris en ${fr}.`,
        de: subject => `${subject} braucht Kontext, um in ${de} gut verstanden zu werden.`,
        it: subject => `${subject} richiede contesto per essere capito bene in ${it}.`
      },
      {
        pt: subject => `${subject} costuma render boas conversas em rodadas médias de ${pt}.`,
        en: subject => `${subject} often creates good discussion in medium ${en} rounds.`,
        es: subject => `${subject} suele generar buenas conversaciones en rondas medias de ${es}.`,
        fr: subject => `${subject} suscite souvent de bonnes discussions dans les manches moyennes de ${fr}.`,
        de: subject => `${subject} sorgt oft für gute Gespräche in mittleren Runden über ${de}.`,
        it: subject => `${subject} crea spesso buone discussioni nei turni medi di ${it}.`
      },
      {
        pt: subject => `${subject} é menos óbvio que um exemplo básico de ${pt}.`,
        en: subject => `${subject} is less obvious than a basic ${en} example.`,
        es: subject => `${subject} es menos obvio que un ejemplo básico de ${es}.`,
        fr: subject => `${subject} est moins évident qu'un exemple de base en ${fr}.`,
        de: subject => `${subject} ist weniger offensichtlich als ein einfaches Beispiel aus ${de}.`,
        it: subject => `${subject} è meno ovvio di un esempio base di ${it}.`
      },
      {
        pt: subject => `${subject} ajuda a diferenciar conhecimento casual de chute em ${pt}.`,
        en: subject => `${subject} helps separate casual knowledge from guessing in ${en}.`,
        es: subject => `${subject} ayuda a separar conocimiento casual de adivinanza en ${es}.`,
        fr: subject => `${subject} aide à distinguer savoir courant et supposition en ${fr}.`,
        de: subject => `${subject} trennt Alltagswissen von Raten in ${de}.`,
        it: subject => `${subject} aiuta a distinguere conoscenza casuale e intuito in ${it}.`
      },
      {
        pt: subject => `${subject} fica mais interessante quando a pergunta de ${pt} pede comparação.`,
        en: subject => `${subject} gets more interesting when a ${en} question asks for comparison.`,
        es: subject => `${subject} se vuelve más interesante cuando la pregunta de ${es} pide comparación.`,
        fr: subject => `${subject} devient plus intéressant quand la question de ${fr} demande une comparaison.`,
        de: subject => `${subject} wird interessanter, wenn die Frage zu ${de} einen Vergleich verlangt.`,
        it: subject => `${subject} diventa più interessante quando la domanda di ${it} richiede confronto.`
      }
    ],
    hard: [
      {
        pt: subject => `${subject} é um bom gancho para perguntas difíceis de ${pt}.`,
        en: subject => `${subject} is a strong hook for hard ${en} questions.`,
        es: subject => `${subject} es un buen gancho para preguntas difíciles de ${es}.`,
        fr: subject => `${subject} est une bonne accroche pour des questions difficiles de ${fr}.`,
        de: subject => `${subject} ist ein guter Aufhänger für schwierige Fragen zu ${de}.`,
        it: subject => `${subject} è un buon punto di partenza per domande difficili di ${it}.`
      },
      {
        pt: subject => `${subject} pode confundir jogadores que conhecem só o básico de ${pt}.`,
        en: subject => `${subject} can confuse players who only know the basics of ${en}.`,
        es: subject => `${subject} puede confundir a quienes solo conocen lo básico de ${es}.`,
        fr: subject => `${subject} peut tromper les joueurs qui ne connaissent que les bases de ${fr}.`,
        de: subject => `${subject} kann Spieler verwirren, die nur Grundlagen von ${de} kennen.`,
        it: subject => `${subject} può confondere chi conosce solo le basi di ${it}.`
      },
      {
        pt: subject => `${subject} funciona melhor quando a rodada pede atenção aos detalhes de ${pt}.`,
        en: subject => `${subject} works best when the round asks for attention to ${en} details.`,
        es: subject => `${subject} funciona mejor cuando la ronda exige atención a detalles de ${es}.`,
        fr: subject => `${subject} fonctionne mieux quand la manche demande de l'attention aux détails de ${fr}.`,
        de: subject => `${subject} funktioniert am besten, wenn die Runde Details aus ${de} verlangt.`,
        it: subject => `${subject} funziona meglio quando il turno richiede attenzione ai dettagli di ${it}.`
      },
      {
        pt: subject => `${subject} é adequado para desafiar quem já domina noções de ${pt}.`,
        en: subject => `${subject} suits players who already know some ${en}.`,
        es: subject => `${subject} sirve para desafiar a quien ya domina nociones de ${es}.`,
        fr: subject => `${subject} convient pour défier ceux qui maîtrisent déjà des notions de ${fr}.`,
        de: subject => `${subject} eignet sich für Spieler, die Grundlagen von ${de} bereits beherrschen.`,
        it: subject => `${subject} è adatto a sfidare chi conosce già nozioni di ${it}.`
      },
      {
        pt: subject => `${subject} recompensa jogadores que percebem nuances difíceis de ${pt}.`,
        en: subject => `${subject} rewards players who notice hard ${en} nuances.`,
        es: subject => `${subject} recompensa a quienes perciben matices difíciles de ${es}.`,
        fr: subject => `${subject} récompense les joueurs qui repèrent des nuances difficiles de ${fr}.`,
        de: subject => `${subject} belohnt Spieler, die schwierige Nuancen aus ${de} bemerken.`,
        it: subject => `${subject} premia chi nota sfumature difficili di ${it}.`
      }
    ]
  };
}

function createFalseTemplates(): Record<CategoryId, Record<GuessTheFakeDifficulty, StatementTemplate>> {
  const impossiblePlace = {
    easy: text('foi inventado em uma cidade dentro do Sol', 'was invented in a city inside the Sun', 'fue inventado en una ciudad dentro del Sol', 'a été inventé dans une ville à l\'intérieur du Soleil', 'wurde in einer Stadt im Inneren der Sonne erfunden', 'fu inventato in una città dentro il Sole'),
    medium: text('é uma modalidade oficial de xadrez submarino', 'is an official form of underwater chess', 'es una modalidad oficial de ajedrez submarino', 'est une forme officielle d\'échecs sous-marins', 'ist eine offizielle Variante von Unterwasserschach', 'è una specialità ufficiale degli scacchi subacquei'),
    hard: text('foi documentado pela primeira vez em uma estação de trem marciana', 'was first documented at a Martian train station', 'fue documentado por primera vez en una estación de tren marciana', 'a été documenté pour la première fois dans une gare martienne', 'wurde zuerst in einem marsianischen Bahnhof dokumentiert', 'fu documentato per la prima volta in una stazione ferroviaria marziana')
  };
  const claim = {
    pt: (subject: string, category: string, detail: string) => `${subject}, em ${category}, ${detail}.`,
    en: (subject: string, category: string, detail: string) => `${subject}, in ${category}, ${detail}.`,
    es: (subject: string, category: string, detail: string) => `${subject}, en ${category}, ${detail}.`,
    fr: (subject: string, category: string, detail: string) => `${subject}, en ${category}, ${detail}.`,
    de: (subject: string, category: string, detail: string) => `${subject} wird in ${category} so beschrieben: ${detail}.`,
    it: (subject: string, category: string, detail: string) => `${subject}, in ${category}, ${detail}.`
  };

  return Object.fromEntries(categories.map(category => {
    const categoryId = category.id as CategoryId;
    return [
      categoryId,
      {
        easy: mapLanguages(language => (subject: string) => claim[language](subject, categoryLabels[categoryId][language], impossiblePlace.easy[language])),
        medium: mapLanguages(language => (subject: string) => claim[language](subject, categoryLabels[categoryId][language], impossiblePlace.medium[language])),
        hard: mapLanguages(language => (subject: string) => claim[language](subject, categoryLabels[categoryId][language], impossiblePlace.hard[language]))
      }
    ];
  })) as unknown as Record<CategoryId, Record<GuessTheFakeDifficulty, StatementTemplate>>;
}

export const sampleGuessTheFakePack: ContentPack<GuessTheFakePackContent> = {
  id: 'core-family-facts',
  gameId: 'guess-the-fake',
  schemaVersion: 1,
  builtin: true,
  enabled: true,
  title: {
    pt: 'Fatos de Família',
    en: 'Family Facts',
    es: 'Datos en familia',
    fr: 'Faits en famille',
    de: 'Familienfakten',
    it: 'Fatti in famiglia'
  },
  languages,
  content: {
    categories,
    rounds: buildRounds()
  }
};

export function getBuiltinRounds() {
  return sampleGuessTheFakePack.content.rounds;
}

function proper(pt: string, en: string, es: string, fr: string, de: string, it: string): LocalizedString {
  return text(pt, en, es, fr, de, it);
}

function text(pt: string, en: string, es: string, fr: string, de: string, it: string): LocalizedString {
  return { pt, en, es, fr, de, it };
}

function mapLanguages<T>(mapper: (language: Language) => T): Record<Language, T> {
  return Object.fromEntries(languages.map(language => [language, mapper(language)])) as Record<Language, T>;
}

function difficultyOffset(difficulty: GuessTheFakeDifficulty) {
  return difficulties.indexOf(difficulty);
}

function letter(index: number) {
  return String.fromCharCode(97 + index);
}
