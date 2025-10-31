// LOCALSTORAGE

import { appState } from "../core/state.js";

export function saveData() {
  try {
    localStorage.setItem('appData', JSON.stringify(appState))
  } catch (error) {
    console.warn("Error Saving File");
  } 
}

export function loadData() {
  try {
    let data = localStorage.getItem('appData')
    appState = JSON.parse(data)
  } catch (error) {
    console.warn("Error Saving File");
  }
}