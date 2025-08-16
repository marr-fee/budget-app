// INCOME PAGE LOGIC

import { displayGridItems } from "../components/modal.js";
import { showPage } from "../core/navigetion.js";
import { appState } from "../core/state.js";
import { openIncomeForm } from "./add-transaction/addTran-utils.js";
import { totalMonthlyIncomeElem } from "./dashboard.js";


export const incPageTotalIncElem = document.getElementById('income-totl');
export const incChartContainer = document.querySelector('.mon-total-inc-chart');
export const incPageIncGridContr = document.querySelector('.income-page-trans-grid-container');
export const addIncTranBtn = document.getElementById('inc-page-add-t-btn');
export const incomePageTransactionsDiv = document.getElementById('income-page-tran-div');


export function updateTotalMonthlyIncome(){
  let totalMonthlyIncome = 0;
  appState.income.forEach((inc) =>{
    totalMonthlyIncome += Number(inc.amount);
  })

  totalMonthlyIncomeElem.textContent = Number(totalMonthlyIncome.toFixed(2)).toLocaleString("en-US");

  return totalMonthlyIncome;
}

export function renderIncomeItems() {
  let incomeGridItems = '';
  appState.income.forEach((inc) => {
    incomeGridItems += `
         <div class="trans-grid-item" data-id="${inc.id}">
      <div class="description-div">
        <img src="./assets/icons/download.png" alt="icon" class="transaction-icon" />
        <h2 class="tran-category">${inc.category}</h2>
      </div>
      <div class="amount-date-div">
        <div class="amount-div">$${Number(inc.amount.toFixed(2)).toLocaleString("en-US")}</div>
        <div class="date-div caption">${inc.date}</div>
      </div>
    </div> 
    `;
  })

  // incPageIncGridContr.innerHTML = gridItems;

  displayGridItems(incomePageTransactionsDiv, "Recent Transactions",incPageIncGridContr, incomeGridItems, false, "No Transactions To Show", appState.transactions.length);

  incPageTotalIncElem.innerHTML = Number(updateTotalMonthlyIncome()).toLocaleString("en-US");
}

addIncTranBtn.addEventListener('click', () => {
  showPage('addTranscPage');
  openIncomeForm();
})


updateTotalMonthlyIncome();

displayGridItems(incomePageTransactionsDiv, "Recent Transactions",incPageIncGridContr, "", false, "No Transactions To Show", appState.transactions.length);

