# Guess the Fake - Estado e Roadmap

Documento de avaliacao do estado atual e plano de evolucao do Guess the Fake:
um jogo unico, local-first, hobby-friendly, publicado como PWA estatico.

Data da revisao: 2026-09-22
Ultima atualizacao de implementacao: 2026-09-22 (Onda 9: W9-01 concluido, W9-03 com ferramenta de revisao)

> Nota de 2026-08-07: o projeto deixou de ser descrito como "plataforma de
> varios jogos". Guess the Fake e um jogo isolado. A antiga Onda 6 (registry
> multi-jogos, selecao de jogo na home, segundo jogo de validacao) foi removida
> e a numeracao foi reaproveitada para a divida de arquitetura interna. A arvore
> `src/games/guess-the-fake` virou `src/game`, e `src/core/games` deixou de
> existir.

---

## 1. Onde estamos

A base em Vite, React, TypeScript e PWA esta madura. O jogo e completavel do
inicio ao fim, as regras principais estao cobertas por testes unitarios, e
`npm test` (27 arquivos, 103 testes) e `npm run build` passam.

O ponto atual do roadmap e: **Ondas 0 a 4, 6, 8, 10, 11 e 12 completas; Ondas 5
e 7 entregues com um item parcial cada; Onda 9 entregue com um item parcial
(revisao humana do conteudo); pendencia maior em mecanicas sociais
novas (Onda 13).

Itens parciais e a razao de cada um:

- W5-03 e W7-01 - pareamento peer-to-peer automatico exigiria sinalizacao;
  optou-se por WebRTC manual para preservar o app estatico sem backend.
- W9-03 - o conteudo builtin (315 rodadas, 75 frases por
  categoria/dificuldade/idioma) foi redigido e autoconferido por IA: fica
  `draft` ate revisao humana pelo checklist de `docs/CONTENT_GUIDE.md`, com a
  folha gerada por `npm run review:content`.

Resumo executivo:

- **Base tecnica:** completa. CI publica no GitHub Pages a cada push em `main`.
- **Gameplay:** jogavel com shuffle real, amostragem sem reposicao, filtros de
  categoria/dificuldade, modos classico/todos palpitam/times, bonus de
  velocidade, streaks e feedback de conteudo.
- **Conteudo:** pack embutido com 315 rodadas factuais (7 categorias x 3
  dificuldades x 15 rodadas), localizadas em `pt`, `en`, `es`, `fr`, `de` e `it`,
  um chunk carregado sob demanda por idioma. Redigido por IA e marcado `draft`
  ate revisao humana.
- **Packs e dados locais:** import/export, validacao, ativacao granular e
  persistencia local foram conectados.
- **Audio:** servico em `src/core/audio` com biblioteca de faixas por tema
  (`cosmic`, `spring`, `autumn` em `src/assets/songs`), trilha de menu e de
  gameplay, SFX sintetizados, fade e volumes separados de musica/efeitos.
- **Multi-device:** modulo isolado em `core/multiplayer`, host/join por
  codigo/link/QR, sincronizacao local por `BroadcastChannel`, transporte WebRTC
  com troca **manual** de offer/answer, painel auxiliar e fallback offline por
  snapshot. Nao ha servidor de sinalizacao; o pareamento automatico entre
  dispositivos fisicos continua pendente.
- **UX desktop/tablet:** paineis largos, cabecalhos fixos, setup em grade,
  escala de fonte configuravel, icones `lucide-react` e previews de tema.
- **Arquitetura de UI:** `src/app/App.tsx` e so o shell (~215 linhas). Estado,
  timers e efeitos vivem em hooks de `src/app/hooks/`; cada tela e um
  componente visual em `src/app/screens/`.
- **Proxima prioridade:** revisao humana e expansao do conteudo builtin
  (W9-01/W9-03) e Onda 13.

---

## 2. Estado por area

### Completo

- Scaffold Vite + React + TypeScript com scripts `dev`, `build`, `test` e
  `preview`.
- Estrutura de fonte separada em `app`, `core`, `game` e `styles`.
- Identidade e modos do jogo em `src/game/modes.ts` (`GAME_ID`, `GAME_MODES`),
  com os modos `classic`, `all-guess` e `teams`.
- Regras puras principais: iniciar partida, normalizar jogadores, iniciar
  rodada, submeter palpite, aplicar pontuacao, avancar rodada, finalizar partida
  e calcular vencedores.
- Fluxo jogavel local: `setup -> intro -> preparing -> playing -> revealed ->
  finished`.
- Timer de preparacao e timer de rodada integrados a UI.
- Pontuacao configuravel para acerto e erro.
- Recalibragem/reset de placar durante a partida.
- Leaderboard local agregado por jogador e modo, com reset pela UI.
- Persistencia local versionada para settings, leaderboard e achievements.
- Motor de achievements com persistencia e contadores para streak, partidas
  perfeitas, categorias, packs e feedback de conteudo.
- Import/export local de leaderboard, packs e dados de usuario.
- Wake lock durante gameplay quando suportado pelo navegador.
- Seis temas visuais aplicados por tokens CSS.
- i18n real da UI nos seis idiomas (`pt`, `en`, `es`, `fr`, `de`, `it`), com
  teste de paridade de chaves.
- Shell responsivo para desktop, tablet e mobile, com validacao documentada em
  `docs/DEVICE_VALIDATION.md` e smoke automatizado por viewport em
  `src/app/responsive-smoke.test.tsx`.
- PWA configurado via `vite-plugin-pwa` e assets principais em `src/assets` e
  `public/assets/icons`.
- Servico de audio com trilha de menu/gameplay por tema, SFX sintetizados e
  volumes separados.
- Shell fino em `src/app/App.tsx`, estado e timers em hooks
  (`src/app/hooks/`) e telas visuais em `src/app/screens/` (Onda 6).
- Trofeus com filtro por modo, a partir de contadores por modo em
  `core/achievements`.
- Telas de doacao e compartilhamento social com Web Share API, fallback de
  clipboard e intents web.
- Facelift visual: icones por tela, previews de tema, microinteracoes com
  respeito a `prefers-reduced-motion`.
- Fluxo explicito de nova partida com continuar/reiniciar/setup limpo e
  persistencia versionada da partida em andamento.
- CI de deploy para GitHub Pages em `.github/workflows/static.yml`, rodando
  `npm test` e `npm run build` a cada push em `main`.

### Parcial

- **Conteudo:** 315 rodadas factuais em seis idiomas (meta de volume de W9-01
  atingida), com metadados editoriais (`ageRating`, `sources`, `review`),
  auditoria automatizada e folha de revisao, mas ainda sem revisao humana.
  Ver W9-03.
- **Packs:** ha validacao de schema, import/export JSON, ativacao granular,
  persistencia de packs instalados e mensagens de erro. Assinatura atual e um
  checksum local, nao validacao criptografica/licenciamento.
- **Multi-device:** transporte funciona por `BroadcastChannel` (abas do mesmo
  dispositivo), WebRTC com troca manual de offer/answer por copiar-colar e
  snapshot offline. Falta pareamento automatico entre dispositivos fisicos e
  validacao manual registrada com dois aparelhos. Ver W5-03 e W7-01.
- **Achievements por modo:** os contadores por modo so existem para rodadas
  jogadas depois de 2026-09-22; o progresso anterior continua apenas no total
  global. Desbloqueios (com data) seguem globais; por modo o desbloqueio e
  derivado dos contadores.
- **Leaderboard:** registra partidas/vitorias e tem filtro por modo, detalhe por
  jogador, ordenacoes alternativas, metricas agregadas e import/export JSON.
- **PWA:** manifesto e service worker sao gerados no build por
  `vite-plugin-pwa`; o app trata `beforeinstallprompt`, mas nao ha
  `virtual:pwa-register` nem UX de atualizacao/offline dentro do app.

### Nao feito

- Revisao humana do conteudo builtin e ferramenta de autoria com UI.
- Pareamento peer-to-peer automatico entre dispositivos fisicos.
- Assinatura criptografica/licenciamento de packs.
- Toda a Onda 13 (momentos de mesa, rodadas especiais, perfis familiares,
  narrativa de progresso, balanceamento dinamico, modo apresentador e packs
  tematicos).
- Lint/format configurados (nao ha ESLint/Prettier no repositorio).
- Teste de navegador real (Playwright ou equivalente).

---

## 3. Roadmap de produto

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
   - Implementado com 315 rodadas curadas (antes 630 geradas por template).
2. `[x]` **W1-02 - Categorias de conteudo**
   - Adicionar categorias: historia, geografia, ciencia, animais, cultura pop,
     esportes e fatos bizarros.
3. `[x]` **W1-03 - Dificuldade por rodada**
   - Adicionar `difficulty: 'easy' | 'medium' | 'hard'` no modelo de rodada.
4. `[x]` **W1-04 - Filtros no setup**
   - Permitir filtro de categoria/dificuldade no setup.
5. `[x]` **W1-05 - Idioma do conteudo**
   - Internacionalizar conteudo ou filtrar packs por idioma para nao misturar
     UI em ingles com perguntas em portugues.
   - Implementado por filtro de idioma e conteudo embutido localizado em
     `pt`, `en`, `es`, `fr`, `de` e `it`.
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
   - Permitir placar por time sem quebrar o leaderboard individual.
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

Objetivo: tela auxiliar util em outro dispositivo sem transformar o projeto em
uma aplicacao backend-heavy.

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

### Onda 6 - Arquitetura interna de telas e estado

Objetivo: quebrar `src/app/App.tsx` sem mudar comportamento, para tornar a UI
testavel por tela e reduzir o risco de qualquer feature futura.

> Esta onda foi reescrita em 2026-08-07. Os itens antigos (registry
> multi-jogos, selecao de jogo na home, segundo jogo de validacao) foram
> removidos junto com a moldura de plataforma. O que sobrou de real, a extracao
> de telas, virou o objetivo desta onda e substitui W10-05.

1. `[x]` **W6-01 - Extrair telas utilitarias de `App.tsx`**
   - Mover Leaderboard, Trofeus, Packs, Multi-device, Apoiar e Configuracoes
     para componentes proprios em `src/app/screens/`.
   - Cada tela recebe dados e callbacks por props; nada de logica de dominio
     dentro do componente visual.
   - Comecar pelas telas sem timer, que sao as de menor risco.
   - Manter `src/app/responsive-smoke.test.tsx` verde a cada extracao.
   - Implementado em `src/app/screens/` (`LeaderboardScreen`,
     `AchievementsScreen`, `PacksScreen`, `MultiDeviceScreen`, `GrowthScreen`,
     `SettingsScreen`), com `ScreenHeader`/`ResponsiveActions` e
     `ScoreResetFeedback` compartilhados. O estado de cada tela saiu para
     hooks (`useProgress`, `usePacks`, `useLocalData`, `useMultiDevice`,
     `useGrowth`, `useSettings`, `useAudio`). `AppScreens.tsx` foi removido.

2. `[x]` **W6-02 - Extrair setup, tabuleiro e resultado**
   - Mover Home, Setup, GameBoard e Resultado final para componentes proprios.
   - Isolar o estado de partida e os timers em um hook dedicado
     (`useMatch` ou equivalente) em vez de espalhar `useState` em `App`.
   - Regras continuam puras em `src/game/rules.ts`; o hook so orquestra.
   - Meta objetiva: `App.tsx` abaixo de 600 linhas e sem `setInterval` direto.
   - Implementado com `HomeScreen`, `NewMatchChoiceScreen`, `SetupScreen`,
     `GameBoardScreen`, `StatementGrid`, `RoundResultPanel` e
     `FinalResultPanel`. Estado da partida, contagem regressiva, persistencia
     e wake lock ficam em `useMatch`; o formulario de setup em `useMatchSetup`;
     o boot (`?demo=game`/partida salva) em `match-boot.ts`. `App.tsx` tem ~215
     linhas e nenhum timer. Coberto por `hooks/useMatch.test.tsx` (preparacao,
     timeout, pausa pelo painel de escolha, fim de partida) e pelos testes de
     UI existentes; smoke manual em navegador real (desktop e mobile retrato)
     com `?demo=game`.

3. `[x]` **W6-03 - Filtro por modo em Trofeus**
   - Leaderboard ja filtra por modo; Trofeus ainda nao.
   - Permitir ver progresso de conquistas por modo (`classic`, `all-guess`,
     `teams`), com estado vazio claro quando o modo nao tiver partidas.
   - Cobrir a agregacao por modo com teste unitario em `core/achievements`.
   - Implementado com `modeCounters` no estado de achievements (aditivo, sem
     bump de versao), `updateModeCounters` e `getAchievementProgressView`.
     Por modo, o desbloqueio e derivado dos contadores. O filtro mostra
     metricas e cards do modo, ou estado vazio quando nao ha rodada nele.
     Limite: so conta rodadas jogadas depois da mudanca.

### Onda 7 - Correcoes criticas de gameplay e fluxo

Objetivo: remover atritos que quebram a confianca da partida antes de investir
em polish visual maior.

1. `[/]` **W7-01 - Multi-device real entre dispositivos fisicos**
   - Diagnosticar por que o teste local em device fisico nao conecta.
   - Documentar claramente que `BroadcastChannel` so atende abas na mesma
     origem/dispositivo quando esse for o caso.
   - Implementar transporte peer-to-peer real com WebRTC/PeerJS ou alternativa
     equivalente, mantendo fallback manual offline.
   - Definir estrategia de sinalizacao hobby-friendly: servidor opcional,
     servico publico controlado por configuracao, ou modo LAN quando viavel.
   - Exibir status de conexao, erro acionavel, reconexao e diferenca entre
     host, guest e snapshot manual.
   - Testar reducer/mensagens em unit tests e validar manualmente com dois
     dispositivos fisicos na mesma rede.
   - Implementado transporte WebRTC manual via offer/answer, DataChannel para
     snapshots, status de conexao, erros acionaveis, reconexao por novo
     pareamento e fallback por snapshot manual. A sinalizacao segue
     local-first por troca manual de texto/clipboard, com STUN publico padrao e
     override por `VITE_GTF_STUN_URLS`. Falta validacao manual registrada com
     dois dispositivos fisicos.

2. `[x]` **W7-02 - Nova partida deve reiniciar de verdade**
   - Ao clicar em "Nova partida" pela navegacao, se houver partida em curso,
     oferecer escolha clara: continuar, reiniciar partida atual ou abrir setup
     limpo.
   - Garantir que "Nova partida" no resultado final volte ao setup limpo, sem
     reaproveitar estado antigo inesperado.
   - Evitar que a navegacao para a tela `play` apenas revele uma partida antiga
     quando a intencao do usuario for criar outra.
   - Cobrir o fluxo com teste de UI ou teste de estado quando viavel.
   - Implementado com painel de escolha para partidas em andamento, reset
     explicito para setup limpo ao finalizar uma partida, pausa do timer
     enquanto a escolha esta aberta e testes unitarios do estado de navegacao.

3. `[x]` **W7-03 - Aplicar idioma e filtros ao iniciar nova partida**
   - Ao trocar idioma em configuracoes, recalcular packs/categorias/rodadas
     disponiveis antes de iniciar uma nova partida.
   - Se a partida em andamento estiver em idioma anterior, indicar que a troca
     vale para a proxima partida ou permitir reiniciar com novo idioma.
   - Zerar selecoes invalidas de categoria/dificuldade quando o idioma mudar e
     o pack ativo nao oferecer aquele conteudo.
   - Testar regressao: trocar idioma com partida iniciada, clicar em "Nova
     partida" e validar que o setup/rodadas usam o idioma novo.
   - Implementado com recalculo de rodadas por idioma antes dos filtros,
     normalizacao de categoria/dificuldade invalidas, aviso de idioma para
     partida em andamento e testes unitarios dos filtros de setup.

4. `[x]` **W7-04 - Feedback por clique no desktop/tablet durante gameplay**
   - Investigar por que o click de feedback apos escolha nao funciona em
     desktop/tablet.
   - Garantir que a escolha da frase, revelacao, feedback de rodada e botao de
     proxima rodada tenham hit areas consistentes em mouse, touch e teclado.
   - Validar estados disabled/aria-pressed para nao bloquear cliques antes da
     hora.
   - Adicionar teste de interacao para escolher uma frase e registrar feedback
     da rodada.
   - Implementado mantendo cards revelados focaveis com `aria-disabled`, guarda
     contra cliques tardios/repetidos, feedback de rodada com `aria-pressed` e
     teste de interacao cobrindo escolha, feedback e proxima rodada.

5. `[x]` **W7-05 - Recalibrar pontuacao com confirmacao visivel**
   - Corrigir o botao "Recalibrar pontuacao" no desktop/tablet para produzir
     feedback claro.
   - Decidir UX: reset imediato com toast, dialogo de confirmacao, ou painel
     para ajustar pontos manualmente por jogador/time.
   - Garantir que a acao respeite modo individual e times.
   - Testar `recalibrateScores` ja existente junto com a integracao de UI.
   - Implementado com painel de confirmacao no placar, aviso de sucesso,
     textos localizados, reset real para jogadores/times via regra pura e
     teste de integracao cobrindo confirmacao em modo times.

6. `[x]` **W7-06 - Persistencia controlada da partida em andamento**
   - Decidir se partidas em andamento devem ser persistidas entre navegacao,
     reload e troca de tela.
   - Se persistir, criar acoes explicitas de continuar/reiniciar.
   - Se nao persistir, limpar estado ao sair conforme contrato documentado.
   - Evitar estados hibridos com settings novas e rodadas antigas.
   - Implementado com storage versionado `gtf.game.guess-the-fake.quick-game.v1`
     para partidas ativas, restauracao atras de escolha explicita
     continuar/reiniciar/setup, preservacao de idioma/timer e limpeza ao abrir
     setup limpo ou finalizar a partida.

### Onda 8 - Audio, musica e microinteracoes

Objetivo: transformar som e musica em parte real da experiencia, respeitando
autoplay, tema, configuracoes e acessibilidade.

1. `[x]` **W8-01 - Trilha de menu e gameplay por tema**
   - Reutilizar as musicas em `src/assets/songs`:
     `cosmic_*`, `spring_*` e `autumn_*`.
   - Mapear temas atuais para faixas disponiveis, incluindo fallback para temas
     sem musica propria.
   - Tocar `*_gameroom.mp3` em menus/home/setup e `*_gameplay.mp3` durante
     intro/preparacao/jogo/revelacao.
   - Trocar faixa suavemente ao mudar tema, fase ou tela.
   - Manter audio bloqueado ate primeira interacao do usuario.
   - Implementado com biblioteca `cosmic`, `spring` e `autumn`, fallback para
     temas sem faixa propria, trilha de menu para telas/setup/final e gameplay
     para intro/preparacao/jogo/revelacao.

2. `[x]` **W8-02 - Servico de audio dedicado**
   - Evoluir `src/core/audio` para gerenciar biblioteca de faixas, eventos,
     volume, mute, fade-in/fade-out e estado de desbloqueio.
   - Remover dependencia de um unico import fixo em `App.tsx`.
   - Evitar vazamento de `Audio`/`AudioContext` e pausar corretamente ao
     desligar musica.
   - Cobrir helpers puros com testes.
   - Implementado em `src/core/audio`, com biblioteca de faixas, fade,
     desbloqueio por interacao, SFX sintetizados, dedupe curto de eventos e
     `dispose` no unmount.

3. `[x]` **W8-03 - SFX de clique e navegacao**
   - Adicionar SFX curto para clique em botoes, navegacao e selecao de cards.
   - Respeitar `soundEnabled` em todos os eventos.
   - Evitar sons duplicados em sequencias de clique/submit.
   - Considerar biblioteca de arquivos curtos ou sintetizador leve por evento.
   - Implementado com sintetizador leve para navegacao, clique, selecao de
     cards, preview e eventos de resultado, respeitando volume/mute de efeitos.

4. `[x]` **W8-04 - Controles de audio mais completos**
   - Separar volume de musica e volume de efeitos.
   - Adicionar preview/teste de som em configuracoes.
   - Persistir preferencias em schema versionado.
   - Respeitar `prefers-reduced-motion`/modo silencioso quando aplicavel.
   - Implementado com settings v3, migracao de v1 e v2, sliders separados,
     preview de som e fade desativado quando `prefers-reduced-motion` esta
     ativo.

### Onda 9 - Conteudo multi-idioma e curadoria

Objetivo: fazer todos os idiomas publicados serem realmente jogaveis e sustentar
varias sessoes familiares sem repeticao rapida.

1. `[x]` **W9-01 - Biblioteca minima por idioma/categoria/dificuldade**
   - Criar pelo menos 75 itens por dificuldade, por categoria, por idioma
     publicado.
   - Idiomas alvo atuais: `pt`, `en`, `es`, `fr`, `de`, `it`.
   - Categorias atuais: historia, geografia, ciencia, animais, cultura pop,
     esportes e fatos bizarros.
   - Implementado com 315 rodadas factuais: 15 rodadas (75 frases) por
     categoria/dificuldade/idioma, ids `<categoria>-<dificuldade>-01..15`
     iguais nos seis idiomas e posicao da falsa equilibrada (3 por posicao em
     cada celula). `RELEASE_MIN_ROUNDS_PER_CELL = 15`: o audit de `npm test`
     falha se qualquer idioma ficar abaixo da meta.
   - Chunk por idioma passou de ~32 kB para ~120 kB (~42 kB gzip).

2. `[x]` **W9-02 - Estrategia escalavel de packs localizados**
   - Catalogo neutro em `src/game/data/builtin/catalog.ts` (id, categoria,
     dificuldade, posicao da falsa, metadados) e textos por idioma em
     `src/game/data/builtin/texts/<lang>.ts`.
   - `loadBuiltinPack(language)` usa `import()` dinamico: um chunk por idioma
     (~120 kB, ~42 kB gzip), precacheado pelo PWA. Ids de rodada iguais em todos os idiomas.
   - `usePacks` expoe `builtinStatus`; o Setup mostra carregamento e orientacao
     quando o idioma nao tem rodadas (trocar idioma, filtros ou importar pack).
   - Packs externos continuam filtrados por `languages`. `?demo=game` inicia
     quando o pack do idioma carrega.

3. `[/]` **W9-03 - Qualidade factual e revisao editorial**
   - Checklist editorial em `docs/CONTENT_GUIDE.md`.
   - Rodadas com `ageRating`, `sources` e `review` (tipos em
     `src/game/types.ts`, validados em `content-schema.ts`), nunca exibidos na
     partida. Tres rodadas dificeis de ciencia marcadas `10+`.
   - 315 rodadas com fatos verificaveis, uma falsa inequivoca (erros comuns e
     mitos) e explicacao curta, nos seis idiomas. Autoconferencia por IA:
     fatos repetidos entre rodadas, verdadeiras que entregavam a falsa e
     numeros divergentes entre traducoes.
   - Ferramenta de revisao: `src/game/content-review.ts` (puro) e
     `npm run review:content` geram `content-review/<lang>.md` (falsa marcada,
     idioma de comparacao, linha pronta para o log). O log humano fica em
     `src/game/data/builtin/reviews.ts`, validado por teste; o audit mostra
     revisadas por celula.
   - Pendente: todo o conteudo esta `review.status: 'draft'`. Marcar `[x]` so
     depois de revisao humana pelo checklist.

4. `[x]` **W9-04 - Ferramentas de autoria e validacao de conteudo**
   - `src/game/content-audit.ts` (puro): cobertura por idioma, categoria e
     dificuldade, ids duplicados, frases duplicadas normalizadas, texto
     faltando, explicacao vazia e falsa invalida.
   - `src/game/content-audit.test.ts` falha se algum idioma publicado ficar
     abaixo de `RELEASE_MIN_ROUNDS_PER_CELL` ou tiver qualquer problema.
   - `npm run audit:content` imprime a tabela de cobertura.
   - Ainda nao ha tela interna de autoria; o fluxo de edicao e pelos arquivos
     de texto.

5. `[x]` **W9-05 - Traducoes reais da UI**
   - Dicionarios reais de shell em `src/app/locales/<lang>.ts` e de jogo em
     `src/game/locales/<lang>.ts` para `es`, `fr`, `de` e `it`.
   - `src/app/translations.test.ts` garante que cada idioma tem arvore propria
     com todas as chaves do ingles.

### Onda 10 - UX desktop/tablet e layout

Objetivo: fazer desktop/tablet parecerem uma experiencia de produto final, com
hierarquia fixa, mais largura util e layouts densos sem perder responsividade.

1. `[x]` **W10-01 - Shell com titulo fixo e conteudo rolavel**
   - No desktop/tablet, mover titulo de tela para uma area fixa do conteudo
     principal.
   - Deixar o card/lista rolavel logo abaixo, similar ao cabecalho fixo de
     rodada "Vez de <Pessoa>".
   - Aplicar a Leaderboard, Nova Partida, Trofeus, Packs, Multi-device,
     Configuracoes, Doacao e Compartilhar.
   - Preservar comportamento mobile com scroll natural.

2. `[x]` **W10-02 - Paineis mais largos em telas grandes**
   - Aumentar largura util dos paineis desktop/tablet alem dos atuais `58rem`
     quando houver espaco.
   - Usar grids responsivos de 2 ou 3 colunas para configuracoes, setup,
     leaderboard e packs.
   - Evitar cards dentro de cards; usar secoes e listas com hierarquia clara.

3. `[x]` **W10-03 - Nova Partida profissional**
   - Redesenhar setup com resumo da partida, selecao visual de modo, jogadores,
     filtros, quantidade de rodadas e status de conteudo.
   - Em desktop/tablet, abandonar o fluxo linear de uma coluna.
   - Mostrar preview de categorias/dificuldades disponiveis e alertas de
     conteudo insuficiente.
   - Incluir comando explicito para reiniciar quando ja existir partida.

4. `[x]` **W10-04 - Escala de fonte configuravel**
   - Adicionar setting de tamanho de fonte com 5 niveis.
   - Aplicar via CSS variables, sem usar fonte escalada diretamente por
     viewport.
   - Garantir que cards, botoes, nav, placar e modais continuem sem overflow.
   - Persistir preferencia e adicionar testes de normalizacao.

5. `[x]` **W10-05 - Extracao incremental de telas de `App.tsx`**
   - **Substituido pela Onda 6 e concluido por ela** (W6-01 e W6-02). Os
     wrappers visuais de `AppScreens.tsx` foram trocados por componentes de
     tela reais.

6. `[x]` **W10-06 - Smoke automatizado desktop/tablet/mobile**
   - Adicionar Playwright ou smoke equivalente para home, setup, jogo,
     leaderboard, packs, multi-device e settings.
   - Cobrir desktop, tablet portrait/landscape e mobile portrait/landscape
     definidos em `docs/DEVICE_VALIDATION.md`.
   - Incluir verificacao basica de clique em card, feedback, recalibragem e
     navegacao.
   - Implementado como smoke equivalente em Vitest/Testing Library/jsdom em
     `src/app/responsive-smoke.test.tsx`, cobrindo os cinco viewports e o fluxo
     de card, feedback, recalibragem e navegacao. **Playwright nao foi
     adotado**: nao ha navegador real, screenshot nem verificacao de layout
     computado. Um teste de browser real segue como melhoria futura.

7. `[x]` **W10-07 - Densidade da UI mobile**
   - Em `<= 680px`, transformar a composicao de revelacao em fluxo vertical
     unico, com feedback de rodada em linha compacta e acao principal abaixo.
   - Mover comandos raros de dados de Leaderboard e Packs para um disclosure
     "Acoes"; substituir o card introdutorio de Trofeus por resumo compacto.
   - Manter o modo selecionado em Nova Partida marcado por `aria-pressed`,
     borda de destaque e indicador visivel, sem hover ambiguo em touch.
   - Preservar alvos de toque de 44px, foco visivel e ausencia de overflow em
     320px.
   - Especificado em `docs/superpowers/specs/2026-07-06-mobile-ui-density-design.md`
     e planejado em `docs/superpowers/plans/2026-07-06-mobile-ui-density.md`.
     Coberto por `src/app/responsive-smoke.test.tsx`.

### Onda 11 - Doacao, compartilhamento e crescimento organico

Objetivo: recursos sociais adequados a um PWA moderno, sem dependencias
externas obrigatorias no caminho principal.

1. `[x]` **W11-01 - Pagina de doacao**
   - Criar tela/painel de doacao com Buy Me a Coffee e Ko-fi.
   - Links devem abrir em nova aba com `rel="noopener noreferrer"`.
   - Se algum link nao estiver configurado, desabilitar a opcao com mensagem
     clara.
   - Adicionar entrada de navegacao sem poluir o fluxo principal do jogo.

2. `[x]` **W11-02 - Compartilhamento social**
   - Criar local dedicado para compartilhar o jogo.
   - Web Share API quando disponivel, clipboard fallback e intents web para
     WhatsApp, Facebook e X.
   - Para Instagram, TikTok e Threads, usar Web Share API quando suportado ou
     copiar mensagem/link e abrir fallback web quando fizer sentido.
   - Incluir icones reconheciveis, labels acessiveis e mensagem localizada.

3. `[x]` **W11-03 - Compartilhar resultado da partida**
   - Gerar texto curto com vencedor, modo, numero de rodadas e chamada para
     jogar.
   - Permitir compartilhar resultado final sem expor dados sensiveis locais.
   - Usar a mesma infraestrutura de share do app.

4. `[x]` **W11-04 - Instalacao PWA e retorno ao jogo**
   - Melhorar CTA de instalacao quando o navegador expuser `beforeinstallprompt`.
   - Explicar estado offline/local-first com texto curto e nao intrusivo.
   - Validar que links de convite multi-device e share preservam rota/params
     importantes.

### Onda 12 - Facelift visual e identidade premium

Objetivo: elevar a percepcao de qualidade de todas as telas sem quebrar temas,
contraste, responsividade e acessibilidade.

1. `[x]` **W12-01 - Sistema de icones por tela e acao**
   - Padronizar uso de `lucide-react` para navegacao, headers, metricas,
     botoes e estados vazios.
   - Evitar texto em botoes quando icone familiar com tooltip/label acessivel
     resolver melhor.
   - Garantir consistencia entre desktop, tablet e mobile.
   - Implementado com marcas de tela em headers, icones em cards de setup,
     metricas, estados de conteudo e acoes principais, mantendo labels
     acessiveis nos controles.

2. `[x]` **W12-02 - Arte e assets por contexto**
   - Usar assets reais/gerados para dar identidade a home, setup, conquistas,
     packs e estados vazios.
   - Evitar decoracao generica que conflite com os fundos de tema.
   - Criar diretrizes para assets por tema e fallback para alto contraste.
   - Implementado com arte contextual local-first em CSS/tokens para a home,
     badges visuais por contexto e previews tematicos sem depender de rede,
     preservando contraste alto por variaveis especificas.

3. `[x]` **W12-03 - Componentes de superficie mais sofisticados**
   - Revisar cards, listas, metricas, badges, segmented controls, toggles,
     sliders e empty states.
   - Manter raio de borda e densidade coerentes com cada tema.
   - Evitar paleta monotematica e excesso de gradientes roxos/azuis.
   - Implementado com realces de superficie, hierarquia visual em cards e
     metricas, icones consistentes e previews com paletas distintas por tema.

4. `[x]` **W12-04 - Microinteracoes sem prejudicar legibilidade**
   - Animar selecao, revelacao, pontuacao, trofeu desbloqueado e troca de tela.
   - Respeitar `prefers-reduced-motion`.
   - Garantir que animacoes nao atrasem o ritmo de party game.
   - Implementado com animacoes curtas para selecao/revelacao, trofeu/resultado
     e feedback visual de previews, todas desligadas em `prefers-reduced-motion`.

5. `[x]` **W12-05 - Preview rico de temas**
   - Em configuracoes, mostrar preview visual de tema com mini cards, placar,
     botao e estado de resposta.
   - Permitir trocar tema com feedback imediato.
   - Preservar suporte a alto contraste.
   - Implementado com grade de previews clicaveis em configuracoes, mini cards,
     placar e estado de resposta por tema, `aria-pressed` e troca imediata do
     tema ativo.

### Onda 13 - Experiencia familiar memoravel

Objetivo: evoluir de "quiz funcional" para uma experiencia social unica,
repetivel e divertida em familia.

1. `[ ]` **W13-01 - Momentos de mesa**
   - Adicionar prompts opcionais de discussao antes da revelacao: "defenda sua
     escolha", "vote em quem blefou melhor" ou "chance de mudar de ideia".
   - Manter como configuracao para nao alongar partidas rapidas.
   - Testar impacto em modos classico, todos palpitam e times.

2. `[ ]` **W13-02 - Rodadas especiais**
   - Criar tipos opcionais de rodada: morte subita, dobro ou nada, pista
     gradual, rodada relampago e desafio por categoria.
   - Modelar em regras puras antes da UI.
   - Permitir desligar rodadas especiais para experiencia classica.

3. `[ ]` **W13-03 - Perfis familiares locais**
   - Evoluir jogadores recorrentes com avatar local, cor, apelido, estatisticas
     e trofeus pessoais.
   - Manter tudo local-first e exportavel.
   - Evitar criar conta obrigatoria.

4. `[ ]` **W13-04 - Narrativa de progresso**
   - Criar trilhas de conquistas por categoria, dificuldade e estilo de jogo.
   - Mostrar "proximo objetivo" contextual apos partidas.
   - Conectar progresso a packs e curadoria de conteudo.

5. `[ ]` **W13-05 - Balanceamento dinamico de partida**
   - Sugerir dificuldade, quantidade de rodadas e modo com base em jogadores,
     tempo disponivel e historico local.
   - Evitar repetir categorias ou rodadas marcadas como fracas.
   - Manter o usuario no controle final da configuracao.

6. `[ ]` **W13-06 - Modo apresentador**
   - Criar visual de sala para TV/projetor com placar, timer, revelacao e
     efeitos maiores.
   - Integrar com multi-device para host/controlador e tela de exibicao.
   - Validar em desktop widescreen e tablet.

7. `[ ]` **W13-07 - Packs tematicos premium/local-first**
   - Criar formato de packs tematicos com capa, descricao, publico recomendado,
     idioma, dificuldade e changelog.
   - Preparar terreno para licenciamento/assinatura criptografica futura sem
     bloquear packs comunitarios locais.

---

## 4. Riscos e regras de decisao

- Nao expandir mecanica enquanto houver botoes sem efeito ou settings
  desconectadas.
- Regras de jogo devem continuar puras e testaveis; timers, audio e storage
  pertencem a bordas da aplicacao.
- Toda feature de gameplay deve vir com teste de regra antes de polish visual.
- Toda feature de persistencia deve ter teste de fallback para dado ausente,
  invalido e versao errada.
- Toda feature de UI relevante deve ser checada em desktop, mobile retrato e
  mobile paisagem.
- `core` nao pode importar de `game`. O que for linguagem de rodada, pontuacao
  ou conteudo fica em `src/game`.
- Evitar backend ate haver necessidade real. O produto alvo continua sendo PWA
  estatico, local-first e barato de hospedar.
- Nao reintroduzir moldura de "plataforma de varios jogos". Guess the Fake e um
  jogo unico; qualquer abstracao precisa se justificar por este jogo sozinho.
