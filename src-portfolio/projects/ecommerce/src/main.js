import ProductsController from "./controller/productsController.js";
import CartModel from "./cart/cartModel.js";
import CartView from "./cart/cartView.js";
import CartController from "./cart/cartController.js";

const cartModel = new CartModel();

// App init
document.addEventListener("DOMContentLoaded", () => {
  // passing cartModel into ProductsController
  const productsController = new ProductsController(cartModel);
  productsController.init();

  const cartView = new CartView();
  const cartController = new CartController(cartModel, cartView);

  // binding add into cart
  cartController.bindAddToCart(".products-grid");
});
