import { displayGridItems } from "../../components/modal.js";
import { appState } from "../../core/state.js";
import { saveData } from "../../core/storage.js";
import { highlightErrors, showNotification } from "../../core/utils.js";
import { renderBudgetOverview } from "../add-budget/add-budget-util.js";
import { totalMonthlyExpElem } from "../dashboard.js";
import { monitorPortfolio } from "../investments/crypto-logic.js";
import { loanSubCategory } from "../loans.js";
import { addTransaction } from "./addTran-logic.js";
import { renderItems } from "./addTran-utils.js";
import { cryptoUnitsInput, expenseAmount, expenseCategory, expenseDate, expenseFrequency, expenseNote, investmentCategory, investmentCryptoGroup, recurringExpCheckbox, savingsTitle } from "./addTrans-dom.js";


export const expPageTotalExpElem = document.getElementById('expense-totl');
export const expChartContainer = document.querySelector('.mon-total-exp-chart');
export const expPageExpGridContr = document.querySelector('.expense-page-trans-grid-container');
export const addExpTranBtn = document.getElementById('exp-page-add-t-btn');
export const expencePageTranDiv = document.getElementById('expense-page-tran-div');


export function addExpenditure(){
  let isInvestment = expenseCategory.value === "investment";
  let isSavings = expenseCategory.value === "savings";
  let isCryptoInvestment = isInvestment && investmentCategory.value === "crypto";
  let passedCryptoValidation = false;
  let isRecurring = recurringExpCheckbox.checked ? true : false;
  let isLoanPayment = expenseCategory.value === "Loan Payment";
  

  const requiredFields = [expenseCategory, expenseAmount];
    
    if (isRecurring) {
      requiredFields.push(expenseFrequency);
    }
    if (isSavings) {
      requiredFields.push(savingsTitle);
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
      (isInvestment && !investmentCategory.value.trim() || isSavings && !savingsTitle.value.trim())
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
    transactionDay: new Date(expenseDate.value || new Date()).getDate(),
    transactionMonth: new Date(expenseDate.value || new Date()).toLocaleString("default", { month: "long" }),
    isRecurring: isRecurring,
    frequency: expenseFrequency.value,
    note: expenseNote.value,
    loanCategory: isLoanPayment ? loanSubCategory.value : null
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

    appState.isAssetAdded = true;
    
  }

  if (isSavings) {

    const newSaving = {
      id: Date.now(),
      title: savingsTitle.value.trim(),
      amount: parseFloat(expenseAmount.value)
    };

    appState.savings.push(newSaving);

    // recalc total savings
    const totalSavings = appState.savings.reduce((sum, s) => sum + s.amount, 0);
    appState.assets.cash -= newSaving.amount; 
    appState.assets.savings = totalSavings;
    
    showNotification(`Saved towards "${savingsTitle}" ✔`, false);
  }

  if (!appState.isSettingBaseValues) {
    appState.expenditure.push(newExpense);
  }
  
  addTransaction(newExpense);
  showNotification("Transaction Added ✔", false);
  renderExpenseItems();
  updateTotalExpense();
  renderBudgetOverview();
  monitorPortfolio();
  saveData()
  // saveAppState();

}

export function updateTotalExpense(){
  let totalExpense = 0;
  appState.expenditure.forEach((exp) =>{
    totalExpense += Number(exp.amount);
  })
  totalMonthlyExpElem.textContent = Number(totalExpense.toFixed(2)).toLocaleString("en-US");

  return totalExpense;
}

export function renderExpenseItems() {

    renderItems({
      container: expencePageTranDiv,
      gridContainer: expPageExpGridContr,
      items: appState.expenditure,
      caption: "Expenses",
      showMore: false,
      message: "No Transactions To Show",
      totalElem: expPageTotalExpElem,
      totalCalcFn: updateTotalExpense
    });

}


updateTotalExpense();

displayGridItems(expencePageTranDiv, "Recent Transactions",expPageExpGridContr, "", false, "No Transactions To Show", appState.transactions.length);