// --- IMPORTS ---
import { appState } from "../core/state.js";
import { updateTotalAvailableBalance } from "../core/utils.js";
import { dashboardNetworthElem, networthChangeContr } from "./dashboard.js";

// --- DOM ELEMENTS ---
export const hideAmountToggleBtn = document.getElementById("toggle-networth");
export const hideItemsContainer = document.querySelectorAll(".amount-cover");
const netWorthEl = document.getElementById("networth-amount");
const changeEl = document.getElementById("networth-amount-change");
const percentEl = document.getElementById("networth-change");

// --- TOGGLE VISIBILITY ---
hideAmountToggleBtn.addEventListener("click", () => {
  networthChangeContr.classList.toggle("hide");
  dashboardNetworthElem.classList.toggle("hide");
  hideItemsContainer.forEach((c) => {
    c.classList.toggle("active");
  });
});

// --- UPDATE NET WORTH ---
export function updateNetWorth() {
  // Cash
  let cash = Number(updateTotalAvailableBalance());
  if (cash < 0) cash = 0;
  appState.assets.cash = cash;

  // Investments
  let investments = appState.myCryptos.reduce((sum, c) => {
    return sum + (c.unitsHeld * (c.purchaseCost || 0));
  }, 0);
  if (investments < 0) investments = 0;
  appState.assets.investments = Number(investments);

  // Loans
  let totalLoans = appState.loans.reduce((sum, l) => sum + l.amountLeft, 0);
  appState.liabilities.loans = totalLoans;

  // --- Calculate Net Worth ---
  const netWorth = Number(
    appState.assets.cash + appState.assets.investments - appState.liabilities.loans
  ) || 0;

  appState.netWorth = netWorth;
  calcNetWorthChanges(netWorth);
  renderNetWorth();
}

// --- CALCULATE CHANGES ---
export function calcNetWorthChanges(netWorth) {
  // Set initial baseline (for lifetime tracking)
  if (appState.initialNetWorth == null) {
    appState.initialNetWorth = netWorth;
  }

  // Track history for step change
  if (appState.networthHistory[1] === netWorth) return;

  if (appState.networthHistory.length >= 2) {
    appState.networthHistory.shift();
    appState.networthHistory.push(netWorth);
  } else {
    appState.networthHistory.push(netWorth);
  }

  const previousNW = Number(appState.networthHistory[0]);
  const currentNW = Number(appState.networthHistory[1]);

  // --- Step Change (last vs current) ---
  const stepChange = currentNW - previousNW;
  const stepPercent = previousNW > 0 ? (stepChange / previousNW) * 100 : null;

  // --- Lifetime Change (baseline vs current) ---
  const lifetimeChange = currentNW - appState.initialNetWorth;
  const lifetimePercent =
    appState.initialNetWorth > 0
      ? (lifetimeChange / appState.initialNetWorth) * 100
      : null;

  // Save in state
  appState.netWorth = currentNW;
  appState.netWorthChange = stepChange;
  appState.netWorthPercentChange = stepPercent;
  appState.netWorthLifetimeChange = lifetimeChange;
  appState.netWorthLifetimePercent = lifetimePercent;
}

// --- RENDER TO DASHBOARD ---
export function renderNetWorth() {
  if (!netWorthEl) return;

  // Current Net Worth
  netWorthEl.textContent = `${appState.netWorth.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} kr`;

  // Step Change
  let change = appState.netWorthChange;
  let percent = appState.netWorthPercentChange;

  changeEl.textContent =
    change != null
      ? `${change >= 0 ? "+" : "-"}${Math.abs(change).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} kr`
      : "—";

  percentEl.textContent =
    percent != null
      ? `${percent >= 0 ? "+" : "-"}${Math.abs(percent).toFixed(2)}%`
      : "—";

  // Optional: add color cues
  changeEl.style.color = change >= 0 ? "green" : "red";
  percentEl.style.color = percent >= 0 ? "green" : "red";
}


