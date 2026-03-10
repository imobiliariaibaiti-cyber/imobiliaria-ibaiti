import Link from "next/link";
import { Suspense } from "react";
import FiltersBar from "@/components/FiltersBar";
import PropertyCard from "@/components/PropertyCard";
import AnalyticsBeacon from "@/components/AnalyticsBeacon";
import { getProperties } from "@/lib/api";
import { cityEntries } from "@/lib/cities";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Imoveis Rurais",
  description: "Listagem de fazendas, sitios e chacaras com filtros por tipo, cidade e faixa de preco."
};

export default async function ImoveisPage({ searchParams }) {
  const properties = await getProperties(searchParams);

  return (
    <main className="container-main space-y-8 py-10">
      <Suspense fallback={null}>
        <AnalyticsBeacon source="listagem-imoveis" />
      </Suspense>

      <div>
        <h1 className="font-display text-4xl text-brand-900">Todos os Imoveis</h1>
        <p className="text-slate-600">Filtre por tipo, cidade e faixa de preco.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {cityEntries.slice(0, 8).map((city) => (
          <Link key={city.slug} href={`/cidades/${city.slug}`} className="rounded-full border border-brand-100 bg-white px-3 py-2 text-sm font-semibold text-brand-800 shadow-sm">
            {city.name}
          </Link>
        ))}
      </div>

      <Suspense fallback={<div className="rounded-2xl border border-brand-100 bg-white p-4 text-sm text-slate-500">Carregando filtros...</div>}>
        <FiltersBar />
      </Suspense>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {properties.length === 0 && (
        <p className="rounded-xl border border-dashed border-brand-200 p-8 text-center text-slate-600">
          Nenhum imovel encontrado com os filtros selecionados.
        </p>
      )}
    </main>
  );
}
