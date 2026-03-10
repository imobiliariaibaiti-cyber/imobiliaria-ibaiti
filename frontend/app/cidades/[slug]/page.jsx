import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { getProperties } from "@/lib/api";
import { cityEntries, getCityContentBySlug, normalizeCityKey } from "@/lib/cities";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return cityEntries.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }) {
  const city = getCityContentBySlug(params.slug);

  if (!city) {
    return {
      title: "Cidade | Imobiliaria Ibaiti"
    };
  }

  return {
    title: `Imoveis rurais em ${city.name} | Imobiliaria Ibaiti`,
    description: `Veja imoveis rurais em ${city.name}, com contexto local e atendimento especializado da Imobiliaria Ibaiti.`
  };
}

export default async function CityPage({ params }) {
  const city = getCityContentBySlug(params.slug);

  if (!city) {
    return (
      <main className="container-main py-10">
        <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-sm">
          <h1 className="font-display text-3xl text-brand-900">Cidade nao encontrada</h1>
          <p className="mt-3 text-slate-600">Essa pagina local ainda nao esta configurada.</p>
          <Link href="/imoveis" className="mt-5 inline-flex rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white">
            Ver todos os imoveis
          </Link>
        </div>
      </main>
    );
  }

  const allProperties = await getProperties();
  const properties = allProperties.filter((property) => normalizeCityKey(property.city) === normalizeCityKey(city.name));
  const relatedCities = cityEntries.filter((entry) => entry.slug !== city.slug).slice(0, 4);

  return (
    <main className="container-main space-y-8 py-10">
      <section className="rounded-[2rem] border border-brand-100 bg-[radial-gradient(circle_at_top_left,#f5e8cb,transparent_35%),linear-gradient(135deg,#fffdf9,#fbf6ed)] p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Mercado local</p>
        <h1 className="mt-3 font-display text-4xl text-brand-900 sm:text-5xl">Imoveis rurais em {city.name}</h1>
        <p className="mt-4 max-w-3xl text-slate-700">{city.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/imoveis?city=${encodeURIComponent(city.name)}`} className="rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white">
            Ver listagem filtrada
          </Link>
          <Link href="/valores" className="rounded-xl border border-brand-700 px-5 py-3 font-semibold text-brand-700">
            Ver valores da regiao
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Panorama da cidade</p>
          <p className="mt-3 text-slate-700">
            Trabalhamos o atendimento de {city.name} com foco em imoveis rurais que tenham boa leitura comercial, documentacao clara e perfil aderente a comprador da regiao.
          </p>
          <p className="mt-3 text-slate-700">
            Se voce procura fazenda, sitio, chacara ou area de apoio em {city.name}, aqui voce encontra uma visao local mais especifica do mercado.
          </p>
        </div>

        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Outras cidades da regiao</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {relatedCities.map((entry) => (
              <Link key={entry.slug} href={`/cidades/${entry.slug}`} className="rounded-full border border-brand-100 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-800">
                {entry.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Carteira local</p>
          <h2 className="font-display text-3xl text-brand-900">Imoveis em {city.name}</h2>
        </div>

        {properties.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-brand-200 bg-white p-8 text-center text-slate-600">
            Ainda nao temos imoveis publicados em {city.name}. Fale com o time para receber oportunidades parecidas na regiao.
          </div>
        )}
      </section>
    </main>
  );
}
