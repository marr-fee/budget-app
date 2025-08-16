import { highlightErrors } from "../../core/utils.js";
import { goBack } from "../../core/navigetion.js";
import { appState } from "../../core/state.js";
import { showNotification } from "../../core/utils.js";
import { addBudgetForm, budgetAmount, budgetCategory, budgetDate, budgetFrequency, budgetOverviewGridContainer, dashboardBudgetCntr, recurringBudgetCheckbox } from "./add-budget-dom.js";
import { setDefaultToday } from "../add-transaction/addTran-utils.js";
import { displayGridItems } from "../../components/modal.js";


export function addBudget(){

  let isRecurring = recurringBudgetCheckbox.checked ? true : false;

  const requiredFields = [budgetCategory, budgetAmount];

   // If recurring, frequency is also required
  if (isRecurring) {
    requiredFields.push(budgetFrequency);
  } 

  if (
    !budgetCategory.value.trim() ||     
    isNaN(parseFloat(budgetAmount.value)) ||     
    parseFloat(budgetAmount.value) <= 0 ||  
    (isRecurring && !budgetFrequency.value.trim())   
  ) {
    highlightErrors(requiredFields);
    showNotification("Please fill the form properly", true);
    return;
  }
  const newBudget = {
    type: "budget",
    id: Date.now(),
    category: budgetCategory.value.trim(),
    amount: parseFloat(budgetAmount.value),
    date: budgetDate.value || new Date().toISOString().split("T")[0],
    isRecurring: isRecurring,
    frequency: budgetFrequency.value,
  }

  appState.budgets.unshift(newBudget);
  // addTransaction(newBudget);
  showNotification("Budget Added ✔", false);
  // updateTotalMonthlyIncBudget
  // updateTotalMonthlyBalance();
  // renderRecentTransactions();
  addBudgetForm.reset();

  // saveAppState();
  goBack();
  
}

setDefaultToday(budgetDate);

// displayGridItems(dashboardBudgetCntr, "",budgetOverviewGridContainer, "", false, "No Budgets Added", appState.budgets.length);
