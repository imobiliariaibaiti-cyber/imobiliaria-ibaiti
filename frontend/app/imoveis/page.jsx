import { Suspense } from "react";
import FiltersBar from "@/components/FiltersBar";
import PropertyCard from "@/components/PropertyCard";
import { getProperties } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Imóveis Rurais",
  description: "Listagem de fazendas, sítios e chácaras com filtros por tipo, cidade e faixa de preço."
};

export default async function ImoveisPage({ searchParams }) {
  const properties = await getProperties(searchParams);

  return (
    <main className="container-main space-y-8 py-10">
      <div>
        <h1 className="font-display text-4xl text-brand-900">Todos os Imóveis</h1>
        <p className="text-slate-600">Filtre por tipo, cidade e faixa de preço.</p>
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
          Nenhum imóvel encontrado com os filtros selecionados.
        </p>
      )}
    </main>
  );
}

