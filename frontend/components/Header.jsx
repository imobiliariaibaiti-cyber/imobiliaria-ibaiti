import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-brand-100/60 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-2xl text-brand-900">
          Imobiliária Ibaiti
        </Link>
        <div className="flex gap-5 text-sm font-semibold text-brand-800">
          <Link href="/">Home</Link>
          <Link href="/imoveis">Imóveis</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </nav>
    </header>
  );
}

