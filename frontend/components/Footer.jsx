import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/planos", label: "Planos" },
  { href: "/valores", label: "Valores" },
  { href: "/aptidoes", label: "Aptidoes" },
  { href: "/imoveis", label: "Imoveis" },
  { href: "/anuncie-seu-imovel", label: "Anuncie seu imovel" }
];

const socialLinks = [
  { href: "https://www.youtube.com/@imobiliariaibaiti", label: "YouTube", color: "text-red-200" },
  { href: "https://www.instagram.com/imobiliariaibaiti/", label: "Instagram", color: "text-pink-200" },
  { href: "https://www.facebook.com/imobiliariaibaiti", label: "Facebook", color: "text-blue-200" },
  { href: "https://www.tiktok.com/@imobiliariaibaiti", label: "TikTok", color: "text-slate-100" }
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-brand-100 bg-[linear-gradient(135deg,#2e2017,#223f30)] text-brand-50">
      <div className="container-main grid gap-8 py-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="font-display text-2xl">Imobiliaria Ibaiti</p>
          <p className="max-w-md text-sm text-brand-100">Especialistas em imoveis rurais em Ibaiti e regiao, com operacao comercial, captacao e divulgacao.</p>
          <div className="pt-2">
            <Link href="/planos" className="btn-soft text-sm">
              Conhecer planos
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-200">Links rapidos</p>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-200">Redes sociais</p>
            <ul className="space-y-2 text-sm">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noreferrer" className={`hover:text-white ${item.color}`}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
