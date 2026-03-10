export const revalidate = 3600; // 1h

import { NextResponse } from "next/server";

const CEPEA_URL = "https://www.cepea.org.br/br/indicador/boi-gordo.aspx";

export async function GET() {
  try {
    const res = await fetch(CEPEA_URL, { next: { revalidate } });
    if (!res.ok) {
      throw new Error(`Status ${res.status}`);
    }

    const html = await res.text();
    const dateMatch = html.match(/(\d{2}\/\d{2}\/\d{4})/);
    const priceMatch = html.match(/R\$[\s&nbsp;]*([\d.,]+)/i);

    const date = dateMatch ? dateMatch[1] : null;
    const price = priceMatch ? Number(priceMatch[1].replace(/\./g, "").replace(",", ".")) : null;

    if (!price) {
      throw new Error("Preço não encontrado no site do CEPEA.");
    }

    return NextResponse.json({ price, date, source: "CEPEA - Indicador Boi Gordo (São Paulo)" });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Falha ao obter preço da arroba." }, { status: 500 });
  }
}
