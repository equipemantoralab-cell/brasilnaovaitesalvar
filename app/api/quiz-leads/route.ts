// app/api/quiz-leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { appendToSheetWithHeader } from '@/lib/googleSheets';

const HEADERS = [
  'Data/hora',
  'Nome',
  'E-mail',
  'WhatsApp',
  'Pontuação total',
  'Perfil do resultado',
  'Resposta de segmentação',
];

function validateWhatsApp(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length === 11;
}

interface QuizLeadBody {
  nome?: string;
  email?: string;
  whatsapp?: string;
  pontuacaoTotal?: number;
  perfilResultado?: string;
  respostaSegmentacao?: string;
}

export async function POST(req: NextRequest) {
  let body: QuizLeadBody;
  try {
    body = (await req.json()) as QuizLeadBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { nome, email, whatsapp, pontuacaoTotal, perfilResultado, respostaSegmentacao } = body;

  if (!nome?.trim()) {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
  }
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });
  }
  if (!whatsapp || !validateWhatsApp(whatsapp)) {
    return NextResponse.json({ error: 'WhatsApp inválido' }, { status: 400 });
  }

  try {
    await appendToSheetWithHeader('Quiz Leads', HEADERS, [
      [
        new Date().toISOString(),
        nome.trim(),
        email.trim(),
        whatsapp.trim(),
        pontuacaoTotal ?? '',
        perfilResultado ?? '',
        respostaSegmentacao ?? '',
      ],
    ]);
  } catch (err) {
    // Per spec: log error but do not block the user
    console.error('[quiz-leads] Google Sheets write failed:', err);
  }

  return NextResponse.json({ ok: true });
}
