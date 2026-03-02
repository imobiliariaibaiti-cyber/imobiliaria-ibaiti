import { getPropertyById } from "@/lib/api";
import { formatPrice, getWhatsAppLink, resolveImage } from "@/lib/format";

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
        </div>
        <div className="space-y-4 rounded-3xl border border-brand-100 bg-white p-7 shadow-lg shadow-brand-900/5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">{property.type}</p>
          <h1 className="font-display text-4xl text-brand-900">{property.title}</h1>
          <p className="text-slate-600">{property.city}</p>
          <p className="text-2xl font-bold text-brand-700">{formatPrice(property.price)}</p>
          <p className="leading-relaxed text-slate-700">{property.description}</p>
          <a
            href={getWhatsAppLink(`Tenho interesse no imóvel ${property.title} (${property.city}).`)}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}

