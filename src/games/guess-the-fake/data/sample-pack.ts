import type { ContentPack } from '../../../core/content-packs/content-packs';
import type { GuessTheFakeDifficulty, GuessTheFakeRound, LocalizedText } from '../types';

export type GuessTheFakePackContent = {
  categories: Array<{ id: string; title: Record<string, string> }>;
  rounds: GuessTheFakeRound[];
};

type RoundSeed = {
  id: string;
  categoryId: string;
  difficulty: GuessTheFakeDifficulty;
  fakeIndex: number;
  explanation: LocalizedText;
  statements: LocalizedText[];
};

const categories = [
  { id: 'history', title: { pt: 'História', en: 'History' } },
  { id: 'geography', title: { pt: 'Geografia', en: 'Geography' } },
  { id: 'science', title: { pt: 'Ciência', en: 'Science' } },
  { id: 'animals', title: { pt: 'Animais', en: 'Animals' } },
  { id: 'pop-culture', title: { pt: 'Cultura pop', en: 'Pop culture' } },
  { id: 'sports', title: { pt: 'Esportes', en: 'Sports' } },
  { id: 'weird-facts', title: { pt: 'Fatos bizarros', en: 'Weird facts' } }
];

const seeds: RoundSeed[] = [
  seed('history-1', 'history', 'easy', 2, 'A primeira pessoa a pisar na Lua foi Neil Armstrong, em 1969.', 'Neil Armstrong walked on the Moon in 1969.', ['A Grande Pirâmide de Gizé fica no Egito.', 'A imprensa de Gutenberg ajudou a espalhar livros na Europa.', 'A primeira pessoa na Lua foi Marco Polo.', 'A Revolução Francesa começou em 1789.', 'Cleópatra governou o Egito.']),
  seed('history-2', 'history', 'easy', 4, 'A Muralha da China foi erguida em trechos durante muitas dinastias, não em um único fim de semana.', 'The Great Wall was built in sections across many dynasties, not in one weekend.', ['O Império Romano teve capital em Roma.', 'A Idade Média veio antes do Renascimento.', 'Dom Pedro I proclamou a independência do Brasil.', 'A escrita cuneiforme surgiu na Mesopotâmia.', 'A Muralha da China foi construída em um fim de semana.']),
  seed('history-3', 'history', 'medium', 1, 'A Guerra dos Cem Anos durou mais de cem anos em uma série de conflitos.', 'The Hundred Years War lasted more than one hundred years across multiple conflicts.', ['A Guerra Fria envolveu disputa entre EUA e URSS.', 'A Guerra dos Cem Anos durou exatamente cem dias.', 'A pólvora foi usada na China antiga.', 'O calendário gregoriano foi introduzido no século XVI.', 'A Biblioteca de Alexandria ficava no Egito.']),
  seed('history-4', 'history', 'medium', 0, 'Os vikings navegaram pelo Atlântico Norte muito antes do motor a vapor.', 'Vikings crossed the North Atlantic long before steam engines existed.', ['Os vikings usavam motores a vapor em seus navios.', 'A peste negra afetou a Europa no século XIV.', 'A Magna Carta foi assinada na Inglaterra.', 'O Japão teve um longo período feudal.', 'A Rota da Seda conectou mercados da Eurásia.']),
  seed('history-5', 'history', 'hard', 3, 'O Código de Hamurabi é associado à Babilônia, não ao Império Asteca.', 'The Code of Hammurabi is associated with Babylon, not the Aztec Empire.', ['A civilização maia desenvolveu calendários complexos.', 'A Pedra de Roseta ajudou a decifrar hieróglifos.', 'Mansa Musa governou o Império do Mali.', 'O Código de Hamurabi foi criado pelos astecas.', 'A queda de Constantinopla ocorreu em 1453.']),
  seed('history-6', 'history', 'hard', 4, 'O Titanic afundou em 1912, não no século XVIII.', 'Titanic sank in 1912, not in the 18th century.', ['A Primeira Guerra Mundial começou em 1914.', 'A Liga das Nações surgiu após a Primeira Guerra.', 'A Bauhaus foi uma escola influente de design.', 'A corrida espacial teve marco em 1969 com a Lua.', 'O Titanic afundou em 1789.']),
  seed('history-7', 'history', 'medium', 2, 'A capital do Império Inca era Cusco.', 'The Inca capital was Cusco.', ['A civilização inca construiu Machu Picchu.', 'A domesticação do cavalo mudou guerras e transporte.', 'A capital inca era Helsinki.', 'A pólis de Atenas ficava na Grécia.', 'O Canal do Panamá abriu no século XX.']),
  seed('history-8', 'history', 'easy', 1, 'A Torre Eiffel fica em Paris, na França.', 'The Eiffel Tower is in Paris, France.', ['O Coliseu fica em Roma.', 'A Torre Eiffel fica em Madrid.', 'A Estátua da Liberdade fica em Nova York.', 'O Taj Mahal fica na Índia.', 'Petra fica na Jordânia.']),

  seed('geography-1', 'geography', 'easy', 2, 'A Austrália é enorme; o menor país reconhecido é o Vaticano.', 'Australia is huge; Vatican City is the smallest widely recognized country.', ['O Brasil tem mais de 8 milhões de quilômetros quadrados.', 'O Japão é formado por milhares de ilhas.', 'A Austrália é o menor país do mundo.', 'O Canadá tem duas línguas oficiais no governo federal.', 'A Antártida é o continente mais frio.']),
  seed('geography-2', 'geography', 'easy', 1, 'O Saara fica no norte da África.', 'The Sahara is in northern Africa.', ['O deserto do Saara fica no continente africano.', 'O deserto do Saara fica principalmente na Ásia.', 'A Cordilheira dos Andes atravessa a América do Sul.', 'Portugal está na Península Ibérica.', 'O Oceano Pacífico é o maior oceano do planeta.']),
  seed('geography-3', 'geography', 'easy', 0, 'Buenos Aires é a capital da Argentina.', 'Buenos Aires is the capital of Argentina.', ['Montevidéu é a capital da Argentina.', 'Lima é a capital do Peru.', 'Santiago é a capital do Chile.', 'Bogotá é a capital da Colômbia.', 'Quito é a capital do Equador.']),
  seed('geography-4', 'geography', 'medium', 3, 'A Islândia fica no Atlântico Norte, não no Mediterrâneo.', 'Iceland is in the North Atlantic, not the Mediterranean.', ['O rio Nilo passa por vários países africanos.', 'A Cordilheira do Himalaia abriga o Everest.', 'A Groenlândia é uma ilha muito grande.', 'A Islândia fica no Mar Mediterrâneo.', 'Madagascar fica perto da costa leste da África.']),
  seed('geography-5', 'geography', 'medium', 4, 'A linha do Equador passa pela América do Sul, África e Ásia insular, mas não pela Europa continental.', 'The Equator crosses South America, Africa, and island Asia, not mainland Europe.', ['O Equador passa pelo Brasil.', 'O meridiano de Greenwich passa pelo Reino Unido.', 'O Chile tem uma costa longa no Pacífico.', 'A Rússia atravessa muitos fusos horários.', 'A linha do Equador corta a Alemanha.']),
  seed('geography-6', 'geography', 'hard', 1, 'Lesoto é enclavado pela África do Sul, não pelo Canadá.', 'Lesotho is enclosed by South Africa, not Canada.', ['San Marino fica dentro da Itália.', 'Lesoto fica completamente dentro do Canadá.', 'O Nepal não tem saída para o mar.', 'Bolívia e Paraguai não têm litoral marítimo.', 'Singapura é uma cidade-estado insular.']),
  seed('geography-7', 'geography', 'hard', 2, 'O Mar Cáspio é um grande corpo d água interior, frequentemente chamado de lago.', 'The Caspian Sea is an inland body of water often described as a lake.', ['O Mar Morto é muito salgado.', 'O Lago Baikal é muito profundo.', 'O Mar Cáspio é uma montanha.', 'O Canal de Suez liga mares estratégicos.', 'A Patagônia fica no sul da América do Sul.']),

  seed('science-1', 'science', 'easy', 3, 'O som precisa de um meio material; no vácuo ele não se propaga.', 'Sound needs a material medium; it does not travel through vacuum.', ['A água ferve a temperaturas diferentes dependendo da altitude.', 'Plantas usam luz na fotossíntese.', 'O coração humano possui quatro câmaras.', 'O som se propaga perfeitamente no vácuo.', 'A Lua influencia as marés da Terra.']),
  seed('science-2', 'science', 'easy', 4, 'Aranhas são aracnídeos, não insetos.', 'Spiders are arachnids, not insects.', ['Insetos adultos normalmente têm seis pernas.', 'Mamíferos alimentam filhotes com leite.', 'A Terra gira em torno do próprio eixo.', 'Répteis são animais vertebrados.', 'Aranhas são insetos porque têm oito pernas.']),
  seed('science-3', 'science', 'medium', 0, 'Vênus é mais quente na superfície que Mercúrio por causa de sua atmosfera densa.', 'Venus is hotter at the surface than Mercury because of its dense atmosphere.', ['Mercúrio é o planeta mais quente do Sistema Solar.', 'A luz branca pode ser separada em cores.', 'O DNA carrega informação genética.', 'Bactérias podem se multiplicar rapidamente.', 'Elétrons têm carga negativa.']),
  seed('science-4', 'science', 'medium', 2, 'O sangue humano é vermelho por causa da hemoglobina; veias parecem azuladas por efeitos de luz e pele.', 'Human blood is red because of hemoglobin; veins can look bluish because of light and skin.', ['A gravidade atrai massas.', 'O gelo é menos denso que a água líquida.', 'O sangue humano é naturalmente azul dentro do corpo.', 'A eletricidade pode gerar campo magnético.', 'Vírus precisam de células para se replicar.']),
  seed('science-5', 'science', 'hard', 1, 'O zero absoluto é um limite físico, não uma temperatura comum de cozinha.', 'Absolute zero is a physical limit, not a common kitchen temperature.', ['A tabela periódica organiza elementos químicos.', 'Zero absoluto é a temperatura de um forno doméstico.', 'O carbono pode formar diamante e grafite.', 'A fotossíntese libera oxigênio em plantas e algas.', 'A velocidade da luz no vácuo é muito alta.']),
  seed('science-6', 'science', 'hard', 4, 'Ano-luz é medida de distância, não de tempo.', 'A light-year is a measure of distance, not time.', ['Neurônios transmitem sinais no sistema nervoso.', 'O pH mede acidez ou basicidade.', 'A pressão aumenta em águas profundas.', 'Isótopos têm números diferentes de nêutrons.', 'Ano-luz mede quanto tempo dura um ano.']),
  seed('science-7', 'science', 'medium', 3, 'A camada de ozônio fica principalmente na estratosfera.', 'The ozone layer is mainly in the stratosphere.', ['Raios UV podem danificar a pele.', 'Vacinas treinam o sistema imune.', 'A energia não é criada do nada em sistemas fechados.', 'A camada de ozônio fica dentro do núcleo da Terra.', 'Fungos não são plantas.']),
  seed('science-8', 'science', 'easy', 1, 'A Terra leva cerca de 365 dias para orbitar o Sol.', 'Earth takes about 365 days to orbit the Sun.', ['A Terra orbita o Sol.', 'A Terra leva cerca de 24 horas para orbitar o Sol.', 'A água pode existir como sólido, líquido e gás.', 'Ímãs têm polos.', 'O Sol é uma estrela.']),

  seed('animals-1', 'animals', 'easy', 2, 'Golfinhos são mamíferos marinhos.', 'Dolphins are marine mammals.', ['Pinguins são aves.', 'Morcegos são mamíferos.', 'Golfinhos são peixes com brânquias.', 'Abelhas ajudam na polinização.', 'Elefantes têm tromba.']),
  seed('animals-2', 'animals', 'easy', 4, 'Polvos têm oito braços.', 'Octopuses have eight arms.', ['Camaleões podem mudar de cor.', 'Tubarões existem há milhões de anos.', 'Corujas são aves de rapina.', 'Cangurus carregam filhotes em bolsa.', 'Polvos têm exatamente duas pernas e duas asas.']),
  seed('animals-3', 'animals', 'medium', 0, 'Orcas são golfinhos, não baleias verdadeiras.', 'Orcas are dolphins, not true whales.', ['Orcas são pequenos insetos aquáticos.', 'Baleias respiram ar.', 'Formigas vivem em colônias.', 'Tartarugas podem viver muitos anos.', 'Lulas têm tentáculos.']),
  seed('animals-4', 'animals', 'medium', 3, 'O ornitorrinco é mamífero que põe ovos.', 'The platypus is an egg-laying mammal.', ['Aves possuem penas.', 'Cobras sentem vibrações pelo corpo.', 'Girafas têm pescoço longo.', 'Ornitorrincos são aves porque botam ovos.', 'Rãs passam por metamorfose.']),
  seed('animals-5', 'animals', 'hard', 1, 'Axolotes são anfíbios, conhecidos por regeneração.', 'Axolotls are amphibians known for regeneration.', ['Cavalos-marinhos machos carregam ovos.', 'Axolotes são tipos de cogumelo.', 'Narvais têm uma presa longa.', 'Cupins podem construir ninhos complexos.', 'Peixes-palhaço vivem com anêmonas.']),
  seed('animals-6', 'animals', 'hard', 4, 'Koalas são marsupiais e se alimentam muito de eucalipto.', 'Koalas are marsupials that eat lots of eucalyptus.', ['Preguiças se movem lentamente.', 'Rinocerontes têm chifres de queratina.', 'Lontras usam ferramentas simples.', 'Flamingos podem ficar rosados pela alimentação.', 'Koalas são ursos polares pequenos.']),
  seed('animals-7', 'animals', 'medium', 2, 'Pandas pertencem à família dos ursos.', 'Pandas belong to the bear family.', ['Pandas comem muito bambu.', 'Tigres são felinos.', 'Pandas são répteis de casco duro.', 'Águias têm visão aguçada.', 'Lobos vivem em grupos sociais.']),

  seed('pop-1', 'pop-culture', 'easy', 1, 'Mario é associado à Nintendo.', 'Mario is associated with Nintendo.', ['Star Wars estreou nos cinemas em 1977.', 'Mario foi criado pela Sega para ser rival de Sonic.', 'O Oscar premia cinema.', 'Super-heróis aparecem em quadrinhos e filmes.', 'Pokémon começou como videogame.']),
  seed('pop-2', 'pop-culture', 'easy', 4, 'Sherlock Holmes foi criado por Arthur Conan Doyle.', 'Sherlock Holmes was created by Arthur Conan Doyle.', ['Harry Potter estudou em Hogwarts.', 'O Mickey Mouse é personagem da Disney.', 'The Beatles foi uma banda britânica.', 'O cinema usa frames para criar movimento.', 'Sherlock Holmes foi criado por Machado de Assis.']),
  seed('pop-3', 'pop-culture', 'medium', 2, 'O primeiro Toy Story foi lançado em 1995.', 'The first Toy Story was released in 1995.', ['Streaming mudou a forma de assistir séries.', 'Animação stop motion usa objetos quadro a quadro.', 'Toy Story estreou em 1895.', 'K-pop se refere à música pop coreana.', 'Cosplay envolve fantasia de personagens.']),
  seed('pop-4', 'pop-culture', 'medium', 0, 'O controle do PlayStation original tinha botões com símbolos geométricos.', 'The original PlayStation controller used geometric symbol buttons.', ['O controle original do PlayStation tinha teclas de piano.', 'Muitos filmes têm trilhas sonoras compostas especialmente.', 'Mangá é quadrinho japonês.', 'Festivais de cinema exibem estreias e mostras.', 'Memes se espalham rápido na internet.']),
  seed('pop-5', 'pop-culture', 'hard', 3, 'O Wilhelm scream é um efeito sonoro famoso reutilizado em muitos filmes.', 'The Wilhelm scream is a famous sound effect reused in many films.', ['O termo blockbuster é usado para grandes sucessos comerciais.', 'Easter eggs são referências escondidas.', 'Dublagem substitui falas por outro idioma.', 'O Wilhelm scream é uma receita de bolo alemã.', 'Storyboards ajudam a planejar cenas.']),
  seed('pop-6', 'pop-culture', 'hard', 1, 'A Comic-Con começou ligada a fãs de quadrinhos e cultura pop.', 'Comic-Con grew from comics and pop culture fandom.', ['Vinil voltou a ter colecionadores.', 'Comic-Con é um campeonato de xadrez subaquático.', 'Podcasts podem ser séries de áudio.', 'Fan art é arte feita por fãs.', 'Remakes recontam obras antigas.']),
  seed('pop-7', 'pop-culture', 'medium', 4, 'Sonic é conhecido como personagem da Sega.', 'Sonic is known as a Sega character.', ['Sonic é um ouriço azul veloz.', 'Minecraft popularizou construção em blocos.', 'O Grammy premia música.', 'Videoclipes ajudam a divulgar canções.', 'Sonic é o mascote oficial da NASA.']),

  seed('sports-1', 'sports', 'easy', 2, 'No futebol, cada time começa com 11 jogadores em campo.', 'In association football, each team starts with 11 players on the field.', ['Uma maratona tem pouco mais de 42 km.', 'Basquete usa cesta e bola.', 'No futebol, cada time começa com 3 jogadores em campo.', 'Tênis pode ser jogado em duplas.', 'Vôlei tem rede dividindo a quadra.']),
  seed('sports-2', 'sports', 'easy', 0, 'A Copa do Mundo masculina de futebol acontece a cada quatro anos.', 'The men football World Cup is held every four years.', ['A Copa do Mundo de futebol acontece todo mês.', 'Natação tem estilos como crawl e peito.', 'Judô é uma arte marcial olímpica.', 'Xadrez tem peças como rei e rainha.', 'Atletismo inclui corridas e saltos.']),
  seed('sports-3', 'sports', 'medium', 4, 'O beisebol usa bases e entradas, não gols.', 'Baseball uses bases and innings, not goals.', ['Golfe usa tacos.', 'Rugby envolve carregar e chutar a bola oval.', 'Tênis de mesa também é chamado pingue-pongue.', 'Boxe usa rounds.', 'Beisebol é vencido marcando gols em traves.']),
  seed('sports-4', 'sports', 'medium', 1, 'A bola de basquete não é cúbica.', 'A basketball is not cube-shaped.', ['O Tour de France é uma prova de ciclismo.', 'A bola de basquete oficial é cúbica.', 'Fórmula 1 envolve corridas de carros.', 'Handebol é jogado com as mãos.', 'Esqui pode ser praticado na neve.']),
  seed('sports-5', 'sports', 'hard', 3, 'No críquete, wickets são elementos centrais do jogo.', 'Wickets are central elements in cricket.', ['Sumô é tradicional no Japão.', 'Curling é jogado no gelo.', 'Pentatlo moderno combina cinco provas.', 'Críquete é jogado exclusivamente debaixo d água.', 'Badminton usa uma peteca.']),
  seed('sports-6', 'sports', 'hard', 2, 'O decatlo tem dez provas.', 'Decathlon has ten events.', ['Triatlo combina natação, ciclismo e corrida.', 'Escalada esportiva virou modalidade olímpica.', 'Decatlo tem apenas duas provas.', 'Surfe depende de ondas.', 'Bocha envolve lançar bolas perto de um alvo.']),
  seed('sports-7', 'sports', 'medium', 4, 'No tênis, love significa zero no placar.', 'In tennis, love means zero in the score.', ['No tênis, saque inicia o ponto.', 'A NBA é uma liga de basquete.', 'Kart é porta de entrada para muitos pilotos.', 'Ginástica artística tem aparelhos.', 'No tênis, love significa cem pontos.']),

  seed('weird-1', 'weird-facts', 'easy', 3, 'Bananas são botanicamente bagas; morangos não são bagas verdadeiras.', 'Bananas are botanical berries; strawberries are not true berries.', ['Mel pode durar muito tempo quando bem armazenado.', 'Polvos têm sangue azulado.', 'O espaço tem cheiro percebido em equipamentos por astronautas.', 'Morangos são bagas verdadeiras e bananas não.', 'Um raio pode aquecer o ar intensamente.']),
  seed('weird-2', 'weird-facts', 'easy', 1, 'O som do pato ecoa; o mito de que não ecoa é falso.', 'A duck quack can echo; the no-echo claim is a myth.', ['Gatos têm bigodes sensíveis.', 'O grasnar do pato não produz eco em nenhuma condição.', 'Algumas plantas carnívoras capturam insetos.', 'O cheiro é ligado à memória.', 'O gelo seco é dióxido de carbono sólido.']),
  seed('weird-3', 'weird-facts', 'medium', 4, 'A Torre de Pisa é inclinada, mas não gira lentamente.', 'The Leaning Tower of Pisa leans, but it does not slowly rotate.', ['Existe chuva de diamantes prevista em gigantes gasosos.', 'Alguns fungos brilham no escuro.', 'A língua humana tem milhares de papilas.', 'O nariz e as orelhas mudam ao longo da vida.', 'A Torre de Pisa gira uma vez por ano.']),
  seed('weird-4', 'weird-facts', 'medium', 0, 'O Monte Everest é o mais alto acima do nível do mar; Mauna Kea é maior se medido desde a base submarina.', 'Everest is highest above sea level; Mauna Kea is taller if measured from its underwater base.', ['O Everest fica dentro de um shopping.', 'Algumas águas-vivas parecem imortais biologicamente.', 'A pipoca estoura por vapor interno.', 'Uma nuvem pode pesar muitas toneladas.', 'O cheiro de chuva tem nome: petricor.']),
  seed('weird-5', 'weird-facts', 'hard', 2, 'O coração de uma baleia azul é enorme, mas não tem tamanho de um ônibus urbano inteiro.', 'A blue whale heart is enormous, but not the size of a whole city bus.', ['Alguns caracóis podem dormir por longos períodos.', 'A água-viva não tem cérebro como vertebrados.', 'O coração da baleia azul tem o tamanho de um ônibus inteiro.', 'O camarão mantis vê muitos tipos de luz.', 'Alguns metais são líquidos perto da temperatura ambiente.']),
  seed('weird-6', 'weird-facts', 'hard', 1, 'O vidro é um sólido amorfo, não um líquido escorrendo em janelas antigas.', 'Glass is an amorphous solid, not a liquid flowing in old windows.', ['O cheiro de baunilha também aparece em castóreo usado historicamente em aromas.', 'Vidro de janela escorre como água ao longo dos séculos.', 'A lagosta já foi comida barata em alguns lugares.', 'Raios podem atingir o mesmo lugar várias vezes.', 'O corpo humano tem mais células bacterianas do que muita gente imagina.']),
  seed('weird-7', 'weird-facts', 'medium', 3, 'O polvo tem três corações.', 'An octopus has three hearts.', ['A casca do ovo tem poros.', 'Alguns lagartos soltam a cauda.', 'As pegadas na Lua podem durar muito tempo.', 'Polvos têm vinte corações.', 'A seda de aranha é muito resistente para seu peso.'])
];

export const sampleGuessTheFakePack: ContentPack<GuessTheFakePackContent> = {
  id: 'core-family-facts',
  gameId: 'guess-the-fake',
  schemaVersion: 1,
  builtin: true,
  enabled: true,
  title: {
    pt: 'Fatos de Família',
    en: 'Family Facts'
  },
  languages: ['pt'],
  content: {
    categories,
    rounds: seeds.map(toRound)
  }
};

export function getBuiltinRounds() {
  return sampleGuessTheFakePack.content.rounds;
}

function seed(
  id: string,
  categoryId: string,
  difficulty: GuessTheFakeDifficulty,
  fakeIndex: number,
  explanationPt: string,
  explanationEn: string,
  statementsPt: string[]
): RoundSeed {
  return {
    id,
    categoryId,
    difficulty,
    fakeIndex,
    explanation: { pt: explanationPt, en: explanationEn },
    statements: statementsPt.map(text => ({ pt: text }))
  };
}

function toRound(seed: RoundSeed): GuessTheFakeRound {
  return {
    id: seed.id,
    categoryId: seed.categoryId,
    difficulty: seed.difficulty,
    fakeStatementId: `${seed.id}-${letter(seed.fakeIndex)}`,
    explanation: seed.explanation,
    statements: seed.statements.map((text, index) => ({
      id: `${seed.id}-${letter(index)}`,
      text
    }))
  };
}

function letter(index: number) {
  return String.fromCharCode(97 + index);
}
