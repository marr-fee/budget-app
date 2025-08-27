import { addIncomeForm, addExpeditureForm, incFrequencyGroup, expFrequencyGroup, recurringIncCheckbox, recurringExpCheckbox,incomeFrequency, expenseFrequency, emptyTransactions, showMoreTrans, transactionGridContainer, expenditureFormWrapper, incomeFormWrapper, formOptToggleBackgr, expenseCategory, investmentGroup, investmentCategory, investmentCryptoGroup, cryptoUnitsDiv, cryptoUnitsInput, recentTransDiv } from "./addTrans-dom.js";

import { appState } from "../../core/state.js";
import { addBudgetForm, budgetFrequencyGroup } from "../add-budget/add-budget-dom.js";
import { backgroundColors, displayGridItems } from "../../components/modal.js";
import { loanPaymentGroup, loanSubCategory } from "../loans.js";
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
        <div class="amount-div ${colorClass}">${sign}$${Number(item.amount.toFixed(2)).toLocaleString("en-US")}</div>
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
  displayGridItems(container, caption, gridContainer, gridItems, showMore, message, items.length);

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


export function renderRecentTransactions() {
  // UI toggles
  // emptyTransactions.style.display = appState.transactions.length === 0 ? "flex" : "none";
  // showMoreTrans.style.display = appState.transactions.length > 3 ? "flex" : "none";

  // take first 3 (newest)
  const latestTransactions = appState.transactions.slice(0, 3);

  renderItems({
    container: recentTransDiv,
    gridContainer: transactionGridContainer,
    items: latestTransactions,
    caption: "Recent Transactions",
    showMore: appState.transactions.length > 3,
    message: "No Transactions To Show"
  });

  // let transactionGridItems = "";
  // // build HTML (newest will be first element, so it appears at the top)
  // latestTransactions.forEach((tr) => {
  //   const randomIndex = Math.floor(Math.random() * backgroundColors.length);
  //   let randomBackgroundColor = backgroundColors[randomIndex];

  //   transactionGridItems += `
  //   <div class="trans-grid-item" data-id="${tr.id}">
  //     <div class="description-div">
  //       <div class="trans-category-img-contr" style="background-color: ${randomBackgroundColor}">
  //         <img src="assets/icons/freelancer.png" alt="icon" class="transaction-icon" />
  //       </div>
  //       <h2 class="tran-category">${tr.category}</h2>
  //     </div>
  //     <div class="amount-date-div">
  //       <div class="amount-div">$${Number(tr.amount.toFixed(2)).toLocaleString("en-US")}</div>
  //       <div class="date-div caption">${tr.date}</div>
  //     </div>
  //   </div>
  // `
  // })
  

  // const showMore = appState.transactions.length > 3 ? true : false;

  // // transactionGridContainer.innerHTML = transactionGridItems;

  // displayGridItems(recentTransDiv, "Recent Transactions",transactionGridContainer, transactionGridItems, showMore, "No Transactions To Show", appState.transactions.length);
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

