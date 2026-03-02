"use client";

import { useEffect, useMemo, useState } from "react";
import { adminRequest, uploadImages } from "@/lib/api";
import { formatPrice } from "@/lib/format";

const initialForm = {
  id: null,
  title: "",
  type: "Fazenda",
  city: "",
  price: "",
  description: "",
  featured: false,
  images: ""
};

export default function AdminPropertiesPage() {
  const [token, setToken] = useState("");
  const [form, setForm] = useState(initialForm);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");
  const [imagesFiles, setImagesFiles] = useState([]);

  const editing = useMemo(() => Boolean(form.id), [form.id]);

  const loadProperties = async (jwt) => {
    const data = await adminRequest("/properties", jwt, { method: "GET" });
    setProperties(data);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("adminToken") || "";
    if (!jwt) {
      window.location.href = "/admin";
      return;
    }
    setToken(jwt);
    loadProperties(jwt).catch(() => {
      setError("Nao foi possivel carregar os imoveis agora. Verifique se o backend esta online.");
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      let urls = form.images
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (imagesFiles.length > 0) {
        const uploaded = await uploadImages(imagesFiles, token);
        urls = [...urls, ...uploaded.urls];
      }

      const payload = {
        title: form.title,
        type: form.type,
        city: form.city,
        price: Number(form.price),
        description: form.description,
        featured: form.featured,
        images: urls
      };

      if (editing) {
        await adminRequest(`/admin/properties/${form.id}`, token, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await adminRequest("/admin/properties", token, {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }

      setForm(initialForm);
      setImagesFiles([]);
      await loadProperties(token);
    } catch (err) {
      setError(err.message);
    }
  };

  const editProperty = (property) => {
    setForm({
      ...property,
      images: Array.isArray(property.images) ? property.images.join(", ") : ""
    });
  };

  const removeProperty = async (id) => {
    if (!confirm("Excluir este imóvel?")) return;
    try {
      await adminRequest(`/admin/properties/${id}`, token, { method: "DELETE" });
      await loadProperties(token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="container-main space-y-8 py-10">
      <div>
        <h1 className="font-display text-4xl text-brand-900">Painel de Imóveis</h1>
        <p className="text-slate-600">Cadastre, edite e destaque seus anúncios.</p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-3xl border border-brand-100 bg-white p-6 shadow-lg shadow-brand-900/5 md:grid-cols-2">
        <input className="rounded-xl border border-brand-100 px-4 py-3" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <select className="rounded-xl border border-brand-100 px-4 py-3" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option>Fazenda</option>
          <option>Sítio</option>
          <option>Chácara</option>
        </select>
        <input className="rounded-xl border border-brand-100 px-4 py-3" placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        <input className="rounded-xl border border-brand-100 px-4 py-3" type="number" placeholder="Preço" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <textarea className="rounded-xl border border-brand-100 px-4 py-3 md:col-span-2" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input className="rounded-xl border border-brand-100 px-4 py-3 md:col-span-2" placeholder="URLs das imagens (separadas por vírgula)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
        <input className="rounded-xl border border-brand-100 px-4 py-3 md:col-span-2" type="file" multiple accept="image/*" onChange={(e) => setImagesFiles(Array.from(e.target.files || []))} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Marcar como destaque
        </label>
        <button className="rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white md:justify-self-end">{editing ? "Atualizar" : "Cadastrar"}</button>
        {editing && (
          <button type="button" onClick={() => setForm(initialForm)} className="rounded-xl border border-brand-700 px-5 py-3 font-semibold text-brand-700 md:justify-self-end">
            Cancelar edição
          </button>
        )}
        {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
      </form>

      <section className="space-y-3">
        {properties.map((property) => (
          <article key={property.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-white p-4">
            <div>
              <h2 className="font-semibold text-brand-900">{property.title}</h2>
              <p className="text-sm text-slate-600">{property.type} - {property.city} - {formatPrice(property.price)}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => editProperty(property)} className="rounded-lg border border-brand-700 px-3 py-1 text-sm font-semibold text-brand-700">Editar</button>
              <button onClick={() => removeProperty(property.id)} className="rounded-lg bg-red-600 px-3 py-1 text-sm font-semibold text-white">Excluir</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

