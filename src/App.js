import React, {useState, useEffect} from 'react';
import {useImmer} from 'use-immer';
import './App.css';
import SudokuBoard from './sudoku-board';
import {getCellClasses} from './cell-classes';

const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;

function Cell(props) {
  const borderClasses = getCellClasses({
    rowIndex: props.rowIndex, 
    colIndex: props.colIndex, 
    puzzleSize: props.puzzleSize
  });

  const selectedClass = props.cell.isSelected ? 'cell-selected' : '';

  function handleMouseDown(e) {
    props.handleSelection(props.rowIndex, props.colIndex, e);
    props.setIsSelecting(true);
  }

  function handleMouseEnter() {
    props.handleCellMouseEnter(props.rowIndex, props.colIndex);
  }

  function valueToString(value) {
    if (value === 0) {
      return '';
    } else {
      return value;
    }
  }

  return (
    <div 
      className={`cell ${borderClasses} ${selectedClass}`} 
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
    >
      <span className="cell-value">{valueToString(props.cell.value)}</span>
    </div>
  );
}

function Row(props) {
  return (
    <div className="row">
      {props.cells.map((cell, index) => 
        <Cell 
          key={index} 
          cell={cell}
          rowIndex={props.rowIndex} 
          colIndex={index} 
          puzzleSize={props.cells.length}
          handleSelection={props.handleSelection}
          handleCellMouseEnter={props.handleCellMouseEnter}
          setIsSelecting={props.setIsSelecting}
        />
      )}
    </div>
  )
}

function Grid(props) {
  return (
    <div className="grid">
      {props.board.mapRows((row, index) => 
        <Row 
          key={index} 
          cells={row} 
          rowIndex={index}
          handleSelection={props.handleSelection}
          handleCellMouseEnter={props.handleCellMouseEnter}
          setIsSelecting={props.setIsSelecting}
        />
      )}
    </div>
  )
}

function CreationPuzzleFeedback(props) {
  let feedbackText;
  let feedbackClass;
  if (props.solutionCount === 0) {
    feedbackText = 'This puzzle has no solution :(';
    feedbackClass = 'creation-puzzle-feedback-bad';
  } else if (props.solutionCount === 1) {
    feedbackText = 'This puzzle has exactly one solution :)';
    feedbackClass = 'creation-puzzle-feedback-good';
  } else {
    feedbackText = 'This puzzle has more than one solution :(';
    feedbackClass = 'creation-puzzle-feedback-bad';
  }
  return (
    <div className={`creation-puzzle-feedback ${feedbackClass}`}>
      {feedbackText}
    </div>
  )
}

function Game() {
  const [board, updateBoard] = useImmer(SudokuBoard.createEmpty());
  const [isSelecting, setIsSelecting] = useState(false);

  const stopSelecting = () => setIsSelecting(false);

  function startNewCellSelection(rowIndex, colIndex) {
    updateBoard(draft => {
      return draft.clearAllSelections().selectCell(rowIndex, colIndex);
    });
  }

  function addCellToSelection(rowIndex, colIndex) {
    updateBoard(draft => draft.selectCell(rowIndex, colIndex));
  }

  function updateSelectedValues(value) {
    updateBoard(draft => draft.updateSelectedValues(value));
  }

  function handleSelection(rowIndex, colIndex, e) {
    if (e.ctrlKey) {
      addCellToSelection(rowIndex, colIndex);
    } else {
      startNewCellSelection(rowIndex, colIndex);
    }
  }

  function handleCellMouseEnter(rowIndex, colIndex) {
    if (isSelecting && !board[rowIndex][colIndex].isSelected) {
      updateBoard(draft => draft.selectCell(rowIndex, colIndex));
    }
  }
  
  function handleKeyDown(e) {
    if (board.hasSelection) {
      const rowIndex = board.topSelectedRowIndex;
      const colIndex = board.topSelectedColIndex;
      if (isArrowKey(e.keyCode)) {
        handleArrowKeyDown(e, rowIndex, colIndex);
      } else if (isNumberKey(e.keyCode)) {
        handleNumberKeyDown(e);
      } else if (isBackspaceOrDelete(e.keyCode)) {
        handleCellDeletion();
      }
    }
  }

  function isArrowKey(keyCode) {
    return [LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW].includes(keyCode);
  }

  function handleArrowKeyDown(e, rowIndex, colIndex) {
    switch(e.keyCode) {
      case LEFT_ARROW:
        handleSelection(rowIndex, (colIndex + board.size- 1) % board.size, e);
        break;
      case UP_ARROW:
        handleSelection((rowIndex + board.size - 1) % board.size, colIndex, e);
        break;
      case RIGHT_ARROW:
        handleSelection(rowIndex, (colIndex + 1) % board.size, e);
        break;
      case DOWN_ARROW:
        handleSelection((rowIndex + 1) % board.size, colIndex, e);
        break;
      default:
        break;
    }
  }

  function isNumberKey(keyCode) {
    return (keyCode >= 49 && keyCode <= 57) || (keyCode >= 97 && keyCode <= 105);
  }

  function convertToNumber(keyCode) {
    if (keyCode >= 49 && keyCode <= 57) {
      return keyCode - 48;
    } else {
      return keyCode - 96;
    }
  }

  function handleNumberKeyDown(e) {
    updateSelectedValues(convertToNumber(e.keyCode));
  }

  function isBackspaceOrDelete(keyCode) {
    return keyCode === 8 || keyCode === 46;
  }

  function handleCellDeletion() {
    updateSelectedValues(0);
  }

  useEffect(() => {
    if (window) {
      window.addEventListener('mouseup', stopSelecting);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('mouseup', stopSelecting);
      window.removeEventListener('keydown', handleKeyDown);
    }
  });

  function getSolutionsCount() {
    return board.getSolutions().length;
  }

  return (
    <div className="game">
      <CreationPuzzleFeedback solutionCount={getSolutionsCount()}/>
      <Grid 
        board={board}
        handleSelection={handleSelection}
        handleCellMouseEnter={handleCellMouseEnter}
        setIsSelecting={setIsSelecting}
      />
    </div>
  )
}

function App() {
  return (
    <div className="App">
        <Game/>
    </div>
  );
}

export default App;
