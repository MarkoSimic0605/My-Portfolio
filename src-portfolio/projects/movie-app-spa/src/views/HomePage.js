import addBookmarkIcon from "url:../icons/add-bookmark.svg";
import filledBookmarkIcon from "url:../icons/filled-bookmark.svg";
import {
  isFavorite,
  toggleFavorite,
  renderFavoritesDropdown,
  updateFavoritesCount,
} from "../utils/favorites.js";

export default function HomePage(app) {
  try {
    const header = document.getElementById("main-header");
    if (header) header.style.display = "flex";

    document.getElementById("search-input")?.classList.remove("hidden");
    document.querySelector("header h1")?.classList.remove("hidden");

    renderMovieGrid();
  } catch (error) {
    console.error("HomePage initialization error:", error);
    app.innerHTML = '<p class="error">Error loading page content</p>';
  }
}

function renderMovieGrid() {
  try {
    const container =
      document.getElementById("movie-container") || createMovieContainer();
    const movies = JSON.parse(localStorage.getItem("movies") || "[]");

    const fragment = document.createDocumentFragment();
    movies.forEach((movie) => {
      const movieEl = document.createElement("div");
      movieEl.className = "movie";
      movieEl.dataset.id = movie.id;
      movieEl.innerHTML = `
        <div class="poster-wrapper">
          <img class="poster" src="https://image.tmdb.org/t/p/w500${
            movie.poster_path
          }" 
               alt="${movie.title}" />
          <div class="iconAddBookmark" data-fav-id="${movie.id}" 
               style="background-image: url('${
                 isFavorite(movie.id) ? filledBookmarkIcon : addBookmarkIcon
               }')"
               aria-label="${
                 isFavorite(movie.id)
                   ? "Remove from favorites"
                   : "Add to favorites"
               }">
          </div>
        </div>
        <h3>${movie.title}</h3>
        <p>Rating: ${movie.vote_average}</p>
      `;
      fragment.appendChild(movieEl);
    });

    container.innerHTML = "";
    container.appendChild(fragment);
    setupEventListeners();
  } catch (error) {
    console.error("Error rendering movie grid:", error);
    const container =
      document.getElementById("movie-container") || createMovieContainer();
    container.innerHTML = '<p class="error">Error loading movies</p>';
  }
}

function setupEventListeners() {
  const container = document.getElementById("movie-container");
  if (!container) return;

  const freshContainer = container.cloneNode(true);
  container.replaceWith(freshContainer);

  freshContainer.addEventListener("click", (e) => {
    const bookmarkIcon = e.target.closest(".iconAddBookmark");
    if (bookmarkIcon) {
      e.stopPropagation();
      handleFavoriteClick(e, bookmarkIcon);
      return;
    }

    const poster = e.target.closest(".poster");
    if (poster) {
      const movieId = poster.closest(".movie").dataset.id;
      window.location.hash = `#movie=${movieId}`;
    }
  });
}

function handleFavoriteClick(event, target) {
  try {
    event.preventDefault();
    const icon = target || event.target;
    const movieId = Number(icon.dataset.favId);

    // Add visual feedback
    icon.style.transform = "scale(1.2)";

    const wasAdded = toggleFavorite(movieId);

    // Update icon
    icon.style.backgroundImage = `url('${
      wasAdded ? filledBookmarkIcon : addBookmarkIcon
    }')`;
    icon.setAttribute(
      "aria-label",
      wasAdded ? "Remove from favorites" : "Add to favorites"
    );

    // Reset animation
    setTimeout(() => {
      icon.style.transform = "scale(1)";
    }, 200);

    // Update UI
    updateFavoritesCount();
    renderFavoritesDropdown();
    window.dispatchEvent(new Event("favoritesUpdated"));
  } catch (error) {
    console.error("Error handling favorite click:", error);
  }
}

function createMovieContainer() {
  const app = document.getElementById("app");
  const container = document.createElement("div");
  container.id = "movie-container";
  container.className = "movie-grid";
  app.appendChild(container);
  return container;
}
