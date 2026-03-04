"use client";

import { useEffect, useMemo, useState } from "react";

const STQ_QUOTES = {
  coffeeArabica: "kc.f", // ICE Coffee C
  coffeeRobusta: "rc.f", // ICE Robusta
  cattle: "lc.f", // Live Cattle CME
  corn: "c.f", // Corn CBOT
  soy: "s.f", // Soybeans CBOT
  usdbrl: "usdbrl" // USD/BRL forex
};

const formatMoney = (v, digits = 2) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: digits, maximumFractionDigits: digits });

async function fetchStooq(symbol) {
  const url = `https://stooq.com/db/l/?s=${symbol}&f=sd2t2ohlcv&h&e=json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Stooq status ${res.status}`);
  const data = await res.json();
  const r = data?.[0];
  if (!r || !r.c) throw new Error("sem cotação");
  return {
    symbol,
    close: Number(r.c),
    open: Number(r.o),
    high: Number(r.h),
    low: Number(r.l),
    date: r.d,
    time: r.t
  };
}

function convertToBRL({ usdbrl, commodity }) {
  if (!commodity || !usdbrl) return null;
  const usd = commodity.close;
  const fx = usdbrl.close;

  switch (commodity.symbol) {
    case STQ_QUOTES.coffeeArabica:
      // US¢/lb -> USD/lb -> USD/kg -> USD/saca 60kg -> BRL
      return usd * 0.01 * 2.20462 * 60 * fx;
    case STQ_QUOTES.coffeeRobusta:
      return usd * 0.01 * 2.20462 * 60 * fx;
    case STQ_QUOTES.corn:
      // US¢/bushel; 1 bushel = 60lb; 60lb/27.216 kg => saca 60kg ~ 2.2046*60/27.216 = 4.85 bushels
      return usd * 0.01 * fx * (60 / 27.216);
    case STQ_QUOTES.soy:
      // US¢/bushel soja; 1 bushel=60lb; saca 60kg ~ 1 bushel/27.216*60 = 2.2046
      return usd * 0.01 * fx * (60 / 27.216);
    case STQ_QUOTES.cattle:
      // US¢/lb -> USD/@ (1 arroba = 32.15 lb) -> BRL
      return usd * 0.01 * 32.15 * fx;
    default:
      return usd * fx;
  }
}

export default function ValoresPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fx, setFx] = useState(null);
  const [quotes, setQuotes] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const usdbrl = await fetchStooq(STQ_QUOTES.usdbrl);
        setFx(usdbrl);

        const symbols = [
          STQ_QUOTES.coffeeArabica,
          STQ_QUOTES.coffeeRobusta,
          STQ_QUOTES.corn,
          STQ_QUOTES.soy,
          STQ_QUOTES.cattle
        ];
        const results = await Promise.allSettled(symbols.map(fetchStooq));
        const q = {};
        results.forEach((r, idx) => {
          const sym = symbols[idx];
          if (r.status === "fulfilled") q[sym] = r.value;
        });
        setQuotes(q);
      } catch (err) {
        setError("Não foi possível atualizar as cotações agora.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = useMemo(() => {
    if (!fx) return [];
    const mapper = [
      { key: "cafe-1", label: "Café arábica (ICE KC)", sym: STQ_QUOTES.coffeeArabica, unit: "R$/saca 60kg" },
      { key: "cafe-2", label: "Café robusta (ICE RC)", sym: STQ_QUOTES.coffeeRobusta, unit: "R$/saca 60kg" },
      { key: "corn", label: "Milho (CBOT C)", sym: STQ_QUOTES.corn, unit: "R$/saca 60kg" },
      { key: "soy", label: "Soja (CBOT S)", sym: STQ_QUOTES.soy, unit: "R$/saca 60kg" },
      { key: "cattle", label: "Boi gordo (Live Cattle)", sym: STQ_QUOTES.cattle, unit: "R$/@ 15kg" }
    ];
    return mapper
      .map((m) => {
        const c = quotes[m.sym];
        if (!c) return null;
        const priceBRL = convertToBRL({ usdbrl: fx, commodity: c });
        if (!priceBRL) return null;
        return {
          ...m,
          price: priceBRL,
          date: c.date,
          change: c.close - c.open,
          pct: c.open ? ((c.close - c.open) / c.open) * 100 : 0
        };
      })
      .filter(Boolean);
  }, [fx, quotes]);

  const sliderData = cards.slice(0, 5);

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
          sliderData.map((c) => (
            <article key={c.key} className="rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3 shadow-sm">
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
      </section>

      <section className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
        <div className="mb-3">
          <h2 className="font-display text-2xl text-brand-900">Gráfico intradiário simplificado</h2>
          <p className="text-sm text-slate-600">Alterna os principais ativos agro (café, boi, milho, soja).</p>
        </div>
        <div className="overflow-x-auto">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <article key={c.key} className="rounded-xl border border-brand-100 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 break-words">{c.label}</p>
                    <p className="text-lg font-display text-brand-900">{formatMoney(c.price, 2)}</p>
                  </div>
                  <p className={`text-xs ${c.change >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                    {c.change >= 0 ? "+" : ""}
                    {c.pct.toFixed(2)}%
                  </p>
                </div>
                <p className="text-xs text-slate-500">{c.unit}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
