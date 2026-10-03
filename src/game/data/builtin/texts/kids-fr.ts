import type { BuiltinTexts } from '../index';

// W17-03: kids rounds (6-9 years, all easy). Fake position in catalog.ts.
const kids: BuiltinTexts = {
  'kids-history-01': {
    statements: [
      'Les pyramides d’Égypte ont été construites il y a des milliers d’années.',
      'Les Romains ont construit des routes en pierre.',
      'Autrefois, on écrivait avec des plumes d’oiseau et de l’encre.',
      'Il y a 200 ans, personne n’avait de télévision à la maison.',
      'Les dinosaures vivaient à la même époque que les premiers humains.'
    ],
    explanation: 'Les dinosaures ont disparu il y a environ 66 millions d’années, bien avant l’apparition des humains.'
  },
  'kids-history-02': {
    statements: [
      'Les chevaliers portaient des armures en métal.',
      'Certains châteaux étaient entourés de douves remplies d’eau.',
      'Les châteaux du Moyen Âge avaient l’électricité.',
      'Les châteaux avaient des murs de pierre très épais.',
      'Les rois et les reines vivaient dans des châteaux et des palais.'
    ],
    explanation: 'L’électricité dans les maisons n’est arrivée qu’à la fin du XIXe siècle, bien après le Moyen Âge.'
  },
  'kids-history-03': {
    statements: [
      'Les anciens Égyptiens fabriquaient des momies.',
      'Les Égyptiens fabriquaient des feuilles pour écrire avec une plante appelée papyrus.',
      'Les Égyptiens écrivaient avec des dessins appelés hiéroglyphes.',
      'Les pharaons étaient les rois de la Chine ancienne.',
      'Le Sphinx d’Égypte a un corps de lion.'
    ],
    explanation: 'Les pharaons étaient les rois de l’Égypte ancienne ; la Chine ancienne avait des empereurs.'
  },
  'kids-history-04': {
    statements: [
      'Les Vikings venaient du nord de l’Europe.',
      'Les Vikings vivaient dans le désert du Sahara.',
      'Les Vikings naviguaient sur de longs bateaux en bois.',
      'Beaucoup de Vikings étaient agriculteurs et pêcheurs.',
      'Les Vikings sont arrivés en Amérique du Nord avant Christophe Colomb.'
    ],
    explanation: 'Les Vikings venaient de Scandinavie (Norvège, Suède et Danemark), des régions froides loin du Sahara.'
  },
  'kids-history-05': {
    statements: [
      'L’avion a été inventé avant le vélo.',
      'L’ampoule électrique a été inventée il y a plus de 100 ans.',
      'Le téléphone a été inventé il y a plus de 100 ans.',
      'Les premiers ordinateurs étaient aussi grands qu’une pièce.',
      'Le papier a été inventé en Chine.'
    ],
    explanation: 'Le vélo est apparu au XIXe siècle ; le premier vol en avion date seulement de 1903.'
  },
  'kids-history-06': {
    statements: [
      'Des astronautes ont rapporté des roches lunaires sur Terre.',
      'Youri Gagarine a été la première personne à voyager dans l’espace.',
      'Des humains ont marché sur la Lune pour la première fois en 1969.',
      'Il existe une station spatiale où des astronautes vivent pendant des mois.',
      'Il existe déjà une ville où des gens vivent sur la Lune.'
    ],
    explanation: 'Personne ne vit sur la Lune : seuls 12 astronautes y ont marché, et seulement quelques jours.'
  },
  'kids-history-07': {
    statements: [
      'Rome a été la capitale d’un immense empire.',
      'Les Romains de l’Antiquité avaient une douche électrique chez eux.',
      'Certains ponts en pierre construits par les Romains existent encore aujourd’hui.',
      'Les Romains utilisaient des lettres comme chiffres, par exemple I, V et X.',
      'Beaucoup de mots français viennent du latin.'
    ],
    explanation: 'La douche électrique est une invention moderne ; les Romains allaient aux bains publics, les thermes.'
  },
  'kids-history-08': {
    statements: [
      'Les Incas vivaient en Antarctique.',
      'Les Incas ont construit le Machu Picchu en haut des montagnes.',
      'Les Incas élevaient des lamas.',
      'Les Mayas ont créé leur propre calendrier.',
      'Les Aztèques ont construit une ville sur un lac.'
    ],
    explanation: 'Les Incas vivaient dans la cordillère des Andes, en Amérique du Sud.'
  },
  'kids-history-09': {
    statements: [
      'Marco Polo a voyagé de l’Italie jusqu’en Chine.',
      'Le premier tour du monde en bateau a duré environ trois ans.',
      'Les marins d’autrefois se repéraient grâce aux étoiles.',
      'Christophe Colomb est arrivé en Amérique sur un bateau à vapeur.',
      'Une boussole aide à trouver le nord.'
    ],
    explanation: 'Colomb a navigué en 1492 sur des voiliers ; le bateau à vapeur n’est apparu qu’au XIXe siècle.'
  },
  'kids-history-10': {
    statements: [
      'Les jeux vidéo ont été inventés avant la télévision.',
      'Le cerf-volant a été inventé en Chine.',
      'Le yo-yo est un jouet très ancien.',
      'Les échecs existent depuis plus de mille ans.',
      'Les poupées existaient déjà dans l’Antiquité.'
    ],
    explanation: 'La télévision est apparue dans les années 1920 ; les jeux vidéo sont arrivés des décennies plus tard.'
  },
  'kids-history-11': {
    statements: [
      'Les Grecs anciens racontaient des histoires de héros comme Hercule.',
      'Athènes est une très vieille ville de Grèce.',
      'Les Grecs anciens ont construit des théâtres en plein air.',
      'Le mot alphabet vient des lettres grecques alpha et bêta.',
      'Dans la Grèce antique, on voyageait en train.'
    ],
    explanation: 'Le train à vapeur n’a été inventé qu’au XIXe siècle, plus de deux mille ans plus tard.'
  },
  'kids-history-12': {
    statements: [
      'Avant l’argent, les gens échangeaient des objets entre eux.',
      'Des coquillages ont déjà servi de monnaie.',
      'Autrefois, on payait ses courses avec une carte de crédit.',
      'Les billets de banque ont été inventés en Chine.',
      'Certaines pièces anciennes étaient en or ou en argent.'
    ],
    explanation: 'Les cartes de crédit ne sont apparues qu’au XXe siècle.'
  },
  'kids-history-13': {
    statements: [
      'La statue de la Liberté était un cadeau de la France aux États-Unis.',
      'La tour Eiffel se trouve à Londres.',
      'Le Colisée se trouve à Rome.',
      'La Grande Muraille se trouve en Chine.',
      'Le Christ Rédempteur se trouve à Rio de Janeiro.'
    ],
    explanation: 'La tour Eiffel se trouve à Paris, en France.'
  },
  'kids-history-14': {
    statements: [
      'Mozart composait déjà de la musique quand il était enfant.',
      'La Joconde est un célèbre tableau de Léonard de Vinci.',
      'Mozart composait sa musique sur ordinateur.',
      'Beethoven a continué à composer même après être devenu sourd.',
      'Les hommes préhistoriques peignaient des animaux sur les parois des grottes.'
    ],
    explanation: 'Mozart a vécu au XVIIIe siècle, bien avant l’invention des ordinateurs.'
  },
  'kids-history-15': {
    statements: [
      'Autrefois, beaucoup de charrettes étaient tirées par des chevaux.',
      'Les premiers trains roulaient à la vapeur.',
      'Les frères Wright ont fait l’un des premiers vols en avion.',
      'Les premières voitures étaient plus rapides que celles d’aujourd’hui.',
      'Le Titanic était un navire gigantesque.'
    ],
    explanation: 'Les premières voitures roulaient lentement, à environ 15 km/h.'
  },
  'kids-geography-01': {
    statements: [
      'Le Brésil se trouve en Amérique du Sud.',
      'L’Antarctique est l’endroit le plus chaud de la Terre.',
      'Il y a de la glace aux pôles de la Terre.',
      'Le Pacifique est le plus grand océan du monde.',
      'Il pleut très peu dans les déserts.'
    ],
    explanation: 'L’Antarctique est le continent le plus froid de la Terre.'
  },
  'kids-geography-02': {
    statements: [
      'Le Japon se trouve en Afrique.',
      'Le Kenya se trouve en Afrique.',
      'L’Italie a la forme d’une botte.',
      'Le Canada se trouve en Amérique du Nord.',
      'L’Inde se trouve en Asie.'
    ],
    explanation: 'Le Japon est un pays formé d’îles, en Asie.'
  },
  'kids-geography-03': {
    statements: [
      'L’Amazonie est la plus grande forêt tropicale du monde.',
      'L’Everest est la plus haute montagne du monde.',
      'Certains volcans crachent de la lave brûlante.',
      'Le fleuve Amazone se trouve en Europe.',
      'Le Sahara est un immense désert d’Afrique.'
    ],
    explanation: 'L’Amazone se trouve en Amérique du Sud et traverse le Brésil.'
  },
  'kids-geography-04': {
    statements: [
      'Londres est la capitale du Royaume-Uni.',
      'Tokyo est la capitale du Japon.',
      'Le Caire est la capitale de l’Égypte.',
      'Brasília est la capitale du Brésil.',
      'Paris est la capitale de l’Italie.'
    ],
    explanation: 'Paris est la capitale de la France ; la capitale de l’Italie est Rome.'
  },
  'kids-geography-05': {
    statements: [
      'Une presqu’île est presque entièrement entourée d’eau.',
      'Les rivières coulent vers la mer ou vers un lac.',
      'Une île est entourée de terre de tous les côtés.',
      'Un lac est entouré de terre.',
      'L’eau de mer est salée.'
    ],
    explanation: 'Une île est un morceau de terre entouré d’eau de tous les côtés.'
  },
  'kids-geography-06': {
    statements: [
      'Au Brésil, la langue officielle est le portugais.',
      'Tous les pays du monde parlent la même langue.',
      'Au Mexique, on parle espagnol.',
      'En Chine, beaucoup de gens parlent le mandarin.',
      'Certains pays ont plus d’une langue officielle.'
    ],
    explanation: 'Il existe des milliers de langues dans le monde, et chaque pays en a une ou plusieurs.'
  },
  'kids-geography-07': {
    statements: [
      'Le drapeau du Canada a une feuille rouge.',
      'Le drapeau du Brésil a des étoiles.',
      'Le drapeau du Japon a une étoile jaune.',
      'Le drapeau de l’Italie est vert, blanc et rouge.',
      'Le drapeau des États-Unis a des rayures.'
    ],
    explanation: 'Le drapeau du Japon est blanc avec un disque rouge au milieu.'
  },
  'kids-geography-08': {
    statements: [
      'Le Brésil est le plus petit pays d’Amérique du Sud.',
      'Le Brésil est le pays le plus peuplé d’Amérique du Sud.',
      'L’Argentine est voisine du Brésil.',
      'Le Chili se trouve entre la cordillère des Andes et l’océan Pacifique.',
      'Le Venezuela se trouve au nord de l’Amérique du Sud.'
    ],
    explanation: 'Le Brésil est le plus grand pays d’Amérique du Sud.'
  },
  'kids-geography-09': {
    statements: [
      'Presque toute l’eau de la Terre se trouve dans les océans.',
      'La mer Morte est si salée qu’on y flotte facilement.',
      'Les icebergs sont d’énormes blocs de glace qui flottent sur la mer.',
      'Les vagues sont surtout formées par le vent.',
      'L’eau de mer est de l’eau douce.'
    ],
    explanation: 'L’eau de mer est salée ; on ne peut pas la boire.'
  },
  'kids-geography-10': {
    statements: [
      'Les pôles sont les régions les plus froides de la Terre.',
      'Dans le désert, il peut faire froid la nuit.',
      'Dans beaucoup d’endroits, l’année compte quatre saisons.',
      'Le pôle Nord se trouve sur l’équateur.',
      'Quand c’est l’été au Brésil, c’est l’hiver en Europe.'
    ],
    explanation: 'L’équateur est une ligne imaginaire au milieu de la Terre, loin des pôles.'
  },
  'kids-geography-11': {
    statements: [
      'Un globe terrestre est une boule avec la carte de la Terre.',
      'Sur les cartes, le nord est d’habitude en bas.',
      'Sur les cartes, le bleu représente généralement l’eau.',
      'La rose des vents indique le nord, le sud, l’est et l’ouest.',
      'Une carte peut montrer les rues d’une ville.'
    ],
    explanation: 'Sur la plupart des cartes, le nord est en haut.'
  },
  'kids-geography-12': {
    statements: [
      'Rome se trouve en Espagne.',
      'Venise a des canaux à la place de beaucoup de rues.',
      'Rio de Janeiro a des plages célèbres.',
      'Londres a une tour avec une horloge connue sous le nom de Big Ben.',
      'Paris est au bord de la Seine.'
    ],
    explanation: 'Rome est la capitale de l’Italie.'
  },
  'kids-geography-13': {
    statements: [
      'Les tremblements de terre font trembler le sol.',
      'Une cascade, c’est une rivière qui tombe d’un endroit haut.',
      'Certaines montagnes ont de la neige au sommet toute l’année.',
      'Les volcans n’existent que sur la Lune.',
      'Certaines grottes ont des pointes de pierre suspendues au plafond, les stalactites.'
    ],
    explanation: 'Il y a beaucoup de volcans sur Terre, comme l’Etna en Italie.'
  },
  'kids-geography-14': {
    statements: [
      'Les kangourous vivent en Australie.',
      'Les lions vivent en Afrique.',
      'Les lamas vivent dans les Andes.',
      'Les manchots empereurs vivent en Antarctique.',
      'Les pandas géants vivent en liberté au Brésil.'
    ],
    explanation: 'Les pandas géants vivent dans les forêts de montagne de Chine.'
  },
  'kids-geography-15': {
    statements: [
      'L’océan Atlantique se trouve entre l’Amérique et l’Europe.',
      'Le Nil est l’un des plus longs fleuves du monde.',
      'Le Vatican est le plus grand pays du monde.',
      'L’Australie est entourée d’océans.',
      'La Chine est l’un des pays les plus peuplés du monde.'
    ],
    explanation: 'Le Vatican est le plus petit pays du monde ; le plus grand est la Russie.'
  },
  'kids-science-01': {
    statements: [
      'La Terre a presque la forme d’un ballon.',
      'Le Soleil est une étoile.',
      'Sans le Soleil, la Terre serait froide et sombre.',
      'Jupiter est si grande que plus de mille Terres pourraient tenir dedans.',
      'La Lune produit sa propre lumière, comme une lampe.'
    ],
    explanation: 'La Lune n’a pas de lumière propre : elle brille parce qu’elle renvoie la lumière du Soleil.'
  },
  'kids-science-02': {
    statements: [
      'L’eau bout à 10 degrés Celsius.',
      'La glace, c’est de l’eau gelée.',
      'Quand l’eau bout, elle se transforme en vapeur.',
      'La vapeur d’une douche chaude peut embuer le miroir.',
      'L’air que nous respirons est invisible.'
    ],
    explanation: 'Au niveau de la mer, l’eau bout à 100 degrés Celsius.'
  },
  'kids-science-03': {
    statements: [
      'Le cœur bat plus vite quand on court.',
      'Les os soutiennent notre corps.',
      'Nous utilisons nos poumons pour respirer.',
      'Nous avons cinq sens principaux : la vue, l’ouïe, l’odorat, le goût et le toucher.',
      'Le cœur se trouve dans la tête.'
    ],
    explanation: 'Le cœur se trouve dans la poitrine, un peu à gauche.'
  },
  'kids-science-04': {
    statements: [
      'Tout aimant a un pôle nord et un pôle sud.',
      'Le verre laisse passer la lumière.',
      'Les aimants attirent les morceaux de bois.',
      'Un aimant peut attirer un trombone en métal à travers une feuille de papier.',
      'Le plastique peut être recyclé.'
    ],
    explanation: 'Les aimants attirent certains métaux, comme le fer, mais pas le bois.'
  },
  'kids-science-05': {
    statements: [
      'Les plantes rejettent de l’oxygène dans l’air.',
      'Les plantes poussent mieux dans le noir complet.',
      'Les racines puisent l’eau dans la terre.',
      'Une graine peut devenir une nouvelle plante.',
      'Beaucoup d’arbres perdent leurs feuilles en automne.'
    ],
    explanation: 'Les plantes ont besoin de lumière pour fabriquer leur nourriture.'
  },
  'kids-science-06': {
    statements: [
      'Un arc-en-ciel peut apparaître quand il y a du soleil et de la pluie en même temps.',
      'Mélanger de la peinture bleue et jaune donne du vert.',
      'Un prisme peut séparer la lumière en plusieurs couleurs.',
      'Un arc-en-ciel n’a que deux couleurs.',
      'Les ombres se forment quand quelque chose bloque la lumière.'
    ],
    explanation: 'Un arc-en-ciel a plusieurs couleurs ; on en compte généralement sept.'
  },
  'kids-science-07': {
    statements: [
      'Mars est surnommée la planète rouge.',
      'Mercure est la planète la plus proche du Soleil.',
      'La Terre est la seule planète où l’on sait qu’il y a de la vie.',
      'Vénus est une planète très chaude.',
      'Saturne est la seule planète qui a des anneaux.'
    ],
    explanation: 'Jupiter, Uranus et Neptune ont aussi des anneaux, mais beaucoup plus discrets.'
  },
  'kids-science-08': {
    statements: [
      'Le sang est bleu à l’intérieur du corps.',
      'Les muscles nous aident à bouger.',
      'L’estomac aide à digérer la nourriture.',
      'La peau protège notre corps.',
      'Les enfants perdent leurs dents de lait.'
    ],
    explanation: 'Le sang est toujours rouge ; les veines paraissent seulement bleues à travers la peau.'
  },
  'kids-science-09': {
    statements: [
      'La neige est faite de cristaux de glace.',
      'Quand la glace fond, elle redevient de l’eau.',
      'La glace coule au fond de l’eau.',
      'Le vent, c’est de l’air qui bouge.',
      'Les nuages sont faits de minuscules gouttes d’eau.'
    ],
    explanation: 'La glace est plus légère que l’eau liquide, c’est pourquoi elle flotte.'
  },
  'kids-science-10': {
    statements: [
      'Les fossiles nous aident à connaître les dinosaures.',
      'Le tyrannosaure ne mangeait que des plantes.',
      'Certains dinosaures avaient la taille d’une poule.',
      'Les oiseaux sont de la famille des dinosaures.',
      'On a trouvé des œufs de dinosaures fossilisés.'
    ],
    explanation: 'Le tyrannosaure était carnivore : il mangeait d’autres animaux.'
  },
  'kids-science-11': {
    statements: [
      'L’écho, c’est un son qui revient après avoir rebondi sur quelque chose.',
      'Un chuchotement est moins fort qu’un cri.',
      'Les chauves-souris utilisent des sons pour se repérer dans le noir.',
      'Le son va plus vite que la lumière.',
      'Une guitare fait du son quand ses cordes vibrent.'
    ],
    explanation: 'La lumière est bien plus rapide que le son ; c’est pour ça qu’on voit l’éclair avant d’entendre le tonnerre.'
  },
  'kids-science-12': {
    statements: [
      'Le jour et la nuit existent parce que le Soleil s’éteint.',
      'Une année compte 12 mois.',
      'Une semaine compte sept jours.',
      'Les étoiles sont toujours dans le ciel pendant la journée.',
      'La Lune semble changer de forme au cours du mois.'
    ],
    explanation: 'Le jour et la nuit existent parce que la Terre tourne sur elle-même ; le Soleil ne s’éteint jamais.'
  },
  'kids-science-13': {
    statements: [
      'Les panneaux solaires transforment la lumière du Soleil en électricité.',
      'Les piles stockent de l’énergie.',
      'Recycler le papier aide à épargner des arbres.',
      'On ne peut pas utiliser le vent pour produire de l’énergie.',
      'Éteindre la lumière en quittant une pièce économise de l’énergie.'
    ],
    explanation: 'Les éoliennes utilisent le vent pour produire de l’électricité.'
  },
  'kids-science-14': {
    statements: [
      'Le nez sent les odeurs.',
      'On sent le goût des aliments avec les oreilles.',
      'Les yeux ont besoin de lumière pour voir.',
      'Les oreilles nous aident aussi à garder l’équilibre.',
      'La peau sent le chaud et le froid.'
    ],
    explanation: 'On goûte les aliments avec la langue ; les oreilles servent à entendre.'
  },
  'kids-science-15': {
    statements: [
      'La règle mesure la longueur.',
      'L’horloge mesure le temps.',
      'Le thermomètre mesure le poids des objets.',
      'La loupe fait paraître les choses plus grandes.',
      'Le télescope aide à voir des étoiles lointaines.'
    ],
    explanation: 'Le thermomètre mesure la température ; c’est la balance qui mesure le poids.'
  },
  'kids-animals-01': {
    statements: [
      'Les baleines sont des mammifères.',
      'Les manchots vivent au pôle Nord.',
      'Les lapins ont des dents qui ne s’arrêtent jamais de pousser.',
      'Les grenouilles peuvent faire de très longs sauts.',
      'Les papillons ont d’abord été des chenilles.'
    ],
    explanation: 'Les manchots vivent dans le sud de la planète, comme en Antarctique ; il n’y en a pas au pôle Nord.'
  },
  'kids-animals-02': {
    statements: [
      'Les chevaux mangent de l’herbe et du foin.',
      'Les abeilles butinent les fleurs pour récolter du nectar.',
      'Les vaches pondent des œufs.',
      'Les chiens remuent la queue.',
      'Avec la laine des moutons, on fait des vêtements chauds.'
    ],
    explanation: 'Les vaches sont des mammifères : le veau naît de sa mère et boit son lait.'
  },
  'kids-animals-03': {
    statements: [
      'Les dauphins respirent de l’air.',
      'La pieuvre a huit bras.',
      'Les requins vivent dans la mer.',
      'Le poisson-clown vit dans le désert.',
      'Les étoiles de mer vivent au fond de la mer.'
    ],
    explanation: 'Le poisson-clown vit dans la mer, caché parmi les anémones.'
  },
  'kids-animals-04': {
    statements: [
      'La girafe est l’animal le plus grand du monde.',
      'L’éléphant est le plus petit animal terrestre.',
      'Le paresseux se déplace très lentement.',
      'La baleine bleue est le plus gros animal qui ait jamais existé.',
      'Le colibri peut voler en arrière.'
    ],
    explanation: 'L’éléphant d’Afrique est le plus gros animal terrestre.'
  },
  'kids-animals-05': {
    statements: [
      'Certains serpents sont plus longs qu’une personne.',
      'Les alligators pondent des œufs.',
      'Les caméléons ont une très longue langue.',
      'Une tortue peut sortir de sa carapace et se promener sans elle.',
      'Les lézards se mettent au soleil pour se réchauffer.'
    ],
    explanation: 'La carapace fait partie du corps de la tortue ; elle ne peut jamais en sortir.'
  },
  'kids-animals-06': {
    statements: [
      'Les chouettes chassent la nuit.',
      'Les lucioles font clignoter de petites lumières la nuit.',
      'Les chats voient bien quand il y a peu de lumière.',
      'Les renards vivent dans des terriers.',
      'Les chauves-souris ne voient rien du tout.'
    ],
    explanation: 'Les chauves-souris voient ; beaucoup utilisent aussi des sons pour se repérer.'
  },
  'kids-animals-07': {
    statements: [
      'Les manchots sont des oiseaux qui ne volent pas.',
      'Les dauphins sont des poissons.',
      'L’hippocampe est un poisson.',
      'Les baleines respirent par un trou sur le dessus de la tête.',
      'L’ornithorynque a un bec qui ressemble à celui d’un canard.'
    ],
    explanation: 'Les dauphins sont des mammifères : ils respirent de l’air et boivent du lait quand ils sont petits.'
  },
  'kids-animals-08': {
    statements: [
      'Les fourmis sont les plus gros insectes du monde.',
      'Les insectes ont six pattes.',
      'Les fourmis vivent en groupes appelés colonies.',
      'Les coccinelles sont des insectes.',
      'Les libellules volent très bien.'
    ],
    explanation: 'Les fourmis sont toutes petites ; certains insectes sont bien plus grands, comme certains scarabées et les phasmes.'
  },
  'kids-animals-09': {
    statements: [
      'Les chats ronronnent.',
      'Les chiens ont un très bon odorat.',
      'Les hamsters stockent de la nourriture dans leurs joues.',
      'Les perroquets peuvent répéter des mots qu’ils entendent.',
      'Les chats ont vraiment neuf vies.'
    ],
    explanation: 'Ce n’est qu’une expression : les chats n’ont qu’une seule vie, comme tous les animaux.'
  },
  'kids-animals-10': {
    statements: [
      'Le pic frappe le bois avec son bec.',
      'Les flamants deviennent roses à cause de ce qu’ils mangent.',
      'Le manchot empereur est le plus grand de tous les manchots.',
      'L’autruche enfouit sa tête dans le sable quand elle a peur.',
      'Les chouettes peuvent tourner la tête très loin.'
    ],
    explanation: 'C’est un mythe : l’autruche baisse la tête pour s’occuper de ses œufs ou manger, mais ne l’enfouit jamais.'
  },
  'kids-animals-11': {
    statements: [
      'Un requin-baleine peut être aussi long qu’un bus.',
      'Les tortues marines pondent leurs œufs sur la plage.',
      'Les méduses n’ont pas de cerveau.',
      'Les crabes marchent souvent de côté.',
      'Les requins doivent sortir de l’eau pour respirer.'
    ],
    explanation: 'Les requins respirent sous l’eau grâce à leurs branchies.'
  },
  'kids-animals-12': {
    statements: [
      'Le chameau stocke de l’eau dans sa bosse.',
      'Le chameau peut rester plusieurs jours sans boire.',
      'Le cactus garde de l’eau à l’intérieur.',
      'Le fennec, un renard du désert, a d’énormes oreilles.',
      'Les scorpions vivent souvent dans des endroits chauds et secs.'
    ],
    explanation: 'La bosse du chameau contient de la graisse, pas de l’eau.'
  },
  'kids-animals-13': {
    statements: [
      'Le bébé kangourou grandit dans la poche de sa mère.',
      'Les canetons suivent leur mère en file.',
      'Le bébé kangourou naît de la taille d’un chien.',
      'Les chatons ouvrent les yeux quelques jours après leur naissance.',
      'Les poussins sortent d’un œuf.'
    ],
    explanation: 'Le bébé kangourou naît minuscule, de la taille d’un bonbon, et grandit dans la poche.'
  },
  'kids-animals-14': {
    statements: [
      'Tous les zèbres ont exactement les mêmes rayures.',
      'Les girafes mangent les feuilles en haut des arbres.',
      'Les lions vivent en groupes.',
      'Les hippopotames passent une grande partie de la journée dans l’eau.',
      'Les éléphants utilisent leur trompe pour attraper leur nourriture.'
    ],
    explanation: 'Les rayures de chaque zèbre sont uniques, comme les empreintes digitales d’une personne.'
  },
  'kids-animals-15': {
    statements: [
      'Les vers de terre aident à ameublir le sol.',
      'L’escargot porte sa maison sur son dos.',
      'Les vers de terre ont de grands yeux.',
      'Les araignées tissent des toiles.',
      'Les papillons goûtent les aliments avec leurs pattes.'
    ],
    explanation: 'Les vers de terre n’ont pas d’yeux ; ils sentent la lumière par la peau.'
  },
  'kids-pop-culture-01': {
    statements: [
      'Peppa Pig est une petite cochonne.',
      'Daffy Duck est un canard.',
      'Winnie l’ourson est un lapin.',
      'Dingo est l’ami de Mickey.',
      'Minnie porte un nœud sur la tête.'
    ],
    explanation: 'Winnie l’ourson est un ours qui adore le miel.'
  },
  'kids-pop-culture-02': {
    statements: [
      'Pinocchio est fait de pierre.',
      'La Petite Sirène s’appelle Ariel.',
      'Le Roi Lion se passe en Afrique.',
      'Les Trois Petits Cochons affrontent un loup.',
      'Blanche-Neige croque une pomme empoisonnée.'
    ],
    explanation: 'Pinocchio est une marionnette en bois.'
  },
  'kids-pop-culture-03': {
    statements: [
      'Superman porte une cape rouge.',
      'Wonder Woman a un lasso magique.',
      'Batman n’a pas de superpouvoirs.',
      'Hulk est extrêmement fort.',
      'Spider-Man lance des toiles avec ses yeux.'
    ],
    explanation: 'Spider-Man lance ses toiles depuis ses poignets.'
  },
  'kids-pop-culture-04': {
    statements: [
      'Elsa, dans La Reine des neiges, a des pouvoirs de glace.',
      'Vaiana traverse l’océan en pirogue.',
      'Olaf, dans La Reine des neiges, est un dragon.',
      'Dans Toy Story, les jouets prennent vie quand personne ne regarde.',
      'Dans Encanto, la famille Madrigal a des dons magiques.'
    ],
    explanation: 'Olaf est un bonhomme de neige qui adore les câlins bien chauds.'
  },
  'kids-pop-culture-05': {
    statements: [
      'La guitare a des cordes.',
      'On joue du tambour en tapant dessus.',
      'La flûte est un instrument à vent.',
      'Un piano normal n’a que deux touches.',
      'On joue du violon avec un archet.'
    ],
    explanation: 'Un piano normal a 88 touches.'
  },
  'kids-pop-culture-06': {
    statements: [
      'Le morpion se joue avec des X et des O.',
      'Au morpion, on gagne en faisant une ligne de dix.',
      'À cache-cache, une personne cherche les autres.',
      'La marelle se dessine par terre.',
      'Au jeu de mémoire, on cherche des paires de cartes identiques.'
    ],
    explanation: 'Au morpion, le premier qui aligne trois symboles gagne.'
  },
  'kids-pop-culture-07': {
    statements: [
      'Les Minions sont jaunes.',
      'Donald Duck porte une tenue de marin.',
      'Shrek est vert.',
      'Les Schtroumpfs sont rouges.',
      'Bob l’éponge est jaune.'
    ],
    explanation: 'Les Schtroumpfs sont bleus.'
  },
  'kids-pop-culture-08': {
    statements: [
      'Hansel et Gretel trouvent une maison en friandises.',
      'Le Vilain Petit Canard devient un magnifique cygne.',
      'Dans Jack et le haricot magique, un haricot pousse jusqu’aux nuages.',
      'Le Chat botté porte des bottes.',
      'Le Petit Chaperon rouge va rendre visite à son grand-père.'
    ],
    explanation: 'Le Petit Chaperon rouge va rendre visite à sa grand-mère.'
  },
  'kids-pop-culture-09': {
    statements: [
      'Pluto est un chien.',
      'Mickey Mouse est un chat.',
      'Picsou est très riche.',
      'Daisy est la fiancée de Donald Duck.',
      'Kermit, des Muppets, est une grenouille.'
    ],
    explanation: 'Mickey Mouse est une souris.'
  },
  'kids-pop-culture-10': {
    statements: [
      'Harry Potter a une chouette appelée Hedwige.',
      'Hermione est l’amie de Harry.',
      'Dans Harry Potter, le sport des sorciers s’appelle le Quidditch.',
      'Harry Potter a une cicatrice en forme d’étoile.',
      'Hagrid est très grand.'
    ],
    explanation: 'La cicatrice de Harry Potter a la forme d’un éclair.'
  },
  'kids-pop-culture-11': {
    statements: [
      'Les berceuses servent à réveiller les bébés.',
      'On chante Joyeux anniversaire aux anniversaires.',
      'Le chef d’orchestre dirige l’orchestre.',
      'Une chorale est un groupe de personnes qui chantent ensemble.',
      'Un groupe de rock peut avoir une guitare, une basse et une batterie.'
    ],
    explanation: 'Les berceuses aident les bébés à s’endormir.'
  },
  'kids-pop-culture-12': {
    statements: [
      'Garfield adore les lasagnes.',
      'Snoopy est un chat.',
      'Vil Coyote n’arrive jamais à attraper Bip Bip.',
      'Bugs Bunny adore les carottes.',
      'Woody Woodpecker a un rire célèbre.'
    ],
    explanation: 'Snoopy est un chien, un beagle.'
  },
  'kids-pop-culture-13': {
    statements: [
      'Un cerf-volant vole mieux quand il n’y a pas de vent du tout.',
      'La toupie tourne sur le sol.',
      'Les pièces LEGO s’emboîtent les unes dans les autres.',
      'Le hula hoop tourne autour de la taille.',
      'Les bulles de savon éclatent facilement.'
    ],
    explanation: 'Un cerf-volant a besoin de vent pour monter.'
  },
  'kids-pop-culture-14': {
    statements: [
      'Dans Vice-versa, les émotions sont des personnages.',
      'Dans Cars, les personnages sont des voitures qui parlent.',
      'Dans Les Indestructibles, la famille n’a aucun superpouvoir.',
      'Dans Madagascar, il y a un lion qui s’appelle Alex.',
      'Dans Kung Fu Panda, le héros est un panda.'
    ],
    explanation: 'Dans Les Indestructibles, chaque membre de la famille a un superpouvoir.'
  },
  'kids-pop-culture-15': {
    statements: [
      'Aquaman peut parler aux animaux marins.',
      'Flash court extrêmement vite.',
      'Iron Man porte une armure.',
      'Captain Marvel sait voler.',
      'Black Panther est le roi de l’Atlantide.'
    ],
    explanation: 'Black Panther est le roi du Wakanda.'
  },
  'kids-sports-01': {
    statements: [
      'Au basket, le ballon doit passer dans le panier.',
      'En natation, les sportifs font la course dans une piscine.',
      'Un ballon de foot est carré.',
      'Au tennis, les joueurs utilisent des raquettes.',
      'Au foot, le but du jeu est de marquer des buts.'
    ],
    explanation: 'Un ballon de foot est rond.'
  },
  'kids-sports-02': {
    statements: [
      'Au basket, on peut courir en tenant le ballon sans le faire rebondir.',
      'Le tir à l’arc est un sport olympique.',
      'Un skateboard a quatre petites roues.',
      'Pour patiner sur la glace, on utilise des patins à lame.',
      'La gymnastique comporte des sauts et des roulades.'
    ],
    explanation: 'Au basket, il faut dribbler pour avancer avec le ballon ; sinon l’arbitre siffle une faute.'
  },
  'kids-sports-03': {
    statements: [
      'Des sportifs de nombreux pays participent aux Jeux olympiques.',
      'Il existe aussi des Jeux olympiques d’hiver, avec des sports sur neige et sur glace.',
      'Aux Jeux olympiques, la deuxième place reçoit une médaille de bronze.',
      'Les gymnastes font des acrobaties.',
      'Dans une course, le premier arrivé gagne.'
    ],
    explanation: 'La deuxième place reçoit l’argent ; le bronze va au troisième.'
  },
  'kids-sports-04': {
    statements: [
      'Au judo, les sportifs portent une tenue appelée judogi.',
      'Dans une course de relais, les coureurs se passent un témoin.',
      'Au tir à l’arc, l’athlète vise une cible.',
      'Le judo est un sport qui se joue avec un ballon.',
      'Au saut en hauteur, l’athlète saute par-dessus une barre.'
    ],
    explanation: 'Le judo n’a pas de ballon : c’est un sport où l’on saisit et projette son adversaire.'
  },
  'kids-sports-05': {
    statements: [
      'Au foot, l’arbitre utilise un sifflet.',
      'Au foot, seul le gardien peut toucher le ballon avec les mains, dans sa surface.',
      'Au foot, chaque équipe joue avec 20 joueurs sur le terrain.',
      'Le carton jaune est un avertissement.',
      'La Coupe du monde est un tournoi de foot entre pays.'
    ],
    explanation: 'Chaque équipe de foot joue avec 11 joueurs sur le terrain.'
  },
  'kids-sports-06': {
    statements: [
      'Le canoë se pratique avec une pagaie.',
      'Le surf se pratique sur la neige.',
      'Le plongeur porte un masque pour voir sous l’eau.',
      'La brasse est une nage.',
      'En voile, les bateaux avancent grâce au vent.'
    ],
    explanation: 'Le surf se pratique sur les vagues de la mer.'
  },
  'kids-sports-07': {
    statements: [
      'Le 100 mètres est une course courte et très rapide.',
      'Courir aide à rendre le cœur plus fort.',
      'Avant de faire du sport, il est bon de s’échauffer.',
      'Les coureurs portent des chaussures faites pour courir.',
      'Un marathon ne fait que 100 mètres.'
    ],
    explanation: 'Un marathon fait environ 42 kilomètres.'
  },
  'kids-sports-08': {
    statements: [
      'L’échiquier a des cases claires et des cases foncées.',
      'Aux échecs, toutes les pièces se déplacent de la même façon.',
      'Chaque joueur d’échecs commence avec 16 pièces.',
      'Le roi est la pièce la plus importante aux échecs.',
      'Les échecs sont aussi considérés comme un sport.'
    ],
    explanation: 'Chaque pièce se déplace à sa façon ; le cavalier, par exemple, se déplace en L.'
  },
  'kids-sports-09': {
    statements: [
      'Au ping-pong, la table a un petit filet au milieu.',
      'Une balle de tennis est généralement jaune.',
      'Au golf, il y a des trous dans le gazon.',
      'Au ping-pong, la balle est très lourde.',
      'Au bowling, la boule a des trous pour les doigts.'
    ],
    explanation: 'La balle de ping-pong est très légère et creuse.'
  },
  'kids-sports-10': {
    statements: [
      'Les joueurs de hockey sur glace patinent pieds nus.',
      'Le ski se pratique sur la neige.',
      'Le curling se joue sur la glace avec des pierres.',
      'Les patineurs artistiques tournent sur la glace.',
      'La luge glisse sur la neige.'
    ],
    explanation: 'Les joueurs de hockey sur glace portent des patins à lame.'
  },
  'kids-sports-11': {
    statements: [
      'Michael Phelps a gagné beaucoup de médailles en natation.',
      'Serena Williams est une grande championne de tennis.',
      'Simone Biles est une gymnaste célèbre.',
      'Michael Jordan était une star du basket.',
      'Pelé était un célèbre joueur de basket.'
    ],
    explanation: 'Pelé, du Brésil, a été l’un des plus grands footballeurs de l’histoire.'
  },
  'kids-sports-12': {
    statements: [
      'Un ballon de basket est généralement orange.',
      'Au basket, le panier est posé par terre.',
      'Le baseball se joue avec une batte.',
      'Le football américain utilise un ballon ovale.',
      'Au basket, l’équipe qui marque le plus de points gagne.'
    ],
    explanation: 'Le panier de basket est en hauteur, à environ 3 mètres du sol.'
  },
  'kids-sports-13': {
    statements: [
      'Le cycliste porte un casque pour se protéger.',
      'En BMX, les vélos font des figures et des sauts.',
      'Pédaler fait avancer le vélo.',
      'Les vélos de course ont cinq roues.',
      'Le vélo a un guidon pour tourner.'
    ],
    explanation: 'Les vélos de course ont deux roues.'
  },
  'kids-sports-14': {
    statements: [
      'Au karaté, les ceintures de couleur montrent le niveau du combattant.',
      'La boxe est un sport de combat avec des gants.',
      'Le sumo est un sport traditionnel du Japon.',
      'Le taekwondo utilise beaucoup de coups de pied.',
      'La ceinture noire est la première ceinture du karaté.'
    ],
    explanation: 'La première ceinture du karaté est la blanche ; la noire arrive après des années d’entraînement.'
  },
  'kids-sports-15': {
    statements: [
      'Au foot, l’équipe qui encaisse le plus de buts gagne.',
      'Les supporters vont au stade pour voir le match.',
      'L’équipe qui gagne un championnat reçoit un trophée.',
      'Chaque équipe porte un maillot à ses couleurs.',
      'Le gardien protège le but.'
    ],
    explanation: 'Au foot, l’équipe qui marque le plus de buts gagne.'
  },
  'kids-weird-facts-01': {
    statements: [
      'Les koalas dorment jusqu’à 20 heures par jour.',
      'Chez les hippocampes, c’est le père qui porte les petits dans son ventre.',
      'Les loutres de mer se tiennent la main en dormant pour ne pas dériver.',
      'Les pieuvres n’ont qu’un seul cœur.',
      'L’œil de l’autruche est plus gros que son cerveau.'
    ],
    explanation: 'Les pieuvres ont trois cœurs.'
  },
  'kids-weird-facts-02': {
    statements: [
      'Les crottes du wombat ont la forme d’un cube.',
      'Certains manchots offrent des cailloux à leur partenaire.',
      'Les vaches marron donnent du lait chocolaté.',
      'Les abeilles dansent pour montrer aux autres où sont les fleurs.',
      'Les chats passent beaucoup de temps à se lécher pour se laver.'
    ],
    explanation: 'Toutes les vaches donnent du lait blanc ; le lait chocolaté est fait en ajoutant du chocolat.'
  },
  'kids-weird-facts-03': {
    statements: [
      'Les chats marchent sur la pointe des doigts.',
      'Les mouches vivent plus de dix ans.',
      'La truffe de chaque chien a un dessin unique, comme une empreinte digitale.',
      'Les limaces laissent une trace brillante derrière elles.',
      'Les cochons se roulent dans la boue pour se rafraîchir.'
    ],
    explanation: 'La plupart des mouches ne vivent que quelques semaines.'
  },
  'kids-weird-facts-04': {
    statements: [
      'Un éclair est plus chaud que la surface du Soleil.',
      'Un nuage peut peser plus lourd qu’un avion.',
      'On peut voir la Grande Muraille de Chine depuis la Lune à l’œil nu.',
      'Sur Vénus, un jour dure plus longtemps qu’une année.',
      'Les méduses existaient déjà avant les dinosaures.'
    ],
    explanation: 'Depuis la Lune, on ne voit pas la Muraille à l’œil nu : elle est longue, mais bien trop étroite.'
  },
  'kids-weird-facts-05': {
    statements: [
      'La foudre ne peut jamais frapper deux fois le même point.',
      'Les bébés naissent avec plus d’os que les adultes.',
      'Les pommes flottent dans l’eau.',
      'On ne peut pas fredonner en se bouchant bien le nez.',
      'L’os le plus long du corps se trouve dans la cuisse.'
    ],
    explanation: 'La foudre peut tomber plusieurs fois au même endroit, surtout sur les grands bâtiments.'
  },
  'kids-weird-facts-06': {
    statements: [
      'Les chouettes ne peuvent pas bouger les yeux, alors elles tournent la tête.',
      'Les dauphins dorment avec une moitié du cerveau à la fois.',
      'L’estomac de la vache est divisé en quatre parties.',
      'Les plumes des canards empêchent l’eau d’entrer.',
      'Les poissons ferment les yeux pour dormir.'
    ],
    explanation: 'La plupart des poissons n’ont pas de paupières, ils dorment donc les yeux ouverts.'
  },
  'kids-weird-facts-07': {
    statements: [
      'La peau de l’ours polaire est blanche.',
      'L’épaisse fourrure de l’ours polaire l’aide à rester au chaud.',
      'Les manchots empereurs se serrent les uns contre les autres pour se réchauffer.',
      'Les phoques ont une épaisse couche de graisse.',
      'Le renard polaire devient blanc en hiver.'
    ],
    explanation: 'Sous sa fourrure claire, la peau de l’ours polaire est noire, ce qui l’aide à garder la chaleur.'
  },
  'kids-weird-facts-08': {
    statements: [
      'Les bébés naissent sans rotules en os ; les leurs sont en cartilage.',
      'Quand on a froid, on a la chair de poule.',
      'Les cheveux poussent un tout petit peu chaque jour.',
      'Un éternuement sort du nez très vite.',
      'Notre langue ne sent le goût que sur le bout.'
    ],
    explanation: 'Toute la langue perçoit les saveurs ; la fameuse carte de la langue est un mythe.'
  },
  'kids-weird-facts-09': {
    statements: [
      'Certaines pieuvres changent de couleur en moins d’une seconde.',
      'Le phasme ressemble à une brindille.',
      'Certains papillons ont sur les ailes des dessins qui ressemblent à des yeux.',
      'Les caméléons changent de couleur pour copier n’importe quel motif, même un échiquier.',
      'Le harfang des neiges est blanc et se cache bien dans la neige.'
    ],
    explanation: 'Les caméléons changent de couleur surtout selon la température et leur humeur, pas pour copier le décor.'
  },
  'kids-weird-facts-10': {
    statements: [
      'Les éléphants peuvent sentir des sons avec leurs pieds.',
      'Le colibri bat des ailes très vite.',
      'La langue du fourmilier est très longue.',
      'Les kangourous utilisent leur queue pour garder l’équilibre.',
      'Les girafes ont 30 os dans le cou.'
    ],
    explanation: 'Les girafes n’ont que sept os dans le cou, comme nous ; chacun est juste très long.'
  },
  'kids-weird-facts-11': {
    statements: [
      'La lumière du Soleil met environ 8 minutes pour arriver sur Terre.',
      'Le Soleil est la plus grande étoile qui existe.',
      'Il n’y a pas de vent sur la Lune.',
      'Les astronautes grandissent un petit peu dans l’espace.',
      'Les scientifiques estiment qu’il y a plus d’étoiles dans l’univers que de grains de sable sur toutes les plages de la Terre.'
    ],
    explanation: 'Le Soleil est une étoile moyenne ; il existe des étoiles beaucoup, beaucoup plus grandes.'
  },
  'kids-weird-facts-12': {
    statements: [
      'Il existe des bananes rouges.',
      'La pomme de terre pousse sous la terre.',
      'Le pop-corn vient d’une variété spéciale de maïs.',
      'Pour les botanistes, la tomate n’est pas un fruit.',
      'Le kiwi a une peau toute poilue.'
    ],
    explanation: 'Pour les botanistes, la tomate est un fruit, car elle vient d’une fleur et contient des graines.'
  },
  'kids-weird-facts-13': {
    statements: [
      'Les éléphants peuvent sauter très haut.',
      'Les kangourous font des bonds énormes.',
      'Les puces sautent à plusieurs fois leur propre taille.',
      'Les dauphins sautent hors de l’eau.',
      'Les sauterelles ont des pattes puissantes pour sauter.'
    ],
    explanation: 'Les éléphants sont trop lourds pour sauter ; ils ne décollent jamais leurs quatre pattes du sol en même temps.'
  },
  'kids-weird-facts-14': {
    statements: [
      'Certaines plantes mangent des insectes.',
      'Le bambou est l’une des plantes qui poussent le plus vite.',
      'Les plus vieux arbres du monde n’ont que 100 ans.',
      'Les jeunes tournesols suivent le Soleil pendant la journée.',
      'Certains champignons brillent dans le noir.'
    ],
    explanation: 'Certains arbres ont plus de 4 000 ans, comme certains pins des États-Unis.'
  },
  'kids-weird-facts-15': {
    statements: [
      'Une journée compte 24 heures.',
      'Février est le mois le plus long de l’année.',
      'Une heure compte 60 minutes.',
      'Une minute compte 60 secondes.',
      'Un siècle compte 100 ans.'
    ],
    explanation: 'Février est le mois le plus court : il a 28 jours, ou 29 les années bissextiles.'
  }
};

export default kids;
