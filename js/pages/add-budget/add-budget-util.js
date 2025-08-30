import { displayGridItems } from "../../components/modal.js";
import { appState } from "../../core/state.js";
import { budgetOverviewGridContainer, budgetPageWrpper, budPageGridCntr, dashboardBudgetCntr, showMoreBudgetsLink } from "./add-budget-dom.js";



export function renderBudgetOverview({ showAll = false } = {}) {

   let gridItems = '';

   const fullBudgetList = appState.budgets;

   const budgetListToRender = showAll ? fullBudgetList : fullBudgetList.slice(0, 1);

   budgetListToRender.forEach((b) => {
    const dateObj = new Date(b.date);
    const monthName = dateObj.toLocaleString('default', { month: 'long' });

    let currentExpense = 0;

    appState.expenditure.forEach((exp) => {
      if (exp.category.toLowerCase() === b.category.toLowerCase()) {
        currentExpense += Number(exp.amount);
      }
    });

    const spentPercentage = (currentExpense * 100) / b.amount;

    gridItems += `
      <div class="budget-summary-grid-item">
        <div class="title-month-div">
          <div><h3 class="category-div">${b.category}</h3></div>
          <div><p class="month-div">${monthName}</p></div>
        </div>
        <div class="line-bar-div">
          <div class="bar-fill" style="width: ${Math.min(spentPercentage, 100)}%"></div>
        </div>
        <div class="spent-budget-amt-div">
          <div class="spent-amt-div">
            <p class="caption">Spent</p>
            <h4>${currentExpense.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} kr</h4>
          </div>
          <div class="budget-amt-div">
            <p class="caption">Budget</p>
            <h4>${b.amount.toLocaleString("en-US")} kr</h4>
          </div>
        </div>
      </div>
    `;

   });


    // Dashboard usage
    if (!showAll) {
      const showMore = appState.budgets.length > 1;
      displayGridItems(
        dashboardBudgetCntr, "", budgetOverviewGridContainer, gridItems, showMore, "No Budgets Added", appState.budgets.length
      );

      if (showMore) {
        showMoreBudgetsLink.style.display = "block";
        
      } else {
        showMoreBudgetsLink.style.display = "none";
      }
    } 
    // Budget page usage
    else {
      displayGridItems(
        budgetPageWrpper, "", budPageGridCntr,
        gridItems, false,
        "No Budgets Added", appState.budgets.length
      );
    }

}

renderBudgetOverview();