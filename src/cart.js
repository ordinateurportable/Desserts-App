

import { addProductToCart, getProductByID } from "./api"
import { printError } from "./error"
import { spinner } from "./spinner"

document.querySelector(".product-list").addEventListener("click", async (e) => {
    if(e.target.matches(".add-to-cart, .add-to-cart *")) {
        const id = e.target.closest(".product").dataset.id
        const btn = e.target.closest(".add-to-cart")
        try {
            btn.disabled = true;
            spinner(`.product[data-id="${id}"]`, "afterbegin", 30)
            const product = await addProductToCart(id)
            const productMarkup = `
             <li class="cart-item" data-id="${product.id}">
                <span>${product.name}</span>
                <span>$${product.price}</span>
                <img class="remove-item" src="assets/icons/icon-remove-item.svg" alt="">
            </li>
            `
            document 
                .querySelector(".cart-items")
                .insertAdjacentHTML("beforeend", productMarkup)
            
        } catch (error) {
            printError(error)
        } finally {
            btn.disabled = false
            document.querySelector("#spinner").remove()
        }
    }
})