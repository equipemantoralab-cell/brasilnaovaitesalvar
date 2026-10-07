// components/Hero.tsx
export default function Hero() {
  return (
    <section
      id="hero"
      data-section="hero"
      className="hero-surface relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-20 text-center text-cream sm:px-8 sm:py-24"
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full border border-lime/20 sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-44 w-44 rotate-12 border-[24px] border-sky/10 sm:h-64 sm:w-64" />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
        <div className="mb-7 h-1 w-16 rounded-full bg-lime sm:mb-9" aria-hidden="true" />
        <h1 className="max-w-5xl font-display text-[clamp(4.4rem,16vw,10.5rem)] font-black uppercase leading-[0.76] tracking-[-0.045em] text-paper">
          O BRASIL NÃO VAI TE SALVAR
        </h1>

        <p className="mt-9 max-w-3xl text-lg font-semibold leading-relaxed text-paper sm:mt-12 sm:text-2xl sm:leading-relaxed">
          Pare de esperar sua vida melhorar e construa, em uma tarde, um plano
          para fazer seus próximos 4 meses valerem mais que os últimos 4 anos.
        </p>

        <p className="mt-5 max-w-2xl border-l-2 border-sun pl-4 text-left text-base font-bold leading-relaxed text-sun sm:mt-6 sm:text-lg">
          O fim da sua procrastinação, da sua insegurança e do seu salário de merd@.
        </p>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-cream/70 sm:text-base">
          Uma imersão ao vivo para quem não quer só torcer por uma vida melhor de
          braços cruzados, com ingressos a partir de R$0 (estar quebrado não é desculpa!).
        </p>

        <p className="mt-8 rounded-full border border-cream/20 bg-cream/[0.07] px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-cream backdrop-blur sm:px-6 sm:text-sm">
          31 DE OUTUBRO • 15H • 100% ON-LINE
        </p>

        <a
          href="#ingressos"
          className="group mt-7 inline-flex min-h-14 w-full max-w-sm items-center justify-center rounded-xl bg-lime px-7 py-4 text-sm font-black tracking-wide text-ink shadow-lime transition duration-300 hover:-translate-y-1 hover:bg-paper hover:shadow-2xl active:translate-y-0 sm:w-auto sm:min-w-80 sm:text-base"
          data-cta="hero-main"
        >
          GARANTIR MEU INGRESSO
          <span className="ml-3 text-xl transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
