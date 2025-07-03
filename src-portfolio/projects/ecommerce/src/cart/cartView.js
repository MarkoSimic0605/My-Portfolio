export default class CartView {
  constructor() {
    this.cartIcon = document.querySelector(".cart-icon");
    this.cartDropdown = document.querySelector(".cart-dropdown");
    this.cartCountEl = document.querySelector(".cart-count");
    this.cartItemsContainer = this.cartDropdown?.querySelector(".cart-items");
    this.clearBtn = this.cartDropdown?.querySelector(".btn-clear");

    this._addToggleListener();
    this._addOutsideClickListener();
  }

  renderCartItems(items) {
    if (!this.cartItemsContainer) return;

    this.cartItemsContainer.innerHTML = "";

    if (items.length === 0) {
      this.cartItemsContainer.innerHTML =
        '<p class="empty">Your cart is empty</p>';
      return;
    }

    items.forEach((item) => {
      const itemEl = document.createElement("div");
      itemEl.classList.add("cart-item");

      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-img" />
        <div class="cart-info">
          <strong>${item.title}</strong>
          <span>Qty: ${item.quantity}</span>
          <span>Price: $${parseFloat(item.price)}</span>
        </div>
        <button class="remove-item" data-id="${item.id}">Remove</button>
      `;

      this.cartItemsContainer.appendChild(itemEl);
    });

    const totalPrice = this.calculateTotal(items);
    this.cartItemsContainer.insertAdjacentHTML(
      "beforeend",
      `
    <div class="cart-total">
      <strong>Total:</strong> $${totalPrice}
    </div>
    `
    );

    this._addRemoveListeners();
  }

  updateCartCount(count) {
    if (this.cartCountEl) {
      this.cartCountEl.textContent = count;
    }
  }

  calculateTotal(items) {
    return items
      .reduce((total, item) => {
        const price = parseFloat(item.price);
        if (isNaN(price)) return total;
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  }

  _addToggleListener() {
    if (this.cartIcon) {
      this.cartIcon.addEventListener("click", () => {
        this.cartDropdown?.classList.toggle("visible");
      });
    }

    const closeBtn = this.cartDropdown?.querySelector(".close-cart");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.cartDropdown.classList.remove("visible");
      });
    }
  }

  _addOutsideClickListener() {
    document.addEventListener("click", (e) => {
      if (
        !this.cartDropdown?.contains(e.target) &&
        !this.cartIcon?.contains(e.target)
      ) {
        this.cartDropdown?.classList.remove("visible");
      }
    });
  }

  _addRemoveListeners() {
    this.cartDropdown?.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        this.onRemoveItem?.(id);
      });
    });
  }

  bindRemoveItem(handler) {
    this.onRemoveItem = handler;
  }

  bindClearAll(handler) {
    if (this.clearBtn) {
      this.clearBtn.addEventListener("click", handler);
    }
  }
}
