"use client";

import { useEffect, useState } from "react";

const formatMoney = (value, digits = 2) =>
  value?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });

const deral2025Source = "https://www.sapopema.pr.gov.br/itr/download/5/";

const cityBands = [
  {
    cidade: "Ibaiti",
    atualizadoEm: "05/05/2025",
    fonte: "https://www.ibaiti.pr.gov.br/itr",
    rows: [
      { uso: "Lavoura aptidao boa", valor: 83724.44 },
      { uso: "Lavoura aptidao regular", valor: 71165.77 },
      { uso: "Lavoura aptidao restrita", valor: 60281.6 },
      { uso: "Pastagem plantada", valor: 54420.89 },
      { uso: "Silvicultura / pastagem natural", valor: 37676 },
      { uso: "Preservacao da fauna e flora", valor: 35164.26 }
    ]
  },
  {
    cidade: "Pinhalao",
    atualizadoEm: "2025",
    fonte: deral2025Source,
    rows: [
      { uso: "A-III", valor: 73400 },
      { uso: "A-IV", valor: 55300 },
      { uso: "B-VI", valor: 43500 },
      { uso: "B-VII", valor: 34500 },
      { uso: "C-VIII", valor: 16100 }
    ]
  },
  {
    cidade: "Curiuva",
    atualizadoEm: "24/07/2025",
    fonte: "https://www.curiuva.pr.gov.br/index.php?id=1472864&sessao=b054603368vfb0",
    rows: [
      { uso: "Lavoura aptidao boa", valor: 68700 },
      { uso: "Lavoura aptidao regular", valor: 68700 },
      { uso: "Lavoura aptidao restrita", valor: 52400 },
      { uso: "Pastagem plantada", valor: 36200 },
      { uso: "Silvicultura / pastagem natural", valor: 26300 },
      { uso: "Preservacao da fauna e flora", valor: 13500 }
    ]
  },
  {
    cidade: "Japira",
    atualizadoEm: "2025",
    fonte: deral2025Source,
    rows: [
      { uso: "A-III", valor: 75200 },
      { uso: "A-IV", valor: 58200 },
      { uso: "B-VI", valor: 43700 },
      { uso: "B-VII", valor: 35700 },
      { uso: "C-VIII", valor: 17300 }
    ]
  },
  {
    cidade: "Joaquim Tavora",
    atualizadoEm: "2025",
    fonte: deral2025Source,
    rows: [
      { uso: "A-III", valor: 72300 },
      { uso: "A-IV", valor: 56200 },
      { uso: "B-VI", valor: 43000 },
      { uso: "B-VII", valor: 34600 },
      { uso: "C-VIII", valor: 15600 }
    ]
  },
  {
    cidade: "Arapoti",
    atualizadoEm: "07/08/2025",
    fonte: "https://www.arapoti.pr.gov.br/itr",
    rows: [
      { uso: "Lavoura aptidao boa", valor: 56886.91 },
      { uso: "Lavoura aptidao regular", valor: 54042.56 },
      { uso: "Lavoura aptidao restrita", valor: 42665.18 },
      { uso: "Pastagem plantada", valor: 31287.8 },
      { uso: "Silvicultura / pastagem natural", valor: 28443.46 },
      { uso: "Preservacao da fauna e flora", valor: 11377.38 }
    ]
  },
  {
    cidade: "Tomazina",
    atualizadoEm: "2025",
    fonte: "https://www.tomazina.pr.gov.br/itr",
    rows: [
      { uso: "Lavoura aptidao boa", valor: 54219.76 },
      { uso: "Lavoura aptidao regular", valor: 46209.96 },
      { uso: "Lavoura aptidao restrita", valor: 34657.46 },
      { uso: "Pastagem plantada", valor: 34657.46 },
      { uso: "Silvicultura / pastagem natural", valor: 23104.99 },
      { uso: "Preservacao da fauna e flora", valor: 10653.85 }
    ]
  },
  {
    cidade: "Jaguariaiva",
    atualizadoEm: "09/04/2025",
    fonte: "https://www.jaguariaiva.pr.gov.br/index.php/estrutura-de-governo/secretarias/sefip/6456-jaguariaiva-atualiza-valores-de-terra-nua-para-o-itr-2025",
    rows: [
      { uso: "Lavoura aptidao boa", valor: 39681.16 },
      { uso: "Lavoura aptidao regular", valor: 35841.03 },
      { uso: "Lavoura aptidao restrita", valor: 25600.74 },
      { uso: "Pastagem plantada", valor: 23040.67 },
      { uso: "Silvicultura / pastagem natural", valor: 21760.63 },
      { uso: "Preservacao da fauna e flora", valor: 8400 }
    ]
  },
  {
    cidade: "Wenceslau Braz",
    atualizadoEm: "2025",
    fonte: deral2025Source,
    rows: [
      { uso: "A-II", valor: 112700 },
      { uso: "A-III", valor: 88100 },
      { uso: "A-IV", valor: 69000 },
      { uso: "B-VI", valor: 48200 },
      { uso: "B-VII", valor: 37000 },
      { uso: "C-VIII", valor: 18300 }
    ]
  },
  {
    cidade: "Santana do Itarare",
    atualizadoEm: "2025",
    fonte: deral2025Source,
    rows: [
      { uso: "A-III", valor: 73600 },
      { uso: "A-IV", valor: 55500 },
      { uso: "B-VI", valor: 43300 },
      { uso: "B-VII", valor: 34500 },
      { uso: "C-VIII", valor: 15900 }
    ]
  },
  {
    cidade: "Santo Antonio da Platina",
    atualizadoEm: "2025",
    fonte: deral2025Source,
    rows: [
      { uso: "A-II", valor: 112800 },
      { uso: "A-III", valor: 83900 },
      { uso: "A-IV", valor: 69800 },
      { uso: "B-VI", valor: 50300 },
      { uso: "B-VII", valor: 38800 },
      { uso: "C-VIII", valor: 17400 }
    ]
  },
  {
    cidade: "Ribeirao do Pinhal",
    atualizadoEm: "2025",
    fonte: deral2025Source,
    rows: [
      { uso: "A-I", valor: 154800 },
      { uso: "A-II", valor: 116900 },
      { uso: "A-III", valor: 86200 },
      { uso: "A-IV", valor: 72400 },
      { uso: "B-VI", valor: 59100 },
      { uso: "B-VII", valor: 47200 },
      { uso: "C-VIII", valor: 15800 }
    ]
  }
];

export default function ValoresPage() {
  const [quotes, setQuotes] = useState([]);
  const [quotesError, setQuotesError] = useState("");
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [arroba, setArroba] = useState({ price: null, date: null, error: "" });

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        setQuotesLoading(true);
        setQuotesError("");
        const res = await fetch("/api/quotes", { cache: "no-store" });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setQuotes(data.quotes || []);
      } catch (_error) {
        setQuotesError("Nao foi possivel atualizar as cotacoes agora.");
        setQuotes([]);
      } finally {
        setQuotesLoading(false);
      }
    };

    const loadArroba = async () => {
      try {
        const res = await fetch("/api/arroba", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || `Status ${res.status}`);
        setArroba({ price: data.price, date: data.date, source: data.source, error: "" });
      } catch (_error) {
        setArroba({ price: null, date: null, error: "Nao foi possivel obter o preco da arroba agora." });
      }
    };

    loadQuotes();
    loadArroba();
  }, []);

  return (
    <main className="container-main space-y-10 py-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-700">Mercado rural</p>
        <h1 className="font-display text-4xl text-brand-900">Valores de referencia</h1>
        <p className="text-slate-600">Base oficial de terra nua e indicadores para apoiar negociacoes na regiao de Ibaiti e Norte Pioneiro do Parana.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Terra nua (R$/ha)</p>
            <h2 className="font-display text-2xl text-brand-900">VTN oficial por cidade</h2>
            <p className="text-sm text-slate-600">Valores de 2025 publicados por prefeituras da regiao e, onde faltava tabela municipal completa, pela planilha oficial SEAB/DERAL.</p>
          </div>

          <div className="space-y-4">
            {cityBands.map((city) => (
              <div key={city.cidade} className="rounded-2xl border border-brand-100">
                <div className="flex items-center justify-between bg-brand-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-brand-900">{city.cidade}</p>
                    <p className="text-xs text-slate-600">Atualizado em {city.atualizadoEm}</p>
                  </div>
                  <span className="text-xs text-slate-600">VTN 2025</span>
                </div>

                <table className="min-w-full divide-y divide-brand-100 text-sm">
                  <thead className="bg-white text-left text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">
                    <tr>
                      <th className="px-4 py-2">Uso</th>
                      <th className="px-4 py-2">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100">
                    {city.rows.map((row) => (
                      <tr key={row.uso} className="bg-white">
                        <td className="px-4 py-2 font-medium text-brand-900">{row.uso}</td>
                        <td className="px-4 py-2 text-slate-700">{formatMoney(row.valor, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t border-brand-100 bg-white px-4 py-3">
                  <a href={city.fonte} target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand-700 underline underline-offset-2">
                    Ver fonte oficial do municipio
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500">Essa base e fiscal, nao uma media fechada de compra e venda. O negocio real varia com acesso, relevo, agua, benfeitorias e produtividade. Classes A-I a C-VIII seguem a classificacao oficial da SEAB/DERAL.</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Boi gordo (arroba)</p>
            {arroba.error ? (
              <p className="text-sm text-red-600">{arroba.error}</p>
            ) : (
              <>
                <p className="text-4xl font-display text-brand-900">{arroba.price ? formatMoney(arroba.price, 2) : "-"}</p>
                <p className="text-sm text-slate-600">Indicador CEPEA (Sao Paulo) em R$/@</p>
                {arroba.date && <p className="text-xs text-slate-500">Data: {arroba.date}</p>}
              </>
            )}
          </div>

          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Cotacoes agricolas</p>
                <h3 className="font-display text-xl text-brand-900">Graos, cambio e commodities</h3>
              </div>
              {quotesError && <span className="text-xs text-amber-700">{quotesError}</span>}
            </div>
            <div className="mt-3 grid gap-3">
              {quotesLoading && <p className="text-sm text-slate-600">Atualizando cotacoes...</p>}
              {!quotesLoading &&
                quotes.map((quote) => (
                  <div key={quote.symbol} className="flex items-center justify-between rounded-xl border border-brand-100 bg-brand-50/60 px-3 py-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">{quote.label}</p>
                      <p className="text-sm text-slate-600">{quote.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-brand-900">{formatMoney(quote.price, 2)}</p>
                      <p className={`text-xs ${quote.change >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                        {quote.change >= 0 ? "+" : ""}
                        {quote.pct.toFixed(2)}% no dia
                      </p>
                    </div>
                  </div>
                ))}
              {!quotesLoading && !quotes.length && !quotesError && <p className="text-sm text-slate-600">Sem dados agora.</p>}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
