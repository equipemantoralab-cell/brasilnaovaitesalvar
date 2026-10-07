// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/googleSheets';

function validateWhatsApp(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length === 11;
}

export async function POST(req: NextRequest) {
  let body: { nome?: string; email?: string; whatsapp?: string };
  try {
    body = (await req.json()) as { nome?: string; email?: string; whatsapp?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { nome, email, whatsapp } = body;

  if (!nome?.trim()) {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
  }
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });
  }
  if (!whatsapp || !validateWhatsApp(whatsapp)) {
    return NextResponse.json({ error: 'WhatsApp inválido' }, { status: 400 });
  }

  // Attempt to write to Google Sheets (non-blocking on failure per spec)
  try {
    await appendToSheet('Sheet1!A:D', [
      [new Date().toISOString(), nome.trim(), email.trim(), whatsapp.trim()],
    ]);
  } catch (err) {
    // Per spec: log error but do not block the user
    console.error('[leads] Google Sheets write failed:', err);
  }

  return NextResponse.json({ ok: true });
}
