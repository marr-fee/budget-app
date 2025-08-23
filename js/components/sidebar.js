// SIDEBAR MENU LOGIC

import { bottomNav, dashboardPage, mainPages } from "../core/navigetion.js";
import { appState } from "../core/state.js";
import { hamNavBtn } from "./shared-dom.js";

export const sideNavbar = document.querySelector(".side-bar");

export function closeSidebar(){
  sideNavbar.classList.remove("active");
  dashboardPage.classList.remove("inactive");
  hamNavBtn.classList.remove("active");
  appState.isSideBarOpen = false;
  bottomNav.classList.remove("inactive");
  mainPages.forEach((page) =>{
    page.classList.remove("inactive");
  })
}

