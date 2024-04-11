import axios from "axios";
import { useEffect, useState } from "react";

export interface Movie {
  id: string;
  reviews: number[];
  averageReview: number;
  title: string;
  filmCompanyId: string;
  cost: number;
  releaseYear: number;
}

export interface MovieCompany {
  id: number;
  name: string;
}

export interface MovieReview {
  id: string;
  score: number;
  comment: string;
}

const API_URL = "http://localhost:3000";

export class MovieService {
  private client = axios.create({
    baseURL: API_URL
  });

  public async getMovies(url = "movies"): Promise<Movie[]> {
    const response = await this.client.get(url);

    // Calculate average value once. It'll be reused later.
    return response.data.map((movie: Movie) => {
      const averageReview = movie.reviews.length
        ? movie.reviews.reduce((a, v) => a + v, 0) / movie.reviews.length
        : 0;
      return Object.assign({}, movie, { averageReview });
    });
  }

  public async getCompanies(url = "movieCompanies"): Promise<Map<string, MovieCompany>> {
    const response = await this.client.get(url);
    const companies = response.data ?? [];

    // Prepare and return Map with companies to access
    // items in an efficient way (i.e. don't [].find() each time).
    return new Map<string, MovieCompany>(companies.map((company: MovieCompany) => [company.id, company]));
  }

  public async submitReview(url = "submitReview", review: MovieReview): Promise<string> {
    const response = await this.client.post(url, { review });
    return response.data.message ?? "";
  }
}

export const useMovies = (url = "movies") => {
  const [movies, setMovies] = useState([] as Movie[]);
  const [companies, setCompanies] = useState(new Map<string, MovieCompany>());

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const movieService = new MovieService();
  const loader = async () => {
    setIsLoading(true);
    setMovies([]);
    setCompanies(new Map());
    setError(null);

    try {
      // Simulate some network delay to show throbber.
      await new Promise((resolve) => setTimeout(resolve, 500));

      const [loadedMovies, loadedCompanies] = await Promise.all([movieService.getMovies(), movieService.getCompanies()]);
      setMovies(loadedMovies);
      setCompanies(loadedCompanies);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loader();
  }, [url]);

  const reload = () => loader();

  return { movies, companies, isLoading, error, reload };
}

export const useMovieReview = (url = "submitReview") => {
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState<unknown>(null);

  const movieService = new MovieService();
  // @TODO: useCallback()?
  const submitReview = async (review: MovieReview) => {
    setResponseMessage("");
    setError(null);

    try {
      // Simulate some network delay to show throbber.
      await new Promise((resolve) => setTimeout(resolve, 500));

      setResponseMessage(await movieService.submitReview(url, review));
    } catch (e) {
      setError(e);
    }
  };

  const reset = () => {
    setResponseMessage("");
    setError(null);
  }

  return { responseMessage, error, submitReview, reset };
}
