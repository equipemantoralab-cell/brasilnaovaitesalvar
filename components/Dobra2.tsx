// components/Dobra2.tsx
export default function Dobra2() {
  return (
    <section
      id="sobre"
      data-section="dobra2"
      className="paper-noise relative bg-sun px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <p className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl md:text-7xl">
          Eu não nasci playboy, e nem você.
        </p>
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
          <p className="rounded-2xl bg-ink p-6 text-cream shadow-card sm:p-8">
            Durante a imersão, eu vou montar com você o seu{' '}
            <strong className="text-lime">PLANO DE GOVERNO PESSOAL</strong>: um plano prático pra fazer
            sua vida avançar 4 anos nos próximos 4 meses.
          </p>
        </div>
      </div>
    </section>
  );
}
