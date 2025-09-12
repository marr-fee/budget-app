import { addIncomeForm, addExpeditureForm, incFrequencyGroup, expFrequencyGroup, recurringIncCheckbox, recurringExpCheckbox,incomeFrequency, expenseFrequency, emptyTransactions, showMoreTrans, transactionGridContainer, expenditureFormWrapper, incomeFormWrapper, formOptToggleBackgr, expenseCategory, investmentGroup, investmentCategory, investmentCryptoGroup, cryptoUnitsDiv, cryptoUnitsInput, recentTransDiv, transHisPageTransDiv, transHisPageTransGridCntr, savingsGroup, savingsTitle } from "./addTrans-dom.js";

import { appState } from "../../core/state.js";
import { addBudgetForm, budgetFrequencyGroup } from "../add-budget/add-budget-dom.js";
import { backgroundColors, displayGridItems } from "../../components/modal.js";
import { loanForm, loanPageloansForm, loanPaymentGroup, loanSubCategory } from "../loans.js";
import { updateTotalAvailableBalance } from "../../core/utils.js";
import { signInForm, signUpForm } from "../../core/log-in.js";
import { addCashForm } from "../networth.js";
import { changePasswordForm, editProfileform } from "../profile.js";
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


export function clearErrorHighlights(form) {
  const inputs = form.querySelectorAll('.input-error');
  inputs.forEach(input => {
    input.classList.remove('input-error');
    input.classList.remove('shake');
  });
}

export function createGridItem(item) {
  const color = assignColor(item);

  let sign = "";
  let colorClass = "";
  if (item.type === "income") {
    sign = "+";
    colorClass = "amount-income";
  } else if (item.type === "expenditure") {
    sign = "−";
    colorClass = "amount-expense";
  }

  return `
    <div class="trans-grid-item" data-id="${item.id}">
      <div class="description-div">
        <div class="trans-category-img-contr" style="background-color: ${color}">
          <img src="assets/icons/freelancer.png" alt="icon" class="transaction-icon" />
        </div>
        <h2 class="tran-category">${item.category}</h2>
      </div>
      <div class="amount-date-div">
        <div class="amount-div ${colorClass}">${sign}${Number(item.amount.toFixed(2)).toLocaleString("en-US")} kr</div>
        <div class="date-div caption">${item.date}</div>
      </div>
    </div>`;
}

export function renderItems({ container, gridContainer, items, caption, showMore, message, totalElem, totalCalcFn }) {
  // build grid items HTML
  let gridItems = '';
  items.forEach((item) => {
    gridItems += createGridItem(item);
  });

  
  // send it to your existing display function
  displayGridItems(container, caption, gridContainer, gridItems, showMore, message, appState.transactions.length);

  // update totals if provided
  if (totalElem && totalCalcFn) {
    totalElem.innerHTML = Number(totalCalcFn()).toLocaleString("en-US");
  }
}

export function assignColor(item) {
  if (!item.color) {
    const randomIndex = Math.floor(Math.random() * backgroundColors.length);
    item.color = backgroundColors[randomIndex];
  }
  return item.color;
}


export function renderRecentTransactions({showAll = false} = {}) {

  // take first 3 (newest)
  const latestTransactions = appState.transactions.slice(0, 3);

  const fullTransactionList = appState.transactions;

  const transactionListToRender = showAll ? fullTransactionList : latestTransactions;

  if (!showAll) {
    const showMore = appState.transactions.length > 3;

    renderItems({
      container: recentTransDiv,
      gridContainer: transactionGridContainer,
      items: transactionListToRender,
      caption: "Recent Transactions",
      showMore: appState.transactions.length > 3,
      message: "No Transactions To Show",
      totalElem: null,
      totalCalcFn: updateTotalAvailableBalance
    });

    if (showMore) {
      showMoreTrans.style.display = "block";
      
    } else {
      showMoreTrans.style.display = "none";
    }
  } else{
    renderItems({
      container: transHisPageTransDiv,
      gridContainer: transHisPageTransGridCntr,
      items: transactionListToRender,
      caption: "Recent Transactions",
      showMore: false,
      message: "No Transactions To Show",
      totalElem: null,
      totalCalcFn: updateTotalAvailableBalance
    });
  }

}

export function resetSubForms(){
  incFrequencyGroup.style.display = 'none';
  expFrequencyGroup.style.display = 'none';
  budgetFrequencyGroup.style.display = 'none';
  investmentCryptoGroup.style.display = "none";
  cryptoUnitsDiv.style.display = "none";
  investmentGroup.style.display = "none";
  investmentCategory.value = "";
  loanPaymentGroup.style.display = "none";
  loanSubCategory.value = "";
  savingsGroup.style.display ="none";
  savingsTitle.value = "";
};

export function resetForms() {
  clearErrorHighlights(addIncomeForm);
  clearErrorHighlights(addExpeditureForm);
  clearErrorHighlights(addBudgetForm);
  clearErrorHighlights(signInForm);
  clearErrorHighlights(signUpForm);
  clearErrorHighlights(addCashForm);
  clearErrorHighlights(editProfileform);
  clearErrorHighlights(changePasswordForm);
  clearErrorHighlights(loanPageloansForm);
  addIncomeForm.reset();
  addExpeditureForm.reset();
  addBudgetForm.reset();
  signInForm.reset();
  signUpForm.reset();
  addCashForm.reset();
  loanPageloansForm.reset();
  changePasswordForm.reset();
  editProfileform.reset();
  resetSubForms();
}

recurringExpCheckbox.addEventListener("change", () => {
  expFrequencyGroup.style.display = recurringExpCheckbox.checked ? "block" : "none";
  if (recurringExpCheckbox.checked) {
    expenseFrequency.setAttribute("required", "required"); 
  } else {
    expenseFrequency.removeAttribute("required"); 
  }
});

recurringIncCheckbox.addEventListener("change", () => {
  incFrequencyGroup.style.display = recurringIncCheckbox.checked ? "block" : "none";
  if (recurringIncCheckbox.checked) {
    incomeFrequency.setAttribute("required", "required"); 
  } else {
    incomeFrequency.removeAttribute("required"); 
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


    savingsGroup.style.display = expenseCategory.value === "savings" ? "block" : "none";
    
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

renderRecentTransactions()