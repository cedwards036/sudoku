import React from 'react';
import '../styles/PuzzleFeedback.css';

export default function SolvePuzzleFeedback(props) {
    let feedbackText;
    let feedbackClass;
    if (props.solutionCount === 0) {
      feedbackText = 'Warning: This puzzle has no solution :(';
      feedbackClass = 'puzzle-feedback-bad';
    } else if (props.solutionCount > 1) {
      feedbackText = 'Warning: This puzzle has more than one solution :(';
      feedbackClass = 'puzzle-feedback-bad';
    } else if (props.puzzleIsSolved) {
      feedbackText = 'Puzzle solved! :)';
      feedbackClass = 'puzzle-feedback-good';
    } else {
      feedbackText = 'Keep working on it!';
      feedbackClass = 'puzzle-feedback-neutral';
    }
    return (
      <div className={`puzzle-feedback ${feedbackClass}`}>
        {feedbackText}
      </div>
    )
  }