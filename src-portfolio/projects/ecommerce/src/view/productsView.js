import { pagination } from "../utils/helpers";

export default class ProductsView {
  constructor() {
    this.productsGrid = document.querySelector(".products-grid");
    this.searchInput = document.querySelector(".search-input");
    this.categoryFilter = document.querySelector(".category-filter");
    this.deleteAllBtn = document.querySelector(".btn-delete-all");
  }

  renderProducts(products) {
    this.productsGrid.innerHTML = products
      .map(
        (product) => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.thumbnail}" alt="${
          product.title
        }" class="product-img">
        <div class="product-info">
          <h3 class="product-title">${product.title}</h3>
          <p class="product-price">$${product.price}</p>
          <p class="product-desc">${product.description.substring(0, 60)}...</p>
          <button class="btn-add-to-cart">Add to cart</button>
        </div>
      </div>
    `
      )
      .join("");
  }

  renderCategories(categories) {
    // category and arr check
    if (!categories || !Array.isArray(categories)) return;

    const options = categories
      .filter((category) => typeof category === "string") // filter only string
      .map(
        (category) =>
          `<option value="${category}">${this.capitalizeFirstLetter(
            category
          )}</option>`
      )
      .join("");

    this.categoryFilter.innerHTML = `
    <option value="all">All categories</option>
    ${options}
  `;
  }

  capitalizeFirstLetter(string) {
    // Check if its a string
    if (typeof string !== "string" || !string) {
      return string
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
  }

  bindSearch(handler) {
    this.searchInput.addEventListener("input", (event) => {
      handler(event.target.value);
    });
  }

  bindCategoryFilter(handler) {
    this.categoryFilter.addEventListener("change", (event) => {
      handler(event.target.value);
    });
  }

  bindAddToCart(handler) {
    this.productsGrid.addEventListener("click", (event) => {
      if (event.target.classList.contains("btn-add-to-cart")) {
        const productId = event.target.closest(".product-card").dataset.id;
        handler(productId);
      }
    });
  }

  renderPagination({ currentPage, totalPages }, onPageChange) {
    const container = document.querySelector(".page-numbers");
    const prevBtn = document.querySelector(".btn-prev");
    const nextBtn = document.querySelector(".btn-next");

    pagination.renderPagination(
      container,
      prevBtn,
      nextBtn,
      { currentPage, totalPages },
      onPageChange
    );
  }

  bindDeleteProduct(handler) {
    this.productsGrid.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-delete-product")) {
        const id = e.target.closest(".product-card").dataset.id;
        handler(id);
      }
    });
  }

  bindDeleteAll(handler) {
    if (!this.deleteAllBtn) return;
    this.deleteAllBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete all products?")) {
        handler();
      }
    });
  }

  bindBurgerMenu() {
    const burger = document.querySelector(".burger");
    const navList = document.querySelector(".nav__list");

    if (!burger || !navList) return;

    burger.addEventListener("click", (e) => {
      navList.classList.toggle("active");
      burger.classList.toggle("toggle");
      e.stopPropagation();
    });

    document.addEventListener("click", (e) => {
      const clickedOutside =
        !navList.contains(e.target) && !burger.contains(e.target);
      if (clickedOutside) {
        navList.classList.remove("active");
        burger.classList.remove("toggle");
      }
    });

    navList.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        navList.classList.remove("active");
        burger.classList.remove("toggle");
      });
    });
  }
}
