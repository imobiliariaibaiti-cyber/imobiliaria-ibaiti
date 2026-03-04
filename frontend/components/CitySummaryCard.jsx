"use client";

import { useEffect, useState } from "react";
import { getCitySummary } from "@/lib/api";

export default function CitySummaryCard({ city, manualSummary }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!city) return;
    if (manualSummary) {
      setData({ summary: manualSummary });
      return;
    }
    getCitySummary(city).then(setData).catch(() => setData(null));
  }, [city, manualSummary]);

  if (!data) return null;

  return (
    <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4 space-y-1">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Sobre {city}</p>
      {data.summary && <p className="text-sm text-slate-700 whitespace-pre-line">{data.summary}</p>}
      {data.rating && !manualSummary && <p className="text-sm text-brand-700">Avaliação geral: {Number(data.rating).toFixed(1)} / 5</p>}
    </div>
  );
}
