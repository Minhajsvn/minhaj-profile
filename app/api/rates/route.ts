// Spot gold & silver for the homepage ticker. Proxied server-side so the browser never
// depends on a third-party origin, and cached briefly so visitors share one upstream call.
export const revalidate = 30;

const SOURCE = "https://api.gold-api.com/price";

type Quote = { price: number; updatedAt: string };

async function quote(symbol: "XAU" | "XAG"): Promise<Quote> {
  const res = await fetch(`${SOURCE}/${symbol}`, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error(`${symbol} ${res.status}`);
  const data = (await res.json()) as Quote;
  if (typeof data.price !== "number") throw new Error(`${symbol} malformed`);
  return data;
}

export async function GET() {
  try {
    const [gold, silver] = await Promise.all([quote("XAU"), quote("XAG")]);
    return Response.json(
      { gold: gold.price, silver: silver.price, updatedAt: gold.updatedAt },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } },
    );
  } catch {
    return Response.json({ error: "Market feed unavailable" }, { status: 502 });
  }
}
