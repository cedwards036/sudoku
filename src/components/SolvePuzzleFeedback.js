import React from 'react';
import '../styles/CreationPuzzleFeedback.css';

export default function CreationPuzzleFeedback(props) {
    let feedbackText;
    let feedbackClass;
    if (Object.keys(props.incorrectCells).length === 0) {
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