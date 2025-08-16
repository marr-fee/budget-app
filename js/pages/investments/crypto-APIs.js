import { COIN_SYMBOL_MAP } from "./crypto-logic.js";


export async function fetchCurrentPrices() {

  const ids = Object.values(COIN_SYMBOL_MAP).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
  const apiResponce = await fetch(url);

  if (!apiResponce.ok) {

    throw new Error("Failed to fetch prices");
  }

  const data = await apiResponce.json();

  return Object.entries(COIN_SYMBOL_MAP).reduce((acc, [symbol, id]) => {
    const entry = data[id];
    acc[symbol] = {
      price: entry?.usd ?? 0,
      change24h: entry?.usd_24h_change ?? 0
    };
    return acc;
  }, {});
}


// export async function fetchCoinData(coinId) {
//   let res = await fetch(
//     `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`
//   );
//   let data = await res.json();
//   return data.prices.map(p => p[1]); // return only prices
// }

