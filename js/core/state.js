// CENTRAL APP STATE (ACTIVE PAGE, USER DATA, ETC)

// --- APP STATE ---
export const appState = {
  pageStack: [],
  isSideBarOpen: false,
  income: [],
  expenditure: [],
  transactions: [],
  myCryptos: [],
  budgets: [],
  loans: [],
  assets: {
    cash: 0,
    investments: 0,
  },
  liabilities: {
    loans: 0,
  },
  netWorth: 0,
  netWorthChange: 0,
  netWorthPercentChange: 0,
  netWorthLifetimeChange: 0,
  netWorthLifetimePercent: 0,
  networthHistory: [0],
  initialNetWorth: null,
  users: [],
  currentUser: null,
  isReturningUser: false,
  calcNetWorth: false,
  isAssetAdded: false,
  isLiabilitiesAdded: false,
  needsInvestmentForm: false
};
