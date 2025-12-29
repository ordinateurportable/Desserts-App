import { addProductToCart, getProductById, getProducts, removeProductFromCart, makeOrder } from "./api";
import { printError } from "./error";
import { spinner } from "./spinner";

let cartCount = 0;
let orderTotal = 0;

function calcCartCount(isAdd = true) {
    if (isAdd) {
    cartCount++;
    } else {
      cartCount--;
    }
    document.querySelector(".cart-count").textContent = cartCount;
}

function calcOrderTotal(productPrice, isAdd = true) {
  if (isAdd) {
    orderTotal += productPrice;
  } else {
    orderTotal -= productPrice;
  }
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
    try {
      const { count: productCount, price } = await removeProductFromCart(id);
      if(productCount === 0) {
        e.target.closest(".cart-item").remove()
      } else {
        e.target.closest(".cart-item").querySelector(".count").textContent = productCount 
      }
      calcCartCount(false);
      if (cartCount === 0) {
        document.querySelector(".confirm-order").disabled = true;
      }
      calcOrderTotal(price, false);

    } catch (error) {
      printError(error)
    }

  }
});

async function loadProductsFromCart() {
  const cartProducts = await getProducts("cart")
  for (let i = 0; i < cartProducts.length; i++) {
    const product = await getProductById(cartProducts[i].id);
    cartProducts[i].name = product.name;
    cartProducts[i].price = product.price;
  }

  return cartProducts;
}

function renderCartProducts(cartProducts) {
  const markup = cartProducts.map(
    (product) => `
          <li class="cart-item" data-id="${product.id}">
            <span>${product.name}</span>
            <span>x<span class="count">${product.count}</span></span>
            <span>$${product.price}</span>
            <img class="remove-item" src="assets/icons/icon-remove-item.svg" alt="">
          </li>
          `
  );

  document
    .querySelector(".cart-items")
    .insertAdjacentHTML("beforeend", markup.join(""));
}

function renderTotals(cartProducts) {
  const data = cartProducts.reduce(
    (acc, product) => ({
      totalCount: acc.totalCount + product.count,
      totalPrice: acc.totalPrice + product.count * product.price,
    }),
    { totalCount: 0, totalPrice: 0 }
  );

  cartCount = data.totalCount;
  orderTotal = Number(data.totalPrice.toFixed(2));

  document.querySelector(".cart-count").textContent = cartCount;
  document.querySelector(".total-price").textContent = orderTotal;
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
    const cartProducts = await loadProductsFromCart();
    //отрисовать товары
    renderCartProducts(cartProducts);
    //пересчитать count, price
    renderTotals(cartProducts);
    //раздизейбл кнопки
    if (cartCount > 0) {
      document.querySelector(".confirm-order").disabled = false;
    }
    //оформить заказ
  } catch (error) {
    printError({ message: "Ошибка получения товаров из корзины" });
  }
});

document.querySelector(".confirm-order").addEventListener("click", async () => {
  try {
    const cartProducts = await loadProductsFromCart();
    const output = cartProducts.map(
      (product, ind) =>
        `${ind + 1}. ${product.name} х${product.count} | $${product.price}\n`
    );
    const msg = `Ваш заказ:\n\n${output.join("")}\n\nПодтвердите ваш заказ`;
    if (!confirm(msg)) {
      return;
    } else {
      await makeOrder();
      alert("Ваш заказ уже в пути ✅");
      location.reload();
    }
  } catch (error) {
    printError(error);
  }
});