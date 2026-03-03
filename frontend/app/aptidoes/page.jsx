"use client";

import { useMemo, useState } from "react";

const cidadeData = [
  { cidade: "Ibaiti", distanciaKm: 0, foco: ["Lavoura de grãos", "Integração"], fatores: "Solo fértil, logística para silos e insumos." },
  { cidade: "Tomazina", distanciaKm: 35, foco: ["Pasto formado", "Reflorestamento"], fatores: "Topografia suave, custo competitivo para florestas." },
  { cidade: "Wenceslau Braz", distanciaKm: 40, foco: ["Pasto", "Fruticultura"], fatores: "Altitude favorece fruticultura e pastagens." },
  { cidade: "Siqueira Campos", distanciaKm: 32, foco: ["Grãos", "Leite"], fatores: "Área agrícola consolidada e bacia leiteira regional." },
  { cidade: "Jaboti", distanciaKm: 28, foco: ["Pecuária de corte", "Pasto"], fatores: "Áreas médias com vocação para pecuária extensiva." },
  { cidade: "Pinhalão", distanciaKm: 22, foco: ["Café", "Pasto"], fatores: "Pequenas propriedades, café e pastagens." },
  { cidade: "Joaquim Távora", distanciaKm: 18, foco: ["Reflorestamento", "Pasto"], fatores: "Relevo e custo favorecem florestal e pecuária." },
  { cidade: "Arapoti", distanciaKm: 60, foco: ["Leite", "Lavoura"], fatores: "Cooperativas fortes de leite e suporte a grãos." },
  { cidade: "Sengés", distanciaKm: 50, foco: ["Florestal", "Pasto"], fatores: "Vocação pinus/eucalipto e pastagens." },
  { cidade: "Curiúva", distanciaKm: 70, foco: ["Grãos", "Reflorestamento"], fatores: "Milho/soja e base florestal." },
  { cidade: "Ventania", distanciaKm: 70, foco: ["Reflorestamento", "Mista"], fatores: "Topografia variada para madeira e uso misto." },
  { cidade: "Piraí do Sul", distanciaKm: 85, foco: ["Lavoura", "Florestal"], fatores: "Eixo Campos Gerais, soja/milho e madeira." },
  { cidade: "Jaguariaíva", distanciaKm: 95, foco: ["Mista", "Florestal"], fatores: "Áreas onduladas com custo menor." },
  { cidade: "Carlópolis", distanciaKm: 60, foco: ["Fruticultura", "Turismo represa"], fatores: "Uvas/caqui e atrativos da represa." },
  { cidade: "Santo Antônio da Platina", distanciaKm: 65, foco: ["Café", "Serviços agro"], fatores: "Pólo regional de serviços e café." },
  { cidade: "Jacarezinho", distanciaKm: 90, foco: ["Grãos", "Pecuária"], fatores: "Área agrícola ampla, integração." },
  { cidade: "Ribeirão do Pinhal", distanciaKm: 75, foco: ["Café", "Grãos"], fatores: "Tradição cafeeira e expansão de grãos." },
  { cidade: "Ortigueira", distanciaKm: 90, foco: ["Florestal", "Papel/Celulose"], fatores: "Pólo de base florestal e indústria de papel." },
  { cidade: "Castro", distanciaKm: 100, foco: ["Leite", "Grãos"], fatores: "Cooperativas leiteiras e soja/milho." },
  { cidade: "Japira", distanciaKm: 95, foco: ["Avicultura", "Agricultura familiar"], fatores: "Pequenas propriedades com frango de corte e cultivo diversificado." }
];

// Dataset para gráfico de receita/produção por cidade (valores ilustrativos em R$ mi ou volume)
const producaoData = [
  { cidade: "Arapoti", indicador: "Leite (cooperativas)", valor: 126, unidade: "milhões litros" },
  { cidade: "Castro", indicador: "Leite + grãos", valor: 120, unidade: "índice" },
  { cidade: "Ibaiti", indicador: "Grãos + pinus", valor: 90, unidade: "índice" },
  { cidade: "Sengés", indicador: "Florestal", valor: 75, unidade: "índice" },
  { cidade: "Jacarezinho", indicador: "Grãos/pecuária", valor: 65, unidade: "índice" },
  { cidade: "Santo Antônio da Platina", indicador: "Café + serviços agro", valor: 55, unidade: "índice" },
  { cidade: "Japira", indicador: "Avicultura / agricultura familiar", valor: 45, unidade: "índice" }
];

export default function AptidoesPage() {
  const [raio, setRaio] = useState(100);
  const [cidadeSel, setCidadeSel] = useState("");

  const lista = useMemo(
    () =>
      cidadeData.filter(
        (c) => c.distanciaKm <= raio && (!cidadeSel || c.cidade === cidadeSel)
      ),
    [raio, cidadeSel]
  );

  return (
    <main className="container-main space-y-8 py-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-700">Aptidoes por cidade</p>
        <h1 className="font-display text-4xl text-brand-900">O que cada região faz melhor</h1>
        <p className="text-slate-600">Visão rápida para orientar compra e avaliação. Dados qualitativos; refine com laudo técnico.</p>
      </header>

      <section className="grid gap-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold text-brand-700">Raio a partir de Ibaiti</p>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={raio}
            onChange={(e) => setRaio(Number(e.target.value))}
            className="w-full accent-brand-700"
          />
          <p className="text-sm text-slate-600">Mostrando cidades até {raio} km.</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-700">Filtrar por cidade</p>
          <select
            className="w-full rounded-xl border border-brand-100 px-3 py-2"
            value={cidadeSel}
            onChange={(e) => setCidadeSel(e.target.value)}
          >
            <option value="">Todas</option>
            {cidadeData.map((c) => (
              <option key={c.cidade}>{c.cidade}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-brand-700">Total exibido</p>
          <p className="text-2xl font-display text-brand-900">{lista.length} cidades</p>
          <p className="text-xs text-slate-600">Dentro do raio e filtros.</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {lista.map((c) => (
          <article key={c.cidade} className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
              {c.cidade} · {c.distanciaKm} km
            </p>
            <p className="mt-2 text-lg font-semibold text-brand-900">Aptidões fortes</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {c.foco.map((f) => (
                <span key={f} className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-800 border border-brand-100">
                  {f}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-slate-600">{c.fatores}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Produção / Receita estimada</p>
            <h2 className="font-display text-2xl text-brand-900">O que gira mais receita por cidade</h2>
            <p className="text-slate-600 text-sm">Dados ilustrativos; substitua pelos números reais quando disponíveis.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <svg className="h-72 min-w-full" viewBox={`0 0 ${producaoData.length * 140} 300`} role="img" aria-label="Receita ou produção por cidade">
            {producaoData.map((item, idx) => {
              const barWidth = 70;
              const gap = 70;
              const x = idx * (barWidth + gap);
              const maxVal = Math.max(...producaoData.map((d) => d.valor), 1);
              const height = (item.valor / maxVal) * 200;
              const y = 230 - height;
              return (
                <g key={item.cidade + item.indicador + idx} transform={`translate(${x},0)`}>
                  <rect x="0" y={y} width={barWidth} height={height} rx="10" className="fill-[#3a8e8e] opacity-90" />
                  <text x={barWidth / 2} y={y - 8} textAnchor="middle" className="fill-brand-900 text-[12px] font-semibold">
                    {item.valor}
                  </text>
                  <text x={barWidth / 2} y="248" textAnchor="middle" className="fill-slate-700 text-[12px] font-semibold">
                    {item.cidade}
                  </text>
                  <text x={barWidth / 2} y="266" textAnchor="middle" className="fill-slate-500 text-[11px]">
                    {item.indicador}
                  </text>
                </g>
              );
            })}
            <line x1="0" y1="230" x2={producaoData.length * 140} y2="230" className="stroke-brand-100" strokeWidth="1" />
          </svg>
        </div>
      </section>

      <section className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
        <h2 className="font-display text-2xl text-brand-900">Proximo passo</h2>
        <p className="text-slate-600">Quer um laudo ou números reais? Envie suas comparáveis que atualizamos a página.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href="https://wa.me/5543999999999"
            className="rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white"
            target="_blank"
            rel="noreferrer"
          >
            Falar no WhatsApp
          </a>
          <a
            href="mailto:contato@imobiliariaibaiti.com"
            className="rounded-xl border border-brand-800 px-4 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-50"
          >
            Enviar planilha
          </a>
        </div>
      </section>
    </main>
  );
}
