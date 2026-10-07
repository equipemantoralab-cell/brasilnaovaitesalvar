// lib/quizData.ts

export interface QuizOption {
  text: string;
  points: number; // 0 for the segmentation question
}

export interface QuizQuestion {
  id: number; // 1–8
  text: string;
  isSegmentation: boolean; // true only for Q1
  options: QuizOption[];
}

export interface QuizProfile {
  id: number; // 1–4
  label: string;
  minScore: number;
  maxScore: number;
  body: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: 'Qual ponto da sua vida você mais gostaria de mudar hoje?',
    isSegmentation: true,
    options: [
      { text: 'A parte de carreira/dinheiro', points: 0 },
      { text: 'A minha confiança e meus problemas de insegurança', points: 0 },
      { text: 'Minha comunicação', points: 0 },
      { text: 'Minha disciplina/rotina', points: 0 },
      { text: 'Sinceramente? Um pouco de tudo isso', points: 0 },
    ],
  },
  {
    id: 2,
    text: 'Se alguém perguntasse onde você quer estar daqui a 1 ano, o que você responderia?',
    isSegmentation: false,
    options: [
      { text: 'Tenho uma visão bem clara e já sei quais são alguns dos próximos passos.', points: 4 },
      { text: 'Sei mais ou menos o que quero, mas ainda não transformei isso num plano.', points: 3 },
      { text: 'Sei principalmente o que eu NÃO quero continuar vivendo.', points: 2 },
      { text: 'Sinceramente, não faço ideia.', points: 1 },
    ],
  },
  {
    id: 3,
    text: 'Quando alguma coisa na sua vida começa a te incomodar, o que normalmente acontece?',
    isSegmentation: false,
    options: [
      { text: 'Tento entender o problema e faço alguma coisa concreta para mudar.', points: 4 },
      { text: 'Penso bastante no que poderia fazer, mas demoro para agir.', points: 3 },
      { text: 'Vou empurrando enquanto ainda dá para aguentar.', points: 2 },
      { text: 'Normalmente espero alguma coisa acontecer para a situação mudar.', points: 1 },
    ],
  },
  {
    id: 4,
    text: 'Quem está decidindo os próximos passos da sua vida profissional hoje?',
    isSegmentation: false,
    options: [
      { text: 'Eu: tenho buscado oportunidades, habilidades e movimentos que me aproximem do que quero.', points: 4 },
      { text: 'Eu tento assumir isso, mas ainda dependo bastante do que aparece no meu trabalho atual.', points: 3 },
      { text: 'Basicamente minha empresa ou meu chefe: se surgir uma oportunidade, ótimo.', points: 2 },
      { text: 'Ninguém. Estou trabalhando e vendo no que vai dar.', points: 1 },
    ],
  },
  {
    id: 5,
    text: 'Quando você percebe que não conhece as pessoas certas ou não tem acesso a determinado ambiente, o que faz?',
    isSegmentation: false,
    options: [
      { text: 'Procuro formas de me aproximar, conhecer pessoas e construir esse acesso.', points: 4 },
      { text: 'Até tento, mas geralmente não sei como fazer isso sem parecer interesseiro.', points: 3 },
      { text: 'Fico esperando uma oportunidade aparecer naturalmente.', points: 2 },
      { text: 'Normalmente penso que esse tipo de oportunidade é para quem já nasceu com contatos.', points: 1 },
    ],
  },
  {
    id: 6,
    text: 'Qual dessas frases mais parece com você hoje?',
    isSegmentation: false,
    options: [
      { text: '"Tenho tomado decisões mesmo sem ter certeza absoluta de que vão dar certo."', points: 4 },
      { text: '"Sei de algumas decisões que preciso tomar, mas ainda estou adiando."', points: 3 },
      { text: '"Fico pensando tanto nas possibilidades que muitas vezes não escolho nenhuma."', points: 2 },
      { text: '"Prefiro esperar as coisas ficarem mais claras antes de mudar qualquer coisa."', points: 1 },
    ],
  },
  {
    id: 7,
    text: 'Pensando nos últimos 12 meses, quanto a sua vida realmente avançou?',
    isSegmentation: false,
    options: [
      { text: 'Consigo apontar mudanças concretas em quem sou, no que faço ou nas oportunidades que tenho.', points: 4 },
      { text: 'Avancei em algumas coisas, mas menos do que gostaria.', points: 3 },
      { text: 'Trabalhei, me esforcei e fiz muita coisa, mas sinto que continuo praticamente no mesmo lugar.', points: 2 },
      { text: 'Parece que todo ano eu vivo versões diferentes do mesmo ano.', points: 1 },
    ],
  },
  {
    id: 8,
    text: 'Quando você pensa no futuro que deseja, qual frase mais representa o que sente?',
    isSegmentation: false,
    options: [
      { text: 'Sei que muita coisa foge do meu controle, mas estou tentando assumir responsabilidade pelo que depende de mim.', points: 4 },
      { text: 'Quero mudar, só preciso de mais clareza sobre onde colocar minha energia.', points: 3 },
      { text: 'Sinto que minha vida depende demais de coisas que eu não consigo controlar.', points: 2 },
      { text: 'Hoje, sinceramente, estou mais esperando minha situação melhorar do que construindo essa mudança.', points: 1 },
    ],
  },
];

export const QUIZ_PROFILES: QuizProfile[] = [
  {
    id: 1,
    label: 'PASSAGEIRO DA PRÓPRIA VIDA',
    minScore: 7,
    maxScore: 13,
    body: `Hoje, as circunstâncias estão decidindo mais sobre a sua vida do que você.

Você quer uma vida melhor.

O problema é que, entre querer mudar e saber o que fazer, você acabou entrando num modo muito comum de só seguir o fluxo da vida.

Trabalho aparece = você trabalha. Problema aparece = você resolve.

TODO SANTO DIA A MESMA COISA!

Só que aí o ano termina e parece que você não construiu quase nada, não foi pra lugar nenhum…

ENTÃO COMO RESOLVER ISSO?

Eu sei que nem tudo depende de você.

Sua origem, a economia, as oportunidades que você recebeu, as pessoas que conheceu e muitas outras circunstâncias influenciam o seu caminho.

Mas existe uma parte dessa história que precisa voltar para suas mãos.

No dia 31 de outubro, às 15h, eu vou te ajudar a fazer exatamente isso no O Brasil Não Vai Te Salvar (evento 100% on-line).

Você vai construir comigo um Plano de Governo Pessoal pra assumir o controle da sua vida e evoluir 4 anos em apenas 4 meses, independentemente do seu chefe, da parte da família que desacredita de você ou de quem ganhar as eleições.`,
  },
  {
    id: 2,
    label: 'INCONFORMADO SEM MAPA',
    minScore: 14,
    maxScore: 19,
    body: `Você já percebeu que quer mais da vida e pensa bastante sobre seu futuro, sua carreira e sobre as metas que quer alcançar.

Você não é do tipo que aceitaria nascer e morrer do mesmo jeito. Você sabe que tem muito por aí pra conquistar, que te traria a felicidade que você merece…

O problema é justamente esse: existem várias coisas que você gostaria de mudar e pouca clareza o que fazer primeiro.

ENTÃO COMO RESOLVER ISSO?

Eu sei que nem tudo depende de você.

Sua origem, a economia, as oportunidades que você recebeu, as pessoas que conheceu e muitas outras circunstâncias influenciam o seu caminho.

Seu inconformismo é um bom primeiro passo, mas que tal transformar isso em ação agora?

No dia 31 de outubro, às 15h, eu vou te ajudar a fazer exatamente isso no O Brasil Não Vai Te Salvar (evento 100% on-line).

Você vai construir comigo um Plano de Governo Pessoal pra assumir o controle da sua vida e evoluir 4 anos em apenas 4 meses, independentemente do seu chefe, da parte da família que desacredita de você ou de quem ganhar as eleições.`,
  },
  {
    id: 3,
    label: 'CAÇADOR DE MUDANÇAS',
    minScore: 20,
    maxScore: 24,
    body: `Você não simplesmente aceita a vida que caiu no seu colo. Você já tem fome de mudança.

Já toma decisões, procura oportunidades e provavelmente consegue enxergar algumas mudanças importantes que fez nos últimos meses.

Só que suas ações ainda estão dispersas: você melhora uma coisa aqui, começa outra ali, estuda, trabalha, tenta crescer…

Mas falta algo que conecte tudo isso a uma direção maior, então você acaba avançando menos do que poderia, mesmo se esforçando pra caramba. Seu próximo passo é construir um plano que conecte sua carreira, suas habilidades e seu desenvolvimento pessoal ao progresso de vida que você realmente quer.

ENTÃO COMO RESOLVER ISSO?

Sua origem, a economia, as oportunidades que você recebeu, as pessoas que conheceu e muitas outras circunstâncias influenciam o seu caminho, mas você já sabe que sua vida pode ser melhor.

Quer ver sua vida melhorando e seu esforço valendo a pena?

No dia 31 de outubro, às 15h, eu vou te ajudar com isso no O Brasil Não Vai Te Salvar (evento 100% on-line).

Você vai construir comigo um Plano de Governo Pessoal pra assumir o controle da sua vida e evoluir 4 anos em apenas 4 meses, independentemente do seu chefe, da parte da família que desacredita de você ou de quem ganhar as eleições.`,
  },
  {
    id: 4,
    label: 'NO COMANDO',
    minScore: 25,
    maxScore: 28,
    body: `Você já entendeu uma coisa que muita gente demora anos para perceber: ninguém vai construir sua vida por você.

Você não é inocente e sabe que não pode controlar tudo, mas também não usa isso como justificativa para abandonar aquilo que consegue controlar.

Sua origem, a economia, as oportunidades que você recebeu, as pessoas que conheceu e muitas outras circunstâncias influenciam o seu caminho, mas você já sabe que sua vida pode ser melhor.

Disposição pra construir uma vida diferente com suas próprias mãos você já tem.

MAS COMO TIRAR ISSO DO PAPEL?

No dia 31 de outubro, às 15h, eu vou te ajudar com isso no O Brasil Não Vai Te Salvar (evento 100% on-line).

Você vai construir comigo um Plano de Governo Pessoal pra assumir o controle da sua vida e evoluir 4 anos em apenas 4 meses, independentemente do seu chefe, da parte da família que desacredita de você ou de quem ganhar as eleições.`,
  },
];

/**
 * Returns the profile matching totalScore.
 * Score range: 7 (all 'd' on Q2–Q8) to 28 (all 'a' on Q2–Q8).
 * Falls back to the nearest edge profile if score is somehow outside bounds.
 */
export function getProfile(totalScore: number): QuizProfile {
  const profile = QUIZ_PROFILES.find(
    (p) => totalScore >= p.minScore && totalScore <= p.maxScore
  );
  if (!profile) {
    if (totalScore < 7) return QUIZ_PROFILES[0];
    return QUIZ_PROFILES[QUIZ_PROFILES.length - 1];
  }
  return profile;
}
