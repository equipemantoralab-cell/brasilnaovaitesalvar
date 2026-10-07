// components/MentorBio.tsx
export default function MentorBio() {
  return (
    <section
      id="mentor"
      data-section="mentor"
      className="paper-noise bg-cream px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
        <div>
          <div
            className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] bg-forest shadow-card lg:mx-0"
            data-placeholder="mentor-photo"
            aria-label="Foto do mentor Fellipe Barcelos"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(217,246,74,.24),transparent_34%)]" />
            <svg viewBox="0 0 320 400" className="absolute inset-x-0 bottom-0 w-full text-emerald" fill="currentColor" aria-hidden="true">
              <circle cx="160" cy="122" r="68" />
              <path d="M47 400c3-101 45-164 113-164s110 63 113 164H47Z" />
            </svg>
            <div className="absolute inset-4 rounded-[1.5rem] border border-lime/25" aria-hidden="true" />
          </div>
        </div>

        <div>
          <h2 className="font-display text-6xl font-black uppercase leading-[0.82] tracking-tight text-forest sm:text-8xl">FELLIPE BARCELOS</h2>
          <ul className="mt-10 space-y-5 border-t-2 border-forest pt-8">
            <li className="flex gap-4 text-sm font-medium leading-7 text-ink/75 sm:text-base">
              <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-emerald" aria-hidden="true" />
              <span>Mais velho de 3 irmãos, cresceu em diferentes quebradas do Litoral
              Paulista e estudou a vida inteira em escola pública.</span>
            </li>
            <li className="flex gap-4 text-sm font-medium leading-7 text-ink/75 sm:text-base">
              <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-emerald" aria-hidden="true" />
              <span>Passou por Engenharia em universidades federais, trabalhou no maior
              porto da América Latina e, depois, decidiu construir o próprio
              caminho empreendendo.</span>
            </li>
            <li className="flex gap-4 text-sm font-medium leading-7 text-ink/75 sm:text-base">
              <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-emerald" aria-hidden="true" />
              <span>É fundador do Mantora Lab, sua empresa de marketing e vendas, que
              atende grandes nomes do mercado digital (como Hosaka e Drª. Jannuzzi).</span>
            </li>
            <li className="flex gap-4 text-sm font-medium leading-7 text-ink/75 sm:text-base">
              <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-emerald" aria-hidden="true" />
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
