// app/captura/page.tsx
import CapturaForm from '@/components/CapturaForm';

export default function CapturaPage() {
  return (
    <main className="hero-surface relative flex min-h-screen items-center overflow-hidden px-5 py-12 text-cream sm:px-8 sm:py-20">
      <div className="pointer-events-none absolute -left-36 top-10 h-80 w-80 rounded-full border border-lime/20" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-20">
        <section data-section="captura-hero">
          <div className="mb-7 h-1 w-14 rounded-full bg-lime" aria-hidden="true" />
          <h1 className="max-w-3xl font-display text-6xl font-black uppercase leading-[0.82] tracking-tight text-paper sm:text-7xl lg:text-8xl">
            O BRASIL NÃO VAI TE SALVAR · INGRESSO START
          </h1>
          <p className="mt-7 text-xl font-extrabold text-lime sm:text-2xl">Você está quase lá…</p>
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
