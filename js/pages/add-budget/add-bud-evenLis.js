import { showPage } from "../../core/navigetion.js";
import { addBudgetBtn, addBudgetLink, budgetAmount, budgetCategory, budgetFrequency, budgetFrequencyGroup, recurringBudgetCheckbox } from "./add-budget-dom.js";
import { addBudget } from "./add-budget-logic.js";
import { renderBudgetOverview } from "./add-budget-util.js";


recurringBudgetCheckbox.addEventListener("change", () => {
  budgetFrequencyGroup.style.display = recurringBudgetCheckbox.checked ? "block" : "none";
  if (recurringBudgetCheckbox.checked) {
    budgetFrequency.setAttribute("required", "required"); // make it required
  } else {
    budgetFrequency.removeAttribute("required"); // remove requirement
  }
});

addBudgetBtn.addEventListener('click', (event)=> {
  event.preventDefault();
  addBudget();
  renderBudgetOverview();
})

