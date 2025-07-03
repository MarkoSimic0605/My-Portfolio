import axios from "axios";
import { pagination } from "../utils/helpers.js";

export default class ProductsModel {
  constructor() {
    this.products = [];
    this.cart = [];
    this.currentPage = 1;
    this.productsPerPage = 12;
    this.totalProducts = 0;
    this.categories = [];
    this.currentCategory = "all";
    this.currentSearchQuery = "";
  }

  async fetchProducts(page = 1, category = "all", searchQuery = "") {
    try {
      this.currentPage = page;
      this.currentCategory = category;
      this.currentSearchQuery = searchQuery;

      let url = `https://dummyjson.com/products?limit=${
        this.productsPerPage
      }&skip=${(page - 1) * this.productsPerPage}`;

      if (category !== "all") {
        url = `https://dummyjson.com/products/category/${category}`;
      }

      if (searchQuery) {
        url = `https://dummyjson.com/products/search?q=${searchQuery}`;
      }

      const response = await axios.get(url);

      // if filter or serach, load all items
      if (category !== "all" || searchQuery) {
        this.products = response.data.products;
        this.totalProducts = response.data.total || this.products.length;
        return this.getPaginatedProducts(); // Ručna paginacija na klijentskoj strani
      } else {
        this.products = response.data.products;
        this.totalProducts = response.data.total;
        return this.products;
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async fetchCategories() {
    try {
      const response = await axios.get(
        "https://dummyjson.com/products/categories"
      );
      this.categories = response.data;
      return this.categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  getPaginatedProducts() {
    return pagination.getPaginatedItems(
      this.products,
      this.currentPage,
      this.productsPerPage
    );
  }

  getTotalPages() {
    // if total item not defined or 0, return 1 page
    if (!this.totalProducts || this.totalProducts <= 0) return 1;
    return pagination.getTotalPages(this.totalProducts, this.productsPerPage);
  }

  addToCart(product) {
    this.cart.push(product);
    console.log(this.cart);
    return this.cart;
  }

  // func for page update without new data fetch
  changePage(page) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      return this.getPaginatedProducts();
    }
    return [];
  }

  deleteProduct(id) {
    this.products = this.products.filter((p) => p.id !== +id);
    this.totalProducts = this.products.length;
  }

  deleteAllProducts() {
    this.products = [];
    this.totalProducts = 0;
  }
}
