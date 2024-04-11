import { CircularProgress } from "@mui/material";

export const LoadingSpinner = ({ isLoading }: { isLoading: boolean }) => {
  return isLoading && <CircularProgress size="1em" sx={{ marginLeft: 1, verticalAlign: "middle" }} />;
}
