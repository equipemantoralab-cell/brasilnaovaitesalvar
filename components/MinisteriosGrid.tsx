// components/MinisteriosGrid.tsx
const ministerios = [
  {
    title: 'MINISTÉRIO DA DEFESA',
    body: 'Confiança, comunicação e posicionamento. Aprenda a ocupar espaços, defender seu valor, blindar seu emocional e parar de deixar a insegurança decidir por você.',
  },
  {
    title: 'MINISTÉRIO DO PLANEJAMENTO',
    body: 'Prioridades, procrastinação e execução. Organize seu tempo e sua energia para parar de adiar o que precisa ser feito e finalmente progredir na vida.',
  },
  {
    title: 'MINISTÉRIO DO TRABALHO',
    body: 'Carreira, renda e crescimento profissional. Entenda quais movimentos podem aumentar seu valor e abrir novas oportunidades.',
  },
  {
    title: 'MINISTÉRIO DA EDUCAÇÃO',
    body: 'Estudos, habilidades e competências. Descubra o que vale a pena aprender para chegar mais perto da vida que você quer.',
  },
];

const cardTones = [
  'bg-campaignRed text-paper',
  'bg-forest text-paper',
  'bg-campaignBlue text-paper',
  'bg-sun text-ink',
];

export default function MinisteriosGrid() {
  return (
    <section
      id="como-funciona"
      data-section="ministerios"
      className="grunge-surface relative overflow-hidden px-5 py-20 text-paper sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-16">
          <span className="mb-4 inline-block rotate-[-1deg] bg-sun px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-ink">O que você vai organizar</span>
          <h2 className="font-display text-6xl uppercase leading-[0.88] text-paper sm:text-8xl">
            Como vai funcionar o Plano de Governo Pessoal?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-7 text-paper/70 sm:text-lg">
            No dia 31, vamos reorganizar os &ldquo;ministérios&rdquo; mais importantes da sua vida.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6" data-grid="ministerios">
          {ministerios.map((m, index) => (
            <article
              key={m.title}
              className={`poster-card group relative overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:rotate-[0.5deg] sm:p-8 ${cardTones[index]}`}
              data-card="ministerio"
            >
              <span className="absolute right-5 top-2 font-display text-8xl text-current opacity-10 sm:text-9xl" aria-hidden="true">
                0{index + 1}
              </span>
              <div className="mb-7 flex h-11 w-11 items-center justify-center border-2 border-current bg-paper text-ink transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 9h16M6 9v8m4-8v8m4-8v8m4-8v8M3 20h18M12 3l9 4H3l9-4Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="relative max-w-sm font-display text-4xl uppercase leading-[0.9] sm:text-5xl">{m.title}</h3>
              <p className="relative mt-4 text-sm font-bold leading-7 opacity-85 sm:text-base">{m.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
