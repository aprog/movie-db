import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { Movie } from "../../service";
import { RegularReviewForm } from "./RegularReviewForm";
import { ModalReviewForm } from "./ModalReviewForm";
import * as Yup from "yup";
import { FormikProps } from "formik";
import { MouseEventHandler } from "react";
import styled from "@emotion/styled";

export const REVIEW_COMMENT_LENGTH = 100;

type ManagerProps = {
  movie: Movie;
  unsetMovie: () => void;
}

export type FormProps = {
  movie: Movie;
  closeForm: () => void;
}

export interface ModalFormFields {
  score: string;
  comment: string;
}

export const validationSchema = Yup.object({
  score: Yup.number().typeError("Must be a number").required("Required"),
  comment: Yup.string().max(REVIEW_COMMENT_LENGTH, `Must be ${REVIEW_COMMENT_LENGTH} characters or less.`)
});

export const ResponseMessage = ({ isSubmitting, errors, touched, responseMessage, isModal = false }: FormikProps<ModalFormFields> & { responseMessage: string, isModal?: boolean }) => {
  const hasError = touched.score && Boolean(errors.score) || touched.comment && Boolean(errors.comment);

  return !isSubmitting
    && !hasError && responseMessage
    && <Box sx={{ marginTop: 2, marginBottom: isModal ? 0 : 2 }}>{responseMessage}</Box>
}

export const SubmitButton = ({ isSubmitting, errors, touched, onButtonClick }: FormikProps<ModalFormFields> & { onButtonClick: MouseEventHandler }) => {
  const hasError = touched.score && Boolean(errors.score) || touched.comment && Boolean(errors.comment);

  {/* Is it safe to use LoadingButton from "@mui/lab" in the production? */ }
  return (
    <Button
      variant="contained"
      size="small"
      type="submit"
      disabled={hasError || isSubmitting}
      onClick={onButtonClick}
    >
      Submit
    </Button>
  );
}

export const ReviewFormWrapper = styled("div")(() => ({
  width: "20em"
}))

/**
 * Renders regular or modal Review Form depending on screen size.
 */
export const ReviewFormManager = ({ movie, unsetMovie }: ManagerProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const formProps = {
    movie,
    closeForm: () => unsetMovie(),
  } satisfies FormProps;

  return isSmallScreen ? ModalReviewForm(formProps) : RegularReviewForm(formProps);
}
