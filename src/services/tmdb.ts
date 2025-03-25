
import { Episode, MovieDetails, MovieResponse, Season } from "@/types/types";

const API_KEY = "3e12d92ee7d2e655071a5e5b30579d83"; // Free TMDB API key for demo purposes
const BASE_URL = "https://api.themoviedb.org/3";
const LANGUAGE = "en-US";

const requests = {
  fetchTrending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=${LANGUAGE}`,
  fetchNetflixOriginals: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213&language=${LANGUAGE}`,
  fetchTopRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=${LANGUAGE}`,
  fetchActionMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&language=${LANGUAGE}`,
  fetchComedyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35&language=${LANGUAGE}`,
  fetchHorrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27&language=${LANGUAGE}`,
  fetchRomanceMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749&language=${LANGUAGE}`,
  fetchDocumentaries: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99&language=${LANGUAGE}`,
  fetchPopularTVShows: `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=${LANGUAGE}`,
  searchMulti: `${BASE_URL}/search/multi?api_key=${API_KEY}&language=${LANGUAGE}`,
};

export const categories = [
  {
    id: "netflix-originals",
    title: "Netflix Originals",
    path: requests.fetchNetflixOriginals,
    isLarge: true,
  },
  {
    id: "trending",
    title: "Trending Now",
    path: requests.fetchTrending,
  },
  {
    id: "top-rated",
    title: "Top Rated",
    path: requests.fetchTopRated,
  },
  {
    id: "action",
    title: "Action Movies",
    path: requests.fetchActionMovies,
  },
  {
    id: "comedy",
    title: "Comedy Movies",
    path: requests.fetchComedyMovies,
  },
  {
    id: "horror",
    title: "Horror Movies",
    path: requests.fetchHorrorMovies,
  },
  {
    id: "romance",
    title: "Romance Movies",
    path: requests.fetchRomanceMovies,
  },
  {
    id: "documentaries",
    title: "Documentaries",
    path: requests.fetchDocumentaries,
  },
  {
    id: "tv-shows",
    title: "TV Shows",
    path: requests.fetchPopularTVShows,
  },
];

export const fetchFromAPI = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const searchContent = async (query: string): Promise<MovieResponse> => {
  const url = `${requests.searchMulti}&query=${encodeURIComponent(query)}`;
  return fetchFromAPI<MovieResponse>(url);
};

export const fetchMovieDetails = async (id: string, mediaType: string): Promise<MovieDetails> => {
  const url = `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&language=${LANGUAGE}&append_to_response=videos,credits,similar,recommendations`;
  return fetchFromAPI<MovieDetails>(url);
};

export const fetchSeasonDetails = async (id: string, seasonNumber: number): Promise<{ episodes: Episode[] }> => {
  const url = `${BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}&language=${LANGUAGE}`;
  return fetchFromAPI<{ episodes: Episode[] }>(url);
};

export const getImageUrl = (path: string | null, size: string = "original"): string => {
  if (!path) return "/placeholder.svg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export default requests;
