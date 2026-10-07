// components/MentorBio.tsx
export default function MentorBio() {
  return (
    <section
      id="mentor"
      data-section="mentor"
      className="halftone-corner relative overflow-hidden bg-forest px-5 py-20 text-paper sm:px-8 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
        <div>
          <div
            className="poster-card relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-campaignRed lg:mx-0"
            data-placeholder="mentor-photo"
            aria-label="Foto do mentor Fellipe Barcelos"
          >
            <div className="absolute inset-0 bg-[url('/brand/textura-grunge.webp')] bg-[length:420px] opacity-25 mix-blend-multiply" />
            <svg viewBox="0 0 320 400" className="absolute inset-x-0 bottom-0 w-full text-ink" fill="currentColor" aria-hidden="true">
              <circle cx="160" cy="122" r="68" />
              <path d="M47 400c3-101 45-164 113-164s110 63 113 164H47Z" />
            </svg>
            <div className="absolute inset-4 border-2 border-sun" aria-hidden="true" />
          </div>
        </div>

        <div>
          <span className="inline-block rotate-[-1deg] bg-sun px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-ink">Quem vai conduzir</span>
          <h2 className="mt-5 font-display text-7xl uppercase leading-[0.82] text-paper sm:text-9xl">FELLIPE BARCELOS</h2>
          <ul className="mt-10 space-y-5 border-t-2 border-sun pt-8">
            <li className="flex gap-4 text-sm font-medium leading-7 text-paper/80 sm:text-base">
              <span className="mt-2.5 h-2 w-2 shrink-0 bg-sun" aria-hidden="true" />
              <span>Mais velho de 3 irmãos, cresceu em diferentes quebradas do Litoral
              Paulista e estudou a vida inteira em escola pública.</span>
            </li>
            <li className="flex gap-4 text-sm font-medium leading-7 text-paper/80 sm:text-base">
              <span className="mt-2.5 h-2 w-2 shrink-0 bg-sun" aria-hidden="true" />
              <span>Passou por Engenharia em universidades federais, trabalhou no maior
              porto da América Latina e, depois, decidiu construir o próprio
              caminho empreendendo.</span>
            </li>
            <li className="flex gap-4 text-sm font-medium leading-7 text-paper/80 sm:text-base">
              <span className="mt-2.5 h-2 w-2 shrink-0 bg-sun" aria-hidden="true" />
              <span>É fundador do Mantora Lab, sua empresa de marketing e vendas, que
              atende grandes nomes do mercado digital (como Hosaka e Drª. Jannuzzi).</span>
            </li>
            <li className="flex gap-4 text-sm font-medium leading-7 text-paper/80 sm:text-base">
              <span className="mt-2.5 h-2 w-2 shrink-0 bg-sun" aria-hidden="true" />
              <span>Hoje, ele dedica seu tempo para orientar quem veio da mesma realidade
              com menos privilégios e já reúne uma comunidade de mais de 80 mil
              seguidores que também vieram de baixo e querem uma vida de progresso
              constante.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
