'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

type Question =
  | {
      id: string;
      type: 'choice';
      title: string;
      helper?: string;
      options: string[];
      compact?: boolean;
    }
  | {
      id: string;
      type: 'state';
      title: string;
      options: string[];
    }
  | {
      id: string;
      type: 'text';
      title: string;
      placeholder: string;
    }
  | {
      id: string;
      type: 'scale';
      title: string;
      minLabel?: string;
      maxLabel?: string;
    };

const STATES = [
  'Moro fora do Brasil atualmente',
  'Acre (AC)',
  'Alagoas (AL)',
  'Amapá (AP)',
  'Amazonas (AM)',
  'Bahia (BA)',
  'Ceará (CE)',
  'Distrito Federal (DF)',
  'Espírito Santo (ES)',
  'Goiás (GO)',
  'Maranhão (MA)',
  'Mato Grosso (MT)',
  'Mato Grosso do Sul (MS)',
  'Minas Gerais (MG)',
  'Pará (PA)',
  'Paraíba (PB)',
  'Paraná (PR)',
  'Pernambuco (PE)',
  'Piauí (PI)',
  'Rio de Janeiro (RJ)',
  'Rio Grande do Norte (RN)',
  'Rio Grande do Sul (RS)',
  'Rondônia (RO)',
  'Roraima (RR)',
  'Santa Catarina (SC)',
  'São Paulo (SP)',
  'Sergipe (SE)',
  'Tocantins (TO)',
];

const QUESTIONS: Question[] = [
  {
    id: 'idade',
    type: 'choice',
    title: 'Qual é a sua idade?',
    compact: true,
    options: [
      'Menos de 18',
      '18–20 anos',
      '21–23 anos',
      '24–26 anos',
      '27–30 anos',
      '31–34 anos',
      '35–44 anos',
      '45 anos ou +',
    ],
  },
  {
    id: 'genero',
    type: 'choice',
    title: 'Qual é o seu gênero?',
    options: ['Feminino', 'Masculino'],
  },
  {
    id: 'relacionamento',
    type: 'choice',
    title: 'Qual é o seu status de relacionamento?',
    compact: true,
    options: ['Solteiro(a)', 'Namorando', 'Noivo(a)', 'Casado(a)', 'União estável', 'Divorciado(a)', 'Viúvo(a)'],
  },
  {
    id: 'formacao',
    type: 'choice',
    title: 'Qual é o seu nível de formação atual?',
    options: [
      'Ensino Médio Incompleto',
      'Ensino Médio Completo',
      'Cursando o Ensino Superior',
      'Ensino Superior Completo',
    ],
  },
  {
    id: 'estado',
    type: 'state',
    title: 'Em qual estado você mora?',
    options: STATES,
  },
  {
    id: 'quatro_anos',
    type: 'choice',
    title: 'Se absolutamente NADA mudasse na sua vida nos próximos 4 anos, como você se sentiria?',
    options: [
      'Tranquilo. Já estou muito perto da vida que quero.',
      'Incomodado, porque ainda quero conquistar bastante coisa.',
      'Muito frustrado. Sinto que já deveria estar mais longe.',
      'Desesperado. Não quero nem imaginar continuar como estou.',
    ],
  },
  {
    id: 'area_urgente',
    type: 'choice',
    title: 'Qual “ministério”/área da sua vida mais precisa de uma “intervenção” urgente hoje?',
    helper: 'Escolha o principal:',
    options: [
      'Trabalho: toda a parte de carreira e salário.',
      'Educação: toda a parte de estudos, habilidades e qualificação.',
      'Defesa: a minha falta de confiança e dificuldade de me comunicar e me posicionar.',
      'Planejamento: luto contra a procrastinação e sofro pra ter disciplina.',
    ],
  },
  {
    id: 'renda',
    type: 'choice',
    title: 'Quanto você ganha por mês hoje, mais ou menos?',
    options: [
      'Até 1 salário mínimo',
      'De 1 salário mínimo a R$ 2.000',
      'De R$ 2.000 a R$ 2.500',
      'De R$ 2.500 a R$ 3.000',
      'Mais de R$ 3.000',
      'Hoje não tenho renda',
    ],
  },
  {
    id: 'preocupacao_futuro',
    type: 'text',
    title: 'Hoje, o que mais te preocupa quando pensa no seu futuro?',
    placeholder: 'Escreva sua resposta aqui…',
  },
  {
    id: 'conquista_2027',
    type: 'text',
    title: 'Se você pudesse chegar no final de fevereiro de 2027 com UMA conquista nova, qual seria?',
    placeholder: 'Conte qual conquista faria diferença pra você…',
  },
  {
    id: 'futuro_nas_maos',
    type: 'scale',
    title: 'Hoje, quanto você sente que o seu futuro está nas suas mãos?',
    minLabel: 'Sou só uma vítima do contexto',
    maxLabel: 'Mesmo com coisas fora do meu controle, consigo agir bem sobre aquilo que está ao meu alcance',
  },
  {
    id: 'compromisso_imersao',
    type: 'scale',
    title: 'De 0 a 10, o quanto você se compromete a participar da imersão O Brasil Não Vai Te Salvar (dia 31/10, às 15h) e aplicar o que for dito lá?',
  },
];

type Screen = 'intro' | 'questions' | 'thanks';
type Answers = Record<string, string | number>;

export default function PesquisaPage() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const question = QUESTIONS[currentIndex];
  const currentAnswer = answers[question?.id];
  const giftUrl = process.env.NEXT_PUBLIC_AULA_AQUECIMENTO_URL ?? '';

  function startQuiz() {
    trackEvent('PesquisaStart');
    setScreen('questions');
  }

  function setAnswer(value: string | number) {
    setAnswers((current) => ({ ...current, [question.id]: value }));
    setShowValidation(false);
  }

  function hasAnswer() {
    if (typeof currentAnswer === 'number') return true;
    return typeof currentAnswer === 'string' && currentAnswer.trim().length > 0;
  }

  function goBack() {
    if (currentIndex === 0) {
      setScreen('intro');
      return;
    }
    setShowValidation(false);
    setCurrentIndex((index) => index - 1);
  }

  async function continueQuiz() {
    if (!hasAnswer()) {
      setShowValidation(true);
      return;
    }

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((index) => index + 1);
      setShowValidation(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/pesquisa-respostas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...answers, [question.id]: currentAnswer }),
      });
      if (!response.ok) console.error('[pesquisa] API error:', await response.text());
    } catch (error) {
      console.error('[pesquisa] Submission error:', error);
    } finally {
      setSubmitting(false);
    }

    trackEvent('PesquisaComplete');
    setScreen('thanks');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="hero-kv-surface relative min-h-screen overflow-hidden text-ink" data-page="pesquisa">
      <div className="pointer-events-none fixed -left-24 top-16 h-72 w-72 rounded-full border border-forest/25" aria-hidden="true" />
      <div className="pointer-events-none fixed -right-20 bottom-12 h-56 w-56 rotate-12 border-[22px] border-forest/[0.09]" aria-hidden="true" />

      {screen === 'intro' && (
        <section className="relative z-10 flex min-h-[100svh] items-center justify-center px-5 py-12 text-center sm:px-8">
          <div className="mx-auto flex max-w-3xl animate-quiz-enter flex-col items-center">
            <span className="mb-6 border-2 border-ink bg-lime px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-ink shadow-lime">
              Quiz · Pesquisa
            </span>
            <h1 className="font-display text-[clamp(4rem,15vw,8rem)] font-black uppercase leading-[0.78] tracking-[-0.035em] text-ink">
              Seu presente começa aqui
            </h1>
            <p className="mt-7 max-w-2xl text-xl font-black leading-snug text-ink sm:text-2xl">
              Toque no botão abaixo para começar o quiz e pegue seu presente no final. 👊
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink/75 sm:text-lg">
              São perguntas super rápidas pra entender melhor quem você é, o que mais tem te impedido de progredir na vida e o que você pode mudar pra ter um futuro melhor, independentemente de quem esteja no poder.
            </p>
            <div className="mt-7 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.15em] text-forest">
              <span>12 perguntas</span><span aria-hidden="true">•</span><span>Cerca de 3 min</span>
            </div>
            <button
              type="button"
              onClick={startQuiz}
              className="mt-9 min-h-14 w-full max-w-sm border-2 border-ink bg-forest px-8 py-4 font-display text-2xl font-black uppercase tracking-wide text-cream shadow-lime transition hover:-translate-y-1 hover:bg-ink sm:w-auto sm:min-w-80"
            >
              Começar agora →
            </button>
          </div>
        </section>
      )}

      {screen === 'questions' && question && (
        <section className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 py-8 sm:px-8 sm:py-14">
          <div className="mx-auto w-full max-w-3xl animate-quiz-enter" key={question.id}>
            <div className="mb-6">
              <div className="mb-3 flex items-end justify-between gap-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-forest">Pergunta {currentIndex + 1} de {QUESTIONS.length}</p>
                <p className="text-xs font-bold text-ink/60">{Math.round(((currentIndex + 1) / QUESTIONS.length) * 100)}%</p>
              </div>
              <div className="h-2 overflow-hidden border border-ink/25 bg-ink/15">
                <div className="h-full bg-forest transition-all duration-500" style={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }} />
              </div>
            </div>

            <div className="border-2 border-ink bg-ink p-5 shadow-card sm:p-9">
              <h1 className="font-display text-[clamp(2.25rem,7vw,4.25rem)] font-black uppercase leading-[0.92] tracking-[-0.02em] text-paper">
                {question.title}
              </h1>
              {'helper' in question && question.helper && <p className="mt-3 text-sm font-black uppercase tracking-wider text-lime">{question.helper}</p>}

              <div className="mt-7">
                {question.type === 'choice' && (
                  <div className={question.compact ? 'grid gap-3 sm:grid-cols-2' : 'grid gap-3'}>
                    {question.options.map((option) => {
                      const selected = currentAnswer === option;
                      return (
                        <button
                          type="button"
                          key={option}
                          onClick={() => setAnswer(option)}
                          aria-pressed={selected}
                          className={`min-h-14 border-2 px-4 py-3 text-left text-sm font-bold leading-snug transition sm:text-base ${selected ? 'border-lime bg-lime text-ink shadow-[5px_5px_0_#fffdee]' : 'border-cream/20 bg-cream/[0.06] text-cream hover:border-lime hover:bg-cream/[0.1]'}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 ${selected ? 'border-ink bg-ink text-lime' : 'border-cream/35'}`} aria-hidden="true">{selected ? '✓' : ''}</span>
                            {option}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {question.type === 'state' && (
                  <select
                    value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                    onChange={(event) => setAnswer(event.target.value)}
                    className="min-h-16 w-full appearance-none border-2 border-cream/25 bg-cream px-5 py-4 text-base font-bold text-ink focus:border-lime sm:text-lg"
                  >
                    <option value="" disabled>Selecione uma opção</option>
                    {question.options.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                )}

                {question.type === 'text' && (
                  <textarea
                    value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder={question.placeholder}
                    rows={5}
                    maxLength={800}
                    className="w-full resize-none border-2 border-cream/25 bg-cream p-4 text-base font-medium leading-7 text-ink placeholder:text-ink/45 focus:border-lime sm:p-5 sm:text-lg"
                  />
                )}

                {question.type === 'scale' && (
                  <div>
                    <div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
                      {Array.from({ length: 11 }, (_, value) => {
                        const selected = currentAnswer === value;
                        return (
                          <button
                            type="button"
                            key={value}
                            onClick={() => setAnswer(value)}
                            aria-label={`${value} de 10`}
                            aria-pressed={selected}
                            className={`aspect-square min-h-11 border-2 font-display text-2xl font-black transition ${selected ? 'border-lime bg-lime text-ink shadow-[4px_4px_0_#fffdee]' : 'border-cream/25 bg-cream/[0.06] text-cream hover:border-lime'}`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                    {(question.minLabel || question.maxLabel) && (
                      <div className="mt-5 grid grid-cols-2 gap-4 text-xs font-bold leading-5 text-cream/65 sm:text-sm">
                        <p><strong className="text-lime">0</strong> — {question.minLabel}</p>
                        <p className="text-right"><strong className="text-lime">10</strong> — {question.maxLabel}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {showValidation && <p role="alert" className="mt-4 text-sm font-bold text-lime">Escolha ou escreva uma resposta para continuar.</p>}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button type="button" onClick={goBack} className="min-h-12 border-2 border-cream/25 px-6 py-3 text-sm font-black uppercase tracking-wider text-cream transition hover:border-cream">
                  ← Voltar
                </button>
                <button
                  type="button"
                  onClick={continueQuiz}
                  disabled={submitting}
                  className="min-h-12 border-2 border-ink bg-lime px-7 py-3 font-display text-xl font-black uppercase tracking-wide text-ink shadow-[5px_5px_0_#fffdee] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
                >
                  {submitting ? 'Enviando…' : currentIndex === QUESTIONS.length - 1 ? 'Desbloquear presente →' : 'Continuar →'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {screen === 'thanks' && (
        <section className="relative z-10 flex min-h-[100svh] items-center justify-center px-5 py-12 text-center sm:px-8">
          <div className="cream-paper mx-auto w-full max-w-3xl animate-quiz-enter border-2 border-ink p-6 text-ink shadow-card sm:p-12">
            <div className="mx-auto flex h-20 w-20 animate-quiz-pop items-center justify-center border-2 border-ink bg-lime text-4xl shadow-lime" aria-hidden="true">💡</div>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.25em] text-forest">Quiz concluído</p>
            <h1 className="mt-3 font-display text-[clamp(3.5rem,12vw,7rem)] font-black uppercase leading-[0.8] tracking-[-0.03em] text-ink">
              Presente desbloqueado!
            </h1>
            <p className="mt-7 text-xl font-black leading-snug sm:text-2xl">Você acaba de ganhar uma aula de aquecimento exclusiva.</p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-ink/75 sm:text-lg">
              Essa é uma aula paga da Mentoria na Bala, mas liberamos de graça pra você desenvolver sua disciplina antes mesmo da imersão O Brasil Não Vai Te Salvar começar.
            </p>
            {giftUrl ? (
              <a
                href={giftUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('AulaAquecimentoClick')}
                className="mt-9 inline-flex min-h-14 items-center justify-center border-2 border-ink bg-lime px-9 py-4 font-display text-2xl font-black uppercase tracking-wide text-ink shadow-lime transition hover:-translate-y-1 hover:bg-forest hover:text-cream"
              >
                Acessar agora →
              </a>
            ) : (
              <div className="mt-9 border-2 border-ink bg-forest px-6 py-4 font-black uppercase tracking-wide text-cream">
                Sua aula será liberada aqui em breve.
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
