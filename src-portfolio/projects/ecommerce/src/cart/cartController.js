import { showToast } from "../utils/helpers";

export default class CartController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindRemoveItem(this.handleRemoveItem.bind(this));
    this.view.bindClearAll(this.handleClearCart.bind(this));

    this._render();
  }

  _render() {
    const items = this.model.getItems();
    this.view.renderCartItems(items);
    this.view.updateCartCount(this._getTotalQuantity(items));
  }

  _getTotalQuantity(items) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  handleRemoveItem(id) {
    this.model.removeItem(id);
    showToast("Item removed from cart");
    this._render();
  }

  handleClearCart() {
    this.model.clearCart();
    showToast("All items removed");
    this._render();
  }

  bindAddToCart(buttonContainerSelector) {
    document
      .querySelector(buttonContainerSelector)
      .addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-add-to-cart")) {
          const card = e.target.closest(".product-card");
          const id = card.dataset.id;
          const title = card.querySelector(".product-title").textContent;
          const priceText = card.querySelector(".product-price").textContent;
          const price = parseFloat(priceText.replace("$", "")); // num parse
          const image = card.querySelector("img").src;

          // add to cart as num
          this.model.addItem({ id, title, price, image, quantity: 1 });
          showToast("Item added to cart!");
          this._render();
        }
      });
  }
}
