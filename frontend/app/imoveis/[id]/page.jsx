import { formatPrice, getWhatsAppLink, resolveImage, getYouTubeEmbedUrl } from "@/lib/format";
import { getPropertyById } from "@/lib/api";
import TravelTimeChips from "@/components/TravelTimeChips";
import CitySummaryCard from "@/components/CitySummaryCard";
import ConsorcioSimulator from "@/components/ConsorcioSimulator";
import Comments from "@/components/Comments";
import HighlightsChips from "@/components/HighlightsChips";

export const dynamic = "force-dynamic";

export default async function PropertyPage({ params }) {
  const property = await getPropertyById(params.id);
  const whatsapp = getWhatsAppLink(
    `Ola! Tenho interesse no imovel ${property.title}${property.propertyCode ? ` (codigo ${property.propertyCode})` : ""} em ${property.city}.`
  );

  return (
    <main className="container-main py-8 space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <img src={resolveImage(property.images)} alt={property.title} className="w-full max-w-full rounded-3xl object-cover aspect-[4/3]" />
          {property.videoUrl && (
            <iframe
              className="aspect-video w-full max-w-full rounded-2xl border border-brand-100"
              src={getYouTubeEmbedUrl(property.videoUrl)}
              allowFullScreen
            />
          )}
        </div>

        <div className="space-y-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <div className="space-y-1">
            {property.propertyCode && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Codigo {property.propertyCode}</p>}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{property.type}</p>
            <h1 className="font-display text-3xl text-brand-900">{property.title}</h1>
            <p className="text-slate-700">{property.city}</p>
          </div>

          <p className="text-3xl font-bold text-brand-800">{formatPrice(property.price)}</p>

          <HighlightsChips property={property} />

          <div className="flex gap-3">
            <a href={whatsapp} target="_blank" rel="noreferrer" className="flex-1 rounded-xl bg-brand-700 px-4 py-3 text-center font-semibold text-white">
              WhatsApp
            </a>
            <a href="#contato" className="flex-1 rounded-xl border border-brand-700 px-4 py-3 text-center font-semibold text-brand-700">
              Agendar visita
            </a>
          </div>

          <TravelTimeChips propertyId={property.id} lat={property.latitude} lng={property.longitude} />
          <CitySummaryCard city={property.city} />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-brand-100 bg-white p-6 space-y-4">
          <h2 className="font-display text-2xl text-brand-900">Descrição</h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{property.description}</p>
        </article>

        <div className="space-y-4">
          {property.type?.toLowerCase().includes("casa") ? (
            <div className="rounded-3xl border border-brand-100 bg-white p-5 space-y-2">
              <h3 className="font-semibold text-brand-900">Financiamento</h3>
              <p className="text-sm text-slate-700">Imóveis urbanos/casas podem simular financiamento aqui. Para chácaras usamos consórcio.</p>
            </div>
          ) : (
            <ConsorcioSimulator value={property.price} />
          )}
        </div>
      </section>
    </main>
  );
}
