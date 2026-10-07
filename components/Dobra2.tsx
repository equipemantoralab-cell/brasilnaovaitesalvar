// components/Dobra2.tsx
export default function Dobra2() {
  return (
    <section
      id="sobre"
      data-section="dobra2"
      className="cream-paper relative overflow-hidden bg-paper px-5 py-20 sm:px-8 sm:py-28"
    >
      <img src="/brand/marker-circulo.svg" alt="" className="pointer-events-none absolute -right-20 top-12 w-72 opacity-50 sm:w-[30rem]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div>
          <p className="font-display text-6xl uppercase leading-[0.88] text-ink sm:text-7xl md:text-8xl">
            Eu não nasci playboy, e nem você.
          </p>
          <img src="/brand/ornamento-linha.svg" alt="" className="mt-5 w-48" aria-hidden="true" />
        </div>
        <div className="space-y-6 border-t-2 border-ink pt-7 text-base font-medium leading-8 sm:text-lg">
          <p>
            Seria burrice fingir que todo mundo começa da mesma linha de largada,
            que políticas públicas não importam ou que basta &ldquo;querer muito&rdquo; pra
            conseguir qualquer coisa.
          </p>
          <p>
            Mas existe outro erro tão perigoso quanto: entregar completamente o seu
            futuro pro que você não consegue controlar sozinho (como a cabeça do
            político X ou Y).
          </p>
          <p className="poster-card rotate-[0.5deg] bg-ink p-6 text-cream sm:p-8">
            Durante a imersão, eu vou montar com você o seu{' '}
            <strong className="font-display text-2xl uppercase text-lime">Plano de Governo Pessoal</strong>: um plano prático pra fazer
            sua vida avançar 4 anos nos próximos 4 meses.
          </p>
        </div>
      </div>
    </section>
  );
}
