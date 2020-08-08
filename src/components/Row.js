import React from 'react';
import Cell from './Cell.js';

export default function Row(props) {
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
            isIncorrect={props.incorrectCells.includes(index)}
          />
        )}
      </div>
    )
  }