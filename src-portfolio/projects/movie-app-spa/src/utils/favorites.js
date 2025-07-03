let cachedFavorites = null;

function getCachedFavorites() {
  if (!cachedFavorites) {
    cachedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  }
  return cachedFavorites;
}

function updateCache(favorites) {
  cachedFavorites = favorites;
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

export function getFavorites() {
  return getCachedFavorites();
}

export function addToFavorites(movie) {
  const favorites = getCachedFavorites();
  if (!favorites.some((fav) => fav.id === movie.id)) {
    const updated = [...favorites, movie];
    updateCache(updated);
    return true;
  }
  return false;
}

export function removeFromFavorites(movieId) {
  const favorites = getCachedFavorites();
  const updated = favorites.filter((fav) => fav.id !== movieId);
  updateCache(updated);
  return updated;
}

export function isFavorite(movieId) {
  return getCachedFavorites().some((fav) => fav.id === movieId);
}

// add to favorites.js
export function toggleFavorite(movieId) {
  const favorites = getFavorites();
  const movies = JSON.parse(localStorage.getItem("movies") || "[]");
  const movie = movies.find((m) => m.id === movieId);

  if (!movie) {
    console.error("Movie not found in local storage");
    return false;
  }

  const existingIndex = favorites.findIndex((fav) => fav.id === movieId);
  const wasAdded = existingIndex === -1;

  if (wasAdded) {
    addToFavorites(movie);
  } else {
    removeFromFavorites(movieId);
  }

  // update UI components
  window.dispatchEvent(new Event("favoritesUpdated"));
  return wasAdded;
}

export function initFavoritesDropdown() {
  updateFavoritesCount();
  const toggleBtn = document.getElementById("fav-toggle");
  const dropdown = document.getElementById("favorites-dropdown");

  if (!toggleBtn || !dropdown) return;

  dropdown.classList.remove("show");

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isExpanded = dropdown.classList.toggle("show");

    dropdown.classList.toggle("show", isExpanded);
    toggleBtn.setAttribute("aria-expanded", isExpanded);
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== toggleBtn) {
      dropdown.classList.remove("show");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });

  renderFavoritesDropdown();
}

// Helper function to update favorites count
export function updateFavoritesCount() {
  const toggleBtn = document.getElementById("fav-toggle");
  if (toggleBtn) {
    const count = getFavorites().length;
    toggleBtn.innerHTML = `❤️ Favorites <span class="favorites-count">(${count})</span>`;
    toggleBtn.setAttribute("data-count", count);
  }
}

export function renderFavoritesDropdown() {
  const dropdown = document.getElementById("favorites-dropdown");
  const favList = document.getElementById("fav-list");
  const favorites = getFavorites();

  if (!dropdown || !favList) {
    console.warn("Dropdown elements not found in DOM");
    return;
  }

  favList.innerHTML =
    favorites.length > 0
      ? `
      <h3>Favorites (${favorites.length})</h3>
      <ul>
        ${favorites
          .map(
            (fav) => `
          <li>
            <a href="#movie=${fav.id}">${fav.title}</a>
            <button class="remove-favorite" data-remove-id="${fav.id}">❌</button>
          </li>
        `
          )
          .join("")}
      </ul>
    `
      : '<p class="empty-favorites">No favorites yet</p>';

  // Add event listeners for remove buttons
  favList.querySelectorAll(".remove-favorite").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = Number(e.currentTarget.dataset.removeId);
      if (
        confirm("Are you sure you want to remove this movie from favorites?")
      ) {
        removeFromFavorites(id);
        window.dispatchEvent(new Event("favoritesUpdated"));
      }
    });
  });
}
