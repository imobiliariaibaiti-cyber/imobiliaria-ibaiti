"use client";

import { useEffect, useState } from "react";

const QUOTES = [
  {
    label: "Cafe arabica",
    price: "R$ 1.040,00/saca",
    change: "+1,2% hoje",
    note: "Indicador CEPEA/ESALQ",
    color: "from-signal-100 via-signal-50 to-white",
    changeClass: "text-signal-700"
  },
  {
    label: "Boi gordo",
    price: "R$ 245,00/@",
    change: "-0,4% hoje",
    note: "B3 a vista",
    color: "from-accent-100 via-accent-50 to-white",
    changeClass: "text-accent-700"
  },
  {
    label: "Milho",
    price: "R$ 62,50/sc",
    change: "+0,8% hoje",
    note: "Indicador CEPEA",
    color: "from-brand-100 via-brand-50 to-white",
    changeClass: "text-brand-700"
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
      <div className="panel-card overflow-hidden">
        <div className={`grid gap-6 bg-gradient-to-r ${current.color} px-6 py-6 sm:px-8 sm:py-8 md:grid-cols-[2fr,1fr] md:items-center`}>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Mercado rural</p>
            <h3 className="font-display text-2xl text-brand-900 sm:text-3xl">{current.label}</h3>
            <p className="text-xl font-bold text-brand-800">{current.price}</p>
            <p className={`text-sm font-semibold ${current.changeClass}`}>{current.change}</p>
            <p className="text-sm text-slate-600">{current.note}</p>
            <a href="/valores" className="btn-secondary w-fit px-4 py-2 text-sm">
              Ver historico de precos
            </a>
          </div>
          <div className="flex items-center justify-end gap-2">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition ${i === index ? "w-6 bg-accent-700" : "w-2.5 bg-brand-200 hover:bg-brand-300"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
