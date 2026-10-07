# O Brasil Não Vai Te Salvar — Landing Page

Next.js 14 App Router landing page for the "O Brasil Não Vai Te Salvar" live event.

## Quick Start

```bash
cp .env.example .env.local
# Edit .env.local with your values (see sections below)
npm install
npm run dev
```

---

## Asaas (Pro/Premium checkout)

1. Create an account at [asaas.com](https://asaas.com).
2. Go to **Integrações → Chaves de API** and copy your API key.
3. Set `ASAAS_API_KEY` in `.env.local`.
4. For **sandbox** (testing): keep `ASAAS_API_URL=https://api-sandbox.asaas.com/v3`.
5. For **production**: set `ASAAS_API_URL=https://api.asaas.com/v3`.

The checkout route (`/api/checkout`) creates a Payment Link via Asaas and returns its URL. The user is redirected there to complete payment.

---

## Google Sheets (Lead capture)

1. In [Google Cloud Console](https://console.cloud.google.com/), create a project and enable the **Google Sheets API**.
2. Create a **Service Account** (IAM → Service Accounts → Create).
3. Download the JSON key file for that service account.
4. Copy the `client_email` value → `GOOGLE_SERVICE_ACCOUNT_EMAIL` in `.env.local`.
5. Copy the `private_key` value (the entire multi-line string) → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` in `.env.local`. Newlines must be literal `\n` or the full key wrapped in quotes.
6. Create a Google Sheets spreadsheet. Copy the spreadsheet ID from its URL (the long string between `/d/` and `/edit`). Set `GOOGLE_SHEETS_SPREADSHEET_ID`.
7. Share the spreadsheet with the service account email (Editor permission).

The first sheet (`Sheet1`) will receive rows: `[timestamp, nome, email, whatsapp]`.

> **Note:** If the Sheets write fails (missing env vars, network error, permission issue), the user is **not** blocked — they are redirected to `/obrigado` and the error is logged server-side. Check your Vercel/server logs to monitor for failures.

### Quiz Leads tab

The quiz at `/quiz` writes to a separate tab named **"Quiz Leads"** in the same spreadsheet.

**You must create this tab manually before quiz leads will be saved:**

1. Open your Google Sheets spreadsheet.
2. Click the **+** button at the bottom to add a new sheet.
3. Rename it exactly to `Quiz Leads` (case-sensitive).

Columns written (in order): `timestamp` | `nome` | `email` | `whatsapp` | `pontuacaoTotal` | `perfilResultado` | `respostaSegmentacao`

If the tab does not exist, the Sheets API returns an error that is caught and logged server-side — the user is not blocked from seeing their quiz result.

---

## Analytics

- **GA4:** Set `NEXT_PUBLIC_GA_ID` to your Measurement ID (format: `G-XXXXXXXXXX`).
- **Meta Pixel:** Set `NEXT_PUBLIC_META_PIXEL_ID` to your Pixel ID.
- Both are optional. When not set, the scripts are not injected.
- Conversion events fired:
  - `Lead` — on form submit on `/captura`
  - `InitiateCheckout` — when a user clicks Pro/Premium CTA (sales page or quiz result)
  - `CompleteRegistration` — on `/obrigado` page load
  - `QuizStart` — when a user clicks "COMECE AQUI" on `/quiz`
  - `QuizLead` — when a user submits the quiz lead capture form

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `ASAAS_API_KEY` | Yes (for paid tiers) | Asaas API key |
| `ASAAS_API_URL` | No (defaults to sandbox) | Asaas API base URL |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | No (leads still logged) | Google Sheets spreadsheet ID |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | No | Service account email |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | No | Service account private key |
| `NEXT_PUBLIC_GA_ID` | No | GA4 Measurement ID |
| `NEXT_PUBLIC_META_PIXEL_ID` | No | Meta Pixel ID |
| `NEXT_PUBLIC_WHATSAPP_GROUP_URL` | Yes (for /obrigado CTA) | WhatsApp group invite link |

---

## Project Structure

```
app/
  layout.tsx          # Root layout — analytics scripts injected here
  page.tsx            # / — Sales page (5 dobras)
  captura/page.tsx    # /captura — Lead capture form (Start tier)
  obrigado/page.tsx   # /obrigado — Thank-you page with WhatsApp CTA
  quiz/page.tsx       # /quiz — Lead capture quiz (8 questions, 4 profiles)
  api/
    leads/route.ts       # POST /api/leads — saves lead to Google Sheets (Sheet1)
    checkout/route.ts    # POST /api/checkout — creates Asaas payment link
    quiz-leads/route.ts  # POST /api/quiz-leads — saves quiz lead to "Quiz Leads" tab

components/
  Hero.tsx            # Dobra 1: headline + event info + CTA
  Dobra2.tsx          # Dobra 2: storytelling text
  MinisteriosGrid.tsx # Dobra 3: 4 ministry cards
  PlanosTable.tsx     # Dobra 4: pricing table with CTAs
  MentorBio.tsx       # Dobra 5: Fellipe Barcelos bio
  CapturaForm.tsx     # Lead capture form (client component)
  AnalyticsGA4.tsx    # GA4 script injector
  MetaPixel.tsx       # Meta Pixel script injector

lib/
  plans.ts            # Plan names, prices, CTAs
  analytics.ts        # trackEvent helper (gtag + fbq)
  quizData.ts         # Quiz questions, options, scoring, profile definitions
  googleSheets.ts     # Shared Google Sheets auth + appendToSheet helper
```

> **Design note:** Visual styling is intentionally minimal. Components carry `data-*` attributes and `// TODO: design` comments at every visual hotspot to guide the next design pass.
