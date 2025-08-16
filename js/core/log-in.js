// import { showPage } from "./navigetion.js";
// import { appState, saveAppState } from "./state.js";

// export const authenificationPage = document.getElementById('auth-page');
// // Tabs
// const tabLogin = document.getElementById("tab-login");
// const tabSignup = document.getElementById("tab-signup");

// // Forms
// const formLogin = document.getElementById("form-login");
// const formSignup = document.getElementById("form-signup");

// // Login fields
// const loginEmail = document.getElementById("login-email");
// const loginPassword = document.getElementById("login-password");
// const loginSubmit = document.getElementById("login-submit");

// // Signup fields

// const signupEmail = document.getElementById("signup-email");
// const signupPassword = document.getElementById("signup-password");
// const signupConfirm = document.getElementById("signup-confirm");
// const signupSubmit = document.getElementById("signup-submit");

// // Toggle function
// function showLogin() {
//   formLogin.classList.add("active");
//   formLogin.classList.remove("hidden");
//   formSignup.classList.add("hidden");
//   formSignup.classList.remove("active");
//   tabLogin.classList.add("active");
//   tabSignup.classList.remove("active");
// }

// function showSignup() {
//   formSignup.classList.remove("hidden");
//   formSignup.classList.add("active");
//   formLogin.classList.add("hidden");
//   formLogin.classList.remove("active");
//   tabSignup.classList.add("active");
//   tabLogin.classList.remove("active");
// }

// // Tab events
// tabLogin.addEventListener("click", showLogin);
// tabSignup.addEventListener("click", showSignup);

// // Example submit handling (prevent refresh for now)
// formLogin.addEventListener("submit", e => {
//   e.preventDefault();
//   if (appState.userDetails.email !== loginEmail.value || appState.userDetails.password !== loginPassword.value) {
//     alert("Invalid email or password");
//     return;
//   } else {
//     authenificationPage.style.display = 'none';
//     showPage('dashboard');
//     loginEmail.value = '';
//     loginPassword.value = '';
//   }

// });

// formSignup.addEventListener("submit", e => {
//   e.preventDefault();
//   if (signupPassword.value !== signupConfirm.value) {
//     alert("Passwords do not match");
//     return;
//   }


//   appState.userDetails = {email: signupEmail.value, password: signupPassword.value};
//   authenificationPage.style.display = 'none';
//   showPage('dashboard');
//   saveAppState();
//   console.log(appState.userDetails);
//   signupEmail.value = '';
//   signupPassword.value = '';
// });

// // Auto-login check
// if (appState.userDetails.password && appState.userDetails.email) {
//   authenificationPage.style.display = 'none';
//   showPage('dashboard');
// } else {
//   showLogin(); // default to login
// }

