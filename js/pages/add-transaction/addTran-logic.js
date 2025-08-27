import { appState } from "../../core/state.js";
import { renderIncomeItems, updateTotalMonthlyIncome } from "../income.js";
import { renderExpenseItems, updateTotalMonthlyExpense } from "../expenditure.js";
import { openExpenseForm, openIncomeForm, renderRecentTransactions, resetForms, setDefaultToday, showForm } from "./addTran-utils.js";

import { addExpeditureForm, addExpenditureBtn, addIncomeBtn, addIncomeForm, cryptoUnitsInput, expenditureFormWrapper, expenseAmount, expenseCategory, expenseDate, expenseFormOption, expenseFrequency, expenseNote, formOptToggleBackgr, incomeAmount, incomeCategory, incomeDate, incomeFormOption, incomeFormWrapper, incomeFrequency, incomeNote, investmentCategory, investmentCryptoGroup, recurringExpCheckbox, recurringIncCheckbox } from "./addTrans-dom.js";
import { showNotification, updateTotalMonthlyBalance } from "../../core/utils.js";
import { goBack } from "../../core/navigetion.js";
import { getExpenseDataByMonth, getIncomeDataByMonth, renderComparisonChart, renderExpenseChart, renderIncomeChart } from "../stats.js";
// import { renderBudgetOverview } from "../add-budget.js";
import { highlightErrors } from "../../core/utils.js";
import { renderBudgetOverview } from "../add-budget/add-budget-util.js";
import { monitorPortfolio } from "../investments/crypto-logic.js";
import { handleAddTransaction, loanSubCategory } from "../loans.js";
import { updateFinances } from "../networth.js";
// overviewPageCanvas

export function addTransaction(newTx) {
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
  updateFinances();
}

export function addIncome(){

  let isRecurring = recurringIncCheckbox.checked ? true : false;

  const requiredFields = [incomeCategory, incomeAmount];

   // If recurring, frequency is also required
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
    isRecurring: isRecurring,
    frequency: incomeFrequency.value,
    note: incomeNote.value
  }

  appState.income.push(newIncome);
  addTransaction(newIncome);
  showNotification("Transaction Added ✔", false);
  updateTotalMonthlyIncome();
  updateTotalMonthlyBalance();
  renderRecentTransactions();
  renderIncomeItems();
  renderIncomeChart(getIncomeDataByMonth());
  addIncomeForm.reset();
  
  // saveAppState();
  goBack();
}

export function addExpenditure(){
  let isInvestment = expenseCategory.value === "investment";
  let isCryptoInvestment = isInvestment && investmentCategory.value === "crypto";
  let passedCryptoValidation = false;
  let isRecurring = recurringExpCheckbox.checked ? true : false;
  let isLoanPayment = expenseCategory.value === "Loan Payment";
  

  const requiredFields = [expenseCategory, expenseAmount];
    
    if (isRecurring) {
      requiredFields.push(expenseFrequency);
    }

    if (isInvestment) requiredFields.push(investmentCategory);
    if (isLoanPayment) requiredFields.push(loanSubCategory);

    // crypto group validation
    if (isCryptoInvestment) {
      const cryptoOptions = document.querySelectorAll('input[type="checkbox"][data-group="cryptos"]');
      const oneChecked = Array.from(cryptoOptions).some(cb => cb.checked);

      if (!oneChecked) {
        investmentCryptoGroup.classList.add("input-error", "shake");
        setTimeout(() => investmentCryptoGroup.classList.remove("shake"), 300);
        showNotification("Please select a cryptocurrency", true);

        return;
      } else {

        investmentCryptoGroup.classList.remove("input-error", "shake"); 
        
        passedCryptoValidation = true;
      }

      // requiredFields.push(cryptoUnitsInput);
    }

    // Normal input validation
    if (
      !expenseCategory.value.trim() ||
      isNaN(parseFloat(expenseAmount.value)) ||
      parseFloat(expenseAmount.value) <= 0 ||
      (isRecurring && !expenseFrequency.value.trim()) ||
      (isInvestment && !investmentCategory.value.trim())
    ) {
      highlightErrors(requiredFields);
      showNotification("Please fill the form properly", true);
      return;
    }

  const newExpense = {
    type: "expenditure",
    id: Date.now(),
    category: expenseCategory.value,
    amount: parseFloat(expenseAmount.value),
    date: expenseDate.value || new Date().toISOString().split("T")[0],
    isRecurring: isRecurring,
    frequency: expenseFrequency.value,
    note: expenseNote.value
  }



  if (isCryptoInvestment && passedCryptoValidation) {
    const imageObj = {
        "ETH": 'assets/icons/ethereum(1).png',
        "BTC": 'assets/icons/bitcoin.png',
        "XRP": 'assets/icons/xrp.png',
        "ADA": 'assets/icons/cardano.png',
        "SOL": 'assets/icons/solana.png',
        "BNB": 'assets/icons/money.png',
        "USDC": 'assets/icons/usdc.png'
      }
      // Get only the checked ones
      const checkedCrypto = Array.from(
        document.querySelectorAll('input[type="checkbox"][data-group="cryptos"]:checked')
      ).map(cb => cb.value)[0]; // pick the first checked value

      const newCryptoObj = {
        symbol: checkedCrypto, 
        purchaseCost: Number(expenseAmount.value), 
        unitsHeld: Number(cryptoUnitsInput.value), 
        image: imageObj[checkedCrypto]
      };

    const existingCrypto = appState.myCryptos.findIndex(crypto => crypto.symbol === newCryptoObj.symbol)
    if (existingCrypto !== -1) {
    appState.myCryptos[existingCrypto].purchaseCost += newCryptoObj.purchaseCost;
    } else {
      appState.myCryptos.push(newCryptoObj);    
    }  
    
  }
  
  appState.expenditure.unshift(newExpense);
  addTransaction(newExpense);
  showNotification("Transaction Added ✔", false);
  renderRecentTransactions();
  renderExpenseItems();
  updateTotalMonthlyBalance();
  updateTotalMonthlyExpense();
  renderExpenseChart(getExpenseDataByMonth());
  addExpeditureForm.reset();
  renderBudgetOverview();
  monitorPortfolio();

  // saveAppState();
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
  // renderComparisonChart(overviewPageCanvas);
})

addExpenditureBtn.addEventListener('click', (event) => {
  event.preventDefault();
  addExpenditure();
  // renderComparisonChart(overviewPageCanvas);

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

showForm(addIncomeForm, addExpeditureForm);
setDefaultToday(incomeDate);
setDefaultToday(expenseDate);

