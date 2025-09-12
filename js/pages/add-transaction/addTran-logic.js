import { appState } from "../../core/state.js";

import { openExpenseForm, openIncomeForm, renderRecentTransactions, resetForms, setDefaultToday, showForm } from "./addTran-utils.js";

import { addExpeditureForm, addExpenditureBtn, addIncomeBtn, addIncomeForm, expenseCategory, expenseDate, expenseFormOption, incomeDate, incomeFormOption, investmentCategory, investmentGroup } from "./addTrans-dom.js";
import { updateTotalAvailableBalance } from "../../core/utils.js";
import { goBack } from "../../core/navigetion.js";
import { getExpenseDataByMonth, getIncomeDataByMonth, renderComparisonChart, renderExpenseChart, renderIncomeChart } from "../stats.js";
import { highlightErrors } from "../../core/utils.js";
import { renderBudgetOverview } from "../add-budget/add-budget-util.js";
import { monitorPortfolio } from "../investments/crypto-logic.js";
import { handleAddTransaction, loanSubCategory } from "../loans.js";
import {updateNetWorth } from "../networth.js";
import { netWorthPageAddInvesBtn } from "../investments/crypto-dom.js";
import { addExpenditure } from "./add-expenditure.js";
import { addIncome } from "./add-income.js";
// overviewPageCanvas

export function addTransaction(newTx) {

  if (!appState.isSettingBaseValues) {
    // put newest at index 0
    appState.transactions.unshift(newTx);

    // keep array capped to MAX_HISTORY (e.g. 100)
    const MAX_HISTORY = 100;
    if (appState.transactions.length > MAX_HISTORY) {
      appState.transactions.pop(); // remove oldest at the end
    }
    
    handleAddTransaction(newTx);
    // saveAppState();
    renderRecentTransactions();

    if (appState.calcNetWorth) {
      updateNetWorth();
    }
    updateTotalAvailableBalance();
  }
  goBack();
}

expenseFormOption.addEventListener('click', () => {
  openExpenseForm();
})

incomeFormOption.addEventListener('click', () => {
  openIncomeForm();
})



addIncomeBtn.addEventListener('click', (event) => {
  event.preventDefault();
  addIncome();
})

addExpenditureBtn.addEventListener('click', (event) => {
  event.preventDefault();
  addExpenditure();
})


document.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('input', () => {
    if (el.value.trim()) {
      el.classList.remove('input-error');
      el.classList.remove('shake');
    }
  });
});

// to allow for one checkbox checket at a time
document.querySelectorAll('input[type="checkbox"][data-group]').forEach(checkbox => {
  checkbox.addEventListener('click', (event) => {
    const clicked = event.target;
    const group = clicked.dataset.group;

    if (clicked.checked) {
      document.querySelectorAll(`input[type="checkbox"][data-group="${group}"]`).forEach(cb => {
        if (cb !== clicked) {
          cb.checked = false;
        }
      })
    }
    
  })

})

netWorthPageAddInvesBtn.addEventListener('click', () =>{
  appState.isSettingBaseValues = true;
  openExpenseForm();
  expenseCategory.value = "investment";
  investmentGroup.style.display = "flex";
  investmentCategory.setAttribute("required", "required");
})

showForm(addIncomeForm, addExpeditureForm);
setDefaultToday(incomeDate);
setDefaultToday(expenseDate);

