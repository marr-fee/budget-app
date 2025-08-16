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
            <h4>$${currentExpense.toFixed(2)}</h4>
          </div>
          <div class="budget-amt-div">
            <p class="caption">Budget</p>
            <h4>$${b.amount}</h4>
          </div>
        </div>
      </div>
    `;

   });

   

  //  appState.budgets.forEach((b) => {
  //   // Convert the date string to a Date object
  //   const dateObj = new Date(b.date);

  //   // Get month abbreviation (e.g., "Jan", "Feb")
  //   // const monthName = dateObj.toLocaleString('default', { month: 'short' });

  //   // full month name if you prefer
  //   const monthName = dateObj.toLocaleString('default', { month: 'long' });

  //   let spentPercentage = 0;
  //   let currentExpense = 0;  
  //   let expenseBudgetDifference = 0; 
    
    
  //   appState.expenditure.forEach((exp) =>{

  //     if (exp.category.toLowerCase() === b.category.toLowerCase()) {
  
  //       currentExpense += Number(exp.amount);
        
  //       expenseBudgetDifference += (Number(b.amount) - Number(currentExpense))
         
  //     }

  //   })

  //   spentPercentage = (currentExpense * 100) /  b.amount;


  //   gridItems += `
  //       <div class="budget-summary-grid-item">
  //         <div class="title-month-div">
  //           <div><h3 class="category-div">${b.category}</h3></div>
  //           <div><p class="month-div">${monthName}</p></div>
  //         </div>
  //         <div class="line-bar-div">
  //           <div class="bar-fill" style="width: ${spentPercentage}%"></div>
  //         </div>
  //         <div class="spent-budget-amt-div">
  //           <div class="spent-amt-div">
  //             <p class="caption">Spent</p>
  //             <h4 id="amount-spent-div">$${currentExpense.toFixed(2)}</h4>
  //           </div>
  //         <div class="budget-amt-div">
  //             <p class="caption">Budget</p>
  //             <h4 id="budget-amount-div">$${b.amount}</h4>
  //           </div>
  //         </div>
  //       </div>
  //       `;
  //   });


  //  budgetOverviewGridContainer.innerHTML = gridItems;

    // Dashboard usage
    if (!showAll) {
      const showMore = appState.budgets.length > 0;
      displayGridItems(
        dashboardBudgetCntr, "", budgetOverviewGridContainer, gridItems, showMore, "No Budgets Added", appState.budgets.length
      );

      if (showMore) {
        showMoreBudgetsLink.style.display = "flex";
        
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

// function renderBudgetCard(budget) {
//   const dateObj = new Date(budget.date);
//   const monthName = dateObj.toLocaleString('default', { month: 'long' });

//   const budgetOverviewHTML = `
//     <div class="budget-summary-grid-item" data-budget-id="${budget.id}">
//       <div class="title-month-div">
//         <h3 class="category-div">${budget.category}</h3>
//         <p class="month-div">${monthName}</p>
//       </div>
//       <div class="line-bar-div">
//         <div class="bar-fill" style="width: 0%"></div>
//       </div>
//       <div class="spent-budget-amt-div">
//         <div class="spent-amt-div">
//           <p class="caption">Spent</p>
//           <h4 class="amount-spent-div">$0.00</h4>
//         </div>
//         <div class="budget-amt-div">
//           <p class="caption">Budget</p>
//           <h4 class="budget-amount-div">$${budget.amount.toFixed(2)}</h4>
//         </div>
//       </div>
//     </div>
//   `;

//   budgetOverviewGridContainer.insertAdjacentHTML('beforeend', budgetOverviewHTML);
// }

// function updateBudgetCard(budget) {
//   let currentExpense = 0;

//   appState.expenditure.forEach(exp => {
//     if (exp.category.toLowerCase() === budget.category.toLowerCase()) {
//       currentExpense += Number(exp.amount);
//     }
//   });

//   const spentPercentage = (currentExpense * 100) / budget.amount;

//   const card = budgetOverviewGridContainer.querySelector(`[data-budget-id="${budget.id}"]`);
//   if (card) {
//     card.querySelector('.amount-spent-div').textContent = `$${currentExpense.toFixed(2)}`;
//     card.querySelector('.bar-fill').style.width = `${spentPercentage}%`;
//   }
// }

renderBudgetOverview();