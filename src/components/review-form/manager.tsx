import { useMediaQuery, useTheme } from "@mui/material";
import { Movie, MovieService, MovieReview } from "../../service";
import { RegularReviewForm } from "./regular";
import { ModalReviewForm } from "./modal";

export const REVIEW_COMMENT_LENGTH = 100;

type ManagerArguments = {
  movie: Movie;
  unsetMovie: () => void;
}

export type FormArguments = {
  movie: Movie;
  submitForm: (movie: MovieReview) => Promise<string>;
  closeForm: () => void;
}

/**
 * Renders regular or modal Review Form depending on screen size.
 */
export function ReviewFormManager(args: ManagerArguments) {
  const movieService = new MovieService();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const formParam = {
    movie: args.movie,
    submitForm: submitReview,
    closeForm: () => args.unsetMovie(),
  } satisfies FormArguments;

  async function submitReview(review: MovieReview): Promise<string> {
    if (review.comment.length > REVIEW_COMMENT_LENGTH) {
      // Convert to customized error type.
      throw new Error("The form contains invalid comment.");
    }

    return movieService.submitReview(review);
  }

  return isSmallScreen ? ModalReviewForm(formParam) : RegularReviewForm(formParam);
}