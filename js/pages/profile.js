// PROFILE LOGIC

import { displayConfirmPopUp } from "../components/modal.js";
import { showPage } from "../core/navigetion.js";

export const profileUserNameElem = document.getElementById('profile-user-name');
export const profileUserEmailElem = document.getElementById('profile-user-email');
export const logOutBtn = document.querySelector('.logout-btn');

logOutBtn.addEventListener('click', () => {
  displayConfirmPopUp("Are you sure you want to log out?", () => {
  showPage("authentificationLaunchPage"); 
});
})

