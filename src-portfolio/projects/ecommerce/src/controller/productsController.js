import ProductsModel from "../model/productsModel.js";
import ProductsView from "../view/productsView.js";
import { throttle, debounce } from "../utils/helpers.js";

export default class ProductsController {
  constructor(cartModel) {
    this.model = new ProductsModel();
    this.view = new ProductsView();
    this.cartModel = cartModel;
    this.searchTimeout = null;
  }

  async init() {
    await this.loadProducts();
    await this.loadCategories();
    this.setupEventListeners();
    this.view.bindBurgerMenu();
  }

  async loadProducts(page = 1, category = "all", searchQuery = "") {
    try {
      // unable btn until page loads
      document.querySelector(".btn-next").disabled = true;
      document.querySelector(".btn-prev").disabled = true;

      // update model with curr values
      this.model.currentPage = page;
      this.model.currentCategory = category;
      this.model.currentSearchQuery = searchQuery;

      const products = await this.model.fetchProducts(
        page,
        category,
        searchQuery
      );

      this.view.renderProducts(products);

      this.view.renderPagination(
        {
          currentPage: this.model.currentPage,
          totalPages: this.model.getTotalPages(),
        },
        (selectedPage) => {
          this.loadProducts(
            selectedPage,
            this.model.currentCategory,
            this.model.currentSearchQuery
          );
        }
      );

      // enable btn after load
      document.querySelector(".btn-next").disabled = false;
      document.querySelector(".btn-prev").disabled = false;
    } catch (error) {
      console.error("Error loading products:", error);
      this.view.showError("Failed to load products");
    }
  }

  async loadCategories() {
    try {
      const categories = await this.model.fetchCategories();

      if (!Array.isArray(categories)) {
        console.error("Received categories is not an array:", categories);
        return;
      }

      this.view.renderCategories(categories);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  setupEventListeners() {
    // search for debounce
    this.view.bindSearch(
      debounce((query) => {
        this.loadProducts(1, "all", query);
      }, 500)
    );

    // category filter
    this.view.bindCategoryFilter((category) => {
      this.loadProducts(1, category);
    });

    // pagination
    document.querySelector(".btn-prev").addEventListener("click", async () => {
      const prevPage = this.model.currentPage - 1;

      if (prevPage >= 1) {
        this.loadProducts(
          prevPage,
          this.model.currentCategory,
          this.model.currentSearchQuery
        );
      }
    });

    document.querySelector(".btn-next").addEventListener("click", async () => {
      const nextPage = this.model.currentPage + 1;
      if (nextPage <= this.model.getTotalPages()) {
        this.loadProducts(
          nextPage,
          this.model.currentCategory,
          this.model.currentSearchQuery
        );
      }
    });

    this.view.bindDeleteProduct((id) => {
      this.model.deleteProduct(id);
      this.loadProducts(
        this.model.currentPage,
        this.model.currentCategory,
        this.model.currentSearchQuery
      );
    });

    this.view.bindDeleteAll(() => {
      this.model.deleteAllProducts();
      this.loadProducts();
    });

    // scroll throttle
    window.addEventListener(
      "scroll",
      throttle(this.handleScroll.bind(this), 300)
    );
  }
  _getTotalQuantity(items) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  handleScroll() {
    console.log("Scroll event throttled");
  }
}
