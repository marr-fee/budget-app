// PROFILE LOGIC

import { displayConfirmPopUp } from "../components/modal.js";
import { goBack, showPage } from "../core/navigetion.js";
import { appState } from "../core/state.js";
import { highlightErrors, showNotification } from "../core/utils.js";

export const editProfileform = document.getElementById('edit-profile-form');
export const changePasswordForm = document.getElementById('change-password-form') 

export const profileUserNameElem = document.getElementById('profile-user-name');
export const profileUserEmailElem = document.getElementById('profile-user-email');
export const logOutBtn = document.querySelector('.logout-btn');
export const changePasswordPage = document.getElementById('change-password-page');
export const editProfilePage = document.getElementById('edit-profile-page')
export const updatePasswordBtn = document.getElementById('update-password-btn')

export const currentPassword = document.getElementById('current-password');
export const newPassword = document.getElementById('new-password');
export const confirmNewPassword = document.getElementById('confirm-new-password');

export const newFirstNameInput = document.getElementById("new-first-name");
export const newLastNameInput = document.getElementById("new-last-name");
export const newEmailInput = document.getElementById("new-email");
export const changeProfileBtn = document.getElementById("change-proile-btn");


export function changePassword(event) {
  event.preventDefault();
  
  const inputs = [currentPassword, newPassword, confirmNewPassword]; 

  const isValid = highlightErrors(inputs);
  if (!isValid) {
    showNotification("Please fill all required fields", true);
    return;
  }

  const user = appState.currentUser; // current user object

  if (currentPassword.value.trim() !== user.password.trim()) {
    showNotification("Current password is incorrect.", true);
    return;
  }

  if (newPassword.value.trim() !== confirmNewPassword.value.trim()) {
    showNotification("New password does not match", true);
    return;
  }

  // Update password in app state
  user.password = newPassword.value.trim();

  showNotification("Password has been changed successfully", false);
  goBack();
}

updatePasswordBtn.addEventListener('click', changePassword)

export function updateProfile(event) {
  event.preventDefault(); // Prevent form refresh

  const inputs = [newFirstNameInput, newLastNameInput, newEmailInput];
  const isValid = highlightErrors(inputs);

  if (!isValid) {
    showNotification("Please fill all required fields", true);
    return;
  }

  const user = appState.currentUser;
  if (!user) {
    showNotification("No user logged in", true);
    return;
  }

  // Update user details
  user.firstName = newFirstNameInput.value.trim();
  user.lastName = newLastNameInput.value.trim();
  user.email = newEmailInput.value.trim();

  showNotification("Profile updated successfully", false);
  goBack();
}

changeProfileBtn.addEventListener("click", updateProfile);

logOutBtn.addEventListener('click', () => {
  displayConfirmPopUp("Are you sure you want to log out?", () => {
  showPage("signInPage"); 
});
})

