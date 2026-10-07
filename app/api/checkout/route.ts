// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PLANS } from '@/lib/plans';

export async function POST(req: NextRequest) {
  let body: { plano?: string };
  try {
    body = (await req.json()) as { plano?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { plano } = body;
  if (plano !== 'pro' && plano !== 'premium') {
    return NextResponse.json(
      { error: 'Plano inválido. Use "pro" ou "premium".' },
      { status: 400 }
    );
  }

  const apiKey = process.env.ASAAS_API_KEY;
  const apiUrl = process.env.ASAAS_API_URL ?? 'https://api-sandbox.asaas.com/v3';

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Checkout indisponível no momento. Tente novamente mais tarde.' },
      { status: 503 }
    );
  }

  const plan = PLANS[plano];
  const valueInReais = plan.price / 100;

  try {
    const response = await fetch(`${apiUrl}/paymentLinks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: apiKey,
      },
      body: JSON.stringify({
        name: `${plan.name} — O Brasil Não Vai Te Salvar`,
        value: valueInReais,
        billingType: 'UNDEFINED', // lets customer choose payment method
        chargeType: 'DETACHED',
        description: `Ingresso ${plan.name} para a imersão ao vivo de 31 de outubro.`,
      }),
    });

    const data = (await response.json()) as {
      url?: string;
      invoiceUrl?: string;
      checkoutUrl?: string;
      [key: string]: unknown;
    };

    if (!response.ok) {
      console.error('[checkout] Asaas error:', data);
      return NextResponse.json(
        { error: 'Erro ao criar checkout. Tente novamente em instantes.' },
        { status: 502 }
      );
    }

    const checkoutUrl: string | undefined = data.url ?? data.invoiceUrl ?? data.checkoutUrl;
    if (!checkoutUrl) {
      console.error('[checkout] Asaas response missing URL:', data);
      return NextResponse.json(
        { error: 'Não foi possível obter o link de pagamento. Tente novamente.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error('[checkout] Network error:', err);
    return NextResponse.json(
      { error: 'Erro de conexão com o gateway de pagamento. Tente novamente.' },
      { status: 502 }
    );
  }
}
