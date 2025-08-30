// INCOME PAGE LOGIC

import { displayGridItems } from "../components/modal.js";
import { showPage } from "../core/navigetion.js";
import { appState } from "../core/state.js";
import { openIncomeForm, renderItems } from "./add-transaction/addTran-utils.js";
import { totalMonthlyIncomeElem } from "./dashboard.js";


export const incPageTotalIncElem = document.getElementById('income-totl');
export const incChartContainer = document.querySelector('.mon-total-inc-chart');
export const incPageIncGridContr = document.querySelector('.income-page-trans-grid-container');
export const addIncTranBtn = document.getElementById('inc-page-add-t-btn');
export const incomePageTransactionsDiv = document.getElementById('income-page-tran-div');


export function updateTotalIncome(){
  let totalMonthlyIncome = 0;
  appState.income.forEach((inc) =>{
    totalMonthlyIncome += Number(inc.amount);
  })

  totalMonthlyIncomeElem.textContent = Number(totalMonthlyIncome.toFixed(2)).toLocaleString("en-US");

  return totalMonthlyIncome;
}

export function renderIncomeItems() {

   renderItems({
    container: incomePageTransactionsDiv,
    gridContainer: incPageIncGridContr,
    items: appState.income,
    caption: "Income",
    showMore: false,
    message: "No Transactions To Show",
    totalElem: incPageTotalIncElem,
    totalCalcFn: updateTotalIncome
  });
}

updateTotalIncome();

displayGridItems(incomePageTransactionsDiv, "Recent Transactions",incPageIncGridContr, "", false, "No Transactions To Show", appState.transactions.length);

