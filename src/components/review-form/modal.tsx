import TextField from "@mui/material/TextField";
import { FormArguments, REVIEW_COMMENT_LENGTH } from "./manager";
import { MovieReview } from "../../service";
import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

/**
 * Modal Review Form.
 *
 * This variation is used on smaller screens.
 */
export function ModalReviewForm(args: FormArguments) {
  const [reviewScore, setReviewScore] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [reviewResponse, setReviewResponse] = useState("");

  const [open, setOpen] = useState(true);
  const [isScoreValid, setIsScoreValid] = useState(true);

  const isCommentValid = useMemo(() => {
    return reviewComment.length < REVIEW_COMMENT_LENGTH;
  }, [reviewComment, args.movie]);

  function submitReview() {
    const scoreValid = reviewScore.length > 0 && !isNaN(parseFloat(reviewScore));
    setIsScoreValid(scoreValid);
    if (!scoreValid) {
      return;
    }

    const review = {
      score: parseFloat(reviewScore),
      comment: reviewComment
    } satisfies MovieReview;

    setIsReviewSubmitting(true);
    args.submitForm(review).then((response) => {
      setReviewResponse(response ?? "");

      // Reset the review.
      setReviewScore("");
      setReviewComment("");
    }).catch(() => {
      setReviewResponse("Failed to submit the review.");
    }).finally(() => {
      setIsReviewSubmitting(false);
    });
  }

  function handleClose() {
    setOpen(false);
  }

  function modalForm() {
    return (
      <form onSubmit={submitReview} className="review-form">
        <TextField
          fullWidth
          className="field"
          id="score"
          autoComplete="off"
          label="Score"
          variant="outlined"
          error={!isScoreValid}
          helperText={!isScoreValid ? "Score is not valid." : undefined}
          value={reviewScore}
          onChange={(e) => setReviewScore(e.target.value)}
        />

        <TextField
          fullWidth
          className="field"
          id="comment"
          label="Comment"
          variant="outlined"
          minRows={3}
          multiline
          value={reviewComment}
          error={!isCommentValid}
          inputProps={{ maxLength: REVIEW_COMMENT_LENGTH }}
          helperText={!isCommentValid ? `The comment should not exceed ${REVIEW_COMMENT_LENGTH} chars.` : undefined}
          onChange={(e) => setReviewComment(e.target.value)}
        />

        {!isReviewSubmitting && reviewResponse && <p>{reviewResponse}</p>}
      </form>
    );
  }

  return (
    <Dialog
      // Keep beautiful animation while the modal closes.
      onTransitionExited={() => args.closeForm()}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {args.movie.title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent dividers>
        {modalForm()}
      </DialogContent>

      <DialogActions>
        {isReviewSubmitting && <CircularProgress size="1em" />}
        {/* Is it safe to use LoadingButton from "@mui/lab" in production? */}
        <Button variant="contained" size="small" disabled={!isCommentValid || isReviewSubmitting} onClick={submitReview}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}