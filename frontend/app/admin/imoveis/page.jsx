"use client";

import { useEffect, useMemo, useState } from "react";
import { adminRequest, uploadImages } from "@/lib/api";
import { formatPrice } from "@/lib/format";

const initialForm = {
  id: null,
  propertyCode: "",
  title: "",
  type: "Fazenda",
  city: "",
  address: "",
  latitude: "",
  longitude: "",
  areaSize: "",
  price: "",
  description: "",
  videoUrl: "",
  deedAndRegistryOk: false,
  featured: false,
  images: ""
};

const parseNumberLikeUserInput = (rawValue) => {
  const value = String(rawValue || "").trim().toLowerCase();
  if (!value) return NaN;

  const cleaned = value.replace(/r\$\s?/g, "").replace(/\s+/g, "");
  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");
  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");

  if (hasComma && hasDot) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? /\./g : /,/g;
    const normalized = cleaned.replace(thousandsSeparator, "").replace(decimalSeparator, ".");
    return Number(normalized);
  }

  if (hasComma || hasDot) {
    const separator = hasComma ? "," : ".";
    const parts = cleaned.split(separator);
    const hasThousands = parts.length > 2 || (parts.length === 2 && parts[1].length === 3);
    const normalized = hasThousands ? parts.join("") : cleaned.replace(separator, ".");
    return Number(normalized);
  }

  return Number(cleaned);
};

const parsePriceToNumber = (value) => {
  const source = String(value || "").trim().toLowerCase();
  if (!source) return NaN;

  const isMillion = /\bmi\b|milh(?:ao|oes|ão|ões)/.test(source);
  const isThousand = !isMillion && /\bmil\b/.test(source);
  const multiplier = isMillion ? 1_000_000 : isThousand ? 1_000 : 1;

  const numericPart = source.replace(/\bmi\b|\bmil\b|milh(?:ao|oes|ão|ões)/g, "").trim();
  const baseValue = parseNumberLikeUserInput(numericPart);
  if (!Number.isFinite(baseValue) || baseValue <= 0) return NaN;

  return Math.round(baseValue * multiplier);
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
        propertyCode: form.propertyCode,
        title: form.title,
        type: form.type,
        city: form.city,
        address: form.address,
        latitude: form.latitude,
        longitude: form.longitude,
        areaSize: form.areaSize,
        price: parsePriceToNumber(form.price),
        description: form.description,
        videoUrl: form.videoUrl,
        deedAndRegistryOk: form.deedAndRegistryOk,
        featured: form.featured,
        images: urls
      };

      if (!Number.isFinite(payload.price) || payload.price <= 0) {
        throw new Error("Preco invalido. Use exemplos: 580000, 580.000, 580 mil, 1.2 mi.");
      }

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
      propertyCode: property.propertyCode || "",
      address: property.address || "",
      latitude: property.latitude ?? "",
      longitude: property.longitude ?? "",
      areaSize: property.areaSize || "",
      videoUrl: property.videoUrl || "",
      deedAndRegistryOk: Boolean(property.deedAndRegistryOk),
      images: Array.isArray(property.images) ? property.images.join(", ") : ""
    });
  };

  const removeProperty = async (id) => {
    if (!confirm("Excluir este imovel?")) return;
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
        <h1 className="font-display text-4xl text-brand-900">Painel de Imoveis</h1>
        <p className="text-slate-600">Cadastre, edite e destaque seus anuncios.</p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 overflow-hidden rounded-3xl border border-brand-100 bg-white p-6 shadow-lg shadow-brand-900/5 md:grid-cols-2">
        <input className="w-full min-w-0 rounded-xl border border-brand-100 px-4 py-3" placeholder="Codigo do imovel (ex: IBT-001)" value={form.propertyCode} onChange={(e) => setForm({ ...form, propertyCode: e.target.value })} />
        <input className="w-full min-w-0 rounded-xl border border-brand-100 px-4 py-3" placeholder="Titulo" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <select className="w-full min-w-0 rounded-xl border border-brand-100 px-4 py-3" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="Fazenda">Fazenda</option>
          <option value="Casa">Casa</option>
          <option value="Sitio">Sítio</option>
          <option value="Chacara">Chácara</option>
          <option value="Lote">Lote</option>
        </select>
        <input className="w-full min-w-0 rounded-xl border border-brand-100 px-4 py-3" placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        <input className="w-full min-w-0 rounded-xl border border-brand-100 px-4 py-3" placeholder="Endereço (rua, nº, bairro)" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input className="w-full min-w-0 rounded-xl border border-brand-100 px-4 py-3" placeholder="Latitude (ex: -23.847)" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
        <input className="w-full min-w-0 rounded-xl border border-brand-100 px-4 py-3" placeholder="Longitude (ex: -50.193)" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
        <input className="w-full min-w-0 rounded-xl border border-brand-100 px-4 py-3" placeholder="Tamanho da area (ex: 21.200 m2)" value={form.areaSize} onChange={(e) => setForm({ ...form, areaSize: e.target.value })} />
        <input className="w-full min-w-0 rounded-xl border border-brand-100 px-4 py-3" type="text" placeholder="Preco (ex: 580.000 | 580 mil | 1.2 mi)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <textarea className="w-full min-w-0 rounded-xl border border-brand-100 px-4 py-3 md:col-span-2" placeholder="Descricao" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input className="w-full min-w-0 rounded-xl border border-brand-100 px-4 py-3 md:col-span-2" placeholder="URL do video no YouTube (opcional)" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
        <input className="w-full min-w-0 rounded-xl border border-brand-100 px-4 py-3 md:col-span-2" placeholder="URLs das imagens (separadas por virgula)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
        <input className="w-full min-w-0 rounded-xl border border-brand-100 px-4 py-3 text-sm md:col-span-2" type="file" multiple accept="image/*" onChange={(e) => setImagesFiles(Array.from(e.target.files || []))} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Marcar como destaque
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.deedAndRegistryOk} onChange={(e) => setForm({ ...form, deedAndRegistryOk: e.target.checked })} />
          Escritura e registro ok
        </label>
        <button className="rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white md:justify-self-end">{editing ? "Atualizar" : "Cadastrar"}</button>
        {editing && (
          <button type="button" onClick={() => setForm(initialForm)} className="rounded-xl border border-brand-700 px-5 py-3 font-semibold text-brand-700 md:justify-self-end">
            Cancelar edicao
          </button>
        )}
        {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
      </form>

      <section className="space-y-3">
        {properties.map((property) => (
          <article key={property.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-white p-4">
            <div>
              <h2 className="font-semibold text-brand-900">{property.title}</h2>
              <p className="text-sm text-slate-600">
                {property.propertyCode ? `${property.propertyCode} - ` : ""}
                {property.type} - {property.city} - {formatPrice(property.price)}
              </p>
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
