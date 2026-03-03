"use client";

import { useEffect, useState } from "react";

const codeMap = {
  0: "Céu limpo",
  1: "Pred. claro",
  2: "Parcial nublado",
  3: "Nublado",
  45: "Névoa",
  48: "Neblina",
  51: "Chuvisco leve",
  53: "Chuvisco",
  55: "Chuvisco forte",
  61: "Chuva leve",
  63: "Chuva",
  65: "Chuva forte",
  71: "Neve leve",
  73: "Neve",
  75: "Neve forte",
  80: "Pancadas leves",
  81: "Pancadas",
  82: "Pancadas fortes",
  95: "Trovoadas",
  96: "Trovoadas c/ granizo",
  99: "Trovoadas fortes"
};

export default function WeatherBar() {
  const [data, setData] = useState({ temp: null, code: null, loading: true, error: false });

  useEffect(() => {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=-23.847&longitude=-50.193&current=temperature_2m,weather_code&timezone=America/Sao_Paulo";
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        const cur = json?.current || {};
        setData({ temp: cur.temperature_2m, code: cur.weather_code, loading: false, error: false });
      })
      .catch(() => setData({ temp: null, code: null, loading: false, error: true }));
  }, []);

  if (data.loading) {
    return (
      <div className="bg-brand-50 text-brand-800">
        <div className="container-main flex items-center gap-2 py-2 text-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-700" />
          <span>Carregando tempo em Ibaiti...</span>
        </div>
      </div>
    );
  }

  if (data.error || data.temp === null) {
    return null;
  }

  const label = codeMap[data.code] || "Tempo local";

  return (
    <div className="bg-brand-50 text-brand-800">
      <div className="container-main flex items-center gap-3 py-2 text-sm">
        <span className="font-semibold">Ibaiti agora:</span>
        <span>{Math.round(data.temp)}ºC</span>
        <span className="text-slate-700">· {label}</span>
      </div>
    </div>
  );
}
