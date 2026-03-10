import Link from "next/link";
import { formatPrice, getWhatsAppLink, resolveImage } from "@/lib/format";
import { getCityContentByName } from "@/lib/cities";

export default function PropertyCard({ property }) {
  const image = resolveImage(property.images);
  const cityContent = getCityContentByName(property.city);
  const whatsapp = getWhatsAppLink(
    `Ola! Tenho interesse no imovel ${property.title}${property.propertyCode ? ` (codigo ${property.propertyCode})` : ""} em ${property.city}. Quero saber mais para fechar negocio.`
  );

  return (
    <article className="group panel-card max-w-full overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
      <img src={image} alt={property.title} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="space-y-3 p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">{property.type}</span>
          {property.propertyCode && <span className="rounded-full bg-signal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-signal-800">{property.propertyCode}</span>}
        </div>
        <h3 className="text-xl font-bold text-brand-900 break-words">{property.title}</h3>
        {cityContent ? (
          <Link href={`/cidades/${cityContent.slug}`} className="text-sm text-accent-700 break-words underline underline-offset-2">
            {property.city}
          </Link>
        ) : (
          <p className="text-sm text-slate-600 break-words">{property.city}</p>
        )}
        <p className="text-lg font-semibold text-brand-700">{formatPrice(property.price)}</p>
        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <Link href={`/imoveis/${property.id}`} className="btn-primary flex-1 px-4 py-2 text-sm">
            Ver detalhes
          </Link>
          <a href={whatsapp} target="_blank" className="btn-accent px-4 py-2 text-sm" rel="noreferrer">
            Saber mais
          </a>
        </div>
      </div>
    </article>
  );
}
