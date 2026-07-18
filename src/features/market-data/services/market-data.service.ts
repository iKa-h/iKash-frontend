const API_URL = process.env.NEXT_PUBLIC_MARKET_API_URL || 'https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd';

export async function fetchUsdcPrice(): Promise<number> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(API_URL, { signal: controller.signal, next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch USDC price');

    const data = await res.json();
    const price = data['usd-coin']?.usd;

    if (typeof price !== 'number' || price <= 0) {
      throw new Error('Invalid price data received');
    }

    return price;
  } finally {
    clearTimeout(timeout);
  }
}
