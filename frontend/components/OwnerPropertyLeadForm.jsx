"use client";

import { useState } from "react";
import { getWhatsAppLink } from "@/lib/format";

const initialForm = {
  name: "",
  phone: "",
  city: "",
  propertyType: "",
  areaSize: "",
  documentStatus: "Sim",
  priceExpectation: "",
  description: ""
};

export default function OwnerPropertyLeadForm() {
  const [form, setForm] = useState(initialForm);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const text = [
      "Ola! Quero cadastrar meu imovel para atendimento da Imobiliaria Ibaiti.",
      `Nome: ${form.name}`,
      `WhatsApp: ${form.phone}`,
      `Cidade / regiao: ${form.city}`,
      `Tipo do imovel: ${form.propertyType}`,
      `Area: ${form.areaSize}`,
      `Documentacao em dia: ${form.documentStatus}`,
      `Valor esperado: ${form.priceExpectation || "Nao informado"}`,
      `Descricao do imovel: ${form.description}`
    ].join("\n");

    window.open(getWhatsAppLink(text), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-lg shadow-brand-900/5 sm:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Cadastre seu imovel</p>
        <h1 className="font-display text-3xl text-brand-900 sm:text-4xl">Envie os dados para o nosso time</h1>
        <p className="text-sm text-slate-600">Seu imovel nao entra no site automaticamente. Primeiro recebemos no WhatsApp, avaliamos a documentacao e seguimos o atendimento com voce.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Seu nome"
          className="w-full rounded-xl border border-brand-100 px-4 py-3"
        />
        <input
          required
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="Seu WhatsApp"
          className="w-full rounded-xl border border-brand-100 px-4 py-3"
        />
        <input
          required
          value={form.city}
          onChange={(event) => updateField("city", event.target.value)}
          placeholder="Cidade / regiao do imovel"
          className="w-full rounded-xl border border-brand-100 px-4 py-3"
        />
        <input
          required
          value={form.propertyType}
          onChange={(event) => updateField("propertyType", event.target.value)}
          placeholder="Tipo do imovel"
          className="w-full rounded-xl border border-brand-100 px-4 py-3"
        />
        <input
          required
          value={form.areaSize}
          onChange={(event) => updateField("areaSize", event.target.value)}
          placeholder="Area total"
          className="w-full rounded-xl border border-brand-100 px-4 py-3"
        />
        <input
          value={form.priceExpectation}
          onChange={(event) => updateField("priceExpectation", event.target.value)}
          placeholder="Valor esperado"
          className="w-full rounded-xl border border-brand-100 px-4 py-3"
        />
        <label className="space-y-2 md:col-span-2">
          <span className="block text-sm font-semibold text-brand-900">Documentacao esta em dia?</span>
          <select
            value={form.documentStatus}
            onChange={(event) => updateField("documentStatus", event.target.value)}
            className="w-full rounded-xl border border-brand-100 px-4 py-3"
          >
            <option>Sim</option>
            <option>Nao</option>
            <option>Preciso de ajuda para verificar</option>
          </select>
        </label>
        <textarea
          required
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Descreva o imovel: localizacao, aptidao, benfeitorias, acesso, agua, producao, etc."
          className="h-36 w-full rounded-xl border border-brand-100 px-4 py-3 md:col-span-2"
        />
      </div>

      <button className="w-full rounded-xl bg-brand-700 px-4 py-3 font-semibold text-white">Enviar cadastro no WhatsApp</button>
    </form>
  );
}
