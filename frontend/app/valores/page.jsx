"use client";

import { useEffect, useMemo, useState } from "react";

const fallback = [
  { city: "Ibaiti", distanceKm: 0, type: "Lavoura alta", price: 210_000, source: "Mercado local" },
  { city: "Tomazina", distanceKm: 35, type: "Pasto formado", price: 115_000, source: "Oferta regional" },
  { city: "Ventania", distanceKm: 70, type: "Reflorestamento", price: 78_000, source: "Anuncios" },
  { city: "Jaguariaiva", distanceKm: 95, type: "Area mista", price: 135_000, source: "Corretores" },
  { city: "Arapoti", distanceKm: 60, type: "Lavoura alta", price: 195_000, source: "Vendas recentes" },
  { city: "Senges", distanceKm: 50, type: "Pasto formado", price: 120_000, source: "Oferta regional" },
  { city: "Wenceslau Braz", distanceKm: 40, type: "Area mista", price: 140_000, source: "Anuncios" }
];

const fallbackBoi = [
  { date: "2026-02-15", price: 322.7 },
  { date: "2026-02-20", price: 325.1 },
  { date: "2026-02-24", price: 327.3 },
  { date: "2026-02-28", price: 328.5 },
  { date: "2026-03-02", price: 330.0 }
];

const fallbackCommodities = [
  { name: "Milho", price: 64.5, unit: "R$/saca 60kg", source: "base CEPEA" },
  { name: "Soja", price: 148.0, unit: "R$/saca 60kg", source: "base CEPEA" },
  { name: "Trigo", price: 83.0, unit: "R$/saca 60kg", source: "mercado PR" },
  { name: "Aveia", price: 68.0, unit: "R$/saca 60kg", source: "mercado PR" }
];
const fallbackCafe = { name: "Café arábica", price: 1840.71, unit: "R$/saca 60kg", source: "CEPEA/Guaxupé", date: "2026-03-02" };

const formatMoney = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export default function ValoresPage() {
  const [radius, setRadius] = useState(100);
  const [selectedType, setSelectedType] = useState("");
  const [rows, setRows] = useState(fallback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [boiSeries, setBoiSeries] = useState(fallbackBoi);
  const [commodities, setCommodities] = useState(fallbackCommodities);
  const [cafe, setCafe] = useState(fallbackCafe);

  useEffect(() => {
    const load = async () => {
      const endpoint = process.env.NEXT_PUBLIC_VALORES_ENDPOINT || "/valores.json";
      const boiEndpoint = process.env.NEXT_PUBLIC_BOI_ENDPOINT || "/boi.json";
      const commEndpoint = process.env.NEXT_PUBLIC_COMMODITIES_ENDPOINT || "/commodities.json";
      const cafeEndpoint = process.env.NEXT_PUBLIC_CAFE_ENDPOINT || "";
      try {
        setLoading(true);
        setError("");
        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          setRows(data);
        } else {
          setError("Retorno vazio, usando dados base.");
          setRows(fallback);
        }
      } catch (err) {
        setError("Não foi possível atualizar agora. Exibindo valores base.");
        setRows(fallback);
      } finally {
        setLoading(false);
      }

      try {
        const r2 = await fetch(boiEndpoint, { cache: "no-store" });
        if (r2.ok) {
          const d2 = await r2.json();
          if (Array.isArray(d2) && d2.length) setBoiSeries(d2);
        }
      } catch (err) {
        setBoiSeries(fallbackBoi);
      }

      try {
        const r3 = await fetch(commEndpoint, { cache: "no-store" });
        if (r3.ok) {
          const d3 = await r3.json();
          if (Array.isArray(d3) && d3.length) setCommodities(d3);
        }
      } catch (err) {
        setCommodities(fallbackCommodities);
      }

      if (cafeEndpoint) {
        try {
          const rc = await fetch(cafeEndpoint, { cache: "no-store" });
          if (rc.ok) {
            const dc = await rc.json();
            if (dc?.price) {
              setCafe({
                name: dc.name || "Café arábica",
                price: dc.price,
                unit: dc.unit || "R$/saca 60kg",
                source: dc.source || "Fonte externa",
                date: dc.date || ""
              });
            }
          }
        } catch (err) {
          setCafe(fallbackCafe);
        }
      }
    };
    load();
  }, []);

  const filtered = useMemo(
    () =>
      rows.filter(
        (item) => item.distanceKm <= radius && (!selectedType || item.type === selectedType)
      ),
    [radius, selectedType, rows]
  );

  const maxPrice = filtered.reduce((m, d) => Math.max(m, d.price), 0) || 1;

  const downloadCsv = () => {
    const header = "Cidade,Distancia_km,Tipo,Preco_alqueire,Fonte\n";
    const rowsExport = filtered
      .map((d) => `${d.city},${d.distanceKm},${d.type},${d.price},${d.source}`)
      .join("\n");
    const blob = new Blob([header + rowsExport], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "valores-alqueire-ibaiti.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="container-main space-y-10 py-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-700">Ibaiti + 100 km</p>
          <h1 className="font-display text-4xl text-brand-900">Valores de terras por alqueire</h1>
          <p className="text-slate-600">Atualize os valores pelo endpoint configurado ou compartilhe os dados para importarmos.</p>
          {error && <p className="text-xs text-amber-700">{error}</p>}
        </div>
        <div className="flex gap-3">
          <button
            onClick={downloadCsv}
            className="rounded-xl border border-brand-800 px-4 py-2 text-sm font-semibold text-brand-800 transition duration-150 hover:-translate-y-[1px] hover:bg-brand-50 hover:shadow-sm active:translate-y-0"
          >
            Exportar CSV
          </button>
          <a
            href="https://wa.me/5543999999999"
            className="rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white transition duration-150 hover:-translate-y-[1px] hover:shadow-md hover:bg-brand-700 active:translate-y-0"
            target="_blank"
            rel="noreferrer"
          >
            Falar sobre avaliacao
          </a>
        </div>
      </header>

      <section className="grid gap-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm md:grid-cols-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-brand-700">Raio (km)</p>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-brand-700"
          />
          <p className="text-sm text-slate-600">Mostrando até {radius} km de Ibaiti.</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-brand-700">Tipo de terra</p>
          <select
            className="w-full rounded-xl border border-brand-100 px-3 py-2"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Todos</option>
            {[...new Set(rows.map((d) => d.type))].map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-brand-700">Média atual</p>
          <p className="text-2xl font-display text-brand-900">
            {filtered.length ? formatMoney(Math.round(filtered.reduce((s, d) => s + d.price, 0) / filtered.length)) : "--"}
          </p>
          <p className="text-xs text-slate-600">Calculada sobre os dados exibidos.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Grãos e café · PR</p>
            <h2 className="font-display text-2xl text-brand-900">Preços atuais</h2>
            <p className="text-sm text-slate-600">Atualize via endpoint quando tiver a cotação do dia.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl border border-brand-100 bg-[#fff8e9] px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">{cafe.name}</p>
            <p className="text-2xl font-display text-brand-900">{cafe.price.toFixed ? cafe.price.toFixed(2) : cafe.price}</p>
            <p className="text-sm text-slate-600">{cafe.unit}</p>
            {cafe.date && <p className="text-xs text-slate-500">Atualizado: {cafe.date}</p>}
            {cafe.source && <p className="text-xs text-slate-500">Fonte: {cafe.source}</p>}
          </article>
          {commodities.map((c) => (
            <article key={c.name} className="rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">{c.name}</p>
              <p className="text-2xl font-display text-brand-900">{c.price.toFixed ? c.price.toFixed(2) : c.price}</p>
              <p className="text-sm text-slate-600">{c.unit}</p>
              {c.source && <p className="text-xs text-slate-500">Fonte: {c.source}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl text-brand-900">Distribuição por cidade</h2>
          <p className="text-sm text-slate-600">Última carga recebida do endpoint configurado.</p>
        </div>
        <div className="overflow-x-auto">
          <svg className="h-64 min-w-full" viewBox={`0 0 ${filtered.length * 120} 260`} role="img" aria-label="Grafico de barras por cidade">
            {filtered.map((item, idx) => {
              const barWidth = 60;
              const gap = 60;
              const x = idx * (barWidth + gap);
              const height = (item.price / maxPrice) * 180;
              const y = 200 - height;
              return (
                <g key={item.city + idx} transform={`translate(${x},0)`}>
                  <rect x="0" y={y} width={barWidth} height={height} rx="8" className="fill-[#3a8e8e] opacity-90" />
                  <text x={barWidth / 2} y={y - 8} textAnchor="middle" className="fill-brand-900 text-[12px] font-semibold">
                    {formatMoney(item.price)}
                  </text>
                  <text x={barWidth / 2} y="220" textAnchor="middle" className="fill-slate-700 text-[12px] font-semibold">
                    {item.city}
                  </text>
                  <text x={barWidth / 2} y="236" textAnchor="middle" className="fill-slate-500 text-[11px]">
                    {item.type}
                  </text>
                </g>
              );
            })}
            <line x1="0" y1="200" x2={filtered.length * 120} y2="200" className="stroke-[#d7e2e6]" strokeWidth="1" />
          </svg>
        </div>
      </section>

      <section className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Gado de corte · Paraná</p>
            <h2 className="font-display text-2xl text-brand-900">Boi gordo (R$/@) atualizado</h2>
            <p className="text-sm text-slate-600">Série atualizada pelo endpoint configurado (boi gordo R$/@).</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Último</p>
            <p className="text-2xl font-display text-brand-900">{boiSeries.length ? boiSeries[boiSeries.length - 1].price.toFixed(2) : "--"} R$/@</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <svg className="h-48 min-w-full" viewBox="0 0 400 200" role="img" aria-label="Linha do boi gordo R$/arroba">
            {boiSeries.length > 1 && (() => {
              const max = Math.max(...boiSeries.map((d) => d.price));
              const min = Math.min(...boiSeries.map((d) => d.price));
              const norm = (p) => ((p - min) / (max - min || 1));
              const points = boiSeries.map((d, idx) => {
                const x = (idx / (boiSeries.length - 1 || 1)) * 380 + 10;
                const y = 170 - norm(d.price) * 140;
                return `${x},${y}`;
              }).join(" ");
              return (
                <>
                  <polyline fill="none" strokeWidth="3" className="stroke-[#3a8e8e]" points={points} />
                  {boiSeries.map((d, idx) => {
                    const x = (idx / (boiSeries.length - 1 || 1)) * 380 + 10;
                    const y = 170 - norm(d.price) * 140;
                    return <circle key={d.date} cx={x} cy={y} r="4" className="fill-[#f0b03c] stroke-white stroke-2" />;
                  })}
                </>
              );
            })()}
            <line x1="0" y1="170" x2="400" y2="170" className="stroke-[#d7e2e6]" strokeWidth="1" />
          </svg>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm md:grid-cols-3">
        <article className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Cap rate rural</p>
          <p className="text-sm text-slate-700">Cruze rendimento esperado vs. preço por alqueire para avaliar retorno de arrendamento ou integração.</p>
        </article>
        <article className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Logística</p>
          <p className="text-sm text-slate-700">Acesso, distância a silos e relevo impactam R$/alqueire mais que a área total.</p>
        </article>
        <article className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Solo e água</p>
          <p className="text-sm text-slate-700">Classe de solo, disponibilidade de água e outorga elevam valor; documente no laudo.</p>
        </article>
      </section>

    </main>
  );
}
