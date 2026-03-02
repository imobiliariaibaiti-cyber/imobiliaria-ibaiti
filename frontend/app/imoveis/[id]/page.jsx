import { getPropertyById } from "@/lib/api";
import { formatPrice, getWhatsAppLink, getYouTubeEmbedUrl, resolveImage } from "@/lib/format";

export async function generateMetadata({ params }) {
  const property = await getPropertyById(params.id);
  return {
    title: property.title,
    description: `${property.type} em ${property.city}. ${formatPrice(property.price)}`,
    alternates: { canonical: `/imoveis/${params.id}` }
  };
}

export default async function PropertyDetailPage({ params }) {
  const property = await getPropertyById(params.id);
  const images = Array.isArray(property.images) && property.images.length ? property.images : [resolveImage([])];
  const videoEmbedUrl = getYouTubeEmbedUrl(property.videoUrl);
  const statusDeed = property.deedAndRegistryOk ? "Sim" : "Nao";
  const whatsappMessage = `Tenho interesse no imovel ${property.title}${property.propertyCode ? ` (codigo ${property.propertyCode})` : ""} em ${property.city}. Gostaria de saber mais para fechar negocio.`;

  return (
    <main className="container-main py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <img src={images[0]} alt={property.title} className="h-80 w-full rounded-3xl object-cover" />
          <div className="grid grid-cols-3 gap-2">
            {images.slice(1, 4).map((image) => (
              <img key={image} src={image} alt={property.title} className="h-24 w-full rounded-xl object-cover" />
            ))}
          </div>
          {videoEmbedUrl && (
            <div className="overflow-hidden rounded-2xl border border-brand-100">
              <iframe
                src={videoEmbedUrl}
                title={`Video do imovel ${property.title}`}
                className="h-64 w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          )}
        </div>
        <div className="space-y-4 rounded-3xl border border-brand-100 bg-white p-7 shadow-lg shadow-brand-900/5">
          {property.propertyCode && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">Codigo: {property.propertyCode}</p>
          )}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">{property.type}</p>
          <h1 className="font-display text-4xl text-brand-900">{property.title}</h1>
          <p className="text-slate-600">{property.city}</p>
          {property.areaSize && <p className="text-sm text-slate-600">Area: {property.areaSize}</p>}
          <p className="text-sm text-slate-600">Escritura e registro: {statusDeed}</p>
          <p className="text-2xl font-bold text-brand-700">{formatPrice(property.price)}</p>
          <p className="leading-relaxed text-slate-700">{property.description}</p>
          <a
            href={getWhatsAppLink(whatsappMessage)}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white"
          >
            Saber Mais no WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
