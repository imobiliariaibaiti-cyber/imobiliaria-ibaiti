"use client";

import { useEffect, useState } from "react";
import { getComments, postComment } from "@/lib/api";

export default function Comments({ propertyId }) {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: "", text: "", rating: 5, contact: "" });
  const [sending, setSending] = useState(false);

  const load = () => getComments(propertyId).then((data) => setComments(Array.isArray(data) ? data : []));

  useEffect(() => {
    load();
  }, [propertyId]);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    await postComment(propertyId, form).catch(() => null);
    setForm({ name: "", text: "", rating: 5, contact: "" });
    setSending(false);
    load();
  };

  return (
    <div className="rounded-3xl border border-brand-100 bg-white p-5 space-y-4 shadow-sm">
      <h3 className="font-semibold text-brand-900">Comentários</h3>

      <form className="space-y-2" onSubmit={submit}>
        <input
          required
          placeholder="Seu nome"
          className="w-full rounded-lg border px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Contato (email/WhatsApp) - opcional"
          className="w-full rounded-lg border px-3 py-2"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
        />
        <textarea
          required
          placeholder="Como foi sua experiência?"
          className="w-full rounded-lg border px-3 py-2"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
        />
        <button
          disabled={sending}
          className="w-full rounded-lg bg-brand-700 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending ? "Enviando..." : "Enviar (será moderado)"}
        </button>
      </form>

      {comments.length === 0 && <p className="text-sm text-slate-600">Seja o primeiro a comentar.</p>}

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="rounded-xl border border-brand-100 p-3">
            <p className="font-semibold text-brand-800">{c.name}</p>
            <p className="text-sm text-slate-700">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
