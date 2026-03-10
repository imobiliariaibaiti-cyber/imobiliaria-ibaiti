"use client";
import { useEffect, useState } from "react";
import { adminRequest } from "@/lib/api";
import StatCard from "@/components/StatCard";

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const jwt = localStorage.getItem("adminToken") || "";
    if (!jwt) {
      window.location.href = "/admin";
      return;
    }

    adminRequest("/admin/analytics/summary?days=30", jwt)
      .then(setSummary)
      .catch((err) => setError(err.message || "Não foi possível carregar os dados."));
  }, []);

  if (error) {
    return (
      <main className="container-main py-10">
        <p className="text-sm text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="container-main space-y-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-brand-900">Dashboard</h1>
          <p className="text-slate-600">Visitas e páginas mais vistas (últimos 30 dias)</p>
        </div>
        <a href="/admin/imoveis" className="rounded-lg border border-brand-700 px-3 py-2 text-sm font-semibold text-brand-700">
          Ir para imóveis
        </a>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Total de visitas" value={summary?.totalVisits ?? 0} helper="Em 30 dias" />
        <StatCard label="Imóvel mais visto" value={summary?.propertyViews?.[0]?.title || "Sem dados"} helper={`${summary?.propertyViews?.[0]?.views || 0} visitas`} />
        <StatCard label="Página mais vista" value={summary?.topPages?.[0]?.path || "Sem dados"} helper={`${summary?.topPages?.[0]?.views || 0} visitas`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-brand-900">Imóveis mais vistos</h3>
            <span className="text-xs text-slate-500">Últimos 30 dias</span>
          </div>
          <div className="mt-3 space-y-2">
            {(summary?.propertyViews || []).map((item) => (
              <div key={item.propertyId} className="rounded-xl border border-brand-100 bg-brand-50 px-3 py-2 text-sm">
                <div className="font-semibold text-brand-900">{item.title}</div>
                <div className="text-slate-600">{item.city}</div>
                <div className="text-slate-500">{item.views} visitas</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-brand-900">Páginas mais vistas</h3>
            <span className="text-xs text-slate-500">Últimos 30 dias</span>
          </div>
          <div className="mt-3 space-y-2">
            {(summary?.topPages || []).map((item) => (
              <div key={item.path} className="rounded-xl border border-brand-100 bg-brand-50 px-3 py-2 text-sm">
                <div className="font-semibold text-brand-900">{item.path}</div>
                <div className="text-slate-500">{item.views} visitas</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}


