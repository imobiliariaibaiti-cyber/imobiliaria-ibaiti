"use client";

import { useState } from "react";
import { getWhatsAppLink } from "@/lib/format";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const text = `Olá, sou ${name}. Telefone: ${phone}. Mensagem: ${message}`;
    window.open(getWhatsAppLink(text), "_blank");
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-3xl border border-brand-100 bg-white p-6 shadow-lg shadow-brand-900/5">
      <h3 className="font-display text-2xl text-brand-900">Fale com Especialista</h3>
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome"
        className="w-full rounded-xl border border-brand-100 px-4 py-3"
      />
      <input
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="WhatsApp"
        className="w-full rounded-xl border border-brand-100 px-4 py-3"
      />
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Como podemos ajudar?"
        className="h-28 w-full rounded-xl border border-brand-100 px-4 py-3"
      />
      <button className="w-full rounded-xl bg-brand-700 px-4 py-3 font-semibold text-white">Enviar no WhatsApp</button>
    </form>
  );
}

