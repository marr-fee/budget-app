import { appState } from "../../core/state.js";
import { fetchCurrentPrices } from "./crypto-APIs.js";

import { coinHoldingsGridCntr, coinMarketGridCntr, totalPortfolioValueElem } from "./crypto-dom.js";

export const cryptoList = [
  { symbol: "BTC", image: 'assets/icons/bitcoin.png' },
  { symbol: "ETH",  image: 'assets/icons/ethereum(1).png' },
  { symbol: "SOL", image: 'assets/icons/solana.png' },
  { symbol: "ADA", image: 'assets/icons/cardano.png' },
  { symbol: "XRP", image: 'assets/icons/xrp.png' },
  { symbol: "USDC", image: 'assets/icons/usdc.png' }
];

export const COIN_SYMBOL_MAP = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  ADA: "cardano",
  XRP: "ripple",
  USDC: "usd-coin"
};




export function updatePortfolio(prices) {

  let allCoinsHTML = '';
  let totalValue = 0;

  cryptoList.forEach((coin) => {
    const p = prices[coin.symbol]; // { price, change24h }
    if (!p) return;

    const currentPrice = p.price;
    const change24h = p.change24h;

    // coin.currentPrice = currentPrice;

    const priceText = currentPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    allCoinsHTML += `
      <div class="crypto-market-grid-items" data-coin="${COIN_SYMBOL_MAP[coin.symbol]}">
        <div class="coin-name-abbr-img-div">
          <img src="${coin.image}" alt="${coin.symbol} logo" />
          <div class="coin-name-abbr-div">
            <h4 class="coin-abbr">${coin.symbol}</h4>
            <p class="coin-name caption">${getCoinFullName(coin.symbol)}</p>
          </div>
        </div>
        <div class="coin-progress-graph-div">
          <canvas></canvas>
        </div>
        <div class="coin-value-24hr-change-div">
          <h4 class="coin-value">$${priceText}</h4>
          <p class="change-24hr" style="color:${change24h >= 0 ? '#059c05ff' : '#ff0000'};">
            ${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%
          </p>
        </div>
      </div>
    `;
  });

  let myCryptosHTML = '';

  appState.myCryptos.forEach((c) =>{

    const p = prices[c.symbol]; // { price, change24h }
    if (!p) return;

    const currentPrice = p.price;
    const unitHeld = c.unitsHeld.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }) || ( c.purchaseCost / c.currentPrice).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    })

    c.currentValue = unitHeld * currentPrice;
    c.valueChange = c.currentValue - c.purchaseCost;
    c.percentChange = ((c.valueChange / c.purchaseCost) * 100).toFixed(2);
    totalValue += c.currentValue;

    const priceText = c.currentValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    // console.log(getCoinFullName(c.symbol).toLocaleLowerCase());
    

    myCryptosHTML += `
      <div class="crypto-holdings-grid-items ${getCoinFullName(c.symbol).toLocaleLowerCase()}-background">
        <img
          src="${c.image}"
          alt="blurred logo"
          class="blured-coin-logo"
        />
        <div class="coin-value-div">
          <img
            src="${c.image}"
            alt="coin image"
            class="holdings-coin-logo"
          />
          <p class="holdings-coin-name">${getCoinFullName(c.symbol)}</p>
          <h4 class="holdings-coin-value">$${priceText}</h4>
        </div>
        <div class="coin-changes-div">
          <div class="coin-units-held">${unitHeld}${c.symbol}</div>
          <div class="coin-percent-change">
            <div class="coin-changes">
              <p style="color:${c.valueChange >= 0 ? '#059c05ff' : '#ff0000'};">${c.valueChange >= 0 ? '+' : ''}$${c.valueChange.toFixed(2)}</p>
              <p style="color:${c.percentChange >= 0 ? '#059c05ff' : '#ff0000'};">${c.percentChange >= 0 ? '+' : ''}${c.percentChange}%</p>
            </div>
            
            <img
              src="assets/icons/up-arrow.png"
              alt="change arrow direction"
            />
          </div>
        </div>
      </div>
    `
  })

  coinMarketGridCntr.innerHTML = allCoinsHTML;
  coinHoldingsGridCntr.innerHTML = myCryptosHTML;
  totalPortfolioValueElem.innerHTML = `$${(totalValue).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

}


function getCoinFullName(symbol) {
  if (!symbol) return "";

  switch (symbol) {
    case "BTC": return "Bitcoin";
    case "ETH": return "Ethereum";
    case "SOL": return "Solana";
    case "ADA": return "Cardano";
    case "XRP": return "Ripple";
    case "USDC": return "USD Coin";
    default: return String(symbol);
  }
}

// === 5) Main monitoring function ===
export async function monitorPortfolio() {
  try {
    // 5.1) Fetch fresh prices
    const prices = await fetchCurrentPrices();
    // 5.2) Update the portfolio with those prices
    updatePortfolio(prices);
    // console.log('updated');
    
  } catch (err) {
    // 5.3) Catch & log network or JSON‐parse errors
    console.error("Error updating portfolio:", err.message);
  }
}

// export function getSegmentColors(prices) {
//   return prices.map((p, i) => {
//     if (i === 0) return 'rgba(0,0,0,0)'; // no color for first point
//     return p >= prices[i - 1] ? '#00ff00' : '#ff0000';
//   });
// }

// Initialize for all market items
// document.querySelectorAll('.crypto-market-grid-items').forEach(async item => {
//   let coinName = item.dataset.coin; // e.g., 'solana', 'bitcoin', 'ethereum'
//   await renderCoinGraph(item.querySelector('.coin-progress-graph-div'), coinName);
// });



// === 6) Schedule periodic updates ===
// Call monitorPortfolio() once immediately…
monitorPortfolio();
// …and then every 60 seconds (60 * 1000 ms) thereafter.
setInterval(monitorPortfolio, 60 * 1000);
