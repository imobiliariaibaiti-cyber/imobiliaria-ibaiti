import ClientAccessFlow from "@/components/ClientAccessFlow";

export const metadata = {
  title: "Painel do cliente | Imobiliaria Ibaiti",
  description: "Cadastro e acesso do proprietario para anunciar imoveis no painel da Imobiliaria Ibaiti."
};

export default function ClientePage() {
  return <ClientAccessFlow />;
}
