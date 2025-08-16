// BOTTOM NAVIGATION INTERACTTIVITY

import { showPage } from "../core/navigetion.js";
import { appState } from "../core/state.js";
import { closeSidebar } from "./sidebar.js";

export const addTransactionBtn = document.getElementById("add-t-btn");
export const bottomNavBtns = document.querySelectorAll("b-n-icon-div");

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener('click', () => {
    const page = button.dataset.page;

    showPage(page);
    closeSidebar();
  })
})

// to create a visual click animation 
addTransactionBtn.addEventListener("touchstart", () => {
  addTransactionBtn.classList.add("active");
});

addTransactionBtn.addEventListener("touchend", () => {
  addTransactionBtn.classList.remove("active");
});

addTransactionBtn.addEventListener("click", () => {
 showPage('addTranscPage');
 
});