# SPEC — Etapa 1 (Claude Code): Quiz de Captação

## Contexto
Este é um projeto Next.js EXISTENTE (`O Brasil Não Vai Te Salvar` — página de
vendas já construída e com design aplicado). Você vai ADICIONAR uma nova
funcionalidade: um quiz de captação de leads, em uma nova rota `/quiz`.

Leia primeiro:
- `QUIZ_COPY.md` (copy completa do quiz, perguntas, pontuação, perfis)
- `README.md` (estrutura do projeto já existente)
- `lib/plans.ts`, `lib/analytics.ts`, `app/api/leads/route.ts`,
  `app/api/checkout/route.ts` — para reaproveitar os padrões já estabelecidos
- `tailwind.config.ts` e `app/globals.css` — a identidade visual (cores,
  fontes) JÁ EXISTE. Reaproveite as classes/cores/fontes já definidas, não
  invente uma paleta nova.

## Sua responsabilidade (Claude Code)
Build funcional completo do quiz: fluxo de perguntas, lógica de pontuação,
captura de lead, gravação em planilha, cálculo de perfil de resultado, CTAs
finais. **Pode reaproveitar os componentes visuais e classes Tailwind já
existentes no projeto** (botões, cards, cores) para já ficar com uma cara
consistente — mas pontos de polimento visual específicos do quiz (como a
barra de progresso das perguntas, animações de transição entre perguntas,
micro-interações) devem ficar marcados com `// TODO: design` e `data-*`
attributes, pois uma segunda IA (Codex) vai refinar esses detalhes depois.

## Rota e fluxo
`/quiz` — single-page app com estados internos (não precisa de sub-rotas):

1. **Tela de intro**: headline, subheadline, texto de contexto, "Tempo: 2 min",
   CTA `COMECE AQUI` que avança para a pergunta 1.
2. **Perguntas 1-8**: uma por vez, com barra de progresso (ex: "Pergunta 3 de 8").
   - Pergunta 1 é só de segmentação (não pontua) — ainda assim deve ser
     armazenada (útil pra segmentação futura, ex: enviar na planilha).
   - Perguntas 2-8: cada alternativa tem pontos (a=4, b=3, c=2, d=1) conforme
     `QUIZ_COPY.md`. Acumular pontuação total ao longo do quiz (client-side
     state, ex: useState/useReducer).
   - Ao responder, avança automaticamente para a próxima pergunta (sem
     precisar clicar em "próxima"), com uma pequena transição.
3. **Tela de captura**: "Seu resultado está pronto!" + formulário (nome,
   whatsapp, email) + CTA `VER O RESULTADO`.
   - No submit: `POST /api/quiz-leads` com `{ nome, email, whatsapp, pontuacaoTotal, perfilResultado, respostaSegmentacao }`
     — criar essa nova API route, similar a `/api/leads/route.ts` mas
     gravando em uma ABA SEPARADA da planilha Google Sheets (ex: aba
     "Quiz Leads", usar `range: "Quiz Leads!A:F"` ou equivalente — a aba deve
     ser criada automaticamente se não existir, ou documentar no README que
     precisa ser criada manualmente).
   - Calcular o perfil ANTES de enviar (client-side), baseado na soma:
     - 7–13 pontos → PERFIL 1 "Passageiro da Própria Vida"
     - 14–19 pontos → PERFIL 2 "Inconformado Sem Mapa"
     - 20–24 pontos → PERFIL 3 "Caçador de Mudanças"
     - 25–28 pontos → PERFIL 4 "No Comando"
4. **Tela de resultado**: mostra o perfil calculado com o texto correspondente
   de `QUIZ_COPY.md` (título do perfil + corpo do texto), e os dois CTAs finais:
   - `PARTICIPAR DE GRAÇA` → navega para `/obrigado` (lead já foi capturado
     no passo anterior, não precisa repetir o formulário de `/captura`)
   - `QUERO O INGRESSO PREMIUM` → chama a mesma lógica/API de checkout já
     existente (`/api/checkout` com `{ plano: "premium" }`), igual ao botão
     "QUERO O PREMIUM" da página de vendas — redireciona pro checkout Asaas.

## Nova API Route
`app/api/quiz-leads/route.ts` (POST):
- Recebe `{ nome, email, whatsapp, pontuacaoTotal, perfilResultado, respostaSegmentacao }`
- Valida campos obrigatórios (nome, email, whatsapp)
- Grava linha na aba "Quiz Leads" da MESMA planilha Google Sheets já
  configurada (mesmas env vars `GOOGLE_SHEETS_SPREADSHEET_ID`,
  `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` —
  reaproveitar o client/helper já usado em `/api/leads/route.ts`, não duplicar
  lógica de auth do Google — extrair para um helper compartilhado em
  `lib/googleSheets.ts` se ainda não existir, reaproveitando o código atual
  de `/api/leads/route.ts` sem quebrá-lo).
- Colunas sugeridas: `[timestamp, nome, email, whatsapp, pontuacaoTotal, perfilResultado, respostaSegmentacao]`
- Mesmo comportamento de não bloquear o usuário em caso de falha (logar erro,
  seguir o fluxo).
- Atualizar `README.md`: documentar a nova aba "Quiz Leads" e que ela precisa
  ser criada manualmente na planilha (ou criada automaticamente, se você
  implementar isso via API do Sheets).

## Analytics
- Disparar evento `trackEvent` (já existe em `lib/analytics.ts`) em pontos-chave:
  - Início do quiz (`QuizStart`)
  - Lead capturado no quiz (`Lead` — mesmo evento usado em `/captura`, ou um
    específico `QuizLead` se preferir distinguir)
  - Clique em `QUERO O INGRESSO PREMIUM` no resultado (`InitiateCheckout`,
    reaproveitando o mesmo evento do checkout da página de vendas)

## Regras importantes
- NÃO reinvente a paleta de cores/tipografia — reaproveite
  `tailwind.config.ts` e os padrões visuais já aplicados nos componentes
  existentes (ex: olhe como `Hero.tsx`, `PlanosTable.tsx` usam as cores
  customizadas como `bg-ink`, `text-lime`, etc. — use esse vocabulário).
- NÃO quebre nada da página de vendas existente (`/`, `/captura`, `/obrigado`)
  — isso é uma ADIÇÃO, não uma modificação do que já existe.
- Markup com `// TODO: design` e `data-*` nos pontos que precisam de refino
  visual mais fino (barra de progresso, transições entre perguntas, cards de
  perfil de resultado) para a próxima etapa (Codex).
- Ao final: `npm run build` deve passar sem erros, commitar no git.

## Entregáveis
- `app/quiz/page.tsx` (ou estrutura de componentes em `components/quiz/`)
- `app/api/quiz-leads/route.ts`
- `lib/googleSheets.ts` (helper extraído/compartilhado, se aplicável)
- `lib/quizData.ts` (perguntas, alternativas, pontos, textos dos perfis —
  dados estruturados, não hardcoded no JSX)
- README atualizado
- Commit: `feat: quiz de captação de leads`
