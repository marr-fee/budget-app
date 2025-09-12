import { displayGridItems } from "../../components/modal.js";
import { appState } from "../../core/state.js";
import { highlightErrors, showNotification } from "../../core/utils.js";
import { totalMonthlyIncomeElem } from "../dashboard.js";
import { addTransaction } from "./addTran-logic.js";
import { renderItems } from "./addTran-utils.js";
import { incomeAmount, incomeCategory, incomeDate, incomeFrequency, incomeNote, recurringIncCheckbox } from "./addTrans-dom.js";



export const incPageTotalIncElem = document.getElementById('income-totl');
export const incChartContainer = document.querySelector('.mon-total-inc-chart');
export const incPageIncGridContr = document.querySelector('.income-page-trans-grid-container');
export const addIncTranBtn = document.getElementById('inc-page-add-t-btn');
export const incomePageTransactionsDiv = document.getElementById('income-page-tran-div');


export function addIncome(){

  let isRecurring = recurringIncCheckbox.checked ? true : false;

  const requiredFields = [incomeCategory, incomeAmount];

  if (isRecurring) {
    requiredFields.push(incomeFrequency);
  } 

  if (
    !incomeCategory.value.trim() ||     
    isNaN(parseFloat(incomeAmount.value)) ||     
    parseFloat(incomeAmount.value) <= 0 ||  
    (isRecurring && !incomeFrequency.value.trim())   
  ) {
    highlightErrors(requiredFields);
    showNotification("Please fill the form properly", true);
    return;
  }
  const newIncome = {
    type: "income",
    id: Date.now(),
    category: incomeCategory.value.trim(),
    amount: parseFloat(incomeAmount.value),
    date: incomeDate.value || new Date().toISOString().split("T")[0],
    transactionDay: new Date(incomeDate.value || new Date()).getDate(),
    transactionMonth: new Date(incomeDate.value || new Date()).toLocaleString("default", { month: "long" }),
    isRecurring: isRecurring,
    frequency: incomeFrequency.value,
    note: incomeNote.value
  }

  appState.income.push(newIncome);
  addTransaction(newIncome);
  showNotification("Transaction Added ✔", false);
  updateTotalIncome();
  renderIncomeItems();  
  // saveAppState();

}




export function updateTotalIncome(){
  let totalIncome = 0;
  appState.income.forEach((inc) =>{
    totalIncome += Number(inc.amount);
  })

  totalMonthlyIncomeElem.textContent = Number(totalIncome.toFixed(2)).toLocaleString("en-US");

  return totalIncome;
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
