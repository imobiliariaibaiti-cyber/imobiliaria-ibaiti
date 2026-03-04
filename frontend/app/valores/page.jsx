"use client";

import { useEffect, useState } from "react";

const formatMoney = (v, digits = 2) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: digits, maximumFractionDigits: digits });

export default function ValoresPage() {
  const [quotes, setQuotes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/quotes", { cache: "no-store" });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setQuotes(data.quotes || []);
      } catch (err) {
        setError("Não foi possível atualizar as cotações agora.");
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="container-main space-y-8 py-10">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-700">Cotações agro em tempo quase real</p>
          <h1 className="font-display text-4xl text-brand-900">Preços atualizados (Stooq)</h1>
          {error && <p className="text-xs text-amber-700">{error}</p>}
        </div>
        <div className="text-sm text-slate-600">
          Fonte: stooq.com (ICE/CME/CBOT) + USD/BRL. Conversões automáticas para R$.
        </div>
      </header>

      <section className="grid gap-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm md:grid-cols-3">
        {loading && <p className="text-sm text-slate-600">Atualizando cotações...</p>}
        {!loading &&
          quotes.map((c) => (
            <article key={c.symbol} className="rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 break-words">{c.label}</p>
              <p className="text-2xl font-display text-brand-900">{formatMoney(c.price, 2)}</p>
              <p className="text-sm text-slate-600">{c.unit}</p>
              <p className={`text-xs ${c.change >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                {c.change >= 0 ? "+" : ""}
                {c.pct.toFixed(2)}% no dia
              </p>
              {c.date && <p className="text-xs text-slate-500">Data: {c.date}</p>}
            </article>
          ))}
        {!loading && !quotes.length && <p className="text-sm text-slate-600">Sem dados agora.</p>}
      </section>
    </main>
  );
}
