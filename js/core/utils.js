// HELPER FUNCTIONS (FORMATTING, VALIDATIONS, ETC)
// RESUSABLE MODAL MANAGEMENT {pop ups}
import { notificationDiv, notificationMessageDiv, totalMonthlyBalance } from "../pages/dashboard.js";
import { updateTotalExpense } from "../pages/expenditure.js";
import { updateTotalIncome } from "../pages/income.js";




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
export function updateTotalAvailableBalance() {
  let totalIncome = updateTotalIncome();
  let totalExpense = updateTotalExpense();

  let difference = ((Number(totalIncome) - Number(totalExpense)).toFixed(2));

  totalMonthlyBalance.textContent = Number(difference).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return difference;
}

updateTotalAvailableBalance();


export function showNotification(message, isError) {

  notificationMessageDiv.innerHTML = message;

  notificationDiv.classList.add('active');
  notificationDiv.style.background = isError ? "#e74c3c" : "#27ae60";
  notificationMessageDiv.style.color = isError ? "black" : "white";
  setTimeout(() => {
    notificationDiv.classList.remove('active');
  }, 3000);


}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

