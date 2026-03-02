"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await adminLogin({ email, password });
      localStorage.setItem("adminToken", data.token);
      router.push("/admin/imoveis");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="container-main py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-brand-100 bg-white p-8 shadow-lg shadow-brand-900/5">
        <h1 className="font-display text-3xl text-brand-900">Login Admin</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            className="w-full rounded-xl border border-brand-100 px-4 py-3"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            className="w-full rounded-xl border border-brand-100 px-4 py-3"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="w-full rounded-xl bg-brand-700 px-4 py-3 font-semibold text-white">Entrar</button>
        </form>
      </div>
    </main>
  );
}

