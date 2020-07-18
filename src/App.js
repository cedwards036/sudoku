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

  return (
    <div 
      className={`cell ${borderClasses} ${selectedClass}`} 
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
    >
      <span className="cell-value">{props.cell.value}</span>
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
      }
    }
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

  return (
    <Grid 
      board={board}
      handleSelection={handleSelection}
      handleCellMouseEnter={handleCellMouseEnter}
      setIsSelecting={setIsSelecting}
    />
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
