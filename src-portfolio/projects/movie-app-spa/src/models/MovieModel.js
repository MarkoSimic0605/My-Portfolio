import axios from "axios";
import { TMDB_API_KEY, BASE_URL } from "../helpers/config.js";

export default class MovieModel {
  async fetchMovies(query) {
    try {
      const url = query
        ? `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`
        : `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`;
      const response = await axios.get(url);
      return response.data.results;
    } catch (error) {
      console.error("Error fetching movies:", error);
      return []; // return full arr if app crashes
    }
  }
  async fetchTrailer(id) {
    const url = `${BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`;
    const response = await axios.get(url);
    return response.data.results;
  }
}
