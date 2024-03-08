import TableContainer from "@mui/material/TableContainer";
import { Movie, MovieCompany } from "../service";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  SortDirection
} from "@mui/material";
import { useMemo, useState } from "react";

type ListArguments = {
  movies: Movie[];
  companies: Map<string, MovieCompany>;
  movieSelected: (movie: Movie | null) => void;
}

/**
 * Renders a table with provided movies and related companies.
 */
export function MoviesList(args: ListArguments) {
  const [order, setOrder] = useState<SortDirection>("desc");
  const [selected, setSelected] = useState<Movie | null>(null);
  const visibleMovies = useMemo(() => {
    return args.movies.sort((a, b) => order === "asc" ? a.averageReview - b.averageReview : b.averageReview - a.averageReview);
  }, [args.movies, order]);

  function handleRequestSort(): void {
    setOrder(order === "asc" ? "desc" : "asc");
  }

  function handleMovieSelection(movie: Movie) {
    const selectedMovie = selected && selected.id === movie.id
      ? null
      : movie;

    args.movieSelected(selectedMovie);
    setSelected(selectedMovie);
  }

  function getCompanyName(movie: Movie): string {
    return args.companies.has(movie.filmCompanyId)
      ? args.companies.get(movie.filmCompanyId)?.name ?? ""
      : "";
  }

  return (
    <TableContainer>
    <Table
      sx={{ maxWidth: 750 }}
      aria-labelledby="tableTitle"
    >
      <TableHead>
        <TableRow>
          <TableCell key="title">Title</TableCell>
          <TableCell
              key="reviews"
              sortDirection={order}
            >
              <TableSortLabel
                active={true}
                direction={order ? order : undefined}
                onClick={handleRequestSort}
              >
                Reviews
              </TableSortLabel>
            </TableCell>
          <TableCell key="company">Company</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {visibleMovies.map((row, index) => {
          const labelId = `row-${index}`;

          return (
            <TableRow
              hover
              onClick={() => handleMovieSelection(row)}
              selected={!!selected && selected.id === row.id}
              tabIndex={-1}
              key={row.id}
            >
              <TableCell
                component="th"
                id={labelId}
                scope="row"
              >
                {row.title}
              </TableCell>
              <TableCell>{row.averageReview.toFixed(1)}</TableCell>
              <TableCell>{getCompanyName(row)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    </TableContainer>
  );
}