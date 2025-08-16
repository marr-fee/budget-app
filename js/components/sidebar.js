// SIDEBAR MENU LOGIC

import { dashboardPage } from "../core/navigetion.js";
import { appState } from "../core/state.js";
import { hamNavBtn } from "./shared-dom.js";

export const sideNavbar = document.querySelector(".side-bar");

export function closeSidebar(){
  sideNavbar.classList.remove("active");
  dashboardPage.classList.remove("inactive");
  hamNavBtn.classList.remove("active");
  appState.isSideBarOpen = false;
}