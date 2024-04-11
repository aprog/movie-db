import { useState } from "react";
import { Movie, MovieCompany } from "./service";
import { MoviesList } from "./components/MoviesList";
import { ReviewFormManager } from "./components/ReviewFormManager";

interface MoviesPageProps {
  movies: Movie[];
  companies: Map<string, MovieCompany>;
}

const TotalMovies = ({ movies }: { movies: Movie[] }) => {
  return <p>Total movies: {movies.length}</p>;
}

const MoviesPage = ({ movies, companies }: MoviesPageProps) => {
  const [selected, setSelected] = useState<Movie | null>(null);

  const handleMovieSelection = (movie: Movie | null) => {
    if (!movie) {
      setSelected(null);
      return;
    }

    // Unselect the item if the same movie was selected again.
    const selectedMovie = selected && selected.id === movie.id
      ? null
      : movie;

    setSelected(selectedMovie);
  }

  return (
    <>
      <TotalMovies movies={movies} />
      <MoviesList
        movies={movies}
        companies={companies}
        movieSelected={handleMovieSelection}
        currentMovie={selected}
      />

      {selected && <ReviewFormManager movie={selected} unsetMovie={() => handleMovieSelection(null)} />}
    </>
  )
}

export default MoviesPage;
