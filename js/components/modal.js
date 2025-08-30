// RESUSABLE MODAL MANAGEMENT {pop ups}

export const backgroundColors = ["skyblue", "pink", "greenyellow"]

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


  
