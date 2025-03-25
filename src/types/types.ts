
export interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  created_by?: { name: string }[];
  production_companies: { name: string }[];
  videos: {
    results: {
      key: string;
      site: string;
      type: string;
    }[];
  };
  credits: {
    cast: Cast[];
    crew: Crew[];
  };
  similar: {
    results: Movie[];
  };
  recommendations: {
    results: Movie[];
  };
  seasons?: Season[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  overview: string;
  air_date: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  still_path: string | null;
  air_date: string;
  runtime: number;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface CategoryRow {
  id: string;
  title: string;
  path: string;
  isLarge?: boolean;
}
