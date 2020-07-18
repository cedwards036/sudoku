import React from 'react';
import './App.css';
import {getCellClasses} from './cell-classes';

function Cell(props) {
  const classes = getCellClasses({
    rowIndex: props.rowIndex, 
    colIndex: props.colIndex, 
    puzzleSize: props.puzzleSize
  });
  return (
    <div className={`cell ${classes}`}>
      {props.rowIndex} {props.colIndex}
    </div>
  );
}

function Row(props) {
  return (
    <div className="row">
      {props.cells.map((cell, index) => 
        <Cell 
          key={index} 
          rowIndex={props.rowIndex} 
          colIndex={index} 
          puzzleSize={props.cells.length}
        />
      )}
    </div>
  )
}

function Grid(props) {
  return (
    <div className="grid">
      {props.rows.map((row, index) => 
        <Row key={index} cells={row} rowIndex={index}/>
      )}
    </div>
  )
}

function Game() {
  const rows = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [0, 1, 2, 3, 4, 5, 6, 7, 8]
  ]
  return (
    <Grid rows={rows}/>
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
