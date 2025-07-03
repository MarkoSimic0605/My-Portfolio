export default class CartModel {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("cart")) || [];
  }

  getItems() {
    return this.items;
  }

  save() {
    localStorage.setItem("cart", JSON.stringify(this.items));
  }

  addItem(item) {
    const parsedPrice = parseFloat(item.price);

    const existing = this.items.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.push({
        ...item,
        price: isNaN(parsedPrice) ? 0 : parsedPrice, // fallback if invalid num
      });
    }

    this._persist();
  }

  removeItem(id) {
    this.items = this.items.filter((i) => i.id !== id);
    this._persist();
  }

  clearCart() {
    this.items = [];
    this._persist();
  }

  _persist() {
    try {
      localStorage.setItem("cart", JSON.stringify(this.items));
    } catch (err) {
      console.error("Error saving data into localStorage:", err);
    }
  }
}
