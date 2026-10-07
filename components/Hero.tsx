export default function Hero() {
  const ticker = 'EVENTO ONLINE  •  GRATUITO  •  31 DE OUTUBRO  •  15HRS  •  ';

  return (
    <section
      id="hero"
      data-section="hero"
      className="hero-surface halftone-corner relative isolate flex min-h-[100svh] flex-col overflow-hidden text-cream"
    >
      <div className="campaign-ticker relative z-20 overflow-hidden py-2.5 text-sm sm:text-base">
        <div className="whitespace-nowrap text-center">
          {ticker.repeat(4)}
        </div>
      </div>

      <img
        src="/brand/ornamento-estrela.svg"
        alt=""
        className="pointer-events-none absolute left-[5%] top-[18%] z-0 w-16 rotate-[-10deg] opacity-90 sm:w-24"
        aria-hidden="true"
      />
      <img
        src="/brand/marker-seta.svg"
        alt=""
        className="pointer-events-none absolute bottom-[18%] right-[5%] z-0 w-14 rotate-[18deg] opacity-90 sm:w-20"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 py-14 text-center sm:px-8 sm:py-20">
        <p className="poster-card mb-6 rotate-[-1deg] bg-sun px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-ink sm:text-sm">
          Uma tarde para mudar os próximos 4 meses
        </p>

        <h1 className="sr-only">O Brasil Não Vai Te Salvar</h1>
        <img
          src="/brand/brasil-nao-vai-te-salvar.png"
          alt="O Brasil Não Vai Te Salvar"
          className="w-full max-w-[760px] drop-shadow-[6px_7px_0_rgba(35,35,36,.45)]"
        />

        <p className="mt-4 max-w-3xl text-lg font-bold leading-relaxed text-paper sm:mt-5 sm:text-2xl">
          Pare de esperar sua vida melhorar e construa, em uma tarde, um plano
          para fazer seus próximos 4 meses valerem mais que os últimos 4 anos.
        </p>

        <p className="mt-5 max-w-3xl bg-ink px-4 py-2 text-base font-black uppercase leading-relaxed text-sun sm:text-xl">
          O fim da sua procrastinação, da sua insegurança e do seu salário de merd@.
        </p>

        <p className="mt-5 max-w-2xl text-sm font-bold leading-7 text-paper/85 sm:text-base">
          Uma imersão ao vivo para quem não quer só torcer por uma vida melhor de
          braços cruzados, com ingressos a partir de R$0.
        </p>

        <div className="mt-7 flex flex-col items-center gap-5 sm:flex-row">
          <p className="poster-card bg-paper px-5 py-3 font-display text-2xl uppercase text-ink sm:text-3xl">
            31 DE OUTUBRO • 15H • ON-LINE
          </p>
          <a
            href="#ingressos"
            className="group poster-card inline-flex min-h-14 w-full items-center justify-center bg-sun px-7 py-4 text-sm font-black uppercase tracking-wide text-ink transition duration-200 hover:-translate-y-1 hover:translate-x-1 hover:bg-paper active:translate-y-0 sm:w-auto sm:min-w-72 sm:text-base"
            data-cta="hero-main"
          >
            Garantir meu ingresso
            <span className="ml-3 text-xl transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
