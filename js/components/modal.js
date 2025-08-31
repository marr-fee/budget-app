// RESUSABLE MODAL MANAGEMENT {pop ups}

export const backgroundColors = ["skyblue", "pink", "greenyellow"]
export const popup = document.getElementById("pop-up-confirm-cntr");
export const overlay = document.getElementById("popup-overlay");

export function highlightErrors(inputs) {
  let hasError = false;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('input-error');

      input.classList.remove('shake');
      void input.offsetWidth; // force reflow
      input.classList.add('shake'); // restart animation
      hasError = true;
    } else {
      input.classList.remove('input-error', 'shake');
    }
  });

  return !hasError; 
}




export function displayGridItems(container, containerCaption, gridContainer, gridItems, showMore, message, dataLength) {
  container.innerHTML = "";

  // caption
  const transactionCaption = document.createElement('p');
  transactionCaption.classList.add('caption');
  transactionCaption.textContent = containerCaption;

  // empty state
  const emptyTransactions = document.createElement('div');
  emptyTransactions.classList.add('no-transactions-div');
  const messageContr = document.createElement('p');
  messageContr.classList.add('caption');
  const placeholderImg = document.createElement('img');
  placeholderImg.classList.add('placeholder-img');
  placeholderImg.src = "assets/icons/bitcoin-placeholder.png";
  messageContr.textContent = message;
  emptyTransactions.appendChild(placeholderImg);
  emptyTransactions.appendChild(messageContr);

  // show more
  // const showMoreTrans = document.createElement('p');
  // showMoreTrans.id = "show-more-trans";
  // showMoreTrans.classList.add('caption');
  // showMoreTrans.textContent = "Show More";
  // showMoreTrans.style.display = "none";

  // append elements
  container.appendChild(transactionCaption);
  container.appendChild(gridContainer);
  // container.appendChild(showMoreTrans);
  container.appendChild(emptyTransactions);

  // UI toggles (use the correct dataset length)
  emptyTransactions.style.display = dataLength === 0 ? "flex" : "none";
  gridContainer.style.display = dataLength > 0 ? "grid" : "none";
  // if (showMore && dataLength > 3) {
  //   showMoreTrans.style.display = "flex";
  // }

  // fill grid
  gridContainer.innerHTML = gridItems;
}

export function showPopup() {
  popup.classList.add("active");
  overlay.classList.add("active");
}

export function hidePopup() {
  popup.classList.remove("active");
  overlay.classList.remove("active");
}

export function displayConfirmPopUp(text, confirmAction) {
  
  const popUpContainer = document.querySelector('.pop-up-confirm-contr');

  popUpContainer.innerHTML = "";

  const confirmText = document.createElement('p');
  confirmText.textContent = text
  confirmText.classList.add('confirm-text');
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add("action-btns");
  const confirmBtn = document.createElement('button');
  const cancelBtn = document.createElement('button');
  confirmBtn.classList.add("button-M-dark", "button-edge-square", "confirm-btn");
  cancelBtn.classList.add("button-M-colored", "button-edge-square", "cancel-btn");
  confirmBtn.textContent = "CONFIRM";
  cancelBtn.textContent = "CANCEL";

  popUpContainer.appendChild(confirmText);
  popUpContainer.appendChild(buttonsContainer);
  buttonsContainer.appendChild(confirmBtn);
  buttonsContainer.appendChild(cancelBtn);

  showPopup();

  confirmBtn.addEventListener('click', () => {
    hidePopup();
    if (typeof confirmAction === "function") {
      confirmAction(); 
    }
  })

  cancelBtn.addEventListener("click", hidePopup);
}

  
