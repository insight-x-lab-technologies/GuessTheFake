# Guess the Fake - Estado e Roadmap

Documento de avaliacao do estado atual e plano de evolucao para transformar a
base React/TypeScript em um party/family game completo, local-first e
hobby-friendly.

Data da revisao: 2026-06-16
Ultima atualizacao de implementacao: 2026-06-14

---

## 1. Onde estamos

O projeto ja saiu da fase de prototipo e hoje tem uma base moderna em Vite,
React, TypeScript e PWA. A separacao entre `src/core` e
`src/games/guess-the-fake` existe, o jogo principal e completavel do inicio ao
fim, e as regras principais estao cobertas por testes unitarios.

O ponto atual do roadmap e: **Onda 5 de multi-device opcional em MVP
local-first, com Onda 6 de plataforma multi-jogos ainda pendente**. A
plataforma existe, o jogo principal ja tem modos sociais locais, mas a revisao
de gameplay de 2026-06-16 reposiciona as proximas prioridades: corrigir
multi-device entre dispositivos fisicos, resolver fluxo real de "Nova partida",
completar audio contextual, ampliar conteudo multi-idioma e elevar o padrao de
UI desktop/tablet.

Resumo executivo:

- **Base tecnica:** majoritariamente completa para um primeiro jogo.
- **Guess the Fake classico:** jogavel com shuffle real, amostragem sem
  reposicao, filtros de categoria/dificuldade e feedback de conteudo.
- **Conteudo:** pack embutido expandido para 50+ rodadas em sete categorias.
- **Packs e dados locais:** import/export, validacao, ativacao granular e
  persistencia local foram conectados.
- **Audio:** existe base tecnica com efeitos sintetizados e uma musica fixa de
  gameplay, mas ainda falta trilha por tema/fase, musica de menus e SFX de
  clique reutilizando os assets ja migrados de `ref_src_old/assets/songs`.
- **Multi-device:** existe modulo isolado em `core/multiplayer`, host/join por
  codigo/link, sincronizacao local por `BroadcastChannel`, painel auxiliar e
  fallback manual offline por snapshot. O teste local com dispositivo fisico
  mostrou que ainda falta transporte real entre devices.
- **UX desktop/tablet:** o shell funciona, mas telas de menu e utilitarias ainda
  usam paineis estreitos, pouco hierarquizados e com baixa densidade visual para
  telas grandes.
- **Proxima prioridade:** Onda 7, focada em bugs de gameplay e confiabilidade
  antes de novas mecanicas.

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
- Fluxo explicito de nova partida/reiniciar partida quando ja existe jogo em
  andamento.
- Musica de menu por tema, musica de gameplay por tema e SFX de clique.
- Paginas ou paineis de doacao e compartilhamento social.

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
   - Reutilizar musicas ja migradas de `ref_src_old/assets/songs`:
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

2. `[x]` **W8-02 - Servico de audio de plataforma**
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
   - Implementado com settings v2, migracao de v1, sliders separados,
     preview de som e fade desativado quando `prefers-reduced-motion` esta
     ativo.

### Onda 9 - Conteudo multi-idioma e curadoria

Objetivo: fazer todos os idiomas publicados serem realmente jogaveis e sustentar
varias sessoes familiares sem repeticao rapida.

1. `[ ]` **W9-01 - Biblioteca minima por idioma/categoria/dificuldade**
   - Criar pelo menos 75 itens por dificuldade, por categoria, por idioma
     publicado.
   - Idiomas alvo atuais: `pt`, `en`, `es`, `fr`, `de`, `it`.
   - Categorias atuais: historia, geografia, ciencia, animais, cultura pop,
     esportes e fatos bizarros.
   - Antes de implementar, reavaliar o volume total: 75 x 3 dificuldades x 7
     categorias x 6 idiomas = 9.450 rodadas, o que pode exigir geracao
     assistida, importacao por packs ou ondas menores por idioma.

2. `[ ]` **W9-02 - Estrategia escalavel de packs localizados**
   - Separar conteudo builtin por idioma em arquivos/packs modulares.
   - Carregar apenas o necessario para o idioma ativo quando viavel.
   - Permitir packs externos por idioma sem misturar UI e conteudo.
   - Exibir estado vazio com orientacao clara quando um idioma ainda nao tiver
     conteudo suficiente.

3. `[ ]` **W9-03 - Qualidade factual e revisao editorial**
   - Criar checklist de revisao por rodada: frase falsa inequivoca, quatro
     frases verdadeiras, explicacao curta e linguagem familiar.
   - Marcar conteudo por faixa etaria quando necessario.
   - Evitar temas sensiveis ou ambiguidade factual em jogo familiar.
   - Adicionar metadados de fonte/revisao quando fizer sentido sem expor isso
     durante a partida.

4. `[ ]` **W9-04 - Ferramentas de autoria e validacao de conteudo**
   - Criar script ou tela interna para auditar cobertura por idioma, categoria
     e dificuldade.
   - Falhar teste quando um idioma publicado nao atingir cobertura minima
     definida para release.
   - Detectar duplicidade de statements, IDs e explicacoes vazias.

5. `[ ]` **W9-05 - Traducoes reais da UI**
   - Substituir fallback em ingles para `es`, `fr`, `de` e `it` por traducoes
     reais da plataforma e do jogo.
   - Garantir que nomes de categorias, modos, achievements, settings e erros
     estejam localizados.

### Onda 10 - UX desktop/tablet e arquitetura de telas

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
   - Dividir `App.tsx` em componentes de tela: Home, Setup, GameBoard,
     Leaderboard, Achievements, Packs, MultiDevice, Settings.
   - Manter regras e helpers em `core`/`games`, sem mover logica de dominio
     para componentes visuais.
   - Reduzir risco antes de facelift maior e facilitar testes por tela.

6. `[x]` **W10-06 - Smoke automatizado desktop/tablet/mobile**
   - Adicionar Playwright ou smoke equivalente para home, setup, jogo,
     leaderboard, packs, multi-device e settings.
   - Cobrir desktop, tablet portrait/landscape e mobile portrait/landscape
     definidos em `docs/DEVICE_VALIDATION.md`.
   - Incluir verificacao basica de clique em card, feedback, recalibragem e
     navegacao.

### Onda 11 - Doacao, compartilhamento e crescimento organico

Objetivo: recuperar recursos sociais do prototipo antigo de forma adequada a
um PWA moderno, sem dependencias externas obrigatorias no caminho principal.

1. `[x]` **W11-01 - Pagina de doacao**
   - Criar tela/painel de doacao com Buy Me a Coffee e Ko-fi.
   - Reutilizar intencao e conteudo do `ref_src_old`, adaptando a marca para
     Guess the Fake.
   - Links devem abrir em nova aba com `rel="noopener noreferrer"`.
   - Se algum link nao estiver configurado, desabilitar a opcao com mensagem
     clara.
   - Adicionar entrada de navegacao sem poluir o fluxo principal do jogo.

2. `[x]` **W11-02 - Compartilhamento social**
   - Criar local dedicado para compartilhar o jogo.
   - Reaproveitar estrategia do prototipo: Web Share API quando disponivel,
     clipboard fallback e intents web para WhatsApp, Facebook e X.
   - Para Instagram, TikTok e Threads, usar Web Share API quando suportado ou
     copiar mensagem/link e abrir fallback web quando fizer sentido.
   - Incluir icones reconheciveis, labels acessiveis e mensagem localizada.

3. `[x]` **W11-03 - Compartilhar resultado da partida**
   - Gerar texto curto com vencedor, modo, numero de rodadas e chamada para
     jogar.
   - Permitir compartilhar resultado final sem expor dados sensiveis locais.
   - Usar a mesma infraestrutura de share da plataforma.

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
