# SPEC — Etapa 2 (Codex): Refino Visual do Quiz

## Contexto
O quiz de captação (`/quiz`) já está funcional (lógica, pontuação, captura de
lead, integração Google Sheets — tudo feito). Leia `QUIZ_COPY.md` e
`SPEC_CLAUDE_QUIZ.md` pra entender o fluxo completo antes de mexer em
qualquer coisa.

## SUA RESPONSABILIDADE (e SOMENTE ela)
Refinar o polimento visual específico do quiz, usando a MESMA identidade
visual já aplicada no resto do site (cores/fontes de `tailwind.config.ts` —
NÃO invente paleta nova, já está definida e deve ser 100% reaproveitada).

Focos específicos:
1. Barra/indicador de progresso das perguntas (ex: "Pergunta 3 de 8") — deixar
   visualmente clara e com uma transição suave de preenchimento.
2. Transições entre perguntas (fade/slide leve ao avançar) e feedback visual
   imediato ao selecionar uma alternativa (destaque de seleção antes de
   avançar automaticamente).
3. Tela de captura de resultado ("Seu resultado está pronto!") — deixar com
   senso de expectativa/recompensa (ex: ícone, leve animação, visual de
   "quase lá").
4. Cards/tela de resultado por perfil — cada um dos 4 perfis deve ter uma
   apresentação visual marcante e distinta (pode usar pequenas variações de
   cor/ícone por perfil dentro da MESMA paleta, ex: tons diferentes de
   destaque pra cada perfil, mantendo a coerência visual do site).
5. CTAs finais ("PARTICIPAR DE GRAÇA" / "QUERO O INGRESSO PREMIUM") com o
   mesmo tratamento visual de destaque já usado nos CTAs da página de vendas
   (reaproveitar os estilos de botão existentes, ex: olhe como os CTAs de
   `PlanosTable.tsx` são estilizados).
6. Garantir responsividade mobile-first (tráfego de quiz normalmente vem de
   redes sociais no celular).

## REGRAS RÍGIDAS — NÃO QUEBRAR
1. **NÃO** altere lógica de pontuação, cálculo de perfil, chamadas de API
   (`/api/quiz-leads`, `/api/checkout`), nem o conteúdo textual (copy) do quiz.
2. **NÃO** edite `app/api/`, `lib/quizData.ts` (dados/textos), `lib/plans.ts`,
   `lib/analytics.ts`, `lib/googleSheets.ts`.
3. **NÃO** toque em nada da página de vendas já existente (`/`, `/captura`,
   `/obrigado`) — escopo é SOMENTE `/quiz` e seus componentes visuais.
4. **NÃO** remova `data-*` attributes, `id`s, nem `href`/`onClick` dos CTAs e
   handlers de clique/submit existentes — apenas ajuste `className` e
   estrutura puramente visual (wrappers decorativos).
5. **PODE** editar: `className` de `app/quiz/page.tsx` e seus componentes,
   adicionar pequenos componentes visuais auxiliares (ex: um componente de
   barra de progresso dedicado), `tailwind.config.ts` SOMENTE se precisar
   adicionar uma keyframe/animação nova (não mude cores existentes).
6. Remova os comentários `// TODO: design` conforme for implementando.
7. Ao final, rode `npm run build` para garantir que nada quebrou, e comite
   com mensagem `style: refino visual do quiz`.

## Fluxo de trabalho recomendado
1. Leia `app/quiz/page.tsx`, `lib/quizData.ts`, e os componentes visuais já
   existentes na página de vendas (`Hero.tsx`, `PlanosTable.tsx`) pra entender
   o vocabulário de classes/cores já em uso.
2. Implemente o refino ponto a ponto conforme a lista de focos acima.
3. Teste responsividade mentalmente (classes `sm:`, `md:`, `lg:`).
4. Build final + commit.

## Entregável
Quiz visualmente polido e consistente com o resto do site, responsivo, sem
nenhuma mudança de lógica/dados/integrações, buildando sem erros, commitado
no git.
