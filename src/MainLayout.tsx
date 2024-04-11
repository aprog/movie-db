import { MouseEventHandler } from "react";
import { Button, styled } from "@mui/material";
import { useMovies } from "./service";
import MoviesPage from "./MoviesPage";
import { LoadingSpinner } from "./components/LoadingSpinner";

const Header = ({ refresh }: { refresh: MouseEventHandler }) => {
  return (
    <>
      <h2>Welcome to Movie database!</h2>
      <RefreshButton label="Refresh" refresh={refresh} />
    </>
  );
}

const RefreshButton = ({ label, refresh }: { label: string; refresh: MouseEventHandler }) => {
  return (
    <Button variant="contained" size="small" onClick={refresh}>
      {label}
    </Button>
  );
}

export const ErrorMessage = styled("div")(() => ({
  color: "red",
}))

const LoaderError = () => {
  return (
    <ErrorMessage sx={{ my: 2 }}>
      Failed to load data (movie or company data wasn't received).
    </ErrorMessage>
  );
}

const MainLayout = () => {
  const { movies, companies, isLoading, error, reload } = useMovies();

  return (
    <>
      <Header refresh={async () => await reload()} />

      <LoadingSpinner isLoading={isLoading} />
      {!!error && <LoaderError />}

      {!isLoading && !error && <MoviesPage movies={movies} companies={companies} />}
    </>
  )
}

export default MainLayout;
