import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/valores", label: "Valores" },
  { href: "/aptidoes", label: "Aptidoes" },
  { href: "/imoveis", label: "Imoveis" },
  { href: "/admin", label: "Admin" }
];

const socialLinks = [
  { href: "https://www.youtube.com/@imobiliariaibaiti", label: "YouTube" },
  { href: "https://www.instagram.com/imobiliariaibaiti/", label: "Instagram" },
  { href: "https://www.facebook.com/imobiliariaibaiti", label: "Facebook" },
  { href: "https://www.tiktok.com/@imobiliariaibaiti", label: "TikTok" }
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-brand-100 bg-brand-900 text-brand-50">
      <div className="container-main grid gap-8 py-8 md:grid-cols-2">
        <div className="space-y-2">
          <p className="font-display text-2xl">Imobiliaria Ibaiti</p>
          <p className="text-sm text-brand-100">Especialistas em imoveis rurais em Ibaiti e regiao.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-200">Links rapidos</p>
            <ul className="space-y-1 text-sm">
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
            <ul className="space-y-1 text-sm">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noreferrer" className="hover:text-white">
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
