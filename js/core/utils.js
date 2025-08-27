// HELPER FUNCTIONS (FORMATTING, VALIDATIONS, ETC)
// RESUSABLE MODAL MANAGEMENT {pop ups}
import { notificationDiv, notificationMessageDiv, totalMonthlyBalance } from "../pages/dashboard.js";
import { updateTotalMonthlyExpense } from "../pages/expenditure.js";
import { updateTotalMonthlyIncome } from "../pages/income.js";




export function highlightErrors(inputs) {
  let hasError = false;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('input-error');
       // Shake only if there's an error
      input.classList.remove('shake'); // remove old animation
      void input.offsetWidth; // force reflow
      input.classList.add('shake'); // restart animation
      hasError = true;
    } else {
      input.classList.remove('input-error', 'shake');
    }
  });

  return !hasError; // returns true if all are valid
}
export function updateTotalMonthlyBalance() {
  let totalIncome = updateTotalMonthlyIncome();
  let totalExpense = updateTotalMonthlyExpense();

  let difference = ((Number(totalIncome) - Number(totalExpense)).toFixed(2));

  totalMonthlyBalance.textContent = Number(difference).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return difference;
}

updateTotalMonthlyBalance();


export function showNotification(message, isError) {

  notificationMessageDiv.innerHTML = message;

  notificationDiv.classList.add('active');
  notificationDiv.style.background = isError ? "linear-gradient(150deg, rgb(252, 252, 252), rgb(233, 232, 232))" : "linear-gradient(150deg, rgba(92, 179, 92, 0.64), rgba(34, 143, 34, 0.64))";
  notificationMessageDiv.style.color = isError ? "black" : "white";
  setTimeout(() => {
    notificationDiv.classList.remove('active');
  }, 3000);


}

// showNotification("Hello Mafi", false);