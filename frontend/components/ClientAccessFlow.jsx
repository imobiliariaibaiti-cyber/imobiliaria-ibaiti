"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clientLogin, clientRegister } from "@/lib/api";

const initialRegisterForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  hasAccount: false
};

const initialLoginForm = {
  email: "",
  password: ""
};

export default function ClientAccessFlow() {
  const router = useRouter();
  const [step, setStep] = useState("welcome");
  const [hasAccount, setHasAccount] = useState(true);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const heading = useMemo(() => {
    if (step === "login") return "Entrar no painel do cliente";
    if (step === "register") return "Criar sua conta";
    return "Voce ja tem uma conta na Imobiliaria Ibaiti?";
  }, [step]);

  const saveSession = (data) => {
    localStorage.setItem("clientToken", data.token);
    localStorage.setItem("clientUser", JSON.stringify(data.user));
    router.push("/painel-do-cliente");
  };

  const handleContinue = () => {
    setError("");
    setStep(hasAccount ? "login" : "register");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await clientLogin(loginForm);
      saveSession(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await clientRegister({ ...registerForm, hasAccount });
      saveSession(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-main py-10">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-brand-100 bg-[#f4f4f6] shadow-lg shadow-brand-900/5">
        <div className="flex items-center justify-between border-b border-brand-100 bg-white px-6 py-5">
          <button type="button" onClick={() => (step === "welcome" ? router.push("/") : setStep("welcome"))} className="text-3xl leading-none text-brand-700">
            {"<"}
          </button>
          <p className="font-display text-2xl text-brand-900">Saudacoes</p>
          <div className="w-6" />
        </div>

        <div className="px-6 py-10 sm:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-brand-200 bg-[linear-gradient(135deg,#fffdf9,#f5e8cb)] font-display text-3xl text-brand-800 shadow-sm">
              IB
            </div>
            <h1 className="mt-6 font-display text-4xl leading-tight text-brand-900">{heading}</h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
              Painel para proprietarios cadastrarem o imovel, enviarem fotos e acompanharem o material em analise pela imobiliaria.
            </p>
          </div>

          {step === "welcome" && (
            <div className="mx-auto mt-10 max-w-3xl">
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setHasAccount(true)}
                  className={`rounded-full border px-6 py-5 text-xl font-medium transition ${hasAccount ? "border-accent-500 bg-accent-50 text-accent-800" : "border-brand-200 bg-white text-brand-800"}`}
                >
                  Ja tenho
                </button>
                <button
                  type="button"
                  onClick={() => setHasAccount(false)}
                  className={`rounded-full border px-6 py-5 text-xl font-medium transition ${!hasAccount ? "border-accent-500 bg-accent-50 text-accent-800" : "border-brand-200 bg-white text-brand-800"}`}
                >
                  Ainda nao
                </button>
              </div>

              <div className="mt-8 flex justify-end">
                <button type="button" onClick={handleContinue} className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-200 text-3xl text-brand-900 shadow-sm transition hover:bg-accent-300">
                  {">"}
                </button>
              </div>
            </div>
          )}

          {step === "login" && (
            <form onSubmit={handleLogin} className="mx-auto mt-10 max-w-xl rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
              <div className="space-y-3">
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="Seu e-mail"
                  className="w-full rounded-xl border border-brand-100 px-4 py-3"
                />
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Sua senha"
                  className="w-full rounded-xl border border-brand-100 px-4 py-3"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button className="btn-primary w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </div>
            </form>
          )}

          {step === "register" && (
            <form onSubmit={handleRegister} className="mx-auto mt-10 max-w-xl rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
              <div className="grid gap-3">
                <input
                  required
                  value={registerForm.name}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-brand-100 px-4 py-3"
                />
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="Seu e-mail"
                  className="w-full rounded-xl border border-brand-100 px-4 py-3"
                />
                <input
                  required
                  value={registerForm.phone}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="Seu WhatsApp"
                  className="w-full rounded-xl border border-brand-100 px-4 py-3"
                />
                <input
                  type="password"
                  required
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Crie uma senha"
                  className="w-full rounded-xl border border-brand-100 px-4 py-3"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button className="btn-accent w-full" disabled={loading}>
                  {loading ? "Criando conta..." : "Criar conta"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
