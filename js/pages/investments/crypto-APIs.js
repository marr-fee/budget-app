import { COIN_SYMBOL_MAP } from "./crypto-logic.js";


export async function fetchCurrentPrices(vsCurrency = "sek") {
  const ids = Object.values(COIN_SYMBOL_MAP).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vsCurrency}&include_24hr_change=true`;
  
  const apiResponce = await fetch(url);
  if (!apiResponce.ok) {
    throw new Error("Failed to fetch prices");
  }

  const data = await apiResponce.json();

  return Object.entries(COIN_SYMBOL_MAP).reduce((acc, [symbol, id]) => {
    const entry = data[id];
    acc[symbol] = {
      price: entry?.[vsCurrency] ?? 0,
      change24h: entry?.[`${vsCurrency}_24h_change`] ?? 0
    };
    return acc;
  }, {});
}


