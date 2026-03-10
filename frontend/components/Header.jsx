"use client";

import { useState } from "react";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/planos", label: "Planos" },
  { href: "/valores", label: "Valores" },
  { href: "/aptidoes", label: "Aptidoes" },
  { href: "/imoveis", label: "Imoveis" },
  { href: "/anuncie-seu-imovel", label: "Anuncie seu imovel", emphasis: true }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100/70 bg-white/85 backdrop-blur">
      <nav className="relative mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="order-1 whitespace-nowrap font-display text-base text-brand-900 sm:text-xl md:text-2xl" onClick={close}>
          Imobiliaria Ibaiti
        </Link>

        <button
          aria-label="Abrir menu"
          onClick={() => setOpen((value) => !value)}
          className="order-2 ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-100 bg-white text-brand-900 sm:hidden"
        >
          <span className="h-0.5 w-6 bg-brand-900" />
        </button>

        <div className="order-3 hidden flex-1 items-center justify-end gap-3 text-sm font-semibold sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.emphasis
                  ? "btn-accent px-4 py-2 text-sm"
                  : "rounded-lg px-3 py-2 text-brand-800 transition hover:bg-brand-50 hover:text-brand-900"
              }
            >
              {item.label}
            </Link>
          ))}
        </div>

        {open && (
          <div className="absolute right-4 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-lg sm:hidden">
            <div className="flex flex-col gap-1 p-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    item.emphasis
                      ? "btn-accent text-sm"
                      : "rounded-xl px-4 py-3 text-sm font-semibold text-brand-900 hover:bg-brand-50"
                  }
                  onClick={close}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
