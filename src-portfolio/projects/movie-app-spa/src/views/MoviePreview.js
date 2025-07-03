import MovieModel from "../models/MovieModel.js";
import {
  isFavorite,
  toggleFavorite,
  renderFavoritesDropdown,
  initFavoritesDropdown,
} from "../utils/favorites.js";

export default async function MoviePreview(app, id) {
  const header = document.getElementById("main-header");
  if (header) header.style.display = "none";

  const movies = JSON.parse(localStorage.getItem("movies") || "[]");
  const movie = movies.find((m) => m.id == id);
  document.getElementById("search-input")?.classList.add("hidden");
  document.querySelector("header h1")?.classList.add("hidden");

  // Clear previous content
  app.innerHTML = "";

  if (!movie) {
    app.innerHTML = "<p>Movie not found.</p>";
    return;
  }

  const model = new MovieModel();
  const videos = await model.fetchTrailer(id);
  const trailer = videos.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  const modalHTML = `
    <div id="trailer-modal" class="modal hidden">
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <div class="video-container"></div>
      </div>
    </div>
  `;

  app.innerHTML = `
    ${modalHTML}
    <div class="backdrop">
      <div class="movie-details">
        <div class="image-section">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
    movie.title
  }" />
        </div>
        <div class="info-section">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="movie-meta">Release Date: ${movie.release_date} | Rating: ${
    movie.vote_average
  }</p>
          <p id="movie-overview">${movie.overview}</p>
          <div class="actions">
            <button id="favorite-btn" style="background: none; border: none; cursor: pointer;">
              ${
                isFavorite(movie.id)
                  ? "❤️ Remove from Favorites"
                  : "🤍 Add to Favorites"
              }
            </button>
            ${
              trailer
                ? `<a id="trailer-link">🎬 Watch trailer</a>`
                : `<p>No trailer available.</p>`
            }
            <button id="go-back">⏪ Back</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // background set
  document
    .querySelector(".backdrop")
    .style.setProperty(
      "--poster-url",
      `url(https://image.tmdb.org/t/p/original${movie.poster_path})`
    );

  // Event listener for favorite btn
  document.getElementById("favorite-btn")?.addEventListener("click", () => {
    toggleFavorite(movie.id);
    // Update the button text
    const btn = document.getElementById("favorite-btn");
    btn.innerHTML = isFavorite(movie.id)
      ? "❤️ Remove from Favorites"
      : "🤍 Add to Favorites";
    renderFavoritesDropdown();
    window.dispatchEvent(new Event("favoritesUpdated"));
  });

  // modal trailer view
  if (trailer) {
    const watchBtn = document.getElementById("trailer-link");
    const modal = document.getElementById("trailer-modal");
    const videoContainer = modal.querySelector(".video-container");
    const closeBtn = modal.querySelector(".close-button");

    watchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.remove("hidden");
      videoContainer.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
      `;
    });

    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      videoContainer.innerHTML = "";
    });
  }

  // back btn
  document.getElementById("go-back").addEventListener("click", () => {
    window.location.hash = "";
  });
  initFavoritesDropdown();
}
