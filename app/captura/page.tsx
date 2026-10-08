// app/captura/page.tsx
import CapturaForm from '@/components/CapturaForm';

export default function CapturaPage() {
  return (
    <main className="capture-surface relative flex min-h-screen items-center overflow-hidden px-5 py-12 text-cream sm:px-8 sm:py-20" data-page="captura">
      <img src="/brand/ornamento-estrela.svg" alt="" className="pointer-events-none absolute left-8 top-8 w-20 rotate-[-8deg]" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-20">
        <section data-section="captura-hero">
          <img src="/brand/brasil-nao-vai-te-salvar.png" alt="O Brasil Não Vai Te Salvar" className="w-full max-w-2xl drop-shadow-[5px_6px_0_rgba(35,35,36,.4)]" />
          <h1 className="mt-3 max-w-3xl font-display text-5xl uppercase leading-[0.82] text-paper sm:text-6xl">Ingresso Start</h1>
          <p className="mt-7 inline-block rotate-[-1deg] bg-sun px-3 py-1 text-xl font-extrabold text-ink sm:text-2xl">Você está quase lá…</p>
          <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-cream/70 sm:text-base">
            Preencha seus dados aqui pra confirmar sua vaga e receber o acesso ao
            evento e aos seus bônus do Ingresso Start.
          </p>
        </section>

        <CapturaForm />
      </div>
    </main>
  );
}
