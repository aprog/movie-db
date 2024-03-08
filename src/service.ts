import axios from "axios";

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
  score: number;
  comment: string;
}

const API_URL = "http://localhost:3000";

export class MovieService {
  private client = axios.create({
    baseURL: API_URL
  });

  public async getMovies(): Promise<Movie[]> {
    const response = await this.client.get("movies");
    return response.data.map((movie: Movie) => {
      // Calculate average value once. It'll be reused later.
      const averageReview = movie.reviews.length
        ? movie.reviews.reduce((a, v) => a + v, 0) / movie.reviews.length
        : 0;
      return Object.assign({}, movie, { averageReview });
    });
  }

  public async getCompanies(): Promise<Map<string, MovieCompany>> {
    const response = await this.client.get("movieCompanies");
    const companies = response.data ?? [];

    // Prepare and return Map with companies to access items in an efficient way (i.e. don't [].find() each time).
    return new Map<string, MovieCompany>(companies.map((company: MovieCompany) => [company.id, company]));
  }

  public async submitReview(review: MovieReview): Promise<string> {
    const response = await this.client.post("submitReview", { review });
    return response.data.message ?? "";
  }
}
