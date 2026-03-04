import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WeatherBar from "@/components/WeatherBar";

export const metadata = {
  metadataBase: new URL("https://imobiliariaibaiti.com.br"),
  title: {
    default: "Imobiliaria Ibaiti | Imoveis Rurais Premium",
    template: "%s | Imobiliaria Ibaiti"
  },
  description:
    "Especialistas em fazendas, sitios e chacaras em Ibaiti e regiao. Atendimento rapido, imoveis selecionados e negociacao segura.",
  keywords: [
    "imobiliaria ibaiti",
    "imobiliaria rural ibaiti",
    "fazenda em ibaiti",
    "sitio ibaiti",
    "chacara ibaiti",
    "chacara pinhalao",
    "chacara curiuva",
    "fazenda sapopema",
    "sitio tomazina",
    "lote rural parana",
    "preco alqueire ibaiti",
    "imoveis rurais"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Imobiliaria Ibaiti",
    title: "Imobiliaria Ibaiti | Imoveis Rurais Premium",
    description: "Encontre fazendas, sitios e chacaras com consultoria especializada.",
    url: "https://imobiliariaibaiti.com.br"
  }
};

export default function RootLayout({ children }) {
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Imobiliária Ibaiti",
    url: "https://imobiliariaibaiti.com",
    image: "https://imobiliariaibaiti.com/logo.png",
    description: "Imobiliária rural especializada em chácaras, sítios e fazendas na região de Ibaiti-PR.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ibaiti",
      addressRegion: "PR",
      addressCountry: "BR"
    },
    areaServed: ["Ibaiti", "Pinhalão", "Curiúva", "Sapopema", "Tomazina", "Figueira", "Jaboti", "Wenceslau Braz", "Congonhinhas", "Arapoti", "Santana do Itararé"],
    telephone: "+55-43-99999-9999",
    openingHours: "Mo-Fr 09:00-18:00",
    priceRange: "R$"
  };

  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
        <WeatherBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
