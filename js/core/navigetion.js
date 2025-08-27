// PAGE SWITCHING, STACK, TRANSITIONS

import { hamNavBtn, backButton, pageTitle } from "../components/shared-dom.js";
import { closeSidebar, sideNavbar } from "../components/sidebar.js";
import { appState } from "./state.js";
// import { resetForms } from "../pages/addTransaction.js";
import { resetForms } from "../pages/add-transaction/addTran-utils.js";
import { getExpenseDataByMonth, getIncomeDataByMonth, renderComparisonChart, renderExpenseChart, renderIncomeChart, statsPageCanvas } from "../pages/stats.js";
import { addBudgetPage } from "../pages/dashboard.js";
import { budgetPage } from "../pages/add-budget/add-budget-dom.js";
import { renderBudgetOverview } from "../pages/add-budget/add-budget-util.js";
import { loanForm, loansPage } from "../pages/loans.js";
// overviewPageCanvas


export const subPagesWrapper = document.querySelector('.sub-contents-wrapper')
export const mainPages = document.querySelectorAll('.main-page');
export const subPages = document.querySelectorAll('.sub-pages');
export const dashboardPage = document.getElementById("dashboard-page");

// BOTTOM NAVIGATION 
export const bottomNav = document.getElementById("bottom-nav");

// ADD TRANSACTION PAGE
export const addTransactionPage = document.getElementById("add-trans-page");

// STATS PAGE
export const statsPage = document.getElementById('stats-page');

// OVERVIEW PAGE
export const investmentPage = document.getElementById('investment-page');

// USER PROFILE PAGE
export const userProfilePage = document.getElementById('user-profile-page');

// INCOME PAGE
export const incomePage = document.getElementById('income-page-div');
export const incomePageTapDiv = document.getElementById('income-page');

// EXPENDITURE PAGE
export const expenditurePage = document.getElementById('expenditure-page-div');
export const expenditurePageTapDiv = document.getElementById('expenditure-page');

export const appPages = {
  dashboard: {
    element: dashboardPage,
    title: ""
  },
  addTranscPage: {
    element: addTransactionPage,
    title: "Add Transaction"
  },
  statsPage: {
    element: statsPage,
    title: "Stats"
  },
  investmentPage: {
    element: investmentPage,
    title: "Investment Overview"
  },
  profilePage: {
    element: userProfilePage,
    title: "Profile"
  },
  incomePage: {
    element: incomePage,
    title: "Income"
  },
  expenditurePage: {
    element: expenditurePage,
    title: "Expenditure"
  },
  addBudgetPage: {
    element: addBudgetPage,
    title: "Add New Budget"
  },
  budgetPage: {
    element: budgetPage,
    title: "Budgets"
  },
  loansPage: {
    element: loansPage,
    title: "Loans"
  },
  addLoansPage: {
    element: loanForm,
    title: "Add New Loan"
  }
}



export function showPage(pageName) {
  Object.values(appPages).forEach(page => {
    page.element.classList.remove("active");
  })
  const targetPage = appPages[pageName];
  targetPage.element.classList.add("active");
  if (pageName === "statsPage") {
    renderComparisonChart(statsPageCanvas); 
  }
  if (pageName === "dashboard") {
    // renderComparisonChart(overviewPageCanvas); 
  }
  if (pageName === "dashboard" || pageName === "statsPage" || pageName === "investmentPage" || pageName === "profilePage") {
    appState.pageStack = [pageName];
    subPagesWrapper.classList.remove("active");
    // bottomNav.style.display = "flex";
  } else if (appState.pageStack[appState.pageStack.length - 1] !== pageName) {
    appState.pageStack.push(pageName);
    // bottomNav.style.display = "none";
    subPagesWrapper.classList.add("active");
  }
  
  pageTitle.innerText = targetPage.title;

  hamNavBtn.style.display = appState.pageStack.length === 1 ? "flex" : "none";
  backButton.style.display = appState.pageStack.length > 1 ? "flex" : "none";
  
  requestAnimationFrame(() => {
    subPages.forEach((p) => {
      p.scrollTop = 0;
    })
    mainPages.forEach((p) => {
      p.scrollTop = 0;
    })
  });
}

export function goBack() {
  if (appState.pageStack.length > 1){

    let lastPage = appState.pageStack.pop();
    if (lastPage === "addTranscPage" || lastPage === "addBudgetPage" || lastPage === "addLoansPage") {
      resetForms();
      
    }
    const previousPage = appState.pageStack[appState.pageStack.length - 1]
    showPage(previousPage);
  }
}

mainPages.forEach((page) =>{
  page.addEventListener("click", () => {
    if (sideNavbar.classList.contains("active")) {
      closeSidebar();
    }
  });
});

// incomePageTapDiv.addEventListener('click', () => {
//   showPage('incomePage');
// })

// expenditurePageTapDiv.addEventListener('click', () => {
//   showPage('expenditurePage');
// })

document.querySelectorAll("[data-page-link]").forEach(link => {
  
  link.addEventListener('click', () => {
    const page = link.dataset.pageLink;
    
    if (appState.isSideBarOpen) {
      closeSidebar();
      return;
    } else {
      showPage(page);
      
    }
    // closeSidebar();
    if (page === "incomePage") {
      renderIncomeChart(getIncomeDataByMonth());
    }
    if (page === "expenditurePage") {
      renderExpenseChart(getExpenseDataByMonth());
    }
    if (page === "budgetPage") {
      renderBudgetOverview({ showAll: true });
    }
  })
})

document.querySelectorAll("[data-sidebar-link]").forEach(link => {
  
  link.addEventListener('click', () => {
    const page = link.dataset.sidebarLink;
    
    if (appState.isSideBarOpen) {
      closeSidebar();
      showPage(page);
    }
  })
})


showPage('dashboard');