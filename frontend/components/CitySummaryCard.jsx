"use client";

import { useEffect, useState } from "react";
import { getCitySummary } from "@/lib/api";

// Descrições padrão para evitar ter que preencher no painel
const DEFAULT_CITY_SUMMARIES = {
  ibaiti:
    "Ibaiti é um polo madeireiro e agropecuário do Centro-Norte do Paraná, criado em 1947. Fica no entroncamento da BR-153 com a PR-272, tem clima ameno, áreas de reflorestamento e serviços regionais.",
  japira:
    "Japira fica no norte do Paraná, no Vale do Ivaí. Tornou-se município nos anos 1960, mantém perfil rural e agricultura familiar e oferece ambiente tranquilo e de pequeno porte urbano.",
  curiuva:
    "Curiúva está a leste de Ibaiti, com origem em colônias agrícolas e economia baseada em erva-mate, madeira e pequenas indústrias. Mantém perfil rural com ligação pela PR-160 e proximidade com o Rio Tibagi.",
  sapopema:
    "Sapopema é conhecida pelo Pico Agudo e turismo de natureza. Economia ligada à agricultura e erva-mate, acesso principal pela PR-090 e paisagens de serras e rios no Vale do Tibagi.",
  tomazina:
    "Tomazina fica às margens do Rio das Cinzas, com patrimônio histórico religioso e turismo de pesca. Agricultura e pecuária são bases econômicas; acesso pelas PR-424 e PR-239.",
  figueira:
    "Figueira surgiu com a exploração de carvão em Figueira e Candiota. Hoje tem economia de serviços e agricultura, às margens do Rio das Cinzas, e acesso pela PR-272.",
  jaboti:
    "Jaboti está no Norte Pioneiro, com origem em fazendas de café. Economia atual diversificada entre agricultura e serviços; ligação pelas PR-272 e PR-435.",
  wenceslau_braz:
    "Wenceslau Braz é município do Norte Pioneiro, conhecido pelo café e grãos. Possui centro urbano compacto e acesso pela BR-153 e PR-092.",
  sapopema_supplement: "",
  congonhinhas:
    "Congonhinhas, no Norte Pioneiro, tem economia agrícola (café, soja, milho) e criação de gado. Acesso principal pela PR-442.",
  arapoti:
    "Arapoti integra o Vale do Ivaí/Tibagi, com forte setor madeireiro e agroindustrial (leite e grãos). Fica na PR-092, próximo à BR-153, com cooperativas atuantes.",
  santana_do_itarare:
    "Santana do Itararé está no Norte Pioneiro, na divisa com SP, com economia de grãos e pecuária e ligação rodoviária pela PR-092."
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
