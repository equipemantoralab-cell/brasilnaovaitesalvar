import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/googleSheets';

const FIELDS = [
  'idade',
  'genero',
  'relacionamento',
  'formacao',
  'estado',
  'quatro_anos',
  'area_urgente',
  'renda',
  'preocupacao_futuro',
  'conquista_2027',
  'futuro_nas_maos',
  'compromisso_imersao',
] as const;

type Field = (typeof FIELDS)[number];
type PesquisaBody = Partial<Record<Field, string | number>>;

export async function POST(req: NextRequest) {
  let body: PesquisaBody;

  try {
    body = (await req.json()) as PesquisaBody;
  } catch {
    return NextResponse.json({ error: 'Corpo JSON inválido' }, { status: 400 });
  }

  const missingField = FIELDS.find((field) => {
    const value = body[field];
    return value === undefined || value === null || (typeof value === 'string' && !value.trim());
  });

  if (missingField) {
    return NextResponse.json({ error: `Resposta obrigatória ausente: ${missingField}` }, { status: 400 });
  }

  const row = [
    new Date().toISOString(),
    ...FIELDS.map((field) => {
      const value = body[field];
      return typeof value === 'string' ? value.trim() : (value ?? '');
    }),
  ];

  try {
    await appendToSheet('Pesquisa Quiz!A:M', [row]);
  } catch (error) {
    console.error('[pesquisa-respostas] Google Sheets write failed:', error);
  }

  return NextResponse.json({ ok: true });
}
