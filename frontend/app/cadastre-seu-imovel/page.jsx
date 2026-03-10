import OwnerPropertyLeadForm from "@/components/OwnerPropertyLeadForm";

const steps = [
  {
    title: "1. Voce envia os dados",
    text: "Preencha as informacoes principais do imovel e abra a conversa no WhatsApp da imobiliaria."
  },
  {
    title: "2. Nosso time analisa",
    text: "Verificamos perfil, documentacao informada, potencial comercial e o melhor posicionamento para venda."
  },
  {
    title: "3. Seguimos com o atendimento",
    text: "Se fizer sentido para a carteira, entramos em contato para orientar proximos passos e materiais adicionais."
  }
];

const trustPoints = [
  "Seu cadastro nao aparece automaticamente no site.",
  "A equipe analisa antes de qualquer divulgacao.",
  "Podemos ajudar a organizar informacoes e documentacao.",
  "Atendimento focado em imoveis rurais da regiao de Ibaiti."
];

const checklist = [
  "Cidade e regiao do imovel",
  "Tipo de propriedade",
  "Area total e uso atual",
  "Situacao da documentacao",
  "Valor esperado",
  "Descricao com acesso, agua, benfeitorias e aptidao"
];

const panelItems = [
  "Login do proprietario dentro do site",
  "Painel proprio para cadastrar o imovel",
  "Upload de fotos pelo cliente",
  "Organizacao de documentos e detalhes",
  "Fluxo integrado com analise comercial"
];

export const metadata = {
  title: "Cadastre seu imovel | Imobiliaria Ibaiti",
  description: "Envie os dados do seu imovel para a equipe da Imobiliaria Ibaiti pelo WhatsApp. O cadastro e analisado internamente antes de qualquer publicacao."
};

export default function OwnerLeadPage() {
  return (
    <main className="container-main space-y-8 py-10">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-brand-100 bg-[radial-gradient(circle_at_top_left,#f5e8cb,transparent_35%),linear-gradient(135deg,#fffdf9,#fbf6ed)] p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Para proprietarios</p>
            <h1 className="mt-3 font-display text-4xl text-brand-900 sm:text-5xl">Cadastre seu imovel com atendimento humano</h1>
            <p className="mt-4 max-w-2xl text-slate-700">
              Aqui o cadastro nao vai direto para publicacao. Primeiro ele chega ao nosso WhatsApp, o time avalia as informacoes e conversa com voce para entender o melhor caminho comercial.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {trustPoints.map((item) => (
                <div key={item} className="rounded-2xl border border-brand-100 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <section className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Como funciona</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {steps.map((step) => (
                <article key={step.title} className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
                  <h2 className="font-semibold text-brand-900">{step.title}</h2>
                  <p className="mt-2 text-sm text-slate-700">{step.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">O que ajuda no atendimento</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {checklist.map((item) => (
                <div key={item} className="rounded-2xl border border-brand-100 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-accent-100 bg-accent-50/60 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Painel do cliente</p>
            <h2 className="mt-2 font-display text-3xl text-brand-900">Painel do cliente</h2>
            <p className="mt-3 text-slate-700">
              O proprietario ja pode entrar com login proprio, cadastrar o imovel no perfil e subir fotos e materiais diretamente para analise da imobiliaria.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {panelItems.map((item) => (
                <div key={item} className="rounded-2xl border border-accent-100 bg-white/80 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
            <a href="/cliente" className="btn-accent mt-5">
              Entrar no painel do cliente
            </a>
          </section>
        </div>

        <div className="lg:sticky lg:top-24">
          <OwnerPropertyLeadForm />
        </div>
      </section>
    </main>
  );
}
