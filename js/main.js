import CartManager from "./features/cart/cartManager.js";
import categoriesSuccess from "./features/categories.js";
import productsSuccess from "./features/products.js";
import handelRemoteRequest, { getManyRequsets } from "./shares/api.js";
import {
  loadingElement,
  errorElement,
  mainElement,
  catgoriesContainer,
  itemsElement,
} from "./shares/ui/dom-elements.js";

const requestsConfig = [
  {
    endpoint: "products/categories",
    success: (data) => categoriesSuccess(data),
  },
  {
    endpoint: "products",
    success: (data) => productsSuccess(data),
  },
];

getManyRequsets(
  {
    startLoading: () => {
      loadingElement.removeClass("d-none");
      loadingElement.addClass("d-flex");
    },
    error: (err) => {
      errorElement.removeClass("d-none");
      errorElement.addClass("d-flex");
      mainElement.removeClass("row");
      mainElement.addClass("d-none");
      errorElement.find(".alert").text(err.message);
    },
    stopLoading: () => {
      loadingElement.removeClass("d-flex");
      loadingElement.addClass("d-none");
    },
  },
  requestsConfig
).then(() => handelGetProductsByCategory());

// Get products by category
function handelGetProductsByCategory() {
  catgoriesContainer.children().on("click", (e) => {
    handelRemoteRequest(
      `products/category/${e.target.id}`,
      (data) => productsSuccess(data),
      (err) => {
        itemsElement.html(`<div class="d-flex vh-100 justify-content-center align-items-center">
          <div class="alert alert-danger">${err.message}</div>
        </div>`);
      },
      () => {
        itemsElement.html(`<div class="d-flex vh-100 justify-content-center align-items-center">
          <h3>Loading...</h3>
        </div>`);
      }
    );
  });
}

// Initialize Cart Manager
const cartManager = new CartManager();
