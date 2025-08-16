// CHART SETUP, DATA PARSING

import { appState } from "../core/state.js";

  export const overviewPageCanvas = document.getElementById("overview-page-canvas").getContext("2d");
  export const statsPageCanvas = document.getElementById("comparison-chart").getContext("2d");


export function groupTransactionsByMonth(transactions) {
  const monthsMap = {};

  transactions.forEach(tx => {
    // Format date into "YYYY-MM" for grouping
    const date = new Date(tx.date);
    const monthKey = date.toLocaleString('default', { month: 'short' }); // "Jan"
    const year = date.getFullYear(); 
    const label = `${monthKey} ${year}`;
    
    if (!monthsMap[label]) {
      monthsMap[label] = { month: label, income: 0, expense: 0 };
    } 

    if (tx.type === 'income') {
      monthsMap[label].income += tx.amount;
    } else if(tx.type === "expenditure"){
      monthsMap[label].expense += tx.amount;
    }
  });

  return Object.values(monthsMap);
}

// export const incomeData = groupTransactionsByMonth(appState.income);


// let incomeChartInstance = null;
// let expenseChartInstance = null;
// let comparisonChartInstance = null;

// export function renderIncomeChart(data){
//   const ctx = document.getElementById('income-chart').getContext('2d');


//   // Destroy old chart if it exists
//   if (incomeChartInstance) {
//     incomeChartInstance.destroy();
//   }

//   incomeChartInstance = new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: incomeData.labels,
//       datasets: [{
//         label: 'Income',
//         data: incomeData.values,
//         backgroundColor: 'rgba(54,162,235,0.6)'
//       }]
//     },
//     options: {
//       responsive: true,
//       scales: {
//         y: {
//           beginAtZero: true,
//           ticks: {
//             callback: (value) => `$${value.toLocaleString()}`
//           }
//         }
//       }
//     }
//   });
// }


let incomeChartInstance = null; // store chart instance
let expenseChartInstance = null; 
let comparisonInstance = null; 

export function renderIncomeChart(incomeData) {
  const ctx = document.getElementById("income-chart").getContext("2d");

  // destroy previous chart before creating a new one
  if (incomeChartInstance) {
    incomeChartInstance.destroy();
  }

  incomeChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: incomeData.labels, // months
      datasets: [
        {
          label: "Income",
          data: incomeData.values, // amounts
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          categoryPercentage: 0.6,
          barPercentage: 0.6
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `$${value.toLocaleString()}`,
            autoSkip: false,
            maxRotation: 0
          },
        },
      },
    },
  });
}

export function renderExpenseChart(expenseData) {
  const ctx = document.getElementById("expense-chart").getContext("2d");

  // destroy previous chart before creating a new one
  if (expenseChartInstance) {
    expenseChartInstance.destroy();
  }

  expenseChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: expenseData.labels, // months
      datasets: [
        {
          label: "Expenditure",
          data: expenseData.values, // amounts
          backgroundColor: "rgba(192, 75, 75, 0.6)",
          categoryPercentage: 0.6,
          barPercentage: 0.6
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `$${value.toLocaleString()}`,
            autoSkip: false,
            maxRotation: 0
          },
        },
      },
    },
  });
}


export function getIncomeDataByMonth() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Start with zero values for all months
  const values = new Array(12).fill(0);

  appState.income.forEach(txn => {
    const date = new Date(txn.date);
    const monthIndex = date.getMonth(); // 0 = Jan
    const year = date.getFullYear();

    // Only count for current year
    if (year === new Date().getFullYear()) {
      values[monthIndex] += Number(txn.amount) || 0;
    }
  });

  return { labels: months, values };
}

export function getExpenseDataByMonth() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const values = new Array(12).fill(0);

  appState.expenditure.forEach(txn => {
    const date = new Date(txn.date);
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    if (year === new Date().getFullYear()) {
      values[monthIndex] += Number(txn.amount) || 0;
    }
  });

  return { labels: months, values };
}


export function renderComparisonChart(canvas) {
  // const ctx = document.getElementById("comparison-chart").getContext("2d");

  if (comparisonInstance) {
    comparisonInstance.destroy();
  }

  const incomeData = getIncomeDataByMonth();
  const expenseData = getExpenseDataByMonth(); // similar function for expenses

  comparisonInstance = new Chart(canvas, {
    type: "bar",
    data: {
      labels: incomeData.labels,
      datasets: [
        {
          label: "Income",
          data: incomeData.values,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Expenses",
          data: expenseData.values,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `$${value.toLocaleString()}`,
          },
        },
      },
    },
  });
}

renderComparisonChart(overviewPageCanvas);
