"use client";

import { useEffect, useState } from "react";
import { getCitySummary } from "@/lib/api";

// Descrições padrão para evitar ter que preencher no painel
const DEFAULT_CITY_SUMMARIES = {
  japira:
    "Japira é um município do Vale do Ivaí, no norte do Paraná. Originou-se de colônias agrícolas e tornou-se município na década de 1960. Pequeno, tranquilo e com economia baseada na agricultura familiar.",
  ibaiti:
    "Ibaiti é um importante polo madeireiro e agropecuário do Centro-Norte do Paraná. Criado em 1947, está em região de planaltos com clima ameno, boa infraestrutura urbana e acesso pela BR-153."
};

export default function CitySummaryCard({ city, manualSummary }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!city) return;

    // 1) Se veio descrição manual do painel, usa ela
    if (manualSummary) {
      setData({ summary: manualSummary });
      return;
    }

    // 2) Se temos um texto padrão, usa imediatamente
    const predefined = DEFAULT_CITY_SUMMARIES[city?.toLowerCase()];
    if (predefined) {
      setData({ summary: predefined });
      return;
    }

    // 3) Caso contrário, tenta Google Places
    getCitySummary(city)
      .then(setData)
      .catch(() => setData(null));
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
