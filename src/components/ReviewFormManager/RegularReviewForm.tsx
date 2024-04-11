import TextField from "@mui/material/TextField";
import { FormProps, REVIEW_COMMENT_LENGTH, ResponseMessage, ReviewFormWrapper, SubmitButton, validationSchema } from ".";
import { MovieReview, useMovieReview } from "../../service";
import { useEffect } from "react";
import { useFormik } from "formik";
import { ErrorMessage } from "../../MainLayout";
import { LoadingSpinner } from "../LoadingSpinner";

const Title = ({ title }: { title: string }) => {
  return <p><strong>Review "{title}"</strong></p>;
}

/**
 * Regular Review Form.
 *
 * This variation is used on by default. In case of smaller screens Modal form is shown.
 */
export const RegularReviewForm = ({ movie }: FormProps) => {
  const { responseMessage, error, submitReview, reset } = useMovieReview();

  const formik = useFormik({
    initialValues: { score: "", comment: "" },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const review = {
        id: movie.id,
        score: parseFloat(values.score),
        comment: values.comment
      } satisfies MovieReview;

      await submitReview(review);
    }
  });

  // Reset the form while switching the movie.
  useEffect(() => {
    formik.resetForm();
    reset();
  }, [movie]);

  // Keep form fields if submission failed.
  useEffect(() => {
    if (!error && responseMessage) {
      formik.resetForm();
    }
  }, [error, responseMessage]);

  return (
    <ReviewFormWrapper>
      <form onSubmit={formik.handleSubmit} onChange={reset}>
        <Title title={movie.title} />

        <TextField
          fullWidth
          className="field"
          type="text"
          id="score"
          name="score"
          autoComplete="off"
          label="Score"
          variant="outlined"
          error={formik.touched.score && Boolean(formik.errors.score)}
          helperText={formik.touched.score && formik.errors.score}
          value={formik.values.score}
          onChange={(e) => {
            // Custom validation is used to allow only numbers as
            // inputMode="numeric" is not recommended by Material UI: https://mui.com/material-ui/react-text-field/#type-quot-number-quot.
            if (/^[0-9]*$/.test(e.target.value)) {
              formik.handleChange(e);
            }
          }}
          onBlur={formik.handleBlur}
          sx={{ marginBottom: 1 }}
        />

        <TextField
          fullWidth
          className="field"
          id="comment"
          label="Comment"
          variant="outlined"
          minRows={3}
          multiline
          value={formik.values.comment}
          error={formik.touched.comment && Boolean(formik.errors.comment)}
          inputProps={{ maxLength: REVIEW_COMMENT_LENGTH }}
          helperText={formik.touched.comment && formik.errors.comment}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{ marginBottom: 1 }}
        />

        <SubmitButton {...formik} onButtonClick={() => formik.handleSubmit()} />
        <LoadingSpinner isLoading={formik.isSubmitting} />

        {!!error && <ErrorMessage sx={{ my: 2 }}>Review submission failed.</ErrorMessage>}
        <ResponseMessage {...formik} responseMessage={responseMessage} />
      </form>
    </ReviewFormWrapper>
  );
}
