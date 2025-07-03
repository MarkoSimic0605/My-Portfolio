import MovieModel from "../models/MovieModel.js";

export default class MovieController {
  constructor() {
    this.model = new MovieModel();
    this.searchInput = document.getElementById("search-input");
  }

  async init() {
    const movies = await this.model.fetchMovies();
    localStorage.setItem("movies", JSON.stringify(movies));

    //refresh display
    window.dispatchEvent(new Event("hashchange"));

    this.searchInput.addEventListener("input", async (e) => {
      const query = e.target.value.trim();

      if (query === "") {
        const popular = await this.model.fetchMovies();
        localStorage.setItem("movies", JSON.stringify(popular));

        window.dispatchEvent(new Event("hashchange"));
        return;
      }

      if (query.length >= 2) {
        const results = await this.model.fetchMovies(query);
        localStorage.setItem("movies", JSON.stringify(results));
        window.dispatchEvent(new Event("hashchange"));
      }
    });
  }
}
