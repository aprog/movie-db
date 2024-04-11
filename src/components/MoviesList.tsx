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

type ListProps = {
  movies: Movie[];
  companies: Map<string, MovieCompany>;
  currentMovie: Movie | null;
  movieSelected: (movie: Movie | null) => void;
}

type TableHeaderProps = {
  order: SortDirection;
  orderUpdated: () => void;
}

type TableBodyProps = {
  movies: Movie[];
  companies: Map<string, MovieCompany>;
  selected: Movie | null;
  movieSelected: (movie: Movie) => void;
}

const MoviesTableHeader = ({ order, orderUpdated }: TableHeaderProps) => {
  return (
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
            onClick={orderUpdated}
          >
            Reviews
          </TableSortLabel>
        </TableCell>
        <TableCell key="company">Company</TableCell>
      </TableRow>
    </TableHead>
  );
}

const MoviesTableBody = ({ movies, companies, selected, movieSelected }: TableBodyProps) => {
  const getCompanyName = (movie: Movie): string => {
    return companies.has(movie.filmCompanyId)
      ? companies.get(movie.filmCompanyId)?.name ?? ""
      : "";
  }

  return (
    <TableBody>
      {movies.map((row, index) => {
        const labelId = `row-${index}`;

        return (
          <TableRow
            hover
            onClick={() => movieSelected(row)}
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
  );
}

/**
 * Renders a table with provided movies and related companies.
 */
export const MoviesList = ({ movies, companies, currentMovie, movieSelected }: ListProps) => {
  const [order, setOrder] = useState<SortDirection>("desc");
  const visibleMovies = useMemo(() => {
    return movies.sort((a, b) => order === "asc"
      ? a.averageReview - b.averageReview
      : b.averageReview - a.averageReview
    );
  }, [movies, order]);

  const handleRequestSort = (): void => {
    setOrder(order === "asc" ? "desc" : "asc");
  }

  return (
    <TableContainer>
      <Table
        sx={{ maxWidth: 750 }}
        aria-labelledby="Movies Database"
      >
        <MoviesTableHeader order={order} orderUpdated={handleRequestSort} />
        <MoviesTableBody
          movies={visibleMovies}
          companies={companies}
          selected={currentMovie}
          movieSelected={movieSelected}
        />
      </Table>
    </TableContainer>
  );
}
