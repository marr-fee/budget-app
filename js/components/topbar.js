// HEADER LOGIC: TITLE, BACK/ HAMBURGER BEHAVIOUR
import { closeSidebar, sideNavbar } from "./sidebar.js";
import { appState } from "../core/state.js";
import { dashboardPage, goBack } from "../core/navigetion.js";
import { backButton, hamNavBtn } from "./shared-dom.js";








hamNavBtn.addEventListener("click", () => {
  sideNavbar.classList.toggle("active");
  hamNavBtn.classList.toggle("active");
  dashboardPage.classList.toggle("inactive");
  appState.isSideBarOpen = true;
});


backButton.addEventListener("click", () => {
  closeSidebar();
  goBack();

});

