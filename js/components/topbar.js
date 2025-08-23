// HEADER LOGIC: TITLE, BACK/ HAMBURGER BEHAVIOUR
import { closeSidebar, sideNavbar } from "./sidebar.js";
import { appState } from "../core/state.js";
import { bottomNav, goBack, mainPages } from "../core/navigetion.js";
import { backButton, hamNavBtn } from "./shared-dom.js";





// mainContentWrapper


hamNavBtn.addEventListener("click", () => {
  sideNavbar.classList.toggle("active");
  hamNavBtn.classList.toggle("active");
  bottomNav.classList.toggle("inactive");
  appState.isSideBarOpen = sideNavbar.classList.contains('active') ? true : false;
  mainPages.forEach((page) =>{
    page.classList.toggle("inactive");
  })
  
});


backButton.addEventListener("click", () => {
  closeSidebar();
  goBack();

});

