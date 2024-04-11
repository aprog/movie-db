import TextField from "@mui/material/TextField";
import { FormProps, ModalFormFields, REVIEW_COMMENT_LENGTH, ResponseMessage, ReviewFormWrapper, SubmitButton, validationSchema } from ".";
import { MovieReview, useMovieReview } from "../../service";
import { useEffect, useRef, useState } from "react";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Formik, FormikProps } from "formik";
import { ErrorMessage } from "../../MainLayout";

interface ModalFormExtra {
  reset: () => void;
}

const ModalTitle = ({ title }: { title: string }) => {
  return (
    <DialogTitle sx={{ p: 2 }} id="customized-dialog-title">
      {title}
    </DialogTitle>
  );
}

const ModalCloseButton = ({ handleClose }: { handleClose: () => void }) => {
  return <IconButton
    aria-label="close"
    onClick={handleClose}
    sx={{
      position: "absolute",
      right: 8,
      top: 8,
      color: (theme) => theme.palette.grey[500],
    }}
  >
    <CloseIcon />
  </IconButton>
}

const ModalForm = ({ handleSubmit, touched, values, handleChange, handleBlur, errors, reset }: FormikProps<ModalFormFields> & ModalFormExtra) => {
  return (
    <ReviewFormWrapper>
      <form onSubmit={handleSubmit} onChange={reset}>
        <TextField
          fullWidth
          className="field"
          id="score"
          name="score"
          autoComplete="off"
          label="Score"
          variant="outlined"
          error={touched.score && Boolean(errors.score)}
          helperText={touched.score && errors.score}
          value={values.score}
          onChange={(e) => {
            if (/^[0-9]*$/.test(e.target.value)) {
              handleChange(e);
            }
          }}
          onBlur={handleBlur}
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
          value={values.comment}
          error={touched.comment && Boolean(errors.comment)}
          inputProps={{ maxLength: REVIEW_COMMENT_LENGTH }}
          helperText={touched.comment && errors.comment}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </form>
    </ReviewFormWrapper>
  );
}

/**
 * Modal Review Form.
 *
 * This variation is used on smaller screens.
 */
export function ModalReviewForm({ movie, closeForm }: FormProps) {
  const [open, setOpen] = useState(true);
  const { responseMessage, error, submitReview, reset } = useMovieReview();
  const formikRef = useRef<FormikProps<ModalFormFields>>(null);

  const initialValues = { score: "", comment: "" };
  const handleSubmit = async (values: ModalFormFields) => {
    const review = {
      id: movie.id,
      score: parseFloat(values.score),
      comment: values.comment
    } satisfies MovieReview;

    await submitReview(review);
  };

  // Reset the form while switching the movie.
  useEffect(() => {
    formikRef.current?.resetForm();
    reset();
  }, [movie]);

  // Keep form fields if submission failed.
  useEffect(() => {
    if (!error && responseMessage) {
      formikRef.current?.resetForm();
    }
  }, [error, responseMessage]);

  const handleCloseModal = () => {
    setOpen(false);
  }

  return (
    <Dialog
      // Keep beautiful animation while the modal closes.
      onTransitionExited={() => closeForm()}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <ModalTitle title={movie.title} />
      <ModalCloseButton handleClose={handleCloseModal} />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        innerRef={formikRef}
      >
        {(props) => (
          <>
            <DialogContent dividers>
              <ModalForm
                {...props}
                reset={reset}
              />

              <ResponseMessage {...props} responseMessage={responseMessage} isModal />
              {!!error && <ErrorMessage sx={{ marginTop: 2 }}>Review submission failed.</ErrorMessage>}
            </DialogContent>

            <DialogActions>
              {props.isSubmitting && <CircularProgress size="1em" />}
              <SubmitButton {...props} onButtonClick={() => props.handleSubmit()} />
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}
