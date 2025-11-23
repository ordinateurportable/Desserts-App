import { getProducts } from "./api";
import { printError } from "./error";
import { spinner } from "./spinner";

async function getProductsWrapper() {
  try {
    spinner(".product-list", "afterbegin")

    const products = await getProducts();
    if (products.length > 0) {
      renderProducts(products);
    } else {
      throw new Error("Не удалось получить товары");
    }
  } catch (error) {
    printError(error)
  } finally {
    document.querySelector("#spinner").remove()
  }
}

function renderProducts(products) {
  const productsMarkup = products.map(
    (product) =>
      `
    <div class="product"  data-id="${product.id}">
      <img src="${product.image.desktop}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>$${product.price}</p>
      <button class="add-to-cart"> <img src="/assets/icons/icon-add-to-cart.svg" >
        <span>Add to Cart</span></button>
    </div>
    `
  );

  document
    .querySelector(".product-list")
    .insertAdjacentHTML("beforeend", productsMarkup.join(""));
}

getProductsWrapper();