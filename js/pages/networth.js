import { appPages } from "../core/navigetion.js";
import { appState } from "../core/state.js";
import { updateTotalMonthlyBalance } from "../core/utils.js";
import { dashboardNetworthElem, networthChangeContr } from "./dashboard.js";
import { updateTotalMonthlyIncome } from "./income.js";


export const hideAmountToggleBtn = document.getElementById('toggle-networth');
export const hideItemsContainer = document.querySelectorAll('.amount-cover');
const netWorthEl = document.getElementById("networth-amount");
  const changeEl = document.getElementById("networth-amount-change");
  const percentEl = document.getElementById("networth-change");


hideAmountToggleBtn.addEventListener('click', () =>{
  networthChangeContr.classList.toggle("hide");
  dashboardNetworthElem.classList.toggle("hide");
  hideItemsContainer.forEach((c) =>{
    c.classList.toggle("active")
  })

})

// class Loan {
//   constructor(name, totalAmount, monthlyPayment){
//     this.name = name;
//     this.remaining = totalAmount;
//     this.monthlyPayment = monthlyPayment;
//   }

//   makePayment(){
//     if (asset.cash >= this.monthlyPayment && this.remaining > 0) {
//       asset.cash -= this.monthlyPayment,this.monthlyPayment;
//       this.remaining -= this.monthlyPayment;

//       if (this.remaining < 0) {
//         this.remaining = 0
//       }
//     }
//   }
// }

// let phoneLoan = new Loan("Phone", 600, 25);

// phoneLoan.makePayment();

export function updateFinances() {

  let cash = updateTotalMonthlyBalance(); 
  
  appState.assets.cash = cash;

  let investments = appState.myCryptos.reduce((sum, c) => {
    return sum + (c.unitsHeld * (c.price || 0));
  }, 0);
  appState.assets.investments = investments;

  let totalLoans = appState.loans.reduce((sum, l) => sum + l.amountLeft, 0);
  appState.liabilities.loans = totalLoans;

  // --- Net Worth ---
  const currentNetWorth = Number((cash + investments) - totalLoans) || 0;

  
  if (appState.networthHistory[1] === currentNetWorth) return;

  if (appState.networthHistory.length >= 2) {
    appState.networthHistory.shift();
    appState.networthHistory.push(currentNetWorth);
  } else{
    appState.networthHistory.push(currentNetWorth);
  }

  const previousNW = Number(appState.networthHistory[0]);
  const currentNW = Number(appState.networthHistory[1]);

  const change = currentNW - previousNW;

  // networthHistory.push(currentNetWorth);

  const percentChange = previousNW !== 0
    ? (change / previousNW) * 100
    : 0;

  // if (Number(networthHistory[1]) === Number(currentNetWorth))
  // console.log(networthHistory);
  // console.log(networthHistory[0] === currentNetWorth);
  console.log(appState.networthHistory);
  
  console.log(currentNW);
  console.log(previousNW);
  
  
  
  


  // appState.netWorthHistory = appState.netWorthHistory || [];

  // const prevNetWorth = appState.netWorthHistory.length > 0 
  //   ? appState.netWorthHistory[appState.netWorthHistory.length - 1]
  //   : 0;

  // const change = currentNetWorth - prevNetWorth;
  // const percentChange = prevNetWorth !== 0
  //   ? (change / prevNetWorth) * 100
  //   : 0;

  appState.netWorth = currentNetWorth;
  appState.netWorthChange = change;
  appState.netWorthPercentChange = percentChange;

  updateNetWorth(); 
  // console.log(appState.netWorthHistory);
  
}


export function updateNetWorth() {
  if (!netWorthEl) return;
  
  
  netWorthEl.textContent = `$${appState.netWorth.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  let change = appState.netWorthChange;
  let percent = appState.netWorthPercentChange;

  changeEl.textContent = `${change >= 0 ? "+" : "-"}$${Math.abs(change).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  percentEl.textContent = `${percent >= 0 ? "+" : "-"}${Math.abs(percent).toFixed(2)}%`;

  // Optional: add color cues
  changeEl.style.color = change >= 0 ? "green" : "red";
  percentEl.style.color = percent >= 0 ? "green" : "red";
}
