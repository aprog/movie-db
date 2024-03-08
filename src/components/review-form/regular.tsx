import TextField from "@mui/material/TextField";
import { FormArguments, REVIEW_COMMENT_LENGTH } from "./manager";
import { MovieReview } from "../../service";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";

/**
 * Regular Review Form.
 *
 * This variation is used on by default. In case of smaller screens Modal form is shown.
 */
export function RegularReviewForm(args: FormArguments) {
  const [reviewScore, setReviewScore] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [reviewResponse, setReviewResponse] = useState("");

  const [isScoreValid, setIsScoreValid] = useState(true);

  const isCommentValid = useMemo(() => {
    return reviewComment.length < REVIEW_COMMENT_LENGTH;
  }, [reviewComment, args.movie]);

  useEffect(() => {
    setIsScoreValid(true);

    // Reset the message once the user selected another movie.
    setReviewResponse("");
  }, [args.movie]);

  function submitReview(e: FormEvent) {
    e.preventDefault();

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

  return (
    <form onSubmit={submitReview} className="review-form">
      <p><strong>Review "{args.movie.title}"</strong></p>

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

      {/* Is it safe to use LoadingButton from "@mui/lab" in the production? */}
      <Button variant="contained" size="small" type="submit" disabled={!isCommentValid || isReviewSubmitting}>Submit</Button>
      {isReviewSubmitting && <CircularProgress size="1em" sx={{ marginLeft: 1, verticalAlign: "middle" }} />}

      {!isReviewSubmitting && reviewResponse && <p>{reviewResponse}</p>}
    </form>
  );
}