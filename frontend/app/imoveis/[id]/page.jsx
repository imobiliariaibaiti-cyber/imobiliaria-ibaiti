import { Suspense } from "react";
import { formatPrice, getWhatsAppLink, resolveImage, getYouTubeEmbedUrl } from "@/lib/format";
import { getPropertyById } from "@/lib/api";
import TravelTimeChips from "@/components/TravelTimeChips";
import CitySummaryCard from "@/components/CitySummaryCard";
import ConsorcioSimulator from "@/components/ConsorcioSimulator";
import Comments from "@/components/Comments";
import HighlightsChips from "@/components/HighlightsChips";
import AnalyticsBeacon from "@/components/AnalyticsBeacon";
import Link from "next/link";
import { getCityContentByName } from "@/lib/cities";

export const dynamic = "force-dynamic";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2a9.92 9.92 0 0 0-8.59 14.88L2 22l5.27-1.38a10 10 0 0 0 4.76 1.21h.01A9.96 9.96 0 0 0 22 11.92a9.86 9.86 0 0 0-2.95-7.01Zm-7.02 15.24h-.01a8.3 8.3 0 0 1-4.22-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.25 8.25 0 0 1-1.3-4.37c0-4.58 3.74-8.31 8.34-8.31a8.18 8.18 0 0 1 5.89 2.45 8.22 8.22 0 0 1 2.45 5.88c0 4.59-3.74 8.32-8.34 8.32Zm4.56-6.23c-.25-.12-1.47-.73-1.7-.82-.23-.08-.4-.12-.57.12-.16.25-.65.82-.79.98-.14.17-.29.19-.54.07-.25-.12-1.05-.39-2-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.24-.01-.37.11-.49.11-.1.25-.28.37-.42.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.43-.06-.12-.57-1.36-.78-1.87-.21-.49-.42-.43-.57-.44h-.49c-.17 0-.43.06-.66.31-.23.24-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.72 2.62 4.17 3.68.58.25 1.04.41 1.4.53.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.17.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.02 10.12 11.93v-8.44H7.08v-3.5h3.04V9.39c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24V7.9h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.5h-2.79V24C19.61 23.09 24 18.1 24 12.07Z" />
    </svg>
  );
}

export default async function PropertyPage({ params }) {
  const property = await getPropertyById(params.id);
  const cityContent = getCityContentByName(property.city);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://imobiliariaibaiti.com";
  const propertyUrl = `${siteUrl}/imoveis/${property.id}`;
  const whatsapp = getWhatsAppLink(
    `Ola! Tenho interesse no imovel ${property.title}${property.propertyCode ? ` (codigo ${property.propertyCode})` : ""} em ${property.city}.`
  );
  const shareText = `Confira este imovel: ${property.title} em ${property.city}. ${propertyUrl}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`;

  return (
    <main className="container-main py-8 space-y-8">
      <Suspense fallback={null}>
        <AnalyticsBeacon propertyId={property.id} source="detalhe-imovel" />
      </Suspense>
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
            {cityContent ? (
              <Link href={`/cidades/${cityContent.slug}`} className="text-slate-700 underline underline-offset-2">
                {property.city}
              </Link>
            ) : (
              <p className="text-slate-700">{property.city}</p>
            )}
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

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#25D366] bg-[#25D366] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#1ebe5b] hover:border-[#1ebe5b]"
            >
              <WhatsAppIcon />
              Compartilhar no WhatsApp
            </a>
            <a
              href={facebookShareUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#1877F2] bg-[#1877F2] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#1669d8] hover:border-[#1669d8]"
            >
              <FacebookIcon />
              Compartilhar no Facebook
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
