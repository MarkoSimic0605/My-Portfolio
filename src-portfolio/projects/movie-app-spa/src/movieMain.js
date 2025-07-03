import MovieController from "./controllers/MovieController.js";
import HomePage from "./views/HomePage.js";
import MoviePreview from "./views/MoviePreview.js";
import {
  initFavoritesDropdown,
  renderFavoritesDropdown,
  updateFavoritesCount,
} from "./utils/favorites.js";

const app = document.getElementById("app");

// Cleanup function to reset UI state
function cleanupBeforeRoute() {
  // Hide dropdown
  const dropdown = document.getElementById("favorites-dropdown");
  if (dropdown) {
    dropdown.classList.remove("show");
    document
      .getElementById("fav-toggle")
      ?.setAttribute("aria-expanded", "false");
  }

  // Clear any existing content
  app.innerHTML = "";
}

function router() {
  cleanupBeforeRoute();
  const hash = window.location.hash;

  if (hash.startsWith("#movie")) {
    const id = hash.split("=")[1];
    MoviePreview(app, id);
  } else {
    HomePage(app);
    initFavoritesDropdown();
  }
}

// Enhanced favorites update handler
function handleFavoritesUpdate() {
  updateFavoritesCount();
  renderFavoritesDropdown();

  // Re-init dropdown if it doesn't exist
  if (!document.getElementById("favorites-dropdown")) {
    initFavoritesDropdown();
  }
}

// Application initialization
async function initApp() {
  try {
    const controller = new MovieController();
    await controller.init();

    // Set up global event listeners
    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);
    window.addEventListener("hashchange", router);

    // Initial route
    router();
  } catch (error) {
    console.error("Application initialization failed:", error);
    app.innerHTML = '<p class="error">Failed to load application</p>';
  }
}

// Start the app
if (document.readyState === "complete") {
  initApp();
} else {
  window.addEventListener("load", initApp);
}
