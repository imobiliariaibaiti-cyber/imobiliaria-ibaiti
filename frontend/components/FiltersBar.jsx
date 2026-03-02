"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = (name, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(name);
    else params.set(name, value);
    router.push(`/imoveis?${params.toString()}`);
  };

  return (
    <div className="grid gap-3 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm md:grid-cols-5">
      <select
        className="rounded-xl border border-brand-100 px-3 py-2"
        defaultValue={searchParams.get("type") || ""}
        onChange={(e) => update("type", e.target.value)}
      >
        <option value="">Tipo</option>
        <option>Fazenda</option>
        <option>Sítio</option>
        <option>Chácara</option>
      </select>
      <input
        className="rounded-xl border border-brand-100 px-3 py-2"
        placeholder="Cidade"
        defaultValue={searchParams.get("city") || ""}
        onBlur={(e) => update("city", e.target.value)}
      />
      <input
        className="rounded-xl border border-brand-100 px-3 py-2"
        type="number"
        placeholder="Preço mínimo"
        defaultValue={searchParams.get("minPrice") || ""}
        onBlur={(e) => update("minPrice", e.target.value)}
      />
      <input
        className="rounded-xl border border-brand-100 px-3 py-2"
        type="number"
        placeholder="Preço máximo"
        defaultValue={searchParams.get("maxPrice") || ""}
        onBlur={(e) => update("maxPrice", e.target.value)}
      />
      <button
        className="rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white"
        onClick={() => router.push("/imoveis")}
      >
        Limpar Filtros
      </button>
    </div>
  );
}

