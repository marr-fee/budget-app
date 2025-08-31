import { clearErrorHighlights } from "../pages/add-transaction/addTran-utils.js";
import { dashboardUserEmail, dashboardUserNameElem } from "../pages/dashboard.js";
import { profileUserEmailElem, profileUserNameElem } from "../pages/profile.js";
import { showPage } from "./navigetion.js";
import { appState } from "./state.js";
import { highlightErrors, isValidEmail, showNotification } from "./utils.js";




export const authentFormWrapper = document.querySelector(".auth-forms-wrapper");
export const signInPageBtn = document.getElementById('sign-in-page-btn');
export const signUpPageBtn = document.getElementById('sign-up-page-btn');
export const authentificationLaunchPage = document.querySelector('.launch-page-wrapper');
export const signUpPage = document.querySelector('.sign-up-page-div');
export const signInPage = document.querySelector('.sign-in-page-div');
export const signUpBtn = document.getElementById('sign-up-submit');
export const signInBtn = document.getElementById('sign-in-submit');

// auth-forms-dom

// Sign Up form + inputs
export const signUpForm = document.getElementById("sign-up-form");
export const signUpEmail = document.getElementById("signup-email");
export const signUpPassword = document.getElementById("signup-password");
export const signUpFirstName = document.getElementById("signup-firstname");
export const signUpLastName = document.getElementById("signup-lastname");
// export const signUpConfirm = document.getElementById("signup-confirm");

// Sign In form + inputs
export const signInForm = document.getElementById("sign-in-form");
export const signInEmail = signInForm.querySelector("input[type='email']");
export const signInPassword = signInForm.querySelector("input[type='password']");

// Notification DOM (already exists in your app)
export const notificationDiv = document.querySelector(".notification-container");
export const notificationMessageDiv = notificationDiv.querySelector(".notifiation-content");


// auth-validation

// Handle Sign Up
signUpBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const inputs = [signUpFirstName, signUpLastName, signUpEmail, signUpPassword];
  const isValid = highlightErrors(inputs);

  if (!isValid) {
    showNotification("Please fill all required fields", true);
    return;
  }

  if (!isValidEmail(signUpEmail.value)) {
    showNotification("Enter a valid email address", true);
    signUpEmail.classList.add("input-error", "shake");
    return;
  }

  // if (signUpPassword.value.trim() !== signUpConfirm.value.trim()) {
  //   signUpConfirm.classList.add("input-error", "shake");
  //   showNotification("Passwords do not match", true);
  //   return;
  // }

  // Check if email already exists
  const existingUser = appState.users.find(user => user.email === signUpEmail.value.trim());
  if (existingUser) {
    showNotification("Email already registered. Please sign in.", true);
    return;
  }

  // Save user
  const newUser = {
    firstName: signUpFirstName.value.trim(),
    lastName: signUpLastName.value.trim(),
    email: signUpEmail.value.trim(),
    password: signUpPassword.value.trim(),
  };

  appState.users.push(newUser);
  appState.currentUser = newUser;

  const firstName = newUser.firstName;
  const lastName = newUser.lastName;
  const email = newUser.email;

  dashboardUserNameElem.textContent = `Hello ${firstName.split(" ")[0]}!`
  dashboardUserEmail.textContent = email;
  profileUserNameElem.textContent = `${lastName} ${firstName}`;
  profileUserEmailElem.textContent = email;


  // Success
  clearErrorHighlights(signUpForm);
  showNotification("Account created successfully!", false);
  showPage("dashboard");
});


// Handle Sign In
signInBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const inputs = [signInEmail, signInPassword];
  const isValid = highlightErrors(inputs);

  if (!isValid) {
    showNotification("Please enter your email and password", true);
    return;
  }

  if (!isValidEmail(signInEmail.value)) {
    showNotification("Enter a valid email address", true);
    signInEmail.classList.add("input-error", "shake");
    return;
  }

  const user = appState.users.find(u => 
    u.email === signInEmail.value.trim() && 
    u.password === signInPassword.value.trim()
  );

  if (!user) {
    showNotification("Invalid email or password", true);

    signInEmail.classList.add("input-error", "shake");
    signInPassword.classList.add("input-error", "shake");
    return;
  }
  const firstName = appState.currentUser.firstName;
  const lastName = appState.currentUser.lastName;
  const email = appState.currentUser.email;
  dashboardUserNameElem.textContent = `Hello ${firstName.split(" ")[0]}!`
  dashboardUserEmail.textContent = email;
  profileUserNameElem.textContent = `${lastName} ${firstName}`;
  profileUserEmailElem.textContent = email;
  // Success
  appState.currentUser = user;
  clearErrorHighlights(signInForm);
  showNotification(`Welcome back, ${user.email}`, false);
  showPage("dashboard");
});

