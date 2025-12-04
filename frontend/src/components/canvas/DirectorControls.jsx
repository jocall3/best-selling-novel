import React from 'react';
import { Button, TextField, Box } from '@mui/material';

const DirectorControls = ({ isGenerating, onPause, onComment, onFeedback }) => {
  const [comment, setComment] = React.useState('');
  const [feedback, setFeedback] = React.useState('');

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const submitComment = () => {
    if (comment.trim()) {
      onComment(comment);
      setComment('');
    }
  };

  const submitFeedback = () => {
    if (feedback.trim()) {
      onFeedback(feedback);
      setFeedback('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
      <Button
        variant="contained"
        color={isGenerating ? "secondary" : "primary"}
        onClick={onPause}
        disabled={!isGenerating}
      >
        {isGenerating ? 'Pause Generation' : 'Resume Generation'}
      </Button>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          label="Add Comment"
          variant="outlined"
          value={comment}
          onChange={handleCommentChange}
          fullWidth
        />
        <Button variant="contained" onClick={submitComment} disabled={!comment.trim()}>
          Submit Comment
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          label="Provide Feedback"
          variant="outlined"
          value={feedback}
          onChange={handleFeedbackChange}
          fullWidth
          multiline
          rows={2}
        />
        <Button variant="contained" onClick={submitFeedback} disabled={!feedback.trim()}>
          Submit Feedback
        </Button>
      </Box>
    </Box>
  );
};

export default DirectorControls;
