// import { addProductToCart, removeProductFromCart } from "./api"
// import { printError } from "./error"
// import { spinner } from "./spinner"

// let cartCount = 0
// let orderTotal = 0

// function cartCalcCount() {
//     cartCount++
//     // document.querySelector(".cart-count").textContent = Number(document.querySelector(".cart-count").textContent) + 1
//     document.querySelector(".cart-count").textContent = cartCount
// } 

// function calcOrderTotal(productPrice) {
//     orderTotal += productPrice
//     document.querySelector(".total-price").textContent = orderTotal.toFixed(2)
// }

// document.querySelector(".product-list").addEventListener("click", async (e) => {
//     if(e.target.matches(".add-to-cart, .add-to-cart *")) {
//         const id = e.target.closest(".product").dataset.id
//         const btn = e.target.closest(".add-to-cart")
//         try {
//             btn.disabled = true;
//             spinner(`.product[data-id="${id}"]`, "afterbegin", 30)
//             const product = await addProductToCart(id)
//             if (product.count === 1) {
//                 const productMarkup = `
//                 <li class="cart-item" data-id="${product.id}">
//                     <span>${product.name}</span>
//                     <span>x<span class="count">${product.count}</span></span>
//                     <span>$${product.price}</span>
//                     <img class="remove-item" src="assets/icons/icon-remove-item.svg" alt="">
//                 </li>
//                 `

//                 document 
//                     .querySelector(".cart-items")
//                     .insertAdjacentHTML("beforeend", productMarkup)
            
//             } else if (product.count > 1) {
//                 document.querySelector(`.cart-item[data-id="${id}"] .count`).textContent = product.count
//             }

//             calcOrderTotal(product.price)

//         } catch (error) {
//             printError(error)
//         } finally {
//             cartCalcCount()
//             document.querySelector(".confirm-order").disabled = false
//             btn.disabled = false
//             document.querySelector("#spinner").remove()
//         }
//     }
// })

// document.querySelector(".cart-items").addEventListener("click", async (e) => {
//     if(e.target.matches(".remove-item")) {
//         const id = e.target.closest(".cart-item").dataset.id 
//         await removeProductFromCart(id)
//     }
// })

import { addProductToCart, getProductById, removeProductFromCart } from "./api";
import { printError } from "./error";
import { spinner } from "./spinner";

let cartCount = 0;
let orderTotal = 0;

function calcCartCount() {
  cartCount++;
  document.querySelector(".cart-count").textContent = cartCount;
}

function calcOrderTotal(productPrice) {
  orderTotal += productPrice;
  document.querySelector(".total-price").textContent = orderTotal.toFixed(2);
}

document.querySelector(".product-list").addEventListener("click", async (e) => {
  if (e.target.matches(".add-to-cart, .add-to-cart *")) {
    const id = e.target.closest(".product").dataset.id;
    const btn = e.target.closest(".add-to-cart");
    try {
      btn.disabled = true;
      spinner(`.product[data-id="${id}"] .add-to-cart`, "afterbegin", 20);
      const product = await addProductToCart(id);
      if (product.count === 1) {
        const productMarkup = `
          <li class="cart-item" data-id="${product.id}">
            <span>${product.name}</span>
            <span>x<span class="count">${product.count}</span></span>
            <span>$${product.price}</span>
            <img class="remove-item" src="assets/icons/icon-remove-item.svg" alt="">
          </li>
          `;

        document
          .querySelector(".cart-items")
          .insertAdjacentHTML("beforeend", productMarkup);
      } else if (product.count > 1) {
        document.querySelector(
          `.cart-item[data-id="${id}"] .count`
        ).textContent = product.count;
      }

      calcOrderTotal(product.price);
    } catch (error) {
      printError(error);
    } finally {
      calcCartCount();
      document.querySelector(".confirm-order").disabled = false;
      btn.disabled = false;
      document.querySelector("#spinner").remove();
    }
  }
});

document.querySelector(".cart-items").addEventListener("click", async (e) => {
  if (e.target.matches(".remove-item")) {
    const id = e.target.closest(".cart-item").dataset.id;
    await removeProductFromCart(id);
  }
});

// document.addEventListener("DOMContentLoaded", () => {});