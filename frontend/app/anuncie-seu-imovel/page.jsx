import Link from "next/link";

const reasons = [
  "Time especializado em imoveis rurais da regiao",
  "Apoio comercial antes da publicacao",
  "Possibilidade de destaque e estrategia de midia",
  "Conexao entre site, audiencia e atendimento humano"
];

const includes = [
  "Recebimento do cadastro do proprietario",
  "Triagem do material enviado",
  "Conversa com o time comercial",
  "Definicao do melhor formato de exposicao",
  "Encaminhamento para o plano adequado"
];

const workflow = [
  {
    title: "Agora",
    text: "Voce entra no painel do cliente, cadastra o imovel e envia as informacoes iniciais para o time."
  },
  {
    title: "Painel ativo",
    text: "O proprietario pode subir fotos, organizar dados do imovel e manter o material centralizado dentro do perfil."
  },
  {
    title: "Operacao comercial",
    text: "Depois disso, o imovel segue para estrategia de destaque, anuncio ou midia conforme a proposta aprovada."
  }
];

export const metadata = {
  title: "Anuncie seu imovel | Imobiliaria Ibaiti",
  description: "Conheca a proposta comercial para anunciar e destacar seu imovel rural com a Imobiliaria Ibaiti."
};

export default function AnuncieSeuImovelPage() {
  return (
    <main className="container-main space-y-8 py-10">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="rounded-[2rem] border border-brand-100 bg-[radial-gradient(circle_at_top_left,#d7eadf,transparent_30%),linear-gradient(135deg,#fffdf9,#eef6f1)] p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-700">Anuncie seu imovel</p>
          <h1 className="mt-3 font-display text-4xl text-brand-900 sm:text-5xl">Use o site como canal de venda, destaque e distribuicao comercial</h1>
          <p className="mt-4 text-slate-700">
            A proposta aqui e unir site, atendimento da imobiliaria e a forca da operacao de midia para transformar seu imovel em uma oferta mais bem apresentada, mais organizada e com melhor alcance.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {reasons.map((item) => (
              <div key={item} className="rounded-2xl border border-accent-100 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-sm">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/cliente" className="btn-accent">
              Entrar no painel do cliente
            </Link>
            <Link href="/planos" className="btn-secondary">
              Ver planos
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">O que ja entra no processo</p>
          <div className="mt-4 grid gap-3">
            {includes.map((item) => (
              <div key={item} className="rounded-2xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-slate-600">
            O formato final de divulgacao depende do perfil do imovel, da documentacao e da estrategia comercial definida com o time.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Fluxo do proprietario</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {workflow.map((item, index) => (
            <article
              key={item.title}
              className={`rounded-2xl border p-4 ${index === 0 ? "border-brand-100 bg-brand-50/60" : index === 1 ? "border-accent-100 bg-accent-50/60" : "border-signal-200 bg-signal-50/70"}`}
            >
              <h2 className="font-semibold text-brand-900">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-700">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
