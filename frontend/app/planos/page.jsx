import Link from "next/link";

const plans = [
  {
    name: "Essencial",
    badge: "Entrada",
    investment: "Sob consulta",
    investmentNote: "Definido com o time conforme perfil do imovel.",
    description: "Para proprietario que quer entrar no processo comercial da imobiliaria com orientacao e triagem.",
    forWho: "Imovel que precisa de leitura comercial inicial e organizacao das informacoes.",
    items: [
      "Recebimento e triagem do cadastro",
      "Analise inicial do perfil do imovel",
      "Orientacao para melhorar apresentacao e descricao",
      "Contato do time para definir proximos passos"
    ],
    cta: "Quero comecar"
  },
  {
    name: "Destaque",
    badge: "Mais procurado",
    investment: "Sob consulta",
    investmentNote: "Valor alinhado com tipo de exposicao e prioridade desejada.",
    description: "Para proprietario que quer mais visibilidade no site e melhor posicionamento comercial.",
    forWho: "Imovel pronto para receber destaque, prioridade e exposicao acima da media.",
    items: [
      "Tudo do plano Essencial",
      "Posicionamento com mais destaque no site",
      "Melhor presenca nas vitrines e paginas comerciais",
      "Prioridade na leitura comercial da divulgacao"
    ],
    cta: "Quero destacar"
  },
  {
    name: "Midia",
    badge: "YouTube + site",
    investment: "Valor por regiao",
    investmentNote: "Orcamento consultivo conforme regiao, perfil do imovel e estrategia de divulgacao.",
    description: "Para proprietario que quer usar a forca do site com a distribuicao de midia da operacao.",
    forWho: "Imovel com potencial para campanha mais forte de alcance, imagem e procura.",
    items: [
      "Tudo do plano Destaque",
      "Planejamento de divulgacao com base na regiao",
      "Estrutura para uso da audiencia e da operacao de midia",
      "Formato comercial pensado para alcance e demanda"
    ],
    cta: "Quero falar sobre midia"
  }
];

const faqs = [
  {
    question: "O imovel entra no site automaticamente?",
    answer: "Nao. Primeiro o time analisa o material, o perfil do imovel e a melhor estrategia de divulgacao."
  },
  {
    question: "O plano Midia tem preco fixo?",
    answer: "Nao. O valor da midia depende de cada regiao, do perfil do imovel e da estrategia comercial definida."
  },
  {
    question: "Como vai funcionar o envio de fotos e materiais?",
    answer: "O proprietario ja pode entrar no painel do cliente, cadastrar o imovel, subir fotos e organizar as informacoes para analise."
  }
];

const portalItems = [
  "Login do anunciante dentro do site",
  "Cadastro do imovel dentro do painel do cliente",
  "Upload de fotos pelo proprio proprietario",
  "Organizacao de documentos e informacoes",
  "Acompanhamento do fluxo comercial"
];

export const metadata = {
  title: "Planos | Imobiliaria Ibaiti",
  description: "Conheca os planos para anunciar, destacar e divulgar seu imovel rural com o time da Imobiliaria Ibaiti."
};

export default function PlanosPage() {
  return (
    <main className="container-main space-y-8 py-10">
      <section className="rounded-[2rem] border border-brand-100 bg-[radial-gradient(circle_at_top_left,#f5e8cb,transparent_30%),linear-gradient(135deg,#fffdf9,#fbf6ed)] p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Planos comerciais</p>
        <h1 className="mt-3 font-display text-4xl text-brand-900 sm:text-5xl">Planos para anunciar, destacar e distribuir seu imovel</h1>
        <p className="mt-4 max-w-3xl text-slate-700">
          Aqui o foco nao e so colocar anuncio no ar. Cada plano existe para organizar o imovel, posicionar melhor a oferta e definir o nivel de exposicao comercial com o time da imobiliaria.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/anuncie-seu-imovel" className="btn-accent">
            Quero anunciar meu imovel
          </Link>
          <a
            href={process.env.NEXT_PUBLIC_WHATSAPP ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}` : "https://wa.me/5543999999999"}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            Falar com o comercial
          </a>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <article
            key={plan.name}
            className={`rounded-3xl border p-6 shadow-sm ${index === 1 ? "border-accent-200 bg-accent-50/70" : index === 2 ? "border-signal-200 bg-signal-50/70" : "border-brand-100 bg-white"}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">{plan.badge}</p>
            <h2 className="mt-3 font-display text-3xl text-brand-900">{plan.name}</h2>
            <div className="mt-4 rounded-2xl border border-brand-100 bg-white/90 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Investimento</p>
              <p className="mt-2 text-2xl font-bold text-brand-900">{plan.investment}</p>
              <p className="mt-1 text-sm text-slate-600">{plan.investmentNote}</p>
            </div>
            <p className="mt-4 text-sm text-slate-700">{plan.description}</p>
            <p className="mt-3 rounded-2xl border border-brand-100 bg-white/80 px-4 py-3 text-sm text-slate-700">
              <span className="font-semibold text-brand-900">Indicado para:</span> {plan.forWho}
            </p>
            <div className="mt-5 grid gap-3">
              {plan.items.map((item) => (
                <div key={item} className="rounded-2xl border border-brand-100 bg-white/80 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
            <Link href="/anuncie-seu-imovel" className={`mt-6 inline-flex ${index === 2 ? "btn-soft" : index === 1 ? "btn-accent" : "btn-primary"}`}>
              {plan.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Portal do cliente</p>
          <h2 className="mt-2 font-display text-3xl text-brand-900">Painel do cliente dentro do site</h2>
          <p className="mt-3 text-slate-700">
            O proprietario ja pode entrar com login proprio, cadastrar o imovel, enviar fotos e organizar melhor as informacoes antes da analise comercial da imobiliaria.
          </p>
          <div className="mt-5 grid gap-3">
            {portalItems.map((item) => (
              <div key={item} className="rounded-2xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <Link href="/cliente" className="btn-accent mt-5">
            Acessar painel do cliente
          </Link>
        </div>

        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Perguntas frequentes</p>
          <div className="mt-4 grid gap-4">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl border border-brand-100 px-4 py-4">
                <h3 className="font-semibold text-brand-900">{faq.question}</h3>
                <p className="mt-2 text-sm text-slate-700">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
