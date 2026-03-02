import Link from "next/link";
import { formatPrice, getWhatsAppLink, resolveImage } from "@/lib/format";

export default function PropertyCard({ property }) {
  const image = resolveImage(property.images);
  const whatsapp = getWhatsAppLink(
    `Ola! Tenho interesse no imovel ${property.title}${property.propertyCode ? ` (codigo ${property.propertyCode})` : ""} em ${property.city}. Quero saber mais para fechar negocio.`
  );

  return (
    <article className="group overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-lg shadow-brand-900/5 transition hover:-translate-y-1 hover:shadow-xl">
      <img
        src={image}
        alt={property.title}
        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="space-y-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{property.type}</p>
        {property.propertyCode && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">{property.propertyCode}</p>}
        <h3 className="text-xl font-bold text-brand-900">{property.title}</h3>
        <p className="text-sm text-slate-600">{property.city}</p>
        <p className="text-lg font-semibold text-brand-700">{formatPrice(property.price)}</p>
        <div className="flex gap-2 pt-2">
          <Link
            href={`/imoveis/${property.id}`}
            className="flex-1 rounded-xl bg-brand-700 px-4 py-2 text-center text-sm font-semibold text-white"
          >
            Ver Detalhes
          </Link>
          <a
            href={whatsapp}
            target="_blank"
            className="rounded-xl border border-brand-700 px-4 py-2 text-sm font-semibold text-brand-700"
            rel="noreferrer"
          >
            Saber Mais
          </a>
        </div>
      </div>
    </article>
  );
}
