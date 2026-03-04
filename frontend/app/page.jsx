import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import PropertyCard from "@/components/PropertyCard";
import QuoteSlider from "@/components/QuoteSlider";
import { getProperties } from "@/lib/api";

export default async function HomePage() {
  const featured = await getProperties({ featured: true });

  return (
    <main>
      <section className="relative overflow-hidden border-b border-brand-100 bg-[radial-gradient(circle_at_20%_10%,#d6e7c4,transparent_35%),radial-gradient(circle_at_80%_20%,#f1e3d2,transparent_30%)]">
        <div className="container-main grid gap-8 py-12 sm:gap-10 sm:py-16 md:grid-cols-2 md:items-center">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-700">Imóveis Rurais em Ibaiti e Região</p>
            <h1 className="font-display text-3xl leading-tight text-brand-900 sm:text-4xl md:text-5xl">
              O imóvel ideal para investir, produzir e viver bem.
            </h1>
            <p className="max-w-xl text-slate-700">
              Fazendas, sítios e chácaras selecionados com análise técnica e atendimento consultivo para compra segura.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/imoveis"
                className="rounded-xl bg-brand-700 px-5 py-3 text-center font-semibold text-white transition duration-150 hover:-translate-y-[1px] hover:shadow-md hover:bg-brand-600 active:translate-y-0"
              >
                Ver Imóveis
              </Link>
              <a
                href={process.env.NEXT_PUBLIC_WHATSAPP ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}` : "https://wa.me/5543999999999"}
                className="rounded-xl border border-brand-700 px-5 py-3 text-center font-semibold text-brand-700 transition duration-150 hover:-translate-y-[1px] hover:shadow-md hover:border-brand-800 active:translate-y-0"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-brand-100 bg-white/80 p-6 shadow-xl shadow-brand-900/10 backdrop-blur sm:p-8">
            <h2 className="font-display text-2xl text-brand-900 sm:text-3xl">Sobre a Imobiliária Ibaiti</h2>
            <p className="mt-4 text-slate-700">
              Atuamos com foco em imóveis rurais de alta liquidez e negociações transparentes. Você recebe suporte da visita à assinatura.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand-50/70">
        <div className="container-main py-12 sm:py-14">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Destaques</p>
              <h2 className="font-display text-3xl text-brand-900 sm:text-4xl">Imóveis em Evidência</h2>
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

      <section id="contato" className="bg-white">
        <div className="container-main pb-12 sm:pb-16">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
