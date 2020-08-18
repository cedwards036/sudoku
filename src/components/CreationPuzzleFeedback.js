import React from 'react';
import '../styles/PuzzleFeedback.css';

export default function CreationPuzzleFeedback(props) {
    let feedbackText;
    let feedbackClass;
    if (props.solutionCount === 0) {
      feedbackText = 'This puzzle has no solution :(';
      feedbackClass = 'puzzle-feedback-bad';
    } else if (props.solutionCount === 1) {
      feedbackText = 'This puzzle has exactly one solution :)';
      feedbackClass = 'puzzle-feedback-good';
    } else {
      feedbackText = 'This puzzle has more than one solution :(';
      feedbackClass = 'puzzle-feedback-bad';
    }
    return (
      <div className={`puzzle-feedback ${feedbackClass}`}>
        {feedbackText}
      </div>
    )
  }