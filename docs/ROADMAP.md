# Guess the Fake - Estado e Roadmap

Documento de avaliacao do estado atual e plano de evolucao para transformar a
base React/TypeScript em um party/family game completo, local-first e
hobby-friendly.

Data da revisao: 2026-06-13
Ultima atualizacao de implementacao: 2026-06-14

---

## 1. Onde estamos

O projeto ja saiu da fase de prototipo e hoje tem uma base moderna em Vite,
React, TypeScript e PWA. A separacao entre `src/core` e
`src/games/guess-the-fake` existe, o jogo principal e completavel do inicio ao
fim, e as regras principais estao cobertas por testes unitarios.

O ponto atual do roadmap e: **Onda 5 de multi-device opcional em MVP
local-first**. A plataforma existe, o jogo principal ja tem modos sociais
locais, e as proximas lacunas relevantes estao em conteudo multi-idioma,
smoke automatizado de viewport e transporte WebRTC real entre dispositivos.

Resumo executivo:

- **Base tecnica:** majoritariamente completa para um primeiro jogo.
- **Guess the Fake classico:** jogavel com shuffle real, amostragem sem
  reposicao, filtros de categoria/dificuldade e feedback de conteudo.
- **Conteudo:** pack embutido expandido para 50+ rodadas em sete categorias.
- **Packs e dados locais:** import/export, validacao, ativacao granular e
  persistencia local foram conectados.
- **Audio:** efeitos e musica de gameplay respeitam settings e bloqueios de
  autoplay.
- **Multi-device:** existe modulo isolado em `core/multiplayer`, host/join por
  codigo/link, sincronizacao local por `BroadcastChannel`, painel auxiliar e
  fallback manual offline por snapshot. WebRTC/PeerJS real segue pendente.
- **Proxima prioridade:** revisar smoke automatizado de viewport, conteudo em
  ingles e, se necessario, sinalizacao/PeerJS para multi-device real.

---

## 2. Estado por area

### Completo

- Scaffold Vite + React + TypeScript com scripts `dev`, `build`, `test` e
  `preview`.
- Estrutura de fonte separada em `app`, `core`, `games` e `styles`.
- Game manifest para `guess-the-fake`, com modo `classic` e contrato basico de
  jogo.
- Regras puras principais: iniciar partida, normalizar jogadores, iniciar
  rodada, submeter palpite, aplicar pontuacao, avancar rodada, finalizar partida
  e calcular vencedores.
- Fluxo jogavel local: `setup -> intro -> preparing -> playing -> revealed ->
  finished`.
- Timer de preparacao e timer de rodada integrados a UI.
- Pontuacao configuravel para acerto e erro.
- Recalibragem/reset de placar durante a partida.
- Leaderboard local agregado por jogador, jogo e modo, com reset pela UI.
- Persistencia local versionada para settings, leaderboard e achievements.
- Motor de achievements com persistencia e contadores para streak, partidas
  perfeitas, categorias, packs e feedback de conteudo.
- Import/export local de leaderboard, packs e dados de usuario.
- Wake lock durante gameplay quando suportado pelo navegador.
- Temas visuais migrados como tokens e aplicados via CSS variables.
- i18n de plataforma e jogo para `pt` e `en` na UI.
- Shell responsivo para desktop, tablet e mobile, com validacao documentada em
  `docs/DEVICE_VALIDATION.md`.
- PWA configurado via Vite/plugin e assets principais migrados.
- README e documentos de arquitetura/migracao/auditoria existentes.

### Parcial

- **Settings:** idioma, tema, tempos, pontuacao, shuffle, auto-start, som e
  musica controlam a experiencia. Ainda falta preview visual dos ajustes antes
  de iniciar uma partida.
- **Conteudo:** pack embutido tem 52 rodadas, categorias e dificuldade. As
  rodadas atuais sao portuguesas; packs agora declaram idiomas e sao filtrados
  para nao misturar UI em outro idioma com conteudo portugues.
- **Packs:** ha validacao de schema, import/export JSON, ativacao granular,
  persistencia de packs instalados e mensagens de erro. Assinatura atual e um
  checksum local, nao validacao criptografica/licenciamento.
- **Achievements:** motor e tela cobrem streak, partidas perfeitas, categorias,
  uso de packs, feedback de conteudo, notificacao de desbloqueio e resumo de
  progresso.
- **Leaderboard:** registra partidas/vitorias e agora tem filtro por modo,
  detalhe por jogador, ordenacoes alternativas, metricas agregadas e
  import/export JSON.
- **Responsive UI:** estados de revelacao/erro/acerto, multi-device e textos
  longos reais foram enriquecidos, mas ainda falta smoke automatizado de
  viewport.
- **Referencia antiga:** varias ideias foram preservadas em forma de base
  tecnica, mas ainda nao foram reimplementadas como features completas:
  multi-device peer-to-peer real e assinatura criptografica/licenciamento de
  packs. Rating de conteudo, wake lock, import/export de user id/dados, audio
  contextual e painel mais rico de trofeus ja existem em versao local-first.

### Nao feito

- Multi-device WebRTC/PeerJS real entre dispositivos fisicos.
- Conteudo de rodada em ingles e demais idiomas.
- Assinatura criptografica/licenciamento de packs.
- Testes de UI smoke automatizados.

---

## 3. Status da migracao

| Fase | Status | Evidencia atual |
| --- | --- | --- |
| 1. Documentos de arquitetura | Completo | `ARCHITECTURE.md`, `MIGRATION_PLAN.md`, `CAPABILITY_AUDIT.md` existem. |
| 2. Scaffold moderno | Completo | Vite/React/TS, scripts e `src/app` ativos. |
| 3. Core platform modules | Parcial avancado | Storage, i18n, themes, settings, leaderboard, achievements, content-packs, content-feedback, user-data, audio, multiplayer e UI existem. |
| 4. Game registry | Parcial | Tipos e manifest existem; ainda nao ha registry/roteamento multi-jogos real. |
| 5. Responsive UI shell | Parcial avancado | Telas principais tem controles reais; multi-device tem MVP local-first com fallback manual. |
| 6. PWA, i18n, storage e tests | Parcial avancado | PWA/storage/i18n/testes existem para regras, validacao, packs, leaderboard, achievements e audio. |
| 7. Guess the Fake base game | Parcial avancado | Partida local completa existe com shuffle, filtros, conteudo suficiente, feedback, modos sociais locais e espelho multi-device local; ainda falta WebRTC real. |
| 8. Verificacao e polish | Parcial | Build/test passam; ainda falta smoke automatizado de viewport e polimento de UX. |

---

## 4. Roadmap de produto

As ondas abaixo sao sequenciais. Cada feature nova deve terminar com testes e
documentacao minima, seguindo `docs/FEATURE_IMPLEMENTATION_GUIDE.md`.

Legenda de status:

- `[ ]` vazio: ainda nao implementado.
- `[/]` parcial: existe base tecnica ou primeira versao, mas ainda falta parte
  relevante do comportamento esperado.
- `[x]` implementado: comportamento entregue, conectado a UI quando aplicavel,
  e coberto por testes ou build.

### Onda 0 - Fundamentos honestos

Objetivo: nada na interface promete um recurso inexistente, e o jogo basico
funciona sem repeticao obvia.

1. `[x]` **W0-01 - Shuffle e amostragem sem reposicao**
   - Usar `settings.shuffleRounds` ao iniciar a partida.
   - Criar ordem de rodadas no estado ou materializar `rounds` ja embaralhadas.
   - Embaralhar tambem as statements por rodada, mantendo `fakeStatementId`.
   - Remover o modulo `% rounds.length` de `getCurrentRound` para evitar loop
     silencioso.
   - Se `totalRounds` exceder conteudo disponivel, limitar ao conteudo ou avisar
     claramente no setup.
   - Testar ordem, nao repeticao e preservacao da resposta falsa.

2. `[x]` **W0-02 - Inputs confiaveis**
   - Sanitizar `roundCount` ao digitar e ao iniciar.
   - Bloquear partida com lista vazia real de jogadores apenas se a UI passar a
     exigir nomes; caso contrario manter fallback explicito.
   - Cobrir `NaN`, valores vazios, negativos e acima do limite com testes.

3. `[x]` **W0-03 - Auto-start real**
   - Se `autoStartRounds` estiver ativo, `beginTurn` deve pular a tela de intro
     e entrar direto na preparacao ou no playing conforme decisao de UX.
   - Documentar o comportamento no texto da setting.
   - Testar fluxo com setting ligada/desligada.

4. `[x]` **W0-04 - Audio minimo**
   - Criar `src/core/audio`.
   - Tocar efeito curto em acerto/erro e musica de gameplay quando
     `musicEnabled` estiver ativo.
   - Respeitar bloqueios de autoplay: iniciar audio apenas apos interacao do
     usuario e falhar silenciosamente com estado controlado.
   - Testar helpers puros e manter testes de UI sem depender de audio real.

5. `[x]` **W0-05 - Telas honestas**
   - Packs import/export e multi-device devem virar "em breve" desabilitado ou
     receber implementacao real.
   - Evitar botoes clicaveis sem efeito.
   - Ajustar copy para nao prometer instalacao/conexao quando ainda nao existe.
   - Implementado para packs; multi-device foi marcado como "em breve" e
     desabilitado.

### Onda 1 - Conteudo e packs

Objetivo: o jogo ter substancia suficiente para varias partidas.

1. `[x]` **W1-01 - Expandir pack builtin**
   - Expandir o pack builtin para pelo menos 50 rodadas.
   - Implementado com 52 rodadas.
2. `[x]` **W1-02 - Categorias de conteudo**
   - Adicionar categorias: historia, geografia, ciencia, animais, cultura pop,
     esportes e fatos bizarros.
3. `[x]` **W1-03 - Dificuldade por rodada**
   - Adicionar `difficulty: 'easy' | 'medium' | 'hard'` no modelo de rodada.
4. `[x]` **W1-04 - Filtros no setup**
   - Permitir filtro de categoria/dificuldade no setup.
5. `[/]` **W1-05 - Idioma do conteudo**
   - Internacionalizar conteudo ou filtrar packs por idioma para nao misturar
     UI em ingles com perguntas em portugues.
   - Implementado por filtro de idioma; conteudo em ingles e demais idiomas
     ainda falta.
6. `[x]` **W1-06 - Validacao de schema de packs**
   - Criar `content-schema.ts` para validacao de packs:
   - ids unicos;
   - exatamente 5 statements;
   - exatamente uma falsa via `fakeStatementId`;
   - categoria existente;
   - idioma/locale compativel;
   - dificuldade valida.
7. `[x]` **W1-07 - Testes de validadores**
   - Testar validadores com casos validos e invalidos.

### Onda 2 - Gameplay de mesa

Objetivo: reduzir tempo morto e criar tensao social.

1. `[x]` **W2-01 - Modo Todos palpitam**
   - Implementar modo "Todos palpitam".
   - Cada jogador registra palpite antes da revelacao.
   - A rodada revela todos os palpites e pontua todos os acertos.
   - O estado deve suportar multiplos palpites sem acoplar isso ao UI.
2. `[x]` **W2-02 - Bonus de velocidade**
   - Pontos extras proporcionais ao tempo restante.
   - Timer deve expor tempo restante para o calculo, sem depender diretamente de
     `setTimeout` dentro das regras.
3. `[x]` **W2-03 - Streaks e multiplicador**
   - Guardar streak por jogador.
   - Resetar no erro.
   - Criar conquistas baseadas em streak.
   - Multiplicador aplicado em acertos repetidos do mesmo jogador/time.
4. `[x]` **W2-04 - Modo times**
   - Modelar time separado de jogador.
   - Permitir placar por time sem quebrar leaderboard individual futuro.
5. `[x]` **W2-05 - Revelacao mais forte**
   - Destaque grande para a frase falsa.
   - Explicacao como momento principal da tela.
   - Animacao de pontos e feedback visual/sonoro.
   - Revelacao mostra todos os palpites, breakdown de pontos, bonus e
     multiplicador com animacao curta.

### Onda 3 - Polimento e acessibilidade

1. `[x]` **W3-01 - Revisao responsiva com textos longos**
   - Revisar mobile retrato e paisagem com textos longos reais.
   - Mantido fluxo de cards com wrapping em mobile e validacao headless nos
     viewports de `DEVICE_VALIDATION.md`.
2. `[x]` **W3-02 - Navegacao mobile compacta**
   - Trocar navegacao mobile por bottom tabs ou menu compacto se a altura voltar
     a competir com o tabuleiro.
   - Mobile retrato usa bottom tabs compactas; mobile paisagem usa menu
     horizontal compacto.
3. `[x]` **W3-03 - Estado ativo acessivel na navegacao**
   - Adicionar `aria-current` na navegacao ativa.
4. `[x]` **W3-04 - Gerenciamento de foco**
   - Gerenciar foco ao trocar de tela/fase.
5. `[x]` **W3-05 - Navegacao por teclado nos cards**
   - Garantir navegacao por teclado nos cards de afirmacao.
   - Cards seguem como `button`, recebem foco ao entrar em jogo, navegam com
     setas e aceitam atalhos numericos de 1 a 5.
6. `[x]` **W3-06 - Contraste dos temas**
   - Verificar contraste dos 6 temas.
   - Adicionada auditoria WCAG testavel para pares criticos dos temas.
7. `[x]` **W3-07 - Otimizacao de backgrounds**
   - Otimizar backgrounds para WebP/AVIF e tamanhos responsivos.
   - Backgrounds agora usam WebP e variantes mobile existentes; PNGs ficam como
     fonte no repositorio, fora do bundle principal.
8. `[x]` **W3-08 - Preview neutro da home**
   - Substituir preview da home que expoe a primeira rodada por preview neutro
     ou conteudo de exemplo que nao seja usado em partida.

### Onda 4 - Durabilidade local-first

1. `[x]` **W4-01 - Import/export de packs**
   - Import/export de packs JSON.
2. `[x]` **W4-02 - Import/export de dados locais**
   - Import/export de dados locais: settings, leaderboard, achievements e
     packs.
3. `[x]` **W4-03 - Feedback local de conteudo**
   - nota por rodada;
   - marcar "nao repetir";
   - estatisticas por categoria e dificuldade.
   - Feedback agora persiste metadados de categoria/dificuldade, filtra
     conteudo marcado como "nao repetir" e mostra estatisticas agregadas no
     painel de trofeus.
4. `[x]` **W4-04 - Painel rico de leaderboard e achievements**
   - Painel mais rico de leaderboard e achievements.
   - Leaderboard tem filtros, detalhe de jogador, ordenacoes, metricas
     agregadas e import/export. Trofeus mostram progresso geral, proximo
     objetivo, estatisticas de curadoria e notificacao em tempo real.
5. `[x]` **W4-05 - Migracoes de schemas**
   - Persistencia/migracao quando schemas mudarem.
   - `core/storage` tem leitura com migracoes formais entre envelopes
     versionados; feedback de conteudo migra `v1` para `v2`.

### Onda 5 - Multi-device opcional

Objetivo: recuperar a ideia forte do prototipo antigo sem transformar o projeto
em uma aplicacao backend-heavy.

1. `[x]` **W5-01 - Modulo multiplayer isolado**
   - Criar `src/core/multiplayer` isolado.
   - Implementado com estado de sessao, mensagens serializaveis, helpers de
     codigo/link, storage e testes unitarios.
2. `[x]` **W5-02 - Host/join com QR e codigo**
   - Implementar host/join com QR e codigo de sessao.
   - Implementado com codigo/link, QR escaneavel gerado localmente e entrada por
     codigo/link, sem CDN externa.
3. `[/]` **W5-03 - Transporte peer-to-peer**
   - Preferir WebRTC/PeerJS ou mecanismo peer-to-peer equivalente.
   - Implementado adaptador local por `BroadcastChannel` para abas da mesma
     origem e contrato de mensagens serializaveis. WebRTC/PeerJS real entre
     dispositivos fisicos segue pendente para nao adicionar backend/sinalizacao
     obrigatoria.
4. `[x]` **W5-04 - Tela auxiliar MVP**
   - A tela auxiliar deve ser util mesmo em MVP: timer, jogador ativo, numero da
     rodada e estado de revelacao.
   - Painel mostra timer, jogador/time ativo, rodada/fase, revelacao e placar a
     partir do host local ou snapshot importado.
5. `[x]` **W5-05 - Fallback offline/local**
   - Garantir fallback offline/local quando a conexao falhar.
   - Implementado export/import de snapshot manual para uso sem canal local.
6. `[x]` **W5-06 - Testes de sessao multiplayer**
   - Testar serializacao de eventos e reducer de sessao sem depender de rede
     real.

### Onda 6 - Plataforma multi-jogos

1. `[ ]` **W6-01 - Registry real de jogos**
   - Criar registry real de jogos.
2. `[ ]` **W6-02 - Selecao de jogo na home**
   - Permitir selecionar jogo na home.
3. `[ ]` **W6-03 - Extracao de telas compartilhadas**
   - Extrair telas compartilhadas que hoje estao dentro de `App.tsx`.
4. `[ ]` **W6-04 - Segundo jogo de validacao**
   - Adicionar um segundo jogo pequeno para validar `core`.
5. `[/]` **W6-05 - Navegacao por jogo e modo em historico**
   - Separar leaderboard/achievements por jogo e modo de forma navegavel.
   - Leaderboard ja filtra por jogo/modo; falta registry multi-jogos real e
     navegacao equivalente para achievements.

---

## 5. Riscos e regras de decisao

- Nao expandir mecanica enquanto Onda 0 ainda tiver botoes sem efeito ou
  settings desconectadas.
- Regras de jogo devem continuar puras e testaveis; timers, audio e storage
  pertencem a bordas da aplicacao.
- Toda feature de gameplay deve vir com teste de regra antes de polish visual.
- Toda feature de persistencia deve ter teste de fallback para dado ausente,
  invalido e versao errada.
- Toda feature de UI relevante deve ser checada em desktop, mobile retrato e
  mobile paisagem.
- `core` so recebe codigo reutilizavel por mais de um jogo. O que for linguagem
  de `Guess the Fake` fica em `src/games/guess-the-fake`.
- Evitar backend ate haver necessidade real. O produto alvo continua sendo PWA
  estatico, local-first e barato de hospedar.
