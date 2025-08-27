import { dashboardNetworthElem, networthChangeContr } from "./dashboard.js";


export const hideAmountToggleBtn = document.getElementById('toggle-networth');
export const hideItemsContainer = document.querySelectorAll('.amount-cover');


hideAmountToggleBtn.addEventListener('click', () =>{
  networthChangeContr.classList.toggle("hide");
  dashboardNetworthElem.classList.toggle("hide");
  hideItemsContainer.forEach((c) =>{
    c.classList.toggle("active")
  })

})

// class Loan {
//   constructor(name, totalAmount, monthlyPayment){
//     this.name = name;
//     this.remaining = totalAmount;
//     this.monthlyPayment = monthlyPayment;
//   }

//   makePayment(){
//     if (asset.cash >= this.monthlyPayment && this.remaining > 0) {
//       asset.cash -= this.monthlyPayment,this.monthlyPayment;
//       this.remaining -= this.monthlyPayment;

//       if (this.remaining < 0) {
//         this.remaining = 0
//       }
//     }
//   }
// }

// let phoneLoan = new Loan("Phone", 600, 25);

// phoneLoan.makePayment();