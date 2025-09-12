// --- IMPORTS ---
import { goBack } from "../core/navigetion.js";
import { appState } from "../core/state.js";
import { highlightErrors, showNotification, updateTotalAvailableBalance } from "../core/utils.js";
import { dashboardNetworthElem, networthChangeContr } from "./dashboard.js";

// --- DOM ELEMENTS ---
export const hideAmountToggleBtn = document.getElementById("toggle-networth");
export const hideItemsContainer = document.querySelectorAll(".amount-cover");
export const netWorthEl = document.getElementById("networth-amount");
export const changeEl = document.getElementById("networth-amount-change");
export const percentEl = document.getElementById("networth-change");
export const beginNetworthEvalBtn = document.getElementById('start-networth-btn');
export const addCashBtn = document.getElementById('submit-cash-btn');
export const addCashForm = document.querySelector('.cash-bal-form');
export const trackNetWorthLink = document.querySelector('.networth-invitation')
export const netWorthDisplayCntr = document.querySelector('.networth-info-cntr')

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
  let investments = appState.assets.investments;

  if (investments < 0) investments = 0;
  appState.assets.investments = Number(investments);

  // Loans
  let totalLoans = appState.loans.reduce((sum, l) => sum + l.amountLeft, 0);
  appState.liabilities.loans = totalLoans;

  // --- Calculate Net Worth ---
  const netWorth = Number(
    cash + appState.assets.investments - appState.liabilities.loans
  ) || 0;

  appState.netWorth = netWorth;
  calcNetWorthChanges(netWorth);
  renderNetWorth();
}

// --- CALCULATE CHANGES ---
export function calcNetWorthChanges(netWorth) {

  const initialNW = Number(appState.initialNetWorth);
  const currentNW = Number(netWorth);

  const stepChange = currentNW - initialNW;
  const stepPercent = initialNW > 0 ? (stepChange / initialNW) * 100 : null;

  appState.netWorth = currentNW;
  appState.netWorthChange = stepChange;
  appState.netWorthPercentChange = stepPercent;
  
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

beginNetworthEvalBtn.addEventListener('click', ()=>{

  let proceedToCalcNetW = appState.isAssetAdded || appState.isLiabilitiesAdded;

  if (!proceedToCalcNetW) {
    
    showNotification("Please set your assets or liabilities first", true);
    return;
  }
  appState.calcNetWorth = true;
  updateNetWorth();
  trackNetWorthLink.style.display = 'none';
  netWorthDisplayCntr.style.display = 'flex';
  goBack();
})

addCashBtn.addEventListener('click', ()=>{
  const cashAmount = document.getElementById('cash-total-amount');
  const requiredFields = [cashAmount];

  if (isNaN(parseFloat(cashAmount.value)) || parseFloat(cashAmount.value) <= 0) {
    showNotification('Please enter a valid amount', true);
    highlightErrors(requiredFields);

    return;
  } 
  
  appState.assets.cash += Number(cashAmount.value);
  appState.isAssetAdded = true;
  
  if (appState.calcNetWorth) {
    updateNetWorth();
  }
  if (appState.initialNetWorth === 0) {
    appState.initialNetWorth = Number(cashAmount.value);
  }

  updateTotalAvailableBalance()
  cashAmount.value = ""

  goBack()
})