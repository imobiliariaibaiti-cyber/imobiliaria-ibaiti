"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clientRequest, uploadClientImages } from "@/lib/api";
import { formatPrice } from "@/lib/format";

const initialForm = {
  id: null,
  title: "",
  type: "Fazenda",
  city: "",
  address: "",
  latitude: "",
  longitude: "",
  areaSize: "",
  priceExpectation: "",
  description: "",
  documentStatus: "Documentacao em dia",
  deedAndRegistryOk: true,
  videoUrl: "",
  images: []
};

const statusLabels = {
  DRAFT: "Rascunho",
  PENDING_REVIEW: "Pendente de analise",
  IN_REVIEW: "Em analise",
  APPROVED: "Aprovado",
  REJECTED: "Reprovado"
};

const statusClasses = {
  DRAFT: "bg-brand-50 text-brand-800",
  PENDING_REVIEW: "bg-signal-50 text-signal-800",
  IN_REVIEW: "bg-accent-50 text-accent-800",
  APPROVED: "bg-emerald-50 text-emerald-800",
  REJECTED: "bg-red-50 text-red-700"
};

export default function ClientDashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  const loadDashboard = async (jwt) => {
    const [me, myProperties] = await Promise.all([
      clientRequest("/client/me", jwt, { method: "GET" }),
      clientRequest("/client/properties", jwt, { method: "GET" })
    ]);

    setUser(me);
    setProperties(myProperties);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("clientToken") || "";
    if (!jwt) {
      router.replace("/cliente");
      return;
    }

    setToken(jwt);
    loadDashboard(jwt).catch((err) => {
      setError(err.message);
    });
  }, [router]);

  const resetForm = () => {
    setForm(initialForm);
    setFiles([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      let uploadedImages = Array.isArray(form.images) ? form.images : [];

      if (files.length > 0) {
        const uploaded = await uploadClientImages(files, token);
        uploadedImages = [...uploadedImages, ...uploaded.urls];
      }

      const payload = {
        title: form.title,
        type: form.type,
        city: form.city,
        address: form.address,
        latitude: form.latitude,
        longitude: form.longitude,
        areaSize: form.areaSize,
        priceExpectation: form.priceExpectation,
        description: form.description,
        documentStatus: form.documentStatus,
        deedAndRegistryOk: form.deedAndRegistryOk,
        images: uploadedImages,
        videoUrl: form.videoUrl
      };

      if (isEditing) {
        await clientRequest(`/client/properties/${form.id}`, token, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        setSuccess("Imovel atualizado e reenviado para analise.");
      } else {
        await clientRequest("/client/properties", token, {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setSuccess("Imovel cadastrado com sucesso.");
      }

      resetForm();
      await loadDashboard(token);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (property) => {
    setForm({
      ...property,
      priceExpectation: property.priceExpectation ? String(property.priceExpectation) : "",
      latitude: property.latitude ?? "",
      longitude: property.longitude ?? "",
      images: Array.isArray(property.images) ? property.images : []
    });
    setFiles([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const logout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientUser");
    router.push("/cliente");
  };

  return (
    <main className="container-main space-y-8 py-10">
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-brand-100 bg-[radial-gradient(circle_at_top_left,#d7eadf,transparent_30%),linear-gradient(135deg,#fffdf9,#eef6f1)] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-700">Painel do cliente</p>
          <h1 className="mt-3 font-display text-4xl text-brand-900">Ola{user?.name ? `, ${user.name}` : ""}</h1>
          <p className="mt-3 text-slate-700">
            Aqui voce cadastra seus imoveis, sobe fotos e acompanha o que ja esta pendente ou em analise pela equipe da imobiliaria.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-100 bg-white/85 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Conta</p>
              <p className="mt-2 text-sm text-slate-700">{user?.email || "Carregando..."}</p>
            </div>
            <div className="rounded-2xl border border-brand-100 bg-white/85 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Imoveis cadastrados</p>
              <p className="mt-2 text-sm text-slate-700">{properties.length}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={logout} className="btn-secondary">
              Sair
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="panel-card grid gap-3 p-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">{isEditing ? "Editar imovel" : "Novo imovel"}</p>
            <h2 className="mt-2 font-display text-3xl text-brand-900">Cadastre seu imovel</h2>
          </div>

          <input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Titulo do imovel" className="w-full rounded-xl border border-brand-100 px-4 py-3" />
          <select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} className="w-full rounded-xl border border-brand-100 px-4 py-3">
            <option value="Fazenda">Fazenda</option>
            <option value="Sitio">Sitio</option>
            <option value="Chacara">Chacara</option>
            <option value="Casa">Casa</option>
            <option value="Lote">Lote</option>
          </select>
          <input required value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} placeholder="Cidade" className="w-full rounded-xl border border-brand-100 px-4 py-3" />
          <input value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} placeholder="Endereco / referencia" className="w-full rounded-xl border border-brand-100 px-4 py-3" />
          <input value={form.areaSize} onChange={(event) => setForm((current) => ({ ...current, areaSize: event.target.value }))} placeholder="Area total" className="w-full rounded-xl border border-brand-100 px-4 py-3" />
          <input value={form.priceExpectation} onChange={(event) => setForm((current) => ({ ...current, priceExpectation: event.target.value }))} placeholder="Valor esperado" className="w-full rounded-xl border border-brand-100 px-4 py-3" />
          <input value={form.latitude} onChange={(event) => setForm((current) => ({ ...current, latitude: event.target.value }))} placeholder="Latitude" className="w-full rounded-xl border border-brand-100 px-4 py-3" />
          <input value={form.longitude} onChange={(event) => setForm((current) => ({ ...current, longitude: event.target.value }))} placeholder="Longitude" className="w-full rounded-xl border border-brand-100 px-4 py-3" />
          <input value={form.videoUrl} onChange={(event) => setForm((current) => ({ ...current, videoUrl: event.target.value }))} placeholder="Video do YouTube (opcional)" className="w-full rounded-xl border border-brand-100 px-4 py-3 md:col-span-2" />
          <select value={form.documentStatus} onChange={(event) => setForm((current) => ({ ...current, documentStatus: event.target.value }))} className="w-full rounded-xl border border-brand-100 px-4 py-3 md:col-span-2">
            <option value="Documentacao em dia">Documentacao em dia</option>
            <option value="Precisa revisar documentacao">Precisa revisar documentacao</option>
            <option value="Preciso de ajuda com a documentacao">Preciso de ajuda com a documentacao</option>
          </select>
          <textarea required value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Descreva o imovel: acesso, agua, benfeitorias, aptidao, producao, etc." className="h-36 w-full rounded-xl border border-brand-100 px-4 py-3 md:col-span-2" />
          <input type="file" multiple accept="image/*" onChange={(event) => setFiles(Array.from(event.target.files || []))} className="w-full rounded-xl border border-brand-100 px-4 py-3 text-sm md:col-span-2" />
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" checked={form.deedAndRegistryOk} onChange={(event) => setForm((current) => ({ ...current, deedAndRegistryOk: event.target.checked }))} />
            Escritura e registro ok
          </label>
          {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
          {success && <p className="text-sm text-accent-700 md:col-span-2">{success}</p>}
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button className="btn-accent">{isEditing ? "Atualizar imovel" : "Cadastrar imovel"}</button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Meus imoveis</p>
          <h2 className="font-display text-3xl text-brand-900">Acompanhamento do cadastro</h2>
        </div>

        {properties.length === 0 ? (
          <div className="panel-card p-8 text-center text-slate-600">Voce ainda nao cadastrou nenhum imovel no painel.</div>
        ) : (
          <div className="grid gap-4">
            {properties.map((property) => (
              <article key={property.id} className="panel-card flex flex-wrap items-start justify-between gap-4 p-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-brand-900">{property.title}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[property.status] || "bg-brand-50 text-brand-800"}`}>
                      {statusLabels[property.status] || property.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {property.type} - {property.city} - {property.areaSize || "Area nao informada"}
                  </p>
                  {property.priceExpectation ? <p className="text-sm font-semibold text-brand-700">Valor esperado: {formatPrice(property.priceExpectation)}</p> : null}
                  <p className="text-sm text-slate-700">{property.documentStatus}</p>
                </div>

                <button type="button" onClick={() => handleEdit(property)} className="btn-secondary px-4 py-2 text-sm">
                  Editar
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
