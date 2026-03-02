import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import PropertyCard from "@/components/PropertyCard";
import { getProperties } from "@/lib/api";

export default async function HomePage() {
  const featured = await getProperties({ featured: true });

  return (
    <main>
      <section className="relative overflow-hidden border-b border-brand-100 bg-[radial-gradient(circle_at_20%_10%,#d6e7c4,transparent_35%),radial-gradient(circle_at_80%_20%,#f1e3d2,transparent_30%)]">
        <div className="container-main grid gap-10 py-20 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-700">Imóveis Rurais em Ibaiti e Região</p>
            <h1 className="font-display text-5xl leading-tight text-brand-900 md:text-6xl">
              O imóvel ideal para investir, produzir e viver bem.
            </h1>
            <p className="max-w-xl text-slate-700">
              Fazendas, sítios e chácaras selecionados com análise técnica e atendimento consultivo para compra segura.
            </p>
            <div className="flex gap-3">
              <Link href="/imoveis" className="rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white">
                Ver Imóveis
              </Link>
              <a
                href={process.env.NEXT_PUBLIC_WHATSAPP ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}` : "https://wa.me/5543999999999"}
                className="rounded-xl border border-brand-700 px-5 py-3 font-semibold text-brand-700"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-brand-100 bg-white/80 p-8 shadow-xl shadow-brand-900/10 backdrop-blur">
            <h2 className="font-display text-3xl text-brand-900">Sobre a Imobiliária Ibaiti</h2>
            <p className="mt-4 text-slate-700">
              Atuamos com foco em imóveis rurais de alta liquidez e negociações transparentes. Você recebe suporte da visita à assinatura.
            </p>
          </div>
        </div>
      </section>

      <section className="container-main py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Destaques</p>
            <h2 className="font-display text-4xl text-brand-900">Imóveis em Evidência</h2>
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
      </section>

      <section id="contato" className="container-main pb-16">
        <ContactForm />
      </section>
    </main>
  );
}


