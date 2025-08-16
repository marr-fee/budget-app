// EXPENSE PAGE LOGIC
import { displayGridItems } from "../components/modal.js";
import { showPage } from "../core/navigetion.js";
import { appState } from "../core/state.js";
import { openExpenseForm } from "./add-transaction/addTran-utils.js";
import { totalMonthlyExpElem } from "./dashboard.js";

export const expPageTotalExpElem = document.getElementById('expense-totl');
export const expChartContainer = document.querySelector('.mon-total-exp-chart');
export const expPageExpGridContr = document.querySelector('.expense-page-trans-grid-container');
export const addExpTranBtn = document.getElementById('exp-page-add-t-btn');
export const expencePageTranDiv = document.getElementById('expense-page-tran-div');

export function updateTotalMonthlyExpense(){
  let totalMonthlyExpense = 0;
  appState.expenditure.forEach((exp) =>{
    totalMonthlyExpense += Number(exp.amount);
  })
  totalMonthlyExpElem.textContent = Number(totalMonthlyExpense.toFixed(2)).toLocaleString("en-US");

  return totalMonthlyExpense;
}

export function renderExpenseItems() {
  let expenseGridItems = '';
  appState.expenditure.forEach((exp) => {
    expenseGridItems += `
         <div class="trans-grid-item" data-id="${exp.id}">
      <div class="description-div">
        <img src="./assets/icons/download.png" alt="icon" class="transaction-icon" />
        <h2 class="tran-category">${exp.category}</h2>
      </div>
      <div class="amount-date-div">
        <div class="amount-div">$${Number(exp.amount.toFixed(2)).toLocaleString("en-US")}</div>
        <div class="date-div caption">${exp.date}</div>
      </div>
    </div> 
    `;
  })
  
  displayGridItems(expencePageTranDiv, "Recent Transactions",expPageExpGridContr, expenseGridItems, false, "No Transactions To Show", appState.transactions.length);

  // expPageExpGridContr.innerHTML = gridItems;
  expPageTotalExpElem.innerHTML = Number(updateTotalMonthlyExpense()).toLocaleString("en-US");
}

addExpTranBtn.addEventListener('click', () => {
  showPage('addTranscPage');
  openExpenseForm();
})

updateTotalMonthlyExpense();

displayGridItems(expencePageTranDiv, "Recent Transactions",expPageExpGridContr, "", false, "No Transactions To Show", appState.transactions.length);



