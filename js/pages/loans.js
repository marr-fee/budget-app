import { displayGridItems, highlightErrors } from "../components/modal.js";
import { goBack } from "../core/navigetion.js";
import { appState } from "../core/state.js";
import { showNotification } from "../core/utils.js";
import { expenseAmount, expenseCategory } from "./add-transaction/addTrans-dom.js";




// Ensure loans array exists in appState
if (!appState.loans) {
  appState.loans = [];
}

export const loansPage = document.getElementById("loans-page");
export const loansContainer = document.getElementById("loans-container");
export const addLoanBtn = document.getElementById("add-loan-btn");
export const loanForm = document.getElementById("loan-form");
export const submitLoanBtn = document.getElementById("submit-loan-btn");
export const loanCategory = document.getElementById("loan-category-input");
export const loanAmountLeft = document.getElementById("loan-total-amount");
export const loanMonthlyPayment = document.getElementById("loan-monthly-payment");
export const loanPaymentGroup = document.querySelector('.loan-options-group');
export const loanSubCategory = document.getElementById('loan-subcategory');

// === RENDER LOANS ===
export function renderLoans() {
  let loanItemsHTML = "";

  appState.loans.forEach((loan, i) => {
    loanItemsHTML += `
      <div class="loan-card" data-index="${i}">
        <div class="loan-card-header">
          <h4>${loan.category}</h4>
        </div>
        <div class="loan-card-body">
          <div class="loan-info">
            <span class="label">Amount Left:</span>
            <span class="value">$${loan.amountLeft.toLocaleString()}</span>
          </div>
          <div class="loan-info">
            <span class="label">Monthly Payment:</span>
            <span class="value">$${loan.monthlyPayment.toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;
  });

  displayGridItems(
    loansContainer,
    "My Loans",
    document.createElement("div"),
    loanItemsHTML,
    false,
    "No loans yet",
    appState.loans.length
  );
}

// === SUBMIT LOAN ===
submitLoanBtn.addEventListener("click", () => {

  const requiredFields = [loanCategory, loanAmountLeft, loanMonthlyPayment];

  if (
    !loanCategory.value.trim() || 
    parseFloat(loanAmountLeft.value) <= 0 || 
    isNaN(parseFloat(loanAmountLeft.value)) || 
    parseFloat(loanMonthlyPayment.value) <= 0 || 
    isNaN(parseFloat(loanMonthlyPayment.value))){

      highlightErrors(requiredFields);
      showNotification("Please fill all fields", true);
      return;
  }

  const newLoanObject = {
    id: Date.now(),
    category: loanCategory.value,
    amountLeft: Number(loanAmountLeft.value),
    monthlyPayment: Number(loanMonthlyPayment.value)
  };

  appState.loans.push(newLoanObject);
  renderLoans();
  updateLoanSubCategories();

  // hide form + clear
  loanForm.classList.add("hidden");
  loanCategory.value = "";
  loanAmountLeft.value = "";
  loanMonthlyPayment.value = "";

  updateExpenseCategories();
  goBack()
});

// === UPDATE TRANSACTION FORM ===
export function updateExpenseCategories() {
  const expCategorySelect = document.getElementById("exp-category");
  if (!expCategorySelect) return;

  // Ensure Loan Payment option exists
  let loanPaymentOption = Array.from(expCategorySelect.options).find(opt => opt.value === "Loan Payment");
  if (!loanPaymentOption) {
    const opt = document.createElement("option");
    opt.value = "Loan Payment";
    opt.textContent = "Loan Payment";
    expCategorySelect.appendChild(opt);
  }

  // Attach listener to show loan sub-category select
  expCategorySelect.addEventListener("change", (e) => {
    if (e.target.value === "Loan Payment") {
      loanPaymentGroup.style.display = "flex";
      loanSubCategory.setAttribute("required", "required");

      // listen for sub-category change
      loanSubCategory.addEventListener("change", (event) => {
        const selectedCategory = event.target.value;

        // find loan that matches the category
        const loan = appState.loans.find(l => l.category === selectedCategory);

        if (loan) {
          expenseAmount.value = loan.monthlyPayment;
        }
      });
    } else {
      loanPaymentGroup.style.display = "none";
      loanSubCategory.value = "";
      loanSubCategory.removeAttribute("required");
    }

  
  });

}

export function updateLoanSubCategories() {
  // clear existing options
  loanSubCategory.innerHTML = "";

  // default placeholder option
  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "-- Select Loan --";
  loanSubCategory.appendChild(defaultOpt);

  // loop through loans and add each category as an option
  appState.loans.forEach((loan) => {
    const opt = document.createElement("option");
    opt.value = loan.category;
    opt.textContent = loan.category;
    loanSubCategory.appendChild(opt);
  });
}


// === HOOK INTO ADD TRANSACTION ===
export function handleAddTransaction(transaction) {
  if (transaction.category === "Loan Payment" && transaction.loanCategory) {
    const loan = appState.loans.find(l => l.category === transaction.loanCategory);
    if (loan) {
      loan.amountLeft -= transaction.amount;
      if (loan.amountLeft < 0) loan.amountLeft = 0;
      renderLoans();
    }
  }
}


displayGridItems(
  loansContainer,
  "My Loans",
  document.createElement("div"),
  "",
  false,
  "You habe no active loans",
  appState.loans.length
);


