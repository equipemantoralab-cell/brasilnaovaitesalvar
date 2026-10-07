# SPEC — Etapa 1 (Claude Code): Estrutura, Rotas e Integrações

## Contexto
Projeto: página de vendas "O Brasil Não Vai Te Salvar" (imersão ao vivo).
Copy oficial está em `COPY.md` na raiz do projeto — leia e use o texto literal de lá.

## Sua responsabilidade (Claude Code)
Você cuida SOMENTE de: scaffold, estrutura de pastas, rotas, componentes (markup
semântico, SEM estilização visual refinada — apenas HTML estrutural básico,
pode usar classes Tailwind genéricas como container/flex/padding mas NÃO
defina paleta de cores, tipografia, nem design visual), lógica de negócio e
integrações. O design visual completo será feito por outra IA (Codex) na
próxima etapa, então deixe o markup limpo e com data-attributes/comentários
indicando "// TODO: design" nos pontos-chave, para facilitar o trabalho dela.

## Stack
- Next.js 14+ (App Router), TypeScript, Tailwind CSS (instalado mas uso mínimo
  de classes — só estrutura, não visual)
- Deploy-agnostic (Vercel-ready)

## Páginas / Rotas
1. `/` — Página de Vendas (5 dobras, conforme COPY.md seção "PÁGINA DE VENDAS")
   - Dobra 1: Hero com headline, subheadline, data do evento, CTA "GARANTIR MEU INGRESSO" (scroll suave até a dobra 4 de ingressos)
   - Dobra 2: Texto/storytelling
   - Dobra 3: 4 cards "Ministérios" (Defesa, Planejamento, Trabalho, Educação)
   - Dobra 4: Tabela/cards comparativos dos 3 ingressos (Start/Pro/Premium) com CTAs próprios para cada:
     - START → navega para `/captura`
     - PRO e PREMIUM → iniciam checkout Asaas (ver seção Asaas abaixo)
   - Dobra 5: Bio do mentor Fellipe Barcelos
2. `/captura` — Página de Captura do Ingresso Start
   - Formulário: nome, e-mail, whatsapp (com DDD, validar formato BR)
   - Submit → `POST /api/leads` → grava no Google Sheets (ver seção abaixo) → redireciona para `/obrigado`
3. `/obrigado` — Página de Obrigado
   - Barra de progresso visual "98%"
   - CTA "ENTRAR NO GRUPO" → link para `process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL` (placeholder)

## Integração Asaas (checkout Pro/Premium)
- Criar `/api/checkout/route.ts` (POST): recebe `{ plano: "pro" | "premium" }`,
  usa API do Asaas (https://docs.asaas.com/) para criar uma cobrança/checkout
  (payment link ou checkout transparente — payment link é mais simples, use esse).
- Valores: Pro = R$29,90, Premium = R$49,90 (ler de constantes em `lib/plans.ts`)
- Credenciais via env vars (placeholders, NÃO reais):
  - `ASAAS_API_KEY=your_asaas_api_key_here`
  - `ASAAS_API_URL=https://api-sandbox.asaas.com/v3` (sandbox por padrão)
- Após criar a cobrança, redirecionar o usuário para a `invoiceUrl`/`checkoutUrl` retornada pelo Asaas.
- Tratar erros com mensagem amigável no front (toast ou texto simples).
- Documentar em `README.md` como trocar para produção.

## Integração Leads → Google Sheets
- Criar `/api/leads/route.ts` (POST): recebe `{ nome, email, whatsapp }`,
  valida campos, grava uma linha numa planilha Google Sheets usando a
  Google Sheets API (service account).
- Env vars placeholder:
  - `GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here`
  - `GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email_here`
  - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=your_private_key_here`
- Documentar em `README.md` o passo a passo pra criar a service account e
  compartilhar a planilha com ela.
- Se a chamada falhar, não bloquear o usuário (logar erro, seguir pro /obrigado) —
  mas deixar isso configurável/comentado.

## Analytics
- Adicionar suporte a Google Analytics (GA4) e Meta Pixel via componentes em
  `app/layout.tsx`, condicionados a env vars placeholder:
  - `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
  - `NEXT_PUBLIC_META_PIXEL_ID=000000000000000`
- Disparar evento de conversão no `/obrigado` (lead) e ao iniciar checkout (Pro/Premium).

## Entregáveis
- Projeto Next.js funcional, roda com `npm run dev`
- `.env.example` com todas as variáveis placeholder documentadas
- `README.md` explicando como configurar Asaas, Google Sheets e Analytics
- Commitar tudo no git local (`git add -A && git commit -m "feat: estrutura, rotas e integrações"`) ao final
- NÃO se preocupar com CSS/visual além do mínimo estrutural (isso é intencional,
  outra etapa cuida disso)

## Regras importantes
- Markup semântico e bem comentado, estrutura de componentes clara (ex:
  `components/Hero.tsx`, `components/MinisteriosGrid.tsx`, `components/PlanosTable.tsx`,
  `components/MentorBio.tsx`, `components/CapturaForm.tsx`, etc.) para facilitar
  a próxima IA estilizar sem precisar reestruturar nada.
- Use o texto da copy literalmente de COPY.md, sem reescrever.
- Ao final, rode `npm run build` para garantir que compila sem erros antes de commitar.
