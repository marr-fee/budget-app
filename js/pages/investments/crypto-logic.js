import { displayGridItems } from "../../components/modal.js";
import { showPage } from "../../core/navigetion.js";
import { appState } from "../../core/state.js";
import { openExpenseForm } from "../add-transaction/addTran-utils.js";
import { updateNetWorth } from "../networth.js";
import { fetchCurrentPrices } from "./crypto-APIs.js";

import { addCryptoBtn, coinHoldingsGridCntr, coinMarketGridCntr, myCryptoCardsCntr, totalPortfolioValueElem } from "./crypto-dom.js";

export const cryptoList = [
  { symbol: "BTC", image: 'assets/icons/bitcoin.png' },
  { symbol: "ETH",  image: 'assets/icons/ethereum(1).png' },
  { symbol: "SOL", image: 'assets/icons/solana.png' },
  { symbol: "ADA", image: 'assets/icons/cardano.png' },
  { symbol: "XRP", image: 'assets/icons/xrp.png' },
  { symbol: "BNB", image: 'assets/icons/money.png' },
  { symbol: "USDC", image: 'assets/icons/usdc.png' }
];

export const COIN_SYMBOL_MAP = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  ADA: "cardano",
  XRP: "ripple",
  BNB: "binancecoin",
  USDC: "usd-coin"
};




// === 1) Initial render of crypto market ===
export function renderPortfolio(prices) {
  coinMarketGridCntr.innerHTML = "";

  cryptoList.forEach((coin) => {
    const p = prices[coin.symbol];
    if (!p) return;

    const coinDiv = document.createElement("div");
    coinDiv.classList.add("crypto-market-grid-items");
    coinDiv.dataset.symbol = coin.symbol; // important for updates

    coinDiv.innerHTML = `
      <div class="coin-name-abbr-img-div">
        <img src="${coin.image}" alt="${coin.symbol} logo" />
        <div class="coin-name-abbr-div">
          <h4 class="coin-abbr">${coin.symbol}</h4>
          <p class="coin-name caption">${getCoinFullName(coin.symbol)}</p>
        </div>
      </div>
      <div class="coin-value-24hr-change-div">
        <h4 class="coin-value" data-price>${p.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</h4>
        <p class="change-24hr" data-change 
           style="color:${p.change24h >= 0 ? '#059c05ff' : '#ff0000'};">
          ${p.change24h >= 0 ? '+' : ''}${p.change24h.toFixed(2)}%
        </p>
      </div>
    `;

    coinMarketGridCntr.appendChild(coinDiv);
  });
}

// === 2) Update ONLY values, not the structure ===
export function updatePortfolio(prices) {
  cryptoList.forEach((coin) => {
    const p = prices[coin.symbol];
    if (!p) return;

    // find the DOM element for this coin
    const coinDiv = coinMarketGridCntr.querySelector(
      `[data-symbol="${coin.symbol}"]`
    );
    if (!coinDiv) return;

    // update price
    const priceElem = coinDiv.querySelector("[data-price]");
    if (priceElem) {
      priceElem.textContent = `${p.price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} kr`;
    }

    // update 24h change
    const changeElem = coinDiv.querySelector("[data-change]");
    if (changeElem) {
      changeElem.textContent =
        (p.change24h >= 0 ? "+" : "") + p.change24h.toFixed(2) + "%";
      changeElem.style.color = p.change24h >= 0 ? "#059c05ff" : "#ff0000";
    }
  });
}


export function renderHoldings(prices) {
  coinHoldingsGridCntr.innerHTML = "";

  appState.myCryptos.forEach((c) => {
    const p = prices[c.symbol];
    if (!p) return;

    // calculate initial values
    const currentPrice = p.price;
    const unitHeld = c.unitsHeld;
    const currentValue = unitHeld * currentPrice;
    const valueChange = currentValue - c.purchaseCost;
    const percentChange = ((valueChange / c.purchaseCost) * 100).toFixed(2);

    const holdingsDiv = document.createElement("div");
    holdingsDiv.classList.add(
      "crypto-holdings-grid-items",
      `${getCoinFullName(c.symbol).toLowerCase()}-background`
    );
    holdingsDiv.dataset.symbol = c.symbol; // important for updates

    holdingsDiv.innerHTML = `
      <img src="${c.image}" alt="blurred logo" class="blured-coin-logo" />
      <div class="coin-value-div">
        <img src="${c.image}" alt="coin image" class="holdings-coin-logo" />
        <p class="holdings-coin-name">${getCoinFullName(c.symbol)}</p>
        <h4 class="holdings-coin-value" data-holding-value>
          ${currentValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr
        </h4>
      </div>
      <div class="coin-changes-div">
        <div class="coin-units-held" data-units>
          ${unitHeld.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${c.symbol}
        </div>
        <div class="coin-percent-change">
          <div class="coin-changes">
            <p data-change-value style="color:${valueChange >= 0 ? "#059c05ff" : "#ff0000"};">
              ${valueChange >= 0 ? "+" : ""}${valueChange.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr
            </p>
            <p data-change-percent style="color:${percentChange >= 0 ? "#059c05ff" : "#ff0000"};">
              ${percentChange >= 0 ? "+" : ""}${percentChange}%
            </p>
          </div>
          <img src="assets/icons/up-arrow.png" alt="change arrow direction" />
        </div>
      </div>
    `;

    coinHoldingsGridCntr.appendChild(holdingsDiv);
  });

    displayGridItems(
    myCryptoCardsCntr,
    "My Coins",
    coinHoldingsGridCntr,
    coinHoldingsGridCntr.innerHTML, // pass built grid
    false,
    "No coins to show",
    appState.myCryptos.length
  );
}


export function updateHoldings(prices) {
  let totalValue = 0;

  appState.myCryptos.forEach((c) => {
    const p = prices[c.symbol];
    if (!p) return;

    const currentPrice = p.price;
    const unitHeld = c.unitsHeld;
    const currentValue = unitHeld * currentPrice;
    const valueChange = currentValue - c.purchaseCost;
    const percentChange = ((valueChange / c.purchaseCost) * 100).toFixed(2);

    totalValue += currentValue;

    // find the card in DOM
    const holdingsDiv = coinHoldingsGridCntr.querySelector(
      `[data-symbol="${c.symbol}"]`
    );
    if (!holdingsDiv) return;

    // update current value
    const valueElem = holdingsDiv.querySelector("[data-holding-value]");
    if (valueElem)
      valueElem.textContent = `${currentValue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} kr`;

    // update units
    const unitsElem = holdingsDiv.querySelector("[data-units]");
    if (unitsElem)
      unitsElem.textContent = `${unitHeld.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      })} ${c.symbol}`;

    // update change $
    const changeValElem = holdingsDiv.querySelector("[data-change-value]");
    if (changeValElem) {
      changeValElem.textContent =
        (valueChange >= 0 ? "+" : "") + `${valueChange.toFixed(2)} kr`;
      changeValElem.style.color = valueChange >= 0 ? "#125a12ff" : "#810d0dff";
    }

    // update change %
    const changePercentElem = holdingsDiv.querySelector("[data-change-percent]");
    if (changePercentElem) {
      changePercentElem.textContent =
        (percentChange >= 0 ? "+" : "") + percentChange + "%";
      changePercentElem.style.color =
        percentChange >= 0 ? "#125a12ff" : "#810d0dff";
    }
  });

  // update portfolio total value
  totalPortfolioValueElem.textContent = `${totalValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} kr`;

  appState.assets.investments = Number(totalValue);
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
    const prices = await fetchCurrentPrices("sek");
    // 5.2) Update the portfolio with those prices
    updatePortfolio(prices);
    updateHoldings(prices);
    renderPortfolio(prices);
    renderHoldings(prices);

    if (appState.calcNetWorth) {
      updateNetWorth();
    }
    // console.log('updated');
    
  } catch (err) {
    // 5.3) Catch & log network or JSON‐parse errors
    console.error("Error updating portfolio:", err.message);
  }
}


// === 6) Schedule periodic updates ===
// Call monitorPortfolio() once immediately…

monitorPortfolio();

// Then periodically
setInterval(async () => {
  try {
    const prices = await fetchCurrentPrices("sek");
    updatePortfolio(prices); // just update numbers
    updateHoldings(prices);  // just update numbers
    if (appState.calcNetWorth) {
      updateNetWorth();
    }
  } catch (err) {
    console.error("Error refreshing portfolio:", err.message);
  }
}, 60 * 1000);
// …and then every 60 seconds (60 * 1000 ms) thereafter.
// setInterval(monitorPortfolio, 60 * 1000);
// displayGridItems(myCryptoCardsCntr, "",coinHoldingsGridCntr, "", false, "No Cryptos held yet", appState.myCryptos.length);

addCryptoBtn.addEventListener('click', ()=>{
    showPage("addTranscPage");
    openExpenseForm();
    // expenseCategory.value === "investment";
    // investmentCategory.value === "crypto";
})