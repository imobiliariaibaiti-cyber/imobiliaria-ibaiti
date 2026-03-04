const STQ_QUOTES = {
  coffeeArabica: "kc.f", // ICE Coffee C
  coffeeRobusta: "rc.f", // ICE Robusta
  cattle: "lc.f", // Live Cattle CME
  corn: "c.f", // Corn CBOT
  soy: "s.f", // Soybeans CBOT
  usdbrl: "usdbrl" // USD/BRL forex
};

async function fetchStooq(symbol) {
  const url = `https://stooq.com/db/l/?s=${symbol}&f=sd2t2ohlcv&h&e=json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Stooq status ${res.status}`);
  const data = await res.json();
  const r = data?.[0];
  if (!r || !r.c) throw new Error("sem cotação");
  return {
    symbol,
    close: Number(r.c),
    open: Number(r.o),
    high: Number(r.h),
    low: Number(r.l),
    date: r.d,
    time: r.t
  };
}

function convertToBRL({ usdbrl, commodity }) {
  if (!commodity || !usdbrl) return null;
  const usd = commodity.close;
  const fx = usdbrl.close;

  switch (commodity.symbol) {
    case STQ_QUOTES.coffeeArabica:
      return usd * 0.01 * 2.20462 * 60 * fx;
    case STQ_QUOTES.coffeeRobusta:
      return usd * 0.01 * 2.20462 * 60 * fx;
    case STQ_QUOTES.corn:
      return usd * 0.01 * fx * (60 / 27.216);
    case STQ_QUOTES.soy:
      return usd * 0.01 * fx * (60 / 27.216);
    case STQ_QUOTES.cattle:
      return usd * 0.01 * 32.15 * fx;
    default:
      return usd * fx;
  }
}

export async function GET() {
  try {
    const usdbrl = await fetchStooq(STQ_QUOTES.usdbrl);
    const symbols = [
      STQ_QUOTES.coffeeArabica,
      STQ_QUOTES.coffeeRobusta,
      STQ_QUOTES.corn,
      STQ_QUOTES.soy,
      STQ_QUOTES.cattle
    ];

    const results = await Promise.allSettled(symbols.map(fetchStooq));
    const quotes = [];
    results.forEach((r, idx) => {
      const sym = symbols[idx];
      if (r.status === "fulfilled") {
        const converted = convertToBRL({ usdbrl, commodity: r.value });
        if (converted) {
          quotes.push({
            symbol: sym,
            label:
              sym === STQ_QUOTES.coffeeArabica
                ? "Café arábica (ICE KC)"
                : sym === STQ_QUOTES.coffeeRobusta
                ? "Café robusta (ICE RC)"
                : sym === STQ_QUOTES.corn
                ? "Milho (CBOT C)"
                : sym === STQ_QUOTES.soy
                ? "Soja (CBOT S)"
                : "Boi gordo (Live Cattle)",
            unit:
              sym === STQ_QUOTES.cattle
                ? "R$/@ 15kg"
                : "R$/saca 60kg",
            price: converted,
            change: r.value.close - r.value.open,
            pct: r.value.open ? ((r.value.close - r.value.open) / r.value.open) * 100 : 0,
            date: r.value.date
          });
        }
      }
    });

    return new Response(JSON.stringify({ quotes, fx: usdbrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ quotes: [], error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
