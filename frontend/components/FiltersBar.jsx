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
    <div className="grid gap-3 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <select
        className="w-full rounded-xl border border-brand-100 px-3 py-2"
        defaultValue={searchParams.get("type") || ""}
        onChange={(e) => update("type", e.target.value)}
      >
        <option value="">Tipo</option>
        <option value="Fazenda">Fazenda</option>
        <option value="Casa">Casa</option>
        <option value="Sitio">Sítio</option>
        <option value="Chacara">Chácara</option>
        <option value="Lote">Lote</option>
      </select>

      <input
        className="w-full rounded-xl border border-brand-100 px-3 py-2"
        placeholder="Cidade"
        defaultValue={searchParams.get("city") || ""}
        onBlur={(e) => update("city", e.target.value)}
      />

      <button
        className="w-full rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white"
        onClick={() => router.push("/imoveis")}
      >
        Limpar Filtros
      </button>
    </div>
  );
}
