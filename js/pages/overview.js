// // BUDGET OVERVIEW LOGIC



// async function fetchCoinData(coinId) {
//   let res = await fetch(
//     `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`
//   );
//   let data = await res.json();
//   return data.prices.map(p => p[1]); // return only prices
// }

// function getSegmentColors(prices) {
//   return prices.map((p, i) => {
//     if (i === 0) return 'rgba(0,0,0,0)'; // no color for first point
//     return p >= prices[i - 1] ? '#00ff00' : '#ff0000';
//   });
// }

// async function renderCoinGraph(container, coinId) {
//   const prices = await fetchCoinData(coinId);
//   const ctx = container.querySelector("canvas").getContext("2d");

//   // Decide color based on overall trend
//   const startPrice = prices[0];
//   const endPrice = prices[prices.length - 1];
//   const lineColor = endPrice >= startPrice ? "#00ff00" : "#ff0000";

//   new Chart(ctx, {
//     type: "line",
//     data: {
//       labels: prices.map((_, i) => i),
//       datasets: [{
//         data: prices,
//         borderWidth: 2,
//         borderColor: lineColor,
//         pointRadius: 0,
//         fill: false
//       }]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: { display: false },
//         tooltip: { enabled: false }
//       },
//       scales: {
//         x: { display: false },
//         y: { display: false }
//       }
//     }
//   });
// }


// // Initialize for all market items
// document.querySelectorAll('.crypto-market-grid-items').forEach(async item => {
//   let coinName = item.dataset.coin; // e.g., 'solana', 'bitcoin', 'ethereum'
//   await renderCoinGraph(item.querySelector('.coin-progress-graph-div'), coinName);
// });




// Crypto section
// const myCryptoHoldings = [
//   { symbol: "BTC", purchaseCost: 431.59, unitsHeld: 0.00415 },
//   { symbol: "ETH", purchaseCost: 521.02, unitsHeld: 0.145959 },
//   { symbol: "SOL", purchaseCost: 107.44, unitsHeld: 0.54064 },
//   { symbol: "ADA", purchaseCost: 96.52, unitsHeld: 133.259 },
//   { symbol: "XRP", purchaseCost: 202.51, unitsHeld: 66.0008 },
//   { symbol: "USDC", purchaseCost: 302.33, unitsHeld: 302.382, currentPrice: 1.0 }
// ];

// // === 2) Map your symbols to CoinGecko IDs ===
// const COIN_SYMBOL_MAP = {
//   BTC: "bitcoin",
//   ETH: "ethereum",
//   SOL: "solana",
//   ADA: "cardano",
//   XRP: "ripple"
// };

// // === 3) Function to fetch current USD prices from CoinGecko ===
// async function fetchCurrentPrices() {

//   const ids = Object.values(COIN_SYMBOL_MAP).join(",");
//   const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
//   const apiResponce = await fetch(url);

//   // Check for HTTP-level errors
//   //    apiResponce.ok is true for status codes in the 200–299 range
//   if (!apiResponce.ok) {
//     // If anything went wrong (e.g. 404 or 500), throw an Error
//     throw new Error("Failed to fetch prices");
//   }

//   //  Parse the JSON body of the response
//   //  apiResponce.json() returns a Promise that resolves to the parsed JavaScript object
//   const data = await apiResponce.json();

//   // 3.6) Transform CoinGecko’s response into a map from symbol → price
//   return Object.entries(COIN_SYMBOL_MAP).reduce((acc, [symbol, id]) => {
//     acc[symbol] = data[id].usd;
//     return acc;
//   }, {});
// }

// //  Function to update your portfolio with new prices ===
// function updatePortfolio(prices) {
//   let totalValue = 0;               // Accumulate the total USD value of all holdings

//   console.log("=== Portfolio Summary ===");

//   // Loop over each coin in your holdings
//   myCryptoHoldings.forEach((coin) => {
//     // Handle USDC separately since it's pegged to $1
//     if (coin.symbol === "USDC") {
//       coin.currentPrice = 1.0;
//       coin.currentValue = coin.unitsHeld * 1.0;
//       // No gain/loss logic needed for a stablecoin
//       return;
//     }

//     // 4.1) Look up the current price from the fetched prices map
//     const price = prices[coin.symbol];
//     coin.currentPrice = price;

//     // 4.2) Calculate current value = unitsHeld × currentPrice
//     coin.currentValue = coin.unitsHeld * price;

//     // 4.3) Calculate absolute gain/loss vs your cost
//     coin.valueChange = coin.currentValue - coin.purchaseCost;

//     // 4.4) Calculate percentage change
//     //      (valueChange ÷ cost) × 100
//     coin.percentChange = ((coin.valueChange / coin.purchaseCost) * 100).toFixed(2);

//     // 4.5) Add this coin’s current value to the total portfolio value
//     totalValue += coin.currentValue;

//     // 4.6) Log the details for this coin
//     console.log(`${coin.symbol}:`);
//     console.log(`  Current Price: $${price.toFixed(2)}`);
//     console.log(`  Units Held: ${coin.unitsHeld}`);
//     console.log(`  Cost Basis: $${coin.purchaseCost.toFixed(2)}`);
//     console.log(`  Current Value: $${coin.currentValue.toFixed(2)}`);
//     console.log(`  Change: $${coin.valueChange.toFixed(2)} (${coin.percentChange}%)`);

//     // 4.7) If gain ≥ +80%, log an alert
//     if (coin.percentChange >= 80) {
//       console.log(`🚨 Alert: ${coin.symbol} has reached +${coin.percentChange}% gain. Consider saving profits to USDC.`);
//     }
//   });

//   // 4.8) After looping, print total portfolio value
//   console.log(`\n💰 Total Portfolio Value: $${(totalValue).toFixed(2)}\n`);
// }

// // === 5) Main monitoring function ===
// async function monitorPortfolio() {
//   try {
//     // 5.1) Fetch fresh prices
//     const prices = await fetchCurrentPrices();
//     // 5.2) Update the portfolio with those prices
//     updatePortfolio(prices);
//   } catch (err) {
//     // 5.3) Catch & log network or JSON‐parse errors
//     console.error("Error updating portfolio:", err.message);
//   }
// }

// // === 6) Schedule periodic updates ===
// // Call monitorPortfolio() once immediately…
// monitorPortfolio();
// // …and then every 60 seconds (60 * 1000 ms) thereafter.
// //setInterval(monitorPortfolio, 60 * 1000);












