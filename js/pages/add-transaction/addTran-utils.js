import { addIncomeForm, addExpeditureForm, incFrequencyGroup, expFrequencyGroup, recurringIncCheckbox, recurringExpCheckbox,incomeFrequency, expenseFrequency, emptyTransactions, showMoreTrans, transactionGridContainer, expenditureFormWrapper, incomeFormWrapper, formOptToggleBackgr, expenseCategory, investmentGroup, investmentCategory, investmentCryptoGroup, cryptoUnitsDiv, cryptoUnitsInput, recentTransDiv } from "./addTrans-dom.js";

import { appState } from "../../core/state.js";
import { addBudgetForm, budgetFrequencyGroup } from "../add-budget/add-budget-dom.js";
import { displayGridItems } from "../../components/modal.js";
// import { addBudgetForm, budgetFrequencyGroup } from "../add-budget.js";


export function openIncomeForm() {
    formOptToggleBackgr.classList.remove('active');
    incomeFormWrapper.style.display = 'flex';
    expenditureFormWrapper.style.display = 'none';
    showForm(addIncomeForm, addExpeditureForm);
    resetForms();
}

export function openExpenseForm() {
    formOptToggleBackgr.classList.add('active');
    incomeFormWrapper.style.display = 'none';
    expenditureFormWrapper.style.display = 'flex';
    showForm(addExpeditureForm, addIncomeForm);
    resetForms();
}


export function showForm(formToShow, formToHide) {
  // Show the chosen form
  formToShow.style.display = "flex";
  toggleRequired(formToShow, true);

  // Hide the other form
  formToHide.style.display = "none";
  toggleRequired(formToHide, false);
}

export function toggleRequired(form, enable) {
  const inputs = form.querySelectorAll("input, select, textarea");

  inputs.forEach(input => {
    if (enable) {
      // Restore only if it was originally required
      if (input.dataset.wasRequired === "true") {
        input.setAttribute("required", "required");
      }
    } else {
      // Store original required status, then remove it
      if (input.hasAttribute("required")) {
        input.dataset.wasRequired = "true";
        input.removeAttribute("required");
      } else {
        input.dataset.wasRequired = "false";
      }
    }
  });
}
export function setDefaultToday(input) {
  const today = new Date();
  input.value = today.toISOString().split("T")[0];
}

//export function highlightErrors(inputs) {
//  let hasError = false;
//
//  inputs.forEach(input => {
//    if (!input.value.trim()) {
//      input.classList.add('input-error');
       // Shake only if there's an error
//      input.classList.remove('shake'); // remove old animation
//      void input.offsetWidth; // force reflow
//      input.classList.add('shake'); // restart animation
//      hasError = true;
//    } else {
//      input.classList.remove('input-error', 'shake');
//    }
//  });

//  return !hasError; // returns true if all are valid
//}

export function clearErrorHighlights(form) {
  const inputs = form.querySelectorAll('.input-error');
  inputs.forEach(input => {
    input.classList.remove('input-error');
    input.classList.remove('shake');
  });
}

export function renderRecentTransactions() {
  // UI toggles
  // emptyTransactions.style.display = appState.transactions.length === 0 ? "flex" : "none";
  // showMoreTrans.style.display = appState.transactions.length > 3 ? "flex" : "none";

  // take first 3 (newest)
  const latestTransactions = appState.transactions.slice(0, 3);

  // build HTML (newest will be first element, so it appears at the top)
  const transactionGridItems = latestTransactions.map(transaction => `
    <div class="trans-grid-item" data-id="${transaction.id}">
      <div class="description-div">
        <img src="./assets/icons/download.png" alt="icon" class="transaction-icon" />
        <h2 class="tran-category">${transaction.category}</h2>
      </div>
      <div class="amount-date-div">
        <div class="amount-div">$${Number(transaction.amount.toFixed(2)).toLocaleString("en-US")}</div>
        <div class="date-div caption">${transaction.date}</div>
      </div>
    </div>
  `).join("");

  const showMore = appState.transactions.length > 3 ? true : false;

  // transactionGridContainer.innerHTML = transactionGridItems;

  displayGridItems(recentTransDiv, "Recent Transactions",transactionGridContainer, transactionGridItems, showMore, "No Transactions To Show", appState.transactions.length);
}

export function resetSubForms(){
  incFrequencyGroup.style.display = 'none';
  expFrequencyGroup.style.display = 'none';
  budgetFrequencyGroup.style.display = 'none';
  investmentCryptoGroup.style.display = "none";
  cryptoUnitsDiv.style.display = "none";
  investmentGroup.style.display = "none";
  investmentCategory.value = "";
};

export function resetForms() {
  clearErrorHighlights(addIncomeForm);
  clearErrorHighlights(addExpeditureForm);
  clearErrorHighlights(addBudgetForm);
  addIncomeForm.reset();
  addExpeditureForm.reset();
  addBudgetForm.reset();
  resetSubForms();
}

recurringExpCheckbox.addEventListener("change", () => {
  expFrequencyGroup.style.display = recurringExpCheckbox.checked ? "block" : "none";
  if (recurringExpCheckbox.checked) {
    expenseFrequency.setAttribute("required", "required"); // make it required
  } else {
    expenseFrequency.removeAttribute("required"); // remove requirement
  }
});
recurringIncCheckbox.addEventListener("change", () => {
  incFrequencyGroup.style.display = recurringIncCheckbox.checked ? "block" : "none";
  if (recurringIncCheckbox.checked) {
    incomeFrequency.setAttribute("required", "required"); // make it required
  } else {
    incomeFrequency.removeAttribute("required"); // remove requirement
  }
});


expenseCategory.addEventListener("change", () => {
  if (expenseCategory.value === "investment") {
    investmentGroup.style.display = "flex";
    investmentCategory.setAttribute("required", "required");
  } else {
    investmentGroup.style.display = "none";
    investmentCategory.value = "";
    investmentCategory.removeAttribute("required");
    investmentCryptoGroup.style.display = "none";
    cryptoUnitsDiv.style.display = "none";
    cryptoUnitsInput.value = '';

    document.querySelectorAll('input[type="checkbox"][data-group]').forEach(checkbox => {

      checkbox.checked = false;
 
    })
  }
});


investmentCategory.addEventListener("change", () => {
  if (investmentCategory.value === "crypto") {
    investmentCryptoGroup.style.display = "flex";
    cryptoUnitsDiv.style.display = "flex";
    
  } else {
    investmentCryptoGroup.style.display = "none";
    cryptoUnitsDiv.style.display = "none";
  }
});

