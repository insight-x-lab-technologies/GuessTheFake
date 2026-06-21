# Auditoria de capacidades do jogo base

Esta auditoria compara o `ref_src_old` com a nova base React/TypeScript para decidir o que foi preservado, o que foi simplificado e o que precisa entrar no backlog da plataforma.

## Preservado ou migrado

- Temas: os temas visuais antigos foram reintroduzidos como tokens de plataforma: `cosmic`, `liquid-glass`, `material3`, `light-mode`, `dark-mode` e `high-contrast`.
- Identidade visual: fundos por tela, gradientes de logo/titulo, cartões translúcidos, cartões de conteúdo, sombras, animação de estrelas e botões com press animation foram adaptados para o shell novo.
- Responsividade: a estrutura atual mantém o layout de desktop, tablet e mobile já validado, mas agora usando os assets e tokens do jogo base.
- i18n: a arquitetura nova preserva tradução centralizada, com idiomas
  publicados `pt`, `en`, `es`, `fr`, `de` e `it`.
- Leaderboard: existe persistência local e agregação por jogador/jogo/modo.
- Troféus: existe motor de progresso/desbloqueio e definições por jogo.
- Packs: existe manifesto e tipo estruturado para content packs.
- Settings: existem preferências persistidas para idioma, tema, som e música.
- Timer: a nova base já tem tempo de preparação e tempo de rodada configuráveis.
- Pontuação: acerto, penalidade por erro e recalibragem de placar já estão
  ligados à UI.
- PWA/assets: assets principais, ícones e músicas foram trazidos para `src/assets`.

## Parcial ou simplificado

- Temas: o look and feel voltou, mas ainda falta uma tela de preview rica como no jogo antigo.
- i18n: o conteúdo jogável embutido cobre `pt`, `en`, `es`, `fr`, `de` e
  `it`; ainda há pontos de UI que podem depender de fallback enquanto a
  tradução completa da interface evolui.
- Leaderboard: falta filtro por modo, resumo lateral, reset pela UI, avatar/títulos e rankings mais detalhados.
- Troféus: o motor existe, a persistência já é carregada/salva, mas ainda faltam
  mais metas reais e notificações ricas.
- Packs: falta instalação/importação/exportação, assinatura/validação, preview detalhado e ativação granular.
- Configurações: idioma, tema, timer e pontuação funcionam; ainda faltam uso
  real de shuffle, auto-start, audio, fullscreen, reset geral e import/export de
  dados.
- Ranking de conteúdo: o antigo ranking de piadas vira, neste jogo, ranking/feedback local de rodadas ou frases falsas; ainda não está implementado.
- Áudio: os arquivos existem, mas falta um serviço de música/efeitos integrado às preferências.

## Ainda ausente

- Embaralhamento real de rodadas e statements.
- Amostragem sem reposição quando a partida pede mais rodadas que o conteúdo
  disponível.
- Uso real de `autoStartRounds`.
- Multi-device com host/join, QR code e tela auxiliar.
- Backup/restauração de dados locais e identificador do usuário.
- Tela de extensões/packs com fluxo completo de instalação.
- Telemetria local de qualidade do conteúdo: nota, não repetir e estatísticas por item.

## Recomendação de backlog

1. Consolidar persistência de troféus, configurações avançadas e estatísticas de conteúdo.
2. Conectar shuffle, auto-start e áudio às preferências antes de expandir modos
   de jogo.
3. Evoluir packs com validação, preview, ativação e import/export local.
4. Implementar rating de rodadas/frases como substituto do ranking de piadas.
5. Reintroduzir multi-device como módulo opcional, isolado do core do jogo.
6. Expandir i18n somente depois que o vocabulário do jogo estiver estável.
