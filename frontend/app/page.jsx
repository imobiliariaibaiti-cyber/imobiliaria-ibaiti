import Link from "next/link";
import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";
import PropertyCard from "@/components/PropertyCard";
import QuoteSlider from "@/components/QuoteSlider";
import AnalyticsBeacon from "@/components/AnalyticsBeacon";
import { getProperties } from "@/lib/api";
import { cityEntries } from "@/lib/cities";

const trustItems = [
  "Atendimento consultivo focado em imoveis rurais",
  "Leitura comercial da regiao de Ibaiti e entorno",
  "Suporte na analise de documentacao e negociacao",
  "Capitacao local com contato direto no WhatsApp"
];

const demandItems = [
  "Fazendas para pecuaria e uso misto",
  "Sitios com agua e acesso pratico",
  "Chacaras proximas da cidade",
  "Areas com potencial para cafe, leite e graos"
];

const testimonials = [
  {
    name: "Produtor de Ibaiti",
    text: "O atendimento foi direto, com leitura real da terra e negociacao bem conduzida do inicio ao fechamento."
  },
  {
    name: "Proprietario de Curiuva",
    text: "Conseguimos organizar a apresentacao do imovel e filtrar melhor os interessados logo no comeco."
  },
  {
    name: "Comprador da regiao",
    text: "A consultoria ajudou a comparar opcoes com mais seguranca, principalmente em documentacao e potencial de uso."
  }
];

const steps = [
  "Escolha o imovel ou a regiao",
  "Fale com o time da imobiliaria",
  "Agende visita e analise",
  "Valide documentacao e proposta",
  "Siga para fechamento com mais seguranca"
];

const mediaOfferItems = [
  "Cadastro e triagem comercial do imovel",
  "Planos de destaque dentro do site",
  "Estrutura para ampliar distribuicao",
  "Aproveitamento comercial da audiencia do canal"
];

export default async function HomePage() {
  const featured = await getProperties({ featured: true });
  const spotlightCities = cityEntries.slice(0, 6);

  return (
    <main>
      <Suspense fallback={null}>
        <AnalyticsBeacon source="home" />
      </Suspense>

      <section className="relative overflow-hidden border-b border-brand-100 bg-[radial-gradient(circle_at_18%_14%,#f5e8cb,transparent_32%),radial-gradient(circle_at_84%_18%,#e7f0de,transparent_28%),linear-gradient(135deg,#fffdf9,#fbf6ed)]">
        <div className="container-main grid gap-8 py-12 sm:gap-10 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-700">Imoveis rurais em Ibaiti e regiao</p>
            <h1 className="font-display text-4xl leading-tight text-brand-900 sm:text-5xl lg:text-6xl">
              Compra, venda e captacao de imoveis com leitura real do mercado rural.
            </h1>
            <p className="max-w-2xl text-slate-700">
              Fazendas, sitios e chacaras selecionados com atendimento consultivo para quem quer comprar melhor e para quem precisa vender com apoio do time da regiao.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/imoveis" className="btn-primary">
                Ver imoveis
              </Link>
              <Link href="/anuncie-seu-imovel" className="btn-accent">
                Anunciar meu imovel
              </Link>
              <a
                href={process.env.NEXT_PUBLIC_WHATSAPP ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}` : "https://wa.me/5543999999999"}
                className="btn-secondary"
                target="_blank"
                rel="noreferrer"
              >
                Falar no WhatsApp
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {trustItems.map((item) => (
                <div key={item} className="rounded-2xl border border-brand-100 bg-white/85 px-4 py-3 text-sm text-slate-700 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-brand-100 bg-white/90 p-6 shadow-xl shadow-brand-900/10 backdrop-blur sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">Mercado da regiao</p>
              <h2 className="mt-2 font-display text-3xl text-brand-900">Mais do que anuncio: leitura comercial do imovel</h2>
              <p className="mt-4 text-slate-700">
                Trabalhamos o imovel rural olhando acesso, topografia, documentacao, liquidez e perfil de comprador da regiao.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link href="/valores" className="rounded-2xl border border-signal-200 bg-signal-50 px-4 py-4 text-sm font-semibold text-signal-900">
                  Ver valores e referencias da regiao
                </Link>
                <Link href="/aptidoes" className="rounded-2xl border border-accent-100 bg-accent-50 px-4 py-4 text-sm font-semibold text-accent-900">
                  Ver aptidoes por cidade
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-accent-700 bg-accent-800 p-6 text-brand-50 shadow-lg shadow-accent-900/15">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-200">Para proprietarios</p>
              <h3 className="mt-2 font-display text-2xl">Anuncie com estrategia, nao so com cadastro</h3>
              <p className="mt-3 text-sm text-brand-100">
                O cadastro chega primeiro ao nosso time. A partir disso, definimos a melhor combinacao entre site, destaque comercial e distribuicao de midia.
              </p>
              <Link href="/planos" className="btn-soft mt-5">
                Ver planos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#2e2017,#223f30)] text-brand-50">
        <div className="container-main grid gap-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-200">Nova frente comercial</p>
            <h2 className="mt-3 font-display text-4xl text-white">Transforme a audiencia da operacao em venda do seu imovel</h2>
            <p className="mt-4 max-w-2xl text-brand-100">
              O site agora tambem abre espaco para uma proposta comercial mais forte para proprietarios: captacao, destaque, apoio do time e estrutura para divulgacao.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/planos" className="btn-soft">
                Conhecer planos
              </Link>
              <Link href="/anuncie-seu-imovel" className="btn-secondary border-brand-200 bg-transparent text-white hover:bg-white/10 hover:text-white">
                Anuncie seu imovel
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {mediaOfferItems.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-brand-50">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-main py-12 sm:py-14">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Cidades da regiao</p>
              <h2 className="font-display text-3xl text-brand-900 sm:text-4xl">Navegue pelo mercado local</h2>
            </div>
            <Link href="/imoveis" className="text-sm font-semibold text-brand-700">
              Ver todos os imoveis
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {spotlightCities.map((city, index) => (
              <Link
                key={city.slug}
                href={`/cidades/${city.slug}`}
                className={`rounded-[1.75rem] border p-5 shadow-sm transition hover:-translate-y-[2px] hover:shadow-md ${
                  index % 3 === 0
                    ? "border-signal-200 bg-signal-50"
                    : index % 3 === 1
                    ? "border-accent-100 bg-accent-50"
                    : "border-brand-100 bg-brand-50"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Cidade em foco</p>
                <h3 className="mt-2 font-display text-2xl text-brand-900">{city.name}</h3>
                <p className="mt-3 text-sm text-slate-700">{city.summary}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-brand-700">Ver pagina local</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#f8f1e4,#ffffff)]">
        <div className="container-main py-12 sm:py-14">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Destaques</p>
              <h2 className="font-display text-3xl text-brand-900 sm:text-4xl">Imoveis em evidencia</h2>
            </div>
            <Link href="/imoveis" className="text-sm font-semibold text-brand-700">
              Ver todos
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <QuoteSlider />
      </section>

      <section className="bg-white">
        <div className="container-main grid gap-6 py-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">O que mais procuram</p>
            <h2 className="mt-2 font-display text-3xl text-brand-900">Perfis de imovel com mais demanda</h2>
            <div className="mt-5 grid gap-3">
              {demandItems.map((item) => (
                <div key={item} className="rounded-2xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Como atendemos</p>
            <h2 className="mt-2 font-display text-3xl text-brand-900">Da primeira conversa ao fechamento</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {steps.map((step, index) => (
                <div key={step} className="rounded-2xl border border-brand-100 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Etapa {index + 1}</p>
                  <p className="mt-2 text-sm text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#eef6f1,#ffffff)]">
        <div className="container-main py-12">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Confianca</p>
            <h2 className="font-display text-3xl text-brand-900">O que o cliente valoriza no atendimento</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
                <p className="text-sm leading-relaxed text-slate-700">{item.text}</p>
                <p className="mt-4 text-sm font-semibold text-brand-900">{item.name}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="bg-white">
        <div className="container-main pb-12 pt-4 sm:pb-16">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
