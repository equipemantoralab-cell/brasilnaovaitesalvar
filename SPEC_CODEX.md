# SPEC — Etapa 2 (Codex): Design Visual

## Contexto
O projeto Next.js já está funcional (feito pela etapa anterior). Rotas: `/`,
`/captura`, `/obrigado`. A copy está em `COPY.md`. README.md documenta a
estrutura de componentes.

## SUA RESPONSABILIDADE (e SOMENTE ela)
Você cuida EXCLUSIVAMENTE do design visual: paleta de cores, tipografia,
espaçamento, layout responsivo, animações/transições leves, estados de
hover/focus, e polimento geral de UI usando Tailwind CSS.

## REGRAS RÍGIDAS — NÃO QUEBRAR
1. **NÃO** altere lógica de negócio, chamadas de API, nomes de props,
   estrutura de dados, imports de libs de integração (Asaas, Google Sheets,
   analytics), nem o conteúdo textual (copy).
2. **NÃO** edite os arquivos dentro de `app/api/`, `lib/plans.ts`,
   `lib/analytics.ts`.
3. **NÃO** remova nenhum `data-*` attribute, `id`, nem o `href`/`onClick`
   dos CTAs e links existentes — apenas adicione/ajuste `className`.
4. **PODE** editar livremente: `className` (Tailwind), `tailwind.config.ts`
   (cores, fontes, breakpoints customizados), `app/globals.css` (fontes
   importadas, variáveis CSS), estrutura de divs/wrappers PURAMENTE visuais
   (ex: envolver algo em uma div decorativa), e adicionar ícones/imagens
   decorativas.
5. Remova os comentários `// TODO: design` conforme for implementando cada
   ponto (sinal de progresso).
6. Ao final, rode `npm run build` para garantir que nada quebrou, e comite
   com mensagem `style: design visual completo`.

## Direção de Design
- **Público:** pessoas 20-40 anos, classe C/D buscando ascensão pessoal/profissional,
  tom direto, motivacional, "de quebrada pra cima" — autêntico, não corporativo.
- **Tema visual:** usar a metáfora de "governo/ministérios" do conteúdo de forma
  sutil (ex: paleta inspirada em bandeira/identidade visual nacional, mas moderna
  e premium — evite clichê cafona de verde-amarelo brega; pense em um tom mais
  editorial/dark com toques de cor de destaque).
- **Estilo geral:** landing page de infoproduto/evento moderno — hero de alto
  impacto, tipografia forte e grande, bastante contraste, CTAs com alto
  destaque visual (cor vibrante, sombra, hover state claro).
- **Dobra 4 (ingressos):** destacar visualmente o ingresso "PRO" (mais escolhido)
  como o mais proeminente dos 3 cards/colunas (ex: borda, badge, escala levemente maior).
- **Responsivo:** mobile-first obrigatório — a maior parte do tráfego de uma
  página de vendas assim vem de redes sociais no celular.
- **Página de obrigado:** deve parecer uma confirmação de sucesso — barra de
  progresso visualmente clara, CTA do WhatsApp com a cor da marca do WhatsApp
  (verde) ou destaque forte.
- Fonte: pode importar uma Google Font via `next/font` (ex: Inter, Poppins,
  Sora, ou similar — algo moderno e legível) em `app/layout.tsx`
  (CUIDADO: app/layout.tsx também injeta os scripts de analytics — não remova
  esse código, apenas adicione a fonte).

## Fluxo de trabalho recomendado
1. Leia `COPY.md`, `README.md`, e todos os arquivos em `components/` e `app/`
   primeiro para entender a estrutura completa antes de estilizar.
2. Defina a paleta/tipografia em `tailwind.config.ts` primeiro (cores customizadas,
   fontes).
3. Estilize componente por componente, removendo os `// TODO: design` comments.
4. Teste responsividade mentalmente em cada etapa (classes `sm:`, `md:`, `lg:`).
5. Build final + commit.

## Entregável
Página visualmente completa, profissional, responsiva, sem nenhuma mudança
de lógica/dados/integrações, buildando sem erros, commitada no git.
