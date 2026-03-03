"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";

export default function ConsorcioSimulator({ value }) {
  // Parâmetros alinhados ao simulador de Consórcio Imobiliário CAIXA (adm ~16%, fundo reserva ~3%, sem juros)
  const [entrada, setEntrada] = useState(0);
  const [prazo, setPrazo] = useState(150); // CAIXA: até 150 meses no consórcio imobiliário
  const [taxaAdm, setTaxaAdm] = useState(0.16);
  const [fundoReserva, setFundoReserva] = useState(0.03);
  const [seguroMensal, setSeguroMensal] = useState(0);

  const parcela = useMemo(() => {
    const base = Math.max(0, Number(value || 0) - Number(entrada || 0));
    const prazoVal = Math.min(150, Math.max(1, Number(prazo || 1))); // limite CAIXA
    const adm = Math.max(0, Number(taxaAdm || 0));
    const fundo = Math.max(0, Number(fundoReserva || 0));
    return (base * (1 + adm + fundo)) / prazoVal + Number(seguroMensal || 0);
  }, [value, entrada, prazo, taxaAdm, fundoReserva, seguroMensal]);

  return (
    <div className="rounded-3xl border border-brand-100 bg-white p-5 space-y-3 shadow-sm">
      <h3 className="font-semibold text-brand-900">Simule consórcio (base CAIXA)</h3>
      <p className="text-xs text-slate-600">
        Cálculo aproximado seguindo o consórcio imobiliário CAIXA: carta sem juros, taxa adm. {Math.round(taxaAdm * 100)}%, fundo reserva{" "}
        {Math.round(fundoReserva * 100)}%, seguro opcional. Prazo máximo de 150 meses.
      </p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <label className="space-y-1">
          <span>Entrada (R$)</span>
          <input
            type="number"
            className="w-full rounded-lg border px-3 py-2"
            value={entrada}
            onChange={(e) => setEntrada(Number(e.target.value) || 0)}
          />
        </label>
        <label className="space-y-1">
          <span>Prazo (meses)</span>
          <input
            type="number"
            className="w-full rounded-lg border px-3 py-2"
            min={12}
            max={150}
            value={prazo}
            onChange={(e) => setPrazo(Math.min(150, Number(e.target.value) || 1))}
          />
        </label>
        <label className="space-y-1">
          <span>Taxa adm. (%)</span>
          <input
            type="number"
            step="0.01"
            className="w-full rounded-lg border px-3 py-2"
            value={taxaAdm}
            onChange={(e) => setTaxaAdm(Number(e.target.value) || 0)}
          />
        </label>
        <label className="space-y-1">
          <span>Fundo reserva (%)</span>
          <input
            type="number"
            step="0.01"
            className="w-full rounded-lg border px-3 py-2"
            value={fundoReserva}
            onChange={(e) => setFundoReserva(Number(e.target.value) || 0)}
          />
        </label>
        <label className="space-y-1">
          <span>Seguro mensal (R$)</span>
          <input
            type="number"
            step="0.01"
            className="w-full rounded-lg border px-3 py-2"
            value={seguroMensal}
            onChange={(e) => setSeguroMensal(Number(e.target.value) || 0)}
          />
        </label>
      </div>
      <p className="text-sm text-slate-700">
        Parcela estimada: <strong className="text-brand-800">{formatPrice(parcela)}</strong>
      </p>
      <a
        href={process.env.NEXT_PUBLIC_WHATSAPP ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}` : "#"}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white"
      >
        Falar com especialista
      </a>
    </div>
  );
}
