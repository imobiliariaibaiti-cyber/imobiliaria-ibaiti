"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";

export default function ConsorcioSimulator({ value }) {
  const [entrada, setEntrada] = useState(0);
  const [prazo, setPrazo] = useState(180);
  const [taxaAdm, setTaxaAdm] = useState(0.18);

  const parcela = useMemo(() => {
    const base = Math.max(0, Number(value || 0) - Number(entrada || 0));
    const prazoVal = Math.max(1, Number(prazo || 1));
    const taxa = Math.max(0, Number(taxaAdm || 0));
    return (base * (1 + taxa)) / prazoVal;
  }, [value, entrada, prazo, taxaAdm]);

  return (
    <div className="rounded-3xl border border-brand-100 bg-white p-5 space-y-3 shadow-sm">
      <h3 className="font-semibold text-brand-900">Simule consórcio</h3>
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
            value={prazo}
            onChange={(e) => setPrazo(Number(e.target.value) || 1)}
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
