import React, {useState, useEffect} from 'react';
import {useImmer} from 'use-immer';
import './App.css';
import SudokuBoard from './sudoku-board';
import {getCellClasses} from './cell-classes';

function Cell(props) {
  const borderClasses = getCellClasses({
    rowIndex: props.rowIndex, 
    colIndex: props.colIndex, 
    puzzleSize: props.puzzleSize
  });

  const selectedClass = props.cell.isSelected ? 'cell-selected' : '';

  function onMouseDown(e) {
    if (e.ctrlKey) {
      props.addCellToSelection(props.rowIndex, props.colIndex);
    } else {
      props.startNewCellSelection(props.rowIndex, props.colIndex);
    }
    props.setIsSelecting(true);
  }

  function onMouseEnter() {
    props.handleCellMouseEnter(props.rowIndex, props.colIndex);
  }

  return (
    <div 
      className={`cell ${borderClasses} ${selectedClass}`} 
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
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
          addCellToSelection={props.addCellToSelection}
          handleCellMouseEnter={props.handleCellMouseEnter}
          startNewCellSelection={props.startNewCellSelection}
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
          addCellToSelection={props.addCellToSelection}
          handleCellMouseEnter={props.handleCellMouseEnter}
          startNewCellSelection={props.startNewCellSelection}
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
  
  useEffect(() => {
    if (window) {
      window.addEventListener('mouseup', stopSelecting);
    }
    return () => {
      window.removeEventListener('mouseup', stopSelecting);
    }
  });

  function startNewCellSelection(rowIndex, colIndex) {
    updateBoard(draft => {
      return draft.clearAllSelections().selectCell(rowIndex, colIndex);
    });
  }

  function addCellToSelection(rowIndex, colIndex) {
    updateBoard(draft => draft.selectCell(rowIndex, colIndex));
  }

  function handleCellMouseEnter(rowIndex, colIndex) {
    if (isSelecting && !board[rowIndex][colIndex].isSelected) {
      updateBoard(draft => draft.selectCell(rowIndex, colIndex));
    }
  }

  return (
    <Grid 
      board={board}
      addCellToSelection={addCellToSelection}
      handleCellMouseEnter={handleCellMouseEnter}
      startNewCellSelection={startNewCellSelection}
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
