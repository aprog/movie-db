import { useState, useEffect} from 'react';
import { Movie, MovieCompany, MovieService } from "./service";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Container } from "@mui/material";
import { MoviesList } from "./components/movies-list";
import { ReviewFormManager } from "./components/review-form/manager";

export const App = () =>  {
  const movieService = new MovieService();
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const [movies, setMovies] = useState([] as Movie[]);
  const [companies, setCompanies] = useState(new Map<string, MovieCompany>());
  const [selected, setSelected] = useState<Movie | null>(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setIsLoading(true);
    setSelected(null);
    setLoadError(false);

    Promise.all([movieService.getMovies(), movieService.getCompanies()]).then(([movies, companies]) => {
      setMovies(movies);
      setCompanies(companies);
    }).catch(() => {
      setLoadError(true);

      // Reset values in case of failed request.
      setMovies([]);
      setCompanies(new Map());
    }).finally(() => {
      setIsLoading(false);
    });
  }

  function handleMovieSelection(movie: Movie | null) {
    setSelected(movie);
  }

  const refreshButton = (buttonText: string) => {
    return (
      <Button variant="contained" size="small" onClick={loadMovies}>
        {buttonText}
      </Button>
    );
  }

  const totalMovies = () => {
    return <p>Total movies: {movies.length}</p>;
  }

  const networkErrorMessage = () => {
    return <p className="error-message">Failed to load data (movie or company data wasn't received).</p>
  }

  return (
    <Container>
      <h2>Welcome to Movie database!</h2>
      <div>
        {refreshButton("Refresh")}
        {isLoading && <CircularProgress size="1em" sx={{ marginLeft: 1, verticalAlign: "middle" }}/>}
      </div>

      {!loadError && totalMovies()}

      {loadError
        ? networkErrorMessage()
        : <MoviesList movies={movies} companies={companies} movieSelected={handleMovieSelection} />
      }

      {selected && <ReviewFormManager movie={selected} unsetMovie={() => handleMovieSelection(null)} />}
    </Container>
  );
}
