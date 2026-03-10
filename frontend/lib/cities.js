const CITY_CONTENT = {
  ibaiti: {
    name: "Ibaiti",
    slug: "ibaiti",
    summary:
      "Ibaiti e um polo madeireiro e agropecuario do Centro-Norte do Parana. Fica no entroncamento da BR-153 com a PR-272, tem clima ameno, areas de reflorestamento e forte circulacao regional de servicos."
  },
  japira: {
    name: "Japira",
    slug: "japira",
    summary:
      "Japira fica no Norte Pioneiro, com perfil rural e agricultura familiar. E uma cidade de pequeno porte, tranquila, com propriedades buscadas para pecuaria, cafe e uso misto."
  },
  curiuva: {
    name: "Curiuva",
    slug: "curiuva",
    summary:
      "Curiuva esta a leste de Ibaiti e mantem base economica rural com madeira, pequenas industrias e producao agropecuaria. Tem ligacao regional importante pela PR-160."
  },
  sapopema: {
    name: "Sapopema",
    slug: "sapopema",
    summary:
      "Sapopema combina agricultura, erva-mate e turismo de natureza. A regiao e procurada por propriedades com agua, relevo marcante e potencial para uso rural e lazer."
  },
  tomazina: {
    name: "Tomazina",
    slug: "tomazina",
    summary:
      "Tomazina fica as margens do Rio das Cinzas, com tradicao em agricultura e pecuaria. A cidade atende bem quem busca area produtiva com boa circulacao regional."
  },
  figueira: {
    name: "Figueira",
    slug: "figueira",
    summary:
      "Figueira tem historia ligada a energia e mineracao, mas mantem forte presenca rural no entorno. A regiao concentra oportunidades em areas mistas e de pecuaria."
  },
  jaboti: {
    name: "Jaboti",
    slug: "jaboti",
    summary:
      "Jaboti esta no Norte Pioneiro com origem em fazendas de cafe. Hoje tem perfil rural diversificado, com propriedades procuradas para pecuaria, cafe e pequenas producoes."
  },
  wenceslau_braz: {
    name: "Wenceslau Braz",
    slug: "wenceslau-braz",
    summary:
      "Wenceslau Braz e referencia regional no Norte Pioneiro, com tradicao em cafe, graos e servicos. O mercado rural local e ativo e bem conectado pela BR-153 e PR-092."
  },
  congonhinhas: {
    name: "Congonhinhas",
    slug: "congonhinhas",
    summary:
      "Congonhinhas tem economia agricola baseada em cafe, soja, milho e criacao de gado. E uma regiao observada por compradores que buscam produtividade e custo competitivo."
  },
  arapoti: {
    name: "Arapoti",
    slug: "arapoti",
    summary:
      "Arapoti se destaca pelo agroindustrial, leite e graos, com cooperativas fortes e estrutura regional consolidada. Costuma atrair interesse em propriedades mais produtivas."
  },
  santana_do_itarare: {
    name: "Santana do Itarare",
    slug: "santana-do-itarare",
    summary:
      "Santana do Itarare fica na divisa com Sao Paulo, com economia ligada a graos e pecuaria. A regiao atende perfis de uso produtivo e propriedades de medio porte."
  },
  pinhalao: {
    name: "Pinhalao",
    slug: "pinhalao",
    summary:
      "Pinhalao tem tradicao em cafe, pecuaria e pequenas propriedades rurais. Sua proximidade com Ibaiti ajuda na liquidez e no interesse por areas produtivas e de apoio."
  },
  joaquim_tavora: {
    name: "Joaquim Tavora",
    slug: "joaquim-tavora",
    summary:
      "Joaquim Tavora tem perfil rural com aptidao para pecuaria, cafe e uso misto. O mercado local e buscado por quem quer proximidade com o Norte Pioneiro mais consolidado."
  },
  santo_antonio_da_platina: {
    name: "Santo Antonio da Platina",
    slug: "santo-antonio-da-platina",
    summary:
      "Santo Antonio da Platina e um dos principais polos do Norte Pioneiro, com cafe, servicos agro e forte influencia regional. Isso ajuda na procura por imoveis rurais e apoio logistico."
  },
  ribeirao_do_pinhal: {
    name: "Ribeirao do Pinhal",
    slug: "ribeirao-do-pinhal",
    summary:
      "Ribeirao do Pinhal combina tradicao cafeeira e expansao de graos. A cidade costuma aparecer em buscas por propriedades com boa terra e acesso regional."
  }
};

export const cityEntries = Object.values(CITY_CONTENT);

export function normalizeCityKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function getCityContentByName(name) {
  return CITY_CONTENT[normalizeCityKey(name)] || null;
}

export function getCityContentBySlug(slug) {
  return cityEntries.find((entry) => entry.slug === slug) || null;
}
