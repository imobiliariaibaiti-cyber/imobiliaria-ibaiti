"use client";

import { useEffect, useState } from "react";

// Dados exemplo; atualize quando quiser ou troque por uma API.
const QUOTES = [
  {
    label: "Café arábica",
    price: "R$ 1.040,00/saca",
    change: "+1,2% hoje",
    note: "Indicador CEPEA/ESALQ",
    color: "from-amber-200/60 via-amber-100 to-white"
  },
  {
    label: "Boi gordo",
    price: "R$ 245,00/@",
    change: "-0,4% hoje",
    note: "B3 (à vista)",
    color: "from-emerald-200/60 via-emerald-100 to-white"
  },
  {
    label: "Milho",
    price: "R$ 62,50/sc",
    change: "+0,8% hoje",
    note: "Indicador CEPEA",
    color: "from-yellow-200/60 via-yellow-100 to-white"
  }
];

export default function QuoteSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const current = QUOTES[index];

  return (
    <section className="container-main">
      <div className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-md shadow-brand-900/10">
        <div
          className={`grid gap-6 bg-gradient-to-r ${current.color} px-6 py-6 sm:px-8 sm:py-8 md:grid-cols-[2fr,1fr] md:items-center`}
        >
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Mercado rural</p>
            <h3 className="font-display text-2xl text-brand-900 sm:text-3xl">{current.label}</h3>
            <p className="text-xl font-bold text-brand-800">{current.price}</p>
            <p className="text-sm text-emerald-700">{current.change}</p>
            <p className="text-sm text-slate-600">{current.note}</p>
            <a
              href="/valores"
              className="inline-flex w-fit rounded-xl border border-brand-700 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:-translate-y-[1px] hover:shadow-sm"
            >
              Ver histórico de preços
            </a>
          </div>
          <div className="flex items-center justify-end gap-2">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === index ? "bg-brand-700 w-6" : "bg-brand-200 hover:bg-brand-300"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
