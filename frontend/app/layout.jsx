import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  metadataBase: new URL("https://imobiliariaibaiti.com.br"),
  title: {
    default: "Imobiliaria Ibaiti | Imoveis Rurais Premium",
    template: "%s | Imobiliaria Ibaiti"
  },
  description:
    "Especialistas em fazendas, sitios e chacaras em Ibaiti e regiao. Atendimento rapido, imoveis selecionados e negociacao segura.",
  keywords: ["imobiliaria ibaiti", "fazenda em ibaiti", "sitio ibaiti", "chacara ibaiti", "imoveis rurais"],
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
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
