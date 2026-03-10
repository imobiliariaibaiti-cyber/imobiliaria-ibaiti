"use client";

import { useState } from "react";
import { getWhatsAppLink } from "@/lib/format";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const text = `Ola, sou ${name}. Telefone: ${phone}. Mensagem: ${message}`;
    window.open(getWhatsAppLink(text), "_blank");
  };

  return (
    <form onSubmit={submit} className="panel-card space-y-4 p-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Contato rapido</p>
        <h3 className="font-display text-2xl text-brand-900">Fale com um especialista</h3>
      </div>
      <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" className="w-full rounded-xl border border-brand-100 bg-white px-4 py-3 focus:border-accent-300 focus:outline-none" />
      <input required value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="WhatsApp" className="w-full rounded-xl border border-brand-100 bg-white px-4 py-3 focus:border-accent-300 focus:outline-none" />
      <textarea required value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Como podemos ajudar?" className="h-28 w-full rounded-xl border border-brand-100 bg-white px-4 py-3 focus:border-accent-300 focus:outline-none" />
      <button className="btn-accent w-full">Enviar no WhatsApp</button>
    </form>
  );
}
