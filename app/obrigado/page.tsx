// app/obrigado/page.tsx
'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function ObrigadoPage() {
  useEffect(() => {
    trackEvent('CompleteRegistration', { plan: 'start' });
  }, []);

  const groupUrl = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL ?? '#';

  return (
    <main
      className="hero-surface relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16 text-center text-cream sm:px-8"
      data-page="obrigado"
    >
      <div className="pointer-events-none absolute -right-32 top-12 h-80 w-80 rounded-full border border-lime/20" aria-hidden="true" />
      <section className="relative z-10 w-full max-w-xl rounded-3xl border border-cream/10 bg-paper p-6 text-ink shadow-2xl sm:p-10">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#25D366]/15 text-[#138a3d]" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div
          className="mb-8 w-full"
          role="progressbar"
          aria-valuenow={98}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso da inscrição"
          data-progress="98"
        >
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-forest">Sua inscrição está 98% concluída!</p>
          <div className="h-3 w-full overflow-hidden rounded-full bg-forest/10 p-0.5">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald to-lime shadow-sm" style={{ width: '98%' }} />
          </div>
        </div>

        <h1 className="font-display text-6xl font-black uppercase leading-none tracking-tight text-forest sm:text-7xl">Só falta um passo!</h1>

        <p className="mx-auto mt-6 max-w-md text-sm font-medium leading-7 text-ink/65 sm:text-base">
          Clique no botão abaixo e entre agora nosso grupo oficial do WhatsApp pra
          ter acesso à imersão O Brasil não Vai Te Salvar:
        </p>

        <a
          href={groupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-[#25D366] px-8 py-4 text-sm font-black tracking-wide text-[#052e16] shadow-[0_16px_40px_rgba(37,211,102,.25)] transition duration-300 hover:-translate-y-1 hover:bg-[#34e879] hover:shadow-[0_20px_50px_rgba(37,211,102,.35)]"
          data-cta="whatsapp-group"
        >
          <svg viewBox="0 0 24 24" className="mr-3 h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2a9.84 9.84 0 0 0-8.42 14.93L2.05 22l5.2-1.52A9.94 9.94 0 1 0 12.04 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.08.9.93-3-.2-.31a8.16 8.16 0 1 1 6.83 3.73Zm4.48-6.12c-.25-.12-1.45-.71-1.68-.8-.22-.08-.38-.12-.54.13-.16.24-.63.79-.77.95-.14.17-.28.19-.53.07-.24-.12-1.03-.38-1.96-1.21a7.35 7.35 0 0 1-1.36-1.7c-.14-.25-.01-.38.11-.5.11-.1.25-.28.37-.42.12-.14.16-.24.24-.4.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.75-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.3-.22.25-.85.83-.85 2.02s.87 2.34.99 2.5c.12.17 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.45-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.46-.28Z" />
          </svg>
          ENTRAR NO GRUPO
        </a>

        <p className="mx-auto mt-6 max-w-sm text-xs font-medium leading-6 text-ink/50 sm:text-sm">
          &ldquo;E relaxa: o grupo é só pra te avisar sobre o evento e mandar materiais
          importantes. Nada de spam.&rdquo;
        </p>
      </section>
    </main>
  );
}
